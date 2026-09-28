import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

// Load taxonomy items
const taxonomyPath = path.join(process.cwd(), 'tools', 'taxonomy.json');
const allItems = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));

function slugify(text) {
  return text.toLowerCase()
    .replace(/\+/g, '-plus-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const SEGMENT_DIR_MAP = {
  'Collectible Design': '01-collectible-design',
  'Memory Art': '02-memory-art',
  'Personal Art & Gifting': '03-personal-art-gifting',
  'Digital + Material Art': '04-digital-material-art',
  'Bespoke Studio': '05-bespoke-studio',
};

function buildSearchQuery(item) {
  const prod = item.product.toLowerCase();
  const cat = item.category.toLowerCase();
  const seg = item.segment.toLowerCase();

  // If already includes 'resin' or 'epoxy', use natural query
  if (prod.includes('resin') || prod.includes('epoxy')) {
    return `${item.product} modern luxury design`;
  }

  // Segment specific phrasing
  if (seg.includes('memory') || cat.includes('preservation') || cat.includes('keepsake')) {
    return `${item.product} resin preservation aesthetic`;
  }
  if (seg.includes('digital') || cat.includes('3d')) {
    return `${item.product} resin 3d design`;
  }
  if (cat.includes('seating') || cat.includes('tables') || cat.includes('storage') || cat.includes('lighting')) {
    return `${item.product} epoxy resin luxury furniture`;
  }

  return `${item.product} epoxy resin design`;
}

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://www.pinterest.com/',
      },
    });

    if (!res.ok) return false;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) return false;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 15000) return false;

    fs.writeFileSync(destPath, buffer);
    return buffer.length;
  } catch {
    return false;
  }
}

async function runBatch() {
  const args = process.argv.slice(2);
  const targetPerProduct = parseInt(args.find(a => a.startsWith('--target='))?.split('=')[1] || '10', 10);
  const filterSegment = args.find(a => a.startsWith('--segment='))?.split('=')[1] || null;
  const filterCategory = args.find(a => a.startsWith('--category='))?.split('=')[1] || null;
  const startIndex = parseInt(args.find(a => a.startsWith('--start='))?.split('=')[1] || '0', 10);
  const limitCount = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || String(allItems.length), 10);

  let filtered = allItems;
  if (filterSegment) {
    filtered = filtered.filter(i => i.segment.toLowerCase().includes(filterSegment.toLowerCase()));
  }
  if (filterCategory) {
    filtered = filtered.filter(i => i.category.toLowerCase().includes(filterCategory.toLowerCase()));
  }

  const batch = filtered.slice(startIndex, startIndex + limitCount);

  console.log(`\n======================================================`);
  console.log(`RivyaLivingArt Taxonomy Pinterest Inspiration Downloader`);
  console.log(`Total Products in Batch: ${batch.length} (from index ${startIndex})`);
  console.log(`Target Images Per Product: ${targetPerProduct}`);
  console.log(`Target Directory: local-inspiration/`);
  console.log(`======================================================\n`);

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  let totalSavedSession = 0;

  for (let idx = 0; idx < batch.length; idx++) {
    const item = batch[idx];
    const segDir = SEGMENT_DIR_MAP[item.segment] || slugify(item.segment);
    const catDir = slugify(item.category);
    const prodDir = slugify(item.product);

    const folderPath = path.join(process.cwd(), 'local-inspiration', segDir, catDir, prodDir);
    fs.mkdirSync(folderPath, { recursive: true });

    const existingImages = fs.readdirSync(folderPath).filter(f => f.startsWith('img-') && f.endsWith('.jpg'));
    if (existingImages.length >= targetPerProduct) {
      console.log(`[${idx + 1}/${batch.length}] SKIP (Already complete: ${existingImages.length}/${targetPerProduct}): ${item.product}`);
      continue;
    }

    const query = buildSearchQuery(item);
    console.log(`\n[${idx + 1}/${batch.length}] Product: ${item.product} (${item.category} · ${item.segment})`);
    console.log(`  Folder: local-inspiration/${segDir}/${catDir}/${prodDir}/`);
    console.log(`  Query:  "${query}"`);

    let currentCount = existingImages.length;
    const seenHashes = new Set();
    const metaPath = path.join(folderPath, 'meta.json');
    let meta = {
      product: item.product,
      category: item.category,
      segment: item.segment,
      query,
      images: [],
    };
    if (fs.existsSync(metaPath)) {
      try {
        meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        meta.images.forEach(img => seenHashes.add(img.hash));
      } catch {}
    }

    try {
      const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Dismiss any popups if present
      await page.keyboard.press('Escape');

      const collectedUrls = new Set();
      for (let scroll = 0; scroll < 4; scroll++) {
        const found = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('img'))
            .map(img => img.src)
            .filter(src => src && src.includes('pinimg.com') && (src.includes('/236x/') || src.includes('/474x/') || src.includes('/736x/')));
        });

        found.forEach(u => collectedUrls.add(u));
        if (collectedUrls.size >= targetPerProduct * 2) break;

        await page.evaluate(() => window.scrollBy(0, 1600));
        await page.waitForTimeout(1400);
      }

      console.log(`  Pins found on Pinterest: ${collectedUrls.size}`);

      for (const rawUrl of collectedUrls) {
        if (currentCount >= targetPerProduct) break;

        const match = rawUrl.match(/([a-f0-9]{32})/i);
        const hash = match ? match[1] : null;
        if (!hash || seenHashes.has(hash)) continue;

        seenHashes.add(hash);
        const highResUrl = rawUrl.replace(/\/236x\/|\/474x\//, '/736x/');
        const fileNumber = String(currentCount + 1).padStart(3, '0');
        const fileName = `img-${fileNumber}.jpg`;
        const destFile = path.join(folderPath, fileName);

        const bytes = await downloadImage(highResUrl, destFile);
        if (bytes) {
          currentCount++;
          totalSavedSession++;
          const kb = (bytes / 1024).toFixed(1);
          console.log(`    + Saved [${currentCount}/${targetPerProduct}] ${fileName} (${kb} KB)`);
          meta.images.push({
            id: fileName,
            hash,
            highResUrl,
            bytes,
            savedAt: new Date().toISOString(),
          });
        }
      }

      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

      // Polite randomized delay between products
      const delayMs = 1500 + Math.floor(Math.random() * 1000);
      await page.waitForTimeout(delayMs);

    } catch (err) {
      console.warn(`  Warning while processing ${item.product}:`, err.message);
    }
  }

  await browser.close();
  console.log(`\n======================================================`);
  console.log(`Batch Complete! Total Images Downloaded This Session: ${totalSavedSession}`);
  console.log(`======================================================\n`);
}

runBatch().catch(err => {
  console.error('Fatal batch error:', err);
  process.exit(1);
});

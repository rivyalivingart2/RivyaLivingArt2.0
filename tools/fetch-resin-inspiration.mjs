import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const SEGMENTS = [
  {
    id: '01-furniture-spatial',
    name: 'Furniture & Spatial Art',
    prefix: 'furniture',
    target: 100,
    queries: [
      'luxury epoxy resin dining table live edge',
      'modern wood resin coffee table aesthetic',
      'resin console table entryway luxury',
      'live edge resin bench modern interior',
      'illuminated epoxy resin wall art panel luxury',
      'architectural resin partition screen modern',
      'monolithic resin table furniture design',
      'abstract resin timber wall sculpture',
      'epoxy resin conference table river design',
      'luxury resin side table timber pedestal',
      'walnut wood and clear epoxy river desk',
      'epoxy resin monolithic stool modern',
    ],
  },
  {
    id: '02-memory-preservation',
    name: 'Memory Art & Flower Preservation',
    prefix: 'memory',
    target: 100,
    queries: [
      'wedding bouquet preservation resin block aesthetic',
      'preserved flower resin wall clock luxury',
      'wedding flower preservation arch resin',
      'resin varmala preservation platter tray',
      'wedding invitation keepsake resin block',
      'botanical resin nameplate entrance luxury',
      'baby keepsake preservation resin block',
      'floral preservation resin bookends',
      'flower preservation resin sphere dome',
      'memorial flower resin paperweight botanical',
      'preserved rose resin table decor',
      'wedding bouquet resin tray handles gold',
    ],
  },
  {
    id: '03-personal-gifts',
    name: 'Personal Art & Luxury Gifts',
    prefix: 'gift',
    target: 100,
    queries: [
      'luxury epoxy resin coasters wood gold edge',
      'resin charcuterie board live edge cheese platter',
      'minimalist resin ring dish botanical aesthetic',
      'luxury resin desk accessories bookends organizer',
      'pressed flower resin bookmark luxury gift',
      'botanical resin jewelry pendant necklace handmade',
      'amber resin incense holder modern luxury',
      'resin tea light candle holder botanical',
      'custom resin letter keychain luxury gift',
      'epoxy resin trinket dish marble effect',
      'resin wine bottle holder wood modern',
      'resin pen holder desk organizer luxury',
    ],
  },
];

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
    if (buffer.length < 15000) return false; // Skip low-quality thumbnails or placeholders

    fs.writeFileSync(destPath, buffer);
    return buffer.length;
  } catch {
    return false;
  }
}

async function scrapeSegment(context, segment, baseDir) {
  console.log(`\n======================================================`);
  console.log(`Starting Segment: ${segment.name} (${segment.id})`);
  console.log(`Target: ${segment.target} high-resolution images`);
  console.log(`======================================================\n`);

  const segmentDir = path.join(baseDir, segment.id);
  fs.mkdirSync(segmentDir, { recursive: true });

  const existingFiles = fs.readdirSync(segmentDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'));
  let savedCount = existingFiles.length;
  console.log(`Already present in folder: ${savedCount} images`);

  const seenHashes = new Set();
  const manifestPath = path.join(segmentDir, 'manifest.json');
  let manifest = [];
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      manifest.forEach(item => seenHashes.add(item.hash));
    } catch {}
  }

  const page = await context.newPage();

  for (const query of segment.queries) {
    if (savedCount >= segment.target) {
      console.log(`\nTarget reached for ${segment.name}! (${savedCount}/${segment.target})`);
      break;
    }

    console.log(`\n[Search Query] "${query}" (Current total: ${savedCount}/${segment.target})`);
    const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;

    try {
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
      await page.waitForTimeout(2500);

      // Scroll a few times to load pins
      const queryCandidates = new Set();
      for (let s = 0; s < 4; s++) {
        const found = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('img'))
            .map(img => img.src)
            .filter(src => src && src.includes('pinimg.com') && (src.includes('/236x/') || src.includes('/474x/') || src.includes('/736x/')));
        });

        found.forEach(url => queryCandidates.add(url));
        await page.evaluate(() => window.scrollBy(0, 1800));
        await page.waitForTimeout(1600);
      }

      console.log(`  Found ${queryCandidates.size} candidate pins on page.`);

      for (const rawUrl of queryCandidates) {
        if (savedCount >= segment.target) break;

        // Extract hash from URL: e.g., https://i.pinimg.com/236x/4e/09/73/4e097388379f0e2d7ccb1cbaae2b0c62.jpg
        const match = rawUrl.match(/([a-f0-9]{32})/i);
        const hash = match ? match[1] : null;
        if (!hash || seenHashes.has(hash)) continue;

        seenHashes.add(hash);

        // Transform to 736x high-res
        const highResUrl = rawUrl.replace(/\/236x\/|\/474x\//, '/736x/');
        const fileNumber = String(savedCount + 1).padStart(3, '0');
        const filename = `${segment.prefix}-${fileNumber}.jpg`;
        const destPath = path.join(segmentDir, filename);

        const bytes = await downloadImage(highResUrl, destPath);
        if (bytes) {
          savedCount++;
          const kb = (bytes / 1024).toFixed(1);
          console.log(`  + Saved [${savedCount}/${segment.target}] ${filename} (${kb} KB)`);
          manifest.push({
            id: filename,
            hash,
            query,
            originalUrl: highResUrl,
            bytes,
            savedAt: new Date().toISOString(),
          });
        }
      }

      // Save manifest after each query
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    } catch (err) {
      console.warn(`  Warning while scraping query "${query}":`, err.message);
    }
  }

  await page.close();
  console.log(`\n[Completed] ${segment.name}: ${savedCount} high-res images saved.`);
}

async function main() {
  const baseDir = path.join(process.cwd(), 'local-inspiration');
  fs.mkdirSync(baseDir, { recursive: true });

  console.log('Launching browser (channel: chrome)...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
  });

  for (const segment of SEGMENTS) {
    await scrapeSegment(context, segment, baseDir);
  }

  await browser.close();
  console.log('\n======================================================');
  console.log('ALL SEGMENTS COMPLETE! Total inspiration images downloaded.');
  console.log(`Directory: ${baseDir}`);
  console.log('======================================================\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const source=JSON.parse(readFileSync('test-results/final-acceptance/editorial-acceptance-read.json','utf8'));
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uses=[];
for(const record of source.records){
 const add=(slot,image)=>{if(image?.path)uses.push({record:record.id,title:record.title,route:record.route,slot,...image});};
 add('cover',record.images.cover);
 for(const s of record.images.sections)add(s.id,s);
 add('home hero',record.images.home?.hero);
 for(const s of record.images.home?.sections||[]){add(s.id,s.image);for(const item of s.items||[])add(s.id+'/'+item.id,item.image);}
}
const rows=source.media.map(media=>({...media,uses:uses.filter(u=>u.path===media.path),productNames:source.products.filter(p=>p.image===media.path||p.scene===media.path||p.gallery?.some(g=>g.src===media.path)).map(p=>p.name)}));
const folder=resolve('../../../outputs/CRAFT');mkdirSync(folder,{recursive:true});
const image=(r,ratio)=>{const path=r.path.startsWith('/editorial/')?'https://www.rivyalivingart.com/_next/image?url='+encodeURIComponent(r.path)+'&w=640&q=75':'https://www.rivyalivingart.com'+r.path;return `<img src="${escape(path)}" alt="${escape(r.alt)}" style="aspect-ratio:${ratio};object-position:${r.x||50}% ${r.y||50}%" loading="lazy">`;};
const pages=Math.ceil(rows.length/8);
for(let page=0;page<pages;page++){
 const cards=rows.slice(page*8,page*8+8).map((r,i)=>`<article><h2>${page*8+i+1}. ${escape(r.alt)}</h2><div class="crops"><figure>${image(r,'3/4')}<figcaption>Portrait card candidate · 3:4</figcaption></figure><figure>${image(r,'16/10')}<figcaption>Wide cover candidate · 16:10</figcaption></figure></div><p>${escape(r.path)}</p><p>Focal point: ${r.x||50}% / ${r.y||50}%</p><p>Protected catalogue use: ${escape(r.productNames.join(', ')||'None')}</p><details><summary>${r.uses.length} editorial assignments</summary>${r.uses.map(u=>`<p>${escape(u.record)} · ${escape(u.slot)} · ${escape(u.title)}</p>`).join('')}</details></article>`).join('');
 const nav=Array.from({length:pages},(_,i)=>`<a href="crop-review-${i+1}.html" ${page===i?'aria-current="page"':''}>${i+1}</a>`).join(' ');
 writeFileSync(resolve(folder,`crop-review-${page+1}.html`),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Image review ${page+1}/${pages}</title><style>body{margin:24px;background:#101719;color:#eee;font:15px system-ui}h1{font-size:26px}nav{display:flex;gap:8px;flex-wrap:wrap}a{color:#e5bc76;padding:6px}a[aria-current]{background:#384442}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}article{border:1px solid #596568;padding:12px}h2{font-size:13px;height:36px}article>p{display:none}p{font-size:11px;overflow-wrap:anywhere}.crops{display:grid;grid-template-columns:1fr 1fr;gap:8px}figure{margin:0}img{width:100%;object-fit:cover;background:#2f3737}figcaption{font-size:11px}@media(max-width:800px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}</style><h1>Production media crop review · ${page+1}/${pages}</h1><p>Current public metadata read ${escape(source.at)}. Candidate crop comparison, not a claim that every layout uses these ratios. Original associations stay protected. Editorial desktop/mobile overrides require separate review. Human owner sign-off: not performed.</p><nav>${nav}</nav><main class="grid">${cards}</main></html>`);
}
writeFileSync('docs/editorial-translations/image-review-inventory.json',JSON.stringify({at:source.at,status:'VISUAL REVIEW IN PROGRESS; OWNER SIGN-OFF NOT PERFORMED',scope:'136 public assets, 120 protected product records, all editorial assignments. Candidate crop sheet plus actual layout spot checks.',media:rows},null,2)+'\n');
console.log(JSON.stringify({media:rows.length,assignments:uses.length,sheets:pages,folder}));

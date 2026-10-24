/* Browser-only private review. This page cannot publish, assign or mutate Studio data. */
const $ = id => document.getElementById(id);
const node = (tag, text, className) => { const el = document.createElement(tag); if (text) el.textContent = text; if (className) el.className = className; return el; };
const labels = {'fidelity-review':'Fidelity review','personal-photo':'Personal photograph','lettering':'Personal lettering','watermark':'Creator mark present','cropped':'Cropped / detail source','unfinished':'Work in progress','collage':'Collage','event':'Event context','low-resolution':'Limited source detail'};
let data, page = 0;
const pageSize = 12;
function link(path, label) { const a = node('a', label); a.href = '/' + path; a.download = ''; return a; }
function picture(path, alt) { const img = node('img'); img.src = '/' + path; img.alt = alt; img.loading = 'lazy'; img.decoding = 'async'; return img; }
function render() {
  const query = $('search').value.trim().toLowerCase(), category = $('category').value, flag = $('flag').value;
  const rows = data.images.filter(r => (!query || (String(r.index).padStart(3,'0')+' '+r.category).toLowerCase().includes(query)) && (!category || r.category === category) && (!flag || r.flags.includes(flag)));
  const pages = Math.max(1, Math.ceil(rows.length / pageSize)); page = Math.min(page, pages - 1);
  $('grid').replaceChildren();
  for (const r of rows.slice(page * pageSize, (page + 1) * pageSize)) {
    const card = node('article', '', 'card'); card.append(node('h2', 'Image ' + String(r.index).padStart(3,'0') + ' · ' + r.category));
    const img = picture(r.edited, 'Edited '+r.category+' presentation, image '+r.index); img.className = 'product'; card.append(img);
    card.append(node('p', '1600 × 2000 · 4:5 · Private candidate', 'meta'));
    const tags = node('div'); for (const f of r.flags) tags.append(node('span', labels[f] || f, 'badge')); card.append(tags);
    const detail = node('details'), summary = node('summary', 'Compare with source photograph'), pair = node('div', '', 'pair');
    for (const [path, caption] of [[r.source,'Source photograph · display copy'],[r.edited,'AI-edited presentation']]) { const figure=node('figure'); figure.append(picture(path,caption),node('figcaption',caption)); pair.append(figure); }
    detail.append(summary,pair); card.append(detail);
    const links=node('div','','links'); links.append(link(r.jpeg,'Download JPEG'),link(r.webp,'Download WebP')); card.append(links); $('grid').append(card);
  }
  $('state').textContent = rows.length ? rows.length+' matching images · showing '+(page*pageSize+1)+'–'+Math.min(rows.length,(page+1)*pageSize) : 'No images match these filters.';
  $('pages').textContent='Page '+(page+1)+' of '+pages; $('prev').disabled=page===0; $('next').disabled=page===pages-1;
}
$('filters').addEventListener('submit',e=>e.preventDefault());
for(const id of ['search','category','flag']) $(id).addEventListener('input',()=>{page=0;render();});
$('filters').addEventListener('reset',()=>{setTimeout(()=>{page=0;render();},0);});
for(const [id,change] of [['prev',-1],['next',1]]) $(id).addEventListener('click',()=>{page+=change;render();$('state').scrollIntoView({block:'start'});});
fetch('/gallery.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(result=>{
  data=result; $('intro').textContent=data.prepared+' edited candidates from '+data.total+' supplied still images. Deep ocean, obsidian and champagne backgrounds. Every export uses the Studio’s portrait 4:5 format, with JPEG and WebP downloads.'+(data.missing.length?' '+data.missing.length+' edits remain pending.':'');
  for(const category of [...new Set(data.images.map(r=>r.category))].sort()) { const opt=node('option',category);opt.value=category;$('category').append(opt); }
  for(const flag of [...new Set(data.images.flatMap(r=>r.flags))].sort()) { const opt=node('option',labels[flag]||flag);opt.value=flag;$('flag').append(opt); }
  data.archives.forEach((a,i)=>{const item=link(a.path,'Image pack '+(i+1)+' · '+a.images+' images');item.className='download';$('downloads').append(item);});render();
}).catch(()=>{$('intro').textContent='The collection manifest could not be loaded. Run the local preparation command, then reload.';});

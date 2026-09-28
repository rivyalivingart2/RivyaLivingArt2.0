const fs = require('fs');

// We'll just read reviewed-journal and simulate the logic from content-model.ts

const journal = JSON.parse(fs.readFileSync('src/lib/reviewed-journal.json', 'utf-8'));
const DB037 = journal.find(x => x.id === 'DB037');

const route = '/journal/' + DB037.slug;
const d = {
  id: DB037.id,
  kind: 'article',
  route: route,
  title: DB037.title,
  eyebrow: DB037.category,
  description: DB037.intro,
  sections: DB037.sections,
  image: DB037.image,
  imageAlt: DB037.imageAlt,
  relatedProductIds: DB037.relatedProductIds
};

function cleanText(text, max) {
  if (typeof text !== 'string') { console.log('cleanText failed: not string', text); return false; }
  if (text.length > max) { console.log('cleanText failed: length', text.length, max); return false; }
  if (!text.trim()) { console.log('cleanText failed: empty text'); return false; }
  return true;
}

if(!cleanText(d.id,100)||!['page','article'].includes(d.kind)||!cleanText(d.title,120)||!cleanText(d.eyebrow,100)||!cleanText(d.description,300)||!Array.isArray(d.sections)||d.sections.length<1||d.sections.length>20) console.log("Failed line 1");
if(!cleanText(d.route,240)||!/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(d.route)) console.log("Failed line 2");
if(d.kind==='article'&&(!/^\/journal\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.route))) console.log("Failed line 3");

// if(d.image&&!approvedPublicMedia.some(m=>m.path===d.image))return false;
if(d.image&&(!cleanText(d.imageAlt,180)||d.image.includes('..'))) console.log("Failed line 4");

for(const s of d.sections){
    if(!s||!/^[-a-z0-9]{1,80}$/.test(s.id)) console.log("Section ID failed", s.id);
    if(!cleanText(s.heading,150)) console.log("Section heading failed", s.heading);
    if(!Array.isArray(s.paragraphs)||s.paragraphs.length>12||s.paragraphs.some(p=>!cleanText(p,2500))) console.log("Section paragraph failed");
}

console.log("Done checking");

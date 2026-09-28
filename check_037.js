import { baselineContent } from './src/lib/content-model.ts';
import { approvedPublicMedia } from './src/lib/public-media.ts';
import { baselineProducts } from './src/lib/shop-model.ts';
import { articleAliases } from './src/lib/content-model.ts';

const db037 = baselineContent.find(c => c.id === 'DB037');
const d = db037;
const base = d;

const cleanText=(v,max,required=true)=>typeof v==='string'&&v.length<=max&&(!required||!!v.trim())&&!/[<>]/.test(v);

console.log("Check 1:", !cleanText(d.id,100)||!['page','article'].includes(d.kind)||!cleanText(d.title,120)||!cleanText(d.eyebrow,100)||!cleanText(d.description,300)||!Array.isArray(d.sections)||d.sections.length<1||d.sections.length>20);
console.log("Check 2:", base&&(d.id!==base.id||d.route!==base.route||d.kind!==base.kind));
console.log("Check 3:", !cleanText(d.route,240)||!/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(d.route));
console.log("Check 4:", d.kind==='article'&&(!/^\/journal\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.route)||Object.hasOwn(articleAliases,d.route.slice('/journal/'.length))));
console.log("Check 5:", !base&&(d.kind!=='article'||!/^article:[0-9a-f-]{36}$/.test(d.id)));
console.log("Check 6:", d.image&&!approvedPublicMedia.some(m=>m.path===d.image));
console.log("Check 7:", d.relatedProductIds&&(!Array.isArray(d.relatedProductIds)||d.relatedProductIds.length>6||new Set(d.relatedProductIds).size!==d.relatedProductIds.length||d.relatedProductIds.some(id=>!baselineProducts.some(p=>p.id===id))));
console.log("Check 8:", d.image&&(!cleanText(d.imageAlt,180)||d.image.includes('..')));

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {baselineProducts} from '../src/lib/shop-model';
const destination=path.resolve(process.argv[2]||'test-results/media-review');
fs.mkdirSync(destination,{recursive:true});
const xml=(v:string)=>v.replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));
for(let start=0;start<baselineProducts.length;start+=12){
 const batch=baselineProducts.slice(start,start+12),tiles=[];
 for(let n=0;n<batch.length;n++){
  const p=batch[n],left=n%3*300,top=Math.floor(n/3)*365;
  tiles.push({input:await sharp(path.join(process.cwd(),'public',p.image)).resize(280,320,{fit:'contain',background:'#e8e4dc'}).toBuffer(),left:left+10,top});
  tiles.push({input:Buffer.from(`<svg width="300" height="45"><rect width="300" height="45" fill="#f4efe7"/><text x="10" y="19" font-size="13" font-family="Arial" fill="#15251c">${xml(p.id+' · '+p.name)}</text><text x="10" y="37" font-size="11" font-family="Arial" fill="#15251c">${xml(p.subtitle.slice(0,43))}</text></svg>`),left,top:top+320});
 }
 await sharp({create:{width:900,height:1460,channels:3,background:'#f4efe7'}}).composite(tiles).png().toFile(path.join(destination,`products-${String(start/12+1).padStart(2,'0')}.png`));
}
fs.writeFileSync(path.join(destination,'index.json'),JSON.stringify(baselineProducts.map(p=>({id:p.id,name:p.name,subtitle:p.subtitle,image:p.image})),null,2));
console.log('Created 10 inspection sheets from current product associations; original assets unchanged.');

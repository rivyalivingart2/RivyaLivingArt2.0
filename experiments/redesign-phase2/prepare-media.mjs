import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
const root=process.cwd(), dir=resolve(root,'experiments/redesign-phase2/media'), originals=resolve(root,'output/phase2-media/originals');
await mkdir(dir,{recursive:true});
const seeds=[
 ['hero-pour','17rLJSM6v8z_MqArs8lyksy1hpN8ljfru','Material study','Resin pour in warm light',[50,50],[54,50],'hero / material feature'],
 ['maker-hands','1VK6Y7T8LDJi5eEGFBFjXg26VNNVGYyVh','Making study','Visual study of a person polishing a blue and gold resin bowl',[50,50],[50,50],'craft / Journal'],
 ['doorway-memory','19KOc4hLTXevHis-A0b_8gtedAgsmWRoC','Memory study','Red and ivory flowers encased in a clear resin block',[50,50],[50,50],'memory doorway'],
 ['texture-resin-flow','1RNN4QxbJXw9VsRrb9x3EMZ9Rtzkqfmxf','Flow study','Close view of resin surface and flowing colour',[50,50],[50,50],'material detail'],
 ['doorway-collectible','1o5VSIpFgnyn4Obrfh3Bowhm4-bsxz1Mj','Collectible study','Live-edge dining table with a blue resin channel in a dark interior',[50,50],[50,50],'collectible doorway'],
 ['doorway-gifts','1woyD_wMKVigC6rp2Vky9sCojxyHAKmM-','Gift study','Blue and gold resin jewellery arranged on a dark surface',[50,50],[50,50],'gift doorway'],
];
const assets=[];
for(const [id,driveId,title,alt,desktop,mobile,slot] of seeds){
 const input=await readFile(resolve(originals,`${id}.jpg`)),meta=await sharp(input).metadata();
 const variants=[];
 for(const width of [...new Set([Math.min(640,meta.width),Math.min(960,meta.width),Math.min(1440,meta.width)])]){
  for(const format of ['avif','webp']){
   const bytes=await sharp(input).rotate().resize({width,withoutEnlargement:true}).toFormat(format,{quality:format==='avif'?52:78}).toBuffer();
   const filename=`${id}-${width}.${format}`; await writeFile(resolve(dir,filename),bytes);
   variants.push({src:`/media/${filename}`,width,format,bytes:bytes.length});
  }
 }
 assets.push({id,driveId,title,alt,width:meta.width,height:meta.height,sourceBytes:input.length,sha256:createHash('sha256').update(input).digest('hex'),desktop,mobile,slot,variants,sourceUrl:`https://drive.google.com/file/d/${driveId}/view`,classification:'Supplied visualization; not evidence of a customer or completed project',rights:'Owner-supplied preview selection; source-specific creator/permission evidence not established by this download',studioId:null,status:'Local preview only; existing Studio associations untouched'});
}
await writeFile(resolve(root,'experiments/redesign-phase2/media-manifest.json'),JSON.stringify(assets,null,2)+'\n');
const thumbs=await Promise.all(assets.map(async(a,i)=>({input:await sharp(resolve(originals,`${a.id}.jpg`)).resize(400,260,{fit:'contain',background:'#f4f1e9'}).toBuffer(),left:(i%3)*400,top:Math.floor(i/3)*260})));
await sharp({create:{width:1200,height:520,channels:3,background:'#f4f1e9'}}).composite(thumbs).jpeg({quality:85}).toFile(resolve(root,'output/phase2-media/contact-sheet.jpg'));
console.log(JSON.stringify(assets.map(({id,width,height,sourceBytes,variants})=>({id,width,height,sourceBytes,variants:variants.map(v=>v.bytes)})),null,2));

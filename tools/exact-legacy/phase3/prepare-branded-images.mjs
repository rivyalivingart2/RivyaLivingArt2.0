/** Resize inspected AI edits only; preserve the untouched owner originals and generation masters. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import sharp from 'sharp';
import {zipSync,strToU8} from 'fflate';
import {digest} from '../../../src/lib/editorial-media-processing.ts';
const root=resolve('test-results/exact-legacy-2026-10-21/phase3-implementation');
const input=JSON.parse(readFileSync(resolve(root,'branded-input-private.json'),'utf8'));
const preparation=JSON.parse(readFileSync(resolve(root,'preparation-input-private.json'),'utf8'));
const save=(path,bytes)=>{mkdirSync(dirname(path),{recursive:true});if(existsSync(path))assert.equal(digest(readFileSync(path)),digest(bytes));else writeFileSync(path,bytes,{flag:'wx'});};
assert.equal(input.records.length,6);
const exports=[],zip={},prompts=[];
for(const item of input.records){
 const n=item.creation,stem='owner-creation-'+String(n).padStart(2,'0')+'-ocean',original=preparation.records.find(r=>r.index===n);assert.ok(original&&!original.parentPath);
 const master=readFileSync(item.generatedPath),meta=await sharp(master).metadata();
 assert.ok(Math.abs(meta.width/meta.height-.8)<.01,'Generation must already have portrait 4:5 composition');
 save(resolve(root,'branded/masters/'+stem+'.png'),master);
 // One-pixel rounding crop at most; no product cutout, painting or synthetic background in this export step.
 const standardized=await sharp(master).resize(1600,2000,{fit:'cover',position:'centre'}).png().toBuffer();
 const path='edited/'+stem+'-1600x2000.png';save(resolve(root,path),standardized);
 const sizes=[];
 for(const width of [640,960,1600]){
  const height=width*5/4;let output=await sharp(standardized).resize(width,height).webp({quality:82}).toBuffer();
  for(const quality of [76,68,60]){if(output.length<=600000)break;output=await sharp(standardized).resize(width,height).webp({quality}).toBuffer();}
  assert.ok(output.length<=600000);const filename=stem+'-'+width+'x'+height+'.webp';save(resolve(root,'product-image-pack/'+filename),output);zip[filename]=new Uint8Array(output);sizes.push({filename,width,height,bytes:output.length,sha256:digest(output)});
 }
 const jpg=await sharp(standardized).jpeg({quality:92,mozjpeg:true}).toBuffer(),filename=stem+'-1600x2000.jpg';save(resolve(root,'product-image-pack/'+filename),jpg);zip[filename]=new Uint8Array(jpg);
 const record={...original,index:8+n,filename:stem+'-1600x2000.png',path,parentPath:original.path,classification:'design-visualization',description:'AI edited presentation of the supplied owner creation with deep ocean, obsidian and champagne background; original photograph preserved. Uniform 1600 x 2000 (4:5). Private, unassigned; personalised details and source permissions require owner review.',generationMasterSha256:digest(master),selectedBranded:true};
 const existing=preparation.records.find(r=>r.index===record.index);if(existing)assert.deepEqual(existing,record);else preparation.records.push(record);
 exports.push({creation:n,originalSha256:digest(readFileSync(resolve(root,original.path))),masterSha256:digest(master),standardizedSha256:digest(standardized),width:1600,height:2000,jpegBytes:jpg.length,sourceResolution:{width:meta.width,height:meta.height},exportResampled:true,variants:sizes,review:'Private edited candidate; not a documentary photograph or permission record'});
 prompts.push({creation:n,tool:input.tool,prompt:item.prompt});
}
const readme='Rivya owner creation images — ocean palette\n\nSix AI-edited presentation candidates from six selected owner photographs. Each JPEG is 1600 x 2000, portrait 4:5. WebP variants are 1600 x 2000, 960 x 1200 and 640 x 800. The generated masters are approximately 1122 x 1402 and were resampled for consistent delivery; export size does not imply native detail. Palette: #080a0e, #08283a, #164e6b, #b89b63, #f4f1e9.\n\nAll originals and generated masters remain separate. AI may change faces, lettering or small handcrafted details; compare with the originals before business publication. Creation 6 has an occluded/cropped source, so reconstructed areas are visualization only. No product records, assignments, reviews or customer identities were created. No cloud publication.\n';
zip['README.txt']=strToU8(readme);zip['prompts.json']=strToU8(JSON.stringify(prompts,null,2));
writeFileSync(resolve(root,'product-image-pack/README.txt'),readme);writeFileSync(resolve(root,'product-image-pack/prompts.json'),JSON.stringify(prompts,null,2));
writeFileSync(resolve(root,'rivya-ocean-product-images.zip'),zipSync(zip,{level:0}));
writeFileSync(resolve(root,'branded-verification-private.json'),JSON.stringify({at:new Date().toISOString(),count:6,palette:input.palette,productsAdded:0,published:0,exports},null,2));
writeFileSync(resolve(root,'preparation-input-private.json'),JSON.stringify(preparation,null,2));
console.log(JSON.stringify({images:exports.length,dimensions:'1600 x 2000',ratio:'4:5',webpVariants:18,jpegExports:6,productsAdded:0,published:0}));

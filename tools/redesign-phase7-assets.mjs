import assert from 'node:assert/strict';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const baseline=JSON.parse(await readFile('docs/redesign/modern-design-2026-10-13/source-baseline.json','utf8'));
const report={scope:'Original public/logo/media byte hashes against pre-redesign baseline plus current raster decode metadata; no media assignments or content writes',originalPublic:[],rasters:[],videos:[],errors:[]};
for(const [path,hash]of Object.entries(baseline.files).filter(([p])=>p.startsWith('public/'))){try{const current=createHash('sha256').update(await readFile(path)).digest('hex');report.originalPublic.push({path,unchanged:current===hash});if(current!==hash)report.errors.push('Original asset changed '+path);}catch(error){report.errors.push(path+' '+error.code);}}
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const path=dir+'/'+entry.name;if(entry.isDirectory())await walk(path);else if(/\.(png|jpe?g|webp|avif|gif)$/i.test(path)){try{const info=await sharp(path).metadata();assert.ok(info.width&&info.height);report.rasters.push({path,width:info.width,height:info.height,format:info.format});}catch(error){report.errors.push('Decode failed '+path+' '+error.message);}}else if(/\.(mp4|webm)$/i.test(path))report.videos.push(path);}}
await walk('public');
await writeFile('output/redesign-phase7/assets.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({originalPublic:report.originalPublic.length,rasters:report.rasters.length,videos:report.videos,errors:report.errors}));assert.equal(report.errors.length,0);

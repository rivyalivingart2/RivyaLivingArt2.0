/** Verify exact chosen image bytes in the local website; no database or cloud writes. */
import assert from 'node:assert/strict';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {request} from 'node:http';
const root=resolve('test-results/exact-legacy-2026-10-21/phase3-website-selection');
const read=async name=>JSON.parse(await readFile(resolve(root,name),'utf8'));
const selection=await read('selection-private.json');assert.equal(selection.images.length,169);
assert.equal(selection.selectedCollection,'phase3-completion');assert.equal(selection.cutoutExperimentSelected,false);
const get=(path,headers={},method='GET')=>new Promise((done,fail)=>{const req=request({hostname:'127.0.0.1',port:4210,path,method,headers:{host:'127.0.0.1:4210',...headers}},res=>{const parts=[];res.on('data',c=>parts.push(c));res.on('end',()=>done({status:res.statusCode,headers:res.headers,body:Buffer.concat(parts)}));});req.on('error',fail);req.end();});
let imageFiles=0,pages=0,boundaryChecks=0;
for(const r of selection.images)for(const file of r.variants){
 const response=await get('/api/local-creations/'+String(r.index).padStart(3,'0')+'/'+file.width);
 assert.equal(response.status,200);assert.equal(response.headers['content-type'],'image/webp');assert.match(response.headers['cache-control'],/no-store/);
 assert.equal(createHash('sha256').update(response.body).digest('hex'),file.sha256,'Must use selected earlier export bytes');imageFiles++;
}
for(const [path,marker] of [['/','data-owner-creations="featured"'],['/portfolio','data-owner-creations="featured"'],['/creations','data-owner-creations="gallery"'],['/creations?image=008','Enlarge Photo keepsake image 008'],['/studio/login','Sign in']]){
 const response=await get(path);assert.equal(response.status,200,path);const body=response.body.toString();assert.ok(body.includes(marker),path+' marker');
 assert.ok(!body.includes('phase3-photos-fidelity')&&!body.includes('selection-private.json')&&!body.includes('originalSha256'));
 if(path==='/creations')assert.ok(body.includes('169 images'));pages++;
}
for(const [path,headers,method,status] of [['/api/local-creations/001/960',{},'HEAD',200],['/api/local-creations/170/960',{},'GET',404],['/api/local-creations/001/original',{},'GET',404],['/api/local-creations/001/960',{},'POST',405],['/api/local-creations/001/960',{host:'evil.example'},'GET',403],['/api/local-creations/001/960',{origin:'https://evil.example'},'GET',403],['/api/local-creations/001/960',{'sec-fetch-site':'cross-site'},'GET',403],['/test-results/exact-legacy-2026-10-21/phase3-website-selection/selection-private.json',{},'GET',404]]){
 const response=await get(path,headers,method);assert.equal(response.status,status,path);if(method==='HEAD')assert.equal(response.body.length,0);boundaryChecks++;
}
// Trace manifests must not include private originals, evidence, model files or previews.
let traceFiles=0;
async function inspect(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const path=resolve(dir,entry.name);if(entry.isDirectory())await inspect(path);else if(entry.name.endsWith('.nft.json')){const trace=JSON.parse(await readFile(path,'utf8'));for(const name of trace.files||[])assert.ok(!name.replaceAll('\\','/').includes('test-results/'),'Private file in build trace');traceFiles++;}}}
await inspect(resolve('.next/server'));
const receipt={at:new Date().toISOString(),selectedImages:169,featuredImages:selection.featured.length,servedVariantHashesMatched:imageFiles,pages,boundaryChecks,traceFiles,privateFilesExcludedFromBuildTraces:true,newCutoutsUsed:0,photosExcluded:true,scope:'local website only',productsAdded:0,archivedImports:0,databaseWrites:0,published:0};
await writeFile(resolve(root,'website-verification.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));

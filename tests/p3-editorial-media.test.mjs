import {test} from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {processEditorialImage,boundedImageBody} from '../src/lib/editorial-media-processing.ts';
import {validEditorialMedia,validPublishedEditorialMedia,allowedEditorialPath} from '../src/lib/editorial-media-model.ts';
import {baselineContent,validContent} from '../src/lib/content-model.ts';
import {homeCandidate} from '../src/lib/homepage-model.ts';
import {baselineProducts} from '../src/lib/shop-model.ts';
import {approvedPublicMedia,validMedia} from '../src/lib/public-media.ts';
import {compileHomepageSnapshot} from '../src/lib/homepage-dependencies.ts';
import {compilePageSnapshot} from '../src/lib/page-dependencies.ts';
import {assignEditorialSlot,editorialUsages} from '../src/lib/editorial-slots.ts';
const id='aee3709f-3243-403b-b0c3-45bd38f3dbee',path='/editorial/'+id;
const asset=()=>({path,alt:'Blue material flowing',caption:'Design visualization',products:[],focalX:50,focalY:50,provenance:'Owner-supplied Drive visualization',editorial:{id,driveId:'abcdefghijklmnop',filename:'pour.jpg',sha256:'a'.repeat(64),bytes:100,width:1600,height:900,format:'jpeg',derivatives:[640,960,1600].map(width=>({width,height:width*9/16,bytes:100,sha256:'b'.repeat(64)})),classification:'design-visualization',reviewNote:'Reviewed material subject, no workshop claim.',reviewedBy:'qa-admin',reviewedAt:'2026-10-01T00:00:00Z'}});
const usage=()=>({path,alt:'Blue material flowing',caption:'Design visualization',desktop:{x:40,y:50,ratio:'3/2'},mobile:{x:60,y:55,ratio:'4/5'}});
const row=(key,document)=>({key,document,version:1,fingerprint:'fp-'+key});
const source=()=>({products:baselineProducts.map(p=>row(p.id,p)),content:baselineContent.filter(d=>d.id!=='page:home').map(d=>row(d.id,d)),media:approvedPublicMedia.map(m=>row(m.path,m))});
test('editorial approval cannot admit product associations, private references or unreviewed assets',()=>{
 const m=asset();assert.equal(validEditorialMedia(m),true);assert.equal(validPublishedEditorialMedia(m),true);assert.equal(validMedia(m),false);
 for(const mutate of [m=>m.products=['DP001'],m=>m.path='/api/studio/reference/private',m=>m.editorial.derivatives=[],m=>m.editorial.sha256='bad']){const bad=asset();mutate(bad);assert.equal(validEditorialMedia(bad),false);}
 delete m.editorial.reviewedAt;assert.equal(validEditorialMedia(m),true);assert.equal(validPublishedEditorialMedia(m),false);
 for(const p of ['/editorial/../private','/editorial/'+id+'?url=private','/references/'+id,'https://drive.google.com/file/x'])assert.equal(allowedEditorialPath(p),false);
});
test('real raster processing preserves bytes and produces bounded, metadata-free responsive derivatives',async()=>{
 const bytes=await sharp({create:{width:1800,height:1000,channels:3,background:'#167a91'}}).withMetadata({exif:{IFD0:{Artist:'private metadata'}}}).jpeg().toBuffer();const before=Buffer.from(bytes);
 const result=await processEditorialImage(bytes);assert.deepEqual(bytes,before);assert.equal(result.variants.length,3);
 for(const [i,v] of result.variants.entries()){const m=await sharp(v.data).metadata();assert.equal(m.width,[640,960,1600][i]);assert.equal(m.format,'webp');assert.equal(m.exif,undefined);assert.ok(v.bytes<600000);}
 await assert.rejects(processEditorialImage(Buffer.from('<svg onload="alert(1)"/>')));
 await assert.rejects(processEditorialImage(await sharp({create:{width:100,height:100,channels:3,background:'#fff'}}).png().toBuffer()));
 await assert.rejects(boundedImageBody(new Request('http://localhost',{method:'PUT',body:Buffer.alloc(4*1024*1024+1)})));
});
test('hero, journey and header overrides leave products, originals and other usages untouched',()=>{
 const base=structuredClone(homeCandidate),original=JSON.stringify(base);let d=assignEditorialSlot(base,'hero',usage());d=assignEditorialSlot(d,'journey:journeys:large',{...usage(),mobile:{x:12,y:40,ratio:'1/1'}});
 assert.equal(JSON.stringify(base),original);assert.equal(d.homepage.heroProductId,base.homepage.heroProductId);assert.equal(d.homepage.heroImage.mobile.x,60);assert.equal(d.homepage.sections.find(s=>s.id==='journeys').items[0].productId,base.homepage.sections.find(s=>s.id==='journeys').items[0].productId);
 assert.equal(assignEditorialSlot(d,'hero').homepage.heroImage,undefined);
 const page=baselineContent.find(d=>d.id==='page:process'),next=assignEditorialSlot(page,'header',usage());assert.equal(next.image,page.image);assert.equal(validContent(next,page),true);
 const refs=editorialUsages([{document:d,published:base},{document:next,published:page}],path);assert.equal(refs.length,3);
});
test('all new placements require published reviewed media and enter revision dependency checks',()=>{
 let d=assignEditorialSlot(homeCandidate,'hero',usage());d=assignEditorialSlot(d,'journey:journeys:memory',usage());const data=source();
 assert.ok(compileHomepageSnapshot(d,data).issues.some(x=>x.startsWith('hero:')));assert.ok(compileHomepageSnapshot(d,data).issues.some(x=>x.includes('memory')));
 const pending=asset();delete pending.editorial.reviewedAt;data.media.push(row(path,pending));assert.ok(compileHomepageSnapshot(d,data).issues.some(x=>x.startsWith('hero:')));
 data.media[data.media.length-1]=row(path,asset());const snapshot=compileHomepageSnapshot(d,data);assert.deepEqual(snapshot.issues,[]);assert.equal(snapshot.dependencies.filter(x=>x.key===path).length,1);
 const page=assignEditorialSlot(baselineContent.find(d=>d.id==='page:process'),'header',usage());assert.ok(compilePageSnapshot(page,data).mediaPaths.includes(path));
 assert.equal(JSON.stringify(snapshot).includes('reviewedBy'),false);assert.equal(JSON.stringify(snapshot).includes('driveId'),false);
});

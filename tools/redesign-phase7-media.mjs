import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {chromium} from '@playwright/test';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}),origin='http://127.0.0.1:4199';
const report={scope:'Local media-library images decode and both existing film encodings play in Chromium; no media selection or upload',videos:[],images:[],errors:[]};
try{
 const p=await browser.newPage();await p.goto(origin,{waitUntil:'networkidle'});
 const assets=JSON.parse(await readFile('output/redesign-phase7/assets.json','utf8'));
 for(const path of assets.videos){const src=origin+path.replace(/^public/,'');const result=await p.evaluate(async src=>{const video=document.createElement('video');video.muted=true;video.controls=true;video.src=src;document.body.append(video);try{await Promise.race([video.play(),new Promise((_,reject)=>setTimeout(()=>reject(Error('Video playback timed out')),15000))]);await new Promise(r=>setTimeout(r,400));const result={duration:video.duration,width:video.videoWidth,height:video.videoHeight,progress:video.currentTime};video.pause();return result;}finally{video.remove();}},src);assert.ok(result.duration>0&&result.width>0&&result.progress>0);report.videos.push({path,...result});}
 for(const route of ['/','/collectible-design','/pieces/amber-veil-wall-panel','/our-story','/journal']){await p.goto(origin+route,{waitUntil:'networkidle'});await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=650){scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}});const result=await p.locator('img').evaluateAll(async images=>{await Promise.all(images.map(i=>i.decode().catch(()=>{})));return{count:images.length,broken:images.filter(i=>!i.complete||!i.naturalWidth).map(i=>({alt:i.alt,src:i.getAttribute('src')}))};});report.images.push({route,...result});if(result.broken.length)report.errors.push('Broken rendered image '+route);}
}finally{await browser.close();await writeFile('output/redesign-phase7/media.json',JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({videos:report.videos.length,renderedImages:report.images.reduce((n,r)=>n+r.count,0),errors:report.errors}));assert.equal(report.errors.length,0);

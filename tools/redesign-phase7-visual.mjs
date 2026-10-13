import {readFile,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const comparisons=[
 ['redesign-phase3','redesign-phase3-browser','1440-opening.png'],['redesign-phase3','redesign-phase3-browser','390-opening.png'],['redesign-phase3','redesign-phase3-browser','1440-material.png'],['redesign-phase3','redesign-phase3-browser','390-closing.png'],
 ...['1440-collectible-design.png','390-collectible-design.png','1440-privacy.png','390-privacy.png','1440-journal.png','390-journal.png'].map(file=>['redesign-phase4','redesign-phase4-browser',file]),
 ...['1440-product-general-details.png','390-translation-editor.png'].map(file=>['redesign-phase5','redesign-phase5-interactions',file]),
 ...['1440-full-overview.png','390-full-overview.png','1440-full-settings.png','390-inquiry-record.png','1440-login.png'].map(file=>['redesign-phase6','redesign-phase6-previews',file])];
const report={scope:'Pixel comparison with approved local captures; runtime record counts and captures may differ. Deltas require interpretation, not automatic visual failure.',comparisons:[],errors:[]};
for(const [phase,suite,file]of comparisons){try{const before='output/playwright/'+phase+'/'+file,after='output/playwright/redesign-phase7/'+suite+'/'+file;
 const a=await sharp(await readFile(before)).ensureAlpha().raw().toBuffer({resolveWithObject:true}),b=await sharp(await readFile(after)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const sameSize=a.info.width===b.info.width&&a.info.height===b.info.height;let changed=0,minX=Infinity,minY=Infinity,maxX=0,maxY=0;if(sameSize)for(let i=0;i<a.data.length;i+=4)if(Math.max(...[0,1,2].map(c=>Math.abs(a.data[i+c]-b.data[i+c])))>24){changed++;const x=(i/4)%a.info.width,y=Math.floor(i/4/a.info.width);minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}
 report.comparisons.push({before,after,width:b.info.width,height:b.info.height,beforeHeight:a.info.height,sameSize,changedPixelPercent:sameSize?+(100*changed/(a.info.width*a.info.height)).toFixed(3):null,changedBounds:changed?{minX,minY,maxX,maxY}:null});
 }catch(error){report.errors.push({file,error:error.message});}}
await writeFile('output/redesign-phase7/visual.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));

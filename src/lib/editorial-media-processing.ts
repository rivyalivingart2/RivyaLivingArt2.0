import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {editorialWidths} from './editorial-media-model';
export const digest=(bytes:Buffer)=>createHash('sha256').update(bytes).digest('hex');
export async function processEditorialImage(input:Buffer){
 if(!input.length||input.length>20*1024*1024)throw Error('Choose an image no larger than 20 MB.');
 const meta=await sharp(input,{limitInputPixels:40000000,animated:false}).metadata();
 if(!['jpeg','png','webp'].includes(meta.format||'')||(meta.pages||1)>1||!meta.width||!meta.height||Math.min(meta.width,meta.height)<320||Math.max(meta.width,meta.height)>12000)throw Error('Use a still JPEG, PNG or WebP, at least 320 pixels on each side and no more than 40 megapixels.');
 const normalized=await sharp(input,{limitInputPixels:40000000}).rotate().toBuffer({resolveWithObject:true});
 const variants=await Promise.all(editorialWidths.map(async size=>{
  let result=await sharp(normalized.data).resize({width:size,withoutEnlargement:true}).webp({quality:82}).toBuffer({resolveWithObject:true});
  for(const quality of [76,68,60]){if(result.data.length<=600000)break;result=await sharp(normalized.data).resize({width:size,withoutEnlargement:true}).webp({quality}).toBuffer({resolveWithObject:true});}
  if(result.data.length>600000)throw Error('This image exceeds the derivative size budget. Choose a smaller source.');
  return {size,data:result.data,width:result.info.width,height:result.info.height,bytes:result.data.length,sha256:digest(result.data)};
 }));
 return {width:normalized.info.width,height:normalized.info.height,format:meta.format as 'jpeg'|'png'|'webp',sha256:digest(input),bytes:input.length,variants};
}
export async function boundedImageBody(request:Request){
 if(Number(request.headers.get('content-length')||0)>20*1024*1024)throw Error('Choose an image no larger than 20 MB.');
 const reader=request.body?.getReader();if(!reader)throw Error('Choose an image.');const chunks:Buffer[]=[];let size=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>20*1024*1024){await reader.cancel();throw Error('Choose an image no larger than 20 MB.');}chunks.push(Buffer.from(value));}}finally{reader.releaseLock();}
 return Buffer.concat(chunks);
}

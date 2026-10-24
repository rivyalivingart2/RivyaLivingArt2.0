import 'server-only';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {ownerCreationBytes,ownerCreations} from './owner-creations';
import {localCreationAccess} from './owner-creation-model';
import {validEditorialMedia,type EditorialMedia} from './editorial-media-model';
import {readEditorialFile,saveEditorialFile} from './editorial-media-storage';
const sha=(bytes:Buffer)=>createHash('sha256').update(bytes).digest('hex');
/** Trusted local selection only: client input is an integer, never a file path or URL. */
export async function selectedCreationDraft(index:number){
 if(!localCreationAccess()||!Number.isSafeInteger(index)||index<1||index>169)throw Error('Selection unavailable');
 const item=(await ownerCreations()).images.find(r=>r.index===index);if(!item)throw Error('Selection unavailable');
 const root=resolve(process.cwd(),'test-results/exact-legacy-2026-10-21/phase3-completion');
 const [collection,inventory]=await Promise.all(['collection','owner-inventory'].map(async name=>JSON.parse(await readFile(resolve(root,name+'-private.json'),'utf8'))));
 const source=collection.records.find((r:{index:number})=>r.index===index),drive=inventory.files.find((r:{index:number})=>r.index===index),number=String(index).padStart(3,'0');
 if(!source||!drive||!/^[A-Za-z0-9_-]{10,100}$/.test(drive.id)||!new RegExp('^originals/owner-'+number+'\\.(?:jpg|jpeg|png|heic|heif)$','i').test(source.original)||!/^[a-f0-9]{64}$/.test(source.originalSha256)||source.classification!=='design-visualization'||source.publicationApproved!==false)throw Error('Source lineage unavailable');
 const original=await readFile(resolve(root,source.original));if(sha(original)!==source.originalSha256)throw Error('Original changed');
 const variants=await Promise.all([640,960,1600].map(async width=>{
  const bytes=await ownerCreationBytes(number,String(width));if(!bytes)throw Error('Selected export unavailable');
  const metadata=await sharp(bytes).metadata();if(metadata.format!=='webp'||metadata.width!==width||metadata.height!==width*1.25)throw Error('Selected export dimensions changed');
  return {width,height:width*1.25,bytes:bytes.length,sha256:sha(bytes),data:bytes};
 }));
 const largest=variants[2],hash=sha(Buffer.from('rivya-owner-selection:'+largest.sha256));
 const id=hash.slice(0,8)+'-'+hash.slice(8,12)+'-'+hash.slice(12,16)+'-'+hash.slice(16,20)+'-'+hash.slice(20,32);
 const media:EditorialMedia={path:'/editorial/'+id,alt:item.category+' — owner-selected creation '+number,caption:'AI-enhanced design visualization',provenance:'Owner-supplied Drive creation, earlier ocean/obsidian/champagne presentation selected for local website use. Original source retained unchanged. Faces, lettering and fine details may be AI-altered.',products:[],focalX:50,focalY:50,editorial:{id,driveId:drive.id,filename:'owner-'+number+'-ocean-1600x2000.webp',sha256:largest.sha256,bytes:largest.bytes,width:1600,height:2000,format:'webp',derivatives:variants.map(({width,height,bytes,sha256})=>({width,height,bytes,sha256})),classification:'design-visualization',reviewNote:'',edit:{parentSha256:source.originalSha256,method:'ai-edit',note:'Earlier 169-image collection selected by the owner. Exact prepared export bytes retained; not the rejected cutout experiment. Original remains in the private source archive. Local draft only; no genuine customer, project or review association asserted.'}}};
 if(!validEditorialMedia(media))throw Error('Selected metadata invalid');
 return {media,variants};
}
/** Write once; retries and simultaneous preparations verify existing bytes. */
export async function saveSelectedCreation(draft:Awaited<ReturnType<typeof selectedCreationDraft>>){
 if(!localCreationAccess())throw Error('Local storage required');
 const files=[{variant:'original',data:draft.variants[2].data},...draft.variants.map(v=>({variant:String(v.width),data:v.data}))];
 for(const file of files){
  try{await saveEditorialFile(draft.media.editorial.id,file.variant,file.data,'image/webp');}
  catch(error){
   if((error as NodeJS.ErrnoException).code!=='EEXIST')throw error;
   const stream=await readEditorialFile(draft.media.editorial.id,file.variant);
   if(!stream||sha(Buffer.from(await new Response(stream).arrayBuffer()))!==sha(file.data))throw Error('Existing image bytes differ');
  }
 }
}

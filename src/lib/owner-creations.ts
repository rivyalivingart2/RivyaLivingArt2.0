import 'server-only';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {localCreationAccess,ownerImageSizes,type OwnerCreation} from './owner-creation-model';
import publicSelection from './selected-creations-public.json';
type SelectedImage={index:number;category:string;classification:string;variants:{width:number;path:string;sha256:string}[]};
type Selection={schemaVersion:number;selectedCollection:string;scope:string;ownerSelected:boolean;cutoutExperimentSelected:boolean;productionPublicationApproved:boolean;featured:number[];images:SelectedImage[]};
const evidence=()=>resolve(process.cwd(),'test-results/exact-legacy-2026-10-21');
async function selection():Promise<Selection|null>{
 if(!localCreationAccess())return null;
 let data:Selection;
 try{data=JSON.parse(await readFile(resolve(evidence(),'phase3-website-selection/selection-private.json'),'utf8'));}
 catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return null;throw error;}
 if(data.schemaVersion!==1||data.selectedCollection!=='phase3-completion'||data.scope!=='local-website-only'||data.ownerSelected!==true||data.cutoutExperimentSelected!==false||data.productionPublicationApproved!==false||data.images.length!==169||new Set(data.images.map(r=>r.index)).size!==169)throw Error('Invalid owner image selection');
 if(data.images.some(r=>!Number.isInteger(r.index)||r.index<1||r.index>169||r.classification!=='design-visualization'||typeof r.category!=='string'||r.category.length>100))throw Error('Invalid selected image');
 return data;
}
export async function ownerCreations():Promise<{images:OwnerCreation[];featured:OwnerCreation[]}>{
 const images=publicSelection.images.map(r=>({index:r.index,category:r.category,image:r.variants.find(v=>v.width===960)!.url,large:r.variants.find(v=>v.width===1600)!.url,small:r.variants.find(v=>v.width===640)!.url}));
 return {images,featured:publicSelection.featured.flatMap(index=>images.filter(r=>r.index===index))};
}
export async function ownerCreationBytes(id:string,size:string){
 if(!/^\d{3}$/.test(id)||!ownerImageSizes.some(n=>String(n)===size))return null;
 const data=await selection(),item=data?.images.find(r=>r.index===Number(id));
 if(!item)return null;
 const file=item.variants.find(v=>v.width===Number(size));
 const height=Number(size)*1.25,expected=`image-pack/owner-${id}-ocean-${size}x${height}.webp`;
 if(!file||file.path!==expected||!/^[a-f0-9]{64}$/.test(file.sha256))return null;
 const bytes=await readFile(resolve(evidence(),'phase3-completion',expected));
 if(createHash('sha256').update(bytes).digest('hex')!==file.sha256)throw Error('Selected image bytes changed');
 return bytes;
}

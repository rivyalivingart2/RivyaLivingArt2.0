import 'server-only';
import {put,get,del} from '@vercel/blob';
import {getStore} from '@netlify/blobs';
export type ReferenceProvider='vercel'|'netlify';
export function referenceProvider():ReferenceProvider{return process.env.RIVYA_REFERENCE_STORAGE==='netlify'?'netlify':'vercel';}
function netlifyStore(){
 const name=process.env.RIVYA_REFERENCE_STORE,environment=process.env.RIVYA_ENV;
 if(!['production','preview'].includes(environment||'')||name!=='rivya-references-'+environment)throw new Error('Private storage environment is not configured');
 return getStore({name,consistency:'strong'});
}
function validPath(path:string){if(!/^references\/[0-9a-f-]{36}\.jpg$/.test(path))throw new Error('Invalid private storage key');}
export async function saveReference(path:string,bytes:Buffer,provider:ReferenceProvider){
 validPath(path);
 if(provider==='netlify'){const result=await netlifyStore().set(path,Uint8Array.from(bytes).buffer,{onlyIfNew:true,metadata:{contentType:'image/jpeg'}});if(!result.modified)throw new Error('Reference already exists');return;}
 await put(path,bytes,{access:'private',contentType:'image/jpeg',addRandomSuffix:false,allowOverwrite:false});
}
export async function readReference(path:string,provider:ReferenceProvider){
 validPath(path);
 if(provider==='netlify'){const result=await netlifyStore().getWithMetadata(path,{type:'stream',consistency:'strong'});return result?.data||null;}
 const result=await get(path,{access:'private',useCache:false});
 return result?.statusCode===200?result.stream:null;
}
export async function deleteReference(path:string,provider:ReferenceProvider){
 validPath(path);if(provider==='netlify'){await netlifyStore().delete(path);return;}await del(path);
}

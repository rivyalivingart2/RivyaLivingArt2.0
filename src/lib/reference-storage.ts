import 'server-only';
import {put,get,del} from '@vercel/blob';
export type ReferenceProvider='vercel';
function requireVercel(provider:string){if(provider!=='vercel')throw new Error('Unsupported private storage provider');}
export function referenceProvider():ReferenceProvider{requireVercel(process.env.RIVYA_REFERENCE_STORAGE||'vercel');return 'vercel';}
function validPath(path:string){if(!/^references\/[0-9a-f-]{36}\.jpg$/.test(path))throw new Error('Invalid private storage key');}
export async function saveReference(path:string,bytes:Buffer,provider:ReferenceProvider){
 validPath(path);requireVercel(provider);
 await put(path,bytes,{access:'private',contentType:'image/jpeg',addRandomSuffix:false,allowOverwrite:false});
}
export async function readReference(path:string,provider:ReferenceProvider){
 validPath(path);requireVercel(provider);
 const result=await get(path,{access:'private',useCache:false});
 return result?.statusCode===200?result.stream:null;
}
export async function deleteReference(path:string,provider:ReferenceProvider){
 validPath(path);requireVercel(provider);await del(path);
}

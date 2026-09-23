import 'server-only';
import {put,get,del} from '@vercel/blob';
export type ReferenceProvider='vercel';
function requireVercel(provider:string){if(provider!=='vercel')throw new Error('Unsupported private storage provider');}
export function referenceProvider():ReferenceProvider{requireVercel(process.env.RIVYA_REFERENCE_STORAGE||'vercel');return 'vercel';}
function validPath(path:string){if(!/^references\/[0-9a-f-]{36}\.jpg$/.test(path))throw new Error('Invalid private storage key');}
function token(){const value=process.env.BLOB_READ_WRITE_TOKEN;if(!value||value==='[SENSITIVE]')throw Error('Private storage is not configured');return value;}
export async function saveReference(path:string,bytes:Buffer,provider:ReferenceProvider){
 validPath(path);requireVercel(provider);
 await put(path,bytes,{token:token(),access:'private',contentType:'image/jpeg',addRandomSuffix:false,allowOverwrite:false});
}
export async function readReference(path:string,provider:ReferenceProvider){
 validPath(path);requireVercel(provider);
 const result=await get(path,{token:token(),access:'private',useCache:false});
 return result?.statusCode===200?result.stream:null;
}
export async function deleteReference(path:string,provider:ReferenceProvider){
 validPath(path);requireVercel(provider);await del(path,{token:token()});
}

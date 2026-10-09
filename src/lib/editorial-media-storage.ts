import 'server-only';
import {get,put} from '@vercel/blob';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {localEditorialRoot} from './local-editorial-store';
import {editorialIdPattern,editorialWidths} from './editorial-media-model';
function key(id:string,variant:string){if(!editorialIdPattern.test(id)||!['original',...editorialWidths.map(String)].includes(variant))throw Error('Invalid editorial storage key');return `editorial/${id}/${variant}`;}
export async function saveEditorialFile(id:string,variant:string,data:Buffer,type:string){
 const assetKey=key(id,variant),local=localEditorialRoot();
 if(local){const path=resolve(local,assetKey);await mkdir(dirname(path),{recursive:true});await writeFile(path,data,{flag:'wx'});return;}
 await put(assetKey,data,{token:process.env.BLOB_READ_WRITE_TOKEN,access:'private',contentType:type,addRandomSuffix:false,allowOverwrite:false});
}
// Each UUID/variant is written once (allowOverwrite:false). Cache those bytes,
// not publication permission: callers still validate the current published record.
// Customer references use their separate private storage and retention workflow.
export async function readEditorialFile(id:string,variant:string){
 const assetKey=key(id,variant),local=localEditorialRoot();
 if(local){try{return new Blob([new Uint8Array(await readFile(resolve(local,assetKey)))]).stream();}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return null;throw error;}}
 const result=await get(assetKey,{token:process.env.BLOB_READ_WRITE_TOKEN,access:'private',useCache:true});return result?.statusCode===200?result.stream:null;
}

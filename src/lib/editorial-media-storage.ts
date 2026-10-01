import 'server-only';
import {get,put} from '@vercel/blob';
import {editorialIdPattern,editorialWidths} from './editorial-media-model';
function key(id:string,variant:string){if(!editorialIdPattern.test(id)||!['original',...editorialWidths.map(String)].includes(variant))throw Error('Invalid editorial storage key');return `editorial/${id}/${variant}`;}
export async function saveEditorialFile(id:string,variant:string,data:Buffer,type:string){await put(key(id,variant),data,{token:process.env.BLOB_READ_WRITE_TOKEN,access:'private',contentType:type,addRandomSuffix:false,allowOverwrite:false});}
export async function readEditorialFile(id:string,variant:string){const result=await get(key(id,variant),{token:process.env.BLOB_READ_WRITE_TOKEN,access:'private',useCache:false});return result?.statusCode===200?result.stream:null;}

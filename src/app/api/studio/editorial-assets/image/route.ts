import {studioDb} from '@/lib/studio-db';
import {studioSession} from '@/lib/studio-auth';
import {editorialIdPattern,editorialPath,validEditorialMedia} from '@/lib/editorial-media-model';
import {readEditorialFile} from '@/lib/editorial-media-storage';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{if(!await studioSession())return new Response(null,{status:401});const id=new URL(request.url).searchParams.get('id')||'';if(!editorialIdPattern.test(id))return new Response(null,{status:404});const rows=await studioDb()`SELECT draft FROM rivya_public_media WHERE path=${editorialPath(id)}`;if(!validEditorialMedia(rows[0]?.draft))return new Response(null,{status:404});const stream=await readEditorialFile(id,'960');return stream?new Response(stream,{headers:{'Content-Type':'image/webp','Cache-Control':'private, no-store','X-Robots-Tag':'noindex','X-Content-Type-Options':'nosniff'}}):new Response(null,{status:404});}catch{return new Response(null,{status:503});}}

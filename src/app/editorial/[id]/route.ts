import {studioDb} from '@/lib/studio-db';
import {editorialIdPattern,editorialPath,editorialWidths,validPublishedEditorialMedia} from '@/lib/editorial-media-model';
import {readEditorialFile} from '@/lib/editorial-media-storage';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 try{const {id}=await params;if(!editorialIdPattern.test(id))return new Response(null,{status:404});const size=Number(new URL(request.url).searchParams.get('width')||1600);if(!editorialWidths.some(w=>w===size))return new Response(null,{status:400});
 const rows=await studioDb()`SELECT published FROM rivya_public_media WHERE path=${editorialPath(id)}`;if(!validPublishedEditorialMedia(rows[0]?.published))return new Response(null,{status:404,headers:{'Cache-Control':'no-store'}});
 const stream=await readEditorialFile(id,String(size));return stream?new Response(stream,{headers:{'Content-Type':'image/webp','X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=31536000, immutable'}}):new Response(null,{status:404});
 }catch{return new Response(null,{status:503,headers:{'Cache-Control':'no-store'}});}
}

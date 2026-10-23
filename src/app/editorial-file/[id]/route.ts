import {studioDb} from '@/lib/studio-db';
import {studioSession} from '@/lib/studio-auth';
import {readEditorialFile} from '@/lib/editorial-media-storage';
import {editorialIdPattern} from '@/lib/editorial-media-model';
import {validExtension,extensionPublicationIssues} from '@/lib/editorial-extension-model';
import {byteRange} from '@/lib/editorial-file-processing';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params,privatePreview=new URL(request.url).searchParams.get('preview')==='1';
 if(!editorialIdPattern.test(id))return new Response(null,{status:404});
 try{
  if(privatePreview&&!await studioSession())return new Response(null,{status:401});
  const rows=await studioDb()`SELECT draft,published FROM rivya_editorial_extensions WHERE entity_key=${id} AND kind IN ('video','model')`;
  const d=privatePreview?rows[0]?.draft:rows[0]?.published;
  if(!validExtension(d)||d.kind==='category'||!privatePreview&&extensionPublicationIssues(d).length)return new Response(null,{status:404});
  const stream=await readEditorialFile(id,'original');if(!stream)return new Response(null,{status:404});
  const bytes=new Uint8Array(await new Response(stream).arrayBuffer());
  if(bytes.length!==d.source.bytes)return new Response(null,{status:503});
  const headers=new Headers({'Content-Type':d.source.mime,'X-Content-Type-Options':'nosniff','Cache-Control':'private, no-store','Accept-Ranges':'bytes','Content-Disposition':d.kind==='model'?'attachment; filename="creation.glb"':'inline'});
  let range;try{range=byteRange(request.headers.get('range'),bytes.length);}catch{return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+bytes.length,'Cache-Control':'private, no-store'}});}
  if(range){headers.set('Content-Range',`bytes ${range.start}-${range.end}/${bytes.length}`);headers.set('Content-Length',String(range.end-range.start+1));return new Response(bytes.slice(range.start,range.end+1),{status:206,headers});}
  headers.set('Content-Length',String(bytes.length));return new Response(bytes,{headers});
 }catch{return new Response(null,{status:503,headers:{'Cache-Control':'private, no-store'}});}
}

import {readReference,type ReferenceProvider} from '@/lib/reference-storage';
import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 try{const session=await studioSession();if(!session)return new Response(null,{status:401});const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return new Response(null,{status:404});
 const rows=await studioDb()`SELECT r.pathname,r.storage_provider FROM rivya_references r JOIN rivya_inquiries i ON i.id=r.inquiry_id
 WHERE r.id=${id}::uuid AND r.state='ready' AND (${session.role==='admin'} OR i.assignee=${session.staffId}::uuid)`;
 if(!rows.length)return new Response(null,{status:404});
 const stream=await readReference(rows[0].pathname,rows[0].storage_provider as ReferenceProvider);
 if(!stream)return new Response(null,{status:404});
 return new Response(stream,{headers:{'Content-Type':'image/jpeg','Cache-Control':'private, no-store','Content-Disposition':'inline; filename="reference.jpg"','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"}});
 }catch{return new Response('Image unavailable',{status:503});}
}

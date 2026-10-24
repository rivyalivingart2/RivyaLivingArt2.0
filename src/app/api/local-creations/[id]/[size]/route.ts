import {ownerCreationBytes} from '@/lib/owner-creations';
import {localCreationAccess,localCreationRequest} from '@/lib/owner-creation-model';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{id:string;size:string}>}){
 if(!localCreationAccess())return new Response(null,{status:404});
 if(!localCreationRequest(request.headers))return new Response(null,{status:403});
 const {id,size}=await params,bytes=await ownerCreationBytes(id,size);
 if(!bytes)return new Response(null,{status:404});
 return new Response(new Uint8Array(bytes),{headers:{'Content-Type':'image/webp','Content-Length':String(bytes.length),'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Cross-Origin-Resource-Policy':'same-origin','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow, noarchive'}});
}

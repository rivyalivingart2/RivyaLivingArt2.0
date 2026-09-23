import {publishedBusiness} from '@/lib/business-settings';
import {whatsappHandoff} from '@/lib/whatsapp';
import {guestIdentity} from '@/lib/request-security';
import {studioDb} from '@/lib/studio-db';
export async function GET(request:Request){
 const headers={'Cache-Control':'private, no-store'};
 try{const guest=await guestIdentity();const key=new URL(request.url).searchParams.get('key');if(!guest||!key||!/^[0-9a-f-]{36}$/i.test(key))return Response.json({found:false},{headers});
 const rows=await studioDb()`SELECT reference,summary FROM rivya_inquiries WHERE guest_hash=${guest} AND request_key=${key}::uuid AND created_at>now()-interval '24 hours'`;
 if(!rows.length)return Response.json({found:false},{headers});
 return Response.json({found:true,reference:rows[0].reference,summary:rows[0].summary,...whatsappHandoff(rows[0].reference,rows[0].summary,(await publishedBusiness()).details.whatsapp)},{headers});
 }catch{return Response.json({error:'Receipt unavailable.'},{status:503,headers});}
}

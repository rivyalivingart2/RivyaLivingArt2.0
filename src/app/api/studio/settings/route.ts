import {revalidatePath} from 'next/cache';
import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {publishedBusiness,validBusiness} from '@/lib/business-settings';
import {originAllowed,smallJson} from '@/lib/request-security';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(){try{const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);if(session.role!=='admin')return json({error:'Administrator access required.'},403);return json(await publishedBusiness());}catch{return json({error:'Business settings are unavailable.'},503);}}
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);if(session.role!=='admin')return json({error:'Administrator access required.'},403);
 const body=await smallJson(request,3000);if(!validBusiness(body.details)||!Number.isInteger(body.version)||body.version<0)return json({error:'Use an international phone number, a WhatsApp number containing digits only, a valid email and an HTTPS Google Maps link.'},400);
 const sql=studioDb(),rows=await sql`WITH saved AS(INSERT INTO rivya_business_settings(id,details,updated_by) SELECT 1,${JSON.stringify(body.details)}::jsonb,${session.adminId} WHERE ${body.version}::integer=0
 ON CONFLICT(id) DO UPDATE SET details=EXCLUDED.details,version=rivya_business_settings.version+1,updated_by=EXCLUDED.updated_by,updated_at=now() WHERE rivya_business_settings.version=${body.version}::integer RETURNING version),
 existing AS(UPDATE rivya_business_settings SET details=${JSON.stringify(body.details)}::jsonb,version=version+1,updated_by=${session.adminId},updated_at=now() WHERE id=1 AND version=${body.version}::integer AND ${body.version}::integer>0 RETURNING version),
 changed AS(SELECT version FROM saved UNION ALL SELECT version FROM existing),
 logged AS(INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},'business:publish','business settings version '||version FROM changed)
 SELECT version FROM changed`;
 if(!rows.length)return json({error:'Another administrator changed these details. Reload before saving.'},409);revalidatePath('/','layout');return json({saved:true,version:rows[0].version});
 }catch{return json({error:'Business settings could not be saved.'},503);}
}

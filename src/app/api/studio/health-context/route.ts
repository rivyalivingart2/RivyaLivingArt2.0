import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {defaultSiteSettings,validSiteSettings} from '@/lib/site-settings-model';
export const dynamic='force-dynamic';
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(){
 try{
  if(!await studioSession())return json({error:'Sign in to continue.'},401);
  const sql=studioDb();
  const [settings,owners]=await Promise.all([
   sql`SELECT details FROM rivya_business_settings WHERE id=1`,
   sql`SELECT 'Content' AS area,content_key AS key,updated_by AS actor FROM rivya_content UNION ALL SELECT 'Catalogue',product_id,updated_by FROM rivya_catalogue UNION ALL SELECT 'Media',path,updated_by FROM rivya_public_media`
  ]);
  const site=settings[0]?.details?.site;
  if(site&&!validSiteSettings(site))return json({error:'Saved navigation settings need review before health checks can run.'},503);
  return json({settings:site||defaultSiteSettings,owners:Object.fromEntries(owners.map(r=>[r.area+':'+r.key,r.actor||'Unassigned']))});
 }catch{return json({error:'Navigation and saved-editor context could not be checked.'},503);}
}

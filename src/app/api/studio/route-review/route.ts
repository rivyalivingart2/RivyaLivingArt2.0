import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {publishedProducts} from '@/lib/shop-catalogue';
import {legacyRoutes} from '@/lib/legacy-routes';
import {destinationAvailable} from '@/lib/navigation-availability';
import {indexingEnabled,siteOrigin} from '@/lib/site-metadata';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(){
 try{
  const session=await studioSession();
  if(!session)return json({error:'Sign in to continue.'},401);
  if(session.role!=='admin')return json({error:'Administrator access required.'},403);
  const [products,rows]=await Promise.all([publishedProducts(),studioDb()`SELECT route,published->'sections' AS sections FROM rivya_content WHERE visible=true AND published IS NOT NULL AND content_key<>'page:site-copy'`]);
  const documents=rows.map(row=>({route:String(row.route),anchors:Array.isArray(row.sections)?row.sections.filter(s=>s&&typeof s==='object'&&s.enabled!==false&&typeof s.id==='string').map(s=>s.id):[]}));
  const productRoutes=products.map(p=>'/pieces/'+p.slug);
  return json({checkedAt:new Date().toISOString(),canonicalOrigin:siteOrigin,indexing:indexingEnabled(),
   routes:legacyRoutes.map(route=>({...route,availability:route.destination?(destinationAvailable(route.destination,documents,productRoutes)?'Available in published sources':'Not currently published'):'No reviewed destination'})),
   categories:[...new Set(products.map(p=>p.category))].sort((a,b)=>a.localeCompare(b,'en')).map(name=>({name,count:products.filter(p=>p.category===name).length,collections:[...new Set(products.filter(p=>p.category===name).map(p=>p.tier))]})),
   protectedPaths:['/studio','/api','/inquiry','/preview','/whatsapp-order'],
  });
 }catch{return json({error:'Published destinations could not be checked. Retry; no route settings were changed.'},503);}
}

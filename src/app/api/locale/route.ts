import {publishedSiteSettings} from '@/lib/site-settings';
import {isLocale} from '@/lib/site-settings-model';
import {originAllowed,smallJson} from '@/lib/request-security';
export async function POST(request:Request){
 if(!originAllowed(request))return Response.json({error:'Request not allowed.'},{status:403});
 try{
  const body=await smallJson(request,500),locale=typeof body?.locale==='string'?body.locale:'';
  const {settings}=await publishedSiteSettings();
  if(!isLocale(locale)||!settings.localization.enabled||!settings.localization.enabledLocales.includes(locale))return Response.json({error:'This language is not enabled.'},{status:400});
  const response=Response.json({saved:true,locale});
  response.headers.append('Set-Cookie',`NEXT_LOCALE=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${process.env.VERCEL_ENV==='production'?'; Secure':''}`);
  return response;
 }catch{return Response.json({error:'Language preference could not be saved.'},{status:400});}
}

import 'server-only';
import {isPublicWebsiteAvailable} from './public-website';
import {publishedSiteSettings} from './site-settings';
import {resolveLegacyLocale} from './legacy-locale';
import {GET as notice} from './legacy-route-handler';
export async function GET(request:Request){
 if(!isPublicWebsiteAvailable(process.env))return notice(request);
 const url=new URL(request.url),result=resolveLegacyLocale(url.pathname,url.searchParams);
 if(!result?.target)return notice(request);
 const {settings}=await publishedSiteSettings();
 const locale=settings.localization.enabled&&settings.localization.enabledLocales.some(l=>l===result.locale)?result.locale:'en';
 return new Response(null,{status:307,headers:{Location:result.target,'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow, noarchive','Set-Cookie':`NEXT_LOCALE=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${process.env.VERCEL_ENV==='production'?'; Secure':''}`}});
}

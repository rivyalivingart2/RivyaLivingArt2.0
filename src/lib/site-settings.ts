import 'server-only';
import {cache} from 'react';
import {cookies} from 'next/headers';
import {studioDb} from './studio-db';
import {defaultSiteSettings,isLocale,validSiteSettings,type Locale,type SiteSettings} from './site-settings-model';
export type {SiteSettings} from './site-settings-model';

export const publishedSiteSettings=cache(async():Promise<{settings:SiteSettings;version:number}>=>{
 try{
  const rows=await studioDb()`SELECT details,version FROM rivya_business_settings WHERE id=1`;
  if(!rows.length)return {settings:defaultSiteSettings,version:0};
  const details=rows[0].details as Record<string,unknown>;
  const site=details&&typeof details==='object'?details.site:undefined;
  return {settings:validSiteSettings(site)?site:defaultSiteSettings,version:Number(rows[0].version)||0};
 }catch{return {settings:defaultSiteSettings,version:0};}
});

export const publicLocale=cache(async():Promise<Locale>=>{
 const [{settings},jar]=await Promise.all([publishedSiteSettings(),cookies()]);
 const requested=jar.get('NEXT_LOCALE')?.value||'en';
 return isLocale(requested)&&settings.localization.enabled&&settings.localization.enabledLocales.includes(requested)?requested:'en';
});

import 'server-only';
import {cache} from 'react';
import {cookies} from 'next/headers';
import {publishedShellSource} from './published-shell-source';
import {defaultSiteSettings,isLocale,validSiteSettings,publicJourneyLocales,type Locale,type SiteSettings} from './site-settings-model';
export type {SiteSettings} from './site-settings-model';

export const publishedSiteSettings=cache(async():Promise<{settings:SiteSettings;version:number}>=>{
 try{
  const {business}=await publishedShellSource();
  if(!business)return {settings:defaultSiteSettings,version:0};
  const details=business.details as Record<string,unknown>;
  const site=details&&typeof details==='object'?details.site:undefined;
  return {settings:validSiteSettings(site)?site:defaultSiteSettings,version:Number(business.version)||0};
 }catch{return {settings:defaultSiteSettings,version:0};}
});

export const publicLocale=cache(async():Promise<Locale>=>{
 const [{settings},jar]=await Promise.all([publishedSiteSettings(),cookies()]);
 const requested=jar.get('NEXT_LOCALE')?.value||'en';
 return isLocale(requested)&&settings.localization.enabled&&publicJourneyLocales(settings.localization.enabledLocales).includes(requested)?requested:'en';
});

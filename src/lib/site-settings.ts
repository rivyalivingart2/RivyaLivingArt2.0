import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
import {defaultSiteSettings,validSiteSettings,type SiteSettings} from './site-settings-model';
export type {SiteSettings} from './site-settings-model';

export const publishedSiteSettings=cache(async():Promise<{settings:SiteSettings;version:number}>=>{
 const rows=await studioDb()`SELECT details,version FROM rivya_business_settings WHERE id=1`;
 if(!rows.length)return {settings:defaultSiteSettings,version:0};
 const details=rows[0].details as Record<string,unknown>;
 const site=details&&typeof details==='object'?details.site:undefined;
 return {settings:validSiteSettings(site)?site:defaultSiteSettings,version:Number(rows[0].version)||0};
});

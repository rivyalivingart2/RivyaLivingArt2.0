import {publishedBusiness,type BusinessSettings} from '@/lib/business-settings';
import {publishedSiteSettings,publicLocale} from '@/lib/site-settings';
import {publishedCopy} from '@/lib/published-copy';
import {sharedCopyValues} from '@/lib/shared-copy-model';
import type {ContentDocument} from '@/lib/content-model';
import {ShopFrame} from './shop-frame';
export async function ShopShell({children,business,copyDocument,copyVersion}:{children:React.ReactNode;business?:BusinessSettings;copyDocument?:ContentDocument;copyVersion?:number}){
 const [{details},{settings},locale]=await Promise.all([business?Promise.resolve({details:business}):publishedBusiness(),publishedSiteSettings(),publicLocale()]);
 const copy=copyDocument?{values:sharedCopyValues(copyDocument,locale),version:copyVersion||0}:await publishedCopy(locale);
 return <ShopFrame copy={copy.values} copyVersion={copy.version} business={details} navigation={settings.navigation} locale={locale} enabledLocales={settings.localization.enabled?settings.localization.enabledLocales:['en']}>{children}</ShopFrame>;
}

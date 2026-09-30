import {publishedBusiness,type BusinessSettings} from '@/lib/business-settings';
import {publishedSiteSettings,publicLocale} from '@/lib/site-settings';
import {ShopFrame} from './shop-frame';
export async function ShopShell({children,business}:{children:React.ReactNode;business?:BusinessSettings}){
 const [{details},{settings},locale]=await Promise.all([business?Promise.resolve({details:business}):publishedBusiness(),publishedSiteSettings(),publicLocale()]);
 return <ShopFrame business={details} navigation={settings.navigation} locale={locale} enabledLocales={settings.localization.enabled?settings.localization.enabledLocales:['en']}>{children}</ShopFrame>;
}

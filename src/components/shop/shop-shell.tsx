import {publishedBusiness,type BusinessSettings} from '@/lib/business-settings';
import {publishedSiteSettings,publicLocale} from '@/lib/site-settings';
import {publishedCopy} from '@/lib/published-copy';
import {publicJourneyLocales,type Locale} from '@/lib/site-settings-model';
import {sharedCopyValues} from '@/lib/shared-copy-model';
import type {ContentDocument} from '@/lib/content-model';
import {ShopFrame} from './shop-frame';
import {navigationDestinations} from '@/lib/published-navigation';
import {availableNavigation,destinationAvailable} from '@/lib/navigation-availability';
import {publishedProducts} from '@/lib/shop-catalogue';
export async function ShopShell({children,business,copyDocument,copyVersion,previewLocale,publicDesign=false}:{children:React.ReactNode;business?:BusinessSettings;copyDocument?:ContentDocument;copyVersion?:number;previewLocale?:Locale;publicDesign?:boolean}){
 const [{details},{settings},locale,destinations]=await Promise.all([business?Promise.resolve({details:business}):publishedBusiness(),publishedSiteSettings(),previewLocale?Promise.resolve(previewLocale):publicLocale(),navigationDestinations()]);
 const [copy,products]=await Promise.all([copyDocument?Promise.resolve({values:sharedCopyValues(copyDocument,locale),version:copyVersion||0}):publishedCopy(locale),publishedProducts(locale)]);
 const collectionImages=([{href:'/collectible-design',tier:'large'},{href:'/memory-art',tier:'memory'},{href:'/personal-art',tier:'personal'}] as const).flatMap(collection=>{const product=products.find(p=>p.tier===collection.tier);return product?[{href:collection.href,src:product.image,position:product.imagePosition}]:[];});
 return <ShopFrame collectionImages={collectionImages} publicDesign={publicDesign} copy={copy.values} copyVersion={copy.version} business={details} navigation={availableNavigation(settings.navigation,destinations.documents,destinations.products)} contactAvailable={destinationAvailable('/contact',destinations.documents,destinations.products)} locale={locale} enabledLocales={settings.localization.enabled?publicJourneyLocales(settings.localization.enabledLocales):['en']}>{children}</ShopFrame>;
}

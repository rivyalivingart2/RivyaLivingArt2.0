import {ShopSite} from '@/components/shop/shop-site';
/** Public pages read only the database's published projection. */
export async function ApprovedExperience({initialRoute}:{initialRoute:string}){return <ShopSite route={initialRoute}/>;}

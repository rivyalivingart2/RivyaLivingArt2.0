import {publishedBusiness,type BusinessSettings} from '@/lib/business-settings';
import {ShopFrame} from './shop-frame';
export async function ShopShell({children,business}:{children:React.ReactNode;business?:BusinessSettings}){const details=business||(await publishedBusiness()).details;return <ShopFrame business={details}>{children}</ShopFrame>;}

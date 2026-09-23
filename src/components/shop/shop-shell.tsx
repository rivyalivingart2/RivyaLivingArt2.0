import {publishedBusiness} from '@/lib/business-settings';
import {ShopFrame} from './shop-frame';
export async function ShopShell({children}:{children:React.ReactNode}){const {details}=await publishedBusiness();return <ShopFrame business={details}>{children}</ShopFrame>;}

import {requirePublicPreview,publicPreviewMetadata} from '@/lib/public-preview';
import {bespokeDefinition} from '@/lib/inquiry-definition';
import {ShopShell} from '@/components/shop/shop-shell';
import {OrderForm} from '@/components/shop/order-form';
export const metadata=publicPreviewMetadata('A custom piece','Share the idea, scale and references for a piece of your own.');
export default async function Page(){
 await requirePublicPreview();
 return <ShopShell><OrderForm definition={bespokeDefinition()}/></ShopShell>;
}

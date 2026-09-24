import {requirePublicPreview,publicPreviewMetadata} from '@/lib/public-preview';
import {bespokeDefinition} from '@/lib/inquiry-definition';
import {ShopShell} from '@/components/shop/shop-shell';
import {OrderForm} from '@/components/shop/order-form';
import {Intro} from '@/components/shop/shop-site';
export const metadata=publicPreviewMetadata('A custom piece','Share the idea, scale and references for a piece of your own.');
export default async function Page(){
 await requirePublicPreview();
 return <ShopShell><Intro eyebrow="A brief for your idea" title="A piece of your own.">Share its purpose, scale and material direction. Your saved brief starts a conversation with the atelier.</Intro><OrderForm definition={bespokeDefinition()}/></ShopShell>;
}

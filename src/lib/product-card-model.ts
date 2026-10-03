import type {ShopProduct} from './shop-model';

export type CardProduct = Pick<ShopProduct, 'id' | 'slug' | 'name' | 'subtitle' | 'category' | 'tier' | 'material' | 'image' | 'imageAlt' | 'imagePosition' | 'price'>;

/** Client-side discovery needs card fields, not customization, gallery or editorial records. */
export function productCard(p: CardProduct): CardProduct {
  return {id:p.id,slug:p.slug,name:p.name,subtitle:p.subtitle,category:p.category,tier:p.tier,material:p.material,image:p.image,imageAlt:p.imageAlt,imagePosition:p.imagePosition,price:p.price};
}

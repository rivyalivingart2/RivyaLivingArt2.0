import Link from 'next/link';
import Image from './public-image';
import type {ShopProduct} from '@/lib/shop-model';
import {imageSizes} from './image-sizes';
import s from './shop.module.css';
export type CardProduct=Pick<ShopProduct,'id'|'slug'|'name'|'subtitle'|'category'|'tier'|'material'|'image'|'imageAlt'|'imagePosition'>;
export function ProductCard({product:p}:{product:CardProduct}){
 return <Link className={s.card} prefetch={false} href={'/pieces/'+p.slug}><div className={s.cardImage}><Image src={p.image} alt={p.imageAlt||p.name+' — '+p.subtitle} style={{objectPosition:p.imagePosition}} fill sizes={imageSizes.card}/></div><div className={s.cardTop}><h3>{p.name}</h3><span className={s.cardArrow} aria-hidden>↗</span></div><p>{p.subtitle}</p><small className={s.productIndex}>{p.id} / Price on request</small></Link>;
}

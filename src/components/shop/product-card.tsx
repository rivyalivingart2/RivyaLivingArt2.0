import Link from 'next/link';
import {formatPrice} from '@/lib/product-presentation';
import {SavePieceButton} from './saved-piece-button';
import pstyle from './detailed-pages.module.css';
import Image from './public-image';
import type {ShopProduct} from '@/lib/shop-model';
import {imageSizes} from './image-sizes';
import s from './shop.module.css';

export type CardProduct = Pick<ShopProduct, 'id' | 'slug' | 'name' | 'subtitle' | 'category' | 'tier' | 'material' | 'image' | 'imageAlt' | 'imagePosition' | 'price'>;

export function ProductCard({product: p}: {product: CardProduct}) {
  return (
    <article className={pstyle.savedCard}><Link className={s.card} prefetch={false} href={'/pieces/' + p.slug}>
      <div className={s.cardImage}>
        <Image 
          src={p.image} 
          alt={p.imageAlt || p.name + ' — ' + p.subtitle} 
          style={{objectPosition: p.imagePosition}} 
          fill 
          sizes={imageSizes.card}
        />
        {/* Tier-specific badges overlaid on the image */}
        {p.tier === 'memory' && (
          <span className={s.cardBadge}>Customizable</span>
        )}
        {p.tier === 'personal' && (
          <span className={s.cardBadge}>Personalizable</span>
        )}
      </div>
      <div className={s.cardTop}>
        <h3>{p.name}</h3>
        <span className={s.cardArrow} aria-hidden>↗</span>
      </div>
      <p>{p.subtitle}</p>
      
      {/* Tier-specific metadata */}
      {p.tier === 'large' && p.material && (
        <small className={s.productMaterial}>{p.material}</small>
      )}
      
      <small className={s.productIndex}>
        {p.id} / {p.tier === 'personal' ? formatPrice(p.price) : 'Price on request'}
      </small>
    </Link><SavePieceButton id={p.id} name={p.name}/></article>
  );
}

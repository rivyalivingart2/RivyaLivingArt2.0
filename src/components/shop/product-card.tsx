import {JourneyText} from './journey-language';
import Link from 'next/link';
import {formatPrice} from '@/lib/product-presentation';
import {SavePieceButton} from './saved-piece-button';
import pstyle from './detailed-pages.module.css';
import Image from './public-image';
import type {CardProduct} from '@/lib/product-card-model';
export type {CardProduct} from '@/lib/product-card-model';
import {imageSizes} from './image-sizes';
import s from './shop.module.css';
import {Meniscus} from './legacy-meniscus';
import legacy from './legacy-home-sections.module.css';
import {LegacyProductActions} from './legacy-product-actions';

export function ProductCard({product: p,reveal=false}: {product: CardProduct;reveal?:boolean}) {
  const picture=<Image src={p.image} alt={p.imageAlt || p.name + ' — ' + p.subtitle} style={{objectPosition:p.imagePosition}} fill sizes={imageSizes.card}/>;
  return (
    <article data-lighting-card="product" className={pstyle.savedCard}><Link data-public-part="card" className={s.card} prefetch={false} href={'/pieces/' + p.slug}>
      <div data-public-part="card-image" className={s.cardImage}>
        {reveal?<Meniscus className={legacy.fillImage}>{picture}</Meniscus>:picture}
        {/* Tier-specific badges overlaid on the image */}
        {p.tier === 'memory' && (
          <span className={s.cardBadge}><JourneyText text="Customizable"/></span>
        )}
        {p.tier === 'personal' && (
          <span className={s.cardBadge}><JourneyText text="Personalizable"/></span>
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
        {p.id} / {p.tier === 'personal' ? formatPrice(p.price) : <JourneyText text="Price on request"/>}
      </small>
    </Link><LegacyProductActions product={p}/><SavePieceButton id={p.id} name={p.name}/></article>
  );
}

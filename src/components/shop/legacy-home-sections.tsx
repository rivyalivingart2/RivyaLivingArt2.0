import type {ReactNode} from 'react';
import Link from 'next/link';
import type {HomeAction,HomeProduct} from '@/lib/homepage-model';
import {ProductCard} from './product-card';
import {Meniscus} from './legacy-meniscus';
import s from './legacy-home-sections.module.css';

/** Server-rendered content stays visible before JavaScript; the optional motion
 * runtime arms only below-fold images and the eligible desktop rail. */

export function LegacyFeaturedRail({products,heading,action,label,unavailable=[]}:{products:HomeProduct[];heading:ReactNode;action?:HomeAction;label:string;unavailable?:string[]}){
 return <div data-legacy-featured-rail className={s.rail}>
  <div className={s.railHeading}>{heading}</div>
  <div data-rail-viewport className={s.railViewport} role="region" aria-label={label} tabIndex={0}>
   <div data-rail-track className={s.track}>
    {products.map((product,i)=><div className={s.railCard} key={product.id}><span className={s.railIndex} aria-hidden>{String(i+1).padStart(2,'0')}</span><ProductCard product={product} reveal/></div>)}
    {action&&!unavailable.includes(action.href)&&<div className={s.railEnd}><Link href={action.href}>{action.label} <span aria-hidden>→</span></Link></div>}
   </div>
  </div>
 </div>;
}

/** The old sticky image / reading-column geometry, bound to existing story copy.
 * The legacy 121-frame sequence requires a separately mapped media slot. */
export function LegacyMaterialStory({id,heading,body,image,actions}:{id:string;heading:ReactNode;body:ReactNode;image?:ReactNode;actions:ReactNode}){
 return <section id={id} aria-labelledby={id+'-heading'} data-home-chapter="story" data-legacy-material className={s.material}>
  <div className={s.shell}>{heading}<div className={s.materialGrid} data-has-image={!!image}>
   {image&&<Meniscus className={s.materialImage}>{image}</Meniscus>}
   <div className={s.materialCopy}>{body}<div className={s.actions}>{actions}</div></div>
  </div></div>
 </section>;
}

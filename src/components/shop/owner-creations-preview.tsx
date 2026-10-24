import Link from 'next/link';
import type {OwnerCreation} from '@/lib/owner-creation-model';
import s from './owner-creations.module.css';
export function OwnerCreationsPreview({images}:{images:OwnerCreation[]}){
 if(!images.length)return null;
 return <section className={s.section} data-owner-creations="featured" aria-labelledby="owner-creations-heading"><header className={s.heading}><div><p className={s.eyebrow}>Rivya / Creations</p><h2 id="owner-creations-heading">Personal stories.<br/>Artful forms.</h2><p>Explore keepsakes, clocks, floral art and thoughtful gifts in Rivya’s ocean and champagne colours.</p></div><Link href="/creations">Explore all 169 images →</Link></header><div className={s.grid}>{images.map(image=><figure className={s.card} key={image.index}><Link href={'/creations?image='+String(image.index).padStart(3,'0')} aria-label={'View '+image.category+' image '+image.index}>
 {/* Use the approved exact-size WebP variants without re-encoding them. */}
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img className={s.image} src={image.image} srcSet={`${image.small} 640w, ${image.image} 960w, ${image.large} 1600w`} sizes="(max-width:560px) 88vw, (max-width:900px) 44vw, 30vw" width={1600} height={2000} loading="lazy" decoding="async" alt={image.category+' · AI-enhanced presentation '+String(image.index).padStart(3,'0')}/></Link><figcaption className={s.caption}><strong>{image.category}</strong><small>Image {String(image.index).padStart(3,'0')} · AI-enhanced presentation</small></figcaption></figure>)}</div></section>;
}

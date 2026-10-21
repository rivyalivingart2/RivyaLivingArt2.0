import Link from 'next/link';
import type {CSSProperties} from 'react';
import Image from './public-image';
import {SectionBody} from './section-body';
import {LandingGallery} from './landing-gallery';
import {EditorialStructuredData} from './structured-data';
import {ProductCard} from './product-card';
import {editorialDisclosure} from '@/lib/editorial-record-model';
import type {PublishedContentDocument} from '@/lib/published-content';
import s from './legacy-project-document.module.css';
/** OLDWEBSITE portfolio/[slug]: 74svh cover, story/spec split, conditional gallery.
 * Missing records, testimonials and business evidence are never manufactured. */
export function LegacyProjectDocument({document:d}:{document:PublishedContentDocument}){
 const image=d.headerImage?.path||d.image;
 const crop={'--project-desktop-position':d.headerImage?`${d.headerImage.desktop.x}% ${d.headerImage.desktop.y}%`:d.imagePosition,'--project-mobile-position':d.headerImage?`${d.headerImage.mobile.x}% ${d.headerImage.mobile.y}%`:d.imagePosition} as CSSProperties;
 const related=(d.relatedProductIds||[]).flatMap(id=>(d.pageSnapshot?.products||[]).filter(p=>p.id===id));
 const gallery=d.editorial?.gallery?.filter(i=>d.pageSnapshot?.mediaPaths.includes(i.path))||[];
 return <article className={s.project} data-legacy-project lang={d.contentLanguage||'en'}><EditorialStructuredData document={d}/>
  <header className={s.hero} style={crop}>{image&&<Image src={image} alt={d.headerImage?.alt||d.imageAlt||''} fill priority sizes="100vw" style={{objectFit:'cover'}}/>}<div className={s.scrim}/><div className={s.heroCopy}><nav aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/portfolio">Portfolio</Link><span>/</span><span aria-current="page">{d.title}</span></nav><h1>{d.title}</h1><p className={s.eyebrow}>{d.eyebrow}</p>{d.editorial&&<p className={s.disclosure}>{editorialDisclosure(d.editorial)}</p>}</div></header>
  {d.headerImage?.caption&&<p className={s.caption}>{d.headerImage.caption}</p>}
  <div className={s.story}><div><p className={s.eyebrow}>The story</p><h2>{d.title}</h2><p className={s.lede}>{d.description}</p>{d.sections.filter(b=>b.enabled!==false).map(b=><section key={b.id} id={b.id}><h3>{b.heading}</h3><SectionBody section={b} unavailable={d.pageSnapshot?.unavailableActionHrefs} mediaPaths={d.pageSnapshot?.mediaPaths}/></section>)}</div>{!!d.editorial?.details?.length&&<aside><dl>{d.editorial.details.map((v,i)=><div key={i}><dt>{v.label}</dt><dd>{v.value}</dd></div>)}</dl></aside>}</div>
  {!!gallery.length&&<section className={s.gallery} aria-label="Project gallery"><LandingGallery images={gallery} layout="fullscreenGallery"/></section>}
  {d.editorial?.attribution&&<p className={s.gallery}>{d.editorial.attribution}</p>}
  {!!related.length&&<section className={s.gallery} aria-label="Related pieces"><h2>Ideas to explore.</h2><div className={s.related}>{related.map(p=><ProductCard key={p.id} product={p}/>)}</div></section>}
  <section className={s.closing}><p className={s.eyebrow}>Bespoke commissions</p><h2>Have something in mind?</h2><Link href="/commission">Begin your piece ↗</Link><Link href="/portfolio">Return to the portfolio ↗</Link></section>
 </article>;
}

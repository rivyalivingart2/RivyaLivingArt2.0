import Link from 'next/link';
import type {CSSProperties} from 'react';
import Image from './public-image';
import {SectionBody} from './section-body';
import {LandingGallery} from './landing-gallery';
import {EditorialStructuredData} from './structured-data';
import {ProductCard} from './product-card';
import {AtelierWhatsApp} from './legacy-product-actions';
import {editorialDisclosure} from '@/lib/editorial-record-model';
import type {PublishedContentDocument} from '@/lib/published-content';
import s from './legacy-project-document.module.css';
/** OLDWEBSITE portfolio/[slug]: 74svh cover, story/spec split, conditional gallery.
 * Missing records, testimonials and business evidence are never manufactured. */
export function LegacyProjectDocument({document:d}:{document:PublishedContentDocument}){
 const image=d.headerImage?.path||d.image;
 const sections=d.sections.filter(b=>b.enabled!==false),storySections=sections.filter(b=>!['brief','process'].includes(b.id));
 const narrative=(id:string)=>sections.filter(b=>b.id===id).map(b=><section className={s.narrative} data-project-chapter={id} key={b.id} id={b.id}><div className={s.chapterHeading}><p className={s.eyebrow}>{b.heading}</p><h2>{b.heading}</h2></div><SectionBody section={{...b,heading:''}} unavailable={d.pageSnapshot?.unavailableActionHrefs} mediaPaths={d.pageSnapshot?.mediaPaths}/></section>);
 const material=d.editorial?.details?.find(v=>v.label.toLowerCase()==='material')?.value;
 const statLabels=['layers','cure','grit','build','size'],stats=(d.editorial?.details||[]).filter(v=>statLabels.includes(v.label.toLowerCase())),specs=(d.editorial?.details||[]).filter(v=>!statLabels.includes(v.label.toLowerCase()));
 const crop={'--project-desktop-position':d.headerImage?`${d.headerImage.desktop.x}% ${d.headerImage.desktop.y}%`:d.imagePosition,'--project-mobile-position':d.headerImage?`${d.headerImage.mobile.x}% ${d.headerImage.mobile.y}%`:d.imagePosition} as CSSProperties;
 const related=(d.relatedProductIds||[]).flatMap(id=>(d.pageSnapshot?.products||[]).filter(p=>p.id===id));
 const gallery=d.editorial?.gallery?.filter(i=>d.pageSnapshot?.mediaPaths.includes(i.path))||[];
 return <article className={s.project} data-legacy-project lang={d.contentLanguage||'en'}><EditorialStructuredData document={d}/>
  <header className={s.hero} style={crop}>{image&&<Image src={image} alt={d.headerImage?.alt||d.imageAlt||''} fill priority sizes="100vw" style={{objectFit:'cover'}}/>}<div className={s.scrim}/><div className={s.heroCopy}><nav aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li><span aria-hidden>/</span><Link href="/portfolio">Portfolio</Link></li><li><span aria-hidden>/</span><span aria-current="page">{d.title}</span></li></ol></nav><h1>{d.title}</h1><p className={s.eyebrow}>{d.eyebrow}</p>{d.editorial&&<p className={s.disclosure}>{d.editorial.classification==='concept'?<><span>Concept study</span><span aria-hidden>·</span><span>Not a completed customer project</span></>:editorialDisclosure(d.editorial)}</p>}</div></header>
  {d.headerImage?.caption&&<p className={s.caption}>{d.headerImage.caption}</p>}
  <div className={s.story}><div><p className={s.eyebrow}>The story</p><h2>How this piece came to be</h2><p className={s.lede}>{d.description}</p>{storySections.map(b=><section key={b.id} id={b.id}><h3>{b.heading}</h3><SectionBody section={b} unavailable={d.pageSnapshot?.unavailableActionHrefs} mediaPaths={d.pageSnapshot?.mediaPaths}/></section>)}{!!stats.length&&<dl className={s.stats}>{stats.map((v,i)=><div key={i}><dt>{v.label}</dt><dd>{v.value}</dd></div>)}</dl>}</div>{!!specs.length&&<aside><dl>{specs.map((v,i)=><div key={i}><dt>{v.label}</dt><dd>{v.value}</dd></div>)}</dl></aside>}</div>
  {narrative('brief')}
  {material&&<section className={s.narrative} data-project-chapter="material"><p className={s.eyebrow}>The material</p><h2>{material}</h2></section>}
  {narrative('process')}
  {!!gallery.length&&<section className={s.gallery} aria-label="Project gallery"><LandingGallery images={gallery} layout="fullscreenGallery"/></section>}
  {d.editorial?.attribution&&<p className={s.gallery}>{d.editorial.attribution}</p>}
  {!!related.length&&<section className={s.gallery} aria-label="Related pieces"><h2>Ideas to explore.</h2><div className={s.related}>{related.map(p=><ProductCard key={p.id} product={p}/>)}</div></section>}
  <section className={s.closing}><p className={s.eyebrow}>Commission similar</p><h2>Commission a piece like this</h2><div className={s.closingActions}><AtelierWhatsApp/><Link href="/commission">Begin your piece ↗</Link></div></section>
 </article>;
}

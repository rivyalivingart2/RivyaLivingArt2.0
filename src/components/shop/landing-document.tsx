import Link from 'next/link';
import {publishedBusiness} from '@/lib/business-settings';
import type {PublishedContentDocument} from '@/lib/published-content';
import {editorialDisclosure} from '@/lib/editorial-record-model';
import {EditorialImage} from './editorial-image';
import {SectionBody} from './section-body';
import {ProductCard} from './product-card';
import {productCard} from '@/lib/product-card-model';
import {MaterialFilm} from './material-film';
import {materialFilm} from '@/lib/presentation-media';
import {LandingGallery} from './landing-gallery';
import s from './migration-public.module.css';
import shared from './shop.module.css';
import {EditorialEntryCard} from './editorial-entry-card';
export async function LandingDocumentView({document:d}:{document:PublishedContentDocument}){
 const whatsapp=d.landing?.blocks.some(b=>b.enabled&&b.whatsapp)?(await publishedBusiness()).details.whatsapp:null;
 const snapshot=d.pageSnapshot,available=snapshot?.mediaPaths||[],data=snapshot?.landing;
 return <div className={s.landing} data-content-revision={d.publishedRevision}><header className={s.intro}><p>{d.eyebrow}</p><h1>{d.title}</h1><p>{d.description}</p></header>{d.landing?.blocks.filter(b=>b.enabled).map((b,index)=>{
  const entries=data?.entries[b.id]||[],products=(data?.productIds[b.id]||[]).flatMap(id=>snapshot?.products.filter(p=>p.id===id)||[]);
  const gallery=(b.gallery||[]).filter(i=>available.includes(i.path));
  return <section key={b.id} id={b.id} className={s.block} data-block={b.type} data-side={b.side} data-variant={b.variant} aria-labelledby={b.id+'-heading'}>
   <div className={s.blockCopy}>{b.eyebrow&&<p>{b.eyebrow}</p>}<h2 id={b.id+'-heading'}>{b.heading}</h2><SectionBody section={{id:b.id,heading:b.heading,paragraphs:b.paragraphs,body:b.body}} mediaPaths={available}/>{b.action&&!snapshot?.unavailableActionHrefs?.includes(b.action.href)&&<Link className={shared.button} href={b.action.href}>{b.action.label}</Link>}{b.whatsapp&&whatsapp&&<a className={shared.textLink} href={'https://wa.me/'+whatsapp} target="_blank" rel="noreferrer">Open WhatsApp</a>}</div>
   {b.image&&<EditorialImage usage={b.image} available={available.includes(b.image.path)} priority={index===0&&b.type==='hero'}/>}
   {b.type==='productGrid'&&<div className={shared.grid}>{products.map(p=><ProductCard key={p.id} product={productCard(p)}/>)}</div>}
   {b.type==='faqPicker'&&<div className={s.answers}>{entries.map(entry=><details key={entry.id}><summary>{entry.title}</summary>{entry.sections.map(section=><SectionBody key={section.id} section={section} unavailable={snapshot?.unavailableActionHrefs} mediaPaths={available}/>)}</details>)}</div>}
   {['collectionGrid','portfolioGrid','journalGrid'].includes(b.type)&&<div className={s.entries}>{entries.map(entry=><EditorialEntryCard key={entry.id} entry={entry} mediaPaths={available}/>)}</div>}
   {['testimonial','testimonialGrid'].includes(b.type)&&<div className={s.quotes}>{entries.map(entry=><figure key={entry.id}>{entry.editorial&&<p className={s.disclosure}>{editorialDisclosure(entry.editorial)}</p>}<blockquote>{entry.sections.map(section=><SectionBody key={section.id} section={section}/>)}</blockquote><figcaption>{entry.editorial?.attribution||entry.title}</figcaption></figure>)}</div>}
   {['videoHero','videoStory'].includes(b.type)&&b.film==='resin-pour'&&<MaterialFilm film={materialFilm}/>}
   {['masonryGallery','bentoGallery','fullscreenGallery'].includes(b.type)&&<LandingGallery images={gallery} layout={b.type as 'masonryGallery'|'bentoGallery'|'fullscreenGallery'}/>}
  </section>;
 })}</div>;
}

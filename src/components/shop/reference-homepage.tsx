import type {ReactNode} from 'react';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import type {ContentDocument} from '@/lib/content-model';
import type {HomeSectionType} from '@/lib/homepage-model';
import {referenceSectionStates,type HomeComposition,type HomeReferenceKey,type HomeReferenceSnapshot,type ReferenceOffering} from '@/lib/home-reference-model';
import {localizeHomeReference} from '@/lib/home-reference-dependencies';
import type {Locale} from '@/lib/site-settings-model';
import {journeyText} from '@/lib/journey-text';
import {SectionNavigation} from './section-navigation';
import {SectionBody} from './section-body';
import {EditorialImage} from './editorial-image';
import Image from './public-image';
import {JourneyText} from './journey-language';
import {ProductCard} from './product-card';
import s from './shop.module.css';
import r from './reference-homepage.module.css';

function PageImage({document:d}:{document:ContentDocument}){
 const deps=d.pageSnapshot;
 if(d.headerImage)return <EditorialImage usage={d.headerImage} available={deps?.mediaPaths.includes(d.headerImage.path)} sizes="(max-width: 780px) 90vw, 45vw"/>;
 if(!deps?.image)return null;
 return <figure className={r.pageImage}><div><Image src={deps.image.path} alt={deps.image.alt} fill style={{objectFit:'cover',objectPosition:deps.image.position}} sizes="(max-width: 780px) 90vw, 45vw"/></div><figcaption><JourneyText text="Design visualization"/></figcaption></figure>;
}
function PageBand({document:d,kind}:{document?:ContentDocument;kind:'scope'|'atelier'|'principles'|'commission'}){
 if(!d)return null;
 const sections=d.sections.filter(s=>s.enabled!==false);
 return <section className={r.band} data-band={kind}><header className={r.heading}><div><p className={r.eyebrow}>{d.eyebrow}</p><h2>{d.title}</h2></div><p>{d.description}</p></header>
  {kind==='atelier'?<div className={r.atelier}><PageImage document={d}/><div>{sections.slice(0,1).map(section=><div key={section.id}><h3>{section.heading}</h3><SectionBody section={section} unavailable={d.pageSnapshot?.unavailableActionHrefs} mediaPaths={d.pageSnapshot?.mediaPaths}/></div>)}<Link className={s.textLink} href={d.route}>{d.title} <ArrowUpRight aria-hidden size={18}/></Link></div></div>:
   kind==='commission'?<div className={r.commission}><PageImage document={d}/><Link className={s.button} href={d.route}><JourneyText text="Begin your piece"/> <ArrowUpRight aria-hidden size={18}/></Link></div>:
    <div className={r.tileGrid}>{sections.map(section=><article key={section.id}>{section.image&&<EditorialImage usage={section.image} available={d.pageSnapshot?.mediaPaths.includes(section.image.path)}/>}<h3>{section.heading}</h3><SectionBody section={section} unavailable={d.pageSnapshot?.unavailableActionHrefs} mediaPaths={d.pageSnapshot?.mediaPaths}/></article>)}</div>}
  {kind==='scope'&&<Link className={s.textLink} href={d.route}>{d.title} <ArrowUpRight aria-hidden size={18}/></Link>}
 </section>;
}
function OfferingBand({offering,mediaPaths}:{offering?:ReferenceOffering;mediaPaths:string[]}){
 if(!offering?.confirmationSource)return null;
 return <section className={r.band+' '+r.offering}><div><h2>{offering.title}</h2><p>{offering.description}</p><dl className={r.facts}>{offering.facts.map(fact=><div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl><Link className={s.button} href={offering.href}>{offering.title} <ArrowUpRight aria-hidden size={18}/></Link></div>{offering.image&&<EditorialImage usage={offering.image} available={mediaPaths.includes(offering.image.path)}/>}</section>;
}
function CollectionDoors({document:d}:{document:ContentDocument}){
 const h=d.homepage!,snapshot=d.homeSnapshot!,block=h.sections.find(b=>b.type==='categories'&&b.enabled&&!b.contentNeeded),copy=d.sections.find(s=>s.id===block?.id);
 if(!block||!copy)return null;
 const categories=block.categories?.length?block.categories.flatMap(name=>snapshot.categories.filter(c=>c.name===name)):snapshot.categories;
 const card=(category:typeof categories[number])=>{const image=snapshot.products.find(p=>p.category===category.name);return <Link key={category.name} href={'/search?category='+encodeURIComponent(category.name)} className={r.door} data-collection-door>{image?<Image src={image.image} alt={image.imageAlt||image.name} fill sizes="(max-width: 780px) 90vw, 34vw" style={{objectFit:'cover',objectPosition:image.imagePosition}}/>:<span className={r.monogram} aria-hidden>{category.name.slice(0,1)}</span>}<span className={r.doorCopy}><span>{category.count} <JourneyText text={category.count===1?'piece':'pieces'}/></span><strong>{category.name}</strong><ArrowUpRight aria-hidden size={20}/></span></Link>;};
 return <section id={block.id} className={r.band}><header className={r.heading}><div><p className={r.eyebrow}>{block.eyebrow}</p><h2>{copy.heading}</h2></div><SectionBody section={copy} mediaPaths={snapshot.mediaPaths} unavailable={snapshot.unavailableActionHrefs}/></header><div className={r.doors}>{categories.slice(0,6).map(card)}</div>{categories.length>6&&<details className={r.more}><summary><JourneyText text="Explore the collection"/> ({categories.length})</summary><div className={r.categoryList}>{categories.slice(6).map(category=><Link key={category.name} href={'/search?category='+encodeURIComponent(category.name)}>{category.name} <span>{category.count} <JourneyText text={category.count===1?'piece':'pieces'}/></span></Link>)}</div></details>}</section>;
}
/** Eighteen distinct source slots; unavailable records stay absent on public pages. */
export function ReferenceHomepage({document:d,reference:raw,composition,locale,hero,manifesto,renderExisting}:{document:ContentDocument;reference:HomeReferenceSnapshot;composition:HomeComposition;locale:Locale;hero:ReactNode;manifesto:'strip'|'statement';renderExisting:(type:HomeSectionType)=>ReactNode}){
 const reference=localizeHomeReference(raw,locale),states=referenceSectionStates(d,reference,composition),home=d.homepage!,snapshot=d.homeSnapshot!;
 const page=(route:string)=>reference.pages.find(p=>p.document.route===route)?.document;
 const selectedIds=home.sections.find(b=>b.type==='selected'&&b.enabled)?.productIds||[];
 const selected=selectedIds.flatMap(id=>snapshot.products.filter(p=>p.id===id));
 const mediaPaths=reference.mediaPaths||[];
 const nodes:Record<HomeReferenceKey,ReactNode>={
  pour:hero,
  manifesto:<section className={r.manifesto} data-density={manifesto}><h2>{home.strip[0]}<br/>{home.strip[1]}</h2><p>{home.strip[2]}</p></section>,
  pieces:renderExisting('selected'),
  'large-format':<PageBand document={page('/architects')} kind="scope"/>,
  material:renderExisting('story'),
  collections:<div className={r.collections}><CollectionDoors document={d}/>{renderExisting('journeys')}</div>,
  furniture:<section className={r.band}><header className={r.heading}><h2><JourneyText text="Furniture & spatial art"/></h2><p><JourneyText text="Design visualization"/></p></header><div className={r.concepts}>{selected.map(p=><ProductCard key={p.id} product={p}/>)}</div></section>,
  maker:<PageBand document={page('/our-story')} kind="atelier"/>,
  rooms:<section className={r.band}><header className={r.heading}><h2>{d.sections.find(s=>home.sections.some(b=>b.id===s.id&&b.type==='journeys'))?.heading||d.title}</h2><p><JourneyText text="Design visualization"/></p></header><div className={r.roomGrid}>{selected.filter(p=>p.scene).map(p=><figure key={p.id}><div><Image src={p.scene!} alt={p.sceneAlt||p.name} fill sizes="(max-width: 780px) 90vw, 45vw" style={{objectFit:'cover',objectPosition:p.scenePosition}}/></div><figcaption>{p.name} · <JourneyText text="Design visualization"/></figcaption></figure>)}</div></section>,
  work:<section className={r.band}><header className={r.heading}><h2><JourneyText text="Portfolio"/></h2></header><div className={r.portfolio}>{reference.portfolio?.map(item=><article key={item.id}><p className={r.disclosure}>{item.classification==='concept'?'Concept project · not a completed commission':'Documented project'}</p>{item.image&&<EditorialImage usage={item.image} available={mediaPaths.includes(item.image.path)}/>}<h3><Link href={item.href}>{item.title}</Link></h3><p>{item.description}</p></article>)}</div></section>,
  words:<section className={r.band}><header className={r.heading}><h2><JourneyText text="Testimonials"/></h2></header><div className={r.quotes}>{reference.feedback?.map(item=><figure key={item.id}><p className={r.disclosure}>{item.classification==='fictional-sample'?'Fictional sample · not customer feedback':'Approved customer feedback'}</p>{item.image&&<EditorialImage usage={item.image} available={mediaPaths.includes(item.image.path)}/>}<blockquote><p>{item.quote}</p></blockquote><figcaption>{item.classification==='fictional-sample'?'Illustrative voice':item.attribution}</figcaption></figure>)}</div></section>,
  bespoke:<PageBand document={page('/commission')} kind="commission"/>,
  workshops:<OfferingBand offering={reference.workshops} mediaPaths={mediaPaths}/>,
  print:<OfferingBand offering={reference.printing} mediaPaths={mediaPaths}/>,
  process:renderExisting('steps'),
  why:<PageBand document={page('/our-story')} kind="principles"/>,
  journal:renderExisting('journal'),
  closing:renderExisting('invitation'),
 };
 const visible=states.filter(s=>s.visible);
 return <div className={r.reference} data-home-composition="reference"><SectionNavigation label={journeyText(locale,'On this page')} items={visible.map(s=>({id:'home-'+s.key,label:s.heading}))}/>{visible.map(slot=><div id={'home-'+slot.key} data-home-slot={slot.key} key={slot.key} className={r.slot}>{nodes[slot.key]}</div>)}</div>;
}

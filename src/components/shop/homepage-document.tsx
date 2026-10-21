import {localizeSnapshot} from '@/lib/editorial-language-presentation';
import {journeyText} from '@/lib/journey-text';
import type {Locale} from '@/lib/site-settings-model';
import {JourneyText} from './journey-language';
import {ArrowUpRight} from 'lucide-react';
import {SectionBody} from './section-body';
import {sharedCopyValues,type SharedCopy} from '@/lib/shared-copy-model';
import Link from 'next/link';
import type {ContentDocument} from '@/lib/content-model';
import type {HomeAction,HomeSnapshot,HomeSection} from '@/lib/homepage-model';
import {HeroImage} from './hero-image';
import Image from './public-image';
import {EditorialImage} from './editorial-image';
import s from './shop.module.css';
import h from './homepage.module.css';
import m from './modern-homepage.module.css';
import legacy from './legacy-home.module.css';
import {HomepageMotion} from './homepage-motion';
import type {HomepageLayout} from '@/lib/presentation-model';
import type {HomeReferenceSnapshot} from '@/lib/home-reference-model';
import {ReferenceHomepage} from './reference-homepage';
import {MaterialFilm} from './material-film';
import {CinematicVideo} from './cinematic-video';
import {LegacyFeaturedRail,LegacyMaterialStory} from './legacy-home-sections';
import {LegacyJournalList} from './legacy-journal-list';
import {referenceComposition} from '@/lib/home-reference-model';
import atmosphere from './section-atmosphere.module.css';
import type {PresentationFilm} from '@/lib/presentation-media';
const Action=({action,primary=false,unavailable=[]}:{action?:HomeAction;primary?:boolean;unavailable?:string[]})=>action&&!unavailable.includes(action.href)?<Link className={primary?s.button:s.textLink} href={action.href}>{action.label} <ArrowUpRight aria-hidden="true" size={16} className={s.linkArrow}/></Link>:null;
function CategoryRow({category:c,index}:{category:HomeSnapshot['categories'][number];index:number}){return <Link href={'/search?category='+encodeURIComponent(c.name)} className={s.categoryRow+' '+h.categoryRow}><span className={s.categoryIndex}>{String(index+1).padStart(2,'0')}</span><h3>{c.name}</h3><span className={s.categoryCount}>{c.count}{' '}<JourneyText text={c.count===1?'piece':'pieces'}/></span><ArrowUpRight aria-hidden="true" size={20} className={s.linkArrow}/></Link>;}
/** Both the public route and the authorized saved-revision preview use this component. */
export function HomepageDocument({document:d,revision,copy:labels=sharedCopyValues(),locale='en',presentation,reference,film}:{document:ContentDocument;revision:number;copy?:SharedCopy;locale?:Locale;presentation?:{layout:HomepageLayout;version:number}|null;reference?:HomeReferenceSnapshot;film?:PresentationFilm}){
 const home=d.homepage!,snapshot=localizeSnapshot(d.homeSnapshot!,locale);
 const lead=snapshot.products.find(p=>p.id===home.heroProductId);
 const visibleSections=home.sections.filter(b=>b.enabled&&!b.contentNeeded&&(b.type!=='selected'||b.productIds?.some(id=>snapshot.products.some(p=>p.id===id)))&&(b.type!=='journal'||b.articleIds?.some(id=>snapshot.articles.some(a=>a.id===id))));
 const renderBlock=(block:HomeSection)=>{
   const copy=d.sections.find(b=>b.id===block.id)!;
   const body=<SectionBody section={copy} unavailable={snapshot.unavailableActionHrefs} mediaPaths={snapshot.mediaPaths}/>;
   const heading=<><span className={s.eyebrow}>{block.eyebrow}</span><h2 id={block.id+'-heading'}>{copy.heading}</h2></>;
   const selected=(block.productIds||[]).flatMap(id=>{const p=snapshot.products.find(p=>p.id===id);return p?[p]:[];});
   const articles=(block.articleIds||[]).flatMap(id=>{const a=snapshot.articles.find(a=>a.id===id);return a?[a]:[];});
   if((block.type==='selected'&&!selected.length)||(block.type==='journal'&&!articles.length))return null;
   if(block.type==='story')return <div key={block.id}><LegacyMaterialStory id={block.id} heading={heading} body={body} image={block.image?<EditorialImage usage={block.image} available={snapshot.mediaPaths.includes(block.image.path)}/>:undefined} actions={<><Action unavailable={snapshot.unavailableActionHrefs} action={block.action}/><Action unavailable={snapshot.unavailableActionHrefs} action={block.secondaryAction}/></>}/>{film&&<MaterialFilm film={film}/>}</div>;
   if(block.type==='invitation')return <section key={block.id} id={block.id} aria-labelledby={block.id+'-heading'} data-home-chapter="invitation" className={s.invitation+' '+h.closing}>{heading}{body}<div className={s.actions}><Action unavailable={snapshot.unavailableActionHrefs} action={block.action} primary/><Action unavailable={snapshot.unavailableActionHrefs} action={block.secondaryAction}/></div></section>;
   if(block.type==='selected')return <section key={block.id} id={block.id} aria-labelledby={block.id+'-heading'} data-home-chapter="selected" ><LegacyFeaturedRail products={selected} label={copy.heading} action={block.action} unavailable={snapshot.unavailableActionHrefs} heading={<div className={legacy.sectionHeading}><div>{heading}{body}</div></div>}/></section>;
   if(block.type==='journal')return <section key={block.id} id={block.id} aria-labelledby={block.id+'-heading'} data-home-chapter="journal" ><div className={legacy.shell}><div className={legacy.sectionHeading}><div>{heading}{body}</div><Action unavailable={snapshot.unavailableActionHrefs} action={block.action}/></div><LegacyJournalList rows={articles.map(a=>({id:a.id,href:a.route,title:a.title,description:a.description,category:a.eyebrow,readingTime:Math.max(1,Math.ceil([a.description,...a.sections.flatMap(b=>b.paragraphs)].join(' ').split(/\s+/).length/200))+' '+journeyText(locale,'min'),image:a.image,imageAlt:a.imageAlt,imagePosition:a.imagePosition}))}/></div></section>;
   const categories=block.categories?.length?block.categories.flatMap(name=>snapshot.categories.filter(c=>c.name===name)):snapshot.categories;
   return <section key={block.id} id={block.id} aria-labelledby={block.id+'-heading'} data-chapter-type={block.type} data-home-chapter={block.type} className={s.section+' '+h.chapter+(block.type==='journeys'?' '+s.green:'')}><div className={s.sectionHead+' '+h.chapterHeader}><div>{heading}</div><div>{body}</div><Action unavailable={snapshot.unavailableActionHrefs} action={block.action}/></div>
    {block.type==='categories'&&<><div className={s.categoryRows}>{categories.slice(0,6).map((c,i)=><CategoryRow key={c.name} category={c} index={i}/>)}</div>{categories.length>6&&<details className={h.moreCategories}><summary>{labels['show-categories']} ({categories.length})</summary><div className={s.categoryRows}>{categories.slice(6).map((c,i)=><CategoryRow key={c.name} category={c} index={i+6}/>)}</div></details>}</>}
    {block.type==='steps'&&<ol className={s.processGrid+' '+h.steps}>{block.items?.map((item,i)=><li key={item.id}><span className={h.stepNumber} aria-hidden="true">{String(i+1).padStart(2,'0')}</span><h3>{item.title}</h3><p>{item.body}</p><Action unavailable={snapshot.unavailableActionHrefs} action={item.action}/></li>)}</ol>}
    {block.type==='journeys'&&<div className={s.worlds}>{block.items?.map(item=>{const product=snapshot.products.find(p=>p.id===item.productId);return <div key={item.id} className={s.world+' '+h.journey}>{item.image?<EditorialImage usage={item.image} available={snapshot.mediaPaths.includes(item.image.path)} sizes="(max-width: 780px) 90vw, 30vw"/>:<div className={s.worldImage}>{product?<Image src={product.image} alt={product.imageAlt||product.name} fill sizes="(max-width: 780px) 90vw, 30vw" style={{objectFit:'cover',objectPosition:product.imagePosition}}/>:<span className={s.imageUnavailable}><JourneyText text="Image unavailable"/></span>}</div>}<h3>{item.title}</h3><p>{item.body}</p><Action unavailable={snapshot.unavailableActionHrefs} action={item.action}/></div>;})}</div>}
   </section>;
 };
 const hero=<section className={s.hero+' '+m.hero} data-home-hero-section data-has-film={!!film}><div data-legacy-hero-copy className={s.heroCopy+' '+m.heroCopy}><span className={s.eyebrow}>{d.eyebrow}</span><h1>{d.title}</h1><p>{d.description}</p><div className={s.actions}><Action unavailable={snapshot.unavailableActionHrefs} action={home.primary} primary/><Action unavailable={snapshot.unavailableActionHrefs} action={home.secondary}/></div><span className={s.heroAnnotation}>{home.annotation}</span></div><div data-legacy-hero-visual className={[s.heroVisual,m.heroVisual,home.heroImage?h.editorialVisual:null].filter(Boolean).join(' ')} data-home-parallax={!film||undefined}>{film?<CinematicVideo film={film} priority controlClassName={m.heroFilmControl}/>:home.heroImage?<div className={h.heroEditorial}><EditorialImage usage={{...home.heroImage,caption:''}} available={snapshot.mediaPaths.includes(home.heroImage.path)} priority sizes="100vw"/></div>:<div className={s.heroImage+' '+m.heroImage}>{lead?<HeroImage portrait={lead.image} landscape={lead.scene||lead.image} name={lead.name} portraitPosition={lead.imagePosition} landscapePosition={lead.scenePosition||lead.imagePosition} sizes="100vw"/>:<span className={s.heroImageFallback}>{labels['hero-fallback']}</span>}</div>}</div>{film&&<span className={m.filmLabel}>Material visualization</span>}{home.heroImage?.caption&&<p className={m.heroCaption}>{home.heroImage.caption}</p>}{!home.heroImage&&lead&&<div className={s.heroNote+' '+m.heroNote}><div><span>{lead.id} / <JourneyText text="Design visualization"/></span><p>{lead.name}</p></div><Link href={'/pieces/'+lead.slug}>{labels['discover-piece']} <ArrowUpRight aria-hidden="true" size={16} className={s.linkArrow}/></Link></div>}</section>;
 const manifesto=<div className={s.strip}>{home.strip.map((text,i)=><span key={i}>{text}</span>)}</div>;
 return <HomepageMotion><div data-home-revision={revision} data-presentation-revision={presentation?.version} data-home-hero={presentation?.layout.hero} data-home-manifesto={presentation?.layout.manifesto} data-home-featured={presentation?.layout.featured} className={h.home+' '+m.home+' '+atmosphere.canvas+' '+legacy.home}>
 {reference?<ReferenceHomepage document={{...d,homeSnapshot:snapshot}} reference={reference} composition={presentation?.layout.composition||referenceComposition()} locale={locale} hero={hero} manifesto="statement" renderExisting={type=>visibleSections.filter(b=>b.type===type).map(renderBlock)}/>:<>
 {hero}{manifesto}
 <nav className={h.contents} aria-label={journeyText(locale,"On this page")}><details><summary>{labels['footerExplore']} <span>{visibleSections.length}</span></summary><ol>{visibleSections.map(b=><li key={b.id}><a href={'#'+b.id}>{d.sections.find(s=>s.id===b.id)?.heading}</a></li>)}</ol></details></nav>
 {visibleSections.map(renderBlock)}</>}
 </div></HomepageMotion>;
}

import {localizeSnapshot} from '@/lib/editorial-language-presentation';
import {JourneyText} from './journey-language';
import {journeyText} from '@/lib/journey-text';
import {ArrowUpRight} from 'lucide-react';
import {JournalBrowser} from './journal-browser';
import {FaqBrowser} from './faq-browser';
import {EditorialChapter} from './editorial-chapter';
import e from './editorial-reading.module.css';
import {EditorialImage} from './editorial-image';
import {SectionBody} from './section-body';
import type {PageSnapshot} from '@/lib/page-dependencies';
import Image from './public-image';
import {bindImprintContacts,imprintContactId} from '@/lib/imprint-content';
import {publishedBusiness} from '@/lib/business-settings';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {publishedContent} from '@/lib/published-content';
import {publishedProducts} from '@/lib/shop-catalogue';
import {ProductCard} from './product-card';
import {imageSizes} from './image-sizes';
import type {PublishedContentDocument} from '@/lib/published-content';
import {EditorialStructuredData} from './structured-data';
import type {ContentDocument} from '@/lib/content-model';
import type {Locale} from '@/lib/site-settings-model';
import s from './shop.module.css';

function Intro({eyebrow,title,children}:{eyebrow:string;title:string;children?:React.ReactNode}){return <header className={s.pageIntro+' '+e.intro}><span className={s.eyebrow}>{eyebrow}</span><h1>{title}</h1>{children&&<p>{children}</p>}</header>;}
const minutes=(a:ContentDocument)=>Math.max(1,Math.ceil([a.description,...a.sections.flatMap(b=>[b.heading,...b.paragraphs,...(b.checklist||[])])].join(' ').trim().split(/\s+/).length/200));
export function ArticleCard({article:a}:{article:PublishedContentDocument}){return <Link className={s.card+' '+e.articleCard} prefetch={false} href={a.route}>{a.image&&<div className={`${s.cardImage} ${s.articleCardImage}`}><Image src={a.image} alt={a.imageAlt||''} style={{objectPosition:a.imagePosition}} fill sizes={imageSizes.card}/></div>}<p>{a.eyebrow} · <span className={s.productIndex} style={{display:'inline',margin:0}}>{minutes(a)} <JourneyText text="min read"/></span></p><h3>{a.title}</h3><p>{a.description}</p><span className={s.textLink}><JourneyText text="Read the story"/> <ArrowUpRight aria-hidden="true" size={16} className={s.linkArrow}/></span></Link>;}
const policies:Record<string,string>={'/privacy':'Privacy','/terms':'Ordering terms','/shipping-delivery':'Delivery','/returns-cancellations':'Changes & cancellations','/accessibility':'Accessibility','/imprint':'Imprint'};
const nextSteps:Record<string,[string,string,string,string]>={
 '/our-story':['/collectible-design','Explore furniture & spatial art','/process','How a piece begins'],
 '/process':['/commission','Begin your piece','/faq','Read your questions'],
 '/materials-care':['/collectible-design','Explore the collection','/contact','Ask about your piece'],
 '/architects':['/commission/customize','Prepare a project brief','/materials-care','Explore materials & care'],
 '/faq':['/commission','Begin your piece','/contact','Call or email the atelier']
};
export async function EditorialPage({route,locale='en'}:{route:string;locale?:Locale}){
 const documents=await publishedContent(locale,undefined,route),articles=documents.filter(d=>d.kind==='article');
 if(route==='/journal'&&documents.some(d=>d.route===route)){return <JournalDocument content={documents.find(d=>d.route===route)!} locale={locale}/>;}
 if(route==='/journal'){
  const categories=[...new Set(articles.map(a=>a.eyebrow))];
  return <div className={e.editorial+' '+e.journal}><Intro eyebrow="The journal" title="A closer look.">Notes on material, proportion and the things that make an object personal.</Intro>
   {categories.length>1&&<nav className={s.journalTopics} aria-label={journeyText(locale,"Journal topics")}>{categories.map((category,i)=><a key={category} href={'#journal-topic-'+i}>{category}<span>{articles.filter(a=>a.eyebrow===category).length}</span></a>)}</nav>}
   {articles.length?categories.map((category,i)=><section className={s.section} id={'journal-topic-'+i} key={category} aria-labelledby={'journal-heading-'+i}><div className={s.sectionHead}><h2 id={'journal-heading-'+i}>{category}</h2></div><div className={s.grid}>{articles.filter(a=>a.eyebrow===category).map(a=><ArticleCard key={a.id} article={a}/>)}</div></section>):<section className={s.section}><div className={s.empty}><h2>No journal stories are published yet.</h2><p>Explore the material guide or prepare the first notes for your piece.</p><div className={s.actions}><Link className={s.button} href="/materials-care"><JourneyText text="Materials & care"/> <ArrowUpRight aria-hidden="true" size={16} className={s.linkArrow}/></Link><Link className={s.textLink} href="/process"><JourneyText text="How it works"/></Link></div></div></section>}
  </div>;
 }
 const content=documents.find(d=>d.route===route);if(!content)notFound();
 return <EditorialDocument content={content} documents={documents} locale={locale}/>;
}
export function JournalDocument({content:d,locale='en'}:{content:PublishedContentDocument;locale?:Locale}){
 const articles=(d.pageSnapshot?localizeSnapshot(d.pageSnapshot,locale).articles:[]).map(a=>({...a,kind:'article' as const}));
 return <div className={e.editorial+' '+e.journal} data-content-revision={d.publishedRevision}><Intro eyebrow={d.eyebrow} title={d.title}>{d.description}</Intro>{d.sections.filter(s=>s.enabled!==false).map(b=><div key={b.id} className={s.prose+' '+e.journalLead}><h2>{b.heading}</h2><SectionBody section={b} unavailable={d.pageSnapshot?.unavailableActionHrefs} mediaPaths={d.pageSnapshot?.mediaPaths}/></div>)}<JournalBrowser featuredIds={d.featuredArticleIds} items={articles.map(a=>({id:a.id,title:a.title,topic:a.eyebrow,search:[a.title,a.description,a.eyebrow].join(' '),card:<ArticleCard article={a}/>}))}/></div>;
}
/** Shared by public pages and authenticated saved-revision previews. */
export async function EditorialDocument({content:source,documents,locale='en',snapshot}:{content:PublishedContentDocument;documents:PublishedContentDocument[];locale?:Locale;snapshot?:PageSnapshot}){
 const tr=(text:string)=>journeyText(locale,text);
 const route=source.route,articles=documents.filter(d=>d.kind==='article');
 const business=route==='/contact'||!!policies[route]?(await publishedBusiness()).details:null;
 const bound=business?bindImprintContacts(source,business):source;
 const content={...bound,sections:bound.sections.filter(b=>b.enabled!==false)};
 const article=content.kind==='article',faq=route==='/faq',policy=!!policies[route],story=route.startsWith('/p/')||['/our-story','/process','/materials-care','/architects'].includes(route);
 const routeAvailable=(href:string)=>['/','/commission','/journal','/collectible-design','/commission/customize'].includes(href)||(snapshot||source.pageSnapshot)?.availableRoutes?.includes(href)||(!(snapshot||source.pageSnapshot)?.availableRoutes&&documents.some(d=>d.route===href));
 const products=snapshot?.products||source.pageSnapshot?.products||(content.relatedProductIds?.length?await publishedProducts(locale):[]);
 const related=(content.relatedProductIds||[]).flatMap(id=>products.filter(p=>p.id===id));
 const deps=snapshot||source.pageSnapshot;
 const more=articles.filter(a=>a.id!==content.id).sort((a,b)=>Number(b.eyebrow===content.eyebrow)-Number(a.eyebrow===content.eyebrow)).slice(0,3);
 const next=nextSteps[route]||['/commission','Begin your piece','/journal','Return to the journal'];
 return <div className={e.editorial+(policy?' '+e.policy:'')+(policy||route==='/materials-care'?' '+e.printable:'')} data-editorial={article?'article':route.slice(1)} data-content-revision={source.publishedRevision}>
  <EditorialStructuredData document={content}/>
  <nav className={s.editorialBreadcrumb} aria-label={tr("Breadcrumb")}><Link href="/"><JourneyText text="Home"/></Link><span aria-hidden="true">/</span>{article&&<><Link href="/journal"><JourneyText text="Journal"/></Link><span aria-hidden="true">/</span></>}<span aria-current="page">{content.title}</span></nav>
  <div className={e.opening} data-split={story&&!!(content.headerImage||content.image)}>
   <Intro eyebrow={content.eyebrow} title={content.title}>{content.description}</Intro>
   {content.headerImage?<div className={e.leadImage}><EditorialImage usage={content.headerImage} available={deps?.mediaPaths.includes(content.headerImage.path)} priority sizes={story?'(max-width: 780px) 90vw, 42vw':'(max-width: 1200px) 90vw, 1080px'}/></div>:content.image&&<div className={e.leadImage}><figure className={e.legacyImage}><Image src={content.image} alt={content.imageAlt||''} style={{objectPosition:content.imagePosition}} fill priority sizes={story?'(max-width: 780px) 90vw, 42vw':imageSizes.story}/><figcaption><JourneyText text="Design visualization"/></figcaption></figure></div>}
  </div>
  {policy&&<p className={e.effective}>{content.effectiveDate?tr('Effective')+' '+content.effectiveDate:tr('Effective date not recorded')}</p>}
  {route==='/contact'&&business&&<div className={e.contactPanel}><div className={s.contactCards+' '+e.contactCards}><a href={'tel:'+business.phone}><span><JourneyText text="Call the atelier"/></span>{business.phone}</a><a href={'mailto:'+business.email}><span><JourneyText text="General questions & existing inquiries"/></span>{business.email}</a><a href={business.map} target="_blank" rel="noreferrer"><span><JourneyText text="Location"/></span><JourneyText text="Open the atelier map"/> <ArrowUpRight aria-hidden="true" size={16} className={s.linkArrow}/></a><Link href="/commission"><span><JourneyText text="Product & custom-piece requests"/></span><JourneyText text="Prepare your saved order brief"/> <ArrowUpRight aria-hidden="true" size={16} className={s.linkArrow}/></Link></div>{routeAvailable('/faq')&&<p><Link className={s.textLink} href="/faq"><JourneyText text="Read common questions before you write"/> <ArrowUpRight aria-hidden="true" size={16} className={s.linkArrow}/></Link></p>}</div>}
  {story&&<><nav className={e.chapterNav} aria-label={tr("On this page")}><details><summary><JourneyText text="On this page"/></summary><ol>{content.sections.map(b=><li key={b.id}><a href={'#'+b.id}>{b.heading}</a></li>)}</ol></details></nav>{content.sections.map(b=><EditorialChapter key={b.id} section={b} unavailable={deps?.unavailableActionHrefs} mediaPaths={deps?.mediaPaths}/>)}</>}
  <div className={s.readingLayout+' '+e.reading}>{!story&&!faq&&content.sections.length>2&&<nav className={s.contents+' '+e.contents} aria-label={tr("On this page")}><p><JourneyText text="On this page"/></p>{content.sections.map(b=><a key={b.id} href={'#'+b.id}>{b.heading}</a>)}</nav>}
   <div className={s.prose+' '+e.prose}>{article&&<p className={s.eyebrow}><JourneyText text="By RivyaLivingArt"/> · <span className={s.productIndex} style={{display:'inline',margin:0}}>{minutes(content)} <JourneyText text="minute read"/></span></p>}
    {faq&&<FaqBrowser sections={content.sections} unavailable={deps?.unavailableActionHrefs} mediaPaths={deps?.mediaPaths}/>}
    {!story&&!faq&&content.sections.map(b=><section id={b.id} key={b.id}>{b.stage&&<p className={s.eyebrow}>{tr(b.stage==='customer'?'Customer steps':'Making steps')}</p>}<h2>{b.heading}</h2>{!(route==='/imprint'&&b.id===imprintContactId)&&<SectionBody section={b} unavailable={deps?.unavailableActionHrefs} mediaPaths={deps?.mediaPaths}/>} {route==='/imprint'&&b.id===imprintContactId&&business&&<dl className={s.imprintContacts}><div><dt><JourneyText text="Telephone"/></dt><dd><a href={'tel:'+business.phone}>{business.phone}</a></dd></div><div><dt><JourneyText text="Email"/></dt><dd><a href={'mailto:'+business.email}>{business.email}</a></dd></div></dl>}</section>)}
    {policy?<><nav className={s.policyLinks} aria-label={tr("Policies and help")}>{Object.entries(policies).filter(([p])=>p!==route&&routeAvailable(p)).map(([p,label])=><Link key={p} href={p}>{tr(label)}</Link>)}</nav><div className={s.actions}><Link className={s.button} href="/contact"><JourneyText text="Contact the atelier"/> <ArrowUpRight aria-hidden="true" size={16} className={s.linkArrow}/></Link>{business&&<a className={s.textLink} href={'mailto:'+business.email}><JourneyText text="Email about this page"/></a>}</div></>:route!=='/contact'&&<div className={s.actions}>{routeAvailable(next[0])&&<Link className={s.button} href={next[0]}>{tr(next[1])} <ArrowUpRight aria-hidden="true" size={16} className={s.linkArrow}/></Link>}{routeAvailable(next[2])&&<Link className={s.textLink} href={next[2]}>{tr(next[3])}</Link>}</div>}

   </div>
  </div>
  {related.length>0&&<section className={s.section}><div className={s.sectionHead}><h2><JourneyText text="Ideas to explore."/></h2></div><div className={s.grid}>{related.map(p=><ProductCard key={p.id} product={p}/>)}</div></section>}
  {article&&more.length>0&&<section className={s.section}><div className={s.sectionHead}><h2><JourneyText text="Keep exploring."/></h2><Link className={s.textLink} href="/journal"><JourneyText text="All stories"/> <ArrowUpRight aria-hidden="true" size={16} className={s.linkArrow}/></Link></div><div className={s.grid}>{more.map(a=><ArticleCard key={a.id} article={a}/>)}</div></section>}
 </div>;
}

import Image from './public-image';
import {publishedBusiness} from '@/lib/business-settings';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {publishedContent} from '@/lib/published-content';
import {publishedProducts} from '@/lib/shop-catalogue';
import {ProductCard} from './catalogue-browser';
import {EditorialStructuredData} from './structured-data';
import type {ContentDocument,ContentSection} from '@/lib/content-model';
import s from './shop.module.css';

function Intro({eyebrow,title,children}:{eyebrow:string;title:string;children?:React.ReactNode}){return <header className={s.pageIntro}><span className={s.eyebrow}>{eyebrow}</span><h1>{title}</h1>{children&&<p>{children}</p>}</header>;}
const minutes=(a:ContentDocument)=>Math.max(1,Math.ceil([a.description,...a.sections.flatMap(b=>[b.heading,...b.paragraphs,...(b.checklist||[])])].join(' ').trim().split(/\s+/).length/200));
export function ArticleCard({article:a}:{article:ContentDocument}){return <Link className={s.card} href={a.route}>{a.image&&<div className={s.cardImage}><Image src={a.image} alt={a.imageAlt||''} fill sizes="(max-width:780px) 90vw, 30vw"/></div>}<p>{a.eyebrow} · {minutes(a)} min read</p><h3>{a.title}</h3><p>{a.description}</p><span className={s.textLink}>Read the story ↗</span></Link>;}
function SectionBody({section:b}:{section:ContentSection}){return <>{b.paragraphs.map((p,i)=><p key={i}>{p}</p>)}{!!b.checklist?.length&&<ul>{b.checklist.map((p,i)=><li key={i}>{p}</li>)}</ul>}</>;}
const policies:Record<string,string>={'/privacy':'Privacy','/terms':'Ordering terms','/shipping-delivery':'Delivery','/returns-cancellations':'Changes & cancellations','/accessibility':'Accessibility'};
const nextSteps:Record<string,[string,string,string,string]>={
 '/our-story':['/collectible-design','Explore furniture & spatial art','/process','How a piece begins'],
 '/process':['/commission','Begin your piece','/faq','Read your questions'],
 '/materials-care':['/collectible-design','Explore the collection','/contact','Ask about your piece'],
 '/architects':['/commission','Prepare a project brief','/materials-care','Explore materials & care'],
 '/faq':['/commission','Begin your piece','/contact','Call or email the atelier']
};
export async function EditorialPage({route}:{route:string}){
 const documents=await publishedContent(),articles=documents.filter(d=>d.kind==='article');
 if(route==='/journal'){
  const categories=[...new Set(articles.map(a=>a.eyebrow))];
  return <><Intro eyebrow="The journal" title="A closer look.">Notes on material, proportion and the things that make an object personal.</Intro>
   {categories.length>1&&<nav className={s.journalTopics} aria-label="Journal topics">{categories.map((category,i)=><a key={category} href={'#journal-topic-'+i}>{category}<span>{articles.filter(a=>a.eyebrow===category).length}</span></a>)}</nav>}
   {articles.length?categories.map((category,i)=><section className={s.section} id={'journal-topic-'+i} key={category} aria-labelledby={'journal-heading-'+i}><div className={s.sectionHead}><h2 id={'journal-heading-'+i}>{category}</h2></div><div className={s.grid}>{articles.filter(a=>a.eyebrow===category).map(a=><ArticleCard key={a.id} article={a}/>)}</div></section>):<section className={s.section}><div className={s.empty}><h2>No journal stories are published yet.</h2><p>Explore the material guide or prepare the first notes for your piece.</p><div className={s.actions}><Link className={s.button} href="/materials-care">Materials & care ↗</Link><Link className={s.textLink} href="/process">How it works</Link></div></div></section>}
  </>;
 }
 const content=documents.find(d=>d.route===route);if(!content)notFound();
 const article=content.kind==='article',faq=route==='/faq',policy=!!policies[route];
 const related=article&&content.relatedProductIds?.length?(await publishedProducts()).filter(p=>content.relatedProductIds!.includes(p.id)):[];
 const more=articles.filter(a=>a.id!==content.id).sort((a,b)=>Number(b.eyebrow===content.eyebrow)-Number(a.eyebrow===content.eyebrow)).slice(0,3);
 const business=route==='/contact'||policy?(await publishedBusiness()).details:null;
 const next=nextSteps[route]||['/commission','Begin your piece','/journal','Return to the journal'];
 return <div data-editorial={article?'article':route.slice(1)}>
  <EditorialStructuredData document={content}/>
  <nav className={s.editorialBreadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span>{article&&<><Link href="/journal">Journal</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{content.title}</span></nav>
  <Intro eyebrow={content.eyebrow} title={content.title}>{content.description}</Intro>
  {content.image&&<figure className={s.storyImage}><Image src={content.image} alt={content.imageAlt||''} fill priority sizes="90vw"/><figcaption>Design visualization</figcaption></figure>}
  <div className={s.readingLayout}>{content.sections.length>3&&<nav className={s.contents} aria-label="On this page"><p>On this page</p>{content.sections.map(b=><a key={b.id} href={'#'+b.id}>{b.heading}</a>)}</nav>}
   <div className={s.prose}>{article&&<p className={s.eyebrow}>By RivyaLivingArt · {minutes(content)} minute read</p>}
    {content.sections.map(b=>faq?<details id={b.id} key={b.id}><summary>{b.heading}</summary><SectionBody section={b}/></details>:<section id={b.id} key={b.id}><h2>{b.heading}</h2><SectionBody section={b}/></section>)}
    {policy?<><nav className={s.policyLinks} aria-label="Policies and help">{Object.entries(policies).filter(([p])=>p!==route).map(([p,label])=><Link key={p} href={p}>{label}</Link>)}</nav><div className={s.actions}><Link className={s.button} href="/contact">Contact the atelier ↗</Link>{business&&<a className={s.textLink} href={'mailto:'+business.email}>Email about this page</a>}</div></>:route!=='/contact'&&<div className={s.actions}><Link className={s.button} href={next[0]}>{next[1]} ↗</Link><Link className={s.textLink} href={next[2]}>{next[3]}</Link></div>}
    {route==='/contact'&&business&&<div className={s.contactCards}><a href={'tel:'+business.phone}><span>Call the atelier</span>{business.phone}</a><a href={'mailto:'+business.email}><span>General questions & existing inquiries</span>{business.email}</a><a href={business.map} target="_blank" rel="noreferrer"><span>Location</span>Open the atelier map ↗</a><Link href="/commission"><span>Product & custom-piece requests</span>Prepare your saved order brief ↗</Link></div>}
   </div>
  </div>
  {related.length>0&&<section className={s.section}><div className={s.sectionHead}><h2>Ideas to explore.</h2></div><div className={s.grid}>{related.map(p=><ProductCard key={p.id} product={p}/>)}</div></section>}
  {article&&more.length>0&&<section className={s.section}><div className={s.sectionHead}><h2>Keep exploring.</h2><Link className={s.textLink} href="/journal">All stories ↗</Link></div><div className={s.grid}>{more.map(a=><ArticleCard key={a.id} article={a}/>)}</div></section>}
 </div>;
}

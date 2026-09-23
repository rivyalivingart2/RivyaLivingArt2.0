import Image from './public-image';
import {publishedBusiness} from '@/lib/business-settings';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {publishedContent} from '@/lib/published-content';
import {publishedProducts} from '@/lib/shop-catalogue';
import {ProductCard} from './catalogue-browser';
import type {ContentDocument} from '@/lib/content-model';
import s from './shop.module.css';
function Intro({eyebrow,title,children}:{eyebrow:string;title:string;children?:React.ReactNode}){return <header className={s.pageIntro}><span className={s.eyebrow}>{eyebrow}</span><h1>{title}</h1>{children&&<p>{children}</p>}</header>;}
export function ArticleCard({article}:{article:ContentDocument}){return <Link className={s.card} href={article.route}>{article.image&&<div className={s.cardImage}><Image src={article.image} alt={article.imageAlt||''} fill sizes="(max-width:780px) 90vw, 30vw"/></div>}<p>{article.eyebrow}</p><h3>{article.title}</h3><p>{article.description}</p></Link>;}
export async function EditorialPage({route}:{route:string}){
 const {details:business}=await publishedBusiness();
 const documents=await publishedContent(),articles=documents.filter(d=>d.kind==='article');
 if(route==='/journal')return <><Intro eyebrow="The journal" title="A closer look.">Notes on material, proportion and the things that make an object personal.</Intro><section className={s.section}>{articles.length?<div className={s.grid}>{articles.map(a=><ArticleCard key={a.id} article={a}/>)}</div>:<p>New stories are being prepared. Explore the collection in the meantime.</p>}</section></>;
 const content=documents.find(d=>d.route===route);if(!content)notFound();
 const article=content.kind==='article',faq=route==='/faq';
 const related=article&&content.relatedProductIds?.length?(await publishedProducts()).filter(p=>content.relatedProductIds!.includes(p.id)):[];
 const picture=content.image||({'/our-story':'/media/product-hero-026-4x5.webp','/process':'/media/product-scene-001-16x9.webp','/architects':'/media/product-scene-005-16x9.webp'} as Record<string,string>)[route];
 return <div data-editorial={article?'article':route.slice(1)}><Intro eyebrow={content.eyebrow} title={content.title}>{content.description}</Intro>
 {picture&&<figure className={s.storyImage}><Image src={picture} alt={content.imageAlt||'Timber and resin design visualization'} fill priority sizes="90vw"/><figcaption>Design visualization</figcaption></figure>}
 <div className={s.readingLayout}>{content.sections.length>3&&<nav className={s.contents} aria-label="On this page"><p>On this page</p>{content.sections.map(b=><a key={b.id} href={'#'+b.id}>{b.heading}</a>)}</nav>}
 <div className={s.prose}>{article&&<p className={s.eyebrow}>By RivyaLivingArt · {Math.max(1,Math.ceil(content.sections.flatMap(b=>b.paragraphs).join(' ').split(/\s+/).length/200))} minute read</p>}
 {content.sections.map(b=>faq?<details id={b.id} key={b.id}><summary>{b.heading}</summary>{b.paragraphs.map((p,i)=><p key={i}>{p}</p>)}</details>:<section id={b.id} key={b.id}><h2>{b.heading}</h2>{b.paragraphs.map((p,i)=><p key={i}>{p}</p>)}{b.checklist&&<ul>{b.checklist.map((p,i)=><li key={i}>{p}</li>)}</ul>}</section>)}
 <div className={s.actions}><Link className={s.button} href="/commission">Choose your starting point ↗</Link>{article&&<Link className={s.textLink} href="/journal">Return to the journal</Link>}</div>
 {route==='/contact'&&<div className={s.contactCards}><a href={'tel:'+business.phone}><span>Call</span>{business.phone}</a><a href={'mailto:'+business.email}><span>Email</span>{business.email}</a><a href={business.map} target="_blank" rel="noreferrer"><span>Find the atelier</span>View the supplied map location ↗</a><Link href="/commission"><span>For a new piece</span>Save a brief & continue on WhatsApp ↗</Link></div>}
 </div></div>
 {related.length>0&&<section className={s.section}><div className={s.sectionHead}><h2>Ideas to explore.</h2></div><div className={s.grid}>{related.map(p=><ProductCard key={p.id} product={p}/>)}</div></section>}
 {article&&<section className={s.section}><div className={s.sectionHead}><h2>Keep exploring.</h2></div><div className={s.grid}>{articles.filter(a=>a.id!==content.id&&a.eyebrow===content.eyebrow).slice(0,3).map(a=><ArticleCard key={a.id} article={a}/>)}</div></section>}</div>;
}

import {SectionBody} from './section-body';
import {sharedCopyValues,type SharedCopy} from '@/lib/shared-copy-model';
import Link from 'next/link';
import type {ContentDocument} from '@/lib/content-model';
import type {HomeAction,HomeSnapshot} from '@/lib/homepage-model';
import {ProductCard} from './product-card';
import {HeroImage} from './hero-image';
import Image from './public-image';
import {EditorialImage} from './editorial-image';
import s from './shop.module.css';
import h from './homepage.module.css';
const Action=({action,primary=false,unavailable=[]}:{action?:HomeAction;primary?:boolean;unavailable?:string[]})=>action&&!unavailable.includes(action.href)?<Link className={primary?s.button:s.textLink} href={action.href}>{action.label} ↗</Link>:null;
function CategoryRow({category:c,index}:{category:HomeSnapshot['categories'][number];index:number}){return <Link href={'/search?category='+encodeURIComponent(c.name)} className={s.categoryRow+' '+h.categoryRow}><span className={s.categoryIndex}>{String(index+1).padStart(2,'0')}</span><h3>{c.name}</h3><span className={s.categoryCount}>{c.count} {c.count===1?'piece':'pieces'}</span><span aria-hidden>↗</span></Link>;}
/** Both the public route and the authorized saved-revision preview use this component. */
export function HomepageDocument({document:d,revision,copy:labels=sharedCopyValues()}:{document:ContentDocument;revision:number;copy?:SharedCopy}){
 const home=d.homepage!,snapshot=d.homeSnapshot!;
 const lead=snapshot.products.find(p=>p.id===home.heroProductId);
 const visibleSections=home.sections.filter(b=>b.enabled&&!b.contentNeeded&&(b.type!=='selected'||b.productIds?.some(id=>snapshot.products.some(p=>p.id===id)))&&(b.type!=='journal'||b.articleIds?.some(id=>snapshot.articles.some(a=>a.id===id))));
 return <div data-home-revision={revision} className={h.home}>
  <section className={s.hero}><div className={s.heroCopy}><span className={s.eyebrow}>{d.eyebrow}</span><h1>{d.title}</h1><p>{d.description}</p><div className={s.actions}><Action unavailable={snapshot.unavailableActionHrefs} action={home.primary} primary/><Action unavailable={snapshot.unavailableActionHrefs} action={home.secondary}/></div><span className={s.heroAnnotation}>{home.annotation}</span></div><div className={[s.heroVisual,home.heroImage?h.editorialVisual:null].filter(Boolean).join(' ')}>{home.heroImage?<div className={h.heroEditorial}><EditorialImage usage={home.heroImage} available={snapshot.mediaPaths.includes(home.heroImage.path)} priority/></div>:<div className={s.heroImage}>{lead?<HeroImage portrait={lead.image} landscape={lead.scene||lead.image} name={lead.name} portraitPosition={lead.imagePosition} landscapePosition={lead.scenePosition||lead.imagePosition}/>:<span className={s.heroImageFallback}>{labels['hero-fallback']}</span>}</div>}{!home.heroImage&&lead&&<div className={s.heroNote}><div><span>{lead.id} / Design visualization</span><p>{lead.name}</p></div><Link href={'/pieces/'+lead.slug}>{labels['discover-piece']} ↗</Link></div>}</div></section>
  <div className={s.strip}>{home.strip.map((text,i)=><span key={i}>{text}</span>)}</div>
  <nav className={h.contents} aria-label="On this page">{visibleSections.map(b=><a key={b.id} href={'#'+b.id}>{d.sections.find(s=>s.id===b.id)?.heading}</a>)}</nav>
  {visibleSections.map(block=>{
   const copy=d.sections.find(b=>b.id===block.id)!;
   const body=<SectionBody section={copy} unavailable={snapshot.unavailableActionHrefs} mediaPaths={snapshot.mediaPaths}/>;
   const heading=<><span className={s.eyebrow}>{block.eyebrow}</span><h2 id={block.id+'-heading'}>{copy.heading}</h2></>;
   const selected=(block.productIds||[]).flatMap(id=>{const p=snapshot.products.find(p=>p.id===id);return p?[p]:[];});
   const articles=(block.articleIds||[]).flatMap(id=>{const a=snapshot.articles.find(a=>a.id===id);return a?[a]:[];});
   if((block.type==='selected'&&!selected.length)||(block.type==='journal'&&!articles.length))return null;
   if(block.type==='story')return <section key={block.id} id={block.id} aria-labelledby={block.id+'-heading'} className={s.materialSection}>{block.image&&<EditorialImage usage={block.image} available={snapshot.mediaPaths.includes(block.image.path)}/>}<div className={s.editorialCopy}>{heading}{body}<Action unavailable={snapshot.unavailableActionHrefs} action={block.action}/></div></section>;
   if(block.type==='invitation')return <section key={block.id} id={block.id} aria-labelledby={block.id+'-heading'} className={s.invitation}>{heading}{body}<div className={s.actions}><Action unavailable={snapshot.unavailableActionHrefs} action={block.action} primary/></div></section>;
   const categories=block.categories?.length?block.categories.flatMap(name=>snapshot.categories.filter(c=>c.name===name)):snapshot.categories;
   return <section key={block.id} id={block.id} aria-labelledby={block.id+'-heading'} className={s.section+(block.type==='journeys'?' '+s.green:'')}><div className={s.sectionHead}><div>{heading}</div><div>{body}</div><Action unavailable={snapshot.unavailableActionHrefs} action={block.action}/></div>
    {block.type==='selected'&&<div className={s.curatedGrid}>{selected.map(p=><ProductCard key={p.id} product={p}/>)}</div>}
    {block.type==='categories'&&<><div className={s.categoryRows}>{categories.slice(0,6).map((c,i)=><CategoryRow key={c.name} category={c} index={i}/>)}</div>{categories.length>6&&<details className={h.moreCategories}><summary>{labels['show-categories']} ({categories.length})</summary><div className={s.categoryRows}>{categories.slice(6).map((c,i)=><CategoryRow key={c.name} category={c} index={i+6}/>)}</div></details>}</>}
    {block.type==='steps'&&<ol className={s.processGrid+' '+h.steps}>{block.items?.map((item,i)=><li key={item.id}><span className={s.eyebrow}>{String(i+1).padStart(2,'0')}</span><h3>{item.title}</h3><p>{item.body}</p><Action unavailable={snapshot.unavailableActionHrefs} action={item.action}/></li>)}</ol>}
    {block.type==='journeys'&&<div className={s.worlds}>{block.items?.map(item=>{const product=snapshot.products.find(p=>p.id===item.productId);return <div key={item.id} className={s.world}>{item.image?<EditorialImage usage={item.image} available={snapshot.mediaPaths.includes(item.image.path)}/>:<div className={s.worldImage}>{product?<Image src={product.image} alt={product.imageAlt||product.name} fill sizes="(max-width: 780px) 90vw, 30vw" style={{objectFit:'cover',objectPosition:product.imagePosition}}/>:<span className={s.imageUnavailable}>Image unavailable</span>}</div>}<h3>{item.title}</h3><p>{item.body}</p><Action unavailable={snapshot.unavailableActionHrefs} action={item.action}/></div>;})}</div>}
    {block.type==='journal'&&<div className={s.grid}>{articles.map(a=><Link href={a.route} key={a.id} className={s.card}>{a.image&&<div className={s.cardImage}><Image src={a.image} alt={a.imageAlt||''} fill sizes="(max-width: 780px) 45vw, 30vw" style={{objectFit:'cover'}}/></div>}<span className={s.eyebrow}>{a.eyebrow}</span><h3>{a.title}</h3><p>{a.description}</p><span className={s.textLink}>{labels['read-story']} ↗</span></Link>)}</div>}
   </section>;
  })}
 </div>;
}

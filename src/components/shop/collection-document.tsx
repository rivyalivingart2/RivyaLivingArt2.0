import {JourneyText} from './journey-language';
import {ArrowUpRight} from 'lucide-react';
import Link from 'next/link';
import type {PublishedContentDocument} from '@/lib/published-content';
import {SectionBody} from './section-body';
import {EditorialImage} from './editorial-image';
import {CatalogueBrowser} from './catalogue-browser';
import {productCard} from '@/lib/product-card-model';
import {CollectionStructuredData} from './structured-data';
import p from './detailed-pages.module.css';
import s from './shop.module.css';
import c from './catalogue-journey.module.css';
import r from './reference-pages.module.css';
import {ReferenceChapter} from './reference-chapters';
import type {PageDesign} from '@/lib/page-design-model';
import {GroupedDiscovery} from './grouped-discovery';


export function CollectionDocument({document:d,design,designVersion}:{document:PublishedContentDocument;design?:PageDesign;designVersion?:number}){
 const snapshot=d.pageSnapshot,sections=d.sections.filter(s=>s.enabled!==false),search=d.route==='/search';
 return <div className={c.collection+(design?' '+r.reference:'')} data-content-revision={d.publishedRevision} data-collection-document={d.route} data-presentation-revision={designVersion} data-page-hero={design?.hero}>
  <CollectionStructuredData title={d.title} description={d.description} url={d.route} products={snapshot?.products||[]}/>
  <header className={p.opening+' '+c.opening+(search?' '+c.searchOpening:'')+(design?' '+r.opening:'')} data-has-image={!!d.headerImage}><div><span className={s.eyebrow}>{d.eyebrow}</span><h1>{d.title}</h1><p>{d.description}</p>{!search&&<div className={s.actions}><a className={s.button} href="#browse"><JourneyText text="Browse the pieces ↓"/></a><Link className={s.textLink} href="/saved-pieces"><JourneyText text="Your saved pieces"/> <ArrowUpRight aria-hidden="true" size={16} className={s.linkArrow}/></Link></div>}</div>{d.headerImage&&<div data-page-cover><EditorialImage usage={d.headerImage} available={snapshot?.mediaPaths.includes(d.headerImage.path)} priority sizes={design?.hero==='full'?'100vw':'(max-width: 780px) 90vw, 42vw'}/></div>}</header>
  {search&&<div className={s.section}><GroupedDiscovery articles={snapshot?.articles||[]} entries={snapshot?.discovery||[]} navigationOnly/></div>}
  {!search&&sections.length>2&&<nav className={c.chapterNav} aria-labelledby="collection-chapters-heading"><details><summary><span id="collection-chapters-heading"><JourneyText text="Explore this collection"/></span></summary><ol>{sections.map(section=><li key={section.id}><a href={'#'+section.id}>{section.heading}</a></li>)}</ol></details></nav>}
  {sections.map((b,index)=>b.id==='browse'?<section key={b.id} id="browse" className={s.section+' '+c.catalogue} aria-labelledby="browse-heading"><div className={c.browseHeading+(search?' '+c.searchBrowseHeading:'')}><h2 id="browse-heading">{b.heading}</h2>{!search&&<div><SectionBody section={b} unavailable={snapshot?.unavailableActionHrefs} mediaPaths={snapshot?.mediaPaths}/></div>}</div><CatalogueBrowser products={(snapshot?.products||[]).map(productCard)} basePath={d.route}/>{search&&<div className={c.searchGuidance}><SectionBody section={b} unavailable={snapshot?.unavailableActionHrefs} mediaPaths={snapshot?.mediaPaths}/></div>}<p className={s.caption}><JourneyText text="Design visualizations. Final specifications and quotations are agreed individually."/></p></section>:design?<ReferenceChapter key={b.id} section={b} index={index} design={design} mediaPaths={snapshot?.mediaPaths} unavailable={snapshot?.unavailableActionHrefs}/>:<section key={b.id} id={b.id} className={p.chapter+' '+c.chapter} data-layout={b.image?b.layout:b.layout==='statement'?'statement':undefined} aria-labelledby={b.id+'-heading'}>{b.image&&<EditorialImage usage={b.image} available={snapshot?.mediaPaths.includes(b.image.path)}/>}<div><h2 id={b.id+'-heading'}>{b.heading}</h2><SectionBody section={{...b,image:undefined}} unavailable={snapshot?.unavailableActionHrefs} mediaPaths={snapshot?.mediaPaths}/></div></section>)}
 {search&&<section className={s.section}><GroupedDiscovery articles={snapshot?.articles||[]} entries={snapshot?.discovery||[]}/></section>}
 </div>;
}

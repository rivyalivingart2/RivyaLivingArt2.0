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

export function CollectionDocument({document:d}:{document:PublishedContentDocument}){
 const snapshot=d.pageSnapshot,sections=d.sections.filter(s=>s.enabled!==false);
 return <div data-content-revision={d.publishedRevision} data-collection-document={d.route}>
  <CollectionStructuredData title={d.title} description={d.description} url={d.route} products={snapshot?.products||[]}/>
  <header className={p.opening} data-has-image={!!d.headerImage}><div><span className={s.eyebrow}>{d.eyebrow}</span><h1>{d.title}</h1><p>{d.description}</p><div className={s.actions}><a className={s.button} href="#browse">Browse the pieces ↓</a><Link className={s.textLink} href="/saved-pieces">Your saved pieces <ArrowUpRight aria-hidden="true" size={16} className={s.linkArrow}/></Link></div></div>{d.headerImage&&<EditorialImage usage={d.headerImage} available={snapshot?.mediaPaths.includes(d.headerImage.path)} priority/>}</header>
  {sections.map(b=>b.id==='browse'?<section key={b.id} id="browse" className={s.section} aria-labelledby="browse-heading"><div className={s.sectionHead}><div><h2 id="browse-heading">{b.heading}</h2><SectionBody section={b} unavailable={snapshot?.unavailableActionHrefs} mediaPaths={snapshot?.mediaPaths}/></div></div><CatalogueBrowser products={(snapshot?.products||[]).map(productCard)} basePath={d.route}/><p className={s.caption}>Design visualizations. Final specifications and quotations are agreed individually.</p></section>:<section key={b.id} id={b.id} className={p.chapter} data-layout={b.image?b.layout:b.layout==='statement'?'statement':undefined} aria-labelledby={b.id+'-heading'}>{b.image&&<EditorialImage usage={b.image} available={snapshot?.mediaPaths.includes(b.image.path)}/>}<div><h2 id={b.id+'-heading'}>{b.heading}</h2><SectionBody section={{...b,image:undefined}} unavailable={snapshot?.unavailableActionHrefs} mediaPaths={snapshot?.mediaPaths}/></div></section>)}
 </div>;
}

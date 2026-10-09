import Link from 'next/link';
import type {ContentDocument,ContentSection} from '@/lib/content-model';
import type {PageDesign} from '@/lib/page-design-model';
import {defaultPageDesign,isDesignPageRoute,sharedPageRoutes} from '@/lib/page-design-model';
import type {HomeReferenceSnapshot} from '@/lib/home-reference-model';
import type {Locale} from '@/lib/site-settings-model';
import {localizeHomeReference} from '@/lib/home-reference-dependencies';
import {SectionBody} from './section-body';
import {EditorialImage} from './editorial-image';
import {JourneyText} from './journey-language';
import r from './reference-pages.module.css';

export function ReferenceChapters({document:d,design,prefix=''}:{document:ContentDocument;design:PageDesign;prefix?:string}){
 const sections=d.sections.filter(s=>s.enabled!==false&&s.id!=='browse');
 return <div className={r.chapters} data-chapter-template={design.chapters}>{sections.map((b,index)=><ReferenceChapter key={b.id} section={b} design={design} index={index} prefix={prefix} mediaPaths={d.pageSnapshot?.mediaPaths} unavailable={d.pageSnapshot?.unavailableActionHrefs}/>)}</div>;
}
export function ReferenceChapter({section:b,design,index,prefix='',mediaPaths,unavailable}:{section:ContentSection;design:PageDesign;index:number;prefix?:string;mediaPaths?:string[];unavailable?:string[]}){
 const id=prefix+b.id,slot=Object.entries(design.bindings||{}).find(([,value])=>value===b.id)?.[0];
 const layout=design.styles[b.id]||b.layout||(design.chapters==='alternating'?(index%2?'reverse':'split'):'prose');
 const label=<>{b.stage&&<p className={r.eyebrow}><JourneyText text={b.stage==='customer'?'Your request and agreement':'Making: questions for your specification'}/></p>}</>;
 const picture=b.image?<EditorialImage usage={b.image} available={mediaPaths?.includes(b.image.path)}/>:null;
 const body=<SectionBody section={{...b,image:undefined}} unavailable={unavailable} mediaPaths={mediaPaths}/>;
 if(design.chapters==='accordion')return <details className={r.accordion} id={id} data-reference-slot={slot} data-stage={b.stage}>
  <summary><span className={r.number} aria-hidden>{String(index+1).padStart(2,'0')}</span><h2>{b.heading}</h2><span className={r.toggle} aria-hidden/></summary>
  <div className={r.accordionBody} data-has-image={!!picture}>{picture}<div>{label}{body}</div></div>
 </details>;
 return <section className={r.chapter} id={id} aria-labelledby={id+'-heading'} data-reference-slot={slot} data-stage={b.stage} data-chapter-style={layout} data-has-image={!!picture}>
  <div className={r.chapterMarker}><span className={r.number} aria-hidden>{String(index+1).padStart(2,'0')}</span>{picture}</div>
  <div className={r.chapterBody}>{label}<h2 id={id+'-heading'}>{b.heading}</h2>{body}</div>
 </section>;
}
/** Shared bands read the same current pages publicly and the same frozen pages in preview. */
export function ReferencePageAdditions({design,reference,locale='en'}:{design:PageDesign;reference?:HomeReferenceSnapshot;locale?:Locale}){
 if(!reference)return null;
 const localized=localizeHomeReference(reference,locale);
 return sharedPageRoutes(design).map(route=>{
  const item=localized.pages.find(p=>p.document.route===route);
  if(!item||!isDesignPageRoute(route))return null;
  const d=item.document,prefix='shared-'+route.slice(1)+'-';
  return <section key={route} className={r.shared} data-shared-page={route} id={prefix+'intro'}>
   <header className={r.sharedHeading}><p className={r.eyebrow}>{d.eyebrow}</p><h2>{d.title}</h2><p>{d.description}</p><Link href={route}>{d.title} <span aria-hidden>↗</span></Link></header>
   <ReferenceChapters document={d} design={{...defaultPageDesign(route),shared:[]}} prefix={prefix}/>
  </section>;
 });
}

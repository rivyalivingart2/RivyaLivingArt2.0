import Link from 'next/link';
import type {ContentDocument} from '@/lib/content-model';
import type {ReferenceOffering} from '@/lib/home-reference-model';
import {EditorialImage} from './editorial-image';
import {Meniscus} from './legacy-meniscus';
import {SectionBody} from './section-body';
import {JourneyText} from './journey-language';
import s from './legacy-home-offerings.module.css';

/** OLDWEBSITE page.tsx §§08/09. Confirmation remains a data gate: rendering a
 * reference layout must never announce an unconfirmed service or session. */
export function LegacyOfferingBand({offering,mediaPaths,kind}:{offering?:ReferenceOffering;mediaPaths:string[];kind:'workshops'|'print'}){
 if(!offering?.confirmationSource)return null;
 const image=offering.image&&<Meniscus className={s.image}><EditorialImage usage={offering.image} available={mediaPaths.includes(offering.image.path)} sizes={kind==='print'?'(min-width:1024px) 55vw, 90vw':'(min-width:1024px) 45vw, 90vw'}/></Meniscus>;
 return <section className={s.band} data-legacy-offering={kind} aria-labelledby={'offering-'+kind+'-heading'}><div className={s.grid} data-has-image={!!image}>
  {kind==='workshops'&&image}
  <div className={s.copy}><p className={s.eyebrow}>{offering.eyebrow||<JourneyText text={kind==='workshops'?'Workshops':'Print studio'}/>}</p><h2 id={'offering-'+kind+'-heading'}>{offering.title}</h2><p className={s.description}>{offering.description}</p>
   {offering.facts.length>0&&(kind==='workshops'?<ul className={s.workshopFacts}>{offering.facts.map((fact,index)=><li key={index}><span>{fact.label&&fact.label+': '}{fact.value}</span>{index<offering.facts.length-1&&<span aria-hidden>·</span>}</li>)}</ul>:<dl className={s.facts}>{offering.facts.map((fact,index)=><div key={index}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>)}
   <Link className={s.action} href={offering.href}>{offering.actionLabel||offering.title}</Link>
  </div>
  {kind==='print'&&image}
 </div></section>;
}

/** The source proof-point grid, preserving every current chapter and its media.
 * Three current chapters remain three: no fourth claim or metric is invented. */
export function LegacyPrinciplesBand({document:d}:{document?:ContentDocument}){
 if(!d)return null;
 const sections=d.sections.filter(section=>section.enabled!==false);
 return <section className={s.band} data-legacy-principles aria-labelledby="legacy-principles-heading"><header className={s.heading}><p className={s.eyebrow}>{d.eyebrow}</p><h2 id="legacy-principles-heading">{d.title}</h2>{d.description&&<p className={s.description}>{d.description}</p>}</header>
  <ul className={s.proofs}>{sections.map(section=><li key={section.id}>{section.image&&<Meniscus className={s.proofImage}><EditorialImage usage={section.image} available={d.pageSnapshot?.mediaPaths.includes(section.image.path)} sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 90vw"/></Meniscus>}<h3>{section.heading}</h3><SectionBody section={{...section,image:undefined}} unavailable={d.pageSnapshot?.unavailableActionHrefs} mediaPaths={d.pageSnapshot?.mediaPaths}/></li>)}</ul>
 </section>;
}

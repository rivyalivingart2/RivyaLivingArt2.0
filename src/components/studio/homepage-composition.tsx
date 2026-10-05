import type {ContentDocument} from '@/lib/content-model';
import {editorialSlots} from '@/lib/editorial-slots';
import s from './workspace.module.css';
import c from './homepage-composition.module.css';

export function HomepageComposition({document:d,dirty,onSelect}:{document:ContentDocument;dirty:boolean;onSelect:(id:string)=>void}){
 const home=d.homepage!;
 const active=home.sections.filter(section=>section.enabled&&!section.contentNeeded);
 const selected=[...new Set(active.flatMap(section=>section.type==='selected'?section.productIds||[]:[]))];
 const slots=editorialSlots(d).filter(slot=>!slot.sectionId||active.some(section=>section.id===slot.sectionId));
 const assigned=slots.filter(slot=>slot.usage);
 const distinct=new Set(assigned.map(slot=>slot.path));
 const categories=d.homeSnapshot?.categories;
 const categoryBlocks=active.filter(section=>section.type==='categories');
 const included=categories?.filter(category=>categoryBlocks.some(section=>!section.categories?.length||section.categories.includes(category.name)));
 const repeated=[...distinct].filter(path=>assigned.filter(slot=>slot.path===path).length>1);
 return <details className={s.panel+' '+c.review}>
  <summary>Review homepage composition</summary>
  <p>Review the current draft before saving. This overview does not replace publication checks.</p>
  <dl className={c.metrics}>
   <div><dt>Enabled, reviewed chapters</dt><dd>{active.length} <span>of {home.sections.length}</span></dd></div>
   <div><dt>Selected product references</dt><dd>{selected.length}</dd></div>
   <div><dt>Distinct editorial images</dt><dd>{distinct.size} <span>across {assigned.length} placements</span></dd></div>
  </dl>
  <h3>Image placements</h3>
  <ul className={c.placements}>{slots.map(slot=><li key={slot.key}><button type="button" onClick={()=>onSelect(slot.sectionId||'hero')}>{slot.label}</button><span>{slot.usage?'Editorial image assigned':slot.productId?'Uses the existing product image':'Text-led chapter'}</span></li>)}</ul>
  {repeated.length>0&&<p className={s.help}>{repeated.length} {repeated.length===1?'image is':'images are'} reused in more than one placement. Check that the repetition helps the story; reuse does not block publication.</p>}
  <h3>Category coverage</h3>
  {categories?<><p>{included?.length} of {categories.length} saved catalogue categories are included. {dirty?'Save to refresh catalogue counts; the counts below come from the last saved snapshot.':'Counts come from the saved homepage snapshot.'}</p><ul className={c.categories}>{categories.map(category=><li key={category.name}><span>{category.name}{!included?.includes(category)?' · not included':''}</span><strong>{category.count} {category.count===1?'piece':'pieces'}</strong></li>)}</ul></>:<p>Save the homepage to capture published category counts.</p>}
 </details>;
}

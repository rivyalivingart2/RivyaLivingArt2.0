"use client";
import {useEffect} from 'react';
import {useJourneyText} from './journey-language';
import type {ContentSection} from '@/lib/content-model';
import type {DiscoveryMetadata} from '@/lib/editorial-metadata';
import type {EditorialFacet} from '@/lib/editorial-filters';
import {EditorialFilters,EditorialPagination,useEditorialFilter} from './editorial-filters';
import {SectionBody} from './section-body';
import p from './detailed-pages.module.css';
import s from './shop.module.css';
import e from './editorial-reading.module.css';
const fields:EditorialFacet[]=['topic','journey','language'];
export function FaqBrowser({sections,unavailable,mediaPaths}:{sections:(ContentSection&{discovery?:DiscoveryMetadata;languages?:string[]})[];unavailable?:string[];mediaPaths?:string[]}){
 const tr=useJourneyText(),control=useEditorialFilter(sections.map(section=>({...section,title:section.heading,topic:section.group||'Useful questions',search:[section.heading,...section.paragraphs].join(' ')})),fields,'/faq');
 useEffect(()=>{const open=()=>{let id='';try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const index=sections.findIndex(s=>s.id===id);if(index<0)return;const params=new URLSearchParams(location.search);for(const key of ['q','topic','journey','language','sort'])params.delete(key);params.set('page',String(Math.floor(index/12)+1));window.history.replaceState(null,'',location.pathname+'?'+params+'#'+encodeURIComponent(id));requestAnimationFrame(()=>{const node=document.getElementById(id);if(node instanceof HTMLDetailsElement){node.open=true;node.scrollIntoView({block:'start'});}});};open();window.addEventListener('hashchange',open);return()=>window.removeEventListener('hashchange',open);},[sections]);
 const visible=control.view.paged,groups=[...new Set(visible.map(s=>s.group||'Useful questions'))];
 return <><EditorialFilters label="FAQs" fields={fields} control={control}/><nav className={p.chips} aria-label="Question index">{visible.map(section=><a key={section.id} href={'#'+section.id}>{section.heading}</a>)}</nav>{groups.map(group=><section className={p.questionGroup+' '+e.questions} key={group}><h2>{tr(group)}</h2>{visible.filter(s=>(s.group||'Useful questions')===group).map(b=><details id={b.id} key={b.id}><summary>{b.heading}</summary><SectionBody section={b} unavailable={unavailable} mediaPaths={mediaPaths}/><a href={'#'+b.id}>{tr('Link to this answer')}</a></details>)}</section>)}{!visible.length&&<div className={s.empty}><h2>{tr('No answers match.')}</h2><p>{tr('Try another phrase or show all questions.')}</p></div>}<EditorialPagination control={control}/></>;
}

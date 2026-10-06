'use client';
import {useEffect,useState} from 'react';
import {useJourneyText} from './journey-language';
import type {ContentSection} from '@/lib/content-model';
import {SectionBody} from './section-body';
import p from './detailed-pages.module.css';
import s from './shop.module.css';
import e from './editorial-reading.module.css';
export function FaqBrowser({sections,unavailable,mediaPaths}:{sections:ContentSection[];unavailable?:string[];mediaPaths?:string[]}){
 const tr=useJourneyText();
 const [query,setQuery]=useState(''),[group,setGroup]=useState('all');
 useEffect(()=>{const open=()=>{let id='';try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}if(!sections.some(s=>s.id===id))return;setQuery('');setGroup('all');requestAnimationFrame(()=>{const node=document.getElementById(id);if(node instanceof HTMLDetailsElement){node.open=true;node.scrollIntoView({block:'start'});}});};open();window.addEventListener('hashchange',open);return()=>window.removeEventListener('hashchange',open);},[sections]);
 const groups=[...new Set(sections.map(s=>s.group||'Useful questions'))];
 const visible=sections.filter(s=>(group==='all'||(s.group||'Useful questions')===group)&&[s.heading,...s.paragraphs].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
 return <><div className={e.faqControls}><label className={s.field}>{tr('Find an answer')}<input type="search" maxLength={100} value={query} onChange={e=>setQuery(e.target.value)}/></label><div className={p.chips} role="group" aria-label={tr('Question groups')}>{['all',...groups].map(g=><button type="button" key={g} aria-pressed={g===group} onClick={()=>setGroup(g)}>{tr(g==='all'?'All questions':g)}</button>)}</div><p role="status">{visible.length} {tr(visible.length===1?'answer':'answers')}</p></div>
 {groups.filter(g=>visible.some(s=>(s.group||'Useful questions')===g)).map(g=><section className={p.questionGroup+' '+e.questions} key={g}><h2>{tr(g)}</h2>{visible.filter(s=>(s.group||'Useful questions')===g).map(b=><details id={b.id} key={b.id}><summary>{b.heading}</summary><SectionBody section={b} unavailable={unavailable} mediaPaths={mediaPaths}/><a href={'#'+b.id}>{tr('Link to this answer')}</a></details>)}</section>)}
 {!visible.length&&<div className={s.empty}><h2>{tr('No answers match.')}</h2><p>{tr('Try another phrase or show all questions.')}</p><button className={s.button} onClick={()=>{setQuery('');setGroup('all');}}>{tr('Show all questions')}</button></div>}</>;
}

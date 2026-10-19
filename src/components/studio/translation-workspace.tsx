'use client';
import {useEffect,useMemo,useState} from 'react';
import {translationStatus} from '@/lib/translation-review';
import type {ContentDocument} from '@/lib/content-model';
import {studioFetch} from './workspace-api';
import {Pagination,usePagination} from './pagination';
import s from './workspace.module.css';
type Entry={document:ContentDocument;published:ContentDocument|null;visible:boolean;version:number};
export function TranslationWorkspace(){
 const [entries,setEntries]=useState<Entry[]|null>(null),[error,setError]=useState(''),[locale,setLocale]=useState<'hi'|'gu'>('hi'),[query,setQuery]=useState(''),[state,setState]=useState('all'),[busy,setBusy]=useState(true);
 async function load(){setBusy(true);setError('');try{setEntries((await studioFetch('/api/studio/content')).entries);}catch{setError('Translation coverage could not be refreshed. Any previous results are stale.');}finally{setBusy(false);}}
 useEffect(()=>{let active=true;void studioFetch('/api/studio/content').then(data=>{if(active)setEntries(data.entries);}).catch(()=>{if(active)setError('Translation coverage is unavailable. Retry to load current records.');}).finally(()=>{if(active)setBusy(false);});return()=>{active=false;};},[]);
 // Review fingerprints depend on saved content and language, not search keystrokes.
 const coverage=useMemo(()=>(entries||[]).map(e=>({...e,review:translationStatus(e.document,locale),publicState:e.visible&&e.published?translationStatus(e.published,locale).state:'Not published'})),[entries,locale]);
 const rows=useMemo(()=>coverage.filter(e=>(state==='all'||e.review.state===state)&&(e.document.title+' '+e.document.route).toLowerCase().includes(query.toLowerCase())),[coverage,state,query]);
 const {page,totalPages,setPage,paginatedItems}=usePagination(rows,20);
 return <><div data-studio-part="heading" className={s.heading}><div><h1>Language review.</h1><p>English remains the source. Review Hindi and Gujarati as complete documents, including actions and image descriptions.</p></div><button disabled={busy} onClick={()=>void load()}>Refresh coverage</button></div>{error&&<p role="alert">{error}</p>}{busy&&<p role="status">Checking saved translations…</p>}
 <p data-studio-part="protectedNote" className={s.protectedNote}>Public interface translations are supplied separately from editorial text. Missing, incomplete, changed or unreviewed editorial translations use the labelled English fallback. Other configured languages are held from the public switcher. Product records and outgoing saved messages retain their source values.</p>
 <div data-studio-part="toolbar" className={s.toolbar}><label>Review language<select value={locale} onChange={e=>{setLocale(e.target.value as 'hi'|'gu');setPage(1);}}><option value="hi">हिन्दी</option><option value="gu">ગુજરાતી</option></select></label><label>Find document<input type="search" value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}}/></label><label>Review state<select value={state} onChange={e=>{setState(e.target.value);setPage(1);}}>{['all','missing','incomplete','needs review','reviewed','stale'].map(v=><option key={v}>{v}</option>)}</select></label></div>
 {entries&&<><p role="status">{rows.length} documents{rows.length>0&&` · Showing ${(page-1)*20+1}–${Math.min(page*20,rows.length)}`}</p><Pagination page={page} totalPages={totalPages} setPage={setPage}/><div className={s.routeDecisions}>{paginatedItems.map(e=><article data-studio-part="panel" className={s.panel} key={e.document.id}><h2>{e.document.title}</h2><p>{e.document.route} · revision {e.version}</p><p>Draft: <strong>{e.review.state}</strong> · {e.review.total-e.review.missing}/{e.review.total} fields</p><p>Public: {e.publicState}</p><a href={'/studio/content?record='+encodeURIComponent(e.document.id)+'&translation='+locale}>Review this record ↗</a></article>)}</div>{!rows.length&&<p>No documents match these filters.</p>}</>}
 </>;
}

'use client';
import Link from 'next/link';
import {useState} from 'react';
import manifest from '@/lib/legacy-disposition.json';
import s from './workspace.module.css';
export function LegacyDisposition(){
 const [query,setQuery]=useState(''),[scope,setScope]=useState('families'),[state,setState]=useState('all');
 const rows=(scope==='families'?manifest.families.map(r=>({id:r.family,title:r.title,disposition:r.disposition,decision:r.decision,source:r.oldRoutes+' → '+r.newRoutes})):manifest.templates.map((r,i)=>({id:String(i+1),title:r.repository+' · '+r.route,disposition:r.disposition,decision:r.decision,source:r.source}))).filter(r=>(state==='all'||r.disposition.includes(state))&&(r.id+' '+r.title+' '+r.decision+' '+r.source).toLowerCase().includes(query.toLowerCase()));
 return <><div className={s.heading}><div><h1>Legacy feature decisions.</h1><p>All 79 page and Studio families and 136 source templates retain an explicit decision.</p></div></div><section className={s.panel}><h2>Content and measurement availability</h2><p>{manifest.conditionalFacts}</p><p>Workload counts in Overview describe saved operational records. They are not revenue, purchases, visits or WhatsApp sends. No automatic campaigns, product imports or scraper actions are introduced here.</p><Link href="/studio/route-review">Check old links and published destinations ↗</Link></section>
 <div className={s.toolbar}><label>Inventory<select value={scope} onChange={e=>setScope(e.target.value)}><option value="families">Page and Studio families</option><option value="templates">Source templates</option></select></label><label>Find feature or route<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label><label>Disposition<select value={state} onChange={e=>setState(e.target.value)}>{['all','adapted','preserved','protected','conditional','internal','retired','excluded'].map(v=><option key={v}>{v}</option>)}</select></label></div><p role="status">{rows.length} decisions</p>
 <div className={s.routeDecisions}>{rows.map(row=><article className={s.panel} key={row.id}><h2>{row.id} · {row.title}</h2><p><strong>{row.disposition}</strong></p><p>{row.decision}</p><details><summary>Source reference</summary><p>{row.source}</p></details></article>)}</div>{!rows.length&&<p>No decisions match these filters.</p>}</>;
}

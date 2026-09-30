'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {contentHealthRows,type HealthRow} from '@/lib/content-health';
import {studioFetch} from './workspace-api';
import s from './workspace.module.css';

export function ContentHealth(){
 const [rows,setRows]=useState<HealthRow[]|null>(null),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 useEffect(()=>{
  let active=true;
  void Promise.all([studioFetch('/api/studio/content'),studioFetch('/api/studio/workspace?view=catalogue'),studioFetch('/api/studio/media')]).then(([c,p,m])=>{
   if(!Array.isArray(c.entries)||!Array.isArray(p.products)||!Array.isArray(m.media))throw new Error('The check returned incomplete records. Retry to check all three areas.');
   if(active)setRows(contentHealthRows(c.entries,p.products,m.media));
  }).catch(e=>{if(active)setError(e instanceof Error?e.message:'Content health could not be loaded.');});
  return()=>{active=false;};
 },[attempt]);
 return <>
  <div className={s.heading}><div><h1>Content health.</h1><p>Review copy, catalogue records and image metadata. Publication and editorial checks are shown separately.</p></div></div>
  {error?<div className={s.panel} role="alert"><p>{error}</p><p>Publication status is unknown until all records load successfully.</p><button onClick={()=>{setRows(null);setError('');setAttempt(v=>v+1);}}>Retry checks</button></div>:<p className={s.status} role="status">{rows?'Checks complete. Nothing was edited or published.':'Checking current drafts and published revisions…'}</p>}
  {rows&&<>
   <div className={s.metrics} aria-label="Content health summary">
    <div className={s.panel}><span>Needs review</span><strong>{rows.filter(r=>r.readiness==='Needs review').length}</strong></div>
    <div className={s.panel}><span>Unpublished</span><strong>{rows.filter(r=>r.publication==='Unpublished').length}</strong></div>
    <div className={s.panel}><span>Changes pending</span><strong>{rows.filter(r=>r.draft==='Changes pending').length}</strong></div>
    <div className={s.panel}><span>Checked records</span><strong>{rows.length}</strong></div>
   </div>
   <section className={s.panel}><h2>Editorial and publication checks</h2><p className={s.help}>“No issues flagged” is a limited copy check, not approval to publish. Search-description lengths are review prompts. Published media metadata does not confirm that an image appears on a page.</p>
    <div className={s.tableWrap} role="region" aria-label="Content health records" tabIndex={0}><table className={s.healthTable}><caption className={s.help}>Current shared records. Each review link opens the record and its first flagged field.</caption><thead><tr><th scope="col">Area / record</th><th scope="col">Publication</th><th scope="col">Draft</th><th scope="col">Editorial check</th><th scope="col">Observation</th><th scope="col">Open</th></tr></thead><tbody>
     {rows.map(row=><tr key={row.area+':'+row.id}><th scope="row">{row.name}<small className={s.healthRecord}>{row.area} · {row.id}</small></th><td><span className={row.publication==='Published'?s.statusBadgePublished:s.statusBadgeHidden}>{row.publication}</span></td><td>{row.draft}</td><td>{row.readiness}</td><td>{row.detail}</td><td><Link prefetch={false} href={row.href} aria-label={'Review '+row.name}>Review ↗</Link></td></tr>)}
    </tbody></table></div>
    {!rows.length&&<p className={s.empty}>No records are available to check.</p>}
   </section>
  </>}
 </>;
}

'use client';
import {useState} from 'react';
import Link from 'next/link';
import type {DetailedHealthRow} from '@/lib/content-health-report';
import {readContentHealth} from './read-content-health';
import s from './workspace.module.css';
export function PublicationQueue(){
 const [rows,setRows]=useState<DetailedHealthRow[]|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function check(){setBusy(true);setError('');try{setRows(await readContentHealth());}catch(e){setError(e instanceof Error?e.message:'Publication checks unavailable.');}finally{setBusy(false);}}
 const blockers=rows?.filter(r=>r.issues.some(i=>i.severity==='Blocker'));
 return <section className={s.panel} aria-busy={busy}><div className={s.sectionHeading}><h2>Publishing tasks</h2><button disabled={busy} onClick={()=>void check()}>{busy?'Checking…':rows?'Recheck publishing tasks':'Check publishing tasks'}</button></div><p>Checks read saved records. Unsaved work and editorial approval are not inferred.</p>{error&&<p role="alert">{error} {rows?'Previous results remain below and may be out of date.':'Readiness is unknown until checks succeed.'}</p>}{rows?<><div className={s.stageSummary}><Link href="/studio/content-health?severity=Blocker">Records with blockers<strong>{blockers?.length}</strong></Link><Link href="/studio/content-health?publication=Unpublished">Unpublished<strong>{rows.filter(r=>r.publication==='Unpublished').length}</strong></Link><Link href="/studio/content-health?draft=Changes+pending">Changes pending<strong>{rows.filter(r=>r.draft==='Changes pending').length}</strong></Link></div><ul className={s.workList}>{blockers?.slice(0,5).map(row=><li key={row.area+row.id}><Link href={row.issues.find(i=>i.severity==='Blocker')!.href}>{row.name} · {row.issues.find(i=>i.severity==='Blocker')!.reason}</Link></li>)}</ul><p role="status">{rows.length} saved records checked. Nothing was edited or published.</p></>:<p>Publication counts have not been checked yet.</p>}<Link href="/studio/content-health">Open all content health records ↗</Link></section>;
}

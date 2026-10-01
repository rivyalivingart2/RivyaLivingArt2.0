'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {studioRecordHref} from '@/lib/studio-record-links';
import {formatBusinessTime} from '@/lib/business-time';
import {orderStages,stageLabel} from '@/lib/studio-orders';
import {studioTasks,studioTaskLabels,studioTaskHref,type WorkQueueData} from '@/lib/studio-work-queue';
import {studioFetch} from './workspace-api';
import s from './workspace.module.css';
import {PublicationQueue} from './publication-queue';
export function OverviewPanel(){
 const [data,setData]=useState<WorkQueueData|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true),sequence=useRef(0);
 const load=useCallback(()=>{const request=++sequence.current;return studioFetch('/api/studio/work-queue').then(next=>{if(request===sequence.current){setData(next);setError('');}}).catch(e=>{if(request===sequence.current)setError(e instanceof Error?e.message:'The queue could not be loaded.');}).finally(()=>{if(request===sequence.current)setLoading(false);});},[]);
 useEffect(()=>{const active=sequence;void load();return()=>{active.current++;};},[load]);
 const refresh=()=>{setLoading(true);setError('');void load();};
 const tasks=studioTasks.filter(task=>task!=='unassigned'||data?.scope==='all');
 return <>
  <div className={s.heading}><div><p className={s.kicker}>Your working day</p><h1>Studio overview</h1><p>Start with the next conversation or saved record that needs attention.</p></div><button disabled={loading} onClick={refresh}>{loading?'Refreshing…':'Refresh overview'}</button></div>
  {error&&<div className={s.panel} role="alert"><p>{error}</p>{data&&<p>Last successful read: {formatBusinessTime(data.asOf)}. Counts below have not been replaced.</p>}<button disabled={loading} onClick={refresh}>Retry queue</button></div>}
  <p className={s.status} role="status">{data?(data.scope==='all'?'All permitted records':'Only inquiries assigned to your account')+' · Updated '+formatBusinessTime(data.asOf):'Loading your permitted work. Counts are not available yet.'}</p>
  <section aria-labelledby="attention-heading"><div className={s.sectionHeading}><h2 id="attention-heading">Needs attention</h2><span>Follow-up dates use IST</span></div>
   <div className={s.taskQueue} aria-busy={loading}>{data?tasks.map(task=><Link prefetch={false} key={task} href={studioTaskHref(task)} className={s.taskCard} data-attention={data.counts[task]>0}><span>{studioTaskLabels[task]}</span><strong>{data.counts[task]}</strong><small>{task==='message-failed'?'Saved requests; no message is sent automatically.':'Open matching active inquiries'} <span aria-hidden>↗</span></small></Link>):Array.from({length:4},(_,i)=><div key={i} className={s.taskCard} aria-hidden="true"><span>Loading queue</span><strong>—</strong></div>)}</div>
  </section>
  <div className={s.grid}>
   <section className={s.panel}><div className={s.sectionHeading}><h2>Next follow-ups</h2><Link prefetch={false} href="/studio/follow-ups">View all ↗</Link></div><p>Up to eight active inquiries due today or earlier, earliest first.</p>{data?.followups.length?<ul className={s.workList}>{data.followups.map(record=><li key={record.id}><Link prefetch={false} href={'/studio/follow-ups?record='+record.id}><strong>{record.reference}</strong><span>{record.title}</span></Link><small>{record.followUp.slice(0,10)} IST · {stageLabel(record.status)}</small></li>)}</ul>:<p>{data?'No follow-ups are due in your scope.':'Loading follow-ups…'}</p>}</section>
   <section className={s.panel}><div className={s.sectionHeading}><h2>Recently updated</h2><Link prefetch={false} href="/studio/inquiries?mode=list">Open inquiries ↗</Link></div><p>Up to eight permitted records. Customer contact details stay in the record.</p>{data?.recent.length?<ul className={s.workList}>{data.recent.map(record=><li key={record.id}><Link prefetch={false} href={'/studio/inquiries?mode=list&record='+record.id}><strong>{record.reference||'Staff-entered order'}</strong><span>{record.title}</span></Link><small>{stageLabel(record.status)} · {formatBusinessTime(record.updatedAt)}</small></li>)}</ul>:<p>{data?'No inquiries are available in your scope.':'Loading recent work…'}</p>}</section>
  </div>
  <PublicationQueue/><section className={s.panel}><div className={s.sectionHeading}><h2>Website workspace</h2><Link prefetch={false} href="/studio/content-health">Review publication blockers ↗</Link></div><p>Content health checks each saved record. The task counts above describe inquiries, not publication readiness.</p><div className={s.actions}><Link className={s.controlLink} href="/studio/content">Pages & journal</Link><Link className={s.controlLink} href="/studio/site-images">Page image assignments</Link><Link className={s.controlLink} href="/studio/activity">Saved activity</Link></div></section>
  {data?.editorial&&<section className={s.panel}><h2>Recently saved editorial work</h2><ul className={s.workList}>{data.editorial.map(record=><li key={record.id}><Link href={studioRecordHref('content',record.id)}><strong>{record.title}</strong><span>Revision {record.version} · {formatBusinessTime(record.updatedAt)}</span></Link></li>)}</ul></section>}
  {data&&<section className={s.panel}><h2>Current stages</h2><p>{data.stages.reduce((sum,row)=>sum+row.count,0)} permitted records, including completed and closed work.</p><div className={s.stageSummary}>{orderStages.map(stage=><Link prefetch={false} key={stage} href={'/studio/inquiries?mode=list&stage='+stage}>{stageLabel(stage)}<strong>{data.stages.find(row=>row.status===stage)?.count||0}</strong></Link>)}</div></section>}
 </>;
}

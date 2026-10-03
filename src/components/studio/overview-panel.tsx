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
import {ArrowUpRight,Clock,Inbox,MessageSquareWarning,CalendarDays} from 'lucide-react';
import {OverviewWorkspaces} from './overview-workspaces';
import d from './overview.module.css';
const taskIcons={today:CalendarDays,overdue:Clock,unassigned:Inbox,'message-failed':MessageSquareWarning};
export function OverviewPanel(){
 const [data,setData]=useState<WorkQueueData|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true),sequence=useRef(0);
 const load=useCallback(()=>{const request=++sequence.current;return studioFetch('/api/studio/work-queue').then(next=>{if(request===sequence.current){setData(next);setError('');}}).catch(e=>{if(request===sequence.current)setError(e instanceof Error?e.message:'The queue could not be loaded.');}).finally(()=>{if(request===sequence.current)setLoading(false);});},[]);
 useEffect(()=>{const active=sequence;void load();return()=>{active.current++;};},[load]);
 const refresh=()=>{setLoading(true);setError('');void load();};
 const tasks=studioTasks.filter(task=>task!=='unassigned'||data?.scope==='all');
 const total=data?.stages.reduce((sum,row)=>sum+row.count,0)||0;
 const unavailable=loading?'Loading your permitted work. Counts are not available yet.':'Work is unavailable. Retry the queue to load counts.';
 return <div className={d.dashboard}>
  <div className={s.heading}><div><p className={s.kicker}>Your working day</p><h1>Studio overview</h1><p>Start with the next conversation or saved record that needs attention.</p></div><button disabled={loading} onClick={refresh}>{loading?'Refreshing…':'Refresh overview'}</button></div>
  {error&&<div className={s.panel} role="alert"><p>{error}</p>{data&&<p>Last successful read: {formatBusinessTime(data.asOf)}. Counts below have not been replaced.</p>}<button disabled={loading} onClick={refresh}>Retry queue</button></div>}
  <p className={s.status} role="status">{data?(data.scope==='all'?'All permitted records':'Only inquiries assigned to your account')+' · Updated '+formatBusinessTime(data.asOf):unavailable}</p>
  <section aria-labelledby="attention-heading"><div className={s.sectionHeading}><h2 id="attention-heading">Needs attention</h2><span>Follow-up dates use IST</span></div>
   <div className={d.metricGrid} aria-busy={loading}>{data?tasks.map(task=>{const Icon=taskIcons[task];return <Link prefetch={false} key={task} href={studioTaskHref(task)} className={d.metric} data-attention={data.counts[task]>0}><span className={d.metricHeader}>{studioTaskLabels[task]}<Icon size={20} aria-hidden="true"/></span><strong>{data.counts[task]}</strong><small>{task==='message-failed'?'Saved requests; no message is sent automatically.':'Open matching active inquiries'} <ArrowUpRight size={16} aria-hidden="true"/></small></Link>;}):Array.from({length:4},(_,i)=><div key={i} className={d.metric} aria-hidden="true"><span>{loading?'Loading queue':'Queue unavailable'}</span><strong>—</strong></div>)}</div>
  </section>
  <div className={d.activityGrid}>
   <section className={d.panel}><div className={d.panelHeader}><h2>Recently updated</h2><Link prefetch={false} href="/studio/inquiries?mode=list">Open inquiries <ArrowUpRight size={16} aria-hidden="true"/></Link></div><p>Up to eight permitted records. Customer contact details stay in the record.</p>{data?.recent.length?<table className={d.table}><caption className={d.srOnly}>Recently updated inquiries in your permitted scope</caption><thead><tr><th scope="col">Inquiry / piece</th><th scope="col">Stage</th><th scope="col">Updated (IST)</th></tr></thead><tbody>{data.recent.map(record=><tr key={record.id}><td><Link prefetch={false} href={'/studio/inquiries?mode=list&record='+record.id}><small>{record.reference||'Staff-entered order'}</small><span>{record.title}</span></Link></td><td><span className={d.status}>{stageLabel(record.status)}</span></td><td><time dateTime={record.updatedAt}>{formatBusinessTime(record.updatedAt)}</time></td></tr>)}</tbody></table>:<p>{data?'No inquiries are available in your scope.':unavailable}</p>}</section>
   <section className={d.panel}><h2>Current stages</h2><p>{data?`${total} permitted records, including completed and closed work. Current totals, not a time-series or a completion score.`:unavailable}</p>{data&&<ul className={d.stageList}>{orderStages.map(stage=>{const count=data.stages.find(row=>row.status===stage)?.count||0;return <li key={stage}><Link prefetch={false} href={'/studio/inquiries?mode=list&stage='+stage}><span className={d.stageLabel}>{stageLabel(stage)}<strong>{count}</strong></span><span className={d.track} aria-hidden="true"><span style={{width:`${total?count/total*100:0}%`}}/></span></Link></li>;})}</ul>}</section>
  </div>
  <OverviewWorkspaces/>
   <section className={s.panel}><div className={s.sectionHeading}><h2>Next follow-ups</h2><Link prefetch={false} href="/studio/follow-ups">View all ↗</Link></div><p>Up to eight active inquiries due today or earlier, earliest first.</p>{data?.followups.length?<ul className={s.workList}>{data.followups.map(record=><li key={record.id}><Link prefetch={false} href={'/studio/follow-ups?record='+record.id}><strong>{record.reference}</strong><span>{record.title}</span></Link><small>{record.followUp.slice(0,10)} IST · {stageLabel(record.status)}</small></li>)}</ul>:<p>{data?'No follow-ups are due in your scope.':unavailable}</p>}</section>
  <PublicationQueue/><section className={s.panel}><div className={s.sectionHeading}><h2>Website workspace</h2><Link prefetch={false} href="/studio/content-health">Review publication blockers ↗</Link></div><p>Content health checks each saved record. The task counts above describe inquiries, not publication readiness.</p><div className={s.actions}><Link className={s.controlLink} href="/studio/content">Pages & journal</Link><Link className={s.controlLink} href="/studio/site-images">Page image assignments</Link><Link className={s.controlLink} href="/studio/activity">Saved activity</Link></div></section>
  {data?.editorial&&<section className={s.panel}><h2>Recently saved editorial work</h2><ul className={s.workList}>{data.editorial.map(record=><li key={record.id}><Link href={studioRecordHref('content',record.id)}><strong>{record.title}</strong><span>Revision {record.version} · {formatBusinessTime(record.updatedAt)}</span></Link></li>)}</ul></section>}
 </div>;
}

'use client';
import {formatBusinessTime} from '@/lib/business-time';
import {useCallback,useEffect,useState} from 'react';
import Link from 'next/link';
import {RefreshCw, Download} from 'lucide-react';
import {orderStages,stageLabel} from '@/lib/studio-orders';
import {studioFetch} from './workspace-api';
import s from './workspace.module.css';
import {ReferenceCleanup} from './reference-cleanup';
import {BusinessSettingsEditor} from './business-settings';

type Activity={actor:string;action?:string;entity?:string;createdAt:string;from_status?:string;to_status?:string;reason?:string;reference?:string;title?:string};
type ManagedExport={id:string;actor:string;rowCount:number;createdAt:string;expiresAt:string;invalidatedAt:string|null;invalidationReason:string|null;isExpired:boolean;daysRemaining:number};
type OperationsData={
 stages?:{status:string;count:number}[];
 followups?:{id:string;reference:string;name:string;followUp:string;title:string}[];
 recent?:{id:string;client:string;title:string;status:string}[];
 events?:Activity[];
 edits?:Activity[];
 business?:Record<string,string>;
 services?:Record<string,string>;
 attention?:Record<string,number>;
 workflow?:string;
 exports?:ManagedExport[];
};

export function Operations({view,admin}:{view:'overview'|'activity'|'settings';admin:boolean}){
 const [data,setData]=useState<OperationsData|null>(null),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[exportFrom,setExportFrom]=useState(''),[exportTo,setExportTo]=useState(''),[exportStage,setExportStage]=useState(''),[exportSource,setExportSource]=useState(''),[managedExports,setManagedExports]=useState<ManagedExport[]>([]);

 const loadExports=useCallback(async()=>{
  if(!admin||view!=='activity')return;
  try{
   const res=await studioFetch('/api/studio/operations?view=exports');
   if(res?.exports)setManagedExports(res.exports);
  }catch{/* non-fatal */}
 },[admin,view]);

 const load=useCallback(async()=>{
  setMessage('');
  try{
   setData(await studioFetch('/api/studio/operations?view='+view));
   await loadExports();
  }catch(e){
   setMessage(e instanceof Error?e.message:'Unable to load.');
  }
 },[view,loadExports]);

 useEffect(()=>{
  let active=true;
  void studioFetch('/api/studio/operations?view='+view).then(d=>{if(active)setData(d);}).catch(e=>{if(active)setMessage(e.message);});
  if(admin&&view==='activity'){
   void studioFetch('/api/studio/operations?view=exports').then(d=>{if(active&&d?.exports)setManagedExports(d.exports);}).catch(()=>{});
  }
  return()=>{active=false;};
 },[view,admin]);

 async function exportData(){
  if(!window.confirm('Download a private CSV containing customer contact details? Keep the file in a restricted location. In accordance with CR-04/18, exported files must be destroyed after seven days.'))return;
  setBusy(true);
  try{
   const response=await fetch('/api/studio/operations',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({action:'export',confirm:'private-export',from:exportFrom,to:exportTo,stage:exportStage,source:exportSource})
   });
   if(!response.ok){
    const result=await response.json();
    throw new Error(result.error);
   }
   const url=URL.createObjectURL(await response.blob());
   const a=document.createElement('a');
   a.href=url;
   a.download='rivya-private-orders.csv';
   a.click();
   setTimeout(()=>URL.revokeObjectURL(url),1000);
   setMessage('Private export downloaded and tracked under 7-day retention expiry.');
   await loadExports();
  }catch(e){
   setMessage(e instanceof Error?e.message:'Export failed.');
  }finally{
   setBusy(false);
  }
 }

 return (
  <>
   <div className={s.heading}>
    <div>
     <h1>{view==='overview'?'A considered working day.':view==='activity'?'The work, in sequence.':'Atelier settings.'}</h1>
     <p>{view==='overview'?'Real records and the next conversations to follow up.':view==='activity'?'Recent stage changes, saved editorial work, and export compliance.':'Verified business details and service readiness.'}</p>
    </div>
    <button disabled={busy} onClick={()=>void load()}>
      <RefreshCw size={13} style={{display:'inline',verticalAlign:'text-bottom',marginRight:6}} aria-hidden="true" />
      <span>Refresh</span>
    </button>
   </div>
   <p className={s.status} role="status">{message}</p>
   {!data?<p className={s.empty}>{message?'Use Refresh to try again.':'Loading shared records…'}</p>:view==='overview'?<><div className={s.metrics}>{data.stages&&<Link href="/studio/inquiries" style={{borderColor:'var(--accent-bronze)',background:'linear-gradient(145deg,#15273c 0%,#0e1927 100%)'}}><strong>{data.stages.reduce((acc,cur)=>acc+cur.count,0)}</strong>Total Inquiries</Link>}{data.stages?.map(v=><Link key={v.status} href={'/studio/inquiries?stage='+v.status}><strong>{v.count}</strong>{stageLabel(v.status)}</Link>)}{!data.stages?.length&&<p>No inquiries yet. New website inquiries will appear here after they are saved.</p>}</div><div className={s.grid}><section className={s.panel}><h2>Follow up today</h2>{data.followups?.length?data.followups.map(f=><p key={f.id}><Link href={'/studio/inquiries?record='+f.id}>{f.reference} · {f.name}</Link><br/>{f.title} · {f.followUp.slice(0,10)}</p>):<p>No assigned follow-ups are due.</p>}<Link href="/studio/follow-ups">View follow-ups ↗</Link></section><section className={s.panel}><h2>Recently updated</h2>{data.recent?.map(v=><p key={v.id}><Link href={'/studio/inquiries?record='+v.id}>{v.client} · {v.title}</Link><br/>{stageLabel(v.status)}</p>)}</section></div></>:view==='activity'?<><div className={s.grid}><section className={s.panel}><h2>Stage history</h2>{data.events?.map((v,i)=><div className={s.notes} key={i}><small>{formatBusinessTime(v.createdAt)} · {v.actor}</small><p>{v.reference||v.title}: {stageLabel(v.from_status||'Received')} → {stageLabel(v.to_status||'')}</p>{v.reason&&<p>{v.reason}</p>}</div>)}{!data.events?.length&&<p>No stage events in your scope.</p>}</section><section className={s.panel}><h2>Saved activity</h2>{data.edits?.map((v,i)=><p key={i}>{formatBusinessTime(v.createdAt)} · {v.actor}<br/>{v.action} · {v.entity}</p>)}</section></div>{admin&&<section className={s.panel}><h2>Private records export</h2><p>Download up to 5,000 inquiry and manual-order records. Reference images and private file addresses are excluded. Timestamps are labelled UTC; date filters use IST. In accordance with policy CR-04/18, downloaded files must be permanently deleted within seven days.</p><fieldset disabled={busy}><div className={s.datePresets} style={{marginBottom:12}}><button type="button" className={s.datePresetBtn} onClick={()=>{const today=new Date().toISOString().slice(0,10);setExportFrom(today);setExportTo(today);}}>Today</button><button type="button" className={s.datePresetBtn} onClick={()=>{const toDate=new Date().toISOString().slice(0,10);const fromDate=new Date(Date.now()-7*86400000).toISOString().slice(0,10);setExportFrom(fromDate);setExportTo(toDate);}}>Last 7 days</button><button type="button" className={s.datePresetBtn} onClick={()=>{const toDate=new Date().toISOString().slice(0,10);const fromDate=new Date(Date.now()-30*86400000).toISOString().slice(0,10);setExportFrom(fromDate);setExportTo(toDate);}}>Last 30 days</button>{(exportFrom||exportTo)&&<button type="button" className={s.datePresetBtn} onClick={()=>{setExportFrom('');setExportTo('');}}>Clear dates</button>}</div><div className={s.grid}><label>Received from (IST)<input type="date" value={exportFrom} onChange={e=>setExportFrom(e.target.value)}/></label><label>Received through (IST)<input type="date" value={exportTo} min={exportFrom||undefined} onChange={e=>setExportTo(e.target.value)}/></label><label>Stage<select value={exportStage} onChange={e=>setExportStage(e.target.value)}><option value="">All stages</option>{orderStages.map(stage=><option key={stage} value={stage}>{stageLabel(stage)}</option>)}</select></label><label>Source<select value={exportSource} onChange={e=>setExportSource(e.target.value)}><option value="">All records</option><option value="website">Website inquiries</option><option value="manual">Staff-entered orders</option></select></label></div><button onClick={()=>void exportData()}><Download size={14} style={{display:'inline',verticalAlign:'text-bottom',marginRight:6}} aria-hidden="true" /><span>Download private CSV</span></button></fieldset>{managedExports.length>0&&<div style={{marginTop:'16px'}}><h3>Managed Exports (7-Day Expiry Tracking):</h3><table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.85rem'}}><thead><tr style={{textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.2)'}}><th style={{padding:'6px'}}>Created</th><th style={{padding:'6px'}}>Rows</th><th style={{padding:'6px'}}>Expires in</th><th style={{padding:'6px'}}>Status</th></tr></thead><tbody>{managedExports.map(exp=><tr key={exp.id} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}><td style={{padding:'6px'}}>{formatBusinessTime(exp.createdAt)}</td><td style={{padding:'6px'}}>{exp.rowCount}</td><td style={{padding:'6px'}}>{exp.isExpired?'Expired':`${exp.daysRemaining} days`}</td><td style={{padding:'6px'}}>{exp.invalidatedAt?<span style={{color:'#f87171'}}>Invalidated: {exp.invalidationReason}</span>:exp.isExpired?<span style={{color:'#fbbf24'}}>Expired</span>:<span style={{color:'#4ade80'}}>Active</span>}</td></tr>)}</tbody></table></div>}</section>}</>:<><BusinessSettingsEditor/><section className={s.panel}><h2>Ordering workflow</h2><p>{data.workflow}</p><Link href="/studio/content">Edit public pages & policies ↗</Link></section><section className={s.panel}><h2>Service readiness</h2>{Object.entries(data.services||{}).map(([k,v])=><p key={k}>{k}: {v}</p>)}<p>These checks describe this running version. They do not certify release readiness. Credentials are never displayed here.</p></section><section className={s.panel}><h2>Items to review</h2>{Object.entries(data.attention||{}).map(([label,count])=><p key={label}>{label}: {count}</p>)}<p>Refresh for current totals. Review saved inquiries before retrying their messages. Nothing is sent or deleted automatically.</p></section>{admin&&<ReferenceCleanup/>}</>}
  </>
 );
}

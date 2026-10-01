'use client';
import {formatBusinessTime} from '@/lib/business-time';
import {useState} from 'react';
import {studioFetch} from './workspace-api';
import s from './workspace.module.css';
import {ContentCompare} from './content-compare';
type Revision<T>={version:number;document:T;actor:string;operation:string;createdAt:string};
export function RevisionHistory<T>({kind,entityKey,currentVersion,currentDocument,onRestore}:{kind:'product'|'content'|'media';entityKey:string;currentVersion:number;currentDocument?:T;onRestore:(document:T,version?:number)=>void}){
 const [rows,setRows]=useState<Revision<T>[]>([]),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[pending,setPending]=useState<Revision<T>|null>(null);
 async function load(){setBusy(true);try{const data=await studioFetch('/api/studio/revisions?'+new URLSearchParams({kind,key:entityKey}));setRows(data.revisions);setMessage(data.revisions.length?'':'No saved revisions yet.');}catch(e){setMessage(e instanceof Error?e.message:'Unable to load history.');}finally{setBusy(false);}}
 return <details className={s.panel}><summary>Saved revision history</summary><p>Restoring fills this editor. Save it as a new draft, then review before publishing. The website remains on its current published version.</p><button type="button" disabled={busy} onClick={()=>void load()}>{busy?'Loading…':'Load recent revisions'}</button><p role="status">{message}</p>{rows.map(r=><div className={s.notes} key={r.version}><p>Version {r.version} · {r.operation} · {r.actor}<br/>{formatBusinessTime(r.createdAt)}</p>{currentDocument!==undefined&&<details><summary>Compare version {r.version} with current draft</summary><ContentCompare before={r.document} after={currentDocument}/></details>}<button type="button" disabled={r.version===currentVersion} onClick={()=>setPending(r)}>Restore to draft</button></div>)}{pending&&<div className={s.panel} role="alert"><p>Replace the editor with version {pending.version}? Unsaved edits will be replaced. The public page stays unchanged.</p><button type="button" onClick={()=>{onRestore(structuredClone(pending.document),pending.version);setMessage("Earlier content loaded into this draft. Save when ready.");setPending(null);}}>Use version {pending.version} in draft</button><button type="button" onClick={()=>setPending(null)}>Keep editing</button></div>}</details>;
}

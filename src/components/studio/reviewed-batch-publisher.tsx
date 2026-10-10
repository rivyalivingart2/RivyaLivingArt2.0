'use client';
import {useState} from 'react';
import type {ContentDocument} from '@/lib/content-model';
import {contentIssues} from '@/lib/content-issues';
import {editorialDocument} from '@/lib/page-dependencies';
import {previewHref} from '@/lib/content-preview';
import {studioFetch} from './workspace-api';
import {useUnsavedWork} from './use-unsaved-work';
import s from './workspace.module.css';
type Entry={document:ContentDocument;version:number;publishedVersion:number;published:ContentDocument|null;visible:boolean};
export function ReviewedBatchPublisher(){
 const [input,setInput]=useState(''),[entries,setEntries]=useState<Entry[]>([]),[approved,setApproved]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('Publication is separate from draft intake. Check at most ten saved records at a time.');
 useUnsavedWork(busy);
 async function check(){
  if(busy)return;setBusy(true);setEntries([]);setApproved(false);
  try{
   const values:unknown=JSON.parse(input);
   if(!Array.isArray(values)||!values.length||values.length>10)throw Error('Paste an array of one to ten saved record IDs or documents.');
   const ids=values.map(v=>typeof v==='string'?v:v?.id);
   if(new Set(ids).size!==ids.length||ids.some(id=>typeof id!=='string'||!/^(article|editorial):[0-9a-f-]{36}$/.test(id)))throw Error('Use unique saved editorial identities. Existing static pages cannot be changed here.');
   const next:Entry[]=[];let existing=0;
   for(const id of ids){
    const data=await studioFetch('/api/studio/content?record='+encodeURIComponent(id));
    const entry:Entry|undefined=data.entries.find((e:Entry)=>e.document.id===id);
    if(!entry||entry.version<1)throw Error('A record is not saved. Complete draft intake first.');
    if(entry.visible&&entry.publishedVersion>0){existing++;continue;}
    if(entry.publishedVersion>0)throw Error('Previously published records must use their individual editor.');
    const issues=[...contentIssues(entry.document).map(i=>i.message),...entry.document.pageSnapshot?.issues||[]];
    if(!entry.document.pageSnapshot||issues.length)throw Error(entry.document.title+': '+(issues.join(' ')||'Save a fresh dependency snapshot first.'));
    const response=await fetch('/studio/preview/frame?'+new URLSearchParams({record:id,version:String(entry.version)}),{cache:'no-store',signal:AbortSignal.timeout(30000)});
    const html=new DOMParser().parseFromString(await response.text(),'text/html');
    const page=html.querySelector('[data-content-revision="'+entry.version+'"]');
    if(!response.ok||page?.querySelector('h1')?.textContent!==entry.document.title)throw Error('The exact saved preview could not be verified for '+entry.document.title+'.');
    next.push(entry);
   }
   setEntries(next);setMessage(next.length+' saved previews checked. '+existing+' already published records skipped. Review the linked layouts and confirm this batch below.');
  }catch(e){setMessage((e as Error).message);}finally{setBusy(false);}
 }
 async function publish(){
  if(busy||!approved||!entries.length)return;setBusy(true);let completed=0;
  try{
   for(const entry of entries){
    const result=await studioFetch('/api/studio/content',{operation:'publish',version:entry.version,document:editorialDocument(entry.document)});
    completed++;setMessage(completed+' of '+entries.length+' publication requests saved. Checking the public page…');
    const response=await fetch(entry.document.route+'?verify='+result.publishedVersion+'&t='+Date.now(),{cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(30000)});
    const html=new DOMParser().parseFromString(await response.text(),'text/html');
    const page=html.querySelector('[data-content-revision="'+result.publishedVersion+'"]');
    if(!response.ok||page?.querySelector('h1')?.textContent!==entry.document.title)throw Error('Publication saved; public verification needs attention. Check the saved record before continuing.');
   }
   setMessage(completed+' records published and verified on the public website. Existing records were not republished.');
  }catch(e){setMessage('Stopped after '+completed+' confirmed saves. '+(e as Error).message+' Recheck the batch before retrying; already published records will be skipped.');}
  finally{setEntries([]);setApproved(false);setBusy(false);}
 }
 return <details className={s.panel} data-studio-saving={busy}><summary>Publish a reviewed batch · administrator only</summary><p>Use the same ten identities as draft intake. This checks exact saved previews, skips already published entries and stops at the first failure. It never edits source text or creates a missing record. Human review and permission evidence are not inferred.</p><label>Saved batch IDs or documents<textarea rows={5} maxLength={180000} disabled={busy} value={input} onChange={e=>{setInput(e.target.value);setEntries([]);setApproved(false);}}/></label><button disabled={busy||!input} onClick={()=>void check()}>Check saved batch previews</button><p role="status">{message}</p>{entries.length>0&&<><ul>{entries.map(entry=><li key={entry.document.id}><a href={previewHref(entry.document.id,entry.version)} target="_blank" rel="noreferrer">{entry.document.title} · exact revision {entry.version}</a>{entry.document.editorial?.classification&&' · '+entry.document.editorial.classification}</li>)}</ul><label><input type="checkbox" checked={approved} disabled={busy} onChange={e=>setApproved(e.target.checked)}/>I approve these saved revisions for public release, including their images and disclosure labels.</label><button disabled={busy||!approved} onClick={()=>void publish()}>Publish these checked revisions</button></>}</details>;
}

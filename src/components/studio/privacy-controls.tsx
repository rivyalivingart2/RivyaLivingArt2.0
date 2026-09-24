'use client';
import {useEffect,useState} from 'react';
import {formatBusinessTime} from '@/lib/business-time';
import type {RetentionRecord} from '@/lib/retention-policy';
import {studioFetch} from './workspace-api';
import {useUnsavedWork} from './use-unsaved-work';
import s from './workspace.module.css';
type Record=RetentionRecord&{id:string;version:number;holdReviewOn:string|null;deletionRequestedAt:string|null;identityVerifiedAt:string|null};
type State={record:Record;decision:{inquiryDueAt:string|null;referencesDueAt:string|null;blocked:string|null;canEraseInquiry:boolean;canEraseReferences:boolean}};
const localTime=(v:string)=>new Date(Date.parse(v)+19800000).toISOString().slice(0,16);
export function PrivacyControls({id}:{id:string}){
 const [data,setData]=useState<State|null>(null),[error,setError]=useState('');
 useEffect(()=>{let active=true;void studioFetch('/api/studio/privacy?id='+encodeURIComponent(id)).then(d=>{if(active)setData(d);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[id]);
 if(!data)return <section className={s.panel}><h2>Privacy & retention</h2><p role="status">{error||'Loading retention controls…'}</p></section>;
 return <PrivacyEditor key={data.record.version} data={data} onReload={async()=>setData(await studioFetch('/api/studio/privacy?id='+encodeURIComponent(id)))}/>;
}
function PrivacyEditor({data,onReload}:{data:State;onReload:()=>Promise<void>}){
 const r=data.record;
 const [contact,setContact]=useState(localTime(r.lastContactAt)),[ongoing,setOngoing]=useState(r.ongoingFollowUp),[hold,setHold]=useState(r.holdReason),[review,setReview]=useState(r.holdReviewOn?.slice(0,10)||''),[request,setRequest]=useState(false),[verified,setVerified]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const dirty=contact!==localTime(r.lastContactAt)||ongoing!==r.ongoingFollowUp||hold!==r.holdReason||review!==(r.holdReviewOn?.slice(0,10)||'')||request||verified;
 useUnsavedWork(dirty);
 async function save(){setBusy(true);try{await studioFetch('/api/studio/privacy',{id:r.id,version:r.version,lastContactAt:contact===localTime(r.lastContactAt)?new Date(r.lastContactAt).toISOString():new Date(contact+':00+05:30').toISOString(),ongoingFollowUp:ongoing,holdReason:hold,holdReviewOn:review||null,recordDeletionRequest:request,verifyIdentity:verified});await onReload();}catch(e){setMessage(e instanceof Error?e.message:'Keep your edits and retry.');}finally{setBusy(false);}}
 return <section className={s.panel} data-unsaved={dirty?'true':undefined} data-studio-saving={busy}><h2>Privacy & retention</h2><p>Record meaningful customer contact separately from internal notes. A documented hold or requested ongoing follow-up pauses policy deletion. Hold review dates do not automatically release a hold.</p><fieldset disabled={busy}><label>Last meaningful customer interaction (IST)<input type="datetime-local" value={contact} onChange={e=>setContact(e.target.value)}/></label><label><input type="checkbox" checked={ongoing} onChange={e=>setOngoing(e.target.checked)}/>The customer requested ongoing follow-up</label><label>Retention exception or legal hold<textarea maxLength={400} value={hold} onChange={e=>{setHold(e.target.value);if(!e.target.value.trim())setReview('');}} placeholder="Record the reason without unnecessary personal details"/></label><label>Review hold on (IST)<input type="date" disabled={!hold.trim()||busy} value={review} onChange={e=>setReview(e.target.value)}/></label>{!r.deletionRequestedAt?<label><input type="checkbox" checked={request} onChange={e=>{setRequest(e.target.checked);if(!e.target.checked)setVerified(false);}}/>A deletion request has been received</label>:<p>Deletion requested: {formatBusinessTime(r.deletionRequestedAt)}</p>}{!r.identityVerifiedAt?<label><input type="checkbox" checked={verified} disabled={!request&&!r.deletionRequestedAt||busy} onChange={e=>setVerified(e.target.checked)}/>I completed proportionate identity verification</label>:<p>Identity verified: {formatBusinessTime(r.identityVerifiedAt)}</p>}<button disabled={!dirty||busy} onClick={()=>void save()}>{busy?'Saving…':'Save retention controls'}</button></fieldset><p role="status">{message}</p><p>Order records: {data.decision.inquiryDueAt?formatBusinessTime(data.decision.inquiryDueAt):'Retained while the order is open'}. Reference images: {data.decision.referencesDueAt?formatBusinessTime(data.decision.referencesDueAt):'Retained while the order is open'}.</p>{data.decision.blocked&&<p>Deletion paused: {data.decision.blocked}.</p>}<p>These controls record decisions; they do not delete data. Bhavya Gondaliya handles verified deletion requests, managed exports and backup expiry through the deletion procedure. Acknowledge requests within two business days; target completion within 30 calendar days after identity verification, explaining any lawful exception.</p></section>;
}


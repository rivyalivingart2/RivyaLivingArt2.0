'use client';
import {useEffect,useState} from 'react';
import {formatBusinessTime} from '@/lib/business-time';
import type {RetentionRecord} from '@/lib/retention-policy';
import {studioFetch} from './workspace-api';
import {useUnsavedWork} from './use-unsaved-work';
import s from './workspace.module.css';

type Record=RetentionRecord&{
 id:string;
 version:number;
 holdReviewOn:string|null;
 deletionRequestedAt:string|null;
 identityVerifiedAt:string|null;
 erasedAt:string|null;
};

type LedgerEntry={
 id:string;
 reference:string;
 erasedAt:string;
 erasedBy:string;
 reason:string;
 referencesDeleted:number;
 notesPurged:number;
};

type State={
 record:Record;
 decision:{
  inquiryDueAt:string|null;
  referencesDueAt:string|null;
  blocked:string|null;
  canEraseInquiry:boolean;
  canEraseReferences:boolean;
 };
 deletionAvailable:boolean;
 ledger?:LedgerEntry[];
};

const localTime=(v:string)=>new Date(Date.parse(v)+19800000).toISOString().slice(0,16);

export function PrivacyControls({id}:{id:string}){
 const [data,setData]=useState<State|null>(null),[error,setError]=useState('');
 useEffect(()=>{
  let active=true;
  void studioFetch('/api/studio/privacy?id='+encodeURIComponent(id)).then(d=>{if(active)setData(d);}).catch(e=>{if(active)setError(e.message);});
  return()=>{active=false;};
 },[id]);

 if(!data)return <section className={s.panel}><h2>Privacy & retention</h2><p role="status">{error||'Loading retention controls…'}</p></section>;
 return <PrivacyEditor key={data.record.version} data={data} onReload={async()=>setData(await studioFetch('/api/studio/privacy?id='+encodeURIComponent(id)))}/>;
}

function PrivacyEditor({data,onReload}:{data:State;onReload:()=>Promise<void>}){
 const r=data.record;
 const [contact,setContact]=useState(localTime(r.lastContactAt)),[ongoing,setOngoing]=useState(r.ongoingFollowUp),[hold,setHold]=useState(r.holdReason),[review,setReview]=useState(r.holdReviewOn?.slice(0,10)||''),[request,setRequest]=useState(false),[verified,setVerified]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const dirty=contact!==localTime(r.lastContactAt)||ongoing!==r.ongoingFollowUp||hold!==r.holdReason||review!==(r.holdReviewOn?.slice(0,10)||'')||request||verified;
 useUnsavedWork(dirty);

 async function save(){
  setBusy(true);
  try{
   await studioFetch('/api/studio/privacy',{
    id:r.id,
    version:r.version,
    lastContactAt:contact===localTime(r.lastContactAt)?new Date(r.lastContactAt).toISOString():new Date(contact+':00+05:30').toISOString(),
    ongoingFollowUp:ongoing,
    holdReason:hold,
    holdReviewOn:review||null,
    recordDeletionRequest:request,
    verifyIdentity:verified
   });
   await onReload();
  }catch(e){
   setMessage(e instanceof Error?e.message:'Keep your edits and retry.');
  }finally{
   setBusy(false);
  }
 }

 async function handleErase(){
  if(!confirm("Are you sure you want to permanently erase this customer's personal details, reference photos, notes, and brief? This action is recorded in the minimal compliance erasure ledger and cannot be undone.")) return;
  setBusy(true);
  try{
   await studioFetch('/api/studio/privacy',{
    id:r.id,
    action:'erase',
    confirm:'confirm-erasure',
    reason:r.identityVerifiedAt?'customer_request':'retention_expiry'
   });
   await onReload();
   setMessage('Customer data permanently erased. Ledger entry recorded.');
  }catch(e){
   setMessage(e instanceof Error?e.message:'Erasure failed.');
  }finally{
   setBusy(false);
  }
 }

 return (
  <section className={s.panel} data-unsaved={dirty?'true':undefined} data-studio-saving={busy}>
   <h2>Privacy & retention</h2>
   {r.erasedAt && (
    <div style={{padding:'12px',marginBottom:'16px',background:'rgba(22,101,52,0.2)',border:'1px solid #166534',borderRadius:'4px'}}>
     <strong>✓ Customer personal data permanently erased</strong>
     <p style={{margin:'4px 0 0 0',fontSize:'0.875rem'}}>Erased on: {formatBusinessTime(r.erasedAt)}. Compliance record preserved in minimal erasure ledger.</p>
    </div>
   )}
   <p>Record meaningful customer contact separately from internal notes. A documented hold or requested ongoing follow-up pauses policy deletion. Hold review dates do not automatically release a hold.</p>
   <fieldset disabled={busy || Boolean(r.erasedAt)}>
    <label>Last meaningful customer interaction (IST)<input type="datetime-local" value={contact} onChange={e=>setContact(e.target.value)}/></label>
    <label><input type="checkbox" checked={ongoing} onChange={e=>setOngoing(e.target.checked)}/>The customer requested ongoing follow-up</label>
    <label>Retention exception or legal hold<textarea maxLength={400} value={hold} onChange={e=>{setHold(e.target.value);if(!e.target.value.trim())setReview('');}} placeholder="Record the reason without unnecessary personal details"/></label>
    <label>Review hold on (IST)<input type="date" disabled={!hold.trim()||busy} value={review} onChange={e=>setReview(e.target.value)}/></label>
    {!r.deletionRequestedAt?<label><input type="checkbox" checked={request} onChange={e=>{setRequest(e.target.checked);if(!e.target.checked)setVerified(false);}}/>A deletion request has been received</label>:<p>Deletion requested: {formatBusinessTime(r.deletionRequestedAt)}</p>}
    {!r.identityVerifiedAt?<label><input type="checkbox" checked={verified} disabled={!request&&!r.deletionRequestedAt||busy} onChange={e=>setVerified(e.target.checked)}/>I completed proportionate identity verification</label>:<p>Identity verified: {formatBusinessTime(r.identityVerifiedAt)}</p>}
    <button disabled={!dirty||busy||Boolean(r.erasedAt)} onClick={()=>void save()}>{busy?'Saving…':'Save retention controls'}</button>
   </fieldset>

   {data.deletionAvailable && !r.erasedAt && (
    <div style={{marginTop:'16px',padding:'12px',border:'1px solid #b91c1c',borderRadius:'4px',background:'rgba(185,28,28,0.08)'}}>
     <h3 style={{margin:'0 0 8px 0',color:'#f87171'}}>Verified Customer Data Erasure (CR-04/18)</h3>
     <p style={{margin:'0 0 12px 0',fontSize:'0.875rem'}}>This inquiry is eligible for permanent customer data anonymization and reference purging.</p>
     <button style={{background:'#b91c1c',color:'#fff',borderColor:'#b91c1c'}} disabled={busy} onClick={()=>void handleErase()}>
      {busy?'Erasing…':'Permanently erase customer data'}
     </button>
    </div>
   )}

   <p role="status">{message}</p>
   <p>Order records: {data.decision.inquiryDueAt?formatBusinessTime(data.decision.inquiryDueAt):'Retained while the order is open'}. Reference images: {data.decision.referencesDueAt?formatBusinessTime(data.decision.referencesDueAt):'Retained while the order is open'}.</p>
   {data.decision.blocked&&<p>Deletion paused: {data.decision.blocked}.</p>}
   {data.ledger && data.ledger.length > 0 && (
    <div style={{marginTop:'12px',fontSize:'0.85rem'}}>
     <h4>Erasure Ledger Audit History:</h4>
     {data.ledger.map(l => (
      <div key={l.id} style={{padding:'6px 0',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
       <span>Ref: {l.reference} · Reason: {l.reason} · Erased by: {l.erasedBy} · {formatBusinessTime(l.erasedAt)}</span>
      </div>
     ))}
    </div>
   )}
   <p>Bhavya Gondaliya handles verified deletion requests, managed exports and backup expiry through the deletion procedure. Acknowledge requests within two business days; target completion within 30 calendar days after identity verification, explaining any lawful exception.</p>
  </section>
 );
}

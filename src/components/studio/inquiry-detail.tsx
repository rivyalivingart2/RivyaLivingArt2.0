'use client';
import {formatBusinessTime} from '@/lib/business-time';
import {Phone, Mail, MessageSquare} from 'lucide-react';
import {PrivacyControls} from './privacy-controls';
import {useRef,useState} from 'react';
import type {ShopProduct} from '@/lib/shop-model';
import {stageLabel,type OrderStage} from '@/lib/studio-orders';
import type {OrderReceipt} from '@/lib/order-receipt';
import type {OperationalAmendment} from '@/lib/studio-amendment';
import {SavedOrderActions} from '@/components/shop/saved-order-actions';
import {studioFetch,type StaffMember} from './workspace-api';
import {useUnsavedWork} from './use-unsaved-work';
import s from './workspace.module.css';
export type StageEvent={actor:string;from_status:string|null;to_status:string;createdAt:string;reason?:string};
export type InquiryDetailData={inquiry:{id:string;reference:string;product:ShopProduct|null;requestKind:'product'|'bespoke';savedAnswers:{label:string;value:string}[]|null;receipt:OrderReceipt;name:string;phone:string;email:string;answers:Record<string,string>;notes:string;summary:string;assignee:string|null;followUp:string|null;createdAt:string;version:number;status:OrderStage;evidence:{contractVersion:number;schemaId:string|null;schemaVersion:number|null;source:string|null;route:string|null;consentVersion:string|null;consentAcceptedAt:string|null;referenceCount:number|null;messageState:string|null}};refs:{id:string}[];notes:{id:number;actor:string;body:string;createdAt:string}[];amendments:(OperationalAmendment&{id:number;actor:string;createdAt:string})[];events:StageEvent[]};
export function InquiryDetail({initial,staff,admin,onSaved}:{initial:InquiryDetailData;staff:StaffMember[];admin:boolean;onSaved:()=>Promise<void>}){
 const [data,setData]=useState(initial),[assignee,setAssignee]=useState(initial.inquiry.assignee||''),[followUp,setFollowUp]=useState(initial.inquiry.followUp?.slice(0,10)||'');
 const [note,setNote]=useState(''),[reason,setReason]=useState(''),[instructions,setInstructions]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[conflict,setConflict]=useState(false);
 const requestId=useRef<string|null>(null),inFlight=useRef(false);
 const [recoveryReason,setRecoveryReason]=useState('');
 const assignmentDirty=assignee!==(data.inquiry.assignee||'')||followUp!==(data.inquiry.followUp?.slice(0,10)||'');
 const dirty=assignmentDirty||!!note||!!reason||!!instructions||!!recoveryReason;
 useUnsavedWork(dirty);
 async function refresh(keepAssignment=false){
  const next=await studioFetch('/api/studio/workspace?view=inquiry&id='+encodeURIComponent(data.inquiry.id));
  if(!next.inquiry)throw Error('This inquiry is no longer available to your account.');
  setData(next);if(!keepAssignment){setAssignee(next.inquiry.assignee||'');setFollowUp(next.inquiry.followUp?.slice(0,10)||'');}setConflict(false);
 }
 async function save(action:'note'|'assign'|'amendment'){
  if(inFlight.current)return;inFlight.current=true;setBusy(true);setMessage('Saving…');
  const id=data.inquiry.id;
  if(action==='amendment'&&!requestId.current)requestId.current=crypto.randomUUID();
  const payload=action==='note'?{action,id,note}:action==='amendment'?{action,id,version:data.inquiry.version,requestId:requestId.current,reason,instructions}:{action:admin?'assign':'follow-up',id,version:data.inquiry.version,assignee:assignee||null,followUp:followUp||null};
  try{
   await studioFetch('/api/studio/workspace',payload);
   if(action==='note')setNote('');
   if(action==='amendment'){setReason('');setInstructions('');requestId.current=null;}
   if(action==='assign')setData(v=>({...v,inquiry:{...v.inquiry,assignee:admin?assignee||null:v.inquiry.assignee,followUp:followUp||null,version:v.inquiry.version+1}}));
   setMessage('Saved.');
   try{await refresh(action!=='assign'&&assignmentDirty);await onSaved();}catch{setConflict(true);setMessage('Saved, but the latest record could not be loaded. Reload this record before making another change.');}
  }catch(e){setMessage(e instanceof Error?e.message:'Save could not be confirmed. Keep your edits and retry.');if(e instanceof Error&&'status' in e&&e.status===409)setConflict(true);}
  finally{inFlight.current=false;setBusy(false);}
 }
 async function recoverMessage(){
  if(inFlight.current||recoveryReason.trim().length<10||!window.confirm('Restore five preparation attempts after reviewing the fault? The original brief and destination will stay unchanged. Nothing will be sent.'))return;
  inFlight.current=true;setBusy(true);
  try{const next=await studioFetch('/api/studio/inquiry-handoff',{id:data.inquiry.id,action:'recover',reason:recoveryReason.trim()});setData(v=>({...v,inquiry:{...v.inquiry,receipt:next.receipt}}));setRecoveryReason('');setMessage('Recovery recorded. Use Prepare saved order message to retry after the repair.');}
  catch(e){setMessage(e instanceof Error?e.message:'Recovery could not be confirmed. Refresh the saved inquiry.');}
  finally{inFlight.current=false;setBusy(false);}
 }
 const i=data.inquiry,e=i.evidence;
 return <div className={s.inquiryDetail} data-unsaved={dirty} data-studio-saving={busy}>
  <p role="status">{message}</p><p>{stageLabel(i.status)} · Website {i.requestKind==='bespoke'?'custom request':'product request'} · Record version {i.version}</p>
  <div className={s.actions}><button disabled={busy} onClick={async()=>{if(assignmentDirty&&!window.confirm('Reload the saved assignment and follow-up? Other typed notes and amendments will remain in this tab.'))return;try{await refresh();requestId.current=null;setMessage('Record refreshed. Review retained edits against the new version before saving.');}catch(err){setMessage(err instanceof Error?err.message:'Unable to reload.');}}}>Reload saved record</button></div>
  {conflict&&<p role="alert">Your typed text is retained. Reload, review the saved history for any completed change, then retry only what is still needed.</p>}
  <div className={s.contactQuickBar}>
    <a href={'tel:'+i.phone} className={s.contactActionBtn} title="Call customer">
      <Phone size={14} aria-hidden="true" />
      <span>Call {i.phone}</span>
    </a>
    {i.email && (
      <a href={'mailto:'+i.email} className={s.contactActionBtn} title="Email customer">
        <Mail size={14} aria-hidden="true" />
        <span>Email {i.name}</span>
      </a>
    )}
    {(() => {
      const rawDigits = i.phone.replace(/[^0-9]/g, '');
      const waNumber = rawDigits.length === 10 ? '91' + rawDigits : rawDigits;
      return (
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noreferrer"
          className={s.contactActionBtnWa}
          title="Open direct WhatsApp conversation with customer"
        >
          <MessageSquare size={14} aria-hidden="true" />
          <span>WhatsApp Chat ↗</span>
        </a>
      );
    })()}
  </div>
  <section className={s.panel}><h3>Original customer submission</h3><p>This is the saved brief. Staff changes below never replace these answers or the original order message.</p><dl>
   <dt>Piece</dt><dd>{i.product?i.product.name+' · '+i.product.id:'Custom piece · '+(i.receipt.brief?.title||'Saved custom request')}</dd>
   <dt>Name</dt><dd>{i.name}</dd><dt>Phone</dt><dd><a href={'tel:'+i.phone}>{i.phone}</a></dd><dt>Email</dt><dd>{i.email||'Not provided'}</dd><dt>Received</dt><dd>{formatBusinessTime(i.createdAt)}</dd>
   {(i.savedAnswers||Object.entries(i.answers).map(([label,value])=>({label,value}))).map(({label,value},index)=><div key={index} className={s.definitionRow}><dt>{label}</dt><dd>{value||'Not specified'}</dd></div>)}
   <dt>Customer notes</dt><dd className={s.preserveText}>{i.notes||'None'}</dd>
  </dl><details><summary>Saved source and consent evidence</summary><dl><dt>Contract</dt><dd>{e.contractVersion}</dd><dt>Form version</dt><dd>{e.schemaId&&e.schemaVersion?e.schemaId+' · '+e.schemaVersion:'Not recorded for this historical request'}</dd><dt>Source route</dt><dd>{e.route||'Not recorded'}</dd><dt>Consent version</dt><dd>{e.consentVersion||'Not recorded'}</dd><dt>Consent accepted</dt><dd>{e.consentAcceptedAt?formatBusinessTime(e.consentAcceptedAt):'Not recorded'}</dd><dt>References at submission</dt><dd>{e.referenceCount??'Not recorded'}</dd></dl></details></section>
  <section className={s.panel}><h3>Private reference images</h3>{data.refs.length?<div className={s.refs}>{data.refs.map((r,index)=><a key={r.id} href={'/studio/reference/'+r.id} target="_blank" rel="noreferrer">{/* Private originals stay behind the authenticated route. */}{/* eslint-disable-next-line @next/next/no-img-element */}<img src={'/api/studio/references/'+r.id} alt={'Open customer reference '+(index+1)} loading="lazy"/></a>)}</div>:<p>No reference images available.</p>}</section>
  <form className={s.panel} onSubmit={event=>{event.preventDefault();void save('assign');}}><h3>Assignment and follow-up</h3><fieldset disabled={busy||conflict}><div className={s.grid}><label>Assigned to<select disabled={!admin} value={assignee} onChange={event=>setAssignee(event.target.value)}><option value="">Unassigned</option>{staff.filter(p=>p.active||p.id===assignee).map(p=><option key={p.id} value={p.id} disabled={!p.active}>{p.name}{p.active?'':' (disabled)'}</option>)}</select></label><label>Follow-up date<input type="date" value={followUp} onChange={event=>setFollowUp(event.target.value)}/><div className={s.datePresets}><button type="button" className={s.datePresetBtn} onClick={() => { const d = new Date(); d.setDate(d.getDate() + 3); setFollowUp(d.toISOString().slice(0, 10)); }}>+3 days</button><button type="button" className={s.datePresetBtn} onClick={() => { const d = new Date(); d.setDate(d.getDate() + 7); setFollowUp(d.toISOString().slice(0, 10)); }}>+1 week</button><button type="button" className={s.datePresetBtn} onClick={() => { const d = new Date(); d.setDate(d.getDate() + 14); setFollowUp(d.toISOString().slice(0, 10)); }}>+2 weeks</button>{followUp && <button type="button" className={s.datePresetBtn} onClick={() => setFollowUp('')}>Clear</button>}</div></label></div><p>Follow-ups are internal reminders in Studio. No message is sent.</p><button disabled={!assignmentDirty}>{admin?'Save assignment and date':'Save follow-up date'}</button></fieldset></form>
  <section className={s.panel}><h3>Operational amendments</h3><p>Record agreed changes with a reason. Amendments are append-only staff instructions; the customer’s original brief and saved WhatsApp message stay unchanged.</p>
   {data.amendments.length?data.amendments.map(a=><article key={a.id} className={s.notes}><small>{a.actor} · {formatBusinessTime(a.createdAt)} · Record version {a.orderVersion}</small><p><strong>Reason:</strong> {a.reason}</p><p>{a.instructions}</p></article>):<p>No amendments recorded.</p>}
   <form onSubmit={event=>{event.preventDefault();void save('amendment');}}><fieldset disabled={busy||conflict}><label>Reason for the amendment<input required maxLength={300} value={reason} onChange={event=>{setReason(event.target.value);requestId.current=null;}}/></label><label>Revised working instructions<textarea required rows={4} maxLength={1200} value={instructions} onChange={event=>{setInstructions(event.target.value);requestId.current=null;}}/></label><button disabled={!reason.trim()||!instructions.trim()}>Append amendment</button></fieldset></form>
  </section>
  <section className={s.panel}><h3>Internal notes</h3>{data.notes.length?data.notes.map(n=><article className={s.notes} key={n.id}><small>{n.actor} · {formatBusinessTime(n.createdAt)}</small><p>{n.body}</p></article>):<p>No internal notes yet.</p>}<form onSubmit={event=>{event.preventDefault();void save('note');}}><fieldset disabled={busy||conflict}><label>Add a private note<textarea rows={3} maxLength={2000} required value={note} onChange={event=>setNote(event.target.value)}/></label><button disabled={!note.trim()}>Save note</button></fieldset></form></section>
  <section className={s.panel}><h3>Original saved order message</h3><SavedOrderActions key={i.id} receipt={i.receipt} endpoint={'/api/studio/inquiry-handoff?id='+encodeURIComponent(i.id)} identity={{id:i.id}} onChange={receipt=>setData(v=>({...v,inquiry:{...v.inquiry,receipt}}))}/>{i.receipt.summary&&<pre className={s.summary}>{i.receipt.summary}</pre>}{admin&&i.receipt.recoveryRequired&&<form onSubmit={event=>{event.preventDefault();void recoverMessage();}}><h4>Administrator recovery</h4><p>Review the preparation failure and fix its cause first. The original saved brief and destination cannot be changed here.</p><label>Checked cause and repair<textarea required minLength={10} maxLength={400} disabled={busy} value={recoveryReason} onChange={event=>setRecoveryReason(event.target.value)}/></label><button disabled={busy||recoveryReason.trim().length<10}>Review restoration of preparation attempts</button></form>}</section>
  {admin&&<PrivacyControls id={i.id}/>}
  <details className={s.panel}><summary>Stage history — {data.events.length} events</summary>{data.events.map((v,index)=><p key={index}>{formatBusinessTime(v.createdAt)} · {v.actor}: {v.from_status?stageLabel(v.from_status):'Received'} → {stageLabel(v.to_status)}{v.reason?' · '+v.reason:''}</p>)}</details>
 </div>;
}

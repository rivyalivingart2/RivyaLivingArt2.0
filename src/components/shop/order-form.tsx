'use client';
import {useEffect,useRef,useState} from 'react';
import {useRouter,useSearchParams} from 'next/navigation';
import Link from 'next/link';
import Image from './public-image';
import type {ShopProduct} from '@/lib/shop-model';
import {fieldVisible,validateAnswers} from '@/lib/product-form';
import {productDefinition,reconcileAnswers,type InquiryDefinition} from '@/lib/inquiry-definition';
import {orderConsentVersion,orderConsentText} from '@/lib/order-consent';
import {contactIssues,type BriefContact} from '@/lib/brief-validation';
import {placeInquiry} from '@/app/actions/inquiry';
import {readDraft,rememberDraft,forgetDraft,type Reference} from './order-draft';
import s from './shop.module.css';
const steps=['Your piece','Your details & references','Review'];
type Props={product:ShopProduct;definition?:never}|{definition:InquiryDefinition;product?:never};
export function OrderForm(props:Props){
 const initial=props.definition??productDefinition(props.product!);
 const router=useRouter(),params=useSearchParams(),heading=useRef<HTMLHeadingElement>(null),honeypot=useRef<HTMLInputElement>(null),fallbackTextarea=useRef<HTMLTextAreaElement>(null);
 const [cached]=useState(()=>typeof window==='undefined'?undefined:readDraft(initial.schemaId));
 const [definition,setDefinition]=useState(cached?.definition||initial);
 const [replacement,setReplacement]=useState<InquiryDefinition|null>(cached&&cached.definition.schemaVersion!==initial.schemaVersion?initial:null);
 const [review,setReview]=useState<string[]>(cached?.review||[]);
 const [key,setKey]=useState(cached?.key||''),requestKey=useRef(cached?.key||'');
 const [ready,setReady]=useState(false),[busy,setBusy]=useState(false),[sealed,setSealed]=useState(cached?.sealed||false),[step,setStep]=useState(cached?.step||0);
 const [answers,setAnswers]=useState<Record<string,string>>(()=>cached?.answers||Object.fromEntries(initial.fields.flatMap(f=>{const value=params.get(f.id);return value&&value.length<=(f.maxLength??240)&&(f.type!=='select'||f.options?.includes(value))?[[f.id,value]]:[];})));
 const [contact,setContact]=useState<BriefContact>(()=>cached?.contact||{name:'',phone:'',email:'',notes:['variant','finish','colour','context'].flatMap(k=>{const value=params.get(k);return value?[k+': '+value.slice(0,400)]:[];}).join('\n')});
 const [consent,setConsent]=useState(cached?.consent||false),[refs,setRefs]=useState<Reference[]>(cached?.references||[]);
 const [errors,setErrors]=useState<Record<string,string>>({}),[message,setMessage]=useState(''),[failure,setFailure]=useState(false),[sessionAttempt,setSessionAttempt]=useState(0);
 const [reconnecting,setReconnecting]=useState(false),[refreshing,setRefreshing]=useState(false);
 const lock=useRef(false),uploadLock=useRef(false),saved=useRef(false),requests=useRef(new Set<XMLHttpRequest>()),uploadEpoch=useRef(0);
 const bespoke=definition.kind==='bespoke',editingLocked=busy||sealed;
 const transferring=refs.some(r=>r.state==='uploading'||r.state==='pending');
 const dirty=!!(refs.length||Object.values(answers).some(Boolean)||Object.values(contact).some(Boolean)||consent||sealed);
 const notify=(text:string,error=false)=>{setMessage(text);setFailure(error);};
 useEffect(()=>{
  if(!requestKey.current)requestKey.current=crypto.randomUUID();
  setKey(requestKey.current);
  const controller=new AbortController();let active=true;
  setReady(false);setReconnecting(true);
  void fetch('/api/inquiry/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:requestKey.current}),signal:controller.signal}).then(async r=>{const data=await r.json();if(!r.ok)throw Error(data.error||'The form is temporarily unavailable.');if(active){setReady(true);if(data.finalized)setSealed(true);notify(data.finalized?'This request has already been saved. Retry the unchanged brief or check its saved receipt.':'Your secure form is ready.');}}).catch(e=>{if(active)notify(e instanceof Error?e.message:'Unable to prepare the form.',true);}).finally(()=>{if(active)setReconnecting(false);});
  return()=>{active=false;controller.abort();};
 },[sessionAttempt,bespoke]);
 useEffect(()=>{if(key&&!saved.current){if(dirty)rememberDraft(initial.schemaId,{definition,key,answers,contact,consent,references:refs,step,review,sealed});else forgetDraft(initial.schemaId);}},[initial.schemaId,definition,key,answers,contact,consent,refs,step,review,sealed,dirty]);
 useEffect(()=>{
  const warn=(e:BeforeUnloadEvent)=>{if(dirty&&!saved.current){e.preventDefault();e.returnValue='';}};
  const leave=(e:MouseEvent)=>{const a=e.target instanceof Element?e.target.closest('a'):null;if(!dirty||saved.current||!a||a.target==='_blank'||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||a.getAttribute('href')?.startsWith('#'))return;if(!window.confirm('Leave this form? Your brief stays in this tab’s temporary memory for up to 30 minutes, but reloading or closing the tab loses it.')){e.preventDefault();e.stopPropagation();}};
  window.addEventListener('beforeunload',warn);document.addEventListener('click',leave,true);
  return()=>{window.removeEventListener('beforeunload',warn);document.removeEventListener('click',leave,true);};
 },[dirty]);
 useEffect(()=>{const active=requests.current;return()=>{uploadEpoch.current++;for(const xhr of active)xhr.abort();};},[]);
 const go=(n:number)=>{setStep(n);requestAnimationFrame(()=>heading.current?.focus());};
 const updateRef=(id:string,patch:Partial<Reference>)=>setRefs(v=>v.map(r=>r.localId===id?{...r,...patch}:r));
 function upload(reference:Reference){
  updateRef(reference.localId,{state:'uploading',error:undefined,progress:0});
  return new Promise<void>(resolve=>{
   const xhr=new XMLHttpRequest();requests.current.add(xhr);
   xhr.open('POST','/api/inquiry/reference');xhr.timeout=90000;
   xhr.setRequestHeader('Content-Type',reference.file.type);xhr.setRequestHeader('X-Inquiry-Key',requestKey.current);xhr.setRequestHeader('X-Upload-Key',reference.localId);
   xhr.upload.onprogress=e=>{if(e.lengthComputable)updateRef(reference.localId,{progress:Math.round(e.loaded/e.total*100)});};
   const finish=(error?:string,id?:string)=>{requests.current.delete(xhr);updateRef(reference.localId,error?{state:'failed',error}:{state:'saved',id,progress:100});resolve();};
   xhr.onload=()=>{try{const data=JSON.parse(xhr.responseText);if(xhr.status<200||xhr.status>=300||typeof data.id!=='string')finish(data.error||'Upload failed. Retry or remove this image.');else finish(undefined,data.id);}catch{finish('The upload could not be confirmed. Retry this same image.');}};
   xhr.onerror=()=>finish('Connection lost. Retry this same image; your brief is still here.');
   xhr.ontimeout=()=>finish('The upload timed out. Retry this same image to check its saved status.');
   xhr.onabort=()=>finish('Upload interrupted. Retry this same image.');
   try{xhr.send(reference.file);}catch{finish('The upload could not start. Retry this same image.');}
  });
 }
 async function runUploads(selected:Reference[]){
  if(uploadLock.current||editingLocked||!ready)return;uploadLock.current=true;
  const epoch=uploadEpoch.current;
  try{for(const reference of selected){if(epoch!==uploadEpoch.current)break;await upload(reference);}}finally{uploadLock.current=false;}
 }
 async function select(files:File[]){
  if(uploadLock.current||editingLocked||!ready||!files.length)return;
  if(files.length+refs.length>3){notify('Select up to three images in total. No new files were uploaded.',true);return;}
  if(files.some(f=>!f.size||f.size>3*1024*1024||!['image/jpeg','image/png','image/webp'].includes(f.type))){notify('Each image must be a non-empty JPG, PNG or WebP of at most 3 MB. No new files were uploaded.',true);return;}
  const selected=files.map(file=>({localId:crypto.randomUUID(),file,state:'pending' as const}));setRefs(v=>[...v,...selected]);notify('Uploading your private references…');await runUploads(selected);
 }
 async function remove(reference:Reference){
  if(transferring||editingLocked||uploadLock.current)return;
  setBusy(true);
  try{const response=await fetch('/api/inquiry/reference',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:reference.id,uploadKey:reference.localId,key})});const data=await response.json();if(!response.ok)throw Error(data.error||'The reference could not be removed.');setRefs(v=>v.filter(r=>r.localId!==reference.localId));notify('Reference removed from this brief.');}
  catch(e){notify(e instanceof Error?e.message:'The reference could not be removed. Retry before submitting.',true);}finally{setBusy(false);}
 }
 function contactErrors(){const issues=contactIssues(contact,consent);if(refs.some(r=>r.state!=='saved'||!r.id))issues.references='Retry or remove incomplete references before continuing.';return issues;}
 function getFirstErrorElementId(errs:Record<string,string>,currentStep:number){
  const firstId=Object.keys(errs)[0];
  if(!firstId)return null;
  if(currentStep===0)return 'answer-'+firstId;
  if(firstId==='consent')return 'contact-consent';
  if(firstId==='references')return 'reference-files';
  return 'contact-'+firstId;
 }
 function next(){
  const issues=step===0?validateAnswers(definition.fields,answers):contactErrors();
  setErrors(issues);
  if(Object.keys(issues).length){
   notify('Please check the linked fields below.',true);
   const firstId=getFirstErrorElementId(issues,step);
   requestAnimationFrame(()=>{const el=firstId?document.getElementById(firstId):null;if(el)el.focus();else heading.current?.focus();});
   return;
  }
  notify('');go(step+1);
 }
 async function refreshSchema(){
  if(editingLocked||transferring)return;setRefreshing(true);
  try{const response=await fetch('/api/inquiry/schema?'+(bespoke?'kind=bespoke':'product='+encodeURIComponent(definition.product!.id)),{cache:'no-store'});const data=await response.json();if(!response.ok)throw Error(data.error);if(data.definition.schemaVersion===definition.schemaVersion){notify('You are using the current form.');}else{setReplacement(data.definition);notify('Review the updated form before applying it. Your current answers are kept.',true);}}
  catch(e){notify(e instanceof Error?e.message:'Current options could not be loaded.',true);}finally{setRefreshing(false);}
 }
 function applySchema(){
  if(!replacement||editingLocked)return;
  const reconciled=reconcileAnswers(definition,replacement,answers);
  setDefinition(replacement);setAnswers(reconciled.answers);setReview(v=>[...v,...reconciled.review]);setReplacement(null);setErrors({});notify('Current options loaded. Review all fields before submitting.');go(0);
 }
 const visibleFields=definition.fields.filter(f=>fieldVisible(f,answers));
 const brief=[definition.title,...visibleFields.filter(f=>answers[f.id]).map(f=>f.label+': '+answers[f.id]),'Name: '+contact.name,'Phone: '+contact.phone,contact.email?'Email: '+contact.email:'',contact.notes?'Notes: '+contact.notes:'','Private reference files: '+refs.map(r=>r.file.name+' ('+r.state+')').join(', '),...review.map(v=>'Previous answer to review: '+v)].filter(Boolean).join('\n');
 const [copyFallback,setCopyFallback]=useState(false);
 async function copyBrief(){try{await navigator.clipboard.writeText(brief);notify('Brief copied. This does not save an inquiry or send a message.');}catch{setCopyFallback(true);notify('Select and copy the brief below. Nothing has been submitted.');}}
 async function submit(){
  if(lock.current||!ready||review.length||replacement)return;
  const issues={...validateAnswers(definition.fields,answers),...contactErrors()};setErrors(issues);
  if(Object.keys(issues).length){
   notify('Please check your details.',true);
   const targetStep=Object.keys(validateAnswers(definition.fields,answers)).length?0:1;
   go(targetStep);
   const firstId=getFirstErrorElementId(issues,targetStep);
   requestAnimationFrame(()=>{const el=firstId?document.getElementById(firstId):null;if(el)el.focus();});
   return;
  }
  lock.current=true;setBusy(true);setSealed(true);notify('Saving your inquiry and references…');
  const form=new FormData();form.set('kind',definition.kind);form.set('schemaId',definition.schemaId);form.set('schemaVersion',String(definition.schemaVersion));if(definition.product){form.set('productId',definition.product.id);form.set('revision',String(definition.schemaVersion));}form.set('consentVersion',orderConsentVersion);form.set('requestKey',key);form.set('consent','on');form.set('website',honeypot.current?.value||'');
  for(const f of visibleFields)form.set('answer_'+f.id,answers[f.id]||'');for(const [name,value] of Object.entries(contact))form.set(name,value);for(const reference of refs)if(reference.id)form.append('reference',reference.id);
  try{const result=await placeInquiry(form);
   if(result.error){setSealed(!result.code||result.code==='SAVE_UNCONFIRMED');setErrors(result.fields||{});notify(result.error,true);if(result.code==='SESSION_REQUIRED')setReady(false);if(result.definition)setReplacement(result.definition);if(result.fields)go(Object.keys(result.fields).some(id=>definition.fields.some(f=>f.id===id))?0:1);return;}
   if(!result.reference)throw Error();saved.current=true;forgetDraft(initial.schemaId);router.push('/inquiry/received?key='+encodeURIComponent(key)+'&continue=1');
  }catch{notify('We could not confirm the save. Editing is paused so retry sends the exact same brief. Your details are still here.',true);}finally{lock.current=false;setBusy(false);}
 }
 return <div className={s.formLayout}>
 <aside className={s.formAside}>{definition.product&&<div className={s.detailVisual}><Image src={definition.product.image} alt={definition.product.imageAlt||definition.title+' design visualization'} fill sizes="(max-width:780px) 100px, 340px"/></div>}<h2>{definition.title}</h2><p>{definition.subtitle}<br/>Price on request</p><p>Final design, quotation and delivery are agreed with the atelier.</p><p className={s.help}>Your unsaved brief is kept only in this tab’s temporary memory. Copy it before closing or reloading.</p><button type="button" className={s.textLink} onClick={()=>void copyBrief()}>Copy my unsaved brief</button></aside>
 <form className={s.form} noValidate aria-busy={busy} onSubmit={e=>{e.preventDefault();if(step<2)next();else void submit();}}>
 <noscript><p role="status">JavaScript is needed to prepare a secure request. You can use the contact page to reach the atelier.</p></noscript>
 <div className={s.hidden} aria-hidden="true"><label>Leave this field empty<input ref={honeypot} name="website" autoComplete="off" tabIndex={-1}/></label></div>
 {!ready&&<p className={s.serviceNotice} role="status">{reconnecting?'Preparing secure order saving…':'Saving is currently unavailable. You can prepare and copy your brief here. Nothing has been submitted.'}</p>}
 <ol className={s.stepper}>{steps.map((label,n)=><li key={label} aria-current={step===n?'step':undefined}><span>0{n+1}</span>{label}</li>)}</ol>
 <div className={s.mobileStepper} aria-hidden="true"><div className={s.mobileStepHeader}><span className={s.mobileStepCounter}>Step 0{step+1} of 0{steps.length}</span><span className={s.mobileStepName}>{steps[step]}</span></div><div className={s.mobileStepBar}><div className={s.mobileStepProgress} style={{width:`${((step+1)/steps.length)*100}%`}}/></div></div>
 <h2 ref={heading} tabIndex={-1}>{steps[step]}</h2><p className={s.help}>Fields marked * are required. Ask for help where you are unsure; preferences are requests for review.</p>
 {replacement&&<section className={s.serviceNotice} aria-label="Updated customization form"><h3>The form has changed.</h3><p>Your current answers and references are retained. Apply version {replacement.schemaVersion}, then review the changes. Answers that cannot carry forward will remain visible for you to copy or reconcile.</p><button type="button" className={s.button} disabled={editingLocked||transferring} onClick={applySchema}>Review current options</button></section>}
 {!!review.length&&<section className={s.serviceNotice}><h3>Previous answers to reconcile</h3><pre className={s.receiptSummary}>{review.join('\n')}</pre><p>Copy any useful details into the new fields or notes before continuing.</p><button type="button" disabled={editingLocked} onClick={()=>setReview([])}>I have reconciled these answers</button></section>}
 {!!Object.keys(errors).length&&<div role="alert" aria-live="assertive" className={s.errorSummary}><p>Please check:</p><ul>{Object.entries(errors).map(([id,error])=><li key={id}><a href={'#'+(definition.fields.some(f=>f.id===id)?'answer-':'contact-')+id} onClick={e=>{e.preventDefault();const n=definition.fields.some(f=>f.id===id)?0:1;setStep(n);requestAnimationFrame(()=>document.getElementById((n===0?'answer-':'contact-')+id)?.focus());}}>{error}</a></li>)}</ul></div>}
 {step===0&&<fieldset disabled={editingLocked}><legend className={s.hidden}>Your preferences</legend><div className={s.fields}>{visibleFields.map(f=><label className={s.field+(errors[f.id]?' '+s.fieldError:'')} key={f.id} htmlFor={'answer-'+f.id}>{f.label}{f.required?' *':''}
 {f.type==='select'?<select id={'answer-'+f.id} required={f.required} value={answers[f.id]||''} onChange={e=>setAnswers(v=>({...v,[f.id]:e.target.value}))} aria-invalid={!!errors[f.id]} aria-describedby={'help-'+f.id}><option value="">Choose a direction</option>{f.options?.map(o=><option key={o}>{o}</option>)}</select>:<input id={'answer-'+f.id} required={f.required} type={f.type==='number'?'number':'text'} inputMode={f.type==='number'?'numeric':undefined} min={f.type==='number'?f.min??1:undefined} max={f.type==='number'?f.max??500:undefined} step={f.type==='number'?1:undefined} maxLength={f.maxLength??240} value={answers[f.id]||''} onChange={e=>setAnswers(v=>({...v,[f.id]:e.target.value}))} aria-invalid={!!errors[f.id]} aria-describedby={'help-'+f.id}/>}
 <span id={'help-'+f.id} role={errors[f.id]?'alert':undefined} className={errors[f.id]?s.error:s.help}>{errors[f.id]||f.hint}</span></label>)}</div></fieldset>}
 {step===1&&<fieldset disabled={editingLocked}><legend className={s.hidden}>Contact and private references</legend><div className={s.fields}>
 {([{id:'name',label:'Your name *',type:'text',auto:'name',max:100},{id:'phone',label:'Phone number *',type:'tel',auto:'tel',max:20},{id:'email',label:'Email (optional)',type:'email',auto:'email',max:180}] as const).map(f=><label className={s.field+(errors[f.id]?' '+s.fieldError:'')} key={f.id} htmlFor={'contact-'+f.id}>{f.label}<input id={'contact-'+f.id} type={f.type} required={f.id!=='email'} autoComplete={f.auto} maxLength={f.max} value={contact[f.id]} onChange={e=>setContact(v=>({...v,[f.id]:e.target.value}))} aria-invalid={!!errors[f.id]} aria-describedby={errors[f.id]?'error-'+f.id:undefined}/><span id={'error-'+f.id} role={errors[f.id]?'alert':undefined} className={s.error}>{errors[f.id]}</span></label>)}
 <label className={s.field+' '+s.wide+(errors.notes?' '+s.fieldError:'')} htmlFor="contact-notes">Notes (optional)<textarea id="contact-notes" aria-invalid={!!errors.notes} aria-describedby={errors.notes?'error-notes':undefined} rows={4} maxLength={1200} value={contact.notes} onChange={e=>setContact(v=>({...v,notes:e.target.value}))}/><span id="error-notes" role={errors.notes?'alert':undefined} className={s.error}>{errors.notes}</span></label>
 <label id="contact-references" tabIndex={-1} className={s.field+' '+s.wide+(errors.references?' '+s.fieldError:'')} htmlFor="reference-files">Reference images (optional)<input id="reference-files" type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={!ready||transferring||refs.length===3} aria-invalid={!!errors.references} aria-describedby={'reference-help'+(errors.references?' reference-error':'')} onChange={e=>{const files=Array.from(e.target.files||[]);e.target.value='';void select(files);}}/><span id="reference-help" className={s.help}>Up to 3 images, 3 MB each (9 MB total). Stored privately for authorized staff. Images cannot attach automatically to a WhatsApp text link.</span></label>
 </div><div aria-live="polite" aria-relevant="additions text">{refs.map(r=><div className={s.uploadItem} key={r.localId}><span>{r.file.name} · {r.state==='saved'?'Saved privately':r.state==='uploading'?(r.progress===100?'Processing securely…':'Uploading…'):r.state==='failed'?r.error:'Waiting…'}{r.state==='uploading'&&<progress max={100} value={r.progress||0} aria-label={'Upload progress for '+r.file.name}/>}</span><div>{r.state==='failed'&&<button type="button" disabled={!ready||transferring} onClick={()=>void runUploads([r])}>Retry</button>}<button type="button" disabled={transferring} onClick={()=>void remove(r)}>Remove</button></div></div>)}</div><p id="reference-error" role={errors.references?'alert':undefined} className={s.error}>{errors.references}</p>
 <label className={s.check+(errors.consent?' '+s.fieldError:'')}><input id="contact-consent" type="checkbox" required aria-invalid={!!errors.consent} aria-describedby={errors.consent?'error-consent':undefined} checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>{orderConsentText} <Link className={s.textLink} href="/privacy" target="_blank" rel="noreferrer">Privacy details (opens a new tab)</Link></span></label><p id="error-consent" role={errors.consent?'alert':undefined} className={s.error}>{errors.consent}</p></fieldset>}
 {step===2&&<section><p>Check your brief before it is saved. Return to either step to make a change.</p><dl className={s.reviewList}><dt>Request</dt><dd>{definition.title}{definition.product?' · '+definition.product.id:''}</dd>{visibleFields.map(f=><div key={f.id} style={{display:'contents'}}><dt>{f.label}</dt><dd>{answers[f.id]||'Not specified'}</dd></div>)}<dt>Name</dt><dd>{contact.name}</dd><dt>Phone</dt><dd>{contact.phone}</dd><dt>Email</dt><dd>{contact.email||'Not provided'}</dd><dt>Notes</dt><dd>{contact.notes||'None'}</dd><dt>Private references</dt><dd>{refs.length} saved {refs.length===1?'image':'images'}</dd></dl><p className={s.help}>Save order details records your inquiry in the database and Studio before WhatsApp opens. It does not confirm a sale or collect a payment. You still tap Send in WhatsApp.</p><div className={s.actions}><button type="button" disabled={editingLocked} onClick={()=>go(0)}>Edit your piece</button><button type="button" disabled={editingLocked} onClick={()=>go(1)}>Edit details & references</button></div></section>}
 <p id="contact-form" tabIndex={-1} role={failure?'alert':'status'} className={failure?s.error:s.help}>{message}</p>
 {sealed&&!busy&&<p className={s.serviceNotice}>Editing is paused until this save is resolved. Retry sends the same brief. <Link className={s.textLink} href={'/inquiry/received?key='+encodeURIComponent(key)} target="_blank" rel="noreferrer">Check saved inquiry (new tab)</Link></p>}
 {!ready&&<button type="button" className={s.button} disabled={busy||reconnecting} onClick={()=>setSessionAttempt(v=>v+1)}>{reconnecting?'Connecting…':'Reconnect form'}</button>}
 {<button type="button" className={s.textLink} disabled={editingLocked||refreshing||transferring} onClick={()=>void refreshSchema()}>{refreshing?'Checking options…':'Check current options'}</button>}
 <div className={s.actions}>{step>0&&<button type="button" className={s.button+' '+s.outline} disabled={editingLocked} onClick={()=>go(step-1)}>← Back</button>}<button type="submit" className={s.button} disabled={busy||transferring||!!review.length||!!replacement||(step===2&&!ready)}>{busy?'Saving inquiry…':step===2?(!ready?'Saving temporarily unavailable':sealed?'Retry the same save':'Save order details →'):step===0?'Your details →':'Review your brief →'}</button></div>
 {copyFallback&&<div><label className={s.field}>Copy your unsaved brief<textarea ref={fallbackTextarea} readOnly rows={10} value={brief} onFocus={e=>e.currentTarget.select()}/></label><div style={{display:'flex',gap:'10px',margin:'8px 0 16px'}}><button type="button" className={s.button+' '+s.outline} style={{minHeight:'44px'}} onClick={()=>{if(fallbackTextarea.current){fallbackTextarea.current.focus();fallbackTextarea.current.select();fallbackTextarea.current.setSelectionRange(0,99999);}}}>Select all text</button></div></div>}
 </form></div>;
}

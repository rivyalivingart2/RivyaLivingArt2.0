'use client';
import {useEffect,useRef,useState} from 'react';
import {useRouter,useSearchParams} from 'next/navigation';
import Link from 'next/link';
import Image from './public-image';
import type {ShopProduct} from '@/lib/shop-model';
import {fieldVisible,validateAnswers} from '@/lib/product-form';
import {placeInquiry} from '@/app/actions/inquiry';
import s from './shop.module.css';
type Reference={localId:string;file:File;id?:string;state:'pending'|'uploading'|'saved'|'failed';error?:string};
const steps=['Your piece','Your details & references','Review'];
export function OrderForm({product:p}:{product:ShopProduct}){
 const router=useRouter(),params=useSearchParams(),heading=useRef<HTMLHeadingElement>(null),lock=useRef(false);
 const [key,setKey]=useState(''),[ready,setReady]=useState(false),[busy,setBusy]=useState(false),[step,setStep]=useState(0);
 const [answers,setAnswers]=useState<Record<string,string>>(()=>Object.fromEntries(p.fields.flatMap(f=>{const value=params.get(f.id);return value&&value.length<=240&&(f.type!=='select'||f.options?.includes(value))?[[f.id,value]]:[];})));
 const [contact,setContact]=useState(()=>({name:'',phone:'',email:'',notes:['variant','finish','colour','context'].flatMap(k=>{const value=params.get(k);return value?[k+': '+value]:[];}).join('\n')})),[consent,setConsent]=useState(false);
 const [refs,setRefs]=useState<Reference[]>([]),[errors,setErrors]=useState<Record<string,string>>({}),[message,setMessage]=useState('Preparing a secure form…');
 const [sessionAttempt,setSessionAttempt]=useState(0);
 useEffect(()=>{let active=true;const requestKey=crypto.randomUUID();setKey(requestKey);void fetch('/api/inquiry/session',{method:'POST'}).then(async r=>{const data=await r.json();if(!r.ok)throw Error(data.error||'The form is temporarily unavailable.');if(active){setReady(true);setMessage('');}}).catch(e=>{if(active)setMessage(e instanceof Error?e.message:'Unable to prepare the form.');});return()=>{active=false;};},[sessionAttempt]);
 const go=(n:number)=>{setStep(n);requestAnimationFrame(()=>heading.current?.focus());};
 const updateRef=(id:string,patch:Partial<Reference>)=>setRefs(v=>v.map(r=>r.localId===id?{...r,...patch}:r));
 async function upload(reference:Reference){
   updateRef(reference.localId,{state:'uploading',error:undefined});
   try{
     const response=await fetch('/api/inquiry/reference',{method:'POST',headers:{'Content-Type':reference.file.type,'X-Inquiry-Key':key,'X-Upload-Key':reference.localId},body:reference.file});
     const data=await response.json();if(!response.ok)throw Error(data.error||'Upload failed.');
     updateRef(reference.localId,{state:'saved',id:data.id});
   }catch(e){updateRef(reference.localId,{state:'failed',error:e instanceof Error?e.message:'Upload failed. Try again.'});}
 }
 async function select(files:File[]){
   if(refs.some(r=>r.state==='uploading')||busy)return;
   if(files.length+refs.length>3){setMessage('Select up to three images in total. No new files were uploaded.');return;}
   if(files.some(f=>f.size>3*1024*1024||!['image/jpeg','image/png','image/webp'].includes(f.type))){setMessage('Each image must be JPG, PNG or WebP and at most 3 MB. No new files were uploaded.');return;}
   const selected=files.map(file=>({localId:crypto.randomUUID(),file,state:'pending' as const}));
   setRefs(v=>[...v,...selected]);setMessage('');
   for(const reference of selected)await upload(reference);
 }
 async function remove(reference:Reference){
   if(reference.state==='uploading'||busy)return;
   if(reference.id){try{const response=await fetch('/api/inquiry/reference',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:reference.id,key})});if(!response.ok)throw Error();}catch{setMessage('The reference could not be removed. Try again.');return;}}
   setRefs(v=>v.filter(r=>r.localId!==reference.localId));
 }
 function contactErrors(){
   const issues:Record<string,string>={};
   if(contact.name.trim().length<2)issues.name='Enter your name (at least two characters).';
   if(!/^\+?[0-9]{10,15}$/.test(contact.phone.replace(/[\s()-]/g,'')))issues.phone='Enter a phone number with country code when outside India.';
   if(contact.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))issues.email='Enter a valid email or leave it blank.';
   if(refs.some(r=>r.state!=='saved'))issues.references='Retry or remove incomplete references before continuing.';
   if(!consent)issues.consent='Please agree to saving the brief so the studio can respond.';
   if(contact.notes.length>1200)issues.notes='The carried-over context is too long. Please edit the notes to at most 1,200 characters.';
   return issues;
 }
 function next(){
   const issues=step===0?validateAnswers(p.fields,answers):contactErrors();setErrors(issues);
   if(Object.keys(issues).length){setMessage('Please check the highlighted fields.');requestAnimationFrame(()=>heading.current?.focus());return;}
   setMessage('');go(step+1);
 }
 async function submit(){
   if(lock.current||!ready)return;
   const issues={...validateAnswers(p.fields,answers),...contactErrors()};setErrors(issues);
   if(Object.keys(issues).length){setMessage('Please check your details.');go(Object.keys(validateAnswers(p.fields,answers)).length?0:1);return;}
   lock.current=true;setBusy(true);setMessage('Saving your inquiry and references…');
   const form=new FormData();form.set('productId',p.id);form.set('revision',String(p.revision));form.set('requestKey',key);form.set('consent','on');
   for(const f of p.fields)if(fieldVisible(f,answers))form.set('answer_'+f.id,answers[f.id]||'');
   for(const [name,value] of Object.entries(contact))form.set(name,value);
   for(const reference of refs)if(reference.id)form.append('reference',reference.id);
   try{
     const result=await placeInquiry(form);
     if(result.error){setErrors(result.fields||{});setMessage(result.error);if(result.fields)go(Object.keys(result.fields).some(id=>p.fields.some(f=>f.id===id))?0:1);return;}
     if(!result.reference)throw Error();
     router.push('/inquiry/received?key='+encodeURIComponent(key)+'&continue=1');
   }catch{setMessage('We could not confirm the save. Your details are still here. Retry uses the same submission and will not create another inquiry.');}
   finally{lock.current=false;setBusy(false);}
 }
 const visibleFields=p.fields.filter(f=>fieldVisible(f,answers));
 return <div className={s.formLayout}>
 <aside className={s.formAside}><div className={s.detailVisual}><Image src={p.image} alt={p.name+' design visualization'} fill sizes="(max-width:780px) 100px, 340px"/></div><h2>{p.name}</h2><p>{p.subtitle}<br/>Price on request</p><p>Final design, quotation and delivery are agreed with the atelier.</p></aside>
 <form className={s.form} noValidate onSubmit={e=>{e.preventDefault();if(step<2)next();else void submit();}}>
 <ol className={s.stepper}>{steps.map((label,n)=><li key={label} aria-current={step===n?'step':undefined}><span>0{n+1}</span>{label}</li>)}</ol>
 <h2 ref={heading} tabIndex={-1}>{steps[step]}</h2>
 <p className={s.help}>Fields marked * are required. “Help me choose” is always a useful starting point.</p>
 {step===0&&<fieldset disabled={busy}><legend className={s.hidden}>Your preferences</legend><div className={s.fields}>{visibleFields.map(f=><label className={s.field+(errors[f.id]?' '+s.fieldError:'')} key={f.id} htmlFor={'answer-'+f.id}>{f.label}{f.required?' *':''}
 {f.type==='select'?<select id={'answer-'+f.id} value={answers[f.id]||''} onChange={e=>setAnswers(v=>({...v,[f.id]:e.target.value}))} aria-invalid={!!errors[f.id]} aria-describedby={'help-'+f.id}><option value="">Choose a direction</option>{f.options?.map(o=><option key={o}>{o}</option>)}</select>:<input id={'answer-'+f.id} type={f.type==='number'?'number':'text'} min={f.min??1} max={f.max??500} maxLength={f.maxLength??240} value={answers[f.id]||''} onChange={e=>setAnswers(v=>({...v,[f.id]:e.target.value}))} aria-invalid={!!errors[f.id]} aria-describedby={'help-'+f.id}/>}
 <span id={'help-'+f.id} className={errors[f.id]?s.error:s.help}>{errors[f.id]||f.hint}</span></label>)}</div></fieldset>}
 {step===1&&<fieldset disabled={busy}><legend className={s.hidden}>Contact and private references</legend><div className={s.fields}>
 {([{id:'name',label:'Your name *',type:'text',auto:'name',max:100},{id:'phone',label:'Phone / WhatsApp number *',type:'tel',auto:'tel',max:20},{id:'email',label:'Email (optional)',type:'email',auto:'email',max:180}] as const).map(f=><label className={s.field} key={f.id}>{f.label}<input type={f.type} autoComplete={f.auto} maxLength={f.max} value={contact[f.id]} onChange={e=>setContact(v=>({...v,[f.id]:e.target.value}))} aria-invalid={!!errors[f.id]} aria-describedby={'contact-'+f.id}/><span id={'contact-'+f.id} className={s.error}>{errors[f.id]}</span></label>)}
 <label className={s.field+' '+s.wide}>Notes (optional)<textarea aria-invalid={!!errors.notes} aria-describedby="contact-notes" rows={4} maxLength={1200} value={contact.notes} onChange={e=>setContact(v=>({...v,notes:e.target.value}))} placeholder="Your references, access needs, a meaningful detail or a question."/><span id="contact-notes" className={s.error}>{errors.notes}</span></label>
 <label className={s.field+' '+s.wide}>Reference images (optional)<input type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={!ready||refs.some(r=>r.state==='uploading')||refs.length===3} onChange={e=>{const files=Array.from(e.target.files||[]);e.target.value='';void select(files);}}/><span className={s.help}>Up to 3 images, 3 MB each (9 MB total). Stored privately for authorized staff. Images cannot attach automatically to a WhatsApp text link.</span></label>
 </div>{refs.map(r=><div className={s.uploadItem} key={r.localId}><span>{r.file.name} · {r.state==='saved'?'Saved privately':r.state==='uploading'?'Uploading…':r.state==='failed'?r.error:'Waiting…'}</span><div>{r.state==='failed'&&<button type="button" onClick={()=>void upload(r)}>Retry</button>}<button type="button" disabled={r.state==='uploading'} onClick={()=>void remove(r)}>Remove</button></div></div>)}
 <p className={s.error}>{errors.references}</p>
 <label className={s.check}><input type="checkbox" aria-invalid={!!errors.consent} aria-describedby="contact-consent" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>I agree to saving my brief, contact details and references so RivyaLivingArt can respond. The WhatsApp link will contain my contact details and text brief. I choose whether to send it. <Link className={s.textLink} href="/privacy">Privacy details</Link></span></label><p id="contact-consent" className={s.error}>{errors.consent}</p></fieldset>}
 {step===2&&<section><p>Check your brief before it is saved. You can return to either step to make a change.</p><dl className={s.reviewList}><dt>Piece</dt><dd>{p.name} · {p.id}</dd>{visibleFields.map(f=><div key={f.id} style={{display:'contents'}}><dt>{f.label}</dt><dd>{answers[f.id]||'Not specified'}</dd></div>)}<dt>Name</dt><dd>{contact.name}</dd><dt>Phone</dt><dd>{contact.phone}</dd><dt>Email</dt><dd>{contact.email||'Not provided'}</dd><dt>Notes</dt><dd>{contact.notes||'None'}</dd><dt>Private references</dt><dd>{refs.length} saved {refs.length===1?'image':'images'}</dd></dl><p className={s.help}>Place Order saves an inquiry in our Studio before opening WhatsApp. It does not confirm a sale or collect a payment. You will still press Send in WhatsApp.</p></section>}
 <p role={Object.keys(errors).length?'alert':'status'} className={Object.keys(errors).length?s.error:s.help}>{message}</p>
 {!ready&&<button type="button" className={s.button} onClick={()=>setSessionAttempt(v=>v+1)}>Reconnect form</button>}
 <div className={s.actions}>{step>0&&<button type="button" className={s.button+' '+s.outline} disabled={busy} onClick={()=>go(step-1)}>← Back</button>}<button type="submit" className={s.button} disabled={busy||(step===2&&!ready)||refs.some(r=>r.state==='uploading')}>{busy?'Saving inquiry…':step===2?'Place Order →':step===0?'Your details →':'Review your brief →'}</button></div>
 </form></div>;
}



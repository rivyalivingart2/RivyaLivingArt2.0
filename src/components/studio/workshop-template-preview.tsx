import type {WorkshopTemplate} from '@/lib/service-template-model';
import {workshopSlots} from '@/lib/service-template-model';
import p from './workshop-template-preview.module.css';
/** Authenticated saved-preview use only; public /workshops remains retired. */
export function WorkshopTemplatePreview({design,version}:{design:WorkshopTemplate;version:number}){
 const placeholders=(items:string[])=>items.map((text,i)=><div key={text} className={p.placeholder}><span aria-hidden>{String(i+1).padStart(2,'0')}</span><p>{text}</p></div>);
 return <div className={p.template} data-presentation-revision={version} data-workshop-template="unconfirmed">
  <header className={p.hero} data-layout={design.hero} data-workshop-slot="hero"><div><p className={p.notice}>Private template · no confirmed offering</p><h1>Workshop page structure</h1><p>The old seven-part structure is ready for current approved facts. This preview does not offer bookings or collect a waitlist.</p></div><div className={p.placeholder}>Approved workshop opening image needed</div></header>
  {workshopSlots.filter(s=>s.key!=='hero'&&!design.hidden.includes(s.key)).map(slot=><section key={slot.key} data-workshop-slot={slot.key} className={p.band} data-band={slot.key}><h2>{slot.label}</h2>
   {slot.key==='facts'?<div className={p.facts}>{placeholders(['Session length','Verified location','Experience level','Confirmed inclusions'])}</div>:
    slot.key==='why'?<div className={p.three}>{placeholders(['Approved learning outcome and image','Approved hands-on activity and image','Approved take-home outcome and image'])}</div>:
    slot.key==='session'?<ol className={p.beats}>{['Arrival','Introduction','Practice','Making','Closing'].map((label,i)=><li key={label}><span aria-hidden>{String(i+1).padStart(2,'0')}</span><h3>{label} slot</h3><p>Current session details required.</p></li>)}</ol>:
    slot.key==='sessions'?<div className={p.sessions}><p>No confirmed session records are connected.</p><dl><div><dt>Date and time</dt><dd>Unconfirmed</dd></div><div><dt>Availability</dt><dd>Unconfirmed</dd></div><div><dt>Price</dt><dd>Unconfirmed</dd></div></dl></div>:
    slot.key==='private'?<div className={p.private}><div className={p.placeholder}>Approved private-session image needed</div><div><p>A current private-workshop offering must be confirmed before an inquiry action appears.</p><p>No form or message is sent from this template.</p></div></div>:
    <div className={p.room}>{placeholders(['Actual workshop space photo 1','Actual workshop space photo 2','Actual workshop space photo 3','Actual workshop space photo 4'])}</div>}
  </section>)}
 </div>;
}

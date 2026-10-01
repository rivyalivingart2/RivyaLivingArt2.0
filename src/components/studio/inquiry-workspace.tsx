'use client';
import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {usePathname,useSearchParams} from 'next/navigation';
import {businessDatePreset,formatBusinessTime} from '@/lib/business-time';
import {inquiryFilterKeys,inquiryViewHref,inquiryRequestQuery,readInquiryView,type InquiryView} from '@/lib/studio-inquiry-view';
import {studioTaskLabels} from '@/lib/studio-work-queue';
import {Dialog} from '@/components/shop/dialog';
import {OrderKanban} from '@/components/studio-orders-board';
import {orderStages,stageLabel,type OrderStage,type StudioOrder} from '@/lib/studio-orders';
import {InquiryDetail,type InquiryDetailData} from './inquiry-detail';
import {useUnsavedWork} from './use-unsaved-work';
import {studioFetch,type StaffMember} from './workspace-api';
import s from './workspace.module.css';

const labels={q:'Search',stage:'Stage',assignee:'Assignee',source:'Source',kind:'Request',product:'Product',category:'Category',from:'From IST',to:'Through IST',task:'Task',follow:'Follow-up',sort:'Sort'};
export function InquiryBoard({staff,admin,staffId,dueOnly=false}:{staff:StaffMember[];admin:boolean;staffId?:string|null;dueOnly?:boolean}){
 const params=useSearchParams(),path=usePathname(),view=readInquiryView(params,dueOnly,path==='/studio/kanban');
 const search=params.toString();
 const query=useMemo(()=>inquiryRequestQuery(readInquiryView(new URLSearchParams(search),dueOnly,path==='/studio/kanban')),[search,dueOnly,path]),requested=view.record;
 const [selected,setSelected]=useState(requested);
 const [orders,setOrders]=useState<StudioOrder[]>([]),[hasMore,setHasMore]=useState(false),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[message,setMessage]=useState('Loading inquiries…');
 const [detail,setDetail]=useState<InquiryDetailData|null>(null),[recordLoading,setRecordLoading]=useState(false),[recordError,setRecordError]=useState('');
 const [manual,setManual]=useState<Partial<StudioOrder>|null>(null),[manualOriginal,setManualOriginal]=useState(''),[manualEvents,setManualEvents]=useState<InquiryDetailData['events']>([]),[reviewManual,setReviewManual]=useState(false);
 const [moveRequest,setMoveRequest]=useState<{id:string;status:OrderStage}|null>(null),[moveReason,setMoveReason]=useState('');
 const sequence=useRef(0),recordSequence=useRef(0),inFlight=useRef(false),manualRequest=useRef<string|null>(null),acceptedHref=useRef(''),lastSelected=useRef(''),allowClose=useRef(false);
 const manualDirty=!!manual&&JSON.stringify({client:manual.client,title:manual.title})!==manualOriginal;
 useUnsavedWork(manualDirty||!!moveReason);
 const load=useCallback(()=>{const id=++sequence.current;return studioFetch('/api/studio/orders?'+query).then(data=>{if(id===sequence.current){setOrders(data.orders);setHasMore(data.hasMore);setMessage('Saved records loaded. Stage counts cover this page only.');}}).catch(e=>{if(id===sequence.current)setMessage(e.message+' Previously loaded rows are retained and may be out of date.');throw e;}).finally(()=>{if(id===sequence.current)setLoading(false);});},[query,setOrders,setHasMore,setMessage,setLoading]);
 useEffect(()=>{const active=sequence;void Promise.resolve().then(()=>{setLoading(true);return load();}).catch(()=>{});return()=>{active.current++;};},[load]);
 useEffect(()=>{const focus=()=>{if(!inFlight.current&&!selected&&!manual)void load().catch(()=>{});};window.addEventListener('focus',focus);return()=>window.removeEventListener('focus',focus);},[load,selected,manual]);
 // Hold the mounted editor until a requested URL transition is accepted. This also
 // protects drafts when router listeners process browser history before our effects.
 useEffect(()=>{void Promise.resolve().then(()=>{
  if(new URLSearchParams(window.location.search).get('record')!==(requested||null))return;
  if(requested!==selected){
   if(!allowClose.current&&(inFlight.current||manualDirty||document.querySelector('[data-unsaved="true"],[data-studio-saving="true"]'))){
    window.history.replaceState(null,'',acceptedHref.current);
    setMessage('Your unsaved edits were kept. Use Return to inquiry list to review closing this record.');return;
   }
   allowClose.current=false;setSelected(requested);
  }
  acceptedHref.current=window.location.pathname+window.location.search;
 });},[requested,selected,manualDirty,search]);
 useEffect(()=>{const previous=lastSelected.current;lastSelected.current=selected;if(!selected&&previous)requestAnimationFrame(()=>Array.from(document.querySelectorAll<HTMLElement>(`[data-inquiry-record="${CSS.escape(previous)}"]`)).find(el=>el.getClientRects().length)?.focus({preventScroll:true}));},[selected]);
 function navigate(patch:Partial<InquiryView>,replace=false){const href=inquiryViewHref(path,view,patch);acceptedHref.current=href;if(replace)window.history.replaceState(null,'',href);else window.history.pushState(null,'',href);}
 function filter(patch:Partial<InquiryView>){navigate({...patch,page:1,record:''});}
 function openRecord(id:string){navigate({record:id});}
 const closeRecord=()=>{
  if(busy||document.querySelector('[data-studio-saving="true"]'))return;
  if(document.querySelector('[data-unsaved="true"]')&&!window.confirm('Close this record and discard unsaved edits?'))return;
  allowClose.current=true;navigate({record:''},true);
  requestAnimationFrame(()=>Array.from(document.querySelectorAll<HTMLElement>(`[data-inquiry-record="${CSS.escape(selected)}"]`)).find(el=>el.getClientRects().length)?.focus({preventScroll:true}));
 };
 const readRecord=useCallback(async(id:string)=>{
  const ticket=++recordSequence.current;
  try{const data=await studioFetch('/api/studio/workspace?view=inquiry&id='+encodeURIComponent(id));if(ticket!==recordSequence.current)return;
   if(data.manual){setManual(data.manual);setManualOriginal(JSON.stringify({client:data.manual.client,title:data.manual.title}));setManualEvents(data.events);setReviewManual(false);setDetail(null);}else{setDetail(data);setManual(null);}
  }catch(e){if(ticket===recordSequence.current)setRecordError(e instanceof Error?e.message:'This record is unavailable. Return to the list.');}
  finally{if(ticket===recordSequence.current)setRecordLoading(false);}
 },[setManual,setManualOriginal,setManualEvents,setReviewManual,setDetail,setRecordError,setRecordLoading]);
 useEffect(()=>{const active=recordSequence;void Promise.resolve().then(()=>{setDetail(null);setManual(null);setRecordError('');setRecordLoading(!!selected);if(selected)return readRecord(selected);});return()=>{active.current++;};},[selected,readRecord]);
 async function move(id:string,status:OrderStage,confirmedReason?:string){
  const order=orders.find(o=>o.id===id);if(!order||order.status===status||inFlight.current)return;
  const needsReason=status==='CLOSED'||orderStages.indexOf(status)<orderStages.indexOf(order.status);
  if(needsReason&&confirmedReason===undefined){setMoveRequest({id,status});setMoveReason('');return;}
  const reason=confirmedReason||'';if(needsReason&&!reason.trim())return;
  inFlight.current=true;setBusy(true);setMessage('Saving stage change… The previous stage remains until the server confirms it.');let committed=false;
  try{const result=await studioFetch('/api/studio/orders',{action:'move',id,status,version:order.version,reason});committed=true;if(result.order)setOrders(rows=>rows.map(row=>row.id===id?{...row,...result.order}:row));setMoveRequest(null);setMoveReason('');await load();setMessage('Stage saved to history.');}
  catch(e){setMessage(committed?'Stage saved, but refreshing failed. Reload before another change.':e instanceof Error&&'status' in e&&e.status===409?'This inquiry changed in another session. Refresh and review its latest stage before moving it.':e instanceof Error?e.message:'The stage could not be saved. The previous stage is retained.');}
  finally{inFlight.current=false;setBusy(false);}
 }
 async function saveManual(){
  if(!manual||inFlight.current)return;inFlight.current=true;setBusy(true);let committed=false;
  if(!manual.id&&!manualRequest.current)manualRequest.current=crypto.randomUUID();
  try{const saved=await studioFetch('/api/studio/orders',{action:manual.id?'edit':'create',requestId:manualRequest.current||undefined,id:manual.id,version:manual.version,client:manual.client,title:manual.title});committed=true;setManual(saved.order);setManualOriginal(JSON.stringify({client:saved.order.client,title:saved.order.title}));await load();setMessage('Staff-entered order saved. No message was sent.');if(selected)navigate({record:''},true);else setManual(null);}
  catch(e){setMessage(committed?'The order was saved, but refreshing failed. Reload the saved record before another change.':e instanceof Error?e.message:'Save failed. Your entered details remain here.');}
  finally{inFlight.current=false;setBusy(false);}
 }
 const closeManual=()=>{if(busy)return;if(selected)closeRecord();else if(!manualDirty||window.confirm('Discard unsaved staff-entered order edits?'))setManual(null);};
 const activeFilters=inquiryFilterKeys.filter(key=>view[key]&&!(key==='sort'&&view[key]==='newest'));
 const clear=()=>navigate({...Object.fromEntries(inquiryFilterKeys.map(k=>[k,''])),sort:'newest',follow:dueOnly?'all':'',page:1,record:''});
 const stageMenu=(order:StudioOrder)=><label>Move to<select aria-label={'Move '+(order.reference||order.id)+' to stage'} disabled={busy||loading} value={order.status} onChange={e=>void move(order.id,e.target.value as OrderStage)}>{orderStages.map(stage=><option key={stage} value={stage}>{stageLabel(stage)}</option>)}</select></label>;
 return <>
  <div className={s.heading}><div><h1>{dueOnly?'Follow-ups':'Inquiries'}</h1><p>Saved customer briefs and staff-entered orders. Follow-up dates use IST.</p></div><button disabled={busy||loading} onClick={()=>{setLoading(true);void load().catch(()=>{});}}>Refresh inquiries</button></div>
  <div className={s.actions} aria-label="Saved inquiry views"><button onClick={clear} disabled={busy}>All work</button>{staffId&&<button disabled={busy} onClick={()=>filter({assignee:staffId,task:'',follow:''})}>Assigned to me</button>}{admin&&<button disabled={busy} onClick={()=>filter({task:'unassigned',assignee:'',follow:''})}>Unassigned</button>}{(['overdue','today','upcoming'] as const).map(follow=><button key={follow} disabled={busy} aria-pressed={view.follow===follow} onClick={()=>filter({follow,task:'',sort:'followup'})}>{follow==='today'?'Today':follow==='overdue'?'Overdue':'Upcoming'}</button>)}</div>
  <form key={query} className={s.panel} onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);filter(Object.fromEntries(['q','stage','assignee','source','kind','product','category','from','to','sort'].map(k=>[k,String(data.get(k)||'')])));}}>
   <fieldset disabled={busy||loading} className={s.inquiryFilters}><legend>Filter saved inquiries</legend>
    <label>Find an inquiry<input type="search" name="q" defaultValue={view.q} maxLength={150} placeholder="Reference, customer or brief"/></label>
    <label>Stage<select name="stage" defaultValue={view.stage}><option value="">All stages</option>{orderStages.map(stage=><option key={stage} value={stage}>{stageLabel(stage)}</option>)}</select></label>
    <label>Assignee<select name="assignee" defaultValue={view.assignee}><option value="">All permitted staff</option>{admin&&<option value="unassigned">Unassigned</option>}{staff.map(person=><option key={person.id} value={person.id}>{person.name}{person.active?'':' (disabled)'}</option>)}</select></label>
    <label>Source<select name="source" defaultValue={view.source}><option value="">All permitted records</option><option value="website">Website inquiry</option>{admin&&<option value="manual">Staff-entered order</option>}</select></label>
    <label>Request kind<select name="kind" defaultValue={view.kind}><option value="">All kinds</option><option value="product">Product brief</option><option value="bespoke">Custom brief</option></select></label>
    <label>Product ID<input name="product" defaultValue={view.product} maxLength={100}/></label><label>Saved category<input name="category" defaultValue={view.category} maxLength={80}/></label>
    <label>Received from (IST)<input type="date" name="from" defaultValue={view.from}/></label><label>Received through (IST)<input type="date" name="to" defaultValue={view.to}/></label>
    <label>Sort<select name="sort" defaultValue={view.sort}><option value="newest">Newest received</option><option value="oldest">Oldest received</option><option value="followup">Earliest follow-up</option></select></label><button type="submit">Apply filters</button>
   </fieldset>
   <div className={s.actions} aria-label="Received date presets">{([1,7,30] as const).map(days=><button type="button" disabled={busy} key={days} onClick={()=>filter(businessDatePreset(days))}>{days===1?'Received today':'Last '+days+' days'}</button>)}</div>
  </form>
  <div className={s.actions} aria-label="Applied inquiry filters">{activeFilters.map(key=><button disabled={busy} key={key} onClick={()=>filter({[key]:key==='sort'?'newest':key==='follow'&&dueOnly?'all':''})}>Remove {labels[key]}: {key==='assignee'?(staff.find(p=>p.id===view[key])?.name||view[key]):key==='task'?(studioTaskLabels[view.task as keyof typeof studioTaskLabels]||view.task):view[key]} ×</button>)}{!!activeFilters.length&&<button disabled={busy} onClick={clear}>Clear filters</button>}</div>
  <div className={s.actions} aria-label="Inquiry view"><button disabled={busy} aria-pressed={view.mode==='list'} onClick={()=>navigate({mode:'list'})}>List view</button><button disabled={busy} aria-pressed={view.mode==='board'} onClick={()=>navigate({mode:'board'})}>Board view</button>{admin&&<button disabled={busy} onClick={()=>{manualRequest.current=null;setManual({client:'',title:''});setManualOriginal(JSON.stringify({client:'',title:''}));setManualEvents([]);setReviewManual(false);}}>Add staff-entered order</button>}</div>
  <p className={s.status} role="status">{message}</p><p>Page {view.page} · {orders.length} records · Up to 50 records per page.</p>
  {view.mode==='list'?<>
   <div className={`${s.tableWrap} ${s.inquiryDesktop}`} role="region" aria-label="Inquiry list" tabIndex={0}><table><caption>Saved inquiries in the current view</caption><thead><tr>{['Record','Request','Stage','Assignee','Follow-up (IST)','Action'].map(label=><th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{orders.map(order=><tr key={order.id}><td><button disabled={busy} data-inquiry-record={order.id} onClick={()=>openRecord(order.id)}>{order.reference||'Staff-entered '+order.id.slice(0,8)} · {order.title}</button><small>{order.createdAt?formatBusinessTime(order.createdAt):'Received date unavailable'}</small></td><td>{order.source==='manual'?'Staff entered':order.requestKind==='bespoke'?'Custom brief':'Product brief'}</td><td>{stageLabel(order.status)}</td><td>{order.assigneeName||'Unassigned'}</td><td>{order.followUp?.slice(0,10)||'Not set'}</td><td>{stageMenu(order)}</td></tr>)}</tbody></table></div>
   <div className={s.inquiryMobile}>{orders.map(order=><article key={order.id} className={s.panel}><p><strong>{order.reference||'Staff-entered order'}</strong> · {stageLabel(order.status)}</p><button disabled={busy} data-inquiry-record={order.id} onClick={()=>openRecord(order.id)}>{order.title} · Open record</button><p>{order.assigneeName||'Unassigned'} · {order.followUp?'Follow-up '+order.followUp.slice(0,10)+' IST':'No follow-up date'}</p><p>{order.createdAt?formatBusinessTime(order.createdAt):''}</p>{stageMenu(order)}</article>)}</div>
  </>:<><label className={s.mobileBoardPicker}>Visible board stage<select value={view.column} onChange={e=>navigate({column:e.target.value})}>{orderStages.map(stage=><option key={stage} value={stage}>{stageLabel(stage)} ({orders.filter(o=>o.status===stage).length})</option>)}</select></label><OrderKanban orders={orders} busy={busy||loading} mobileStage={view.column} onMove={(id,status)=>void move(id,status)} onOpen={openRecord}/></>}
  {!loading&&!orders.length&&<p className={s.empty}>{activeFilters.length?'No inquiries match these filters. Clear filters or choose another saved view.':'No inquiries are available in your scope yet.'}</p>}
  <div className={s.actions}><button disabled={busy||loading||view.page===1} onClick={()=>navigate({page:view.page-1})}>Previous page</button><button disabled={busy||loading||!hasMore} onClick={()=>navigate({page:view.page+1})}>Next page</button></div>
  <Dialog open={!!selected&&!manual} title={detail?detail.inquiry.reference+' · '+detail.inquiry.name:'Inquiry record'} closeLabel="Return to inquiry list" onClose={closeRecord}>{recordLoading?<p role="status">Opening the saved record…</p>:recordError?<div role="alert"><p>{recordError}</p><button onClick={()=>{setRecordError('');setRecordLoading(true);void readRecord(selected);}}>Retry record</button></div>:detail&&<InquiryDetail key={detail.inquiry.id} initial={detail} staff={staff} admin={admin} onSaved={load}/>}</Dialog>
  <Dialog open={!!moveRequest} title="Explain this stage change" onClose={()=>{if(!busy&&(!moveReason||window.confirm('Discard the unsaved stage reason?'))){setMoveRequest(null);setMoveReason('');}}}><form data-unsaved={!!moveReason} data-studio-saving={busy} onSubmit={e=>{e.preventDefault();if(moveRequest)void move(moveRequest.id,moveRequest.status,moveReason);}}><p>{moveRequest?'Move to '+stageLabel(moveRequest.status)+'. The existing stage remains until saving succeeds.':''}</p><label>Reason<textarea required maxLength={500} value={moveReason} disabled={busy} onChange={e=>setMoveReason(e.target.value)}/></label><p role="status">{message}</p><button disabled={busy||!moveReason.trim()}>Save stage change</button></form></Dialog>
  <Dialog open={!!manual} title={manual?.id?'Staff-entered order':'Add a staff-entered order'} closeLabel="Return to inquiry list" onClose={closeManual}>{manual&&<form data-unsaved={manualDirty} data-studio-saving={busy} onSubmit={e=>{e.preventDefault();if(reviewManual)void saveManual();else setReviewManual(true);}}><p>This existing staff-entry workflow records a customer name and brief. It does not create a website submission, infer consent, attach a product or prepare a customer message.</p><fieldset disabled={busy}>{reviewManual?<dl><dt>Customer-supplied name</dt><dd>{manual.client}</dd><dt>Brief</dt><dd>{manual.title}</dd></dl>:<><label>Customer-supplied name<input required maxLength={120} value={manual.client||''} onChange={e=>setManual({...manual,client:e.target.value})}/></label><label>Brief<textarea required maxLength={240} value={manual.title||''} onChange={e=>setManual({...manual,title:e.target.value})}/></label></>}<div className={s.actions}>{reviewManual&&<button type="button" onClick={()=>setReviewManual(false)}>Back to editing</button>}<button>{reviewManual?'Save staff-entered order':'Review details'}</button>{manual.id&&<button type="button" onClick={()=>{if(!manualDirty||window.confirm('Discard typed edits and reload this saved record?'))void readRecord(manual.id!);}}>Reload saved record</button>}</div></fieldset><p role="status">{message}</p>{manualEvents.map((event,index)=><p key={index}>{formatBusinessTime(event.createdAt)} · {event.actor}: {event.from_status||'Created'} → {event.to_status}</p>)}</form>}</Dialog>
 </>;
}

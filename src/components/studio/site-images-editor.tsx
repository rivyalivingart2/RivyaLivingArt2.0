'use client';
import {useLinkedRecord,LinkedRecordNotice} from './linked-record';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import Image from 'next/image';
import type {ContentDocument} from '@/lib/content-model';
import type {PublicMedia} from '@/lib/public-media';
import {editorialSlots,assignEditorialSlot,editorialUsages} from '@/lib/editorial-slots';
import {editorialDocument} from '@/lib/page-dependencies';
import {previewHref} from '@/lib/content-preview';
import {publicationState} from '@/lib/content-health';
import {studioFetch} from './workspace-api';
import {CropFields} from './editorial-crop-fields';
import {ContentCompare} from './content-compare';
import {DraftRecovery} from './draft-recovery';
import {useRecordSwitch,RecordSwitchNotice} from './record-switch';
import s from './workspace.module.css';

type Entry={document:ContentDocument;version:number;publishedVersion?:number;published:ContentDocument|null;visible:boolean};
type MediaEntry={media:PublicMedia;published:PublicMedia|null};
export function SiteImagesEditor({admin}:{admin:boolean}){
 const [entries,setEntries]=useState<Entry[]>([]),[entry,setEntry]=useState<Entry|null>(null),[media,setMedia]=useState<PublicMedia[]>([]);
 const [slotKey,setSlotKey]=useState(''),[pageQuery,setPageQuery]=useState(''),[assetQuery,setAssetQuery]=useState('');
 const [busy,setBusy]=useState(false),[dirty,setDirty]=useState(false),[loading,setLoading]=useState(true),[loadError,setLoadError]=useState(false),[attempt,setAttempt]=useState(0);
 const [message,setMessage]=useState('Loading page placements…');
 const switching=useRecordSwitch(dirty);
 const linked=useLinkedRecord({editor:'site-images',records:entries,loaded:!loading,selectedId:entry?.document.id,idOf:e=>e.document.id,busy,onSelect:(next,target)=>{
  const applySlot=()=>{const available=editorialSlots(next.document);setSlotKey(available.find(s=>s.key===target.slot)?.key||available[0].key);setMessage(target.slot&&!available.some(s=>s.key===target.slot)?'The linked placement is unavailable. Choose a current placement.':'Opened the linked page and placement.');};
  if(next.document.id===entry?.document.id){applySlot();return true;}
  return switching.request(()=>{setEntry(structuredClone(next));setDirty(false);applySlot();});
 }});
 useEffect(()=>{
  let active=true;
  void Promise.all([studioFetch('/api/studio/content'),studioFetch('/api/studio/media'),studioFetch('/api/studio/editorial-assets')]).then(([content,assets,editorial])=>{
   if(!active)return;
   const rows:Entry[]=content.entries.filter((e:Entry)=>editorialSlots(e.document).length);
   setEntries(rows);setMedia([...assets.media,...editorial.media].flatMap((e:MediaEntry)=>e.published?[e.published]:[]));
   const requested=new URLSearchParams(window.location.search).get('record');const initial=requested?rows.find(e=>e.document.id===requested):rows.find(e=>e.document.id==='page:home')||rows[0];
   if(initial){setEntry(structuredClone(initial));setSlotKey(editorialSlots(initial.document).find(s=>s.editable)?.key||editorialSlots(initial.document)[0].key);}
   setLoading(false);setLoadError(false);setMessage('Choose a page and placement. Saving changes only that page’s draft.');
  }).catch(e=>{if(active){setLoading(false);setLoadError(true);setMessage(e.message);}});
  return()=>{active=false;};
 },[attempt]);
 useEffect(()=>{const warn=(event:BeforeUnloadEvent)=>{if(dirty){event.preventDefault();event.returnValue='';}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
 const slots=entry?editorialSlots(entry.document):[],slot=slots.find(s=>s.key===slotKey);
 const asset=media.find(m=>m.path===slot?.path);
 const publishedSlot=entry?.published?editorialSlots(entry.published).find(s=>s.key===slotKey):undefined;
 const usages=slot?.path?editorialUsages(entries,slot.path):[];
 const pages=entries.filter(e=>(e.document.title+' '+e.document.route).toLowerCase().includes(pageQuery.toLowerCase()));
 const choices=media.filter(m=>(m.alt+' '+m.caption+' '+m.path).toLowerCase().includes(assetQuery.toLowerCase()));
 function choose(next:Entry){if(next.document.id===entry?.document.id)return;switching.request(()=>{setEntry(structuredClone(next));setSlotKey(editorialSlots(next.document).find(s=>s.editable)?.key||editorialSlots(next.document)[0].key);setDirty(false);setAssetQuery('');setMessage('Editing image placements for '+next.document.title);});}
 function assign(usage:Parameters<typeof assignEditorialSlot>[2]){if(!entry||!slot)return;try{const document=assignEditorialSlot(entry.document,slot.key,usage);setEntry({...entry,document});if(!editorialSlots(document).some(s=>s.key===slot.key))setSlotKey(editorialSlots(document)[0]?.key||'');setDirty(true);}catch(e){setMessage(e instanceof Error?e.message:'This placement could not be changed.');}}
 async function save(){
  if(!entry||busy)return;setBusy(true);setMessage('Saving the page draft…');
  try{const result=await studioFetch('/api/studio/content',{document:editorialDocument(entry.document),version:entry.version,operation:'draft'});const next={...entry,document:result.document,version:result.version,publishedVersion:result.publishedVersion};setEntry(next);setEntries(rows=>rows.map(e=>e.document.id===next.document.id?next:e));setDirty(false);setMessage('Image placements saved as draft revision '+result.version+'. The public page is unchanged.');}
  catch(e){setMessage(e instanceof Error?e.message:'Save failed. Your edits remain here.');}finally{setBusy(false);}
 }
 return <><div className={s.heading}><div><h1>Images, in their place.</h1><p>Choose the page, then its image placement. Each editorial crop belongs to that placement.</p></div></div>
  <p className={s.status} role="status">{message}</p><LinkedRecordNotice {...linked}/><RecordSwitchNotice control={switching}/>
  {loadError&&<button disabled={loading} onClick={()=>{setLoading(true);setLoadError(false);setMessage('Loading page placements…');setAttempt(n=>n+1);}}>Retry loading placements</button>}
  {!loading&&!loadError&&<><label>Find a page<input type="search" value={pageQuery} onChange={e=>setPageQuery(e.target.value)} placeholder="Page title or address…"/></label><div className={s.layout}>
   <div className={s.list} role="group" aria-label="Pages with image placements">{pages.map(e=><button disabled={busy} type="button" key={e.document.id} aria-pressed={entry?.document.id===e.document.id} onClick={()=>choose(e)}>{e.document.title}<small>{e.document.route} · {editorialSlots(e.document).length} placements · {publicationState(e.published,e.visible)}</small></button>)}{!pages.length&&<p className={s.empty}>No pages match. Change the search to see more placements.</p>}</div>
   {entry&&slot&&<section className={s.editor} data-unsaved={dirty}><fieldset disabled={busy}><h2>{entry.document.title}</h2><p>Draft {entry.version} · Public {entry.publishedVersion||'not published'}{dirty?' · Unsaved image edits':''}</p>
    <label>Section / image placement<select id="site-images-field-placement" value={slotKey} onChange={e=>{setSlotKey(e.target.value);setAssetQuery('');}}>{slots.map(s=><option key={s.key} value={s.key}>{s.label}{s.editable?'':' · existing reference'}</option>)}</select></label>
    <p className={s.help}>{slot.usage?'Editorial override · ':slot.productId||slot.path?'Using the existing page/product image · ':'Text-only section · '}{slot.productId&&'Protected product reference: '+slot.productId+'. '}Saved public assignment: {publishedSlot?.path||publishedSlot?.productId||'No image'}. Draft assignment: {slot.path||slot.productId||'No image'}.</p>
    {slot.editable?<><label>Find an approved image<input type="search" value={assetQuery} onChange={e=>setAssetQuery(e.target.value)} placeholder="Description or file…"/></label><label>Approved image for this placement<select value={slot.usage?.path||''} onChange={e=>{const m=media.find(m=>m.path===e.target.value);assign(m?{path:m.path,alt:m.alt,caption:m.caption,desktop:slot.usage?.desktop||{x:m.focalX,y:m.focalY,ratio:'3/2'},mobile:slot.usage?.mobile||{x:m.focalX,y:m.focalY,ratio:'4/5'}}:undefined);}}><option value="">{slot.key==='header'||slot.productId?'Use existing page/product image':'No image · text only'}</option>{slot.usage&&!choices.some(m=>m.path===slot.path)&&<option value={slot.path}>{asset?.alt||slot.path} · current assignment</option>}{choices.map(m=><option key={m.path} value={m.path}>{m.alt}</option>)}</select></label><p><Link href="/studio/media">Review or add editorial images ↗</Link></p><p>{choices.length} matching published assets. Customer reference uploads are never listed here.</p>{slot.usage?<CropFields usage={slot.usage} onChange={assign} hero={slot.key==='hero'}/>:<p className={s.empty}>No independent image is assigned. The existing image, if any, and text remain available.</p>}</>:<><p>{slot.reason}</p>{slot.path&&<div className={s.mediaPreview}><Image src={slot.path} alt={asset?.alt||'Current page image'} fill sizes="600px"/></div>}{slot.productId&&<p>Existing product reference: {slot.productId}. Product gallery associations remain unchanged.</p>}</>}
    {asset&&<details className={s.panel}><summary>Source and affected places</summary><p>{asset.provenance}</p><p>{usages.length} saved editorial usages across draft and public records. {asset.products.length} protected product associations.</p>{usages.map(u=><p key={u.record+u.slot+u.state}><a href={'/studio/content?record='+encodeURIComponent(u.record)}>{u.title}</a> · {u.label} · {u.state}</p>)}<p>Originals and derivatives are immutable. Upload a new asset to replace a page placement. These are saved usages. Unsaved changes in other browsers are not included. Changing this placement does not replace the original or another usage.</p></details>}
    <div className={s.actions}><button type="button" className={s.primary} disabled={!dirty||busy} onClick={()=>void save()}>Save image placements as draft</button>{entry.version>0&&!dirty&&<a href={previewHref(entry.document.id,entry.version)} target="_blank" rel="noreferrer">Preview saved page ↗</a>}{!dirty&&<a href={'/studio/content?record='+encodeURIComponent(entry.document.id)}>{admin?'Open page to review and publish':'Open page editor'} ↗</a>}</div>
    <p className={s.help}>Publication and revision recovery use this page’s normal content editor. Save image edits before opening it.</p>
    {entry.published&&<details className={s.panel}><summary>Compare public and draft placements</summary><ContentCompare before={entry.published} after={entry.document}/></details>}
    <DraftRecovery value={entry.document} busy={busy} onReload={async()=>{setBusy(true);try{const data=await studioFetch('/api/studio/content');const next=data.entries.find((e:Entry)=>e.document.id===entry.document.id);if(!next)throw Error('Saved page unavailable. Your local draft is retained.');setEntries(data.entries.filter((e:Entry)=>editorialSlots(e.document).length));setEntry(structuredClone(next));setSlotKey(editorialSlots(next.document).find(s=>s.key===slotKey)?.key||editorialSlots(next.document)[0].key);setDirty(false);setMessage('Latest saved page draft loaded.');}finally{setBusy(false);}}}/>
   </fieldset></section>}
  </div></>}
 </>;
}

'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import type {ContentDocument} from '@/lib/content-model';
import type {ExtensionEntry,FileUsage} from '@/lib/editorial-extension-model';
import {studioFetch} from './workspace-api';
import s from './workspace.module.css';
export function EditorialFileFields({document:d,onChange}:{document:ContentDocument;onChange:(value:Partial<ContentDocument>)=>void}){
 const [rows,setRows]=useState<ExtensionEntry[]>([]),[error,setError]=useState('');
 useEffect(()=>{let active=true;void studioFetch('/api/studio/editorial-extensions').then(data=>{if(active)setRows(data.entries.filter((r:ExtensionEntry)=>r.published&&r.document.kind!=='category'));}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[]);
 if(d.homepage||d.editorial?.kind==='testimonial'&&d.editorial.classification!=='genuine')return null;
 const values=d.mediaFiles||[];
 return <fieldset data-studio-part="panel" className={s.panel}><legend>Approved films and 3D files</legend>{error&&<p role="alert">{error}</p>}{values.map((v,i)=><p key={v.key}>{rows.find(r=>r.document.key===v.key)?.document.kind==='category'?v.key:(rows.find(r=>r.document.key===v.key)?.document as {title?:string})?.title||'Unavailable saved media'} <button type="button" onClick={()=>onChange({mediaFiles:values.filter((_,n)=>n!==i)})}>Remove media {i+1}</button></p>)}<label>Add published media<select value="" disabled={values.length>=6} onChange={e=>{const row=rows.find(r=>r.document.key===e.target.value);if(row&&!values.some(v=>v.key===row.document.key))onChange({mediaFiles:[...values,{kind:row.document.kind,key:row.document.key} as FileUsage]});}}><option value="">Choose approved media</option>{rows.map(r=><option key={r.document.key} value={r.document.key}>{r.document.kind==='category'?r.document.key:r.document.title}</option>)}</select></label><Link href="/studio/media">Prepare media and posters</Link></fieldset>;
}

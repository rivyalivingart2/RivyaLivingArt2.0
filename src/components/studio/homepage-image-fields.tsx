'use client';
import {useState} from 'react';
import type {EditorialUsage} from '@/lib/homepage-model';
import {CropFields} from './editorial-crop-fields';
import s from './workspace.module.css';

export type HomepageImageChoice={path:string;alt:string;caption:string};
export function HomepageImageFields({label,usage,media,loaded,emptyLabel,onChange,hero=false}:{label:string;usage?:EditorialUsage;media:HomepageImageChoice[];loaded:boolean;emptyLabel:string;onChange:(usage?:EditorialUsage)=>void;hero?:boolean}){
 const [query,setQuery]=useState('');
 const choices=media.filter(m=>(m.alt+' '+m.path).toLowerCase().includes(query.trim().toLowerCase()));
 function choose(path:string){
  if(path===usage?.path)return;
  const asset=media.find(m=>m.path===path);
  onChange(asset?{...asset,desktop:usage?.desktop||{x:50,y:50,ratio:'3/2'},mobile:usage?.mobile||{x:50,y:50,ratio:'4/5'}}:undefined);
 }
 return <fieldset className={s.panel}>
  <legend>{label}</legend>
  <p className={s.help}>Choose the image for this part of the page. Its description and crops are saved with your homepage draft.</p>
  <label>Find a published image<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Description or file…"/></label>
  <label>Published image<select disabled={!loaded} value={usage?.path||''} onChange={e=>choose(e.target.value)}>
   <option value="">{emptyLabel}</option>
   {usage&&!choices.some(m=>m.path===usage.path)&&<option value={usage.path}>{usage.alt||usage.path} · current assignment</option>}
   {choices.map(m=><option key={m.path} value={m.path}>{m.alt||m.path}</option>)}
  </select></label>
  <p className={s.help} role="status">{loaded?`${choices.length} matching published images.`:'Published choices are not available yet. Your current assignment is retained.'}</p>
  {query&&!choices.length&&<button type="button" onClick={()=>setQuery('')}>Clear image search</button>}
  {usage&&<details><summary>Review description and crops</summary><CropFields usage={usage} onChange={onChange} hero={hero}/></details>}
 </fieldset>;
}

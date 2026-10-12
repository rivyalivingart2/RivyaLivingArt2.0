'use client';
import {useEffect,useState} from 'react';
import type {HomeEditorialSelection} from '@/lib/home-editorial-model';
import {studioFetch} from './workspace-api';
import s from './workspace.module.css';
type Choice={id:string;name:string;kind:string};
export function HomeEditorialPicker({value,onChange}:{value?:HomeEditorialSelection;onChange:(value:HomeEditorialSelection)=>void}){
 const [choices,setChoices]=useState<Choice[]|null>(null),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 useEffect(()=>{
  let active=true;
  void studioFetch('/api/studio/homepage-options').then(data=>{if(active){setChoices(data.entries);setError('');}}).catch(e=>{if(active)setError(e.message);});
  return()=>{active=false;};
 },[attempt]);
 return <section className={s.panel}>
  <h2>Homepage editorial selections</h2>
  <p>Choose up to three published entries in each section, in display order. These sections appear in the old-site section sequence. Concepts and fictional samples keep their labels. Save the design to capture these exact records, then preview and publish separately.</p>
  {!choices&&!error&&<p role="status">Loading published editorial choices…</p>}
  {error&&<p role="alert">{error} <button type="button" onClick={()=>setAttempt(n=>n+1)}>Retry editorial choices</button></p>}
  {(['portfolio','testimonials'] as const).map(area=>{
   const available=(choices||[]).filter(c=>c.kind===(area==='portfolio'?'portfolio':'testimonial'));
   return <fieldset key={area}><legend>{area==='portfolio'?'Portfolio':'Testimonials'}</legend>
    {[0,1,2].map(index=>{
     const selected=value?.[area][index]||'';
     return <label key={index}>{area==='portfolio'?'Portfolio':'Testimonial'} position {index+1}
      <select disabled={!choices} value={selected} onChange={e=>{
       const selection=value||{portfolio:[],testimonials:[]},ids=[...selection[area]];
       ids[index]=e.target.value;onChange({...selection,[area]:ids.filter(Boolean)});
      }}>
       <option value="">Not selected</option>
       {selected&&!available.some(c=>c.id===selected)&&<option value={selected}>{choices?'Selected entry is unavailable':'Saved selection'}</option>}
       {available.map(c=><option key={c.id} value={c.id} disabled={value?.[area].includes(c.id)&&selected!==c.id}>{c.name}</option>)}
      </select>
     </label>;
    })}
   </fieldset>;
  })}
 </section>;
}

'use client';
import {useState} from 'react';
import Image from 'next/image';
import type {EditorialUsage,ImageCrop} from '@/lib/homepage-model';
import s from './workspace.module.css';

export function CropFields({usage,onChange,hero=false}:{usage:EditorialUsage;onChange:(v:EditorialUsage)=>void;hero?:boolean}){
 const [devicePreview,setDevicePreview]=useState<'desktop'|'mobile'>('desktop');
 return <>
  <label>Contextual image description<input value={usage.alt} maxLength={180} onChange={e=>onChange({...usage,alt:e.target.value})}/></label>
  <label>Caption<input value={usage.caption} maxLength={180} onChange={e=>onChange({...usage,caption:e.target.value})}/></label>
  {hero&&<p className={s.help}>The opening image fills the hero. These frames approximate desktop and phone proportions; open the saved preview to check the actual height with your text. Focal points apply to each size.</p>}
  <div className={s.cropTabs} role="group" aria-label="Crop preview size">{(['desktop','mobile'] as const).map(device=><button key={device} type="button" aria-pressed={devicePreview===device} onClick={()=>setDevicePreview(device)}>{device==='desktop'?'Desktop preview':'Mobile preview'}</button>)}</div>
  <div className={s.grid}>{(['desktop','mobile'] as const).map(device=>{
   const crop=usage[device];
   return <fieldset className={s.panel+' '+s.cropDevice} data-active={devicePreview===device} key={device}>
    <legend>{device==='desktop'?'Desktop crop':'Mobile crop'}</legend>
    <div className={s.cropPreview} style={{aspectRatio:hero?(device==='desktop'?'16/10':'9/16'):crop.ratio}}><Image src={usage.path} alt={usage.alt} fill sizes="(max-width: 780px) 80vw, 400px" style={{objectFit:'cover',objectPosition:`${crop.x}% ${crop.y}%`}}/></div>
    {(['x','y'] as const).map(axis=><label key={axis}>{axis==='x'?'Horizontal':'Vertical'} focus: {crop[axis]}%<input type="range" min={0} max={100} step={1} value={crop[axis]} onChange={e=>onChange({...usage,[device]:{...crop,[axis]:Number(e.target.value)}})}/></label>)}
    {!hero&&<label>Frame shape<select value={crop.ratio} onChange={e=>onChange({...usage,[device]:{...crop,ratio:e.target.value as ImageCrop['ratio']}})}><option value="4/5">Portrait 4:5</option><option value="3/2">Landscape 3:2</option><option value="1/1">Square</option><option value="16/9">Wide 16:9</option><option value="21/9">Panoramic 21:9</option></select></label>}
   </fieldset>;
  })}</div>
 </>;
}

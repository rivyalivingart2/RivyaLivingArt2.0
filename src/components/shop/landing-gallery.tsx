'use client';
import {useState} from 'react';
import type {EditorialUsage} from '@/lib/homepage-model';
import {EditorialImage} from './editorial-image';
import {Dialog} from './dialog';
import Image from './public-image';
import s from './migration-public.module.css';
export function LandingGallery({images,layout}:{images:EditorialUsage[];layout:'masonryGallery'|'bentoGallery'|'fullscreenGallery'}){
 const [active,setActive]=useState<number|null>(null),current=active===null?null:images[active];
 const move=(offset:number)=>setActive(n=>n===null?null:(n+offset+images.length)%images.length);
 return <><div className={s.gallery} data-layout={layout}>{images.map((image,i)=><div key={image.path+'-'+i}><EditorialImage usage={image}/>{layout==='fullscreenGallery'&&<button type="button" onClick={()=>setActive(i)}>Enlarge image {i+1}<span className={s.srOnly}>: {image.alt}</span></button>}</div>)}</div><Dialog open={current!==null} title={current?.alt||'Gallery'} onClose={()=>setActive(null)}>{current&&<div onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}if(e.key==='Home'){e.preventDefault();setActive(0);}if(e.key==='End'){e.preventDefault();setActive(images.length-1);}}}><div className={s.enlarged}><Image src={current.path} alt={current.alt} fill sizes="90vw" style={{objectFit:'contain'}}/></div><p>{current.caption}</p><div className={s.controls}><button onClick={()=>move(-1)} type="button">Previous image</button><span role="status">{(active||0)+1} / {images.length}</span><button onClick={()=>move(1)} type="button">Next image</button></div></div>}</Dialog></>;
}

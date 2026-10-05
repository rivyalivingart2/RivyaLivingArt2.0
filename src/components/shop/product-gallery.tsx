'use client';
import {useRef,useState,type KeyboardEvent} from 'react';
import Image from './public-image';
import {Dialog} from './dialog';
import type {ShopProduct} from '@/lib/shop-model';
import {imageSizes} from './image-sizes';
import s from './shop.module.css';
export function Gallery({product:p}:{product:Pick<ShopProduct,'image'|'imageAlt'|'imagePosition'|'imageCaption'|'scene'|'sceneAlt'|'scenePosition'|'sceneCaption'|'name'|'gallery'>}){
 const sources=Array.from(new Map([{src:p.image,alt:p.imageAlt||p.name+' design visualization',position:p.imagePosition,caption:p.imageCaption},...(p.gallery||[]),...(p.scene?[{src:p.scene,alt:p.sceneAlt||p.name+' in a room — design visualization',position:p.scenePosition,caption:p.sceneCaption}]:[])].filter(a=>a.src).map(a=>[a.src,a])).values());
 const [index,setIndex]=useState(0),[zoom,setZoom]=useState(false);
 const start=useRef<{x:number;y:number}|null>(null);const active=Math.min(index,Math.max(0,sources.length-1));const current=sources[active];
 const move=(n:number)=>{if(sources.length>1)setIndex((active+n+sources.length)%sources.length);};
 const keyboard=(e:KeyboardEvent<HTMLElement>)=>{if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}else if(e.key==='Home'||e.key==='End'){e.preventDefault();setIndex(e.key==='Home'?0:sources.length-1);}};
 if(!current)return <div className={s.detailVisual}><span className={s.imageUnavailable}>Images for {p.name} are unavailable. The written design details remain below.</span></div>;
 return <><div role="group" aria-label="Product gallery. Use left and right arrow keys to change image." onKeyDown={keyboard}><div className={s.detailVisual} onTouchStart={e=>{if(e.touches.length===1)start.current={x:e.touches[0].clientX,y:e.touches[0].clientY};else start.current=null;}} onTouchCancel={()=>{start.current=null;}} onTouchEnd={e=>{if(!start.current||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-start.current.x,dy=e.changedTouches[0].clientY-start.current.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)move(dx<0?1:-1);start.current=null;}}>
 <Image retry src={current.src} alt={current.alt} style={{objectPosition:current.position,objectFit:'cover'}} fill quality={60} loading="eager" fetchPriority={active===0?'high':'auto'} sizes={imageSizes.detail}/>
 <button type="button" className={s.zoomButton} onClick={()=>setZoom(true)} aria-label={'Enlarge image of '+p.name}>Enlarge ↗</button></div>
 <div className={s.galleryControls}>{sources.length>1&&<><button type="button" onClick={()=>move(-1)} aria-label="Previous image">←</button><span role="status">{active+1} / {sources.length}</span><button type="button" onClick={()=>move(1)} aria-label="Next image">→</button></>}</div>
 {sources.length>1&&<div className={s.detailImageStrip} role="group" aria-label="Choose a product image">{sources.map((a,i)=><button type="button" key={a.src} aria-label={'View image '+(i+1)+' of '+p.name} aria-pressed={active===i} onClick={()=>setIndex(i)}><Image src={a.src} alt="" style={{objectPosition:a.position}} fill sizes="70px"/></button>)}</div>}
 <noscript><ul className={s.staticGallery}>{sources.map((a,i)=><li key={a.src}><a href={a.src}>View image {i+1}: {a.alt}</a></li>)}</ul></noscript>
 <p className={s.caption}>{current.caption||'Design visualization'} — final materials, proportions and colour are agreed with you.</p>
 </div><Dialog open={zoom} title={p.name} onClose={()=>setZoom(false)}><div role="group" aria-label="Enlarged product gallery" onKeyDown={keyboard}><div className={s.zoomImage}><Image retry src={current.src} alt={current.alt} style={{objectPosition:current.position,objectFit:'contain'}} fill loading="eager" sizes={imageSizes.zoom}/></div><div className={s.galleryControls}>{sources.length>1&&<><button type="button" onClick={()=>move(-1)}>← Previous</button><span role="status">{active+1} / {sources.length}</span><button type="button" onClick={()=>move(1)}>Next →</button></>}</div></div></Dialog></>;
}

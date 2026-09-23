'use client';
import {useRef,useState} from 'react';
import {usePathname,useSearchParams} from 'next/navigation';
import Image from './public-image';
import Link from 'next/link';
import type {ShopProduct} from '@/lib/shop-model';
import {Dialog} from './dialog';
import s from './shop.module.css';
export type CardProduct=Pick<ShopProduct,'id'|'slug'|'name'|'subtitle'|'category'|'image'|'imageAlt'|'imagePosition'>;
export function ProductCard({product:p}:{product:CardProduct}){
 return <Link className={s.card} href={'/pieces/'+p.slug}><div className={s.cardImage}><Image src={p.image} alt={p.imageAlt||p.name+' — '+p.subtitle} style={{objectPosition:p.imagePosition}} fill sizes="(max-width:390px) 90vw, (max-width:780px) 44vw, 30vw"/></div><div className={s.cardTop}><h3>{p.name}</h3><span className={s.cardArrow} aria-hidden>↗</span></div><p>{p.subtitle}</p><small>Price on request</small></Link>;
}
export function CatalogueBrowser({products}:{products:CardProduct[]}){
 const params=useSearchParams(),pathname=usePathname();
 const query=params.get('q')||'',category=params.get('category')||'all',sort=params.get('sort')||'featured';
 const limit=Math.max(12,Math.min(120,Number(params.get('show'))||12));
 const update=(values:Record<string,string>)=>{const next=new URLSearchParams(params.toString());for(const [key,value] of Object.entries(values)){if(value)next.set(key,value);else next.delete(key);}window.history.replaceState(null,'',pathname+(next.size?'?'+next.toString():''));};
 const filtered=products.filter(p=>(category==='all'||p.category===category)&&(p.name+' '+p.subtitle+' '+p.category).toLowerCase().includes(query.toLowerCase().trim()));
 const ordered=sort==='name'?filtered.toSorted((a,b)=>a.name.localeCompare(b.name)):filtered;
 return <><div className={s.toolbar}><label>Find your piece<input type="search" value={query} maxLength={100} onChange={e=>update({q:e.target.value,show:''})} placeholder="Search by name or form"/></label><label>Category<select value={category} onChange={e=>update({category:e.target.value,show:''})}><option value="all">All categories</option>{Array.from(new Set(products.map(p=>p.category))).map(c=><option key={c}>{c}</option>)}</select></label><label>Arrange by<select value={sort} onChange={e=>update({sort:e.target.value,show:''})}><option value="featured">Collection order</option><option value="name">Name A–Z</option></select></label><span role="status">{filtered.length} {filtered.length===1?'piece':'pieces'}</span></div>
 <div className={s.grid}>{ordered.slice(0,limit).map(p=><ProductCard key={p.id} product={p}/>)}</div>
 {!filtered.length&&<div className={s.empty}><h2>{products.length?'A different starting point.':'The next collection is taking shape.'}</h2><p>{products.length?'No pieces match those filters. Try a broader search.':'Contact the atelier to discuss the piece you have in mind.'}</p><div className={s.actions}>{products.length>0&&<button className={s.button} onClick={()=>update({q:'',category:'',show:''})}>Clear filters</button>}<Link className={s.textLink} href="/contact">Contact the atelier ↗</Link></div></div>}
 {filtered.length>limit&&<div className={s.loadMore}><button className={s.button} onClick={()=>update({show:String(limit+12)})}>Explore more pieces ↓</button></div>}</>;
}
export function Gallery({product:p}:{product:Pick<ShopProduct,'image'|'imageAlt'|'imagePosition'|'imageCaption'|'scene'|'sceneAlt'|'scenePosition'|'sceneCaption'|'name'|'gallery'>}){
 const sources=Array.from(new Map([{src:p.image,alt:p.imageAlt||p.name+' design visualization',position:p.imagePosition,caption:p.imageCaption},...(p.gallery||[]),...(p.scene?[{src:p.scene,alt:p.sceneAlt||p.name+' in a room — design visualization',position:p.scenePosition,caption:p.sceneCaption}]:[])].filter(a=>a.src).map(a=>[a.src,a])).values());
 const [index,setIndex]=useState(0),[zoom,setZoom]=useState(false);
 const start=useRef<number|null>(null);const current=sources[index]||sources[0];
 const move=(n:number)=>setIndex(i=>(i+n+sources.length)%sources.length);
 return <><div className={s.detailVisual} onTouchStart={e=>{start.current=e.touches[0].clientX;}} onTouchEnd={e=>{if(start.current===null)return;const delta=e.changedTouches[0].clientX-start.current;if(Math.abs(delta)>60)move(delta<0?1:-1);start.current=null;}}>
 <Image retry src={current.src} alt={current.alt} style={{objectPosition:current.position}} fill priority sizes="(max-width:780px) 90vw, 48vw"/>
 <button className={s.zoomButton} onClick={()=>setZoom(true)} aria-label={'Enlarge image of '+p.name}>Enlarge ↗</button></div>
 <div className={s.galleryControls}>{sources.length>1&&<><button onClick={()=>move(-1)} aria-label="Previous image">←</button><span aria-live="polite">{index+1} / {sources.length}</span><button onClick={()=>move(1)} aria-label="Next image">→</button></>}</div>
 {sources.length>1&&<div className={s.detailImageStrip}>{sources.map((a,i)=><button key={a.src} aria-label={'View image '+(i+1)+' of '+p.name} aria-pressed={index===i} onClick={()=>setIndex(i)}><Image src={a.src} alt="" fill sizes="70px"/></button>)}</div>}
 <p className={s.caption}>{current.caption||'Design visualization'}. Final materials, proportions and colour are agreed with you.</p>
 <Dialog open={zoom} title={p.name} onClose={()=>setZoom(false)}><div className={s.zoomImage}><Image retry src={current.src} alt={current.alt} fill sizes="90vw"/></div><div className={s.galleryControls}>{sources.length>1&&<><button onClick={()=>move(-1)}>← Previous</button><span>{index+1} / {sources.length}</span><button onClick={()=>move(1)}>Next →</button></>}</div></Dialog></>;
}


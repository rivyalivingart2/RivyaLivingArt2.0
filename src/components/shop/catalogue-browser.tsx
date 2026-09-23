'use client';
import {useRef,useState} from 'react';
import {usePathname,useSearchParams} from 'next/navigation';
import Image from './public-image';
import Link from 'next/link';
import type {ShopProduct} from '@/lib/shop-model';
import {collectionLabels,discoverProducts,discoveryHref} from '@/lib/shop-discovery';
import {Dialog} from './dialog';
import s from './shop.module.css';
export type CardProduct=Pick<ShopProduct,'id'|'slug'|'name'|'subtitle'|'category'|'tier'|'material'|'image'|'imageAlt'|'imagePosition'>;
export function ProductCard({product:p}:{product:CardProduct}){
 return <Link className={s.card} href={'/pieces/'+p.slug}><div className={s.cardImage}><Image src={p.image} alt={p.imageAlt||p.name+' — '+p.subtitle} style={{objectPosition:p.imagePosition}} fill sizes="(max-width:390px) 90vw, (max-width:780px) 44vw, 30vw"/></div><div className={s.cardTop}><h3>{p.name}</h3><span className={s.cardArrow} aria-hidden>↗</span></div><p>{p.subtitle}</p><small>Price on request</small></Link>;
}
export function CatalogueBrowser({products}:{products:CardProduct[]}){
 const params=useSearchParams(),pathname=usePathname();
 const status=useRef<HTMLParagraphElement>(null);
 const result=discoverProducts(products,new URLSearchParams(params.toString()));
 const values={q:result.q,collection:result.collection,category:result.category,sort:result.sort,size:String(result.size),show:String(result.show)};
 const navigate=(href:string)=>{if(href!==window.location.pathname+window.location.search){window.history.pushState(null,'',href);requestAnimationFrame(()=>status.current?.focus({preventScroll:true}));}};
 const more=discoveryHref(pathname,{...values,show:String(result.show+result.size)});
 return <><form key={params.toString()} action={pathname} method="get" className={s.toolbar} aria-label="Filter the collection" onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);navigate(discoveryHref(pathname,Object.fromEntries([...data].map(([key,value])=>[key,String(value)]))));}}>
 <label>Find your piece<input type="search" name="q" defaultValue={result.q} maxLength={100} placeholder="Name, form or material"/></label>
 {new Set(products.map(p=>p.tier)).size>1&&<label>Collection<select name="collection" defaultValue={result.collection}><option value="all">All collections</option>{Object.entries(collectionLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>}
 <label>Category<select name="category" defaultValue={result.category}><option value="all">All categories</option>{result.categories.map(c=><option key={c}>{c}</option>)}</select></label>
 <label>Arrange by<select name="sort" defaultValue={result.sort}><option value="featured">Collection order</option><option value="name">Name A–Z</option><option value="name-desc">Name Z–A</option></select></label>
 <label>Pieces per view<select name="size" defaultValue={String(result.size)}>{[12,24,48].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
 <button type="submit" className={s.button}>Apply filters</button><Link href={pathname} className={s.textLink} onClick={e=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){e.preventDefault();navigate(pathname);}}}>Reset</Link></form>
 {result.invalid&&<p className={s.help} role="status">An unavailable filter has been reset. Choose from the current collection options.</p>}
 <p ref={status} tabIndex={-1} className={s.resultsCount} role="status" aria-live="polite">{result.total?('Showing 1–'+result.items.length+' of '+result.total+' '+(result.total===1?'piece':'pieces')):'No pieces to show'}{result.q&&' for “'+result.q+'”'}</p>
 <div className={s.grid}>{result.items.map(p=><ProductCard key={p.id} product={p}/>)}</div>
 {!result.total&&<div className={s.empty}><h2>{products.length?'A different starting point.':'Explore a piece with the atelier.'}</h2><p>{products.length?'No pieces match those filters. Try a broader search or reset your choices.':'There are no published pieces in this collection yet. Contact the atelier to discuss the piece you have in mind.'}</p><div className={s.actions}>{products.length>0&&<Link className={s.button} href={pathname}>Clear filters</Link>}<Link className={s.textLink} href="/contact">Contact the atelier ↗</Link></div></div>}
 {result.total>result.show&&<div className={s.loadMore}><Link className={s.button} href={more} scroll={false} onClick={e=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){e.preventDefault();navigate(more);}}}>Show {Math.min(result.size,result.total-result.show)} more pieces ↓</Link></div>}</>;
}
export function Gallery({product:p}:{product:Pick<ShopProduct,'image'|'imageAlt'|'imagePosition'|'imageCaption'|'scene'|'sceneAlt'|'scenePosition'|'sceneCaption'|'name'|'gallery'>}){
 const sources=Array.from(new Map([{src:p.image,alt:p.imageAlt||p.name+' design visualization',position:p.imagePosition,caption:p.imageCaption},...(p.gallery||[]),...(p.scene?[{src:p.scene,alt:p.sceneAlt||p.name+' in a room — design visualization',position:p.scenePosition,caption:p.sceneCaption}]:[])].filter(a=>a.src).map(a=>[a.src,a])).values());
 const [index,setIndex]=useState(0),[zoom,setZoom]=useState(false);
 const start=useRef<{x:number;y:number}|null>(null);const active=Math.min(index,Math.max(0,sources.length-1));const current=sources[active];
 const move=(n:number)=>{if(sources.length>1)setIndex((active+n+sources.length)%sources.length);};
 if(!current)return <div className={s.detailVisual}><span className={s.imageUnavailable}>Images for {p.name} are unavailable. The written design details remain below.</span></div>;
 return <><div className={s.detailVisual} onTouchStart={e=>{if(e.touches.length===1)start.current={x:e.touches[0].clientX,y:e.touches[0].clientY};else start.current=null;}} onTouchCancel={()=>{start.current=null;}} onTouchEnd={e=>{if(!start.current||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-start.current.x,dy=e.changedTouches[0].clientY-start.current.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)move(dx<0?1:-1);start.current=null;}}>
 <Image retry src={current.src} alt={current.alt} style={{objectPosition:current.position}} fill priority sizes="(max-width:780px) 90vw, 48vw"/>
 <button type="button" className={s.zoomButton} onClick={()=>setZoom(true)} aria-label={'Enlarge image of '+p.name}>Enlarge ↗</button></div>
 <div className={s.galleryControls}>{sources.length>1&&<><button type="button" onClick={()=>move(-1)} aria-label="Previous image">←</button><span role="status">{active+1} / {sources.length}</span><button type="button" onClick={()=>move(1)} aria-label="Next image">→</button></>}</div>
 {sources.length>1&&<div className={s.detailImageStrip} aria-label="Choose a product image">{sources.map((a,i)=><button type="button" key={a.src} aria-label={'View image '+(i+1)+' of '+p.name} aria-pressed={active===i} onClick={()=>setIndex(i)}><Image src={a.src} alt="" style={{objectPosition:a.position}} fill sizes="70px"/></button>)}</div>}
 <noscript><ul className={s.staticGallery}>{sources.map((a,i)=><li key={a.src}><a href={a.src}>View image {i+1}: {a.alt}</a></li>)}</ul></noscript>
 <p className={s.caption}>{current.caption||'Design visualization'} — final materials, proportions and colour are agreed with you.</p>
 <Dialog open={zoom} title={p.name} onClose={()=>setZoom(false)}><div className={s.zoomImage}><Image retry src={current.src} alt={current.alt} fill sizes="90vw"/></div><div className={s.galleryControls}>{sources.length>1&&<><button type="button" onClick={()=>move(-1)}>← Previous</button><span role="status">{active+1} / {sources.length}</span><button type="button" onClick={()=>move(1)}>Next →</button></>}</div></Dialog></>;
}

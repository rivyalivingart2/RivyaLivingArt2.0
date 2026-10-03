'use client';
import {LegacyFilterNotice} from './legacy-filter-notice';
import {discoveryPreviewUrl} from '@/lib/discovery-preview-url';
import {useRef} from 'react';
import p from './detailed-pages.module.css';
import {usePathname,useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {collectionLabels,discoverProducts,discoveryHref} from '@/lib/shop-discovery';
import {ProductCard,type CardProduct} from './product-card';
import s from './shop.module.css';
export function CatalogueBrowser({products,basePath}:{products:CardProduct[];basePath?:string}){
 const params=useSearchParams(),currentPath=usePathname(),pathname=basePath||currentPath;
 const status=useRef<HTMLParagraphElement>(null);
 const result=discoverProducts(products,new URLSearchParams(params.toString()));
 const values={q:result.q,collection:result.collection,category:result.category,sort:result.sort,size:String(result.size),show:String(result.show)};
 const navigate=(target:string)=>{const href=discoveryPreviewUrl(target,currentPath,params);if(href!==window.location.pathname+window.location.search){window.history.pushState(null,'',href);requestAnimationFrame(()=>status.current?.focus({preventScroll:true}));}};
 const more=discoveryHref(pathname,{...values,show:String(result.show+result.size)});
 const chips=[...(result.q?[{key:'q',label:'Search: '+result.q}]:[]),...(result.collection!=='all'?[{key:'collection',label:collectionLabels[result.collection as keyof typeof collectionLabels]}]:[]),...(result.category!=='all'?[{key:'category',label:result.category}]:[])];
 const follow=(event:React.MouseEvent<HTMLAnchorElement>,href:string)=>{if(event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){event.preventDefault();navigate(href);}};
 return <><LegacyFilterNotice/><div className={p.savedTools}><a href="#catalogue-results" className={s.textLink}>Skip to results ↓</a><Link href="/saved-pieces" className={s.textLink}>Your saved pieces ↗</Link></div><details className={p.filterPanel} open><summary>Search and filters{chips.length?' · '+chips.length+' applied':''}</summary><form key={params.toString()} action={pathname} method="get" className={s.toolbar} aria-label="Filter the collection" onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);navigate(discoveryHref(pathname,Object.fromEntries([...data].map(([key,value])=>[key,String(value)]))));}}>
 <label>Find your piece<input type="search" name="q" defaultValue={result.q} maxLength={100} placeholder="Name, form or material"/></label>
 {new Set(products.map(p=>p.tier)).size>1&&<label>Collection<select name="collection" defaultValue={result.collection}><option value="all">All collections</option>{Object.entries(collectionLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>}
 <label>Category<select name="category" defaultValue={result.category}><option value="all">All categories</option>{result.categories.map(c=><option key={c}>{c}</option>)}</select></label>
 <label>Arrange by<select name="sort" defaultValue={result.sort}><option value="featured">Collection order</option><option value="name">Name A–Z</option><option value="name-desc">Name Z–A</option></select></label>
 <label>Pieces per view<select name="size" defaultValue={String(result.size)}>{[12,24,48].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
 <button type="submit" className={s.button}>Apply filters</button><Link href={pathname} className={s.textLink} onClick={e=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){e.preventDefault();navigate(pathname);}}}>Reset</Link></form></details>{chips.length>0&&<nav className={p.chips} aria-label="Applied filters">{chips.map(chip=>{const next={...values,[chip.key]:'',show:String(result.size)},href=discoveryHref(pathname,next);return <a key={chip.key} href={href} aria-label={'Remove '+chip.label} onClick={e=>follow(e,href)}>{chip.label}<span aria-hidden>×</span></a>;})}<a href={pathname} onClick={e=>follow(e,pathname)}>Clear all filters</a></nav>}
 {result.invalid&&<p className={s.help} role="status">An unavailable filter has been reset. Choose from the current collection options.</p>}
 <p id="catalogue-results" ref={status} tabIndex={-1} className={s.resultsCount} role="status" aria-live="polite">{result.total?('Showing 1–'+result.items.length+' of '+result.total+' '+(result.total===1?'piece':'pieces')):'No pieces to show'}{result.q&&' for “'+result.q+'”'}</p>
 <div className={s.grid}>{result.items.map(p=><ProductCard key={p.id} product={p}/>)}</div>
 {!result.total&&<div className={s.empty}><h2>{products.length?'A different starting point.':'Explore a piece with the atelier.'}</h2><p>{products.length?'No pieces match those filters. Try a broader search or reset your choices.':'There are no published pieces in this collection yet. Contact the atelier to discuss the piece you have in mind.'}</p><div className={s.actions}>{products.length>0&&<Link className={s.button} href={pathname} onClick={e=>follow(e,pathname)}>Clear filters</Link>}<Link className={s.textLink} href="/contact">Contact the atelier ↗</Link></div></div>}
 {result.total>result.show&&<div className={s.loadMore}><Link className={s.button} href={more} scroll={false} onClick={e=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){e.preventDefault();navigate(more);}}}>Show {Math.min(result.size,result.total-result.show)} more pieces ↓</Link></div>}</>;
}

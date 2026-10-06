'use client';
import {useJourneyText} from './journey-language';
import {LegacyFilterNotice} from './legacy-filter-notice';
import {discoveryPreviewUrl} from '@/lib/discovery-preview-url';
import {useRef} from 'react';
import p from './detailed-pages.module.css';
import c from './catalogue-journey.module.css';

import {usePathname,useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {collectionLabels,discoverProducts,discoveryHref} from '@/lib/shop-discovery';
import {ProductCard,type CardProduct} from './product-card';
import s from './shop.module.css';
export function CatalogueBrowser({products,basePath}:{products:CardProduct[];basePath?:string}){
 const t=useJourneyText();
 const params=useSearchParams(),currentPath=usePathname(),pathname=basePath||currentPath;
 const status=useRef<HTMLParagraphElement>(null);
 const result=discoverProducts(products,new URLSearchParams(params.toString()));
 const values={q:result.q,collection:result.collection,category:result.category,sort:result.sort,size:String(result.size),show:String(result.show)};
 const navigate=(target:string)=>{const href=discoveryPreviewUrl(target,currentPath,params);if(href!==window.location.pathname+window.location.search){window.history.pushState(null,'',href);requestAnimationFrame(()=>status.current?.focus({preventScroll:true}));}};
 const more=discoveryHref(pathname,{...values,show:String(result.show+result.size)});
 const chips=[...(result.q?[{key:'q',label:t('Search')+': '+result.q}]:[]),...(result.collection!=='all'?[{key:'collection',label:t(collectionLabels[result.collection as keyof typeof collectionLabels])}]:[]),...(result.category!=='all'?[{key:'category',label:result.category}]:[])];
 const follow=(event:React.MouseEvent<HTMLAnchorElement>,href:string)=>{if(event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){event.preventDefault();navigate(href);}};
 return <><LegacyFilterNotice/><div className={p.savedTools}><a href="#catalogue-results" className={s.textLink}>{t("Skip to results ↓")}</a><Link href="/saved-pieces" className={s.textLink}>{t("Your saved pieces ↗")}</Link></div><details className={p.filterPanel+' '+c.filterPanel} open><summary>{t("Search and filters")}{chips.length?' · '+chips.length+' '+t('applied'):''}</summary><form key={params.toString()} action={pathname} method="get" className={s.toolbar+' '+c.toolbar} aria-label={t("Filter the collection")} onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);navigate(discoveryHref(pathname,Object.fromEntries([...data].map(([key,value])=>[key,String(value)]))));}}>
 <label>{t("Find your piece")}<input type="search" name="q" defaultValue={result.q} maxLength={100} placeholder={t("Name, form or material")}/></label>
 {new Set(products.map(p=>p.tier)).size>1&&<label>{t("Collection")}<select name="collection" defaultValue={result.collection}><option value="all">{t("All collections")}</option>{Object.entries(collectionLabels).map(([value,label])=><option key={value} value={value}>{t(label)}</option>)}</select></label>}
 <label>{t("Category")}<select name="category" defaultValue={result.category}><option value="all">{t("All categories")}</option>{result.categories.map(c=><option key={c}>{c}</option>)}</select></label>
 <label>{t("Arrange by")}<select name="sort" defaultValue={result.sort}><option value="featured">{t("Collection order")}</option><option value="name">{t("Name A–Z")}</option><option value="name-desc">{t("Name Z–A")}</option></select></label>
 <label>{t("Pieces per view")}<select name="size" defaultValue={String(result.size)}>{[12,24,48].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
 <button type="submit" className={s.button}>{t("Apply filters")}</button><Link href={pathname} className={s.textLink} onClick={e=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){e.preventDefault();navigate(pathname);}}}>{t("Reset")}</Link></form></details>{chips.length>0&&<nav className={p.chips} aria-label={t("Applied filters")}>{chips.map(chip=>{const next={...values,[chip.key]:'',show:String(result.size)},href=discoveryHref(pathname,next);return <a key={chip.key} href={href} aria-label={t('Remove filter')+': '+chip.label} onClick={e=>follow(e,href)}>{chip.label}<span aria-hidden>×</span></a>;})}<a href={pathname} onClick={e=>follow(e,pathname)}>{t("Clear all filters")}</a></nav>}
 {result.invalid&&<p className={s.help} role="status">{t("An unavailable filter has been reset. Choose from the current collection options.")}</p>}
 <p id="catalogue-results" ref={status} tabIndex={-1} className={s.resultsCount+' '+c.resultCount} role="status" aria-live="polite">{result.total?(t('Showing')+' 1–'+result.items.length+' / '+result.total+' '+t(result.total===1?'piece':'pieces')):t('No pieces to show')}{result.q&&' · '+t('Search term')+': “'+result.q+'”'}</p>
 <div className={s.grid}>{result.items.map(p=><ProductCard key={p.id} product={p}/>)}</div>
 {!result.total&&<div className={s.empty}><h2>{t(products.length?'A different starting point.':'Explore a piece with the atelier.')}</h2><p>{products.length?t('No pieces match those filters. Try a broader search or reset your choices.'):t('There are no published pieces in this collection yet. Contact the atelier to discuss the piece you have in mind.')}</p><div className={s.actions}>{products.length>0&&<Link className={s.button} href={pathname} onClick={e=>follow(e,pathname)}>{t("Clear filters")}</Link>}<Link className={s.textLink} href="/contact">{t("Contact the atelier ↗")}</Link></div></div>}
 {result.total>result.show&&<div className={s.loadMore}><Link className={s.button} href={more} scroll={false} onClick={e=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){e.preventDefault();navigate(more);}}}>{t("Show")} {Math.min(result.size,result.total-result.show)} {t("more pieces ↓")}</Link></div>}</>;
}

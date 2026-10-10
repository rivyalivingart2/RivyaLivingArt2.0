'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import type {ShopProduct} from '@/lib/shop-model';
import {studioFetch} from './workspace-api';
import s from './workspace.module.css';
type Entry={product:ShopProduct;published:ShopProduct|null;visible:boolean};
export function CatalogueCategories(){
 const [rows,setRows]=useState<Entry[]|null>(null),[error,setError]=useState(''),[attempt,setAttempt]=useState(0),[query,setQuery]=useState('');
 useEffect(()=>{let active=true;void studioFetch('/api/studio/workspace?view=catalogue').then(v=>{if(active){setRows(v.products);setError('');}}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[attempt]);
 const categories=[...new Set((rows||[]).flatMap(r=>[r.product.category,...(r.published?[r.published.category]:[])]))].sort().filter(c=>c.toLowerCase().includes(query.toLowerCase()));
 return <><div className={s.heading}><div><h1>Catalogue categories.</h1><p>Categories are read from current product records. This view does not rename categories, move pieces or alter saved form schemas.</p></div><button onClick={()=>setAttempt(v=>v+1)}>Refresh categories</button></div>{error&&<p role="alert">{error} {rows?'Previous results may be stale.':''}</p>}{!rows&&!error&&<p role="status">Reading category membership…</p>}<label>Find a category<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label>{rows&&<><p role="status">{categories.length} categories</p><div className={s.tableWrap} role="region" aria-label="Catalogue categories" tabIndex={0}><table><thead><tr><th scope="col">Category</th><th scope="col">Draft or source records</th><th scope="col">Visible published records</th></tr></thead><tbody>{categories.map(category=><tr key={category}><th scope="row"><Link href={'/studio/products?category='+encodeURIComponent(category)}>{category}</Link></th><td>{rows.filter(r=>r.product.category===category).length}</td><td>{rows.filter(r=>r.visible&&r.published?.category===category).length}</td></tr>)}</tbody></table></div>{!categories.length&&<p>No current category matches this search.</p>}</>}</>;
}

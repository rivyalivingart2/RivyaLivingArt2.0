'use client';
import {useJourneyText} from './journey-language';
import {useState,useSyncExternalStore} from 'react';
import Link from 'next/link';
import {parseSavedPieces} from '@/lib/saved-pieces';
import {ProductCard,type CardProduct} from './product-card';
import {subscribe,snapshot,serverSnapshot,write} from './saved-piece-button';
import p from './detailed-pages.module.css';
import s from './shop.module.css';
import c from './catalogue-journey.module.css';

export function SavedPieces({products}:{products:CardProduct[]}){
 const t=useJourneyText();
 const raw=useSyncExternalStore(subscribe,snapshot,serverSnapshot),ids=parseSavedPieces(raw),[message,setMessage]=useState('');
 const remove=(id?:string)=>setMessage(write(id?ids.filter(v=>v!==id):[])?'Saved list updated.':'This browser could not update your saved list.');
 return <section className={s.section+' '+c.savedCollection}><p>{t("Saved on this browser only. This is a collection of ideas, separate from a saved customization request. Older selections from another website or device are not transferred.")}</p><div className={p.savedTools}><p role="status">{raw===null?t('Loading saved pieces…'):ids.length+' '+t('Saved')+' '+t(ids.length===1?'piece':'pieces')}</p>{ids.length>0&&<button className={p.saveButton} onClick={()=>remove()}>{t("Clear saved pieces")}</button>}<Link className={s.textLink} href="/search">{t("Explore all pieces ↗")}</Link></div>{(raw==='unavailable'||message)&&<p role="status">{t(message||'Browser storage is unavailable. Save individual page addresses to return to them.')}</p>}
 {!ids.length&&raw!==null&&<div className={s.empty}><h2>{t("No saved pieces yet.")}</h2><p>{t("Use Save piece on a design you want to return to. No name, contact details or private brief is stored in this list.")}</p></div>}
 <div className={s.grid}>{ids.map(id=>{const product=products.find(p=>p.id===id);return product?<ProductCard key={id} product={product}/>:<article key={id} className={s.empty}><h2>{t("Piece unavailable")}</h2><p>{t("Reference")} {id} {t("is no longer in the published collection. Its details are not shown.")}</p><button className={p.saveButton} onClick={()=>remove(id)}>{t("Remove unavailable piece")} {id}</button></article>;})}</div></section>;
}

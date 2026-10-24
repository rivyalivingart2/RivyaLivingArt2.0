'use client';
import {useRef,useState} from 'react';
import {creationPage,type OwnerCreation} from '@/lib/owner-creation-model';
import s from './owner-creations.module.css';
export function OwnerCreationsGallery({images,initialImage=''}:{images:OwnerCreation[];initialImage?:string}){
 const [query,setQuery]=useState(initialImage),[category,setCategory]=useState(''),[page,setPage]=useState(1),[active,setActive]=useState<OwnerCreation|null>(null);
 const dialog=useRef<HTMLDialogElement>(null),status=useRef<HTMLParagraphElement>(null);
 const view=creationPage(images,category,query,page),categories=[...new Set(images.map(r=>r.category))].sort();
 function open(image:OwnerCreation){setActive(image);dialog.current?.showModal();}
 function turn(next:number){setPage(next);status.current?.scrollIntoView({block:'start',behavior:'instant'});}
 return <section className={s.section} data-owner-creations="gallery" aria-label="Creation image gallery"><form className={s.filters} onSubmit={e=>e.preventDefault()} onReset={()=>{setQuery('');setCategory('');setPage(1);}}><label htmlFor="creation-search">Find an image<input id="creation-search" type="search" value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}} placeholder="Image number or creation type"/></label><label htmlFor="creation-category">Creation type<select id="creation-category" value={category} onChange={e=>{setCategory(e.target.value);setPage(1);}}><option value="">All creations</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select></label><button type="reset">Reset filters</button></form>
 <p ref={status} role="status" aria-live="polite" style={{scrollMarginTop:100}}>{view.total?`${view.total} ${view.total===1?'image':'images'} · showing ${(view.page-1)*12+1}–${Math.min(view.page*12,view.total)}`:'No images match your filters.'}</p><div className={s.grid}>{view.rows.map(image=><figure key={image.index} className={s.card}><button className={s.imageButton} onClick={()=>open(image)} aria-label={'Enlarge '+image.category+' image '+String(image.index).padStart(3,'0')}>
 {/* Use the approved exact-size WebP variants without re-encoding them. */}
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img className={s.image} src={image.image} srcSet={`${image.small} 640w, ${image.image} 960w, ${image.large} 1600w`} sizes="(max-width:560px) 88vw, (max-width:900px) 44vw, 30vw" width={1600} height={2000} loading="lazy" decoding="async" alt={image.category+' · AI-enhanced presentation '+String(image.index).padStart(3,'0')}/></button><figcaption className={s.caption}><strong>{image.category}</strong><small>Image {String(image.index).padStart(3,'0')} · AI-enhanced presentation</small></figcaption></figure>)}</div>
 {!view.total&&<p className={s.empty}>Try another creation type or reset the filters to see the full collection.</p>}
 <nav className={s.controls} aria-label="Creation gallery pages"><button disabled={view.page===1} onClick={()=>turn(view.page-1)}>Previous</button><span>Page {view.page} of {view.pages}</span><button disabled={view.page===view.pages} onClick={()=>turn(view.page+1)}>Next</button></nav>
 <dialog className={s.dialog} ref={dialog} aria-labelledby="creation-detail-title" onClose={()=>setActive(null)}><div className={s.dialogTop}><h2 id="creation-detail-title">{active?.category} · Image {String(active?.index||'').padStart(3,'0')}</h2><button className={s.close} onClick={()=>dialog.current?.close()}>Close image</button></div>{active&&<>
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img className={s.large} src={active.large} width={1600} height={2000} alt={active.category+' · AI-enhanced presentation'}/><p>AI-enhanced presentation · 1600 × 2000</p><div className={s.controls}><a href={active.large} download={'rivya-creation-'+active.index+'.webp'}>Download image</a></div></>}</dialog></section>;
}

'use client';
import {useRef,useState} from 'react';
import {usePathname,useSearchParams} from 'next/navigation';
import {Dialog} from './dialog';
import {discoveryPreviewUrl} from '@/lib/discovery-preview-url';
import {editorialFilterView,type DiscoveryItem,type EditorialFacet} from '@/lib/editorial-filters';
import s from './shop.module.css';
import f from './editorial-filters.module.css';
const labels:Record<EditorialFacet,string>={topic:'Topic',journey:'Journey',format:'Format',tag:'Tag',material:'Confirmed material',context:'Room / context',language:'Available language',classification:'Story type'};
export function useEditorialFilter<T extends DiscoveryItem>(items:T[],fields:EditorialFacet[],route:string){
 const params=useSearchParams(),path=usePathname(),status=useRef<HTMLParagraphElement>(null),view=editorialFilterView(items,params,fields);
 const navigate=(patch:Record<string,string>)=>{const p=new URLSearchParams(params);for(const key of ['show','record','version','viewport'])p.delete(key);for(const [key,value] of Object.entries(patch))if(value&&value!=='all')p.set(key,value);else p.delete(key);window.history.pushState(null,'',discoveryPreviewUrl(route+(p.size?'?'+p:''),path,params));requestAnimationFrame(()=>status.current?.focus({preventScroll:true}));};
 return {view,navigate,status};
}
export function EditorialFilters({label,fields,control}:{label:string;fields:EditorialFacet[];control:ReturnType<typeof useEditorialFilter>}){
 const {view,navigate,status}=control,[open,setOpen]=useState(false);
 const apply=(form:HTMLFormElement)=>{const data=new FormData(form);navigate({...Object.fromEntries(['q','sort',...fields].map(k=>[k,String(data.get(k)||'')])),page:'1'});setOpen(false);};
 const clear=()=>navigate({...Object.fromEntries(['q','sort',...fields].map(k=>[k,''])),page:'1'});
 const form=()=> <form key={JSON.stringify([view.q,view.active,view.sort])} className={f.form} onSubmit={e=>{e.preventDefault();apply(e.currentTarget);}}><label>Search {label.toLowerCase()}<input name="q" type="search" maxLength={150} defaultValue={view.q}/></label>{fields.map(key=><label key={key}>{labels[key]}<select name={key} defaultValue={view.active[key]||''}><option value="">All</option>{view.active[key]&&!view.facets[key]?.some(v=>v.value===view.active[key])&&<option value={view.active[key]}>{view.active[key]} (0)</option>}{view.facets[key]?.map(v=><option key={v.value} value={v.value}>{v.value} ({v.count})</option>)}</select></label>)}<label>Sort<select name="sort" defaultValue={view.sort}><option value="curated">Curated order</option><option value="title">Title</option></select></label><button className={s.button}>Apply filters</button></form>;
 return <><div className={f.desktop}>{form()}</div><button className={s.button+' '+f.mobile} onClick={()=>setOpen(true)}>Filter {label.toLowerCase()}</button><Dialog open={open} title={'Filter '+label.toLowerCase()} onClose={()=>setOpen(false)}>{form()}</Dialog><div className={f.chips} aria-label={'Applied '+label.toLowerCase()+' filters'}>{view.q&&<button onClick={()=>navigate({q:'',page:'1'})}>Remove search: {view.q} ×</button>}{fields.filter(key=>view.active[key]&&view.active[key]!=='all').map(key=><button key={key} onClick={()=>navigate({[key]:'',page:'1'})}>Remove {labels[key]}: {view.active[key]} ×</button>)}<button onClick={clear}>Clear filters</button></div><p ref={status} role="status" tabIndex={-1}>{view.results.length} {label.toLowerCase()} records · Page {view.page} of {view.totalPages}</p></>;
}
export function EditorialPagination({control}:{control:ReturnType<typeof useEditorialFilter>}){const {view,navigate}=control;return <nav className={s.actions} aria-label="Editorial pages"><button className={s.button} disabled={view.page<=1} onClick={()=>navigate({page:String(view.page-1)})}>Previous page</button><button className={s.button} disabled={view.page>=view.totalPages} onClick={()=>navigate({page:String(view.page+1)})}>Next page</button></nav>;}

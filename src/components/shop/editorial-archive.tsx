"use client";
import {orderedItems,selectedItems} from '@/lib/editorial-order';
import {useSearchParams,usePathname} from 'next/navigation';
import Link from 'next/link';
import type {LandingEntry} from '@/lib/landing-dependencies';
import type {EditorialFacet} from '@/lib/editorial-filters';
import {EditorialEntryCard} from './editorial-entry-card';
import {EditorialFilters,EditorialPagination,useEditorialFilter} from './editorial-filters';
import s from './migration-public.module.css';
import shared from './shop.module.css';
export function EditorialArchive({entries,label,orders={}}:{entries:LandingEntry[];label:string;orders?:Record<string,string[]>}){
 const params=useSearchParams(),path=usePathname(),area=label.toLowerCase(),topic=params.get('topic');
 const fields:EditorialFacet[]=area==='portfolio'?['topic','journey','material','context','language','classification']:['topic','journey','language','classification'];
 const arranged=orderedItems(entries,orders[topic?'category:'+area+':'+encodeURIComponent(topic):'archive:'+area]);
 const control=useEditorialFilter(arranged.map(entry=>({...entry,topic:entry.eyebrow||'Unclassified',search:[entry.title,entry.description,entry.eyebrow,...entry.discovery?.tags||[]].join(' '),classification:entry.editorial?.classification})),fields,path);
 const unfiltered=!control.view.q&&fields.every(key=>!control.view.active[key])&&control.view.page===1&&control.view.sort==='curated';
 const featured=unfiltered?selectedItems(entries,area==='testimonials'?[...new Set([...(orders['placement:testimonials:archive']||[]),...(orders['featured:testimonials']||[])])]:orders['featured:'+area]):[];
 return <section className={s.archive} aria-label={label}><EditorialFilters label={label} fields={fields} control={control}/>{featured.length>0&&<div className={s.entries}>{featured.map(entry=><EditorialEntryCard key={entry.id} entry={entry}/>)}</div>}<div className={s.entries}>{control.view.paged.map(entry=><EditorialEntryCard key={entry.id} entry={entry}/>)}</div>{!control.view.paged.length&&<div className={shared.empty}><h2>{entries.length?'No records match this view.':'No approved records are published yet.'}</h2><p>{entries.length?'Clear filters or return to the first page.':'Explore the collection or prepare a brief for your own piece.'}</p><Link className={shared.button} href={entries.length?path:'/collectible-design'}>{entries.length?'Clear filters':'Explore the collection'}</Link></div>}<EditorialPagination control={control}/></section>;
}

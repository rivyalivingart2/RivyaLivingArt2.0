"use client";
import {useSearchParams} from 'next/navigation';
import type {ReactNode} from 'react';
import {orderedItems,selectedItems} from '@/lib/editorial-order';
import type {DiscoveryItem,EditorialFacet} from '@/lib/editorial-filters';
import {EditorialFilters,EditorialPagination,useEditorialFilter} from './editorial-filters';
import {useJourneyText} from './journey-language';
import s from './shop.module.css';
import p from './detailed-pages.module.css';
import e from './editorial-reading.module.css';
const fields:EditorialFacet[]=['topic','journey','format','tag','language'];
export function JournalBrowser({items,featuredIds=[],orders={}}:{items:(DiscoveryItem&{card:ReactNode})[];featuredIds?:string[];orders?:Record<string,string[]>}){
 const tr=useJourneyText(),params=useSearchParams(),topic=params.get('topic');
 const control=useEditorialFilter(orderedItems(items,orders[topic?'category:journal:'+encodeURIComponent(topic):'archive:journal']),fields,'/journal');
 const featured=!control.view.q&&fields.every(k=>!control.view.active[k])&&control.view.page===1&&control.view.sort==='curated'?selectedItems(items,featuredIds).slice(0,3):[];
 return <section className={s.section+' '+e.journalBrowser} aria-label={tr('The journal')}><EditorialFilters label="Journal" fields={fields} control={control}/>{featured.length>0&&<div className={p.journalFeature+' '+e.featured}><h2>{tr('From the notebook')}</h2>{featured.map(a=><div key={a.id}>{a.card}</div>)}</div>}<h2 className={e.listHeading}>{tr('All stories')}</h2><div className={s.grid}>{control.view.paged.map(a=><div key={a.id} data-editorial-id={a.id}>{a.card}</div>)}</div>{!control.view.paged.length&&<div className={s.empty}><h2>{tr('No stories match this view.')}</h2><p>{tr('Try a different word or return to all topics.')}</p></div>}<EditorialPagination control={control}/></section>;
}

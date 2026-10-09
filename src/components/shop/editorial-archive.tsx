'use client';
import {orderedItems,selectedItems} from '@/lib/editorial-order';
import {useSearchParams,usePathname} from 'next/navigation';
import Link from 'next/link';
import {useRef} from 'react';
import type {LandingEntry} from '@/lib/landing-dependencies';
import {EditorialEntryCard} from './editorial-entry-card';
import s from './migration-public.module.css';
import shared from './shop.module.css';
export function EditorialArchive({entries,label,orders={}}:{entries:LandingEntry[];label:string;orders?:Record<string,string[]>}){
 const params=useSearchParams(),path=usePathname(),status=useRef<HTMLParagraphElement>(null);
 const q=(params.get('q')||'').slice(0,100),topic=params.get('topic')||'all';
 const topics=[...new Set(entries.map(e=>e.eyebrow))];
 const validTopic=topics.includes(topic)?topic:'all';
 const area=label.toLowerCase();
 const visible=orderedItems(entries,orders[validTopic==='all'?'archive:'+area:'category:'+area+':'+encodeURIComponent(validTopic)]).filter(e=>(validTopic==='all'||e.eyebrow===validTopic)&&[e.title,e.description,e.eyebrow].join(' ').toLocaleLowerCase().includes(q.trim().toLocaleLowerCase()));
 const featured=!q&&validTopic==='all'?selectedItems(entries,area==='testimonials'?[...new Set([...(orders['placement:testimonials:archive']||[]),...(orders['featured:testimonials']||[])])]:orders['featured:'+area]):[];
 const count=Math.min(120,Math.max(12,Math.floor(Number(params.get('show'))/12)*12||12));
 const href=(term=q,category=validTopic,show=12)=>{const p=new URLSearchParams();if(term.trim())p.set('q',term.trim());if(category!=='all')p.set('topic',category);if(show>12)p.set('show',String(show));return path+(p.size?'?'+p:'');};
 const navigate=(url:string)=>{window.history.pushState(null,'',url);requestAnimationFrame(()=>status.current?.focus({preventScroll:true}));};
 const follow=(e:React.MouseEvent<HTMLAnchorElement>,url:string)=>{if(e.button===0&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){e.preventDefault();navigate(url);}};
 return <section className={s.archive} aria-label={label}><form className={shared.toolbar} action={path} key={q+'|'+validTopic} onSubmit={e=>{e.preventDefault();const form=new FormData(e.currentTarget);navigate(href(String(form.get('q')||''),String(form.get('topic')||'all')));}}><label>Search {label.toLowerCase()}<input name="q" type="search" maxLength={100} defaultValue={q}/></label><label>Topic<select name="topic" defaultValue={validTopic}><option value="all">All topics</option>{topics.map(t=><option key={t}>{t}</option>)}</select></label><button className={shared.button}>Apply filters</button><Link href={path} onClick={e=>follow(e,path)}>Clear filters</Link></form><p tabIndex={-1} ref={status} role="status">{visible.length} {label.toLowerCase()} records</p><div className={s.entries}>{featured.map(entry=><EditorialEntryCard key={entry.id} entry={entry}/>)}</div><div className={s.entries}>{visible.slice(0,count).map(entry=><EditorialEntryCard key={entry.id} entry={entry}/>)}</div>{!visible.length&&<div className={shared.empty}><h2>{entries.length?'No records match these filters.':'No approved records are published yet.'}</h2><p>{entries.length?'Clear the filters to explore all available records.':'Explore the collection or prepare a brief for your own piece.'}</p><Link className={shared.button} href={entries.length?path:'/collectible-design'} onClick={e=>{if(entries.length)follow(e,path);}}>{entries.length?'Clear filters':'Explore the collection'}</Link></div>}{visible.length>count&&<Link className={shared.button} href={href(q,validTopic,count+12)} onClick={e=>follow(e,href(q,validTopic,count+12))}>Show more</Link>}</section>;
}

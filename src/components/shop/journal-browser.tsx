'use client';
import {useJourneyText} from './journey-language';
import {LegacyFilterNotice} from './legacy-filter-notice';
import {useRef,type ReactNode} from 'react';
import {discoveryPreviewUrl} from '@/lib/discovery-preview-url';
import {usePathname,useSearchParams} from 'next/navigation';
import Link from 'next/link';
import s from './shop.module.css';
import p from './detailed-pages.module.css';
export function JournalBrowser({items,featuredIds=[]}:{items:{id:string;title:string;topic:string;search:string;card:ReactNode}[];featuredIds?:string[]}){
 const tr=useJourneyText();
 const params=useSearchParams(),pathname=usePathname(),status=useRef<HTMLParagraphElement>(null),q=(params.get('q')||'').slice(0,100),topics=[...new Set(items.map(a=>a.topic))],topic=topics.includes(params.get('topic')||'')?params.get('topic')!:'all';
 const show=Math.min(items.length,Math.max(12,Math.min(120,Math.floor(Number(params.get('show'))/12)*12||12)));
 const results=items.filter(a=>(topic==='all'||a.topic===topic)&&a.search.toLocaleLowerCase('en').includes(q.trim().toLocaleLowerCase('en')));
 const feature=!q&&topic==='all'?results.find(a=>featuredIds.includes(a.id)):undefined;
 const href=(nextTopic:string,nextQ:string,nextShow=12)=>{const v=new URLSearchParams();if(nextTopic!=='all')v.set('topic',nextTopic);if(nextQ.trim())v.set('q',nextQ.trim());if(nextShow>12)v.set('show',String(nextShow));return '/journal'+(v.size?'?'+v:'');};
 const navigate=(url:string)=>{window.history.pushState(null,'',discoveryPreviewUrl(url,pathname,params));requestAnimationFrame(()=>status.current?.focus({preventScroll:true}));};
 const follow=(e:React.MouseEvent<HTMLAnchorElement>,url:string)=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey){e.preventDefault();navigate(url);}};
 const rest=results.filter(a=>a!==feature);
 return <section className={s.section}><LegacyFilterNotice/><form className={s.toolbar} key={q} action="/journal" onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);navigate(href(topic,String(data.get('q')||'')));}}><label>{tr("Search the journal")}<input type="search" name="q" defaultValue={q} maxLength={100}/></label>{topic!=='all'&&<input type="hidden" name="topic" value={topic}/>}<button className={s.button}>{tr("Find stories")}</button></form>
 <nav className={p.chips} aria-label="Journal topics">{['all',...topics].map(t=><a key={t} href={href(t,q)} aria-current={topic===t?'page':undefined} onClick={e=>follow(e,href(t,q))}>{t==='all'?tr('All topics'):t} · {t==='all'?items.length:items.filter(a=>a.topic===t).length}</a>)}</nav>
 <p ref={status} tabIndex={-1} role="status">{results.length} {results.length===1?'story':'stories'}{q?' for “'+q+'”':''}</p>
 {feature&&<div className={p.journalFeature}><span className={s.eyebrow}>{tr("From the notebook")}</span>{feature.card}</div>}
 <div className={s.grid}>{rest.slice(0,show).map(a=><div key={a.id}>{a.card}</div>)}</div>
 {rest.length>show&&<div className={s.actions}><a className={s.button} href={href(topic,q,show+12)} onClick={e=>follow(e,href(topic,q,show+12))}>{tr("Show more stories ↓")}</a></div>}
 {!results.length&&<div className={s.empty}><h2>{tr("No stories match this view.")}</h2><p>{tr("Try a different word or return to all topics.")}</p><div className={s.actions}><Link className={s.button} href="/journal" onClick={e=>follow(e,'/journal')}>{tr("Clear journal filters")}</Link><Link className={s.textLink} href="/materials-care">{tr("Read materials and care ↗")}</Link></div></div>}
 </section>;
}

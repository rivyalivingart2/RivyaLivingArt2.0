'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import type {HomeArticle} from '@/lib/homepage-model';
import type {LandingEntry} from '@/lib/landing-dependencies';
import {editorialDisclosure} from '@/lib/editorial-record-model';
import s from './migration-public.module.css';
export function GroupedDiscovery({articles,entries,navigationOnly=false}:{articles:HomeArticle[];entries:LandingEntry[];navigationOnly?:boolean}){
 const params=useSearchParams(),q=(params.get('q')||'').trim().slice(0,100).toLocaleLowerCase();
 const matches=(e:{title:string;description:string;eyebrow:string})=>[e.title,e.description,e.eyebrow].join(' ').toLocaleLowerCase().includes(q);
 const groups=[{key:'collections',label:'Collections',items:entries.filter(e=>!e.editorial&&matches(e))},{key:'journal',label:'Journal',items:articles.filter(matches)},{key:'portfolio',label:'Portfolio',items:entries.filter(e=>e.editorial?.kind==='portfolio'&&matches(e))}];
 if(navigationOnly)return <nav className={s.groupNav} aria-label="Search result groups"><a href="#catalogue-results">Products</a>{groups.map(g=><a key={g.key} href={'#results-'+g.key}>{g.label} ({g.items.length})</a>)}</nav>;
 return <div className={s.discovery}>{groups.map(g=><section key={g.key} id={'results-'+g.key} className={s.discovery} aria-labelledby={'heading-'+g.key}><h2 id={'heading-'+g.key}>{g.label}</h2><p role="status">{g.items.length} {g.label.toLowerCase()} results</p>{g.items.length?<div className={s.entries}>{g.items.slice(0,12).map(item=><article key={item.id} className={s.entry}>{'editorial' in item&&item.editorial&&<p className={s.disclosure}>{editorialDisclosure(item.editorial)}</p>}<h3><Link href={item.route}>{item.title}</Link></h3><p>{item.description}</p></article>)}</div>:<p>{q?'No published matches. Try a different search term.':'No published records are available in this group.'}</p>}{g.items.length>12&&<Link href={'/'+g.key+'?q='+encodeURIComponent(q)}>Explore all {g.label.toLowerCase()} matches</Link>}</section>)}</div>;
}

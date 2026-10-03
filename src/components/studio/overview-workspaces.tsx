'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Boxes,FileText,Image as ImageIcon,BookOpen,Search} from 'lucide-react';
import s from './overview.module.css';

// Gridline's searchable workspace-card pattern, using Rivya's admitted destinations.
const destinations=[
 {href:'/studio/products',title:'Catalogue & forms',description:'Open a piece and its customization fields.',icon:Boxes},
 {href:'/studio/media',title:'Public media',description:'Review approved images, descriptions and usage.',icon:ImageIcon},
 {href:'/studio/site-copy',title:'Site copy',description:'Find the words shared across public pages.',icon:FileText},
 {href:'/studio/content',title:'Pages & journal',description:'Continue a draft, preview or published story.',icon:BookOpen},
] as const;
export function OverviewWorkspaces(){
 const [query,setQuery]=useState('');
 const visible=destinations.filter(item=>(item.title+' '+item.description).toLowerCase().includes(query.trim().toLowerCase()));
 return <section className={s.workspaces} aria-labelledby="workspace-heading">
  <div className={s.sectionHeading}><div><p className={s.kicker}>Your website</p><h2 id="workspace-heading">Choose a workspace</h2></div><label className={s.search}><span>Find a workspace</span><div><Search size={16} aria-hidden="true"/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pages, images, catalogue…"/></div></label></div>
  <div className={s.workspaceGrid}>{visible.map(({href,title,description,icon:Icon})=><Link prefetch={false} className={s.workspaceCard} href={href} key={href}><span className={s.workspaceIcon}><Icon size={21} aria-hidden="true"/></span><h3>{title}</h3><p>{description}</p><ArrowUpRight size={19} aria-hidden="true" className={s.workspaceArrow}/></Link>)}</div>
  {!visible.length&&<p role="status">No workspaces match “{query}”. <button type="button" onClick={()=>setQuery('')}>Clear search</button></p>}
 </section>;
}

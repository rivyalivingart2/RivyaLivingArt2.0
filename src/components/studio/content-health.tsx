'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {type DetailedHealthRow} from '@/lib/content-health-report';
import {readContentHealth} from './read-content-health';
import {useSearchParams} from 'next/navigation';
import s from './workspace.module.css';

export function ContentHealth(){
 const params=useSearchParams();
 const [publication,setPublication]=useState(params.get('publication')||'all'),[draft,setDraft]=useState(params.get('draft')||'all');
 const [rows,setRows]=useState<DetailedHealthRow[]|null>(null),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 const [query,setQuery]=useState(''),[severity,setSeverity]=useState(params.get('severity')||'all'),[area,setArea]=useState('all'),[owner,setOwner]=useState('all');
 const recheck=()=>{setError('');setAttempt(v=>v+1);};
 useEffect(()=>{
  let active=true;
  void readContentHealth().then(result=>{if(active)setRows(result);}).catch(e=>{if(active)setError(e instanceof Error?e.message:'Content health could not be loaded.');});
  return()=>{active=false;};
 },[attempt]);
 const filtered=rows?.filter(r=>(publication==='all'||r.publication===publication)&&(draft==='all'||r.draft===draft)&&(area==='all'||r.area===area)&&(owner==='all'||r.owner===owner)&&(severity==='all'||r.issues.some(i=>i.severity===severity))&&(r.name+' '+r.id+' '+r.issues.map(i=>i.reason).join(' ')).toLowerCase().includes(query.toLowerCase()))||[];
 const issueList=(row:DetailedHealthRow)=><>{row.issues.length?<ul>{[...row.issues].sort((a,b)=>Number(b.severity==='Blocker')-Number(a.severity==='Blocker')).map((issue,i)=><li key={i}><strong>{issue.severity}: </strong>{issue.reason} <Link prefetch={false} href={issue.href}>Open field ↗</Link></li>)}</ul>:<p>No issues flagged by these limited checks.</p>}<Link prefetch={false} href={row.href} aria-label={'Review '+row.name}>Review record ↗</Link></>;
 return <>
  <div className={s.heading}><div><h1>Content health.</h1><p>Validation, review and publication are separate checks.</p></div><button disabled={!rows&&!error} onClick={recheck}>Recheck saved records</button></div>
  {error?<div className={s.panel} role="alert"><p>{error}</p><p>{rows?'Previous results remain below and may be out of date.':'All status is unknown until every check loads successfully.'}</p><button onClick={recheck}>Retry checks</button></div>:<p className={s.status} role="status">{rows?'Checks complete. Nothing was edited or published.':'Checking saved records, navigation and languages…'}</p>}
  {rows&&<>
   <div className={s.metrics} aria-label="Content health summary">
    <div className={s.panel}><span>Records with blockers</span><strong>{rows.filter(r=>r.issues.some(i=>i.severity==='Blocker')).length}</strong></div>
    <div className={s.panel}><span>Unpublished</span><strong>{rows.filter(r=>r.publication==='Unpublished').length}</strong></div>
    <div className={s.panel}><span>Changes pending</span><strong>{rows.filter(r=>r.draft==='Changes pending').length}</strong></div>
    <div className={s.panel}><span>Checked records</span><strong>{rows.length}</strong></div>
   </div>
   <section className={s.panel}><h2>Editorial and publication checks</h2><p className={s.help}>These checks inspect saved versions. Unsaved edits in another editor are not included. Editorial approval and translation review dates are not stored, so they are never inferred from publication. The owner filter uses the last saved editor; assigned ownership is not recorded. Media status describes metadata, not visual approval. Description lengths and repeated covers are advisories.</p>
    <div className={s.toolbar}><label>Find a record or issue<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label><label>Issue type<select value={severity} onChange={e=>setSeverity(e.target.value)}><option value="all">All checks</option><option>Blocker</option><option>Advisory</option></select></label><label>Entity<select value={area} onChange={e=>setArea(e.target.value)}><option value="all">All entities</option>{['Content','Catalogue','Media'].map(a=><option key={a}>{a}</option>)}</select></label><label>Owner / last saved editor<select value={owner} onChange={e=>setOwner(e.target.value)}><option value="all">All editors</option>{[...new Set(rows.map(r=>r.owner))].sort().map(o=><option key={o}>{o}</option>)}</select></label></div>
    <div className={s.actions} aria-label="Applied filters">{publication!=='all'&&<button onClick={()=>setPublication('all')}>Publication: {publication} ×</button>}{draft!=='all'&&<button onClick={()=>setDraft('all')}>Draft: {draft} ×</button>}{query&&<button onClick={()=>setQuery('')}>Search: {query} ×</button>}{severity!=='all'&&<button onClick={()=>setSeverity('all')}>Issue: {severity} ×</button>}{area!=='all'&&<button onClick={()=>setArea('all')}>Entity: {area} ×</button>}{owner!=='all'&&<button onClick={()=>setOwner('all')}>Editor: {owner} ×</button>}{(query||severity!=='all'||area!=='all'||owner!=='all'||publication!=='all'||draft!=='all')&&<button onClick={()=>{setQuery('');setSeverity('all');setArea('all');setOwner('all');setPublication('all');setDraft('all');}}>Clear filters</button>}</div>
    <p role="status">{filtered.length} of {rows.length} records</p>
    <div className={`${s.tableWrap} ${s.healthDesktop}`} role="region" aria-label="Content health records" tabIndex={0}><table className={s.healthTable}><caption>Current shared records and exact repair destinations</caption><thead><tr>{['Record / editor','Validation','Editorial review','Draft difference','Publication','Media','Translation','Issues / repair'].map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{filtered.map(row=><tr key={row.area+':'+row.id}><th scope="row">{row.name}<small className={s.healthRecord}>{row.area} · {row.id}<br/>{row.owner}</small></th><td>{row.validation}</td><td>{row.editorial}</td><td>{row.draft}</td><td>{row.publication}</td><td>{row.media}</td><td>{row.translation}</td><td>{issueList(row)}</td></tr>)}</tbody></table></div>
    <div className={s.healthMobile}>{filtered.map(row=><article className={s.panel} key={row.area+':'+row.id}><h3>{row.name}</h3><p>{row.area} · {row.publication} · {row.draft}</p>{issueList(row)}<details><summary>All checks and saved editor</summary><dl>{Object.entries({Validation:row.validation,'Editorial review':row.editorial,Media:row.media,Translation:row.translation,Editor:row.owner}).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></details></article>)}</div>
    {!filtered.length&&<p className={s.empty}>{rows.length?'No records match these filters.':'No records are available to check.'}</p>}
   </section>
  </>}
 </>;
}

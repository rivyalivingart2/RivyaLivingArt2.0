'use client';
import {useCallback,useEffect,useState} from 'react';
import {defaultHomepageLayout,presentationPreviewHref,type HomepageLayout,type PresentationEntry,type PresentationRevision} from '@/lib/presentation-model';
import {StudioRequestError,studioFetch} from './workspace-api';
import s from './workspace.module.css';
const labels={hero:'Opening image',manifesto:'Manifesto',featured:'Selected pieces'} as const;
const fields=['hero','manifesto','featured'] as const;
const names={cinematic:'Full image',split:'Split composition',strip:'Compact strip',statement:'Spacious statement',row:'Editorial row',bento:'Asymmetric grid'};
const same=(a:HomepageLayout,b:HomepageLayout)=>fields.every(k=>a[k]===b[k]);
export function PresentationEditor({admin}:{admin:boolean}){
 const [entry,setEntry]=useState<PresentationEntry|null>(null),[layout,setLayout]=useState<HomepageLayout>(defaultHomepageLayout),[history,setHistory]=useState<PresentationRevision[]>([]),[latest,setLatest]=useState<PresentationEntry|null>(null);
 const [message,setMessage]=useState('Loading homepage design…'),[busy,setBusy]=useState(false),[locale,setLocale]=useState('en'),[verification,setVerification]=useState('');
 const dirty=!!entry&&!same(layout,entry.document?.layout||defaultHomepageLayout);
 const load=useCallback(async()=>{const data=await studioFetch('/api/studio/presentation');setEntry(data.entry);setLayout(data.entry.document?.layout||defaultHomepageLayout);setHistory(data.history);setMessage('Design choices have their own revision history.');},[]);
 useEffect(()=>{let active=true;void studioFetch('/api/studio/presentation').then(data=>{if(active){setEntry(data.entry);setLayout(data.entry.document?.layout||defaultHomepageLayout);setHistory(data.history);setMessage('Design choices have their own revision history.');}}).catch(e=>{if(active)setMessage(e.message);});return()=>{active=false;};},[]);
 useEffect(()=>{const warn=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
 async function compareLatest(){try{const data=await studioFetch('/api/studio/presentation');setLatest(data.entry);setHistory(data.history);setMessage('Latest saved design loaded for comparison. Your edits are retained.');}catch(e){setMessage((e as Error).message);}}
 async function verify(version:number){
  setVerification('Checking the public page…');
  try{const response=await fetch('/?design-check='+version,{cache:'no-store'});if(!response.ok)throw new Error();const html=new DOMParser().parseFromString(await response.text(),'text/html');const marker=html.querySelector('[data-presentation-revision]');setVerification(marker?.getAttribute('data-presentation-revision')===String(version)?'Public page confirmed design revision '+version+'.':'The public page has not confirmed this design revision. Retry the check.');}
  catch{setVerification('The public page could not be checked. Your saved revision is retained. Retry the check.');}
 }
 async function save(operation:'draft'|'publish'|'restore',restoredFrom?:number){
  if(!entry||busy)return;
  if(operation==='restore'&&dirty&&!window.confirm('Replace unsaved design choices with this saved layout?'))return;
  setBusy(true);setVerification('');
  try{
   const data=await studioFetch('/api/studio/presentation',{operation,version:entry.version,...(operation==='draft'?{layout}:operation==='restore'?{restoredFrom}:{})});
   setEntry(data.entry);setLayout(data.entry.document.layout);setLatest(null);
   setMessage(operation==='publish'?(data.refreshPending?'Published; the page refresh needs verification.':'Design published. Checking the public page…'):operation==='restore'?'Earlier layout restored into a new draft. The public design is unchanged.':'Draft saved. Open its exact preview before publishing.');
   try{setHistory((await studioFetch('/api/studio/presentation')).history);}catch{setMessage('Design saved. History could not refresh; retry the latest-version check.');}
   if(operation==='publish')await verify(data.entry.publishedVersion);
  }catch(e){setMessage((e as Error).message);if(e instanceof StudioRequestError&&e.status===409)try{setLatest((await studioFetch('/api/studio/presentation')).entry);}catch{/* Original edits and error stay visible. */}}
  finally{setBusy(false);}
 }
 return <section data-unsaved={dirty}>
  <header className={s.heading}><div><h1>Homepage design</h1><p>Shape the opening composition using the homepage’s existing text, images and selected pieces.</p></div></header>
  <p role="status" aria-live="polite" className={s.status}>{message}</p>
  {!entry?<button type="button" onClick={()=>void load().catch(e=>setMessage(e.message))}>Retry loading design</button>:<>
   <p>Draft revision <strong data-design-version>{entry.version}</strong> · Public <strong>{entry.publishedVersion||'original layout'}</strong>{dirty?' · Unsaved changes':''}</p>
   <form className={s.panel} onSubmit={e=>{e.preventDefault();void save('draft');}}><fieldset disabled={busy}><legend>Composition</legend><div className={s.grid}>
    <label>Opening image<select value={layout.hero} onChange={e=>setLayout({...layout,hero:e.target.value as HomepageLayout['hero']})}><option value="cinematic">Full image</option><option value="split">Split composition</option></select></label>
    <label>Manifesto<select value={layout.manifesto} onChange={e=>setLayout({...layout,manifesto:e.target.value as HomepageLayout['manifesto']})}><option value="strip">Compact strip</option><option value="statement">Spacious statement</option></select></label>
    <label>Selected pieces<select value={layout.featured} onChange={e=>setLayout({...layout,featured:e.target.value as HomepageLayout['featured']})}><option value="row">Editorial row</option><option value="bento">Asymmetric grid</option></select></label>
   </div><p>Saving captures the current published homepage and its references for a fixed preview. Publication checks those references again.</p><div className={s.actions}><button type="submit" className={s.primary}>Save design draft</button><button type="button" onClick={()=>void compareLatest()}>Check latest saved version</button></div></fieldset></form>
   <section className={s.panel} aria-label="Design comparison"><h2>Compare the design</h2><div className={s.tableWrap}><table><thead><tr><th>Area</th><th>Public layout</th><th>Your choices</th>{latest&&<th>Latest saved · {latest.version}</th>}</tr></thead><tbody>{fields.map(k=><tr key={k}><th>{labels[k]}</th><td>{names[(entry.publishedLayout||defaultHomepageLayout)[k]]}</td><td>{names[layout[k]]}</td>{latest&&<td>{names[(latest.document?.layout||defaultHomepageLayout)[k]]}</td>}</tr>)}</tbody></table></div>{latest&&latest.version!==entry.version&&<button type="button" disabled={busy} onClick={()=>{setEntry(latest);setLatest(null);setMessage('Your design choices are retained against the latest revision. Save and preview again.');}}>Keep my choices against revision {latest.version}</button>}</section>
   <section className={s.panel}><h2>Preview and publish</h2><label>Preview language<select value={locale} onChange={e=>setLocale(e.target.value)}><option value="en">English</option><option value="hi">Hindi</option><option value="gu">Gujarati</option></select></label><p>Reviewed translations are captured with the saved content; unavailable translations retain English. Navigation and business contacts remain current.</p>
    <div className={s.actions}>{entry.version>0&&!dirty?<><a href={presentationPreviewHref(entry.version,locale)} target="_blank" rel="noreferrer">Preview saved design ↗</a><a href={presentationPreviewHref(entry.version,locale,true)} target="_blank" rel="noreferrer">Preview mobile screen ↗</a></>:<p>Save your choices to open their exact preview.</p>}{admin&&<button type="button" disabled={busy||dirty||entry.version<1||!!entry.document?.home.homeSnapshot?.issues.length} onClick={()=>void save('publish')}>Publish saved design</button>}</div>
    {!!entry.document?.home.homeSnapshot?.issues.length&&<div role="alert"><p>Resolve these references, then save and preview again:</p><ul>{entry.document.home.homeSnapshot.issues.map(issue=><li key={issue}>{issue}</li>)}</ul></div>}
    {verification&&<p role="status">{verification}</p>}{entry.publishedVersion>0&&<div className={s.actions}><a href="/" target="_blank" rel="noreferrer">Open public homepage ↗</a><button type="button" disabled={busy} onClick={()=>void verify(entry.publishedVersion)}>Verify public design</button></div>}
   </section>
   <section className={s.panel}><h2>Saved design history</h2><p>Latest 30 revisions. Restoring copies a layout into a new draft with fresh published references.</p>{history.length?<ol>{history.map(row=><li key={row.version}><div className={s.toolbar}><span>Revision {row.version} · {row.operation}</span><a href={presentationPreviewHref(row.version,locale)} target="_blank" rel="noreferrer">Preview revision {row.version}</a><button type="button" disabled={busy} onClick={()=>void save('restore',row.version)}>Restore revision {row.version} to draft</button></div></li>)}</ol>:<p>No saved design revisions yet.</p>}</section>
  </>}
 </section>;
}

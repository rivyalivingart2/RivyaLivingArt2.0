'use client';

import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import type {ContentDocument} from '@/lib/content-model';
import type {PublicMedia} from '@/lib/public-media';
import type {ShopProduct} from '@/lib/shop-model';
import {studioFetch} from './workspace-api';
import s from './workspace.module.css';

type ContentEntry={document:ContentDocument;published:ContentDocument|null;visible:boolean;version:number};
type MediaEntry={media:PublicMedia;published:PublicMedia|null;version:number};
type ProductEntry={product:ShopProduct;published:ShopProduct|null;visible:boolean;hasDraft:boolean;version:number};
type HealthRow={area:'Content'|'Catalogue'|'Media';name:string;status:'Review'|'Draft'|'Ready';detail:string;href:string};

const snippetReview=(d:ContentDocument)=>{
 const notes:string[]=[];
 if(d.title.length>65)notes.push('long title');
 if(d.description.length<70)notes.push('short search description');
 if(d.description.length>180)notes.push('long search description');
 if(d.image&&!d.imageAlt?.trim())notes.push('missing image description');
 return notes;
};

export function ContentHealth(){
 const [content,setContent]=useState<ContentEntry[]>([]);
 const [products,setProducts]=useState<ProductEntry[]>([]);
 const [media,setMedia]=useState<MediaEntry[]>([]);
 const [message,setMessage]=useState('Checking published content…');

 useEffect(()=>{
  let active=true;
  void Promise.all([
   studioFetch('/api/studio/content'),
   studioFetch('/api/studio/workspace?view=catalogue'),
   studioFetch('/api/studio/media'),
  ]).then(([c,p,m])=>{
   if(!active)return;
   setContent(c.entries||[]);
   setProducts(p.products||[]);
   setMedia(m.media||[]);
   setMessage('Read-only checks use the current Studio drafts and published revisions. Search-length notes are editorial heuristics, not validation errors.');
  }).catch(e=>{if(active)setMessage(e instanceof Error?e.message:'Content health could not be loaded.');});
  return()=>{active=false;};
 },[]);

 const rows=useMemo<HealthRow[]>(()=>{
  const result:HealthRow[]=[];
  for(const entry of content){
   const d=entry.document,notes=snippetReview(d);
   if(entry.visible&&!entry.published)notes.push('visible without a published revision');
   const changed=!!entry.published&&JSON.stringify(entry.published)!==JSON.stringify(d);
   result.push({
    area:'Content',name:d.title,
    status:notes.length?'Review':changed?'Draft':'Ready',
    detail:notes.length?notes.join(' · '):changed?'Shared draft differs from the published revision.':entry.published?'Published revision is aligned with this draft.':'Source candidate is not published.',
    href:'/studio/content'
   });
  }
  for(const entry of products){
   const p=entry.product,notes:string[]=[];
   if(!p.name.trim())notes.push('missing name');
   if(!p.subtitle.trim())notes.push('missing subtitle');
   if(!p.story.trim())notes.push('missing story');
   if(!p.image.trim())notes.push('missing primary image');
   if(entry.visible&&!entry.published)notes.push('visible without a published revision');
   result.push({
    area:'Catalogue',name:p.name||p.id,
    status:notes.length?'Review':entry.hasDraft?'Draft':'Ready',
    detail:notes.length?notes.join(' · '):entry.hasDraft?'Draft changes are waiting for review or publication.':entry.visible?'Published and visible.':'Not currently visible on the public catalogue.',
    href:'/studio/products'
   });
  }
  for(const entry of media){
   const m=entry.media,notes:string[]=[];
   if(!m.alt.trim())notes.push('missing image description');
   if(!m.products.length)notes.push('not associated with a catalogue piece');
   const changed=!!entry.published&&JSON.stringify(entry.published)!==JSON.stringify(m);
   result.push({
    area:'Media',name:m.alt||m.path,
    status:notes.length?'Review':changed||!entry.published?'Draft':'Ready',
    detail:notes.length?notes.join(' · '):changed?'Metadata draft differs from the published record.':entry.published?'Published metadata is aligned.':'Approved source metadata is not published yet.',
    href:'/studio/media'
   });
  }
  return result;
 },[content,products,media]);

 const review=rows.filter(r=>r.status==='Review').length;
 const drafts=rows.filter(r=>r.status==='Draft').length;
 const ready=rows.filter(r=>r.status==='Ready').length;

 return <>
  <div className={s.heading}>
   <div>
    <h1>Content health.</h1>
    <p>Read-only checks for public copy, catalogue records and approved media. Nothing on this page publishes or edits data.</p>
   </div>
  </div>
  <p className={s.status} role="status">{message}</p>
  <div className={s.metrics} aria-label="Content health summary">
   <div className={s.panel}><span className={s.help}>Needs review</span><strong>{review}</strong></div>
   <div className={s.panel}><span className={s.help}>Draft differences</span><strong>{drafts}</strong></div>
   <div className={s.panel}><span className={s.help}>Aligned / ready</span><strong>{ready}</strong></div>
   <div className={s.panel}><span className={s.help}>Checked records</span><strong>{rows.length}</strong></div>
  </div>
  <section className={s.panel}>
   <h2>Editorial and SEO checks</h2>
   <p className={s.help}>Title and search-description lengths are review prompts only. Publishing validation remains owned by the existing typed content and media APIs.</p>
   <div className={s.tableWrap}>
    <table>
     <thead><tr><th>Area</th><th>Record</th><th>Status</th><th>Observation</th><th>Open</th></tr></thead>
     <tbody>
      {rows.map((row,index)=><tr key={row.area+':'+row.name+':'+index}>
       <td>{row.area}</td>
       <td>{row.name}</td>
       <td><span className={row.status==='Ready'?s.statusBadgePublished:row.status==='Draft'?s.statusBadgeDraft:s.statusBadgeHidden}>{row.status}</span></td>
       <td>{row.detail}</td>
       <td><Link href={row.href}>Review ↗</Link></td>
      </tr>)}
     </tbody>
    </table>
   </div>
   {!rows.length&&<p className={s.empty}>No records are available to check.</p>}
  </section>
 </>;
}

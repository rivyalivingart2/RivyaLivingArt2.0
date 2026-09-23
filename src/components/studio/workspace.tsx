'use client';
import {useCallback,useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import {logoutAdmin} from '@/app/studio/login/actions';
import {studioFetch,type StaffMember,type WorkspaceIdentity} from './workspace-api';
import {InquiryBoard} from './inquiry-board';
import {CatalogueEditor} from './catalogue-editor';
import {StaffEditor} from './staff-editor';
import {ContentEditor} from './content-editor';
import {MediaLibrary} from './media-library';
import {Operations} from './operations';
import s from './workspace.module.css';
const navigation=[['overview','/studio','Overview'],['inquiries','/studio/inquiries','Inquiries & orders'],['follow-ups','/studio/follow-ups','Follow-ups'],['products','/studio/products','Catalogue & forms'],['content','/studio/content','Pages & journal'],['media','/studio/media','Public media'],['activity','/studio/activity','Activity'],['staff','/studio/staff','Staff access'],['settings','/studio/settings','Settings']];
export function Workspace(){
 const path=usePathname(),segment=path.split('/')[2]||'overview',view=({'orders':'inquiries','kanban':'inquiries','forms':'products','journal':'content','pages':'content'} as Record<string,string>)[segment]||segment;
 const [identity,setIdentity]=useState<WorkspaceIdentity|null>(null),[staff,setStaff]=useState<StaffMember[]>([]),[error,setError]=useState('');
 const load=useCallback(async()=>{const data=await studioFetch('/api/studio/workspace');setIdentity(data.session);setStaff(data.staff);},[]);
 useEffect(()=>{void load().catch(e=>setError(e.message));},[load]);
 const admin=identity?.role==='admin';
 return <div className={s.workspace} onClickCapture={e=>{const a=(e.target as HTMLElement).closest('a');if(a&&a.target!=='_blank'&&a.getAttribute('href')?.startsWith('/studio')&&document.querySelector('[data-unsaved="true"]')&&!window.confirm('Leave this page and discard unsaved edits?')){e.preventDefault();e.stopPropagation();}}}><header className={s.top}><Link href="/studio"><strong>RivyaLivingArt / Studio</strong></Link><span>{identity?.adminId} {identity&&`· ${identity.role}`}</span><a href="/studio/login" target="_blank" rel="noreferrer">Renew sign-in ↗</a><form action={logoutAdmin} onSubmit={e=>{if(document.querySelector('[data-unsaved="true"]')&&!window.confirm('Sign out and discard unsaved edits?'))e.preventDefault();}}><button>Sign out</button></form></header><div className={s.workspaceLayout}><nav className={s.sideNav} aria-label="Studio navigation">{navigation.filter(([key])=>admin||!['staff','settings'].includes(key)).map(([key,href,label])=><Link key={key} href={href} aria-current={view===key?'page':undefined}>{label}</Link>)}</nav><main id="main-content" className={s.workspaceMain}>{error?<div className={s.panel} role="alert">{error}<button onClick={()=>void load().then(()=>setError('')).catch(e=>setError(e.message))}>Retry</button></div>:!identity?<p className={s.status}>Opening your workspace…</p>:view==='products'?<CatalogueEditor admin={admin}/>:view==='content'?<ContentEditor admin={admin}/>:view==='media'?<MediaLibrary admin={admin}/>:view==='staff'?admin?<StaffEditor staff={staff} onReload={load}/>:<p className={s.empty}>Administrator access is required.</p>:view==='inquiries'||view==='follow-ups'?<InquiryBoard key={view} staff={staff} admin={admin} dueOnly={view==='follow-ups'}/>:['overview','activity','settings'].includes(view)?view==='settings'&&!admin?<p className={s.empty}>Administrator access is required.</p>:<Operations key={view} view={view as 'overview'|'activity'|'settings'} admin={admin}/>:<section className={s.empty}><h1>Workspace page unavailable.</h1><Link href="/studio">Return to the overview</Link></section>}</main></div></div>;
}

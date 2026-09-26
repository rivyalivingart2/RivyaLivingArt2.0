'use client';
import {useCallback,useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Inbox,
  Clock,
  Boxes,
  FileText,
  Image as ImageIcon,
  Activity,
  Users,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import dynamic from 'next/dynamic';
import {logoutAdmin} from '@/app/studio/login/actions';
import {studioFetch,type StaffMember,type WorkspaceIdentity} from './workspace-api';
import s from './workspace.module.css';

const InquiryBoard=dynamic(()=>import('./inquiry-board').then(m=>m.InquiryBoard),{loading:WorkspaceLoading});
const CatalogueEditor=dynamic(()=>import('./catalogue-editor').then(m=>m.CatalogueEditor),{loading:WorkspaceLoading});
const StaffEditor=dynamic(()=>import('./staff-editor').then(m=>m.StaffEditor),{loading:WorkspaceLoading});
const ContentEditor=dynamic(()=>import('./content-editor').then(m=>m.ContentEditor),{loading:WorkspaceLoading});
const MediaLibrary=dynamic(()=>import('./media-library').then(m=>m.MediaLibrary),{loading:WorkspaceLoading});
const Operations=dynamic(()=>import('./operations').then(m=>m.Operations),{loading:WorkspaceLoading});
function WorkspaceLoading(){return <p className={s.status} role="status">Opening this workspace page…</p>;}

const navGroups = [
  {
    title: 'Workspace',
    items: [
      { key: 'overview', href: '/studio', label: 'Overview', icon: LayoutDashboard },
      { key: 'inquiries', href: '/studio/inquiries', label: 'Inquiries & orders', icon: Inbox },
      { key: 'follow-ups', href: '/studio/follow-ups', label: 'Follow-ups due', icon: Clock },
    ]
  },
  {
    title: 'Management',
    items: [
      { key: 'products', href: '/studio/products', label: 'Catalogue & forms', icon: Boxes },
      { key: 'content', href: '/studio/content', label: 'Pages & journal', icon: FileText },
      { key: 'media', href: '/studio/media', label: 'Public media', icon: ImageIcon },
    ]
  },
  {
    title: 'Operations',
    items: [
      { key: 'activity', href: '/studio/activity', label: 'Activity & logs', icon: Activity },
      { key: 'staff', href: '/studio/staff', label: 'Staff access', icon: Users, adminOnly: true },
      { key: 'settings', href: '/studio/settings', label: 'Atelier settings', icon: SettingsIcon, adminOnly: true },
    ]
  }
];

export function Workspace(){
 const path=usePathname(),segment=path.split('/')[2]||'overview',view=({'orders':'inquiries','kanban':'inquiries','forms':'products','journal':'content','pages':'content'} as Record<string,string>)[segment]||segment;
 const [identity,setIdentity]=useState<WorkspaceIdentity|null>(null),[staff,setStaff]=useState<StaffMember[]>([]),[error,setError]=useState(''),[sessionMessage,setSessionMessage]=useState('');
 const load=useCallback(async()=>{const data=await studioFetch('/api/studio/workspace');setIdentity(data.session);setStaff(data.staff);setSessionMessage('');},[]);
 useEffect(()=>{let active=true;void studioFetch('/api/studio/workspace').then(data=>{if(active){setIdentity(data.session);setStaff(data.staff);}}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[]);
 useEffect(()=>{const expired=()=>setSessionMessage('Your session expired or access changed. Keep this tab open, renew sign-in, then check access before retrying.');const focus=()=>{void load().catch(()=>setSessionMessage('Access could not be refreshed. Your unsaved editors are retained; retry after renewing sign-in.'));};window.addEventListener('studio-session-expired',expired);window.addEventListener('focus',focus);return()=>{window.removeEventListener('studio-session-expired',expired);window.removeEventListener('focus',focus);};},[load]);
 const admin=identity?.role==='admin';

 return (
  <div className={s.workspace} onClickCapture={e=>{const a=(e.target as HTMLElement).closest('a');if(a&&a.target!=='_blank'&&a.getAttribute('href')?.startsWith('/studio')&&document.querySelector('[data-unsaved="true"]')&&!window.confirm('Leave this page and discard unsaved edits?')){e.preventDefault();e.stopPropagation();}}}>
    <header className={s.top}>
      <div className={s.brandGroup}>
        <Link href="/studio" className={s.brandLink}>
          <strong>RivyaLivingArt</strong>
          <span className={s.brandSlash}>/</span>
          <span className={s.brandStudio}>Studio</span>
        </Link>
        <span className={s.envPill}><span className={s.livePulse} aria-hidden="true" />Atelier Private</span>
      </div>
      <a href="/" target="_blank" rel="noreferrer" className={s.storefrontLink} title="Open public shop in new tab">
        <span>Storefront</span>
        <ExternalLink size={13} aria-hidden="true" />
      </a>
      <div className={s.headerActions}>
        {identity && (
          <div className={s.userBadge}>
            <span className={s.userAvatar}>{(identity.adminId || 'ST').slice(0, 2).toUpperCase()}</span>
            <span className={s.userName}>{identity.adminId}</span>
            <span className={admin ? s.rolePillAdmin : s.rolePillEditor}>{admin ? 'Administrator' : 'Editor'}</span>
          </div>
        )}
        <a href="/studio/login" target="_blank" rel="noreferrer" className={s.renewLink}>Renew sign-in ↗</a>
        <form action={logoutAdmin} onSubmit={e=>{if(document.querySelector('[data-unsaved="true"]')&&!window.confirm('Sign out and discard unsaved edits?'))e.preventDefault();}}>
          <button className={s.signOutBtn} title="Sign out of Studio">
            <LogOut size={13} aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </header>
    {sessionMessage&&<aside className={s.panel} role="alert"><p><AlertCircle size={16} style={{display:'inline',verticalAlign:'text-bottom',marginRight:6}} />{sessionMessage}</p><button onClick={()=>void load().catch(e=>setSessionMessage(e.message))}>Check renewed access</button></aside>}
    <div className={s.workspaceLayout}>
      <nav className={s.sideNav} aria-label="Studio navigation">
        {navGroups.map(group => {
          const visibleItems = group.items.filter(item => !item.adminOnly || admin);
          if (!visibleItems.length) return null;
          return (
            <div key={group.title} className={s.navGroup}>
              <span className={s.navGroupTitle}>{group.title}</span>
              <div className={s.navGroupList}>
                {visibleItems.map(item => {
                  const Icon = item.icon;
                  const isCurrent = view === item.key;
                  return (
                    <Link
                      key={item.key}
                      prefetch={false}
                      href={item.href}
                      className={s.navLink}
                      aria-current={isCurrent ? 'page' : undefined}
                    >
                      <Icon size={16} className={s.navIcon} aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      <main id="main-content" tabIndex={-1} className={s.workspaceMain}>
        {error?<div className={s.panel} role="alert">{error}<button onClick={()=>void load().then(()=>setError('')).catch(e=>setError(e.message))}>Retry</button></div>:!identity?<p className={s.status} role="status">Opening your workspace…</p>:view==='products'?<CatalogueEditor admin={admin}/>:view==='content'?<ContentEditor admin={admin}/>:view==='media'?<MediaLibrary admin={admin}/>:view==='staff'?admin?<StaffEditor staff={staff} onReload={load}/>:<p className={s.empty}>Administrator access is required.</p>:view==='inquiries'||view==='follow-ups'?<InquiryBoard key={view} staff={staff} admin={admin} dueOnly={view==='follow-ups'}/>:['overview','activity','settings'].includes(view)?view==='settings'&&!admin?<p className={s.empty}>Administrator access is required.</p>:<Operations key={view} view={view as 'overview'|'activity'|'settings'} admin={admin}/>:<section className={s.empty}><h1>Workspace page unavailable.</h1><Link href="/studio">Return to the overview</Link></section>}
      </main>
    </div>
  </div>
 );
}

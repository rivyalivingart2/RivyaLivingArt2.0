'use client';
import {useCallback,useEffect,useState,type ReactNode} from 'react';
import {studioModules,studioModule,studioModuleHref,type StudioModuleKey} from '@/lib/studio-modules';
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
  AlertCircle,
  Languages
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
const SiteCopyEditor=dynamic(()=>import('./site-copy-editor').then(m=>m.SiteCopyEditor),{loading:WorkspaceLoading});
const SiteImagesEditor=dynamic(()=>import('./site-images-editor').then(m=>m.SiteImagesEditor),{loading:WorkspaceLoading});
const ContentHealth=dynamic(()=>import('./content-health').then(m=>m.ContentHealth),{loading:WorkspaceLoading});
const SiteSettingsEditor=dynamic(()=>import('./site-settings-editor').then(m=>m.SiteSettingsEditor),{loading:WorkspaceLoading});
function WorkspaceLoading(){return <p className={s.status} role="status">Opening this workspace page…</p>;}

const moduleIcons = {overview:LayoutDashboard,inquiries:Inbox,'follow-ups':Clock,products:Boxes,content:FileText,media:ImageIcon,'site-copy':FileText,'site-images':ImageIcon,'content-health':Activity,'site-settings':Languages,activity:Activity,staff:Users,settings:SettingsIcon} satisfies Record<StudioModuleKey,typeof LayoutDashboard>;
const navGroups = ['Workspace','Management','Operations'].map(title=>({title,items:studioModules.filter(module=>module.group===title)}));
type ModuleContext={admin:boolean;staff:StaffMember[];load:()=>Promise<void>};
const moduleViews = {
 overview:({admin}:ModuleContext)=><Operations view="overview" admin={admin}/>,
 inquiries:({admin,staff}:ModuleContext)=><InquiryBoard staff={staff} admin={admin} dueOnly={false}/>,
 'follow-ups':({admin,staff}:ModuleContext)=><InquiryBoard staff={staff} admin={admin} dueOnly/>,
 products:({admin}:ModuleContext)=><CatalogueEditor admin={admin}/>,
 content:({admin}:ModuleContext)=><ContentEditor admin={admin}/>,
 media:({admin}:ModuleContext)=><MediaLibrary admin={admin}/>,
 'site-copy':({admin}:ModuleContext)=><SiteCopyEditor admin={admin}/>,
 'site-images':({admin}:ModuleContext)=><SiteImagesEditor admin={admin}/>,
 'content-health':()=> <ContentHealth/>,
 'site-settings':()=> <SiteSettingsEditor/>,
 activity:({admin}:ModuleContext)=><Operations view="activity" admin={admin}/>,
 staff:({staff,load}:ModuleContext)=><StaffEditor staff={staff} onReload={load}/>,
 settings:({admin}:ModuleContext)=><Operations view="settings" admin={admin}/>,
} satisfies Record<StudioModuleKey,(context:ModuleContext)=>ReactNode>;

export function Workspace(){
 const path=usePathname(),activeModule=studioModule(path.split('/')[2]||''),view=activeModule?.key;
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
                  const Icon = moduleIcons[item.key];
                  const isCurrent = view === item.key;
                  return (
                    <Link
                      key={item.key}
                      prefetch={false}
                      href={studioModuleHref(item)}
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
        {error?<div className={s.panel} role="alert">{error}<button onClick={()=>void load().then(()=>setError('')).catch(e=>setError(e.message))}>Retry</button></div>:!identity?<p className={s.status} role="status">Opening your workspace…</p>:!activeModule?<section className={s.empty}><h1>Workspace page unavailable.</h1><Link href="/studio">Return to the overview</Link></section>:activeModule.adminOnly&&!admin?<p className={s.empty}>Administrator access is required.</p>:<div key={activeModule.key}>{moduleViews[activeModule.key]({admin,staff,load})}</div>}

      </main>
    </div>
  </div>
 );
}

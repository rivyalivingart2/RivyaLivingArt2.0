'use client';
import {memo,useCallback,useEffect,useState,type ReactNode} from 'react';
import {studioNavigationModules,studioModule,studioModuleHref,type StudioModuleKey} from '@/lib/studio-modules';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {Dialog} from '@/components/shop/dialog';
import {CinematicCanvas,VisualEffectsControl} from '../design-foundation/cinematic-canvas';
import {studioDestinations} from '@/lib/studio-work-queue';
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
  Languages, Menu, Search, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import dynamic from 'next/dynamic';
import {logoutAdmin} from '@/app/studio/login/actions';
import {studioFetch,type StaffMember,type WorkspaceIdentity} from './workspace-api';
import s from './workspace.module.css';
import design from './studio-editing.module.css';
import operationsDesign from './studio-operations.module.css';
import legacy from './legacy-studio.module.css';

// Content and operational pages share controls while retaining scoped layouts.
const contentWorkspaces=new Set<StudioModuleKey>(['products','content-register','editorial-order','content','media','site-copy','sections','site-images','content-health','translations','categories','research','content-gaps','process','materials','forms','journal','portfolio','testimonials','faqs','pages','landing-pages','seo','content-lab']);

const InquiryBoard=dynamic(()=>import('./inquiry-board').then(m=>m.InquiryBoard),{loading:WorkspaceLoading});
const CatalogueEditor=dynamic(()=>import('./catalogue-editor').then(m=>m.CatalogueEditor),{loading:WorkspaceLoading});
const StaffEditor=dynamic(()=>import('./staff-editor').then(m=>m.StaffEditor),{loading:WorkspaceLoading});
const EditorialOrderEditor=dynamic(()=>import('./editorial-order-editor').then(m=>m.EditorialOrderEditor),{loading:WorkspaceLoading});
const ContentRegister=dynamic(()=>import('./content-register').then(m=>m.ContentRegister),{loading:WorkspaceLoading});
const EditorialLibrary=dynamic(()=>import('./editorial-library').then(m=>m.EditorialLibrary),{loading:WorkspaceLoading});
const ContentEditor=dynamic(()=>import('./content-editor').then(m=>m.ContentEditor),{loading:WorkspaceLoading});
const PresentationEditor=dynamic(()=>import('./presentation-editor').then(m=>m.PresentationEditor),{loading:WorkspaceLoading});
const MediaLibrary=dynamic(()=>import('./media-library').then(m=>m.MediaLibrary),{loading:WorkspaceLoading});
const Operations=dynamic(()=>import('./operations').then(m=>m.Operations),{loading:WorkspaceLoading});
const SiteCopyEditor=dynamic(()=>import('./site-copy-editor').then(m=>m.SiteCopyEditor),{loading:WorkspaceLoading});
const SiteImagesEditor=dynamic(()=>import('./site-images-editor').then(m=>m.SiteImagesEditor),{loading:WorkspaceLoading});
const ContentHealth=dynamic(()=>import('./content-health').then(m=>m.ContentHealth),{loading:WorkspaceLoading});
const SiteSettingsEditor=dynamic(()=>import('./site-settings-editor').then(m=>m.SiteSettingsEditor),{loading:WorkspaceLoading});
const TranslationWorkspace=dynamic(()=>import('./translation-workspace').then(m=>m.TranslationWorkspace),{loading:WorkspaceLoading});
const LegacyDisposition=dynamic(()=>import('./legacy-disposition').then(m=>m.LegacyDisposition),{loading:WorkspaceLoading});
const RouteReview=dynamic(()=>import('./route-review').then(m=>m.RouteReview),{loading:WorkspaceLoading});
const AnalyticsPanel=dynamic(()=>import('./analytics-panel').then(m=>m.AnalyticsPanel),{loading:WorkspaceLoading});
const CatalogueCategories=dynamic(()=>import('./catalogue-categories').then(m=>m.CatalogueCategories),{loading:WorkspaceLoading});
const EditorialDesk=dynamic(()=>import('./editorial-desk').then(m=>m.EditorialDesk),{loading:WorkspaceLoading});
const ConditionalWorkspace=dynamic(()=>import('./conditional-workspace').then(m=>m.ConditionalWorkspace),{loading:WorkspaceLoading});
function WorkspaceLoading(){return <p data-studio-part="status" className={s.status} role="status">Opening this workspace page…</p>;}

const moduleIcons = {'content-register':FileText,'editorial-order':FileText,'analytics':Activity,'categories':Boxes,'import':Boxes,'exports':Boxes,'research':Boxes,'content-gaps':Boxes,'process':FileText,'materials':FileText,'forms':FileText,'journal':FileText,'portfolio':FileText,'testimonials':FileText,'faqs':FileText,'pages':FileText,'landing-pages':FileText,'seo':FileText,'subscribers':FileText,'content-lab':FileText,overview:LayoutDashboard,inquiries:Inbox,'follow-ups':Clock,products:Boxes,content:FileText,sections:LayoutDashboard,media:ImageIcon,'site-copy':FileText,'site-images':ImageIcon,'content-health':Activity,'site-settings':Languages,legacy:FileText,translations:Languages,'route-review':ExternalLink,activity:Activity,staff:Users,settings:SettingsIcon} satisfies Record<StudioModuleKey,typeof LayoutDashboard>;
const navGroups = ['Today','Catalogue','Content','Editorial','Settings'].map(title=>({title,items:studioNavigationModules.filter(module=>module.group===title)}));
type ModuleContext={staffId?:string|null;admin:boolean;staff:StaffMember[];load:()=>Promise<void>};
const moduleViews = {
 'content-register':({admin}:ModuleContext)=> <ContentRegister admin={admin}/>,
 'editorial-order':({admin}:ModuleContext)=><EditorialOrderEditor admin={admin}/>,
 analytics:()=> <AnalyticsPanel/>,
 categories:({admin}:ModuleContext)=> <CatalogueCategories admin={admin}/>,
 import:()=> <ConditionalWorkspace view="import"/>,
 subscribers:()=> <ConditionalWorkspace view="subscribers"/>,
 exports:({admin}:ModuleContext)=><Operations view="activity" admin={admin} exportOnly/>,
 forms:({admin}:ModuleContext)=><CatalogueEditor admin={admin} formsOnly/>,
 'content-gaps':()=> <ContentHealth gapsOnly/>,
 process:({admin}:ModuleContext)=><ContentEditor admin={admin} initialRecord="page:process" title="Process steps."/>,
 materials:({admin}:ModuleContext)=><ContentEditor admin={admin} initialRecord="page:materials-care" title="Materials and care."/>,
 'journal':({admin}:ModuleContext)=><EditorialLibrary admin={admin} area="journal"/>,
 'portfolio':({admin}:ModuleContext)=><EditorialLibrary admin={admin} area="portfolio"/>,
 'testimonials':({admin}:ModuleContext)=><EditorialLibrary admin={admin} area="testimonials"/>,
 'faqs':({admin}:ModuleContext)=><EditorialLibrary admin={admin} area="faqs"/>,
 'pages':({admin}:ModuleContext)=><EditorialLibrary admin={admin} area="pages"/>,
 'landing-pages':({admin}:ModuleContext)=><EditorialLibrary admin={admin} area="landing-pages"/>,
 'research':()=> <EditorialDesk view="research"/>,
 'seo':()=> <EditorialDesk view="seo"/>,
 'content-lab':()=> <EditorialDesk view="content-lab"/>,

 overview:({admin}:ModuleContext)=><Operations view="overview" admin={admin}/>,
 inquiries:({admin,staff,staffId}:ModuleContext)=><InquiryBoard staff={staff} admin={admin} staffId={staffId} dueOnly={false}/>,
 'follow-ups':({admin,staff,staffId}:ModuleContext)=><InquiryBoard staff={staff} admin={admin} staffId={staffId} dueOnly/>,
 products:({admin}:ModuleContext)=><CatalogueEditor admin={admin}/>,
 content:({admin}:ModuleContext)=><EditorialLibrary admin={admin}/>,
 sections:({admin}:ModuleContext)=><PresentationEditor admin={admin}/>,
 media:({admin}:ModuleContext)=><MediaLibrary admin={admin}/>,
 'site-copy':({admin}:ModuleContext)=><SiteCopyEditor admin={admin}/>,
 'site-images':({admin}:ModuleContext)=><SiteImagesEditor admin={admin}/>,
 'content-health':()=> <ContentHealth/>,
 'site-settings':()=> <SiteSettingsEditor/>,
 legacy:()=> <LegacyDisposition/>,
 translations:()=> <TranslationWorkspace/>,
 'route-review':()=> <RouteReview/>,
 activity:({admin}:ModuleContext)=><Operations view="activity" admin={admin}/>,
 staff:({staff,load}:ModuleContext)=><StaffEditor staff={staff} onReload={load}/>,
 settings:({admin}:ModuleContext)=><Operations view="settings" admin={admin}/>,
} satisfies Record<StudioModuleKey,(context:ModuleContext)=>ReactNode>;

// Opening navigation or typing in the page finder must not re-render a large
// editor. Identity, role, staff and module changes still update its real props;
// the editor's own state and context subscriptions continue normally.
const ModuleView=memo(function ModuleView({moduleKey,...context}:ModuleContext&{moduleKey:StudioModuleKey}){
 return moduleViews[moduleKey](context);
});

// A route change can remount Workspace; retain only the requested focus destination.
let pendingNavigationFocus:string|null=null;
function NavigationLinks({admin,view,onNavigate}:{admin:boolean;view?:StudioModuleKey;onNavigate?:(href:string)=>void}){
 return navGroups.map(group=>{const items=group.items.filter(item=>admin||!item.adminOnly);return items.length?<div key={group.title} className={s.navGroup}><span data-studio-part="navGroupTitle" className={s.navGroupTitle}>{group.title}</span><div className={s.navGroupList}>{items.map(item=>{const Icon=moduleIcons[item.key];return <Link key={item.key} prefetch={false} href={studioModuleHref(item)} data-studio-part="navLink" className={s.navLink} title={item.label} aria-label={item.label} aria-current={view===item.key?'page':undefined} onClick={e=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey)onNavigate?.(studioModuleHref(item));}}><Icon size={18} className={s.navIcon} aria-hidden="true"/><span className={s.navLabel}>{item.label}</span></Link>;})}</div></div>:null;});
}

export function Workspace({initial,initialCollapsed=false,children}:{initial?:{session:WorkspaceIdentity;staff:StaffMember[]};initialCollapsed?:boolean;children?:ReactNode}={}){
 const path=usePathname(),activeModule=studioModule(path.split('/')[2]||''),view=activeModule?.key;
 const [identity,setIdentity]=useState<WorkspaceIdentity|null>(initial?.session||null),[staff,setStaff]=useState<StaffMember[]>(initial?.staff||[]),[error,setError]=useState(''),[sessionMessage,setSessionMessage]=useState('');
 const load=useCallback(async()=>{const data=await studioFetch('/api/studio/workspace');setIdentity(data.session);setStaff(data.staff);setSessionMessage('');},[]);
 useEffect(()=>{if(initial)return;let active=true;void studioFetch('/api/studio/workspace').then(data=>{if(active){setIdentity(data.session);setStaff(data.staff);}}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[initial]);
 useEffect(()=>{const expired=()=>setSessionMessage('Your session expired or access changed. Keep this tab open, renew sign-in, then check access before retrying.');const focus=()=>{void load().catch(()=>setSessionMessage('Access could not be refreshed. Your unsaved editors are retained; retry after renewing sign-in.'));};window.addEventListener('studio-session-expired',expired);window.addEventListener('focus',focus);return()=>{window.removeEventListener('studio-session-expired',expired);window.removeEventListener('focus',focus);};},[load]);
 const admin=identity?.role==='admin';
 const [mobileNav,setMobileNav]=useState(false),[palette,setPalette]=useState(false),[navigationQuery,setNavigationQuery]=useState(''),[collapsed,setCollapsed]=useState(initialCollapsed);
 const toggleSidebar=()=>{const next=!collapsed;setCollapsed(next);document.cookie='rivya-studio-sidebar='+(next?'collapsed':'expanded')+'; Path=/studio; Max-Age=31536000; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');};
 const destinations=studioDestinations(admin,navigationQuery);
 const navigate=(href:string)=>{pendingNavigationFocus=href;setMobileNav(false);setPalette(false);setNavigationQuery('');if(path===href)requestAnimationFrame(()=>{const heading=document.querySelector<HTMLElement>('#main-content h1');if(heading){heading.tabIndex=-1;heading.focus();pendingNavigationFocus=null;}});};
 useEffect(()=>{const shortcut=(e:KeyboardEvent)=>{if(identity&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'&&!document.querySelector('dialog[open]')){e.preventDefault();setPalette(true);}};window.addEventListener('keydown',shortcut);return()=>window.removeEventListener('keydown',shortcut);},[identity]);
 useEffect(()=>{if(pendingNavigationFocus!==path)return;const main=document.getElementById('main-content');if(!main)return;const focus=()=>{const heading=main.querySelector<HTMLElement>('h1');if(!heading)return false;heading.tabIndex=-1;heading.focus();pendingNavigationFocus=null;return true;};if(focus())return;const observer=new MutationObserver(()=>{if(focus())observer.disconnect();});observer.observe(main,{subtree:true,childList:true});return()=>observer.disconnect();},[path]);

 return (
  <CinematicCanvas mode="studio"><div data-atmosphere="studio" className={s.workspace+' '+design.shell+' '+legacy.shell} data-module={view} data-collapsed={collapsed} onClickCapture={e=>{const a=(e.target as HTMLElement).closest('a');if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||a?.hasAttribute('data-studio-leave-guard'))return;if(a&&a.target!=='_blank'&&a.getAttribute('href')?.startsWith('/studio')&&document.querySelector('[data-unsaved="true"]')&&!window.confirm('Leave this page and discard unsaved edits?')){e.preventDefault();e.stopPropagation();}}}>
    <header data-studio-part="top" className={s.top}>
      <nav className={legacy.topCrumb} aria-label="Studio location"><Link href="/studio">Studio</Link><span aria-hidden>/</span><span>{activeModule?.label||'Workspace'}</span></nav>
      <button type="button" className={s.mobileNavToggle} aria-label="Open Studio navigation" aria-haspopup="dialog" aria-expanded={mobileNav} onClick={()=>setMobileNav(true)}><Menu size={20} aria-hidden="true"/><span>Menu</span></button>
      <div data-studio-part="brandGroup" className={s.brandGroup}>
        <Link href="/studio" data-studio-part="brandLink" className={s.brandLink}>
          <Image className={design.logo} src="/brand/rivyalivingart-logo-horizontal-transparent.png" width={410} height={116} sizes="145px" alt=""/><strong className={design.brandName}>RivyaLivingArt</strong>
          <span className={s.brandSlash}>/</span>
          <span className={s.brandStudio}>Studio</span>
        </Link>
        <span className={s.envPill}><span className={s.livePulse} aria-hidden="true" />Atelier Private</span>
      </div>
      <a href="/" target="_blank" rel="noreferrer" className={s.storefrontLink} aria-label="Open public shop in new tab" title="Open public shop in new tab">
        <span>Storefront</span>
        <ExternalLink size={13} aria-hidden="true" />
      </a>
      <div data-studio-part="headerActions" className={s.headerActions}>
        <button type="button" className={s.commandTrigger} aria-label="Find a Studio page" disabled={!identity} onClick={()=>setPalette(true)} aria-haspopup="dialog"><Search size={16} aria-hidden="true"/><span>Find a Studio page</span><kbd>Ctrl K</kbd></button>
        {identity && (
          <div data-studio-part="userBadge" className={s.userBadge}>
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
    {sessionMessage&&<aside data-studio-part="panel" className={s.panel} role="alert"><p><AlertCircle size={16} style={{display:'inline',verticalAlign:'text-bottom',marginRight:6}} />{sessionMessage}</p><button onClick={()=>void load().catch(e=>setSessionMessage(e.message))}>Check renewed access</button></aside>}
    <div data-studio-part="workspaceLayout" className={s.workspaceLayout}>
      <nav data-studio-part="sideNav" className={s.sideNav} aria-label="Studio navigation">
        <Link href="/studio" className={legacy.sidebarBrand} aria-label="RivyaLivingArt Studio"><Image src="/brand/rivyalivingart-logo-horizontal-transparent.png" width={410} height={116} sizes="180px" alt="RivyaLivingArt"/><span>STUDIO</span></Link>
        <button type="button" className={s.collapseNav} onClick={toggleSidebar} aria-expanded={!collapsed} aria-label={collapsed?'Expand Studio sidebar':'Collapse Studio sidebar'}>{collapsed?<PanelLeftOpen size={18} aria-hidden="true"/>:<PanelLeftClose size={18} aria-hidden="true"/>}<span className={s.navLabel}>Collapse sidebar</span></button>
        <NavigationLinks admin={admin} view={view}/>
      </nav>
      <main id="main-content" tabIndex={-1} className={s.workspaceMain+' '+design.content+(view&&!contentWorkspaces.has(view)?' '+operationsDesign.operations:'')} data-studio-design={view&&contentWorkspaces.has(view)?'content':'operations'}>
        <nav data-studio-part="workspaceCrumb" className={s.workspaceCrumb} aria-label="Workspace breadcrumb"><Link href="/studio">Studio</Link><span aria-hidden> / </span><span aria-current="page">{activeModule?.label||'Unavailable page'}</span><VisualEffectsControl/></nav>
        {error?<div data-studio-part="panel" className={s.panel} role="alert">{error}<button onClick={()=>void load().then(()=>setError('')).catch(e=>setError(e.message))}>Retry</button></div>:!identity?<p data-studio-part="status" className={s.status} role="status">Opening your workspace…</p>:children?<>{children}</>:!activeModule?<section data-studio-part="empty" className={s.empty}><h1>Workspace page unavailable.</h1><Link href="/studio">Return to the overview</Link></section>:activeModule.adminOnly&&!admin?<p data-studio-part="empty" className={s.empty}>Administrator access is required.</p>:<div key={activeModule.key}><ModuleView moduleKey={activeModule.key} admin={admin} staff={staff} load={load} staffId={identity.staffId}/></div>}

      </main>
    </div>
    <Dialog open={mobileNav} title="Studio navigation" closeLabel="Close navigation" onClose={()=>setMobileNav(false)}><nav className={s.fullNavigation} aria-label="Mobile Studio pages"><NavigationLinks admin={admin} view={view} onNavigate={navigate}/></nav></Dialog>
    <Dialog open={palette} title="Find a Studio page" onClose={()=>setPalette(false)}><label className={s.paletteSearch}>Page name<input type="search" data-dialog-autofocus onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();setPalette(false);}}} value={navigationQuery} onChange={e=>setNavigationQuery(e.target.value)} placeholder="Inquiries, pages, images…" maxLength={80}/></label><p role="status">{destinations.length} permitted {destinations.length===1?'page':'pages'}</p><nav className={s.commandResults} aria-label="Matching Studio pages">{destinations.map(item=><Link key={item.key} prefetch={false} href={item.href} onClick={e=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey)navigate(item.href);}}><span>{item.label}</span><small>{item.group}</small></Link>)}</nav>{!destinations.length&&<p>No matching page. Try a different name.</p>}</Dialog>
  </div></CinematicCanvas>
 );
}

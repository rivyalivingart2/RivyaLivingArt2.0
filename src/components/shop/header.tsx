'use client';
import {journeyText} from '@/lib/journey-text';
import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {Dialog} from './dialog';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {Home,Menu,Search,Store,MessageCircle,ArrowUpRight,ChevronDown,X} from 'lucide-react';
import {LocaleSwitcher} from './locale-switcher';
import {navigationLabel,uiText,type Locale,type NavigationSettings,type NavItem} from '@/lib/site-settings-model';
import type {SharedCopy} from '@/lib/shared-copy-model';
import s from './shop.module.css';
import f from './public-frame.module.css';

export type CollectionImage={href:string;src:string;position?:string};
type HeaderProps={navigation:NavigationSettings;locale:Locale;enabledLocales:Locale[];copy?:SharedCopy;whatsapp:string;images?:CollectionImage[]};
const announcementKey='rivya-restoration-announcement-v1';
const subscribeAnnouncement=(notify:()=>void)=>{window.addEventListener('storage',notify);return()=>window.removeEventListener('storage',notify);};
const announcementVisible=()=>{try{const dismissed=Number(localStorage.getItem(announcementKey));return !Number.isFinite(dismissed)||dismissed<=0||Date.now()-dismissed>=7*86400000;}catch{return true;}};
const announcementOnServer=()=>true;
function NavAnchor({item,locale,onClick,current}:{item:NavItem;locale:Locale;onClick?:()=>void;current?:boolean}){
 const props={onClick,'aria-current':current?'page' as const:undefined,...(item.newTab?{target:'_blank',rel:'noreferrer'}:{})};
 return item.href.startsWith('/')?<Link href={item.href} {...props}>{navigationLabel(item,locale)}</Link>:<a href={item.href} {...props}>{navigationLabel(item,locale)}</a>;
}

/** Adapted from OLDWEBSITE 2dd6d5d storefront header, announcement and bottom bar. */
export function ShopHeader(props:HeaderProps){
 const pathname=usePathname();
 return <HeaderContent key={pathname} {...props} pathname={pathname}/>;
}
function HeaderContent({pathname,navigation,locale,enabledLocales,copy,whatsapp,images=[]}:HeaderProps&{pathname:string}){
 const label=(key:Parameters<typeof uiText>[1])=>copy?.[key]||uiText(locale,key);
 const tr=(text:string)=>journeyText(locale,text);
 const [search,setSearch]=useState(false),[menu,setMenu]=useState(false);
 const [compact,setCompact]=useState(false),[hidden,setHidden]=useState(false);
 const [dismissed,setDismissed]=useState(false);
 const announcement=useSyncExternalStore(subscribeAnnouncement,announcementVisible,announcementOnServer)&&!dismissed;
 const collectionMenu=useRef<HTMLDetailsElement>(null),hoverTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const collections=navigation.collections.filter(v=>v.visible),pages=navigation.header.filter(v=>v.visible);
 const secondary=navigation.footerAtelier.filter(v=>v.visible&&!pages.some(p=>p.href===v.href));
 const active=(href:string)=>href==='/'?pathname==='/':href.startsWith('/')&&(pathname===href||pathname.startsWith(href+'/'));
 const waHref='https://wa.me/'+whatsapp;
 const bottomBar=!pathname.startsWith('/pieces/')&&!pathname.startsWith('/commission');
 useEffect(()=>{
  let last=window.scrollY,frame=0;
  const measure=()=>{const y=window.scrollY;setCompact(y>80);if(Math.abs(y-last)>8){setHidden(y>400&&y>last);last=y;}frame=0;};
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(measure);};
  measure();window.addEventListener('scroll',scroll,{passive:true});
  const outside=(e:PointerEvent)=>{if(collectionMenu.current&&!collectionMenu.current.contains(e.target as Node))collectionMenu.current.open=false;};
  document.addEventListener('pointerdown',outside);
  return()=>{window.removeEventListener('scroll',scroll);document.removeEventListener('pointerdown',outside);cancelAnimationFrame(frame);if(hoverTimer.current)clearTimeout(hoverTimer.current);};
 },[]);
 const hover=(open:boolean)=>{if(hoverTimer.current)clearTimeout(hoverTimer.current);hoverTimer.current=setTimeout(()=>{if(collectionMenu.current&&!menu&&!search)collectionMenu.current.open=open;},open?120:160);};
 const closeCollection=()=>{if(hoverTimer.current)clearTimeout(hoverTimer.current);if(collectionMenu.current)collectionMenu.current.open=false;};
 const openMenu=()=>{closeCollection();setMenu(true);setHidden(false);};
 const openSearch=()=>{closeCollection();setSearch(true);setHidden(false);};
 return <>
  {announcement&&<aside className={f.announcement}><span>{label('customPieces')}</span><button type="button" aria-label={tr('Dismiss announcement')} onClick={()=>{setDismissed(true);try{localStorage.setItem(announcementKey,String(Date.now()));}catch{}}}><X size={14} aria-hidden="true"/></button></aside>}
  <header className={f.header} data-home-header={pathname==='/'} data-compact={compact} data-hidden={hidden&&!menu&&!search} onFocusCapture={()=>setHidden(false)}>
   <div className={f.headerRow}>
    <Link className={f.brand} href="/" aria-label={tr('RivyaLivingArt home')}><Image src="/brand/rivyalivingart-logo-horizontal-transparent.png" width={410} height={116} sizes="(max-width: 639px) 144px, 184px" alt="RivyaLivingArt" loading="eager"/></Link>
    <nav className={f.navigation} aria-label={tr('Main navigation')}>
     {!!collections.length&&<details ref={collectionMenu} className={f.collections} onPointerEnter={e=>{if(e.pointerType==='mouse')hover(true);}} onPointerLeave={e=>{if(e.pointerType==='mouse')hover(false);}} onKeyDown={e=>{if(e.key==='Escape'){closeCollection();e.currentTarget.querySelector('summary')?.focus();}}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))closeCollection();}}>
      <summary data-active={collections.some(item=>active(item.href))}>{label('collections')} <ChevronDown size={14} aria-hidden="true"/></summary>
      <div className={f.mega}><div className={f.megaGrid}>{collections.map(item=>{const image=images.find(image=>image.href===item.href);return <div key={item.id}>{image&&<Link href={item.href} tabIndex={-1} aria-hidden="true" onClick={closeCollection} className={f.collectionImage}><Image src={image.src} alt="" fill sizes="25vw" style={{objectFit:'cover',objectPosition:image.position}}/></Link>}<NavAnchor item={item} locale={locale} current={active(item.href)} onClick={closeCollection}/></div>;})}</div><Link href="/search" className={f.allPieces} onClick={closeCollection}>{label('browseAllPieces')} <ArrowUpRight size={16} aria-hidden="true"/></Link></div>
     </details>}
     {pages.map(item=><NavAnchor key={item.id} item={item} locale={locale} current={active(item.href)}/>)}
    </nav>
    <div className={f.headerActions}>
     <button type="button" className={f.iconButton} onClick={openSearch} aria-label={label('searchPieces')} aria-haspopup="dialog"><Search size={20} strokeWidth={1.5} aria-hidden="true"/></button>
     <a href={waHref} className={f.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={15} aria-hidden="true"/></a>
     <button type="button" className={f.iconButton} aria-label={label('openNavigation')} aria-haspopup="dialog" aria-expanded={menu} onClick={openMenu}><Menu size={22} strokeWidth={1.5} aria-hidden="true"/></button>
    </div>
    <noscript><details className={f.staticMenu}><summary>{label('footerExplore')}</summary><nav>{[...collections,...pages].map(item=><NavAnchor key={item.id} item={item} locale={locale}/>)}<Link href="/search">{label('searchPieces')}</Link></nav></details></noscript>
   </div>
  </header>
  <Dialog open={menu} title={label('exploreTitle')} onClose={()=>setMenu(false)} variant="navigation" className={f.drawer} closeLabel={label('closeNavigation')}>
   <nav className={f.drawerPrimary} aria-label={tr('Main navigation')}><Link href="/search" onClick={()=>setMenu(false)}>{label('collections')}</Link>{pages.map(item=><NavAnchor key={item.id} item={item} locale={locale} current={active(item.href)} onClick={()=>setMenu(false)}/>)}</nav>
   <nav className={f.drawerSecondary} aria-label={label('theCollections')}>{[...collections,...secondary].map(item=><NavAnchor key={item.id} item={item} locale={locale} current={active(item.href)} onClick={()=>setMenu(false)}/>)}</nav>
   <div className={f.drawerUtilities}><Link href="/commission" className={f.outlineButton} onClick={()=>setMenu(false)}>{label('beginPiece')} <ArrowUpRight size={16} aria-hidden="true"/></Link><a href={waHref} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a><LocaleSwitcher locale={locale} enabled={enabledLocales}/></div>
  </Dialog>
  <Dialog open={search} title={label('findPiece')} onClose={()=>setSearch(false)} className={f.searchPanel}><form action="/search" method="get" className={s.searchForm}><label>{label('searchCollection')}<input data-dialog-autofocus type="search" name="q" maxLength={100} placeholder={label('searchPieces')}/></label><button type="submit" className={s.button}>{label('exploreResults')}</button><Link className={s.textLink} href="/search" onClick={()=>setSearch(false)}>{label('browseAllPieces')}</Link></form></Dialog>
  {bottomBar&&<nav className={f.bottomBar} aria-label={tr('Mobile navigation')}>
   <Link href="/" aria-current={pathname==='/'?'page':undefined}><Home size={20} strokeWidth={1.5} aria-hidden="true"/><span>{tr('Home')}</span></Link>
   <Link href="/search" aria-current={active('/search')||collections.some(item=>active(item.href))?'page':undefined}><Store size={20} strokeWidth={1.5} aria-hidden="true"/><span>{tr('Shop')}</span></Link>
   <button type="button" onClick={openSearch} aria-haspopup="dialog"><Search size={20} strokeWidth={1.5} aria-hidden="true"/><span>{tr('Search')}</span></button>
   <a href={waHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} strokeWidth={1.5} aria-hidden="true"/><span>WhatsApp</span></a>
   <button type="button" onClick={openMenu} aria-haspopup="dialog" aria-expanded={menu}><Menu size={20} strokeWidth={1.5} aria-hidden="true"/><span>{tr('Menu')}</span></button>
  </nav>}
 </>;
}

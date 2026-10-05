'use client';
import {useEffect,useRef,useState} from 'react';
import {Dialog} from './dialog';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {Menu,Search,ArrowUpRight,ChevronDown} from 'lucide-react';
import {LocaleSwitcher} from './locale-switcher';
import {navigationLabel,uiText,type Locale,type NavigationSettings,type NavItem} from '@/lib/site-settings-model';
import type {SharedCopy} from '@/lib/shared-copy-model';
import s from './shop.module.css';

function NavAnchor({item,locale,className,onClick,current}:{item:NavItem;locale:Locale;className?:string;onClick?:()=>void;current?:boolean}){
 const label=navigationLabel(item,locale);
 const extra=item.newTab?{target:'_blank' as const,rel:'noreferrer'}:{};
 return item.href.startsWith('/')?<Link href={item.href} className={className} onClick={onClick} aria-current={current?'page':undefined} {...extra}>{label}</Link>:<a href={item.href} className={className} onClick={onClick} aria-current={current?'page':undefined} {...extra}>{label}</a>;
}

export function ShopHeader({navigation,locale,enabledLocales,copy}:{navigation:NavigationSettings;locale:Locale;enabledLocales:Locale[];copy?:SharedCopy}) {
 const pathname=usePathname();
 return <HeaderContent key={pathname} pathname={pathname} navigation={navigation} locale={locale} enabledLocales={enabledLocales} copy={copy}/>;
}

function HeaderContent({pathname,navigation,locale,enabledLocales,copy}:{pathname:string;navigation:NavigationSettings;locale:Locale;enabledLocales:Locale[];copy?:SharedCopy}) {
 const label=(key:Parameters<typeof uiText>[1])=>copy?.[key]||uiText(locale,key);
 const [searchPath,setSearchPath]=useState<string|null>(null);
 const [menuPath,setMenuPath]=useState<string|null>(null);
 const collectionMenu=useRef<HTMLDetailsElement>(null);
 const collections=navigation.collections.filter(v=>v.visible),pages=navigation.header.filter(v=>v.visible);
 const active=(url:string)=>url.startsWith('/')&&(pathname===url||pathname.startsWith(url+'/'));
 const close=()=>setMenuPath(null);
 useEffect(()=>{
  const desktop=window.matchMedia('(min-width: 1101px)');
  const closeOnDesktop=()=>{if(desktop.matches)setMenuPath(null);};
  const closeOutside=(event:PointerEvent)=>{if(collectionMenu.current&&!collectionMenu.current.contains(event.target as Node))collectionMenu.current.open=false;};
  document.addEventListener('pointerdown',closeOutside);
  desktop.addEventListener('change',closeOnDesktop);
  return()=>{desktop.removeEventListener('change',closeOnDesktop);document.removeEventListener('pointerdown',closeOutside);};
 },[]);
 return <header className={s.header}>
  <Link className={s.brand} href="/" aria-label="RivyaLivingArt home">
   <Image src="/brand/rivyalivingart-logo-horizontal-transparent.png" width={410} height={116} sizes="(max-width: 780px) 158px, 184px" alt="RivyaLivingArt" loading="eager"/>
  </Link>
  <nav className={s.nav} aria-label="Main navigation">
   {collections.length>0&&<details className={s.collectionMenu} ref={collectionMenu} onKeyDown={e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();}}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))e.currentTarget.open=false;}}>
    <summary data-active={collections.some(item=>active(item.href))}>{label('collections')} <ChevronDown size={14} aria-hidden="true"/></summary>
    <div className={s.collectionPanel}>{collections.map(item=><NavAnchor key={item.id} item={item} locale={locale} current={active(item.href)} onClick={()=>{if(collectionMenu.current)collectionMenu.current.open=false;}}/>)}</div>
   </details>}
   {pages.map(item=><NavAnchor key={item.id} item={item} locale={locale} current={active(item.href)}/>)}
  </nav>
  <div className={s.headerActions}>
   <LocaleSwitcher locale={locale} enabled={enabledLocales}/>
   <button type="button" className={s.searchLink} onClick={()=>setSearchPath(pathname)} aria-label={label('searchPieces')} aria-haspopup="dialog"><Search size={20} aria-hidden="true"/></button>
   <Link className={s.navCta} href="/commission">{label('beginPiece')} <ArrowUpRight size={16} aria-hidden="true"/></Link>
   <button type="button" className={s.mobileToggle} aria-label={label('openNavigation')} aria-haspopup="dialog" aria-expanded={menuPath===pathname} onClick={()=>setMenuPath(pathname)}><Menu size={22} aria-hidden="true"/></button>
  </div>
  <noscript>
   <style>{`.${s.headerActions}{display:none!important}`}</style>
   <details className={s.staticMenu}><summary>{label('footerExplore')}</summary><nav aria-label="Navigation without JavaScript">
    {[...collections,...pages].map(item=><NavAnchor key={item.id} item={item} locale={locale}/>)}
    <Link href="/search">{label('searchPieces')}</Link><Link href="/commission">{label('beginPiece')}</Link>
   </nav></details>
  </noscript>
  <Dialog open={menuPath===pathname} title={label('exploreTitle')} onClose={close} variant="navigation" closeLabel={label('closeNavigation')}>
   <nav aria-label="Mobile navigation">
    <span className={s.eyebrow}>{label('theCollections')}</span>
    {collections.map(item=><NavAnchor key={item.id} item={item} locale={locale} current={active(item.href)} onClick={close}/>)}
    <div className={s.mobilePageLinks}>{pages.map(item=><NavAnchor key={item.id} item={item} locale={locale} current={active(item.href)} onClick={close}/>)}</div>
    <div className={s.mobileLocale}><LocaleSwitcher locale={locale} enabled={enabledLocales}/></div>
    <Link href="/commission" className={s.button} onClick={close}>{label('beginPiece')} <ArrowUpRight size={18} aria-hidden="true"/></Link>
   </nav>
  </Dialog>
  <Dialog open={searchPath===pathname} title={label('findPiece')} onClose={()=>setSearchPath(null)}><form action="/search" method="get" className={s.searchForm}><label>{label('searchCollection')}<input data-dialog-autofocus type="search" name="q" maxLength={100} placeholder={label('searchPieces')}/></label><button type="submit" className={s.button}>{label('exploreResults')}</button><Link className={s.textLink} href="/search" onClick={()=>setSearchPath(null)}>{label('browseAllPieces')}</Link></form></Dialog>
 </header>;
}

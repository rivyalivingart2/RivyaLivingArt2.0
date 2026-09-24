'use client';
import {useEffect,useRef,useState} from 'react';
import {Dialog} from './dialog';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {Menu, Search, ArrowUpRight, ChevronDown} from 'lucide-react';
import s from './shop.module.css';

const collections = [
  ['Furniture & spatial art', '/collectible-design', '01'],
  ['Memory art', '/memory-art', '02'],
  ['Personal art & gifts', '/personal-art', '03'],
] as const;
const pages = [['Our Atelier','/our-story'],['Process','/process'],['Journal','/journal'],['Contact','/contact']] as const;

export function ShopHeader() {
  const pathname=usePathname();
  return <HeaderContent key={pathname} pathname={pathname}/>;
}

function HeaderContent({pathname}:{pathname:string}) {
  const [searchPath,setSearchPath]=useState<string|null>(null);
  const [menuPath,setMenuPath]=useState<string|null>(null);
  const collectionMenu=useRef<HTMLDetailsElement>(null);
  const active=(url:string)=>pathname===url||pathname.startsWith(url+'/');
  const close=()=>setMenuPath(null);
  useEffect(()=>{
    const desktop=window.matchMedia('(min-width: 1201px)');
    const closeOnDesktop=()=>{if(desktop.matches)setMenuPath(null);};
    desktop.addEventListener('change',closeOnDesktop);
    return()=>desktop.removeEventListener('change',closeOnDesktop);
  },[]);
  return <header className={s.header}>
    <Link className={s.brand} href="/" aria-label="RivyaLivingArt home">
      <Image src="/brand/rivyalivingart-logo-horizontal-transparent.png" width={410} height={116} alt="RivyaLivingArt" priority/>
    </Link>
    <nav className={s.nav} aria-label="Main navigation">
      <details className={s.collectionMenu} ref={collectionMenu} onKeyDown={e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();}}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))e.currentTarget.open=false;}}>
        <summary data-active={collections.some(([,url])=>active(url))}>Collections <ChevronDown size={14}/></summary>
        <div className={s.collectionPanel}>{collections.map(([name,url,number])=><Link key={url} href={url} aria-current={active(url)?'page':undefined} onClick={()=>{if(collectionMenu.current)collectionMenu.current.open=false;}}><span>{number}</span>{name}<ArrowUpRight size={16}/></Link>)}</div>
      </details>
      {pages.map(([name,url])=><Link key={url} href={url} aria-current={active(url)?'page':undefined}>{name}</Link>)}
    </nav>
    <div className={s.headerActions}>
      <button type="button" className={s.searchLink} onClick={()=>setSearchPath(pathname)} aria-label="Search pieces" aria-haspopup="dialog"><Search size={20}/></button>
      <Link className={s.navCta} href="/commission">Begin a piece <ArrowUpRight size={16}/></Link>
      <button type="button" className={s.mobileToggle} aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={menuPath===pathname} onClick={()=>setMenuPath(pathname)}><Menu size={22}/></button>
    </div>
    <noscript>
      <style>{`.${s.headerActions}{display:none!important}`}</style>
      <details className={s.staticMenu}><summary>Explore</summary><nav aria-label="Navigation without JavaScript">
        {[...collections.map(([name,url])=>[name,url]),...pages,['Search pieces','/search'],['Begin a piece','/commission']].map(([name,url])=><Link key={url} href={url}>{name}</Link>)}
      </nav></details>
    </noscript>
    <Dialog open={menuPath===pathname} title="Explore RivyaLivingArt" onClose={close} variant="navigation">
      <nav aria-label="Mobile navigation">
        <span className={s.eyebrow}>The collections</span>
        {collections.map(([name,url,number])=><Link key={url} href={url} onClick={close} aria-current={active(url)?'page':undefined}><small>{number}</small>{name}<ArrowUpRight size={20}/></Link>)}
        <div className={s.mobilePageLinks}>{pages.map(([name,url])=><Link key={url} href={url} aria-current={active(url)?'page':undefined} onClick={close}>{name}</Link>)}</div>
        <Link href="/commission" className={s.button} onClick={close}>Begin a piece <ArrowUpRight size={18}/></Link>
      </nav>
    </Dialog>
    <Dialog open={searchPath===pathname} title="Find your piece" onClose={()=>setSearchPath(null)}><form action="/search" method="get" className={s.searchForm}><label>Search the collection<input type="search" name="q" maxLength={100} placeholder="A name, a material, a form"/></label><button className={s.button}>Explore results ↗</button><Link className={s.textLink} href="/search" onClick={()=>setSearchPath(null)}>Browse all pieces</Link></form></Dialog>
  </header>;
}

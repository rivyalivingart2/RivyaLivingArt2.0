'use client';
import {useRef,useState} from 'react';
import {Dialog} from './dialog';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {Menu, Search, X, ArrowUpRight, ChevronDown} from 'lucide-react';
import s from './shop.module.css';

const collections = [
  ['Furniture & spatial art', '/collectible-design', '01'],
  ['Memory art', '/memory-art', '02'],
  ['Personal art & gifts', '/personal-art', '03'],
] as const;
const pages = [['Our Atelier','/our-story'],['Process','/process'],['Journal','/journal'],['Contact','/contact']] as const;

export function ShopHeader() {
  const pathname=usePathname();
  const [searchOpen,setSearchOpen]=useState(false);
  const menu=useRef<HTMLDialogElement>(null);
  const collectionMenu=useRef<HTMLDetailsElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const active=(url:string)=>pathname===url||pathname.startsWith(url+'/');
  const close=()=>{menu.current?.close();document.body.style.overflow='';trigger.current?.focus();};
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
      <button type="button" className={s.searchLink} onClick={()=>setSearchOpen(true)} aria-label="Search pieces" aria-haspopup="dialog"><Search size={20}/></button>
      <Link className={s.navCta} href="/commission">Begin a piece <ArrowUpRight size={16}/></Link>
      <button className={s.mobileToggle} ref={trigger} aria-label="Open navigation" aria-haspopup="dialog" onClick={()=>{menu.current?.showModal();document.body.style.overflow='hidden';}}><Menu size={22}/></button>
    </div>
    <dialog className={s.mobileMenu} ref={menu} aria-labelledby="menu-title" onClose={()=>{document.body.style.overflow='';}} onCancel={close} onClick={e=>{if(e.target===menu.current)close();}}>
      <div className={s.mobileMenuTop}><span id="menu-title">Explore RivyaLivingArt</span><button onClick={close} aria-label="Close navigation"><X size={24}/></button></div>
      <nav aria-label="Mobile navigation">
        <span className={s.eyebrow}>The collections</span>
        {collections.map(([name,url,number])=><Link key={url} href={url} onClick={close} aria-current={active(url)?'page':undefined}><small>{number}</small>{name}<ArrowUpRight size={20}/></Link>)}
        <div className={s.mobilePageLinks}>{pages.map(([name,url])=><Link key={url} href={url} aria-current={active(url)?'page':undefined} onClick={close}>{name}</Link>)}</div>
        <Link href="/commission" className={s.button} onClick={close}>Begin a piece <ArrowUpRight size={18}/></Link>
      </nav>
    </dialog>
    <Dialog open={searchOpen} title="Find your piece" onClose={()=>setSearchOpen(false)}><form action="/search" method="get" className={s.searchForm}><label>Search the collection<input type="search" name="q" maxLength={100} placeholder="A name, a material, a form"/></label><button className={s.button}>Explore results ↗</button><Link className={s.textLink} href="/search" onClick={()=>setSearchOpen(false)}>Browse all pieces</Link></form></Dialog>
  </header>;
}

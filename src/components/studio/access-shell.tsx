'use client';
import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowUpRight} from 'lucide-react';
import s from './studio-access.module.css';
import {CinematicCanvas} from '../design-foundation/cinematic-canvas';
import {useVisualEffectsPaused,setVisualEffectsPaused} from '../design-foundation/cinematic-preference';
export function StudioAccessShell({title,description,children}:{title:string;description:string;children:React.ReactNode}) {
  const panel = useRef<HTMLElement>(null);
  const motionPaused = useVisualEffectsPaused();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let inView = true;
    const update = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {inView = entry.isIntersecting; update();});
    if (panel.current) observer.observe(panel.current);
    document.addEventListener('visibilitychange', update);
    update();
    return () => {observer.disconnect(); document.removeEventListener('visibilitychange', update);};
  }, []);
  return <CinematicCanvas mode="access"><main data-atmosphere="form" id="main-content" tabIndex={-1} className={s.access}><div className={s.frame}>
    <Image className={s.backdrop} src="/media/studio-access/making-study.webp" alt="" fill sizes="100vw" priority/>
    <div className={s.scrim} aria-hidden="true"/>
    <div className={s.welcome}>
      <div className={s.introduction}><p className={s.welcomeTitle}>Art for the way<br/>you <em>live.</em></p><p className={s.welcomeCopy}>Furniture with presence. Objects with meaning.</p><Link href="/" className={s.explore}>Explore Rivya <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
      <p className={s.signature}>RivyaLivingArt <span aria-hidden="true">/</span> Private Studio</p>
    </div>
    <section ref={panel} className={s.panel} aria-labelledby="access-title" data-motion-paused={motionPaused || !visible}>
      <button type="button" className={s.motionToggle} aria-label="Pause decorative visual effects" aria-pressed={motionPaused} onClick={() => setVisualEffectsPaused(!motionPaused)}>{motionPaused ? 'Resume motion' : 'Pause motion'}</button>
      <Link href="/" className={s.brand} aria-label="RivyaLivingArt home"><Image className={s.logo} src="/brand/rivyalivingart-logo-horizontal-transparent.png" width={410} height={116} sizes="180px" alt="RivyaLivingArt"/></Link>
      <nav className={s.accountNav} aria-label="Studio access"><Link href="/studio/request-access" aria-current={title==='Your place in the atelier.'?'page':undefined}>Request an account</Link><Link href="/studio/login" aria-current={title==='Welcome to the atelier.'?'page':undefined}>Sign in</Link></nav>
      <h1 id="access-title">{title}</h1><p className={s.description}>{description}</p>{children}
    </section>
  </div></main></CinematicCanvas>;
}

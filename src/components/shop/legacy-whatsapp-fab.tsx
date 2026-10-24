'use client';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {MessageCircle} from 'lucide-react';
import {useJourneyText} from './journey-language';
import f from './public-frame.module.css';
/** OLDWEBSITE whatsapp-fab: desktop, after 25%, no duplicate product/order bar. */
export function LegacyWhatsAppFab({whatsapp}:{whatsapp:string}){
 const pathname=usePathname(),[shown,setShown]=useState(false),t=useJourneyText();
 useEffect(()=>{
  let raf=0;
  const update=()=>{raf=0;const max=document.documentElement.scrollHeight-innerHeight;setShown(max>0&&scrollY/max>.25);};
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(update);};
  window.addEventListener('scroll',schedule,{passive:true});
  const observer=new ResizeObserver(schedule);observer.observe(document.body);schedule();
  return()=>{window.removeEventListener('scroll',schedule);observer.disconnect();if(raf)cancelAnimationFrame(raf);};
 },[pathname]);
 if(pathname.startsWith('/pieces/')||pathname.startsWith('/commission')||!/^\d{7,15}$/.test(whatsapp))return null;
 return <a className={f.whatsappFab} data-shown={shown} data-legacy-whatsapp-fab href={'https://wa.me/'+whatsapp} target="_blank" rel="noopener noreferrer" aria-hidden={!shown} tabIndex={shown?undefined:-1} aria-label={t('Ask on WhatsApp')}><MessageCircle aria-hidden size={24} strokeWidth={1.5}/></a>;
}

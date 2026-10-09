'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {useJourneyText} from './journey-language';
import s from './catalogue-journey.module.css';
/** The reference site's phone action bar, linked to the existing brief contract. */
export function PieceActionBar({slug,name}:{slug:string;name:string}){
 const tr=useJourneyText(),[visible,setVisible]=useState(false);
 useEffect(()=>{
  const target=document.getElementById('piece-actions');if(!target)return;
  let frame=0;
  const update=()=>{frame=0;const footer=document.querySelector('footer');setVisible(target.getBoundingClientRect().bottom<0&&(!footer||footer.getBoundingClientRect().top>=innerHeight));};
  // Scroll jumps can skip the intersection entirely; one measurement per frame also handles anchor navigation.
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const observer=new IntersectionObserver(schedule);observer.observe(target);schedule();
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  return()=>{observer.disconnect();cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);};
 },[]);
 return <div className={s.phoneActionSpace}>{visible&&<aside className={s.phoneAction} aria-label={tr('Your piece')}><span>{name}</span><Link href={'/pieces/'+slug+'/customize'}>{tr('Customize this piece')}</Link></aside>}</div>;
}

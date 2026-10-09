'use client';
import {useEffect,useState} from 'react';
import s from './section-navigation.module.css';

/** A small progress rail; link labels always come from the rendered document. */
export function SectionNavigation({items,label}:{items:{id:string;label:string}[];label:string}){
 const [active,setActive]=useState('');
 const ids=items.map(item=>item.id).join('|');
 useEffect(()=>{
  const elements=ids.split('|').flatMap(id=>{const node=document.getElementById(id);return node?[node]:[];});
  if(!elements.length||!('IntersectionObserver' in window))return;
  const visible=new Map<string,number>();
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){if(entry.isIntersecting)visible.set(entry.target.id,entry.boundingClientRect.top);else visible.delete(entry.target.id);}
   const next=[...visible].sort((a,b)=>Math.abs(a[1])-Math.abs(b[1]))[0]?.[0];
   if(next)setActive(next);
  },{rootMargin:'-20% 0px -45% 0px'});
  elements.forEach(node=>observer.observe(node));
  return()=>observer.disconnect();
 },[ids]);
 if(items.length<2)return null;
 return <nav className={s.rail} aria-label={label}><ol>{items.map((item,index)=><li key={item.id}><a href={'#'+item.id} title={item.label} aria-label={item.label} aria-current={active===item.id?'location':undefined} onClick={()=>setActive(item.id)}><span aria-hidden="true">{String(index+1).padStart(2,'0')}</span></a></li>)}</ol></nav>;
}

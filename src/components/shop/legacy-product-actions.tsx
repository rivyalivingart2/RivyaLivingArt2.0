'use client';
import {createContext,useContext,useState,type ReactNode} from 'react';
import Link from 'next/link';
import Image from './public-image';
import {Dialog} from './dialog';
import {useJourneyText} from './journey-language';
import {formatPrice} from '@/lib/product-presentation';
import type {CardProduct} from '@/lib/product-card-model';
import s from './legacy-product-actions.module.css';

const Contact=createContext('');
export function PublicContact({whatsapp,children}:{whatsapp:string;children:ReactNode}){
 return <Contact.Provider value={whatsapp}>{children}</Contact.Provider>;
}
export function AtelierWhatsApp(){
 const phone=useContext(Contact),t=useJourneyText();
 if(!/^\d{7,15}$/.test(phone))return null;
 return <a href={'https://wa.me/'+phone} target="_blank" rel="noopener noreferrer">{t('Ask on WhatsApp')} ↗</a>;
}
/** Opens a prepared conversation only. Sending remains an explicit customer action. */
export function PieceWhatsApp({name,slug}:{name:string;slug:string}){
 const phone=useContext(Contact),t=useJourneyText();
 if(!/^\d{7,15}$/.test(phone))return null;
 return <a className={s.contact} href={'https://wa.me/'+phone+'?text='+encodeURIComponent('Hello RivyaLivingArt, I would like to discuss '+name+'. https://www.rivyalivingart.com/pieces/'+encodeURIComponent(slug))} target="_blank" rel="noopener noreferrer">{t('Ask on WhatsApp')} ↗</a>;
}
export function LegacyProductActions({product:p}:{product:CardProduct}){
 const [open,setOpen]=useState(false),t=useJourneyText();
 return <div className={s.actions} data-legacy-card-actions><button type="button" onClick={()=>setOpen(true)} aria-label={t('Quick view')+': '+p.name}>{t('Quick view')}</button><PieceWhatsApp name={p.name} slug={p.slug}/>
  <Dialog open={open} onClose={()=>setOpen(false)} title={p.name} className={s.modal}>
   <div className={s.layout}><div className={s.image}><Image src={p.image} alt={p.imageAlt||p.name} fill sizes="(max-width: 639px) 90vw, 40vw" style={{objectFit:'cover',objectPosition:p.imagePosition}}/></div><div className={s.copy}><p className={s.category}>{p.category}</p><p>{p.subtitle}</p>{p.material&&<p>{p.material}</p>}<p className={s.price}>{p.tier==='personal'?formatPrice(p.price):t('Price on request')}</p><Link href={'/pieces/'+p.slug} className={s.primary}>{t('View piece')} ↗</Link><Link href={'/pieces/'+p.slug+'/customize'}>{t('Customize this piece')} ↗</Link><PieceWhatsApp name={p.name} slug={p.slug}/><small>{t('Design visualization')} · {p.id}</small></div></div>
  </Dialog>
 </div>;
}

import type {CSSProperties} from 'react';
import type {EditorialUsage} from '@/lib/homepage-model';
import Image from './public-image';
import s from './homepage.module.css';
export function EditorialImage({usage,available=true,priority=false}:{usage:EditorialUsage;available?:boolean;priority?:boolean}){
 const style={'--desktop-position':`${usage.desktop.x}% ${usage.desktop.y}%`,'--mobile-position':`${usage.mobile.x}% ${usage.mobile.y}%`,'--desktop-ratio':usage.desktop.ratio,'--mobile-ratio':usage.mobile.ratio} as CSSProperties;
 return <figure className={s.figure} style={style}><div className={s.image}>{available?<Image src={usage.path} alt={usage.alt} fill priority={priority} sizes="(max-width: 780px) 90vw, 45vw"/>:<span role="img" aria-label={usage.alt+' — image unavailable'}>Image unavailable</span>}</div>{usage.caption&&<figcaption>{usage.caption}</figcaption>}</figure>;
}

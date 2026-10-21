import type {ReactNode} from 'react';
import s from './legacy-home-sections.module.css';
/** OLDWEBSITE's mask reveal; SSR, priority media and reduced motion stay visible. */
export function Meniscus({children,className=''}:{children:ReactNode;className?:string}){
 return <div data-legacy-meniscus className={s.meniscus+' '+className}><div data-meniscus-image>{children}</div><span data-meniscus-line aria-hidden/></div>;
}

import {JourneyText} from './journey-language';
import Link from 'next/link';
import s from './shop.module.css';

export function Feedback({title,children,retry}:{title:string;children:React.ReactNode;retry?:()=>void}) {
  return <section className={s.feedback} aria-label={title}>
    <span className={s.eyebrow}>RivyaLivingArt</span><h1>{title}</h1><p>{children}</p>
    <div className={s.actions}>{retry&&<button type="button" className={s.button} onClick={retry}><JourneyText text="Try again"/></button>}<Link className={s.button} href="/collectible-design"><JourneyText text="Explore the collection ↗"/></Link><Link className={s.textLink} href="/contact"><JourneyText text="Contact the atelier"/></Link></div>
  </section>;
}

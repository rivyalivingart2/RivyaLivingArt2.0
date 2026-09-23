import Link from 'next/link';
import s from './shop.module.css';

export function Feedback({title,children,retry}:{title:string;children:React.ReactNode;retry?:()=>void}) {
  return <section className={s.feedback} aria-labelledby="feedback-title">
    <span className={s.eyebrow}>RivyaLivingArt</span><h1 id="feedback-title">{title}</h1><p>{children}</p>
    <div className={s.actions}>{retry&&<button className={s.button} onClick={retry}>Try again</button>}<Link className={s.button} href="/collectible-design">Explore the collection ↗</Link><Link className={s.textLink} href="/contact">Contact the atelier</Link></div>
  </section>;
}

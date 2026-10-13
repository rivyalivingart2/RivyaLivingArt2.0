import m from './modern-homepage.module.css';

/** Native disclosure keeps every available chapter reachable with or without JS. */
export function HomepageContents({items,label}:{items:{id:string;label:string}[];label:string}) {
 if(items.length<2)return null;
 return <nav className={m.contents} aria-label={label}><details><summary>{label}<span aria-hidden="true">+</span></summary><ol>{items.map(item=><li key={item.id}><a href={'#'+item.id}>{item.label}</a></li>)}</ol></details></nav>;
}

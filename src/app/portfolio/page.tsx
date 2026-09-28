import Image from '@/components/shop/public-image';
import Link from 'next/link';
import {routeMetadata} from '@/lib/site-metadata';
import {portfolioStudies, portfolioPrimaryConcept} from '@/lib/portfolio';
import {ShopShell} from '@/components/shop/shop-shell';
import {requirePublicPreview} from '@/lib/public-preview';
import s from '@/components/shop/shop.module.css';

export function generateMetadata(){return routeMetadata('/portfolio');}
export default async function Page(){
 await requirePublicPreview();
 const projects=portfolioStudies;
 return <ShopShell><header className={s.pageIntro}><span className={s.eyebrow}>Projects / In context</span><h1>The piece.<br/>The place. The story.</h1><p>A closer look at the relationship between an object and the space it inhabits.</p></header><section className={s.section}>{projects.length?<div className={s.grid}>{projects.map(p=>{
   const concept = portfolioPrimaryConcept(p);
   return <Link key={p.slug} className={s.card} href={'/portfolio/'+p.slug}><div className={s.cardImage}><Image src={concept?.image || ''} alt={p.title} fill sizes="(max-width:780px) 90vw, 40vw" style={{objectFit: 'cover'}} /></div><h2>{p.title}</h2><p>{p.excerpt}</p></Link>;
 })}</div>:<div className={s.empty}><h2>No project stories are published yet.</h2><p>Explore the collection?Ts design visualizations or prepare a brief for your own space.</p><div className={s.actions}><Link className={s.button} href="/collectible-design">Explore furniture & spatial art +-</Link><Link className={s.textLink} href="/architects">For architects & designers</Link></div></div>}</section></ShopShell>;
}

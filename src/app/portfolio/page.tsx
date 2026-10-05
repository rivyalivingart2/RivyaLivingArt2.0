import {Suspense} from 'react';
import {ReadingLoading} from '@/components/shop/reading-loading';
import Image from '@/components/shop/public-image';
import Link from 'next/link';
import {routeMetadata} from '@/lib/site-metadata';
import {approvedProjects} from '@/lib/project-model';
import {ShopShell} from '@/components/shop/shop-shell';
import {requirePublicPreview} from '@/lib/public-preview';
import s from '@/components/shop/shop.module.css';
import e from '@/components/shop/editorial-reading.module.css';

export function generateMetadata(){return routeMetadata('/portfolio');}
export default async function Page(){
 await requirePublicPreview();
 const projects=approvedProjects.filter(project=>!!project.approvalRecord);
 // Keep the loading fallback on the index so missing project slugs return real 404s.
 return <Suspense fallback={<ReadingLoading/>}><ShopShell><div className={e.editorial+' '+e.portfolio}><header className={s.pageIntro+' '+e.intro}><span className={s.eyebrow}>Projects / In context</span><h1>The piece.<br/>The place. The story.</h1><p>Owner-approved project stories appear here only when their photographs and details are ready for publication.</p></header><section className={s.section}>{projects.length?<div className={s.grid}>{projects.map(project=>
   <Link key={project.slug} className={s.card} href={'/portfolio/'+project.slug}>
    <div className={s.cardImage}><Image src={project.image} alt={project.imageAlt} fill sizes="(max-width:780px) 90vw, 40vw" style={{objectFit:'cover'}} /></div>
    <h2>{project.title}</h2>
    <p>{project.description}</p>
   </Link>
 )}</div>:<div className={s.empty+' '+e.emptyProject}><h2>No approved project stories are published yet.</h2><p>Explore the collection&apos;s design visualizations or prepare a brief for your own space.</p><div className={s.actions}><Link className={s.button} href="/collectible-design">Explore furniture &amp; spatial art ↗</Link><Link className={s.textLink} href="/architects">For architects &amp; designers</Link></div></div>}</section></div></ShopShell></Suspense>;
}

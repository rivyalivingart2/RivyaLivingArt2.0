import {publishedOrders} from '@/lib/editorial-order-store';
import {approvedProjects} from '@/lib/project-model';
import {publishedContent} from '@/lib/published-content';
import {publicLocale} from '@/lib/site-settings';
import {publicEntry,type LandingEntry} from '@/lib/landing-dependencies';
import {EditorialArchive} from './editorial-archive';
import s from './migration-public.module.css';
export async function PortfolioIndex(){
 const documents=await publishedContent(await publicLocale(),undefined,'/portfolio');
 const entries:LandingEntry[]=documents.filter(d=>d.editorial?.kind==='portfolio').map(d=>({...publicEntry(d),sections:[],image:!!d.image?publicEntry(d).image:undefined}));
 for(const p of approvedProjects.filter(p=>!!p.approvalRecord))if(!entries.some(e=>e.route==='/portfolio/'+p.slug))entries.push({id:p.slug,route:'/portfolio/'+p.slug,title:p.title,description:p.description,eyebrow:p.context,sections:[],editorial:{schemaVersion:1,kind:'portfolio',classification:'genuine'},image:{path:p.image,alt:p.imageAlt,caption:'Approved project photograph',desktop:{x:50,y:50,ratio:'3/2'},mobile:{x:50,y:50,ratio:'4/5'}}});
 return <><header className={s.intro}><p>Projects / In context</p><h1>The piece.<br/>The place. The story.</h1><p>Owner-approved project stories appear here only when their photographs and details are ready for publication.</p><p>Concept studies are labelled individually and do not represent completed customer projects.</p></header><EditorialArchive orders={await publishedOrders()} entries={entries} label="Portfolio"/></>;
}

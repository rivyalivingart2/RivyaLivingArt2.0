import {notFound} from 'next/navigation';
import Link from 'next/link';
import {requireStudioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {inquiryCard} from '@/lib/inquiry-card';
import {formatBusinessTime} from '@/lib/business-time';
import {stageLabel} from '@/lib/studio-orders';
import {PrintCardButton} from '@/components/studio/print-card-button';
import s from '@/components/studio/inquiry-card.module.css';
export const dynamic='force-dynamic';
export default async function Card({params}:{params:Promise<{id:string}>}){
 const session=await requireStudioSession(),{id}=await params;
 if(!/^[0-9a-f-]{36}$/i.test(id))notFound();
 const rows=await studioDb()`SELECT o.status,o.version,o.client,o.title,to_jsonb(i) AS inquiry FROM rivya_studio_orders o LEFT JOIN rivya_inquiries i ON i.id=o.id WHERE o.id=${id}::uuid AND (${session.role==='admin'} OR i.assignee=${session.staffId}::uuid)`;
 const row=rows[0];if(!row)notFound();
 const facts=row.inquiry?inquiryCard(row.inquiry):[{label:'Customer name',value:row.client},{label:'Staff-entered brief',value:row.title}];
 return <main id="main-content" className={s.page}><div className={s.toolbar}><Link prefetch={false} href={'/studio/inquiries?record='+id}>Return to saved record</Link><PrintCardButton/></div><article className={s.card} aria-label="Saved inquiry card"><p>Private Studio · Saved inquiry card</p><h1>RivyaLivingArt</h1><p>{row.inquiry?.reference||'Staff-entered order'} · {stageLabel(row.status)} · Version {row.version}</p><p className={s.notice}>A record of the saved brief. This card is not an invoice, certificate of authenticity or confirmation of the final specification.</p>{row.inquiry&&<p>Received {formatBusinessTime(row.inquiry.created_at)}</p>}<dl>{facts.map((fact,index)=><div key={index}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl><p className={s.notice}>Keep this card private. Material, care, price and timing require the separately agreed specification.</p></article></main>;
}

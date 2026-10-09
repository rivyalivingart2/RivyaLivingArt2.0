import register from '../../../../../docs/redesign/old-design-migration-2026-10-08/editorial-production-register.json';
import {studioSession} from '@/lib/studio-auth';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 if(!await studioSession())return Response.json({error:'Sign in to continue.'},{status:401});
 const p=new URL(request.url).searchParams,q=(p.get('q')||'').slice(0,100).toLowerCase(),kind=p.get('kind')||'',page=Math.min(1000,Math.max(1,Math.floor(Number(p.get('page'))||1)));
 const records=register.records.filter(r=>(!kind||r.kind===kind)&&[r.id,r.title,r.topic,r.journey].join(' ').toLowerCase().includes(q));
 return Response.json({entries:records.slice((page-1)*25,page*25),total:records.length,page,totalPages:Math.max(1,Math.ceil(records.length/25)),targets:register.targetPerSection,planned:register.total,created:register.records.filter(r=>r.newRecordId).length},{headers:{'Cache-Control':'private, no-store'}});
}

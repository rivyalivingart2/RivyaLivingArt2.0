import register from '../../../../../docs/redesign/old-design-migration-2026-10-08/editorial-production-register.json';
import productionManifest from '../../../../../docs/editorial-production/m9/content-manifest.json';
import {studioSession} from '@/lib/studio-auth';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 if(!await studioSession())return Response.json({error:'Sign in to continue.'},{status:401});
 const p=new URL(request.url).searchParams,q=(p.get('q')||'').slice(0,100).toLowerCase(),kind=p.get('kind')||'',page=Math.min(1000,Math.max(1,Math.floor(Number(p.get('page'))||1)));
 const records=register.records.filter(r=>(!kind||r.kind===kind)&&[r.id,r.title,r.topic,r.journey].join(' ').toLowerCase().includes(q));
 const production: {candidateId:string;recordId:string;localStudioVersion:number|null;deliveryContentDriveId?:string|null}[]=productionManifest;
 const byId=new Map(production.map(row=>[row.candidateId,row]));
 const entries=records.slice((page-1)*25,page*25).map(row=>{const draft=byId.get(row.id);return {...row,authoredRecordId:draft?.recordId,stagedVersion:draft?.localStudioVersion,localEditorAvailable:process.env.RIVYA_MIGRATION_LOCAL_SQL==='true'&&!!draft?.localStudioVersion,deliveryContentDriveId:draft?.deliveryContentDriveId};});
 return Response.json({entries,total:records.length,page,totalPages:Math.max(1,Math.ceil(records.length/25)),targets:register.targetPerSection,planned:register.total,created:register.records.filter(r=>r.newRecordId).length,authored:production.length,localStaged:production.filter(r=>r.localStudioVersion).length,driveDelivered:production.filter(r=>r.deliveryContentDriveId).length},{headers:{'Cache-Control':'private, no-store'}});
}

import register from '../../../../../docs/redesign/old-design-migration-2026-10-08/editorial-production-register.json';
import productionManifest from '../../../../../docs/editorial-production/m9/content-manifest.json';
import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 if(!await studioSession())return Response.json({error:'Sign in to continue.'},{status:401});
 const p=new URL(request.url).searchParams,q=(p.get('q')||'').slice(0,100).toLowerCase(),kind=p.get('kind')||'',page=Math.min(1000,Math.max(1,Math.floor(Number(p.get('page'))||1)));
 const records=register.records.filter(r=>(!kind||r.kind===kind)&&[r.id,r.title,r.topic,r.journey].join(' ').toLowerCase().includes(q));
 const production: {candidateId:string;recordId:string;localStudioVersion:number|null;deliveryContentDriveId?:string|null}[]=productionManifest;
 const byId=new Map(production.map(row=>[row.candidateId,row]));
 const local=process.env.RIVYA_MIGRATION_LOCAL_SQL==='true';
 let saved:{id:string;version:number;publishedVersion:number;visible:boolean}[];
 try{saved=await studioDb().query('SELECT content_key AS id,version,published_version AS "publishedVersion",visible FROM rivya_content WHERE content_key=ANY($1::text[])',[production.map(row=>row.recordId)]) as typeof saved;}
 catch{return Response.json({error:'Saved production progress is temporarily unavailable. Retry without re-importing.'},{status:503,headers:{'Cache-Control':'private, no-store'}});}
 const savedById=new Map(saved.map(row=>[row.id,row]));
 const entries=records.slice((page-1)*25,page*25).map(row=>{const draft=byId.get(row.id),current=draft&&savedById.get(draft.recordId);return {...row,authoredRecordId:draft?.recordId,stagedVersion:current?.version,editorAvailable:!!current,localEditorAvailable:local&&!!current,newRecordId:!local&&current?current.id:null,state:current?(local?'Saved in isolated local Studio':'Saved in production Studio'):row.state,publication:current?(current.visible&&current.publishedVersion?'Published revision '+current.publishedVersion:'Unpublished draft'):row.publication,deliveryContentDriveId:draft?.deliveryContentDriveId};});
 return Response.json({entries,total:records.length,page,totalPages:Math.max(1,Math.ceil(records.length/25)),targets:register.targetPerSection,planned:register.total,created:local?0:saved.length,published:local?0:saved.filter(r=>r.visible&&r.publishedVersion>0).length,authored:production.length,localStaged:production.filter(r=>r.localStudioVersion).length,driveDelivered:production.filter(r=>r.deliveryContentDriveId).length},{headers:{'Cache-Control':'private, no-store'}});
}

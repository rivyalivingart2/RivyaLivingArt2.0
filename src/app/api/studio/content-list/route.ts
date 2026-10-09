import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {baselineContent} from '@/lib/content-model';
import {editorialAreas} from '@/lib/editorial-workspaces';
import {editorialListQuery} from '@/lib/editorial-list-query';
export const dynamic='force-dynamic';
const json=(d:unknown,status=200)=>Response.json(d,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(request:Request){try{
 if(!await studioSession())return json({error:'Sign in to continue.'},401);
 const p=new URL(request.url).searchParams,get=(k:string)=>(p.get(k)||'').slice(0,150),area=get('area')||'all',sort=get('sort')||'title',page=Math.min(100000,Math.max(1,Math.floor(Number(get('page'))||1)));
 if(!['all',...editorialAreas].includes(area)||!['title','oldest','newest'].includes(sort)||!['','published','hidden','draft','changes'].includes(get('status'))||!['','needs-author','needs-native','duplicate'].includes(get('review'))||!['','present','missing'].includes(get('source'))||!['','cover','alt','seo'].includes(get('missing'))||!['','en','hi','gu'].includes(get('locale')))return json({error:'Choose supported editorial filters.'},400);
 const date=(v:string)=>!v||/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
 if(!date(get('from'))||!date(get('to'))||get('from')&&get('to')&&get('from')>get('to'))return json({error:'Check the date range.'},400);
 const [data]=await studioDb().query(editorialListQuery,[JSON.stringify(baselineContent),area,get('q'),get('status'),get('review'),get('source'),get('missing'),get('topic'),get('journey'),get('locale'),get('author'),get('from'),get('to'),sort,(page-1)*25]);
 return json({...data,page,pageSize:25,totalPages:Math.max(1,Math.ceil(data.total/25))});
 }catch{return json({error:'Editorial list is unavailable. Existing drafts remain saved.'},503);}}

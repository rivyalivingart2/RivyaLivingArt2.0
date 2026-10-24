import {studioSession} from '@/lib/studio-auth';
import {subscriberFilters,subscriberCsv} from '@/lib/subscriber-model';
import {readSubscribers} from '@/lib/subscribers';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
const json=(data:unknown,status=200)=>Response.json(data,{status,headers});
export async function GET(request:Request){
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  if(session.role!=='admin')return json({error:'Administrator access required.'},403);
  const params=new URL(request.url).searchParams,filters=subscriberFilters(params);
  if(!filters||!['','csv'].includes(params.get('format')||''))return json({error:'Check the search, date range and page.'},400);
  const csv=params.get('format')==='csv',result=await readSubscribers(filters,csv);
  if(csv)return new Response(subscriberCsv(result.rows),{headers:{...headers,'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="rivya-subscribers-'+new Date().toISOString().slice(0,10)+'.csv"'}});
  return json(result);
 }catch{return json({error:'Subscribers could not load. Retry without changing your filters.'},503);}
}

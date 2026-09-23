import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
export async function GET(request:Request){
 const headers={'Cache-Control':'private, no-store'};
 try{if(!await studioSession())return Response.json({error:'Sign in to continue.'},{status:401,headers});
 const params=new URL(request.url).searchParams,kind=params.get('kind')||'',key=params.get('key')||'';
 if(!['product','content','media'].includes(kind)||!key||key.length>500)return Response.json({error:'Choose a content record.'},{status:400,headers});
 const revisions=await studioDb()`SELECT version,document,actor,operation,created_at AS "createdAt" FROM rivya_revisions WHERE kind=${kind} AND entity_key=${key} ORDER BY version DESC LIMIT 20`;
 return Response.json({revisions},{headers});
 }catch{return Response.json({error:'Revision history is unavailable. Your current draft is unchanged.'},{status:503,headers});}
}

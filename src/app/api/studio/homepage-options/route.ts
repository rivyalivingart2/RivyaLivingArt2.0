import {studioSession} from '@/lib/studio-auth';
import {publishedProducts} from '@/lib/shop-catalogue';
import {publishedContent} from '@/lib/published-content';
import {publishedMedia} from '@/lib/published-media';
export const dynamic='force-dynamic';
export async function GET(){
 const headers={'Cache-Control':'private, no-store'};
 try{
  if(!await studioSession())return Response.json({error:'Sign in to continue.'},{status:401,headers});
  const [products,content,media]=await Promise.all([publishedProducts(),publishedContent(),publishedMedia()]);
  return Response.json({products:products.map(p=>({id:p.id,name:p.name,category:p.category})),articles:content.filter(d=>d.kind==='article').map(d=>({id:d.id,name:d.title})),media:[...media.values()].map(m=>({path:m.path,alt:m.alt,caption:m.caption})),destinations:[...new Set(['/','/collectible-design','/memory-art','/personal-art','/commission','/journal',...content.map(d=>d.route)])]}, {headers});
 }catch{return Response.json({error:'Published choices are unavailable. Your draft is unchanged.'},{status:503,headers});}
}

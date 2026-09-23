import {isPublicWebsiteAvailable} from '@/lib/public-website';
import {publishedProducts} from '@/lib/shop-catalogue';
import {bespokeDefinition,productDefinition} from '@/lib/inquiry-definition';
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(request:Request){
 if(!isPublicWebsiteAvailable(process.env))return json({error:'This form is unavailable.'},404);
 const url=new URL(request.url),id=url.searchParams.get('product');
 try{
  if(url.searchParams.get('kind')==='bespoke')return json({definition:bespokeDefinition()});
  if(!id||id.length>100)return json({error:'Choose a published piece.'},400);
  const product=(await publishedProducts()).find(p=>p.id===id);
  return product?json({definition:productDefinition(product)}):json({error:'This piece is no longer available. Your entered details remain on this page.'},404);
 }catch{return json({error:'Current options could not be loaded. Your entered details remain here.'},503);}
}

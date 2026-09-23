import 'server-only';
import type {Metadata} from 'next';
import {publishedPage} from './published-content';
import {publishedProducts} from './shop-catalogue';
import {isPublicWebsiteAvailable,isProductionWebsite} from './public-website';
import {approvedProjects} from './project-model';
import {findConcept} from './catalogue';
export const siteOrigin='https://rivyalivingart.com';
export function indexingEnabled(){return process.env.SITE_INDEXABLE==='true'&&isProductionWebsite(process.env)&&isPublicWebsiteAvailable(process.env);}
const staticPages:Record<string,[string,string]>={
 '/':['Art for the way you live','Discover resin furniture, memory art and personal gifts. Choose a piece, share your brief and continue with RivyaLivingArt.'],
 '/collectible-design':['Furniture & spatial art','Explore resin furniture and sculptural objects, then discuss proportions, materials and your space with the atelier.'],
 '/memory-art':['Memory art','Explore forms for flowers and personal keepsakes. Share their story and condition to begin a preservation conversation.'],
 '/personal-art':['Personal art & gifts','Discover personal resin gifts with room for your colour direction, message and occasion.'],
 '/commission':['Begin your piece','Choose a starting design and share a product-specific brief with RivyaLivingArt.'],
 '/journal':['The journal','Original notes on spaces, materials and preparing a thoughtful commission.'],
 '/search':['Find your piece','Search the published RivyaLivingArt collection.'],
 '/portfolio':['Projects in context','Explore approved RivyaLivingArt project stories when their details and photographs are available.']
};
export async function routeMetadata(route:string):Promise<Metadata>{
 if(!isPublicWebsiteAvailable(process.env))return {title:'Unavailable',robots:{index:false,follow:false}};
 let [title,description]=staticPages[route]||['',''];let image='/brand/rivyalivingart-logo-horizontal-transparent.png',imageAlt='RivyaLivingArt';
 if(route.startsWith('/pieces/')){
  const slug=route.slice('/pieces/'.length),products=await publishedProducts();
  const p=products.find(p=>p.slug===slug)||products.find(p=>p.id===findConcept(slug)?.id);
  if(p){route='/pieces/'+p.slug;title=p.name;description=p.story.slice(0,170);image=p.scene||p.image;imageAlt=p.sceneAlt||p.imageAlt||p.name;}
 }else if(route.startsWith('/portfolio/')){
  const p=approvedProjects.find(p=>'/portfolio/'+p.slug===route&&p.approvalRecord);
  if(p){title=p.title;description=p.description;image=p.image;imageAlt=p.imageAlt;}
 }else if(!title){const d=await publishedPage(route);if(d){title=d.title;description=d.description;image=d.image||image;imageAlt=d.imageAlt||imageAlt;}}
 if(!title)return {title:'Page unavailable',robots:{index:false,follow:false}};
 const index=indexingEnabled()&&route!=='/search'&&(route!=='/portfolio'||approvedProjects.some(p=>!!p.approvalRecord));
 return {title,description,alternates:{canonical:siteOrigin+route},robots:{index,follow:index},openGraph:{type:route.startsWith('/journal/')?'article':'website',title,description,url:siteOrigin+route,siteName:'RivyaLivingArt',images:[{url:siteOrigin+image,alt:imageAlt}]},twitter:{card:'summary_large_image',title,description,images:[{url:siteOrigin+image,alt:imageAlt}]}};
}

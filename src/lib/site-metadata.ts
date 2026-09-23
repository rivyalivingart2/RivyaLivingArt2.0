import 'server-only';
import type {Metadata} from 'next';
import {publishedPage} from './published-content';
import {publishedProducts} from './shop-catalogue';
import {isPublicWebsiteAvailable} from './public-website';
export const siteOrigin='https://rivyalivingart.com';
export function indexingEnabled(){return process.env.SITE_INDEXABLE==='true'&&(process.env.RIVYA_ENV==='production'||process.env.VERCEL_ENV==='production')&&isPublicWebsiteAvailable(process.env);}
const staticPages:Record<string,[string,string]>={
 '/':['Art for the way you live','Discover resin furniture, memory art and personal gifts. Choose a piece, share your brief and continue with RivyaLivingArt.'],
 '/collectible-design':['Furniture & spatial art','Explore resin furniture and sculptural objects, then discuss proportions, materials and your space with the atelier.'],
 '/memory-art':['Memory art','Explore forms for flowers and personal keepsakes. Share their story and condition to begin a preservation conversation.'],
 '/personal-art':['Personal art & gifts','Discover personal resin gifts with room for your colour direction, message and occasion.'],
 '/commission':['Begin your piece','Choose a starting design and share a product-specific brief with RivyaLivingArt.'],
 '/journal':['The journal','Original notes on spaces, materials and preparing a thoughtful commission.'],
 '/search':['Find your piece','Search the published RivyaLivingArt collection.']
};
export async function routeMetadata(route:string):Promise<Metadata>{
 if(!isPublicWebsiteAvailable(process.env))return {title:'Unavailable',robots:{index:false,follow:false}};
 let [title,description]=staticPages[route]||['',''];let image='/media/product-scene-001-16x9.webp';
 if(route.startsWith('/pieces/')){const p=(await publishedProducts()).find(p=>'/pieces/'+p.slug===route);if(p){title=p.name;description=p.story.slice(0,170);image=p.scene||p.image;}}
 else if(!title){const d=await publishedPage(route);if(d){title=d.title;description=d.description;image=d.image||image;}}
 if(!title)return {title:'Page unavailable',robots:{index:false,follow:false}};
 const index=indexingEnabled()&&route!=='/search';
 return {title,description,alternates:{canonical:siteOrigin+route},robots:{index,follow:index},openGraph:{type:route.startsWith('/journal/')?'article':'website',title,description,url:siteOrigin+route,siteName:'RivyaLivingArt',images:[{url:siteOrigin+image}]},twitter:{card:'summary_large_image',title,description,images:[siteOrigin+image]}};
}

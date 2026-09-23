import type {MetadataRoute} from 'next';
import {publishedContent} from '@/lib/published-content';
import {publishedProducts} from '@/lib/shop-catalogue';
import {indexingEnabled,siteOrigin} from '@/lib/site-metadata';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 if(!indexingEnabled())return [];
 const [products,content]=await Promise.all([publishedProducts(),publishedContent()]);
 return ['/', '/collectible-design','/memory-art','/personal-art','/commission','/journal',...products.map(p=>'/pieces/'+p.slug),...content.map(d=>d.route)].map(route=>({url:siteOrigin+route}));
}

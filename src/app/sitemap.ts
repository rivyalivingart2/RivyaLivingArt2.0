import type {MetadataRoute} from 'next';
import {publishedContent} from '@/lib/published-content';
import {publishedProducts} from '@/lib/shop-catalogue';
import {indexingEnabled,siteOrigin} from '@/lib/site-metadata';
import {approvedProjects} from '@/lib/project-model';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 if(!indexingEnabled())return [];
 const [products,content]=await Promise.all([publishedProducts(),publishedContent()]);
 const projects=approvedProjects.filter(p=>!!p.approvalRecord);
 return [...new Set(['/', '/collectible-design','/memory-art','/personal-art','/commission','/journal',...products.map(p=>'/pieces/'+p.slug),...content.map(d=>d.route),...(projects.length?['/portfolio',...projects.map(p=>'/portfolio/'+p.slug)]:[])])].map(route=>({url:siteOrigin+route}));
}

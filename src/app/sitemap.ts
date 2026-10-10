import type {MetadataRoute} from 'next';
import {publishedContent} from '@/lib/published-content';
import {publishedProducts} from '@/lib/shop-catalogue';
import {indexingEnabled,siteOrigin} from '@/lib/site-metadata';
import {approvedProjects} from '@/lib/project-model';
import {isIndexablePublicPath} from '@/lib/public-indexing';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 if(!indexingEnabled())return [];
 const [products,content]=await Promise.all([publishedProducts(),publishedContent()]);
 const projects=approvedProjects.filter(p=>!!p.approvalRecord);
 const hasPortfolio=projects.length>0||content.some(d=>d.editorial?.kind==='portfolio');
 return [...new Set(['/', '/collectible-design','/memory-art','/personal-art','/commission','/journal',...products.map(p=>'/pieces/'+p.slug),...content.map(d=>d.route),...(hasPortfolio?['/portfolio',...projects.map(p=>'/portfolio/'+p.slug)]:[]),...(content.some(d=>d.editorial?.kind==='testimonial')?['/testimonials']:[])])].filter(route=>isIndexablePublicPath(route)&&(route!=='/portfolio'||hasPortfolio)).map(route=>({url:siteOrigin+route}));
}

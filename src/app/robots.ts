import type { MetadataRoute } from "next";
import {indexingEnabled,siteOrigin} from '@/lib/site-metadata';

// Indexing preference, not access control. Keep entire prelaunch app out of search.
export default function robots(): MetadataRoute.Robots {
  return indexingEnabled()?{rules:{userAgent:'*',allow:'/',disallow:['/studio','/api/','/inquiry/','/preview/','/search','/pieces/*/customize']},sitemap:siteOrigin+'/sitemap.xml'}:{ rules: { userAgent: "*", disallow: "/" } };
}

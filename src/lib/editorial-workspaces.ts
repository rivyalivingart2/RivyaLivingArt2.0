import type {ContentDocument} from './content-model';
export const editorialAreas=['journal','portfolio','testimonials','faqs','pages','landing-pages'] as const;
export type EditorialArea=typeof editorialAreas[number];
export const editorialAreaLabels:Record<EditorialArea,string>={journal:'Journal',portfolio:'Portfolio',testimonials:'Testimonials',faqs:'FAQs',pages:'Pages','landing-pages':'Landing pages'};
export function inEditorialArea(area:EditorialArea|'all',d:ContentDocument){
 if(area==='all')return true;
 if(area==='faqs'&&d.id==='page:faq')return true;
 if(area==='journal')return d.kind==='article';
 if(area==='landing-pages')return !!d.landing;
 if(area==='pages')return d.kind==='page'&&!d.editorial&&!d.landing;
 return d.editorial?.kind===(area==='testimonials'?'testimonial':area==='faqs'?'faq':'portfolio');
}
/** New unsaved records only; no source text, customer identity or approval is invented. */
export function newEditorialDocument(area:EditorialArea,uuid:string):ContentDocument{
 const suffix=uuid.slice(0,8),kind=area==='portfolio'?'portfolio':area==='testimonials'?'testimonial':area==='faqs'?'faq':null;
 return {id:(kind?'editorial':area==='journal'?'article':'custom-page')+':'+uuid,kind:area==='journal'?'article':'page',route:'/'+(kind?(kind==='testimonial'?'testimonials':kind):area==='journal'?'journal':'p')+'/new-'+suffix,title:'New '+({journal:'journal article',portfolio:'portfolio story',testimonials:'testimonial',faqs:'FAQ',pages:'page','landing-pages':'landing page'}[area]),eyebrow:'From the atelier',description:'',sections:area==='landing-pages'?[]:[{id:'intro',heading:'Begin here',paragraphs:['']}],...(kind?{editorial:{schemaVersion:1,kind,classification:kind==='portfolio'?'concept':kind==='testimonial'?'fictional':'guidance'}}:{}),...(area==='landing-pages'?{landing:{schemaVersion:1,blocks:[{id:'opening',type:'hero',enabled:true,heading:'Opening',paragraphs:[]}]}}:{})};
}

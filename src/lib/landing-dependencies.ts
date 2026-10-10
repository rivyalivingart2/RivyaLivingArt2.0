import {applyReviewedTranslation,translationStatus} from './translation-review';
import {publicDiscovery,type DiscoveryMetadata} from './editorial-metadata';
import {bodyLinks} from './editorial-body';
import {baselineContent,validContent,type ContentDocument,type ContentSection} from './content-model';
import {editorialPublicationIssues,publicEditorial,type PublicEditorialRecord} from './editorial-record-model';
import {landingLimit,type LandingBlock} from './landing-model';
import {validPageMedia} from './editorial-media-model';
import type {DependencySource} from './homepage-dependencies';
import type {EditorialUsage,HomeDependency} from './homepage-model';
export type LandingEntry={id:string;route:string;title:string;description:string;eyebrow:string;sections:ContentSection[];image?:EditorialUsage;editorial?:PublicEditorialRecord;discovery?:DiscoveryMetadata;languages?:string[];localizedCopy?:Partial<Record<'hi'|'gu',Pick<LandingEntry,'title'|'description'|'eyebrow'|'sections'|'image'|'editorial'>>>};
export type LandingSnapshot={entries:Record<string,LandingEntry[]>;productIds:Record<string,string[]>};
function entryCopy(d:ContentDocument&{imagePosition?:string;availableEditorialLanguages?:string[]}):LandingEntry{
 const [x,y]=(d.imagePosition||'50% 50%').split(' ').map(n=>parseFloat(n));
 const discovery=publicDiscovery(d);
 return {discovery:discovery.metadata,languages:d.availableEditorialLanguages||discovery.languages,id:d.id,route:d.route,title:d.title,description:d.description,eyebrow:d.eyebrow,sections:d.sections.filter(s=>s.enabled!==false).map(s=>({id:s.id,heading:s.heading,paragraphs:s.paragraphs,checklist:s.checklist,body:s.body,group:s.group,policyHref:s.policyHref})),...(d.headerImage?{image:d.headerImage}:d.image?{image:{path:d.image,alt:d.imageAlt||d.title,caption:'Design visualization',desktop:{x,y,ratio:'3/2'},mobile:{x,y,ratio:'4/5'}} as EditorialUsage}:{}),...(d.editorial?{editorial:publicEditorial(d.editorial)}:{})};
}
/** Capture only currently reviewed public text; exact previews never consult newer records. */
export function publicEntry(d:ContentDocument&{imagePosition?:string;availableEditorialLanguages?:string[]}):LandingEntry{
 const entry=entryCopy(d),localizedCopy:NonNullable<LandingEntry['localizedCopy']>={};
 for(const locale of ['hi','gu'] as const)if(translationStatus(d,locale).state==='reviewed'){
  const translated=entryCopy({...applyReviewedTranslation(d,locale),imagePosition:d.imagePosition});
  const {title,description,eyebrow,sections,image,editorial}=translated;
  localizedCopy[locale]={title,description,eyebrow,sections,image,editorial};
 }
 return {...entry,...(Object.keys(localizedCopy).length?{localizedCopy}:{})};
}
/** Resolve published records once. Exact previews store these copies and fingerprints. */
export function compileLanding(d:ContentDocument,source:DependencySource){
 const result:LandingSnapshot={entries:{},productIds:{}},dependencies:HomeDependency[]=[],issues:string[]=[],mediaPaths:string[]=[],hrefs:string[]=[];
 if(!d.landing&&!d.editorial?.gallery?.length)return {snapshot:result,dependencies,issues,mediaPaths,hrefs};
 const docs=source.content.filter(r=>validContent(r.document,baselineContent.find(b=>b.id===r.key))&&!editorialPublicationIssues(r.document as ContentDocument).length).map(r=>{const doc=r.document as ContentDocument,m=source.media.find(m=>m.key===doc.image)?.document as {focalX?:number;focalY?:number}|undefined;return {...doc,...(m?{imagePosition:(m.focalX??50)+'% '+(m.focalY??50)+'%'}:{})};});
 const add=(kind:HomeDependency['kind'],key:string)=>{const row=source[kind==='product'?'products':kind==='media'?'media':'content'].find(r=>r.key===key);if(row&&!dependencies.some(r=>r.kind===kind&&r.key===key))dependencies.push({kind,key,version:row.version,fingerprint:row.fingerprint});};
 const image=(usage:EditorialUsage)=>{const row=source.media.find(r=>r.key===usage.path&&validPageMedia(r.document));if(row){add('media',row.key);mediaPaths.push(row.key);}else issues.push('Assigned image is not published: '+usage.path);};
 for(const usage of d.editorial?.gallery||[])image(usage);
 for(const b of d.landing?.blocks.filter(b=>b.enabled)||[]){
  for(const usage of [...(b.image?[b.image]:[]),...(b.gallery||[])])image(usage);
  if(['videoHero','videoStory'].includes(b.type)&&!b.film)issues.push(b.heading+': select a verified film.');
  if(b.action){const target=b.action.href.split('#')[0],page=docs.find(p=>p.route===target);if(page)add('content',page.id);}
  if(b.type==='productGrid'){
   const ids=b.mode==='category'?source.products.filter(r=>(r.document as {category?:string}).category===b.category).slice(0,b.limit||12).map(r=>r.key):(b.ids||[]);
   result.productIds[b.id]=ids;for(const id of ids)add('product',id);
   if(!ids.length)issues.push(b.heading+': select published products or a category.');
   continue;
  }
  const accepts=(entry:ContentDocument)=>b.type==='journalGrid'?entry.kind==='article':b.type==='portfolioGrid'?entry.editorial?.kind==='portfolio':b.type==='testimonial'||b.type==='testimonialGrid'?entry.editorial?.kind==='testimonial':b.type==='faqPicker'?entry.editorial?.kind==='faq':b.type==='collectionGrid'?['/collectible-design','/memory-art','/personal-art'].includes(entry.route):false;
  let picked=docs.filter(accepts);
  if(b.mode==='recent')picked.sort((a,b)=>{const date=(id:string)=>Date.parse(source.content.find(r=>r.key===id)?.publishedAt||'')||0;return date(b.id)-date(a.id)||a.id.localeCompare(b.id);});
  if(b.mode==='category')picked=picked.filter(p=>p.eyebrow===b.category);
  if(b.mode!=='recent'&&b.mode!=='category')picked=(b.ids||[]).flatMap(id=>picked.filter(p=>p.id===id));
  picked=picked.slice(0,b.limit||landingLimit(b.type));
  const entries=picked.map(publicEntry);
  // Existing FAQ page sections are addressable by stable IDs without rewriting that document.
  if(b.type==='faqPicker')for(const id of b.ids||[]){if(!id.startsWith('page:faq#'))continue;const faq=docs.find(p=>p.id==='page:faq'),section=faq?.sections.find(s=>s.id===id.slice(9)&&s.enabled!==false);if(faq&&section){const entry=publicEntry(faq);const sectionEntry=(copy:LandingEntry)=>{const selected=copy.sections.find(s=>s.id===section.id)!;return {...copy,id,route:'/faq#'+section.id,title:selected.heading,description:'',eyebrow:selected.group||'Questions',sections:[selected]};};const selected=sectionEntry(entry);selected.localizedCopy=Object.fromEntries(Object.entries(entry.localizedCopy||{}).map(([locale,copy])=>[locale,((c)=>({title:c.title,description:c.description,eyebrow:c.eyebrow,sections:c.sections}))(sectionEntry({...entry,...copy}))]));entries.push(selected);add('content',faq.id);}}
  if(!b.mode||['manual','featured'].includes(b.mode))entries.sort((a,c)=>(b.ids||[]).indexOf(a.id)-(b.ids||[]).indexOf(c.id));
  result.entries[b.id]=entries.slice(0,b.limit||landingLimit(b.type));
  for(const entry of result.entries[b.id])hrefs.push(...entry.sections.flatMap(s=>[...bodyLinks(s.body),...(s.policyHref?[s.policyHref]:[])]),...(entry.editorial?.policyHref?[entry.editorial.policyHref]:[]));
  for(const p of picked){add('content',p.id);const e=publicEntry(p);if(e.image)image(e.image);for(const usage of e.editorial?.gallery||[])image(usage);}
  if(['faqPicker','collectionGrid','portfolioGrid','journalGrid','testimonial','testimonialGrid'].includes(b.type)){
   for(const id of b.ids||[])if(!entries.some(e=>e.id===id))issues.push(b.heading+': reference '+id+' is unavailable or has the wrong kind.');
   if(!entries.length)issues.push(b.heading+': no published records selected. Disable this block until content is ready.');
  }
 }
 return {snapshot:result,dependencies,issues,mediaPaths:[...new Set(mediaPaths)],hrefs};
}
export function landingProductIds(d:ContentDocument,source:DependencySource){return d.landing?.blocks.filter(b=>b.enabled&&b.type==='productGrid').flatMap(b=>b.mode==='category'?source.products.filter(r=>(r.document as {category?:string}).category===b.category).slice(0,b.limit||12).map(r=>r.key):b.ids||[])||[];}
export function landingActions(blocks:LandingBlock[]){return blocks.filter(b=>b.enabled&&b.action).map(b=>b.action!.href);}

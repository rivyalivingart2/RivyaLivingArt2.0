import type {HomeEditorialSelection} from './home-editorial-model';
import {baselineContent,validContent,type ContentDocument} from './content-model';
import {editorialPublicationIssues} from './editorial-record-model';
import {publicEntry} from './landing-dependencies';
import {validPageMedia} from './editorial-media-model';
import type {DependencySource} from './homepage-dependencies';
import type {HomeDependency} from './homepage-model';
import type {HomeReferenceSnapshot,ReferencePortfolio,ReferenceFeedback} from './home-reference-model';
/** Explicit published selections only. No automatic source replacement or invented attribution. */
export function captureHomeEditorial(source:DependencySource,selection?:HomeEditorialSelection){
 const portfolio:ReferencePortfolio[]=[],feedback:ReferenceFeedback[]=[],dependencies:HomeDependency[]=[],mediaPaths:string[]=[],issues:string[]=[];
 const depend=(kind:HomeDependency['kind'],key:string)=>{const row=source[kind==='media'?'media':'content'].find(r=>r.key===key);if(row&&!dependencies.some(d=>d.kind===kind&&d.key===key))dependencies.push({kind,key,version:row.version,fingerprint:row.fingerprint});};
 for(const area of ['portfolio','testimonials'] as const)for(const id of selection?.[area]||[]){
  const row=source.content.find(r=>r.key===id),d=row?.document as ContentDocument|undefined,kind=area==='portfolio'?'portfolio':'testimonial';
  if(!row||!d||d.id!==id||!validContent(d,baselineContent.find(b=>b.id===id))||d.editorial?.kind!==kind||editorialPublicationIssues(d).length){issues.push('Selected homepage '+kind+' is not available: '+id);continue;}
  depend('content',id);
  const originalMedia=source.media.find(m=>m.key===d.image)?.document as {focalX?:number;focalY?:number}|undefined;
  const entry=publicEntry({...d,...(originalMedia?{imagePosition:(originalMedia.focalX??50)+'% '+(originalMedia.focalY??50)+'%'}:{})});
  if(entry.image){const media=source.media.find(r=>r.key===entry.image!.path&&validPageMedia(r.document));if(media){depend('media',media.key);mediaPaths.push(media.key);}else{issues.push('Selected homepage image is not published: '+entry.image.path);delete entry.image;}}
  if(area==='portfolio')portfolio.push({id,classification:d.editorial.classification==='concept'?'concept':'evidenced-project',title:entry.title,description:entry.description,href:entry.route,image:entry.image,localizedCopy:Object.fromEntries(Object.entries(entry.localizedCopy||{}).map(([locale,c])=>[locale,{title:c.title,description:c.description,image:entry.image?c.image:undefined}]))});
  else {
   const quote=(sections:typeof entry.sections)=>(sections.find(s=>s.id==='sample')||sections[0])?.paragraphs[0]||'';
   if(!quote(entry.sections).trim()){issues.push('Selected homepage testimonial has no public statement: '+id);continue;}
   feedback.push({id,classification:d.editorial.classification==='fictional'?'fictional-sample':'approved-feedback',quote:quote(entry.sections),attribution:entry.editorial?.attribution||'',href:entry.route,localizedCopy:Object.fromEntries(Object.entries(entry.localizedCopy||{}).map(([locale,c])=>[locale,{quote:quote(c.sections),attribution:c.editorial?.attribution||''}]))});
  }
 }
 return {portfolio,feedback,dependencies,mediaPaths:[...new Set(mediaPaths)],issues};
}
export function localizeHomeEditorial(reference:HomeReferenceSnapshot,locale:string){
 if(locale!=='hi'&&locale!=='gu')return reference;
 return {...reference,...(reference.portfolio?{portfolio:reference.portfolio.map(p=>({...p,...p.localizedCopy?.[locale]}))}:{}),...(reference.feedback?{feedback:reference.feedback.map(p=>({...p,...p.localizedCopy?.[locale]}))}:{})};
}

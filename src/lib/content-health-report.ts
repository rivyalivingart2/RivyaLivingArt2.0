import {translationStatus} from './translation-review';
import {issueField} from './content-issues';
import {contentHealthRows,type ContentHealthEntry,type ProductHealthEntry,type MediaHealthEntry,type HealthRow} from './content-health';
import {baselineContent,validContent} from './content-model';
import {baselineProducts,validProduct} from './shop-model';
import {validPageMedia,validEditorialMedia,validPublishedEditorialMedia,isEditorialPath} from './editorial-media-model';
import {editorialSlots} from './editorial-slots';
import {describeHrefProblem,type SiteSettings} from './site-settings-model';
import {studioRecordHref} from './studio-record-links';
export type HealthContext={settings:SiteSettings;owners:Record<string,string>};
export type HealthIssue={severity:'Blocker'|'Advisory';reason:string;href:string};
export type DetailedHealthRow=HealthRow&{validation:string;editorial:string;media:string;translation:string;owner:string;issues:HealthIssue[]};
const safeValid=(check:()=>boolean)=>{try{return check();}catch{return false;}};
export function contentHealthReport(content:ContentHealthEntry[],products:ProductHealthEntry[],media:MediaHealthEntry[],context:HealthContext):DetailedHealthRow[]{
 const visibleContent=content.filter(e=>e.published&&e.visible),visibleProducts=products.filter(e=>e.published&&e.visible);
 const publicImages=new Set(media.filter(e=>e.published).map(e=>e.media.path));
 const publicDocument=(path:string)=>visibleContent.some(e=>e.published!.route===path);
 const linkProblem=(href:string)=>{
  const syntax=describeHrefProblem(href);if(syntax)return syntax;
  const path=href.split(/[?#]/)[0];
  if(!path.startsWith('/'))return null;
  if(content.some(e=>e.document.route===path)&&!publicDocument(path))return `Public link points to unpublished content: ${path}`;
  if(path.startsWith('/journal/')&&!publicDocument(path))return `Journal destination is not published: ${path}`;
  if(path.startsWith('/pieces/')&&!visibleProducts.some(e=>path==='/pieces/'+e.published!.slug||path==='/pieces/'+e.published!.slug+'/customize'))return `Piece destination is not published: ${path}`;
  return null;
 };
 const rows:DetailedHealthRow[]=contentHealthRows(content,products,media).map(row=>{
  const issues:HealthIssue[]=row.readiness==='Needs review'?[{severity:'Advisory',reason:row.detail,href:row.href}]:[];
  let editorialState='Review not recorded';
  let valid=true,mediaState='Not applicable',translation='Not applicable';
  if(row.area==='Content'){
   const d=content.find(e=>e.document.id===row.id)!.document;
   valid=safeValid(()=>validContent(d,baselineContent.find(b=>b.id===d.id)));
   if(d.editorial)editorialState=d.editorial.classification==='genuine'?(d.editorial.evidence?'Approval fields recorded; evidence not independently verified':'Approval evidence missing'):d.editorial.classification==='guidance'?'Guidance source requires review':'Disclosed '+d.editorial.classification+'; no customer claim';
   const imagePaths=editorialSlots(d).flatMap(s=>s.path?[s.path]:[]);
   mediaState=imagePaths.length?(imagePaths.every(p=>publicImages.has(p))?'Published metadata; visual review unrecorded':'Missing published metadata'):'No image selected';
   if(d.image&&content.filter(e=>e.document.image===d.image).length>1)issues.push({severity:'Advisory',reason:'Editorial cover is reused on other documents. Review visual variety.',href:studioRecordHref('content',d.id,'image')});
   if(imagePaths.some(p=>!publicImages.has(p)))issues.push({severity:'Advisory',reason:'Selected image metadata is not published; the public image may be omitted.',href:studioRecordHref('content',d.id,d.homepage?'section-'+(d.homepage.sections.find(s=>s.image&&!publicImages.has(s.image.path))?.id||'hero'):'image')});
   for(const reason of (d.homeSnapshot||d.pageSnapshot)?.issues||[])issues.push({severity:'Blocker',reason,href:studioRecordHref('content',d.id,issueField(d,reason))});
   const hrefs=d.homepage?[{href:d.homepage.primary.href,field:'title'},{href:d.homepage.secondary.href,field:'title'},...d.homepage.sections.flatMap(b=>[...(b.action?[{href:b.action.href,field:'section-'+b.id}]:[]),...(b.items?.flatMap(i=>i.action?[{href:i.action.href,field:'section-'+b.id}]:[])||[])])]:[];
   for(const action of hrefs){const issue=linkProblem(action.href);if(issue)issues.push({severity:'Blocker',reason:issue,href:studioRecordHref('content',d.id,action.field)});}
   for(const b of d.homepage?.sections||[])if(b.image&&!b.image.mobile)issues.push({severity:'Blocker',reason:`${d.sections.find(s=>s.id===b.id)?.heading||b.id}: mobile crop missing`,href:studioRecordHref('content',d.id,'section-'+b.id)});
   translation=context.settings.localization.enabled?context.settings.localization.enabledLocales.filter(l=>l!=='en').map(l=>{
    const state=translationStatus(d,l);return l+': '+(state.state==='missing'?'English fallback':state.state)+' · '+(state.total-state.missing)+'/'+state.total+' fields';
   }).join(' · ')||'English only':'Language switcher disabled';

  }else if(row.area==='Catalogue'){
   const p=products.find(e=>e.product.id===row.id)!.product;valid=safeValid(()=>validProduct(p,baselineProducts.find(b=>b.id===p.id)||p));
   mediaState=publicImages.has(p.image)?'Published primary metadata':'Missing primary metadata';
   translation=context.settings.localization.enabled?context.settings.localization.enabledLocales.filter(l=>l!=='en').map(l=>l+': '+(p.translations?.[l]?'Review field coverage':'English fallback')).join(' · ')||'English only':'Language switcher disabled';
  }else{
   const m=media.find(e=>e.media.path===row.id)!;valid=safeValid(()=>validPageMedia(m.media)||validEditorialMedia(m.media));mediaState=isEditorialPath(m.media.path)?(m.published?'Published reviewed editorial image':validPublishedEditorialMedia(m.media)?'Reviewed; not published':'Needs visual review'):(m.published?'Published metadata; visual review unrecorded':'Unpublished metadata');if(isEditorialPath(m.media.path))row.href='/studio/media';
  }
  if(!valid)issues.unshift({severity:'Blocker',reason:'The saved record fails its content contract. Open it to repair the required fields.',href:row.href});
  return {...row,validation:valid?'Valid structure':'Blocking issue',editorial:editorialState,media:mediaState,translation,owner:context.owners[row.area+':'+row.id]||'Unassigned',issues};
 });
 for(const [menu,items] of Object.entries(context.settings.navigation))for(const item of items.filter(i=>i.visible)){
  const problem=linkProblem(item.href);if(!problem)continue;
  const target=rows.find(r=>r.area==='Content'&&content.find(e=>e.document.id===r.id)?.document.route===item.href.split(/[?#]/)[0]);
  const href=target?.href||'/studio/navigation?'+new URLSearchParams({menu,record:item.id,field:'href'});
  if(target)target.issues.push({severity:'Blocker',reason:`${menu} / ${item.label.en}: ${problem}`,href});
  else rows.push({id:item.id,area:'Content',name:'Navigation: '+item.label.en,publication:'Published',draft:'Aligned',readiness:'Needs review',detail:problem,href,validation:'Blocking destination',editorial:'Review not recorded',media:'Not applicable',translation:'Navigation labels',owner:'Administrator',issues:[{severity:'Blocker',reason:problem,href}]});
 }
 return rows;
}

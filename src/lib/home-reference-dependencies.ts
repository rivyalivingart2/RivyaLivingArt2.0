import {baselineContent,localizeContent,validContent,type ContentDocument} from './content-model';
import {compilePageSnapshot} from './page-dependencies';
import type {DependencySource} from './homepage-dependencies';
import type {HomeDependency} from './homepage-model';
import type {Locale} from './site-settings-model';
import type {HomeReferenceSnapshot} from './home-reference-model';
import {pageDesignSource,pageDesignIssues,sharedPageRoutes,type PageDesigns} from './page-design-model';
const routes=['/architects','/our-story','/commission'];
/** Immutable read adapter: only current validated publications; no old facts/defaults. */
export function compileHomeReference(source:DependencySource,designs:PageDesigns={}):HomeReferenceSnapshot{
 const pages:HomeReferenceSnapshot['pages']=[],dependencies:HomeDependency[]=[],issues:string[]=[];
 const designed=Object.entries(designs),required=new Set(designed.flatMap(([route,design])=>[route,...sharedPageRoutes(design)]));
 for(const route of new Set([...routes,...required])){
  const row=source.content.find(r=>validContent(r.document,baselineContent.find(d=>d.id===r.key))&&r.document.id===r.key&&r.document.route===route);
  if(!row){if(required.has(route))issues.push(route+': Published page is unavailable.');continue;}
  const d=row.document as ContentDocument,pageSnapshot=compilePageSnapshot(d,source,{includeCatalogue:designed.some(([key])=>key===route)});
  pages.push({document:{...d,pageSnapshot},version:row.version});
  const design=designed.find(([key])=>key===route)?.[1],summary=pageDesignSource(d);
  if(design&&summary)issues.push(...pageDesignIssues(design,summary).map(issue=>route+': '+issue));
  for(const dep of [{kind:'content' as const,key:row.key,version:row.version,fingerprint:row.fingerprint},...pageSnapshot.dependencies])if(!dependencies.some(other=>other.kind===dep.kind&&other.key===dep.key))dependencies.push(dep);
  issues.push(...pageSnapshot.issues.map(issue=>route+': '+issue));
 }
 return {schemaVersion:1,pages,dependencies,issues:[...new Set(issues)]};
}
export function localizeHomeReference(reference:HomeReferenceSnapshot,locale:Locale):HomeReferenceSnapshot{return {...reference,pages:reference.pages.map(p=>({...p,document:localizeContent(p.document,locale)}))};}

import {sharedCopyId,sharedCopyFields,copyFieldId} from './shared-copy-model';
import type {ContentDocument} from './content-model';
import {validContent,baselineContent} from './content-model';
import {bodyLinks,safeEditorialHref,validEditorialBody} from './editorial-body';
import {validUsage} from './homepage-model';
export type ContentIssue={message:string;field:string};
export function issueField(d:ContentDocument,message:string){
 for(const s of d.sections)if(message.startsWith(s.id+':')||[...bodyLinks(s.body),s.policyHref,s.action?.href].some(h=>h&&message.includes(h)))return 'section-'+s.id;
 for(const s of d.homepage?.sections||[])if(message.startsWith(s.id+':')||[s.action?.href,...(s.items||[]).map(i=>i.action?.href),...(s.productIds||[]),...(s.articleIds||[])].some(v=>v&&message.includes(v)))return 'section-'+s.id;
 if(message.startsWith('Product ')&&d.relatedProductIds?.some(id=>message.includes(id)))return 'relatedProductIds';
 return /image/i.test(message)?'image':'title';
}
export function contentIssues(d:ContentDocument):ContentIssue[]{
 const issues:ContentIssue[]=[];
 const add=(field:string,message:string)=>issues.push({field,message});
 if(!d.title.trim()||d.title.length>120)add('title','Enter a title of up to 120 characters.');
 if(!d.eyebrow.trim()||d.eyebrow.length>100)add('eyebrow','Enter an eyebrow of up to 100 characters.');
 if(d.id===sharedCopyId)for(const f of sharedCopyFields){const b=d.sections.find(s=>s.id===copyFieldId(f.id));if(!b?.paragraphs[0]?.trim()||b.paragraphs[0].length>300)add('section-'+copyFieldId(f.id),f.label+': enter a label of up to 300 characters.');}
 if(d.homepage){for(const [key,a] of [['primary',d.homepage.primary],['secondary',d.homepage.secondary]] as const)if(!a.label.trim()||!safeEditorialHref(a.href))add(key,'Check the '+key+' button label and internal destination.');for(const b of d.homepage.sections)if(b.image&&!validUsage(b.image))add('section-'+b.id,'Choose an approved image, description and both crops for '+b.id+'.');}
 if(!d.description.trim()||d.description.length>300)add('description','Enter an introduction of up to 300 characters.');
 if(d.image&&!d.imageAlt?.trim())add('imageAlt','Describe the header image.');
 for(const s of d.sections){const field='section-'+s.id;
  if(!s.paragraphs.length&&!s.checklist?.length||s.paragraphs.some(p=>!p.trim()||p.length>2500))add(field,'Complete the text in '+s.heading+'.');
  if(!s.heading.trim())add(field,'Add a heading for '+s.id+'.');
  if(s.body&&!validEditorialBody(s.body))add(field,s.heading+': check formatted text and internal links.');
  if(s.image&&!validUsage(s.image))add(field,s.heading+': choose an approved image, description and both crops.');
  if([s.policyHref,s.action?.href].some(h=>h&&!safeEditorialHref(h)))add(field,s.heading+': use a valid internal destination.');
 }
 if(!validContent(d,baselineContent.find(b=>b.id===d.id)||d)&&!issues.length)add('title','Check required text, unique section IDs, field limits and approved references.');
 return issues;
}

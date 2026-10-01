import type {ContentDocument} from './content-model';
import type {HomeSectionType} from './homepage-model';
/** Templates carry structure only. Conditional factual stories are never fabricated. */
export const chapterTemplates:{key:string;label:string;type:HomeSectionType;needs:string}[]=[
 {key:'manifesto',label:'Manifesto',type:'story',needs:'Reviewed brand statement'},
 {key:'large-format',label:'Large format',type:'story',needs:'Room-scale guidance and approved illustration'},
 {key:'atelier',label:'Atelier introduction',type:'story',needs:'Verified making philosophy; authentic people only'},
 {key:'in-the-room',label:'In the room',type:'story',needs:'Reviewed scene; label concept visualizations'},
 {key:'bespoke',label:'Bespoke',type:'story',needs:'Guidance for a useful brief'},
 {key:'principles',label:'Why the atelier',type:'story',needs:'Evidence-backed principles'},
 {key:'selected',label:'Selected pieces',type:'selected',needs:'Existing published product references'},
 {key:'categories',label:'Category discovery',type:'categories',needs:'Existing category display order'},
 {key:'steps',label:'Process sequence',type:'steps',needs:'Verified stages and actions'},
 {key:'journal',label:'Journal selection',type:'journal',needs:'Existing published articles'},
 {key:'invitation',label:'Closing invitation',type:'invitation',needs:'Reviewed invitation and destination'}
];
export const conditionalChapters=[
 ['Furniture concepts','Reviewed offering and concept provenance'],['Recent commissions','Published genuine project and permissions'],['Customer words','Genuine attributed quote and permission'],['Workshops','Current service and verified schedule'],['Print studio','Confirmation of a current offering']
];
export function addHomeChapter(d:ContentDocument,key:string,id:string):ContentDocument{
 const template=chapterTemplates.find(t=>t.key===key);if(!template||!d.homepage)return d;
 return {...d,sections:[...d.sections,{id,heading:template.label,paragraphs:[template.needs+'. Review the copy before making this chapter visible.']}],homepage:{...d.homepage,sections:[...d.homepage.sections,{id,type:template.type,enabled:false,contentNeeded:true,eyebrow:'From the atelier',...(template.type==='selected'?{productIds:[]}:template.type==='categories'?{categories:[]}:template.type==='journal'?{articleIds:[]}:template.type==='steps'?{items:[{id:'step-1',title:'First step',body:'Explain the verified action at this stage.'}]}:{}),action:{label:'Our approach',href:'/process'}}]}};
}

import type {ContentDocument} from './content-model';

/** Search/selection only. detailPending requires a full record before editing. */
export function contentListDocument(document:ContentDocument):ContentDocument {
 return {id:document.id,kind:document.kind,route:document.route,title:document.title,eyebrow:document.eyebrow,description:'',
  sections:document.sections.map(({id,heading,group})=>({id,heading,group,paragraphs:[]}))};
}

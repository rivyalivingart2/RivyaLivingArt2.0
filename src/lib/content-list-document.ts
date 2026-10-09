import type {ContentDocument} from './content-model';
import {draftState} from './content-health';

/** A compact row needs the server comparison; a full saved record must be compared afresh. */
export function contentListDraftState(entry:{document:ContentDocument;published:ContentDocument|null;version:number;detailPending?:boolean;draftStatus?:ReturnType<typeof draftState>}){
 return entry.detailPending&&entry.draftStatus?entry.draftStatus:draftState(entry.document,entry.published,entry.version);
}

/** Search/selection only. detailPending requires a full record before editing. */
export function contentListDocument(document:ContentDocument):ContentDocument {
 return {id:document.id,kind:document.kind,route:document.route,title:document.title,eyebrow:document.eyebrow,description:'',
  ...(document.editorial?{editorial:{schemaVersion:1,kind:document.editorial.kind,classification:document.editorial.classification}}:{}),...(document.landing?{landing:{schemaVersion:1,blocks:[]}}:{}),
  sections:document.sections.map(({id,heading,group})=>({id,heading,group,paragraphs:[]}))};
}

import {applyReviewedTranslation} from './translation-review';
import {uiText,type UiKey,type Locale} from './site-settings-model';
import type {ContentDocument} from './content-model';
export const sharedCopyId='page:site-copy';
export const uiKeys:UiKey[]=['collections','searchPieces','beginPiece','openNavigation','closeNavigation','exploreTitle','theCollections','findPiece','searchCollection','exploreResults','browseAllPieces','footerExplore','footerAtelier','footerTalk','emailAtelier','contact','customPieces','skipMain'];
export const sharedCopyFields=[...uiKeys.map(key=>({id:key,label:key.replace(/[A-Z]/g,v=>' '+v.toLowerCase()),group:key.startsWith('footer')||['emailAtelier','contact','customPieces'].includes(key)?'Footer':'Navigation and search',value:uiText('en',key)})),
 {id:'footer-statement',label:'Brand statement',group:'Footer',value:'Objects for the spaces we inhabit. Art for the stories we keep.'},
 {id:'show-categories',label:'Show all categories',group:'Homepage',value:'Show all categories'},
 {id:'read-story',label:'Read the story',group:'Homepage',value:'Read the story'},
 {id:'discover-piece',label:'Discover the piece',group:'Homepage',value:'Discover the piece'},
 {id:'hero-fallback',label:'Hero image fallback',group:'Homepage',value:'A space for your next piece.'}
];
// A registered internal document owns shared strings; it is never a public page or sitemap entry.
export const sharedCopyCandidate:ContentDocument={id:sharedCopyId,kind:'page',route:'/studio/site-copy',title:'Shared website copy',eyebrow:'Navigation, footer and interface',description:'Reusable website labels. Contact values remain in Business settings.',sections:sharedCopyFields.map(f=>({id:f.id.replace(/[A-Z]/g,v=>'-'+v.toLowerCase()),heading:f.label,paragraphs:[f.value]}))};
export const copyFieldId=(key:string)=>key.replace(/[A-Z]/g,v=>'-'+v.toLowerCase());
export type SharedCopy=Record<string,string>;
export function sharedCopyValues(document?:ContentDocument,locale:Locale='en'):SharedCopy{
 if(document&&['hi','gu'].includes(locale)){const translated=applyReviewedTranslation(document,locale);if(translated!==document)return sharedCopyValues(translated,'en');document={...document,translations:undefined};}
 return Object.fromEntries(sharedCopyFields.map(f=>{const id=copyFieldId(f.id),s=document?.sections.find(s=>s.id===id);return [f.id,document?.translations?.[locale]?.sections?.[id]?.paragraphs?.[0]?.trim()||(locale==='en'?s?.paragraphs[0]:undefined)||(uiKeys.includes(f.id as UiKey)?uiText(locale,f.id as UiKey):f.value)];}));
}
export function validSharedCopy(d:ContentDocument){return d.route===sharedCopyCandidate.route&&d.sections.length===sharedCopyFields.length&&sharedCopyFields.every(f=>{const s=d.sections.find(s=>s.id===copyFieldId(f.id));return s&&s.paragraphs.length===1&&s.paragraphs[0].length<=300&&!s.body&&!s.checklist&&!s.image&&!s.action&&!s.policyHref&&s.enabled!==false;});}

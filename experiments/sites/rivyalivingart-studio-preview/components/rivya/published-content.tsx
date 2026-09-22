"use client";
import {useDemo} from '@/lib/rivya/demo-state';
import {getContentSummaries,getContentReferences} from '@/lib/rivya/source/studio-content-data';
import {ContentSections} from '@/components/foundation/content-sections';
import {ContentRichText} from '@/components/foundation/content-richtext';
import type {ContentDocument} from '@/lib/rivya/source/content-contracts';
import {richTextToPlainText} from '@/lib/rivya/source/content-richtext';
export function parseContent(raw?:string):ContentDocument|undefined{try{const d=JSON.parse(raw||'null');return d&&d.schemaVersion===1&&typeof d.title==='string'&&d.body?.type==='doc'&&Array.isArray(d.sections)&&['page','article','faq','testimonial'].includes(d.kind)?d:undefined}catch{return undefined}}
export function PublishedPage({route}:{route:string}){const d=useDemo();const page=getContentSummaries().find(p=>p.kind==='page'&&p.sourceRoute===route);if(!page)return null;if(!d.visible(page.id))return <section className="section brand-empty"><h1>This sample page is unavailable.</h1><p>It was manually removed in this browser. Its source and shared assets remain intact.</p></section>;const doc=parseContent(d.state.published[page.id]);return doc?<section className="section"><p className="sample-caption">Locally published demo revision · no Site deployment</p><ContentSections sections={doc.sections} references={getContentReferences()}/>{doc.sections.length===0&&<><h1>{doc.title}</h1><ContentRichText value={doc.body}/></>}</section>:null}
export {usePageOverride} from '@/lib/rivya/page-override';
export {ContentRichText,richTextToPlainText};

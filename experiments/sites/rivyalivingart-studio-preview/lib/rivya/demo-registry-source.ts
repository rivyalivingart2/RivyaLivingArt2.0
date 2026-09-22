import type {DemoRecord} from './demo-state';
import {concepts} from '@/lib/rivya/source/catalogue';
import {getContentSummaries,getContentDocument} from '@/lib/rivya/source/studio-content-data';
import {enquiryScenarios} from '@/lib/rivya/source/enquiries';
import {portfolioStudies} from '@/lib/rivya/source/portfolio';
import {operationalSamples} from '@/lib/rivya/source/operations';
const batch='rivya-r8-visual-2026-09';
const support=[{id:'IMPORTS',kind:'import-workspace',title:'Local catalogue import workspace'},{id:'SETTINGS',kind:'settings',title:'Site settings'},{id:'TAXONOMY',kind:'taxonomy',title:'Sample taxonomy'},{id:'NAVIGATION',kind:'settings',title:'Menu visibility'}];
export const registry:DemoRecord[]=[...concepts.map(p=>({id:p.id,title:p.title,kind:'product',refs:[],batch})),...getContentSummaries().map(d=>({id:d.id,title:d.title,kind:d.kind,route:d.sourceRoute,refs:[...(getContentDocument(d.id)?.relatedProductIds||[]),...(getContentDocument(d.id)?.sections.flatMap(s=>s.fields.referenceIds)||[])],batch})),...enquiryScenarios.map(e=>({id:e.id,title:e.scenario,kind:'enquiry',refs:[e.productId],batch})),...portfolioStudies.map(p=>({id:p.id,title:p.title,kind:'project',refs:[...p.relatedProductIds],batch})),...operationalSamples.jobs.map(j=>({id:j.id,title:j.title,kind:"job",refs:[],batch})),...operationalSamples.subscribers.map(s=>({id:s.id,title:s.email,kind:"subscriber",refs:[],batch})),...support.map(s=>({...s,refs:[],batch}))];

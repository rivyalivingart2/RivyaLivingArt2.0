import assert from 'node:assert/strict';
import {excludedProductEntities} from './field-spec.mjs';
import {planReconciliation} from '../reconcile.mjs';
export function focalFractionToPercent(value){assert.ok(Number.isFinite(value)&&value>=0&&value<=1,'Source focal coordinate must be in [0,1]');return value*100;}
export function mapProvenance(value){return value==='AI'?'design-visualization':'unknown';}
export function mapRating(value,{genuine=false,permission=false}={}){assert.ok(genuine&&permission,'Genuine source and permission required');assert.ok(Number.isInteger(value)&&value>=1&&value<=5,'Rating must be an explicit integer 1..5');return value;}
export function matchAsset(source,candidates){
 assert.match(source.sha256,/^[a-f0-9]{64}$/);const exact=candidates.filter(c=>c.sha256===source.sha256);
 return {evidence:exact.length?'EXACT_BYTES':'NO_BYTE_MATCH',paths:exact.map(c=>c.path).sort(),automaticAssociation:false};
}
/** A review report, never an executable patch. Product sources are denied first. */
export function planPhase3Review({entity,...input}){
 assert.ok(typeof entity==='string'&&entity,'Entity required');
 if(excludedProductEntities.has(entity))return {mode:'REVIEW_ONLY',entity,decisions:[{action:'OWNER_EXCLUDED_PRODUCT_DATA'}],patches:[],staged:[],writes:0};
 const report=planReconciliation(input);
 return {mode:'REVIEW_ONLY',entity,decisions:report.decisions,proposalCount:report.patches.length,oldOnlyReviewCount:report.staged.length,patches:[],staged:[],writes:0};
}
export function validateRecordCrosswalk(rows,{sourceRecordsAvailable=false}={}){
 assert.ok(Array.isArray(rows));if(!sourceRecordsAvailable)assert.equal(rows.length,0,'Cannot invent deleted source record identities');
 const source=new Set(),destination=new Set();
 for(const row of rows){assert.ok(row.namespace&&row.sourceEntity&&row.sourceId&&row.destinationEntity&&row.destinationId&&row.evidence,'Explicit stable identity and evidence required');assert.ok(Number.isSafeInteger(row.expectedVersion)&&row.expectedVersion>=0);assert.ok(!excludedProductEntities.has(row.sourceEntity)&&!/^(?:rivya_catalogue|ShopProduct|Product|product|catalogue)(?:\.|$)/.test(row.destinationEntity),'Product record mapping/import excluded');const a=[row.namespace,row.sourceEntity,row.sourceId].join(':'),b=[row.destinationEntity,row.destinationId].join(':');assert.ok(!source.has(a)&&!destination.has(b),'Ambiguous identity crosswalk');source.add(a);destination.add(b);}
 return true;
}

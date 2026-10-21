/** Pure dry-run planner. No filesystem, network, database writes or publication. */
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

const forbidden=/^(?:__proto__|prototype|constructor)$|password|secret|token|credential|session/i;
const protectedFields=new Set(['id','slug','url','price','prices','variants','published','publishedAt','visible','status','deletedAt','erasedAt']);
const publicationFields=new Set(['published','publishedAt','visible','status','deletedAt','erasedAt']);
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])])):value;
const digest=value=>createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const equal=(a,b)=>digest(a)===digest(b);
function safeJson(value,depth=0){
 assert.ok(depth<25,'Source nesting limit exceeded');
 assert.ok(value!==undefined&&typeof value!=='function'&&typeof value!=='bigint','JSON values required');
 if(typeof value==='number')assert.ok(Number.isFinite(value),'Finite JSON numbers required');
 if(value&&typeof value==='object'){
  assert.ok(Array.isArray(value)||[Object.prototype,null].includes(Object.getPrototypeOf(value)),'Plain JSON required');
  for(const [key,child]of Object.entries(value)){assert.ok(!forbidden.test(key),'Credential or unsafe key refused');safeJson(child,depth+1);}
 }
}
const missing=value=>value===null||value===''||Array.isArray(value)&&value.length===0;

/**
 * Crosswalks must be supplied explicitly. Titles never establish identity.
 * Rules name top-level source and destination fields; nested fields/arrays are
 * atomic to prevent accidental relationship merges. Intentionally empty fields
 * and deletion markers are authoritative. Reports contain digests, not values.
 */
export function planReconciliation({namespace,sources,destinations,crosswalk,rules}){
 assert.ok(typeof namespace==='string'&&namespace.trim(),'Source namespace required');
 for(const list of [sources,destinations,crosswalk,rules])assert.ok(Array.isArray(list),'Arrays required');
 const unique=(list,key,label)=>{const seen=new Set();for(const row of list){assert.ok(typeof row[key]==='string'&&row[key],label+' identity required');assert.ok(!seen.has(row[key]),'Duplicate '+label+' identity');seen.add(row[key]);}};
 unique(sources,'id','source');unique(destinations,'id','destination');unique(crosswalk,'sourceId','crosswalk source');unique(crosswalk,'destinationId','crosswalk destination');unique(rules,'to','destination field rule');
 const sourceById=new Map(sources.map(s=>[s.id,s])), destinationById=new Map(destinations.map(d=>[d.id,d]));
 for(const mapping of crosswalk){assert.ok(sourceById.has(mapping.sourceId),'Crosswalk source absent');assert.ok(destinationById.has(mapping.destinationId),'Crosswalk destination absent');assert.ok(Number.isSafeInteger(mapping.expectedVersion)&&mapping.expectedVersion>=0,'Expected destination revision required');}
 for(const rule of rules){assert.ok(typeof rule.from==='string'&&typeof rule.to==='string','Field names required');assert.ok(/^[A-Za-z][A-Za-z0-9_]*$/.test(rule.from)&&/^[A-Za-z][A-Za-z0-9_]*$/.test(rule.to),'Top-level field names only');assert.ok(!forbidden.test(rule.from)&&!forbidden.test(rule.to),'Secret fields cannot be mapped');assert.ok(['add-or-fill','title'].includes(rule.mode),'Unknown merge mode');if(rule.mode==='title')assert.ok(['title','name'].includes(rule.to),'Title approval cannot change another field');if(['title','name'].includes(rule.to))assert.equal(rule.mode,'title','Titles and display names require the traceable title mode');}
 const decisions=[],patches=[],staged=[];
 for(const source of sources){
  const mapping=crosswalk.find(m=>m.sourceId===source.id);
  const destination=mapping?destinationById.get(mapping.destinationId):undefined;
  const base={namespace,sourceId:source.id,destinationId:destination?.id||null};
  assert.ok(source.fields&&typeof source.fields==='object'&&!Array.isArray(source.fields),'Source fields required');
  if(source.deleted||source.erased||destination?.deleted||destination?.erased){decisions.push({...base,action:'SKIP_TOMBSTONE'});continue;}
  if(destination&&destination.version!==mapping.expectedVersion){decisions.push({...base,action:'BLOCK_STALE_DESTINATION'});continue;}
  const proposal={};
  for(const rule of rules){
   if(!Object.hasOwn(source.fields,rule.from))continue;
   const incoming=source.fields[rule.from];safeJson(incoming);
   const hasExisting=destination&&Object.hasOwn(destination.fields,rule.to), existing=hasExisting?destination.fields[rule.to]:undefined;
   const row={...base,field:rule.to,sourceDigest:digest(incoming),destinationDigest:hasExisting?digest(existing):null};
   if(!destination){
    // Old-only records are review candidates, never executable inserts.
    if(publicationFields.has(rule.to)){decisions.push({...row,action:'EXCLUDE_LEGACY_PUBLICATION_STATE'});continue;}
    decisions.push({...row,action:'STAGE_OLD_ONLY_DRAFT'});proposal[rule.to]=structuredClone(incoming);continue;
   }
   if(hasExisting&&equal(existing,incoming)){decisions.push({...row,action:'UNCHANGED'});continue;}
   if(destination.intentionalBlanks?.includes(rule.to)){decisions.push({...row,action:'KEEP_INTENTIONAL_BLANK'});continue;}
   if(protectedFields.has(rule.to)){decisions.push({...row,action:'CONFLICT_PROTECTED'});continue;}
   if(rule.mode==='title'){
    const approval=rule.approvals?.find(a=>a.field===rule.to&&a.sourceId===source.id&&a.destinationId===destination.id&&a.expectedVersion===destination.version&&a.sourceDigest===row.sourceDigest&&a.destinationDigest===row.destinationDigest);
    if(!approval){decisions.push({...row,action:'CONFLICT_TITLE_APPROVAL_REQUIRED'});continue;}
    decisions.push({...row,action:'PROPOSE_APPROVED_TITLE'});proposal[rule.to]=structuredClone(incoming);continue;
   }
   // Null/empty values cannot be inferred to be missing. Only an explicit
   // destination missing-field ledger permits filling those values.
   if(hasExisting&&(!missing(existing)||!destination.knownMissing?.includes(rule.to))){decisions.push({...row,action:'CONFLICT_KEEP_DESTINATION'});continue;}
   if(missing(incoming)){decisions.push({...row,action:'SKIP_EMPTY_SOURCE'});continue;}
   decisions.push({...row,action:hasExisting?'PROPOSE_FILL':'PROPOSE_ADD_FIELD'});proposal[rule.to]=structuredClone(incoming);
  }
  if(Object.keys(proposal).length){
   if(destination)patches.push({...base,expectedVersion:destination.version,fields:proposal});
   else staged.push({...base,reviewState:'draft',fields:proposal});
  }
 }
 return {mode:'DRY_RUN_ONLY',namespace,decisions,patches,staged,counts:decisions.reduce((a,d)=>(a[d.action]=(a[d.action]||0)+1,a),{}),writes:0};
}
export const reconciliationDigest=digest;

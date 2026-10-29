import {createHash} from 'node:crypto';
import {canonicalArtifactJson, canonicalJson, decodeRecord, digestPayload, encodeRecord, planRecordMutation,
  type GoogleWorkspaceRecord, type MutationActor, type MutationAuditEntry, type MutationLedgerEntry,
  type MutationReceipt, type RecordMutationCommand, type RecordMutationPlan} from './record-codec';
import type {createWriterGateway} from './writer-gateway';

/** Inactive v2 foundation. Explicit registrations only; no credentials, provider
 * creation, runtime selection, history eviction or process-local persistence. */
export const BOUNDED_PROTOCOL='rivya-bounded-v2' as const;
export const BOUNDED_LIMITS=Object.freeze({pageRows:8,pageCharacters:128*1024,metadataBytes:1024*1024,chunkCharacters:16*1024,responseBytes:6_000_000,requestBytes:1_800_000,members:8,workingPages:64,readPagesPerRequest:4,operationTimeoutMs:30_000});
export type BoundedLayout={protocol:typeof BOUNDED_PROTOCOL;key:string;workbookId:string;rootSheetId:number;metadataSheetId:number;dataSheetId:number;maxPages:number;maxMetadataChunks:number};
export type PageKind='r'|'l'|'a'|'h';
export type PageDescriptor=[PageKind,number,string];
export type RecordIndex=[string,number,number,number];
export type MutationIndex=[string,number,number,number,number,number,number,number,number];
export type TransactionIndex=[string,number,number];
export type BoundedManifest={format:'rivya-bounded-manifest-v2';layoutSha256:string;epoch:string;revision:number;pages:PageDescriptor[];records:RecordIndex[];mutations:MutationIndex[];transactions:TransactionIndex[]};
export type BoundedRoot={format:'rivya-bounded-root-v2';epoch:string;revision:number;manifestSha256:string;metadataChunks:number;state:'ready'|'committed'|'inflight';operationId:string|null;requestSha256:string|null;actorId:string|null};
export type BoundedPage={id:number;rows:string[][]};
export type BoundedState={root:BoundedRoot;manifest:BoundedManifest;pages:BoundedPage[]};
export type BoundedManifestRead={root:BoundedRoot;manifest:BoundedManifest};
export type BoundedCursor=Pick<BoundedRoot,'epoch'|'revision'|'manifestSha256'>;
export type BoundedCommit={protocol:typeof BOUNDED_PROTOCOL;resourceKey:string;expected:BoundedRoot;next:BoundedRoot;manifest:BoundedManifest;pages:BoundedPage[];readPageIds:number[];operationId:string;requestSha256:string;actorId:string;commitBefore:number|null};
export type BoundedOutcome={status:'committed'|'replay';receipts:MutationReceipt[]}|{status:'conflict'|'unknown'};
export type BoundedErrorCode='configuration'|'integrity'|'capacity'|'conflict'|'unauthorized'|'policy-rejected'|'outcome-unknown'|'commit-expired'|'unavailable';
export class BoundedStoreError extends Error {constructor(public readonly code:BoundedErrorCode){super(`Bounded canonical storage: ${code}.`);this.name='BoundedStoreError';}}
const fail=(code:BoundedErrorCode):never=>{throw new BoundedStoreError(code);};
const sha=(value:string)=>createHash('sha256').update(value,'utf8').digest('hex');
const json=canonicalArtifactJson;
const clone=<T>(value:T):T=>JSON.parse(json(value)) as T;
const same=(a:unknown,b:unknown)=>json(a)===json(b);
const exact=(value:unknown,keys:string[])=>!!value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).sort().join('|')===keys.sort().join('|');
const number=(x:unknown,min=0,max=Number.MAX_SAFE_INTEGER):x is number=>Number.isSafeInteger(x)&&Number(x)>=min&&Number(x)<=max;
const id=(x:unknown):x is string=>typeof x==='string'&&x.length>0&&x.length<=240&&!/[\s\u0000-\u001f\u007f-\u009f]/u.test(x);
const digest=(x:unknown):x is string=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
const widths:Record<PageKind,number>={r:7,l:6,a:5,h:7};
export function validateBoundedLayout(value:BoundedLayout):BoundedLayout {
  const r=clone(value);
  if(!exact(r,['protocol','key','workbookId','rootSheetId','metadataSheetId','dataSheetId','maxPages','maxMetadataChunks'])||r.protocol!==BOUNDED_PROTOCOL||!(/^[a-z][a-z0-9_-]{0,63}$/).test(r.key)||!(/^[A-Za-z0-9_-]{10,160}$/).test(r.workbookId)||![r.rootSheetId,r.metadataSheetId,r.dataSheetId].every(x=>number(x,0,2147483647))||new Set([r.rootSheetId,r.metadataSheetId,r.dataSheetId]).size!==3||!number(r.maxPages,1,8192)||!number(r.maxMetadataChunks,1,64))return fail('configuration');
  return r;
}
export function encodeBoundedMetadata(manifest:BoundedManifest,layout:BoundedLayout):string[] {
  const text=json(manifest);if(Buffer.byteLength(text)>BOUNDED_LIMITS.metadataBytes)return fail('capacity');
  const chunks:string[]=[];let offset=0;
  while(offset<text.length){let end=Math.min(text.length,offset+BOUNDED_LIMITS.chunkCharacters);if(end<text.length&&/[\uD800-\uDBFF]/.test(text[end-1]))end--;chunks.push(text.slice(offset,end));offset=end;}
  if(chunks.length>layout.maxMetadataChunks)return fail('capacity');return chunks;
}
export function boundedCursor(root:BoundedRoot):BoundedCursor{return {epoch:root.epoch,revision:root.revision,manifestSha256:root.manifestSha256};}
export function validateBoundedManifest(layoutInput:BoundedLayout,rootInput:BoundedRoot,manifestInput:BoundedManifest,{allowInflight=false}={}) {
  const layout=validateBoundedLayout(layoutInput),root=clone(rootInput),m=clone(manifestInput);
  if(!exact(root,['format','epoch','revision','manifestSha256','metadataChunks','state','operationId','requestSha256','actorId'])||root.format!=='rivya-bounded-root-v2'||!id(root.epoch)||!number(root.revision)||!digest(root.manifestSha256)||!number(root.metadataChunks,1,layout.maxMetadataChunks)||!['ready','committed','inflight'].includes(root.state))return fail('integrity');
  if(root.state==='inflight'&&!allowInflight)return fail('outcome-unknown');
  if(root.state==='ready'?(root.operationId!==null||root.requestSha256!==null||root.actorId!==null):(!id(root.operationId)||!digest(root.requestSha256)||!id(root.actorId)))return fail('integrity');
  if(!exact(m,['format','layoutSha256','epoch','revision','pages','records','mutations','transactions'])||m.format!=='rivya-bounded-manifest-v2'||m.layoutSha256!==sha(json(layout))||m.epoch!==root.epoch||m.revision!==root.revision||!Array.isArray(m.pages)||!Array.isArray(m.records)||!Array.isArray(m.mutations)||!Array.isArray(m.transactions)||m.pages.length>layout.maxPages||m.transactions.length!==m.revision)return fail('integrity');
  const chunks=encodeBoundedMetadata(m,layout);if(chunks.length!==root.metadataChunks||sha(chunks.join(''))!==root.manifestSha256)return fail('integrity');
  m.pages.forEach(p=>{if(!Array.isArray(p)||p.length!==3||!Object.hasOwn(widths,p[0])||!number(p[1],1,8)||!digest(p[2]))fail('integrity');});
  const slots=new Set<string>(),recordIds=new Set<string>(),mutationIds=new Set<string>(),operationIds=new Set<string>();
  const locate=(kind:PageKind,page:number,row:number)=>{if(!number(page,0,m.pages.length-1)||m.pages[page][0]!==kind||!number(row,0,m.pages[page][1]-1))fail('integrity');const slot=page+':'+row;if(slots.has(slot))fail('integrity');slots.add(slot);};
  m.records.forEach(h=>{if(!Array.isArray(h)||h.length!==4||!id(h[0])||recordIds.has(h[0])||!number(h[3],0,m.mutations.length-1))fail('integrity');recordIds.add(h[0]);locate('r',h[1],h[2]);});
  const lastByRecord=new Map<number,number>();
  m.mutations.forEach((x,i)=>{if(!Array.isArray(x)||x.length!==9||!id(x[0])||mutationIds.has(x[0])||!number(x[1],0,m.records.length-1)||!number(x[2],-1,i-1)||x[2]!== (lastByRecord.get(x[1])??-1))fail('integrity');mutationIds.add(x[0]);lastByRecord.set(x[1],i);locate('l',x[3],x[4]);locate('a',x[5],x[6]);locate('h',x[7],x[8]);});
  m.records.forEach((h,i)=>{if(lastByRecord.get(i)!==h[3])fail('integrity');});
  let next=0;m.transactions.forEach(t=>{if(!Array.isArray(t)||t.length!==3||!id(t[0])||operationIds.has(t[0])||t[1]!==next||!number(t[2],1,BOUNDED_LIMITS.members)||t[1]+t[2]>m.mutations.length)fail('integrity');operationIds.add(t[0]);next+=t[2];});if(next!==m.mutations.length||slots.size!==m.pages.reduce((n,p)=>n+p[1],0))fail('integrity');
  if(root.state==='ready'?root.revision!==0:root.state==='committed'&&root.operationId!==m.transactions.at(-1)?.[0])fail('integrity');
  return {layout,root,manifest:m};
}
export function validateBoundedPage(manifest:BoundedManifest,input:BoundedPage):BoundedPage {
  const page=clone(input);if(!exact(page,['id','rows'])||!number(page.id,0,manifest.pages.length-1)||!Array.isArray(page.rows))return fail('integrity');
  const [kind,count,hash]=manifest.pages[page.id];if(page.rows.length!==count||page.rows.some(row=>!Array.isArray(row)||row.length!==widths[kind]||row.some(v=>typeof v!=='string'||v.length>45000)))return fail('integrity');
  const text=json(page.rows);if(text.length>BOUNDED_LIMITS.pageCharacters)return fail('capacity');if(sha(text)!==hash)return fail('integrity');
  if(kind==='r'||kind==='h')page.rows.forEach(row=>decodeRecord(row));return page;
}
const descriptor=(kind:PageKind,rows:string[][]):PageDescriptor=>[kind,rows.length,sha(json(rows))];
function rootFor(layout:BoundedLayout,manifest:BoundedManifest,operation:{id:string;sha:string;actor:string}|null):BoundedRoot {
  const chunks=encodeBoundedMetadata(manifest,layout);return {format:'rivya-bounded-root-v2',epoch:manifest.epoch,revision:manifest.revision,manifestSha256:sha(chunks.join('')),metadataChunks:chunks.length,state:operation?'committed':'ready',operationId:operation?.id??null,requestSha256:operation?.sha??null,actorId:operation?.actor??null};
}
function recordCommand(record:GoogleWorkspaceRecord):RecordMutationCommand{return {recordId:record.recordId,expectedRevision:record.revision-1,mutationId:record.lastMutationId!,payload:record.payload,sourceUpdatedAt:record.sourceUpdatedAt,archivedAt:record.archivedAt};}
const operationHash=(actorId:string,ledgers:MutationLedgerEntry[])=>sha(json({actorId,requests:ledgers.map(x=>x.requestSha256)}));
function rowForLedger(key:string,l:MutationLedgerEntry):string[]{return [l.mutationId,key,l.recordId,l.requestSha256,canonicalJson(l),digestPayload(l)];}
function rowForAudit(key:string,a:MutationAuditEntry):string[]{return [a.mutationId,key,a.recordId,canonicalJson(a),digestPayload(a)];}
function rowAt(pages:Map<number,BoundedPage>,page:number,row:number):string[]{const p=pages.get(page);if(!p||!p.rows[row])return fail('integrity');return p.rows[row];}
function mutationProof(layout:BoundedLayout,m:BoundedManifest,pages:Map<number,BoundedPage>,index:number) {
  const x=m.mutations[index];if(!x)return fail('integrity');
  const history=decodeRecord(rowAt(pages,x[7],x[8])),lr=rowAt(pages,x[3],x[4]),ar=rowAt(pages,x[5],x[6]);
  let ledger:MutationLedgerEntry,audit:MutationAuditEntry;try{ledger=JSON.parse(lr[4]);audit=JSON.parse(ar[3]);}catch{return fail('integrity');}
  if(history.lastMutationId!==x[0]||history.recordId!==m.records[x[1]][0]||!same(lr,rowForLedger(layout.key,ledger))||!same(ar,rowForAudit(layout.key,audit)))return fail('integrity');
  const prior=x[2]<0?null:decodeRecord(rowAt(pages,m.mutations[x[2]][7],m.mutations[x[2]][8]));
  const planned=planRecordMutation({current:prior,previousMutation:null,command:recordCommand(history),actor:{id:ledger.actorId},now:ledger.committedAt,authorize:()=>true});
  if(planned.kind!=='apply'||!same(planned.record,history)||!same(planned.ledger,ledger)||!same(planned.audit,audit))return fail('integrity');
  return {record:history,ledger,audit,prior};
}
function appendRow(m:BoundedManifest,pages:Map<number,BoundedPage>,kind:PageKind,row:string[],layout:BoundedLayout):[number,number] {
  let pageId=-1;for(let i=m.pages.length-1;i>=0;i--)if(m.pages[i][0]===kind){pageId=i;break;}
  if(pageId>=0&&m.pages[pageId][1]<8){const page=pages.get(pageId);if(!page)return fail('integrity');const rows=[...page.rows,row];if(json(rows).length<=BOUNDED_LIMITS.pageCharacters){const index=page.rows.length;page.rows=rows;m.pages[pageId]=descriptor(kind,rows);return [pageId,index];}}
  if(m.pages.length>=layout.maxPages||json([row]).length>BOUNDED_LIMITS.pageCharacters)return fail('capacity');
  pageId=m.pages.length;pages.set(pageId,{id:pageId,rows:[row]});m.pages.push(descriptor(kind,[row]));return [pageId,0];
}
function applyPlans(layout:BoundedLayout,m:BoundedManifest,pages:Map<number,BoundedPage>,plans:Extract<RecordMutationPlan,{kind:'apply'}>[],operationId:string) {
  const start=m.mutations.length;
  for(const p of plans){let head=m.records.findIndex(x=>x[0]===p.record.recordId),prior=-1;const mutationIndex=m.mutations.length;
    if(head<0){const loc=appendRow(m,pages,'r',encodeRecord(p.record),layout);head=m.records.length;m.records.push([p.record.recordId,...loc,mutationIndex]);}
    else {const h=m.records[head];prior=h[3];const page=pages.get(h[1]);if(!page)return fail('integrity');page.rows[h[2]]=encodeRecord(p.record);h[3]=mutationIndex;
      if(json(page.rows).length<=BOUNDED_LIMITS.pageCharacters)m.pages[h[1]]=descriptor('r',page.rows);
      else {
        // Split only this mutable current-record page. Historical pages/slots
        // never move; every unaffected record retains its exact encoded row.
        const groups:string[][][]=[];let group:string[][]=[];
        for(const row of page.rows){if(json([row]).length>BOUNDED_LIMITS.pageCharacters)return fail('capacity');if(group.length&&(group.length===8||json([...group,row]).length>BOUNDED_LIMITS.pageCharacters)){groups.push(group);group=[];}group.push(row);}if(group.length)groups.push(group);
        if(m.pages.length+groups.length-1>layout.maxPages)return fail('capacity');
        groups.forEach((rows,i)=>{const pageId=i===0?page.id:m.pages.length;if(i===0){page.rows=rows;m.pages[pageId]=descriptor('r',rows);}else{pages.set(pageId,{id:pageId,rows});m.pages.push(descriptor('r',rows));}rows.forEach((row,rowIndex)=>{const owner=m.records.find(x=>x[0]===row[0]);if(!owner)return fail('integrity');owner[1]=pageId;owner[2]=rowIndex;});});
      }
    }
    const l=appendRow(m,pages,'l',rowForLedger(layout.key,p.ledger),layout),a=appendRow(m,pages,'a',rowForAudit(layout.key,p.audit),layout),h=appendRow(m,pages,'h',encodeRecord(p.record),layout);
    m.mutations.push([p.record.lastMutationId!,head,prior,...l,...a,...h]);
  }
  m.transactions.push([operationId,start,plans.length]);m.revision++;
}
/** Pure local bootstrap representation. Caller must label synthetic registrations
 * and mutation wrappers; this performs no import, file creation or provider write. */
export function buildBoundedState({layout:raw,epoch,plans}:{layout:BoundedLayout;epoch:string;plans:Extract<RecordMutationPlan,{kind:'apply'}>[]}):BoundedState {
  const layout=validateBoundedLayout(raw);if(!id(epoch)||!Array.isArray(plans))return fail('configuration');
  const manifest:BoundedManifest={format:'rivya-bounded-manifest-v2',layoutSha256:sha(json(layout)),epoch,revision:0,pages:[],records:[],mutations:[],transactions:[]},pages=new Map<number,BoundedPage>(),current=new Map<string,GoogleWorkspaceRecord>();
  let operation:{id:string;sha:string;actor:string}|null=null;
  const seen=new Set<string>();for(const p of plans){if(p.kind!=='apply'||seen.has(p.ledger.mutationId))return fail('integrity');const actual=planRecordMutation({current:current.get(p.record.recordId)??null,previousMutation:null,command:recordCommand(p.record),actor:{id:p.ledger.actorId},now:p.ledger.committedAt,authorize:()=>true});if(!same(actual,p))return fail('integrity');seen.add(p.ledger.mutationId);applyPlans(layout,manifest,pages,[p],p.ledger.mutationId);current.set(p.record.recordId,p.record);operation={id:p.ledger.mutationId,sha:operationHash(p.ledger.actorId,[p.ledger]),actor:p.ledger.actorId};}
  const root=rootFor(layout,manifest,operation);validateBoundedManifest(layout,root,manifest);return {root,manifest,pages:[...pages.values()].map(clone)};
}
export function requiredBoundedPageIds(manifest:BoundedManifest,commands:RecordMutationCommand[],relationships:string[]=[]):number[] {
  if(!Array.isArray(commands)||commands.length<1||commands.length>BOUNDED_LIMITS.members||!Array.isArray(relationships)||relationships.length>16)return fail('capacity');
  const ids=new Set<number>();const proof=(i:number)=>{const x=manifest.mutations[i];if(!x)return fail('integrity');[x[3],x[5],x[7]].forEach(p=>ids.add(p));if(x[2]>=0)ids.add(manifest.mutations[x[2]][7]);};
  for(const recordId of [...commands.map(c=>c.recordId),...relationships]){const h=manifest.records.find(x=>x[0]===recordId);if(h){ids.add(h[1]);proof(h[3]);}}
  for(const c of commands){const previous=manifest.mutations.findIndex(x=>x[0]===c.mutationId);if(previous>=0)proof(previous);}
  for(const kind of ['r','l','a','h'] as PageKind[]){for(let i=manifest.pages.length-1;i>=0;i--)if(manifest.pages[i][0]===kind){if(manifest.pages[i][1]<8)ids.add(i);break;}}
  if(ids.size>BOUNDED_LIMITS.workingPages)return fail('capacity');return [...ids].sort((a,b)=>a-b);
}
export function readBoundedRecords(layout:BoundedLayout,state:BoundedState,recordIds:string[]):ReadonlyMap<string,GoogleWorkspaceRecord> {
  const {manifest}=validateBoundedManifest(layout,state.root,state.manifest),pages=new Map(state.pages.map(p=>[p.id,validateBoundedPage(manifest,p)]));if(pages.size!==state.pages.length)return fail('integrity');
  const records=new Map<string,GoogleWorkspaceRecord>();for(const id of recordIds){const h=manifest.records.find(x=>x[0]===id);if(!h)continue;const record=decodeRecord(rowAt(pages,h[1],h[2])),proof=mutationProof(layout,manifest,pages,h[3]);if(record.recordId!==id||!same(record,proof.record))return fail('integrity');records.set(id,record);}return records;
}
/** Complete explicit local/paged-audit verifier. Never used to reassemble history
 * for an ordinary server load or mutation. */
export function auditBoundedState(layout:BoundedLayout,state:BoundedState) {
  const {manifest}=validateBoundedManifest(layout,state.root,state.manifest);if(state.pages.length!==manifest.pages.length)return fail('integrity');const pages=new Map(state.pages.map(p=>[p.id,validateBoundedPage(manifest,p)]));if(pages.size!==manifest.pages.length)return fail('integrity');
  manifest.mutations.forEach((_,i)=>mutationProof(layout,manifest,pages,i));readBoundedRecords(layout,state,manifest.records.map(h=>h[0]));
  const last=manifest.transactions.at(-1);if(last){const ledgers=Array.from({length:last[2]},(_,i)=>mutationProof(layout,manifest,pages,last[1]+i).ledger);if(ledgers.some(l=>l.actorId!==state.root.actorId)||operationHash(state.root.actorId!,ledgers)!==state.root.requestSha256)return fail('integrity');}
  return {records:manifest.records.length,ledger:manifest.mutations.length,audit:manifest.mutations.length,history:manifest.mutations.length,pages:manifest.pages.length,transactions:manifest.transactions.length,providerVerified:false};
}
/** Conservative wire envelope uses maximum legal transport identifiers. */
export function boundedResponseBytes(action:'read'|'commit',result:unknown):number {return Buffer.byteLength(JSON.stringify({message:json({version:1,keyId:'k'.repeat(64),requestId:'n'.repeat(100),action,ok:true,result}),signature:'a'.repeat(64)}));}
export function boundedRequestBytes(action:'read'|'commit',payload:unknown):number {return Buffer.byteLength(JSON.stringify({message:json({version:1,keyId:'k'.repeat(64),requestId:'n'.repeat(100),issuedAt:9999999999999,expiresAt:9999999999999,action,payload}),signature:'a'.repeat(64)}));}
export function measureBoundedState(layout:BoundedLayout,state:BoundedState) {
  validateBoundedManifest(layout,state.root,state.manifest);const chunks=encodeBoundedMetadata(state.manifest,layout),metadata=json(state.manifest);let maximumPageCharacters=0,maximumSignedResponseBytes=boundedResponseBytes('read',{root:state.root,manifest:state.manifest});const totalRowsByKind={r:0,l:0,a:0,h:0};
  const largest:{page:BoundedPage;bytes:number}[]=[];
  state.pages.forEach(raw=>{const p=validateBoundedPage(state.manifest,raw);maximumPageCharacters=Math.max(maximumPageCharacters,json(p.rows).length);maximumSignedResponseBytes=Math.max(maximumSignedResponseBytes,boundedResponseBytes('read',{root:state.root,page:p}));totalRowsByKind[state.manifest.pages[p.id][0]]+=p.rows.length;largest.push({page:p,bytes:Buffer.byteLength(JSON.stringify(json(p)))});largest.sort((a,b)=>b.bytes-a.bytes);if(largest.length>BOUNDED_LIMITS.readPagesPerRequest)largest.pop();});
  if(largest.length)maximumSignedResponseBytes=Math.max(maximumSignedResponseBytes,boundedResponseBytes('read',{root:state.root,pages:largest.map(x=>x.page)}));
  if(maximumSignedResponseBytes>BOUNDED_LIMITS.responseBytes)return fail('capacity');
  return {metadataBytes:Buffer.byteLength(metadata),metadataCharacters:metadata.length,metadataChunks:chunks.length,pageCount:state.manifest.pages.length,maximumPageCharacters,maximumSignedResponseBytes,maximumPreparedRequestBytes:null,totalRowsByKind,limits:{...BOUNDED_LIMITS},fitsReadBudgets:true,providerVerified:false};
}
export type BoundedPolicyContext = {
  layout: BoundedLayout;
  actor: MutationActor;
  commands: RecordMutationCommand[];
  /** Current records, including guarded relationships; never historical aliases. */
  records: ReadonlyMap<string, GoogleWorkspaceRecord>;
  /** Verified prior revision for each command's mutation ID. For replay this is
   * its historical predecessor, already checked by mutationProof. Preflight is
   * empty; an initial mutation maps to null. No new history read is introduced. */
  originalsByMutation: ReadonlyMap<string, GoogleWorkspaceRecord | null>;
  operationId: string;
  commitBefore: number | null;
  replay: boolean;
  phase: 'preflight' | 'guarded';
};
export type BoundedPolicy = {
  authorize: (context: BoundedPolicyContext) => boolean | Promise<boolean>;
  validate: (context: BoundedPolicyContext) => boolean | Promise<boolean>;
};
/** deadline is an absolute performance.now() value, shared by an adapter across
 * sequential reads, mutation and conflict reconciliation. It cannot extend the
 * configured per-operation ceiling. It is never a provider wall-clock lease. */
export type BoundedOperationOptions = {signal?: AbortSignal; deadline?: number};
export async function prepareBoundedCommit(input:{layout:BoundedLayout;state:BoundedState;commands:RecordMutationCommand[];actor:MutationActor;operationId:string;now:string;policy:BoundedPolicy;relationships?:string[];commitBefore?:number|null}):Promise<{kind:'replay';receipts:MutationReceipt[]}|{kind:'commit';prepared:BoundedCommit;receipts:MutationReceipt[]}> {
  const {layout,root,manifest}=validateBoundedManifest(input.layout,input.state.root,input.state.manifest),commands=clone(input.commands),actor=clone(input.actor),operationId=input.operationId;
  if(!id(operationId)||!exact(actor,['id'])||!id(actor.id)||!input.policy||typeof input.policy.authorize!=='function'||typeof input.policy.validate!=='function')return fail('configuration');
  const required=requiredBoundedPageIds(manifest,commands,input.relationships);if(new Set(commands.map(c=>c.recordId)).size!==commands.length||new Set(commands.map(c=>c.mutationId)).size!==commands.length)return fail('integrity');
  const pages=new Map(input.state.pages.map(p=>[p.id,validateBoundedPage(manifest,p)]));if(pages.size!==input.state.pages.length||required.some(p=>!pages.has(p))||pages.size>BOUNDED_LIMITS.workingPages)return fail('integrity');
  const records=readBoundedRecords(layout,{root,manifest,pages:[...pages.values()]},[...commands.map(c=>c.recordId),...(input.relationships??[])]),transaction=manifest.transactions.find(t=>t[0]===operationId);
  const commitBefore=input.commitBefore??null;
  if(commitBefore!==null&&!number(commitBefore,1))return fail('configuration');
  const proofsByMutation = new Map(commands.map(command => {
    const index = manifest.mutations.findIndex(mutation => mutation[0] === command.mutationId);
    return [command.mutationId, index < 0 ? null : mutationProof(layout,manifest,pages,index)] as const;
  }));
  const originalsByMutation = new Map(commands.map(command => {
    const proof = proofsByMutation.get(command.mutationId);
    return [command.mutationId, proof ? proof.prior : records.get(command.recordId) ?? null] as const;
  }));
  const context = (): BoundedPolicyContext => ({
    layout:clone(layout),actor:clone(actor),commands:clone(commands),
    records:new Map([...records].map(([key,value])=>[key,clone(value)])),
    originalsByMutation:new Map([...originalsByMutation].map(([key,value])=>[key,clone(value)])),
    operationId,commitBefore,replay:!!transaction,phase:'guarded',
  });
  if(await input.policy.authorize(context())!==true)return fail('unauthorized');if(await input.policy.validate(context())!==true)return fail('policy-rejected');
  const receipts:MutationReceipt[]=[],plans:Extract<RecordMutationPlan,{kind:'apply'}>[]=[];
  for(const c of commands){const prior=proofsByMutation.get(c.mutationId);const plan=planRecordMutation({current:records.get(c.recordId)??null,previousMutation:prior?.ledger??null,command:c,actor,now:input.now,authorize:()=>true});receipts.push(plan.receipt);if(plan.kind==='apply')plans.push(plan);}
  if(transaction){if(plans.length||transaction[2]!==commands.length||commands.some((c,i)=>manifest.mutations[transaction[1]+i]?.[0]!==c.mutationId))return fail('integrity');return {kind:'replay',receipts};}
  if(plans.length!==commands.length)return fail('conflict');
  if(commitBefore!==null&&Date.parse(input.now)>=commitBefore)return fail('commit-expired');
  const nextManifest=clone(manifest),nextPages=new Map([...pages].map(([k,p])=>[k,clone(p)]));applyPlans(layout,nextManifest,nextPages,plans,operationId);
  const requestSha256=operationHash(actor.id,plans.map(p=>p.ledger)),next=rootFor(layout,nextManifest,{id:operationId,sha:requestSha256,actor:actor.id});validateBoundedManifest(layout,next,nextManifest);
  const changed=[...nextPages.values()].filter(p=>p.id>=manifest.pages.length||nextManifest.pages[p.id][2]!==manifest.pages[p.id][2]);changed.forEach(p=>validateBoundedPage(nextManifest,p));
  const prepared:BoundedCommit={protocol:BOUNDED_PROTOCOL,resourceKey:layout.key,expected:root,next,manifest:nextManifest,pages:changed,readPageIds:[...pages.keys()].sort((a,b)=>a-b),operationId,requestSha256,actorId:actor.id,commitBefore};
  if(boundedRequestBytes('commit',prepared)>BOUNDED_LIMITS.requestBytes||boundedResponseBytes('read',{root:next,manifest:nextManifest})>BOUNDED_LIMITS.responseBytes)return fail('capacity');return {kind:'commit',prepared,receipts};
}
export function createBoundedProvider(gateway:ReturnType<typeof createWriterGateway>,layoutInput:BoundedLayout) {
  const layout=validateBoundedLayout(layoutInput);
  async function readPages(base:BoundedManifestRead,pageIds:number[],options:{signal?:AbortSignal}={}):Promise<BoundedPage[]> {
    const verified=validateBoundedManifest(layout,base.root,base.manifest),ids=clone(pageIds);
    if(!Array.isArray(ids)||ids.length<1||ids.length>BOUNDED_LIMITS.readPagesPerRequest||new Set(ids).size!==ids.length||ids.some(id=>!number(id,0,verified.manifest.pages.length-1)))return fail('configuration');
    const x=await gateway.request<{root:BoundedRoot;pages:BoundedPage[]}>('read',{protocol:BOUNDED_PROTOCOL,resourceKey:layout.key,mode:'pages',expected:boundedCursor(verified.root),pageIds:ids},options);
    if(!exact(x,['root','pages'])||!same(x.root,verified.root)||!Array.isArray(x.pages)||x.pages.length!==ids.length||new Set(x.pages.map(p=>p.id)).size!==ids.length||x.pages.some(p=>!ids.includes(p.id)))return fail('conflict');
    if(boundedResponseBytes('read',x)>BOUNDED_LIMITS.responseBytes)return fail('capacity');return x.pages.map(p=>validateBoundedPage(verified.manifest,p));
  }
  return Object.freeze({
    async readManifest(options:{signal?:AbortSignal}={}):Promise<BoundedManifestRead>{const x=await gateway.request<BoundedManifestRead>('read',{protocol:BOUNDED_PROTOCOL,resourceKey:layout.key,mode:'manifest'},options);if(!exact(x,['root','manifest']))return fail('integrity');validateBoundedManifest(layout,x.root,x.manifest);if(boundedResponseBytes('read',x)>BOUNDED_LIMITS.responseBytes)return fail('capacity');return x;},
    readPages,
    async readPage(base:BoundedManifestRead,pageId:number,options:{signal?:AbortSignal}={}):Promise<BoundedPage>{return (await readPages(base,[pageId],options))[0];},
    async commit(prepared:BoundedCommit,options:{signal?:AbortSignal}={}):Promise<{status:'committed'|'replay'|'conflict'|'unknown'}>{if(prepared.resourceKey!==layout.key||boundedRequestBytes('commit',prepared)>BOUNDED_LIMITS.requestBytes)return fail('capacity');try{const result=await gateway.request<{status:string}>('commit',prepared,options);if(!exact(result,['status'])||!['committed','replay','conflict'].includes(result.status))return {status:'unknown'};return result as {status:'committed'|'replay'|'conflict'};}catch{return {status:'unknown'};}},
  });
}
/** Reads only current-record proof pages. Full history is an explicit audit path. */
export function createBoundedStore(config:{layout:BoundedLayout;policy:BoundedPolicy;now:()=>string;timeoutMs?:number},provider:ReturnType<typeof createBoundedProvider>) {
  const layout=validateBoundedLayout(config.layout),timeoutMs=config.timeoutMs??BOUNDED_LIMITS.operationTimeoutMs;
  if(!config.policy||typeof config.policy.authorize!=='function'||typeof config.policy.validate!=='function'||typeof config.now!=='function'||!number(timeoutMs,1,BOUNDED_LIMITS.operationTimeoutMs)||!provider||['readManifest','readPages','commit'].some(k=>typeof provider[k as keyof typeof provider]!=='function'))return fail('configuration');
  async function run<T>(options:BoundedOperationOptions,action:(signal:AbortSignal,check:()=>void,markCommit:()=>void)=>Promise<T>):Promise<T> {
    if(options.deadline!==undefined&&(!Number.isFinite(options.deadline)||options.deadline<0))return fail('configuration');
    const started=performance.now(),deadline=Math.min(started+timeoutMs,options.deadline??Infinity);
    const controller=new AbortController();let dispatched=false;const relay=()=>controller.abort();options.signal?.addEventListener('abort',relay,{once:true});if(options.signal?.aborted)relay();
    const error=()=>new BoundedStoreError(dispatched?'outcome-unknown':'unavailable'),check=()=>{if(controller.signal.aborted||performance.now()>=deadline)throw error();};
    let cancel:()=>void=()=>{};const cancelled=new Promise<never>((_,reject)=>{cancel=()=>reject(error());controller.signal.addEventListener('abort',cancel,{once:true});});
    const timer=setTimeout(relay,Math.max(0,deadline-started));
    try{check();return await Promise.race([action(controller.signal,check,()=>{check();dispatched=true;}),cancelled]);}
    finally{clearTimeout(timer);options.signal?.removeEventListener('abort',relay);controller.signal.removeEventListener('abort',cancel);controller.abort();}
  }
  async function collect(base:BoundedManifestRead,ids:number[],signal:AbortSignal,check:()=>void){const pages:BoundedPage[]=[];for(let i=0;i<ids.length;i+=BOUNDED_LIMITS.readPagesPerRequest){check();pages.push(...await provider.readPages(base,ids.slice(i,i+BOUNDED_LIMITS.readPagesPerRequest),{signal}));check();}return pages;}
  return Object.freeze({
    async mutate(input:{commands:RecordMutationCommand[];actor:MutationActor;operationId:string;relationships?:string[];commitBefore?:number|null},options:BoundedOperationOptions={}):Promise<BoundedOutcome>{
      const safe=clone(input);
      return run(options,async(signal,check,markCommit)=>{
        if(await config.policy.authorize({layout:clone(layout),actor:clone(safe.actor),commands:clone(safe.commands),operationId:safe.operationId,commitBefore:safe.commitBefore??null,records:new Map(),originalsByMutation:new Map(),replay:false,phase:'preflight'})!==true)return fail('unauthorized');check();
        const base=await provider.readManifest({signal});check();const ids=requiredBoundedPageIds(base.manifest,safe.commands,safe.relationships),pages=await collect(base,ids,signal,check);
        const result=await prepareBoundedCommit({layout,state:{...base,pages},...safe,now:config.now(),policy:config.policy});check();if(result.kind==='replay')return {status:'replay',receipts:result.receipts};markCommit();
        let outcome:Awaited<ReturnType<typeof provider.commit>>;
        try { outcome=await provider.commit(result.prepared,{signal}); }
        catch { return fail('outcome-unknown'); }
        check();
        if(!exact(outcome,['status'])||!['committed','replay','conflict','unknown'].includes(outcome.status))return {status:'unknown'};return outcome.status==='committed'||outcome.status==='replay'?{status:outcome.status,receipts:result.receipts}:{status:outcome.status};
      });
    },
    async load(recordId:string,actor:MutationActor,options:BoundedOperationOptions={}):Promise<GoogleWorkspaceRecord|null>{
      const safeActor=clone(actor);return run(options,async(signal,check)=>{
        const context = (phase:'preflight'|'guarded',records:ReadonlyMap<string,GoogleWorkspaceRecord>):BoundedPolicyContext => ({layout:clone(layout),actor:clone(safeActor),commands:[],records:new Map([...records].map(([key,value])=>[key,clone(value)])),originalsByMutation:new Map(),operationId:'read',commitBefore:null,replay:false,phase});
        if(!id(recordId)||await config.policy.authorize(context('preflight',new Map()))!==true)return fail('unauthorized');check();
        const base=await provider.readManifest({signal});check();const head=base.manifest.records.find(h=>h[0]===recordId);
        let records:ReadonlyMap<string,GoogleWorkspaceRecord>=new Map();
        if(head){const x=base.manifest.mutations[head[3]],ids=new Set([head[1],x[3],x[5],x[7]]);if(x[2]>=0)ids.add(base.manifest.mutations[x[2]][7]);const pages=await collect(base,[...ids],signal,check);records=readBoundedRecords(layout,{...base,pages},[recordId]);}
        if(await config.policy.authorize(context('guarded',records))!==true)return fail('unauthorized');check();return records.get(recordId)??null;
      });
    },
  });
}

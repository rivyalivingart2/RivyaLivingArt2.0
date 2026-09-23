/** Source registry reconciliation only. No environment, network, database or publication. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import ts from 'typescript';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const bytes=name=>fs.readFileSync(path.join(root,name));
const read=name=>JSON.parse(bytes(name));
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const capabilities=read('src/lib/product-capabilities.json');
// Evaluate only the three fixed pure schema modules, with their sole JSON dependency.
function schemaModule(name){
 const exports={};
 const output=ts.transpileModule(bytes('src/lib/'+name+'.ts').toString(),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 vm.runInNewContext(output,{exports,require:id=>{if(id==='./product-capabilities.json')return capabilities;throw Error('Unexpected source dependency: '+id);}},{timeout:1000,filename:name+'.ts'});
 return exports;
}
const {productFields,productSchemaRevision}=schemaModule('product-form');
const {fieldSchemaIssues}=schemaModule('field-schema');
const {bespokeSchemaV1}=schemaModule('bespoke-schema');
const candidate=read('docs/redesign/reviewed-publication.json');
const prior=read('docs/redesign/phase-4-products.json');
const products=candidate.products.map(p=>{
 if(!Object.hasOwn(capabilities,p.id)||!prior.products.some(row=>row.id===p.id&&row.slug===p.slug))throw Error('Missing identity/capability: '+p.id);
 const fields=productFields(p),issues=fieldSchemaIssues(fields),previousSchemaIssues=fieldSchemaIssues(p.fields);
 if(issues.length||previousSchemaIssues.length)throw Error(p.id+': '+[...issues,...previousSchemaIssues].join('; '));
 return {id:p.id,name:p.name,tier:p.tier,slug:p.slug,customizationRoute:'/pieces/'+p.slug+'/customize',capability:capabilities[p.id],sourceTemplateRevision:productSchemaRevision,previousSourceRevision:p.revision,previousFieldIds:p.fields.map(f=>f.id),proposedFields:fields,changed:JSON.stringify(fields)!==JSON.stringify(p.fields),proposalSha256:hash(JSON.stringify(fields)),correction:['DP110','DP119'].includes(p.id)?'Removed false required ring-size field; no broad name matching':null,disposition:'SOURCE_PROPOSAL_ONLY: deliberately apply to a Studio draft, review, then publish; existing records unchanged',validation:'Source schema shape only; product/device/runtime QA remains Phase 11'};
});
if(products.length!==120||new Set(products.map(p=>p.id)).size!==120||Object.keys(capabilities).length!==120)throw Error('Product scope must remain exactly 120');
if(fieldSchemaIssues(bespokeSchemaV1.fields).length)throw Error('Invalid bespoke registry');
const report={version:1,date:'2026-09-23',planRevision:'3.5',sourceBaseline:'a007d0fb0b2cc05f4ce55e0f3ebff6d66f51c17f',scope:'P5.1–P5.7 source implementation; no database writes or runtime QA',candidateSha256:hash(bytes('docs/redesign/reviewed-publication.json')),capabilitySha256:hash(bytes('src/lib/product-capabilities.json')),counts:{products:products.length,large:products.filter(p=>p.tier==='large').length,memory:products.filter(p=>p.tier==='memory').length,personal:products.filter(p=>p.tier==='personal').length,families:new Set(products.map(p=>p.capability.family)).size,changedProposals:products.filter(p=>p.changed).length,bespokeSchemas:1},versionPolicy:'Source template revision 3 is not a database published_version. Existing draft/published revisions remain untouched; Studio assigns the next durable published version on deliberate publication.',products,bespoke:{...bespokeSchemaV1,route:'/commission/customize',productId:null,disposition:'Form/review/copy source ready; no session/upload/save/handoff until Phase 6 v2 writer and permitted schema are integrated'},preservation:'Phase 4 candidate, schema inventory, media, drafts and saved inquiries are unchanged. All feasibility/preferences remain subject to atelier review.'};
fs.writeFileSync(path.join(root,'docs/redesign/phase-5-schemas.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.counts));

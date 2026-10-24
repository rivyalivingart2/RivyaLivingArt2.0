/** Compare explicit bundled-copy keys with existing local content; no writes to data. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {reconciliationDigest} from '../reconcile.mjs';
const root='test-results/exact-legacy-2026-10-21/phase3',docs='docs/restoration/exact-legacy-2026-10-21/phase3';
const messages=JSON.parse(readFileSync('../OLDWEBSITE-reference/messages/en.json','utf8')),snapshot=JSON.parse(readFileSync(root+'/before-private.json','utf8'));
const bindings=[
 ['Home.hero.headline','page:home','title'],['Home.hero.eyebrow','page:home','eyebrow'],['Home.hero.lead','page:home','description'],['Home.hero.ctaExplore','page:home','homepage.primary.label'],['Home.hero.ctaBespoke','page:home','homepage.secondary.label'],
 ['Nav.collections','page:site-copy','section:collections'],['Nav.search','page:site-copy','section:search-pieces'],['Nav.bespoke','page:site-copy','section:begin-piece'],['Footer.explore','page:site-copy','section:footer-explore'],['Footer.studio','page:site-copy','section:footer-atelier'],['Footer.contact','page:site-copy','section:footer-talk'],['Footer.ctaHeadline','page:site-copy','section:footer-statement']
];
const get=(obj,path)=>path.split('.').reduce((v,k)=>v?.[k],obj);
const decisions=bindings.flatMap(([sourceKey,contentKey,field])=>{
 const source=get(messages,sourceKey);assert.equal(typeof source,'string',sourceKey);
 const row=snapshot.documents.rivya_content.find(r=>r.content_key===contentKey);assert.ok(row,contentKey);
 return ['draft','published'].map(state=>{const doc=row[state],current=field.startsWith('section:')?doc?.sections.find(s=>s.id===field.slice(8))?.paragraphs[0]:get(doc,field);assert.equal(typeof current,'string',contentKey+'.'+field);return {sourceEntity:'SiteCopy (bundled fallback only)',sourceFile:'messages/en.json',sourceKey,destinationEntity:'rivya_content',destinationKey:contentKey,state,field,expectedVersion:row.version,sourceDigest:reconciliationDigest(source),destinationDigest:reconciliationDigest(current),decision:source===current?'UNCHANGED':'CONFLICT_KEEP_CURRENT',replaceApproved:false,patches:0};});
});
writeFileSync(root+'/copy-decisions-private.json',JSON.stringify(decisions,null,2)+'\n');
const summary={scope:'BUNDLED_DEFAULT_COMPARISON_NOT_DATABASE_RECORD_MATCH',bindings:bindings.map(([sourceKey,destinationKey,field])=>({sourceFile:'messages/en.json',sourceKey,destinationKey,field,rule:'KEEP_CURRENT; exact revision/value-digest approval required for a replacement'})),statesCompared:decisions.length,conflicts:decisions.filter(d=>d.decision==='CONFLICT_KEEP_CURRENT').length,unchanged:decisions.filter(d=>d.decision==='UNCHANGED').length,changesApplied:0,privateEvidence:'Ignored phase3/copy-decisions-private.json',limitation:'Deleted SiteCopy overrides are unknown; bundled defaults do not recover them.'};
writeFileSync(docs+'/copy-mapping.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify({comparisons:decisions.length,conflicts:summary.conflicts,unchanged:summary.unchanged,writes:0}));

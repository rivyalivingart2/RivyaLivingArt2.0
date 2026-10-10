import assert from 'node:assert/strict';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {validContent} from '../../src/lib/content-model.ts';
import {normalizedTitle} from '../../src/lib/editorial-intake.ts';
const root='docs/editorial-production/m9/',manifest=JSON.parse(await readFile(root+'content-manifest.json','utf8'));
const docs=(await Promise.all((await readdir(root+'batches')).filter(f=>f.endsWith('.json')).sort().map(f=>readFile(root+'batches/'+f,'utf8').then(JSON.parse)))).flat();
const old=JSON.parse(await readFile('test-results/old-design-migration/m9/source-content.json','utf8'));
assert.equal(docs.length,480);for(const kind of ['Journal','Portfolio','Testimonials','FAQs'])assert.equal(manifest.filter(m=>m.kind===kind).length,120);
const ids=new Set(),routes=new Set(),titles=new Set(),oldTitles=new Set(old.flatMap(r=>[r.draft?.title,r.published?.title].filter(Boolean).map(normalizedTitle)));
function prose(d){return [d.title,d.description,...d.sections.flatMap(s=>[s.heading,...s.paragraphs||[],...s.checklist||[]])].join(' ');}
function shingles(s){const words=s.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(Boolean),set=new Set();for(let i=0;i+4<=words.length;i++)set.add(words.slice(i,i+4).join(' '));return set;}
const all=docs.map(d=>({id:d.id,title:d.title,words:prose(d),set:shingles(prose(d)),new:true})),prior=old.flatMap(r=>[r.draft,r.published].filter(Boolean).map(d=>({id:r.id,title:d.title,words:prose(d),set:shingles(prose(d)),new:false})));
// Repeated disclosures and worksheet instructions are intentionally shared; exclude corpus-common phrases from similarity scoring.
const frequency=new Map();for(const d of all)for(const s of d.set)frequency.set(s,(frequency.get(s)||0)+1);
for(const d of [...all,...prior])d.distinct=new Set([...d.set].filter(s=>(frequency.get(s)||0)<10));
const similarity=(a,b)=>{let overlap=0;for(const s of a)if(b.has(s))overlap++;return overlap/Math.max(1,Math.min(a.size,b.size));};
const nearest=[];
for(let i=0;i<docs.length;i++){
 const d=docs[i];assert.ok(validContent(d),d.id);assert.ok(!ids.has(d.id)&&!routes.has(d.route)&&!titles.has(normalizedTitle(d.title)));assert.ok(!old.some(r=>r.id===d.id||r.route===d.route));assert.ok(!oldTitles.has(normalizedTitle(d.title)),d.title);ids.add(d.id);routes.add(d.route);titles.add(normalizedTitle(d.title));
 assert.equal(d.translations,undefined);assert.equal(d.review?.native,undefined);assert.equal(d.editorial?.evidence,undefined);assert.equal(d.editorial?.attribution,undefined);
 if(d.editorial?.kind==='testimonial'){assert.equal(d.editorial.classification,'fictional');assert.equal(d.headerImage,undefined);assert.match(d.sections[0].heading,/Fictional sample/);assert.doesNotMatch(prose(d),/\b(?:five[- ]star|5 stars|verified buyer|delivered on time|my purchase|our customer)\b/i);}
 if(d.editorial?.kind==='portfolio')assert.equal(d.editorial.classification,'concept');
 if(d.editorial?.kind==='faq')assert.ok(old.some(r=>r.route===d.editorial.policyHref&&r.published)||['/portfolio','/testimonials','/saved-pieces'].includes(d.editorial.policyHref));
 const a=all[i];let best={score:0,id:'',title:'',source:''};for(const b of [...all,...prior]){if(a.id===b.id)continue;const score=similarity(a.distinct,b.distinct);if(score>best.score)best={score:Number(score.toFixed(4)),id:b.id,title:b.title,source:b.new?'new-draft':'existing-read-only'};}nearest.push({id:a.id,title:a.title,...{closest:best}});
}
const flagged=nearest.filter(n=>n.closest.score>=0.4),report={checkedAt:new Date().toISOString(),drafts:docs.length,existingRecords:old.length,byKind:Object.fromEntries(['Journal','Portfolio','Testimonials','FAQs'].map(k=>[k,manifest.filter(m=>m.kind===k).length])),uniqueIdentities:true,uniqueRoutes:true,uniqueTitles:true,existingTitlesUnchanged:true,classificationChecks:true,translations:'English drafts; Hindi and Gujarati fallback; no native review asserted',method:'Four-word shingle containment across complete new and existing draft/public prose. Phrases shared by 10+ new drafts excluded as standard instructions/disclosures. Scores >=0.40 require manual review; scores are not proof of semantic originality.',flagged,nearest};
await writeFile(root+'duplicate-review.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({drafts:docs.length,flagged,max:Math.max(...nearest.map(n=>n.closest.score))}));

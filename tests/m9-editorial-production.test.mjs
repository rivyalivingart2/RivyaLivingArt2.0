import {test} from 'node:test';
import assert from 'node:assert/strict';
import {localEditorialRoot} from '../src/lib/local-editorial-store.ts';
import {readFileSync,readdirSync} from 'node:fs';
import {validContent} from '../src/lib/content-model.ts';
import {compilePageSnapshot} from '../src/lib/page-dependencies.ts';
test('local editorial files require every isolation guard and never replace missing production storage',()=>{
 const env={RIVYA_MIGRATION_LOCAL_SQL:'true',RIVYA_QA_TARGET:'migration-local',RIVYA_DATA_MODE:'isolated',DATABASE_URL:'postgresql://rivya_migration_qa@localhost:55439/rivya_migration_local'};
 assert.ok(localEditorialRoot(env).endsWith('editorial-store'));assert.equal(localEditorialRoot({}),null);
 for(const patch of [{VERCEL:'1'},{RIVYA_QA_TARGET:'other'},{RIVYA_DATA_MODE:'shared'},{DATABASE_URL:'postgresql://elsewhere/db'},{BLOB_READ_WRITE_TOKEN:'not-a-real-token'}])assert.throws(()=>localEditorialRoot({...env,...patch}));
});

test('M9 film is optional, restricted to Journal and Portfolio, and cannot introduce arbitrary media URLs',()=>{
 const root=new URL('../docs/editorial-production/m9/batches/',import.meta.url);
 const article=JSON.parse(readFileSync(new URL('journal-01.json',root)))[0];
 const portfolio=JSON.parse(readFileSync(new URL('portfolio-01.json',root)))[0];
 const testimonial=JSON.parse(readFileSync(new URL('testimonials-01.json',root)))[0];
 const faq=JSON.parse(readFileSync(new URL('faqs-01.json',root)))[0];
 for(const d of [article,portfolio])assert.ok(validContent({...d,film:'resin-pour'}));
 for(const d of [testimonial,faq])assert.equal(validContent({...d,film:'resin-pour'}),false);
 assert.equal(validContent({...article,film:'https://untrusted.invalid/video.mp4'}),false);
});

test('public editorial indexes work as draft dependencies; unknown routes remain blocked',()=>{
 const d=JSON.parse(readFileSync(new URL('../docs/editorial-production/m9/batches/faqs-01.json',import.meta.url)))[0];
 const source={products:[],content:[],media:[]};
 for(const route of ['/portfolio','/testimonials']){const copy={...d,sections:[{id:'next',heading:'Read more',paragraphs:['Explore the archive.'],policyHref:route}],editorial:{...d.editorial,policyHref:route}};assert.deepEqual(compilePageSnapshot(copy,source).issues,[]);copy.editorial.policyHref='/unpublished-example';assert.ok(compilePageSnapshot(copy,source).issues.some(s=>s.includes('unpublished destination')));}
});

test('M9 package contains 48 ten-entry batches, 120 distinct records per section and no invented genuine evidence',()=>{
 const root=new URL('../docs/editorial-production/m9/batches/',import.meta.url),files=readdirSync(root).filter(f=>f.endsWith('.json'));assert.equal(files.length,48);const ids=new Set(),routes=new Set();
 for(const f of files){const records=JSON.parse(readFileSync(new URL(f,root)));assert.equal(records.length,10);for(const d of records){assert.ok(validContent(d),d.title);assert.ok(!ids.has(d.id)&&!routes.has(d.route));ids.add(d.id);routes.add(d.route);assert.equal(d.review.native,undefined);assert.equal(d.translations,undefined);assert.equal(d.editorial?.attribution,undefined);assert.equal(d.editorial?.evidence,undefined);if(d.editorial?.kind==='portfolio')assert.equal(d.editorial.classification,'concept');if(d.editorial?.kind==='testimonial'){assert.equal(d.editorial.classification,'fictional');assert.equal(d.headerImage,undefined);}}}
 assert.equal(ids.size,480);for(const prefix of ['journal','portfolio','testimonials','faqs'])assert.equal(files.filter(f=>f.startsWith(prefix+'-')).length,12);
});

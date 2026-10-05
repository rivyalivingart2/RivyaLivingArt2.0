// Adds a representative image to a SOURCE-ONLY local collection fixture.
// Never runs against remote QA or production.
import assert from 'node:assert/strict';
import {qa,login,request,record} from '../c6-acceptance/common.mjs';
assert.equal(qa.RIVYA_QA_TARGET,'local');
const cookie=await login();
const result=await request(cookie,'/api/studio/content?view=editor&record=page%3Acollectible-design');
assert.equal(result.status,200);
const entry=result.data.entries.find(e=>e.document.id==='page:collectible-design');
const document=structuredClone(entry.document);delete document.pageSnapshot;delete document.homeSnapshot;
document.headerImage={path:'/media/generated/dp001-matching-detail-4x5.webp',alt:'Timber and blue resin detail',caption:'Design visualization',desktop:{x:50,y:50,ratio:'3/2'},mobile:{x:50,y:50,ratio:'4/5'}};
const saved=await request(cookie,'/api/studio/content',{document,version:entry.version,operation:'draft'});
assert.equal(saved.status,200);
const published=await request(cookie,'/api/studio/content',{document,version:saved.data.version,operation:'publish'});
assert.equal(published.status,200);
record('local-performance-fixture',{at:new Date().toISOString(),environment:'source-only local PostgreSQL',page:document.id,path:document.headerImage.path,revision:published.data.version,limitations:'Representative static local editorial image. Does not reproduce production Blob/CDN cold loads.'});
console.log('Representative collection image published to source-only loopback QA.');

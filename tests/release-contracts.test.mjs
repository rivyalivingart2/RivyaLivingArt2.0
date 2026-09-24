import {test} from 'node:test';
import assert from 'node:assert/strict';
import {baselineProducts,validProduct} from '../src/lib/shop-model.ts';
import {baselineContent,validContent} from '../src/lib/content-model.ts';
import {fieldVisible,validateAnswers,hasReviewedCapabilities} from '../src/lib/product-form.ts';
import {businessDate,businessDayStart,formatBusinessTime} from '../src/lib/business-time.ts';
import {isVisualPreviewAllowed} from '../src/lib/preview-mode.ts';
import {isPublicWebsiteAvailable} from '../src/lib/public-website.ts';

test('all 120 reviewed products have publishable identities and product-specific form capabilities',()=>{
 assert.equal(baselineProducts.length,120);
 assert.deepEqual(baselineProducts.map(p=>p.id).sort(),Array.from({length:120},(_,i)=>'DP'+String(i+1).padStart(3,'0')));
 for(const p of baselineProducts){assert.equal(validProduct(p,p),true,p.id);assert.equal(hasReviewedCapabilities(p.id),true,p.id);assert.ok(p.fields.some(f=>f.id==='city'&&f.required),p.id);}
});
for(const p of baselineProducts)test(p.id+' validates required, conditional and bounded customization',()=>{
 const answers={};
 for(const f of p.fields)if(!f.visibleWhen)answers[f.id]=f.type==='select'?f.options[0]:f.type==='number'?String(f.min):'QA specification';
 assert.deepEqual(validateAnswers(p.fields,answers),{});
 for(const f of p.fields.filter(f=>f.required&&!f.visibleWhen)){assert.ok(validateAnswers(p.fields,{...answers,[f.id]:''})[f.id],f.id);}
 for(const f of p.fields.filter(f=>f.visibleWhen)){
  assert.equal(fieldVisible(f,{[f.visibleWhen.field]:f.visibleWhen.value}),true);
  const active={...answers,[f.visibleWhen.field]:f.visibleWhen.value,[f.id]:''};
  if(f.required)assert.ok(validateAnswers(p.fields,active)[f.id]);
 }
 for(const f of p.fields.filter(f=>f.type==='number'))for(const value of ['0','-1','1.5',String(f.max+1),'NaN'])assert.ok(validateAnswers(p.fields,{...answers,[f.id]:value})[f.id]);
 for(const f of p.fields.filter(f=>f.type==='select'))assert.ok(validateAnswers(p.fields,{...answers,[f.id]:'Unapproved option'})[f.id]);
});
test('36 articles and all reviewed public pages validate before publication',()=>{
 assert.equal(baselineContent.length,47);assert.equal(baselineContent.filter(d=>d.kind==='article').length,36);
 for(const d of baselineContent)assert.equal(validContent(d,d),true,d.id);
});
test('shared Preview enables published pages independently from forbidden visual fixtures',()=>{
 const env={VERCEL_ENV:'preview',RIVYA_DATA_MODE:'shared',RIVYA_PUBLISHED_PREVIEW:'1',RIVYA_VISUAL_PREVIEW:'1'};
 assert.equal(isPublicWebsiteAvailable(env),true);assert.equal(isVisualPreviewAllowed(env),false);
 assert.equal(isPublicWebsiteAvailable({...env,RIVYA_PUBLISHED_PREVIEW:'0'}),false);
 assert.equal(isPublicWebsiteAvailable({VERCEL_ENV:'unknown',RIVYA_PUBLISHED_PREVIEW:'1'}),false);
 assert.equal(isVisualPreviewAllowed({...env,VERCEL_ENV:'production'}),false);
});
test('IST dates cross at 18:30 UTC regardless of machine timezone',()=>{
 assert.equal(businessDate('2026-09-24T18:29:59.999Z'),'2026-09-24');
 assert.equal(businessDate('2026-09-24T18:30:00.000Z'),'2026-09-25');
 assert.equal(businessDate('2026-12-31T18:30:00.000Z'),'2027-01-01');
 assert.equal(businessDayStart('2026-09-25'),'2026-09-24T18:30:00.000Z');
 assert.match(formatBusinessTime('2026-09-24T18:30:00.000Z'),/25 Sept 2026.*IST/);
 for(const date of ['2026-02-30','2026-9-1','invalid'])assert.throws(()=>businessDayStart(date));
});

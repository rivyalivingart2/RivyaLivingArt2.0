import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultHomepageLayout,validHomepageLayout,validPresentationChange,presentationPreviewHref} from '../src/lib/presentation-model.ts';
test('layout manifest rejects copy, selection, crop and prototype-like keys',()=>{
 assert.equal(validHomepageLayout(defaultHomepageLayout),true);
 for(const extra of [{productIds:['DP001']},{title:'replacement'},{heroImage:{path:'/other'}},{schemaVersion:2},{hero:'unknown'},JSON.parse('{"__proto__":{"hero":"split"}}')])assert.equal(validHomepageLayout({...defaultHomepageLayout,...extra}),false);
 assert.equal(validHomepageLayout(null),false);
 assert.equal(validHomepageLayout({...defaultHomepageLayout,hero:['split']}),false);
 assert.equal(validPresentationChange({operation:['publish'],version:1}),false);
});
test('publish accepts only an exact saved revision and never editor state',()=>{
 assert.equal(validPresentationChange({operation:'publish',version:2}),true);
 for(const body of [{operation:'publish',version:0},{operation:'publish',version:1,layout:defaultHomepageLayout},{operation:'draft',version:0,layout:defaultHomepageLayout,home:{}},{operation:'restore',version:2,restoredFrom:3},{operation:'restore',version:2,restoredFrom:0},{operation:'draft',version:-1,layout:defaultHomepageLayout}])assert.equal(validPresentationChange(body),false);
 assert.equal(validPresentationChange({operation:'draft',version:0,layout:defaultHomepageLayout}),true);
 assert.equal(validPresentationChange({operation:'restore',version:5,restoredFrom:2}),true);
});
test('saved preview fixes revision, locale and mobile view in its address',()=>{
 const u=new URL(presentationPreviewHref(12,'gu',true),'https://example.test');
 assert.equal(u.pathname,'/studio/presentation/preview');assert.equal(u.searchParams.get('version'),'12');assert.equal(u.searchParams.get('locale'),'gu');assert.equal(u.searchParams.get('viewport'),'mobile');
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {contentHealthReport} from '../src/lib/content-health-report.ts';
import {baselineContent} from '../src/lib/content-model.ts';
import {defaultSiteSettings} from '../src/lib/site-settings-model.ts';
import {studioRecordHref,studioRecordTarget} from '../src/lib/studio-record-links.ts';
const context={settings:defaultSiteSettings,owners:{'Content:page:imprint':'qa-editor'}};
const entry=(id,published=false)=>{const document=structuredClone(baselineContent.find(d=>d.id===id));return {document,published:published?structuredClone(document):null,visible:published,version:published?1:0};};
test('valid unpublished Imprint is distinguished from a broken public footer destination and review approval',()=>{
 const [row]=contentHealthReport([entry('page:imprint')],[],[],context);
 assert.equal(row.publication,'Unpublished');assert.equal(row.validation,'Valid structure');assert.equal(row.editorial,'Review not recorded');assert.equal(row.owner,'qa-editor');
 assert.ok(row.issues.some(i=>i.severity==='Blocker'&&i.reason.includes('unpublished content')));
 assert.ok(row.translation.includes('hi: English fallback'));
});
test('description and repeated cover checks remain advisory',()=>{
 const a=entry('page:our-story',true),b=entry('page:materials-care',true);b.document.image=a.document.image;a.document.description='Brief';
 const [row]=contentHealthReport([a,b],[],[],context);
 assert.equal(row.validation,'Valid structure');assert.ok(row.issues.some(i=>i.reason.includes('cover is reused')&&i.severity==='Advisory'));
 assert.ok(row.issues.some(i=>i.reason.includes('Short search')&&i.severity==='Advisory'));
});
test('missing mobile crop is blocking and links to the exact homepage chapter',()=>{
 const home=entry('page:home');delete home.document.homepage.sections.find(s=>s.id==='material').image.mobile;
 const row=contentHealthReport([home],[],[],context)[0],issue=row.issues.find(i=>i.reason.includes('mobile crop missing'));
 assert.equal(issue.severity,'Blocker');assert.match(issue.href,/field=section-material/);
 const url=new URL(issue.href,'http://localhost');assert.equal(studioRecordTarget('content',url.searchParams).field,'section-material');
});
test('unchanged translation after English draft changes is stale, never automatically reviewed',()=>{
 const e=entry('page:imprint',true);e.document.translations={hi:{title:'शीर्षक'}};e.published.translations=structuredClone(e.document.translations);e.document.title='Changed English title';
 assert.match(contentHealthReport([e],[],[],context)[0].translation,/hi: incomplete/);
});
test('unknown and unpublished journal navigation has an exact administrator repair target',()=>{
 const settings=structuredClone(defaultSiteSettings);settings.navigation.header=[{id:'missing-story',label:{en:'Missing story'},href:'/journal/missing-story',visible:true,newTab:false}];
 const row=contentHealthReport([],[],[],{settings,owners:{}})[0];assert.equal(row.validation,'Blocking destination');assert.match(row.href,/menu=header&record=missing-story&field=href/);
 assert.equal(studioRecordTarget('content',new URLSearchParams('record=page:home&field=section-../../evil')).field,'title');
 assert.match(studioRecordHref('content','page:home','section-material'),/field=section-material/);
});

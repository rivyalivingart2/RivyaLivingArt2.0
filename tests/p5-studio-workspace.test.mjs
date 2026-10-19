import {test} from 'node:test';
import assert from 'node:assert/strict';
import {studioDestinations,studioTasks,studioTaskHref,isStudioTask} from '../src/lib/studio-work-queue.ts';
import {studioModules,studioNavigationModules,studioModule,studioRoute} from '../src/lib/studio-modules.ts';
import {businessDate} from '../src/lib/business-time.ts';

test('navigation search never offers administrator-only pages to editors or invents a route',()=>{
 for(const query of ['','staff','settings','navigation','administration','orders','pages','site images','SCRAPER','../staff']){
  for(const item of studioDestinations(false,query)){assert.equal(item.adminOnly,false);assert.equal(studioModule(new URL(item.href,'https://studio.test').pathname.split('/')[2]||''),studioModules.find(m=>m.key===item.key));}
 }
 assert.equal(studioDestinations(false,'staff').length,0);assert.equal(studioDestinations(true,'staff').length,1);
 assert.equal(studioDestinations(true,'scraper').length,0);assert.equal(studioDestinations(true,'../staff').length,0);
});
test('page finder supports existing aliases and all query words without changing module identity',()=>{
 assert.equal(studioDestinations(false,'orders')[0].key,'inquiries');assert.equal(studioDestinations(false,'site images')[0].key,'site-images');
 assert.equal(studioDestinations(true,'website content').some(m=>m.key==='content-health'),true);
 assert.equal(studioDestinations(true).length,studioNavigationModules.length);
});

test('inactive tools leave navigation while their guarded bookmarks remain registered',()=>{
 for(const key of ['import','subscribers']){
  assert.equal(studioDestinations(true).some(m=>m.key===key),false);
  assert.deepEqual(studioDestinations(true,key),[]);
  assert.equal(studioRoute([key])?.adminOnly,true);
  assert.equal(studioModule(key)?.key,key);
 }
 assert.equal(studioNavigationModules.length,studioModules.length-2);
 assert.deepEqual(studioDestinations(false).map(m=>m.key),studioModules.filter(m=>!m.adminOnly).map(m=>m.key));
});
test('task cards round-trip only the four supported queue filters and request a readable list',()=>{
 for(const task of studioTasks){const target=new URL(studioTaskHref(task),'https://studio.test');assert.equal(target.pathname,'/studio/inquiries');assert.equal(target.searchParams.get('task'),task);assert.equal(target.searchParams.get('mode'),'list');assert.equal(isStudioTask(task),true);}
 for(const value of ['',null,{},'all-staff','__proto__','today OR true'])assert.equal(isStudioTask(value),false);
});
test('follow-up task boundaries use the same IST date at 00:15 and 23:45',()=>{
 assert.equal(businessDate('2026-10-01T00:15:00+05:30'),'2026-10-01');assert.equal(businessDate('2026-10-01T23:45:00+05:30'),'2026-10-01');
 assert.equal(businessDate('2026-09-30T18:29:59Z'),'2026-09-30');assert.equal(businessDate('2026-09-30T18:30:00Z'),'2026-10-01');
});

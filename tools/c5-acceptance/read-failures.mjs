import {login,launch,origin,record,output} from './common.mjs';
import {expect as baseExpect} from '@playwright/test';
const expect=baseExpect.configure({timeout:30000});
const {browser,context}=await launch(await login()),rows=[];
const cases=[
 ['shell','/studio','/api/studio/workspace','Retry'],
 ['overview','/studio','/api/studio/work-queue','Retry queue','Refresh overview'],
 ['inquiries','/studio/inquiries','/api/studio/orders','Refresh inquiries','Refresh inquiries'],
 ['follow-ups','/studio/follow-ups','/api/studio/orders','Refresh inquiries','Refresh inquiries'],
 ['products','/studio/products','/api/studio/workspace?view=catalogue','Reload catalogue','Reload catalogue'],
 ['content','/studio/content','/api/studio/content','Retry content records'],
 ['site-copy','/studio/site-copy','/api/studio/content','Retry content records'],
 ['media','/studio/media','/api/studio/media','Retry media records'],
 ['site-images','/studio/site-images','/api/studio/content','Retry loading placements'],
 ['content-health','/studio/content-health','/api/studio/health-context','Retry checks','Recheck saved records'],
 ['translations','/studio/translations','/api/studio/content','Refresh coverage','Refresh coverage'],
 ['navigation','/studio/navigation','/api/studio/site-settings','Reload','Reload'],
 ['route-review','/studio/route-review','/api/studio/route-review','Recheck published sources','Recheck published sources'],
 ['activity','/studio/activity','/api/studio/operations?view=activity','Refresh','Refresh'],
 ['settings','/studio/settings','/api/studio/operations?view=settings','Refresh','Refresh'],
 ['staff-shell','/studio/staff','/api/studio/workspace','Retry'],
 ['legacy-shell','/studio/legacy','/api/studio/workspace','Retry'],
];
try{
 for(const [module,path,api,retry,refresh] of cases){
  const page=await context.newPage(),errors=[],row={module,initialFailure:false,retry:false,staleFailure:null,errors};let fail=true,hits=0;
  page.setDefaultTimeout(25000);page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/api/studio/**',route=>{const u=new URL(route.request().url()),p=u.pathname+u.search;if(route.request().method()==='GET'&&(api.includes('?')?p===api:u.pathname===api)&&fail){hits++;return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'C5 simulated service interruption.'})});}return route.continue();});
  try{
   const initialError=module==='translations'?'Translation coverage is unavailable.':module==='route-review'?'Published destinations could not be checked.':'C5 simulated service interruption.';
   const staleError=module==='translations'?'Translation coverage could not be refreshed.':module==='route-review'?'The recheck failed.':'C5 simulated service interruption.';
   await page.goto(origin+path);await expect(page.getByText(initialError,{exact:false}).first()).toBeVisible();row.initialFailure=hits>0;
   fail=false;const response=page.waitForResponse(r=>r.url().includes(api)&&r.status()===200);await page.getByRole('button',{name:retry,exact:true}).first().click();await response;
   await expect(page.getByText(initialError,{exact:false})).toHaveCount(0);row.retry=true;
   if(refresh){const count=await page.locator('#main-content input,#main-content a,#main-content tbody tr').count();fail=true;await page.getByRole('button',{name:refresh,exact:true}).first().click();await expect(page.getByText(staleError,{exact:false}).first()).toBeVisible();row.staleFailure={retained:await page.locator('#main-content input,#main-content a,#main-content tbody tr').count()>=count,warning:await page.locator('#main-content [role="status"],#main-content [role="alert"]').allTextContents()};}
  }catch(e){row.failure=e.message.slice(0,750);if(module==='navigation')await page.screenshot({path:output+'/navigation-before.png'});}
  rows.push(row);record('read-failures',rows);console.log(JSON.stringify({module,initialFailure:row.initialFailure,retry:row.retry,staleFailure:row.staleFailure?.retained,errors,failure:row.failure}));await page.close();
 }
}finally{await browser.close();}
if(rows.some(r=>r.failure||r.errors.length||!r.initialFailure||!r.retry||r.staleFailure&&!r.staleFailure.retained))process.exitCode=1;

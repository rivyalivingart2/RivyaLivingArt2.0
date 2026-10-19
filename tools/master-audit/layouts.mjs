import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {localBrowser,origin} from '../old-design-migration/local-browser.mjs';
const out='test-results/rivya-master-audit';await mkdir(out+'/screenshots',{recursive:true});
const {browser,context,api}=await localBrowser();
const report={at:new Date().toISOString(),environment:'Isolated published QA with fictional retained content',browser:browser.version(),dpr:1,physicalDevice:false,rows:[],errors:[],blockedWrites:[]};
await context.route('**/api/studio/**',async route=>{if(!['GET','HEAD'].includes(route.request().method())){report.blockedWrites.push(new URL(route.request().url()).pathname);await route.abort();}else await route.continue();});
const save=()=>writeFile(out+'/layouts.json',JSON.stringify(report,null,2)+'\n');
const entries=(await api('/api/studio/content?view=editor')).entries;
const published=entries.filter(e=>e.visible&&e.published);
const modules=JSON.parse(await readFile('docs/redesign/modern-design-2026-10-13/studio-coverage.json','utf8'));
const routes=['/','/collectible-design','/memory-art','/personal-art','/pieces/river-channel','/pieces/river-channel/customize','/search','/saved-pieces','/commission','/commission/customize','/inquiry/received','/our-story','/process','/materials-care','/architects','/journal','/portfolio','/testimonials','/faq','/contact','/privacy','/terms','/accessibility','/imprint','/shipping-delivery','/returns-cancellations','/studio/login','/studio/request-access','/studio/forgot-password','/studio/set-password','/not-a-real-audit-route'];
for(const predicate of [d=>d.kind==='article',d=>d.editorial?.kind==='portfolio',d=>d.editorial?.kind==='testimonial',d=>d.editorial?.kind==='faq',d=>!!d.landing]){
 const entry=published.find(e=>predicate(e.document));if(entry)routes.push(entry.document.route);else report.errors.push({scope:'coverage',message:'No published QA representative for '+predicate.toString()});
}
const studioRoutes=Array.isArray(modules)?modules.map(m=>m.path||m.route||m.href):[];
report.moduleShape=Array.isArray(modules)?Object.keys(modules[0]||{}):Object.keys(modules);
if(!studioRoutes.length)throw new Error('Studio inventory shape needs review');
for(const route of studioRoutes)if(route&&!routes.includes(route))routes.push(route);
const widths=[1920,1440,1200,992,768,512,390,320];
try{
 const page=await context.newPage();page.setDefaultTimeout(12000);
 for(const width of widths){
  const height=width>=1200?1000:width>=768?1024:844;await page.setViewportSize({width,height});
  for(const route of routes){
   const errors=[];const onError=e=>errors.push(e.message);page.on('pageerror',onError);
   const name=route==='/'?'home':route.replace(/^\//,'').replace(/[^\w-]/g,'-');
   try{
    const response=await page.goto(origin+route,{waitUntil:'load',timeout:30000});
    await page.locator('h1').first().waitFor({timeout:12000});
    await page.locator('[aria-busy="true"]').first().waitFor({state:'hidden',timeout:20000}).catch(()=>{});
    await page.waitForFunction(()=>![...document.querySelectorAll('main [role="status"],#main-content [role="status"]')].some(e=>/^Loading /.test(e.textContent||'')),{},{timeout:12000}).catch(()=>{});
    await page.evaluate(()=>document.fonts.ready);
    const lazyImages=page.locator('main img,#main-content img');
    for(const image of await lazyImages.all())if(await image.isVisible()){
     await image.scrollIntoViewIfNeeded({timeout:3000}).catch(()=>{});
     await image.evaluate(i=>i.decode().catch(()=>{}));
    }
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    const data=await page.evaluate(()=>({actualPath:location.pathname,title:document.title,h1:[...document.querySelectorAll('h1')].map(e=>e.textContent),lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth>innerWidth+1,scrollWidth:document.documentElement.scrollWidth,contentHeight:document.documentElement.scrollHeight,busy:document.querySelectorAll('[aria-busy="true"]').length,brokenImages:[...document.querySelectorAll('main img,#main-content img')].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),alerts:[...document.querySelectorAll('[role="alert"]')].map(e=>e.textContent?.slice(0,200)),mainCount:document.querySelectorAll('main,[role="main"]').length,focusableCount:document.querySelectorAll('a[href],button,input,select,textarea,summary').length}));
    const screenshot=`screenshots/${width}-${name}.png`;
    await page.screenshot({path:out+'/'+screenshot,fullPage:(width===1440||width===390)&&data.contentHeight<25000});
    report.rows.push({route,width,height,dpr:1,status:response.status(),...data,pageErrors:errors,screenshot});
   }catch(error){report.errors.push({route,width,error:error.message.split('\n')[0]});}
   finally{page.off('pageerror',onError);await save();}
  }
  console.log(JSON.stringify({width,rows:report.rows.length,errors:report.errors.length}));
 }
 for(const [route,width,height] of [['/',320,480],['/studio/login',320,480],['/commission',390,568],['/studio/products',390,568]]){
  await page.setViewportSize({width,height});await page.goto(origin+route,{waitUntil:'networkidle'});
  report.rows.push({route,width,height,shortHeight:true,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)});
  await page.screenshot({path:out+`/screenshots/short-${route.replaceAll('/','-')||'home'}-${width}.png`,fullPage:true});
 }
}finally{await browser.close();report.finishedAt=new Date().toISOString();await save();}
console.log(JSON.stringify({rows:report.rows.length,errors:report.errors.length,overflow:report.rows.filter(r=>r.overflow).map(r=>({route:r.route,width:r.width}))}));

import {chromium} from 'playwright';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const out='output/playwright/redesign-phase2';mkdirSync(out,{recursive:true});
const report={at:new Date().toISOString(),scope:'Local Phase 2 harness; browser emulation, not native/device/production acceptance',checks:[],pages:[],errors:[],externalRequests:[]};
const check=(name,pass,detail)=>{report.checks.push({name,pass,...(detail?{detail}:{})});if(!pass)console.log('FAIL',name,detail??'');};
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 for(const spec of [{name:'desktop',width:1440,height:1000,reducedMotion:'no-preference'},{name:'mobile',width:390,height:844,isMobile:true,hasTouch:true,reducedMotion:'no-preference'},{name:'reduced',width:1440,height:1000,reducedMotion:'reduce'}]){
  const {name,width,height,...options}=spec,context=await browser.newContext({viewport:{width,height},...options});const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4179'))report.externalRequests.push(r.url());});
  await page.goto('http://127.0.0.1:4179/');await page.waitForFunction(()=>window.phase2Preview);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(800);
  let state=await page.evaluate(()=>window.phase2Preview.inspect());check(`${name}: motion capability`,name==='desktop'?state.smooth&&state.triggers>0:!state.smooth&&state.triggers===0,state);
  check(`${name}: controls report effective capability`,name==='desktop'?await page.getByRole('button',{name:'Motion on',exact:true}).isEnabled():await page.getByRole('button',{name:'Static motion',exact:true}).isDisabled()&&await page.getByRole('button',{name:'Native scrolling',exact:true}).isDisabled());
  check(`${name}: video starts paused with preload none`,await page.locator('video').evaluate(v=>v.paused&&v.preload==='none'));
  check(`${name}: no opening overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`${out}/${name}-opening.png`});
  await page.getByRole('link',{name:'Explore the material'}).click();await page.waitForTimeout(900);
  check(`${name}: hash navigation reaches film`,await page.locator('#material').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<160));
  await page.getByRole('button',{name:'Play film',exact:true}).click();await page.waitForTimeout(1000);check(`${name}: video plays`,await page.locator('video').evaluate(v=>!v.paused&&v.currentTime>0));
  await page.getByRole('button',{name:'Pause film',exact:true}).click();check(`${name}: video pauses`,await page.locator('video').evaluate(v=>v.paused));
  await page.screenshot({path:`${out}/${name}-film.png`});
  await page.locator('.image-open').first().click();await page.waitForTimeout(250);check(`${name}: crop dialog opens`,await page.locator('dialog').isVisible());
  if(name==='desktop')check('desktop: modal suspends motion',await page.evaluate(()=>window.phase2Preview.inspect().triggers===0));
  await page.screenshot({path:`${out}/${name}-crop.png`});await page.keyboard.press('Escape');check(`${name}: Escape closes and restores focus`,await page.locator('.image-open').first().evaluate(el=>document.activeElement===el)&&!await page.locator('dialog').isVisible());
  await page.locator('#media').scrollIntoViewIfNeeded();await page.waitForTimeout(800);await page.screenshot({path:`${out}/${name}-media.png`});
  if(name==='desktop'){
   await page.getByRole('button',{name:'Motion on',exact:true}).click();await page.waitForTimeout(250);state=await page.evaluate(()=>window.phase2Preview.inspect());check('desktop: motion off removes all triggers and smooth anchors',!state.smooth&&state.triggers===0,state);
   check('desktop: teardown clears picture transform',await page.locator('[data-rv-parallax] picture').evaluate(el=>getComputedStyle(el).transform==='none'));
   await page.getByRole('button',{name:'Motion off',exact:true}).click();await page.waitForTimeout(250);check('desktop: motion can be re-enabled',await page.evaluate(()=>window.phase2Preview.inspect().smooth));
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(250);check('desktop: live reduced motion change tears down smooth anchors',!(await page.evaluate(()=>window.phase2Preview.inspect().smooth)));await page.emulateMedia({reducedMotion:'no-preference'});
  }
  await page.evaluate(()=>window.phase2Preview.unmount());await page.waitForTimeout(150);state=await page.evaluate(()=>window.phase2Preview.inspect());check(`${name}: unmount cleans triggers and smooth anchors`,!state.smooth&&state.triggers===0,state);
  await page.goto('http://127.0.0.1:4179/studio');await page.waitForFunction(()=>window.phase2Preview);await page.evaluate(()=>document.fonts.ready);
  check(`${name}: Studio disclosure uses dark-surface foreground`,await page.locator('.studio-preview aside .small').evaluate(el=>getComputedStyle(el).color==='rgb(169, 180, 188)'));
  check(`${name}: Studio uses native scrolling`,!(await page.evaluate(()=>window.phase2Preview.inspect().smooth)));
  check(`${name}: Studio no horizontal overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.getByLabel('Search preview images').fill('no-such-image');check(`${name}: search empty state`,await page.getByRole('status').first().textContent().then(t=>t.includes('No preview images')));
  await page.getByLabel('Search preview images').fill('');check(`${name}: search restores six images`,await page.locator('.studio-row').count()===6);
  await page.getByRole('button',{name:'Test local confirmation'}).click();check(`${name}: local confirmation discloses no write`,await page.getByRole('status').textContent().then(t=>t.includes('No record was saved')));
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${out}/${name}-studio.png`});
  report.pages.push({name,width,height});await context.close();
 }
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:1000}}),p=await nojs.newPage();await p.goto('http://127.0.0.1:4179/');check('No JavaScript: heading and content visible',await p.getByRole('heading',{level:1}).isVisible()&&await p.locator('#reading article').textContent().then(t=>t.includes('A statement table')));await nojs.close();
 // The original whole-application fingerprint belongs to the dated Phase 2
 // receipt. Subsequent approved application releases intentionally changed it.
 const inputs=Object.keys(JSON.parse(readFileSync('output/redesign-phase2/bundle-meta.json','utf8')).inputs).map(path=>path.replaceAll('\\','/'));
 const prototypeFiles=['MaterialFilm.tsx','MotionSurface.tsx','ResponsivePicture.tsx','primitives.tsx','motion-capability.ts'];
 check('Preview bundles its archived foundation without application source or removed GSAP wrapper',prototypeFiles.every(file=>inputs.includes(`experiments/redesign-phase2/foundation/${file}`))&&!inputs.some(path=>path.startsWith('src/')||path.includes('node_modules/@gsap/react/')));
 check('No browser runtime errors',report.errors.length===0,report.errors);check('No external requests from preview',report.externalRequests.length===0);
}finally{await browser.close();writeFileSync(`${out}/review.json`,JSON.stringify(report,null,2));}
console.log(JSON.stringify({checks:report.checks.length,failed:report.checks.filter(c=>!c.pass),errors:report.errors},null,2));
if(report.checks.some(c=>!c.pass)||report.errors.length)process.exitCode=1;

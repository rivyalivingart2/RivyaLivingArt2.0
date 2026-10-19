import {chromium} from '@playwright/test';
import {mkdir, writeFile} from 'node:fs/promises';

// Read-only browser reproduction. This never imports authenticated sessions.
const productionLanguageOnly = process.argv.includes('--production-language');
const afterFix = process.argv.includes('--after');
const origin = productionLanguageOnly ? 'https://www.rivyalivingart.com' : 'http://127.0.0.1:4199';
const output = 'test-results/rivya-master-audit';
const articlePath = '/journal/a-room-begins-with-a-statement-table';
if (!['127.0.0.1','www.rivyalivingart.com'].includes(new URL(origin).hostname)) throw new Error('Approved audit origin required.');
await mkdir(output, {recursive:true});
const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const report = {
  at:new Date().toISOString(), origin, browser:browser.version(),
  environment:{viewport:{width:1440,height:900}, deviceScaleFactor:1, isMobile:false, hasTouch:false, reducedMotion:'no-preference'},
  scope:productionLanguageOnly?'Fresh anonymous public production contexts for language GETs only; no authenticated session, application, database or publication changes.':'Fresh isolated browser contexts against local server; GET/HEAD traffic only. No application, database, publication or production session changes.',
  blockedWrites:[], errors:[], captures:[], hardware:[], pause:null, languages:[], conclusions:[]
};
const receiptName=productionLanguageOnly?'motion-seo-repro-production-language.json':afterFix?'motion-seo-repro-after.json':'motion-seo-repro.json';
const persist = () => writeFile(`${output}/${receiptName}`, JSON.stringify(report,null,2)+'\n');
async function contextWithCapabilities(memory=8, cores=8) {
  const context = await browser.newContext(report.environment);
  await context.route('**/*', async route => {
    const request=route.request();
    if (!['GET','HEAD'].includes(request.method())) {
      report.blockedWrites.push({method:request.method(),path:new URL(request.url()).pathname});
      return route.abort();
    }
    return route.continue();
  });
  await context.addInitScript(({memory,cores}) => {
    Object.defineProperty(navigator,'deviceMemory',{value:memory,configurable:true});
    Object.defineProperty(navigator,'hardwareConcurrency',{value:cores,configurable:true});
    const connection=new EventTarget();
    connection.saveData=false;connection.effectiveType='4g';
    Object.defineProperty(navigator,'connection',{value:connection,configurable:true});
  },{memory,cores});
  return context;
}
async function settle(page) {
  await page.locator('main h1').first().waitFor({state:'visible'});
  await page.evaluate(()=>document.fonts.ready);
  // Both optional runtime timers are <=600ms; allow import and two stable samples.
  await page.waitForTimeout(1800);
}
async function capture(page,name) {
  if(afterFix&&!productionLanguageOnly)name+='-after';
  await page.screenshot({path:`${output}/${name}.png`});
  report.captures.push(`${name}.png`);
}
async function hardwareState(page) {
  return page.evaluate(() => ({
    deviceMemory:navigator.deviceMemory,hardwareConcurrency:navigator.hardwareConcurrency,
    fine:matchMedia('(pointer:fine)').matches,hover:matchMedia('(hover:hover)').matches,
    reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,
    visible:!document.hidden,canvas:document.querySelector('[data-cinematic-canvas]')?.dataset.cinemaState,
    home:document.querySelector('[data-home-motion]')?.dataset.homeMotion,
    mediaTransforms:[...document.querySelectorAll('[data-home-parallax-layer]')].slice(0,2).map(e=>getComputedStyle(e).transform)
  }));
}
try {
 if(!productionLanguageOnly) {
  for(const [memory,cores] of [[8,8],[4,8],[8,4]]) {
    const context=await contextWithCapabilities(memory,cores);
    const page=await context.newPage();page.setDefaultTimeout(20000);
    try {
      await page.goto(origin,{waitUntil:'domcontentloaded'});await settle(page);
      const first=await hardwareState(page);await page.waitForTimeout(500);const settled=await hardwareState(page);
      await page.evaluate(()=>window.scrollTo({top:innerHeight*.4,behavior:'instant'}));
      await page.waitForTimeout(700);const scrolled=await hardwareState(page);
      const stable=first.canvas===settled.canvas&&first.home===settled.home;
      report.hardware.push({memory,cores,first,settled,scrolled,stable,
        homeMediaMoved:settled.mediaTransforms.some((v,i)=>v!==scrolled.mediaTransforms[i])});
      if(memory===4&&cores===8)await capture(page,'motion-low-memory-4gb-8core');
    } catch(error) {report.errors.push({scenario:`hardware ${memory}/${cores}`,message:error.message});}
    finally {await context.close();await persist();}
  }

  {
    const context=await contextWithCapabilities();const page=await context.newPage();page.setDefaultTimeout(20000);
    try {
      await page.goto(origin+'/collectible-design',{waitUntil:'domcontentloaded'});await settle(page);
      const supported=await page.evaluate(()=>CSS.supports('animation-timeline','view()'));
      const candidates=await page.locator('main section').evaluateAll(elements=>elements.map((el,index)=>{
        const css=getComputedStyle(el),rect=el.getBoundingClientRect();
        return {index,id:el.id,heading:el.querySelector('h2')?.textContent||'',animationName:css.animationName,
          animationTimeline:css.animationTimeline,top:rect.top+scrollY,height:rect.height};
      }).filter(e=>e.animationName.includes('section-arrival')));
      report.pause={supported,candidates};
      if(!supported||!candidates.length)throw new Error('No actual supported section-arrival element found; do not infer reproduction.');
      // Select an observed live element; mark it only in this browser DOM.
      const candidate=candidates.find(c=>c.top>900)||candidates[0];
      async function target() {
        const section=page.locator('main section').nth(candidate.index);
        if(await section.getAttribute('id')!==candidate.id)throw new Error('Section identity changed after reload.');
        return section;
      }
      async function sample(label) {
        const section=await target();
        const metrics=await section.evaluate(el=>{
          const rect=el.getBoundingClientRect(),css=getComputedStyle(el);
          const translation=css.transform==='none'?0:new DOMMatrixReadOnly(css.transform).m42;
          return {documentTop:rect.top+scrollY-translation,height:rect.height};
        });
        const observations=[];
        for(const fraction of [.97,.90,.80,.65,.40]) {
          const requested=Math.max(0,metrics.documentTop-900*fraction);
          await page.evaluate(top=>window.scrollTo({top,behavior:'instant'}),requested);
          await page.waitForTimeout(160);
          observations.push(await section.evaluate((el,requested)=>{
            const css=getComputedStyle(el),rect=el.getBoundingClientRect();
            return {requestedScroll:requested,scrollY,rectTop:rect.top,transform:css.transform,
              animationName:css.animationName,animationTimeline:css.animationTimeline,animationPlayState:css.animationPlayState,
              canvas:document.querySelector('[data-cinematic-canvas]')?.dataset.cinemaState,
              preference:document.querySelector('[data-cinematic-canvas]')?.dataset.visualEffects};
          },requested));
          if(fraction===.90&&['enabled','paused'].includes(label))await capture(page,`motion-css-section-${label}`);
        }
        return {label,observations,moves: new Set(observations.map(o=>o.transform)).size>1};
      }
      report.pause.enabled=await sample('enabled');
      const control=page.getByRole('button',{name:'Pause decorative visual effects',exact:true});
      await control.click();await page.waitForFunction(()=>document.querySelector('[data-cinematic-canvas]')?.dataset.cinemaState==='paused');
      report.pause.paused=await sample('paused');
      await page.reload({waitUntil:'domcontentloaded'});await settle(page);
      report.pause.reloaded=await sample('reloaded');
      report.pause.reloadedControlPressed=await control.getAttribute('aria-pressed');
      await control.click();await page.waitForFunction(()=>document.querySelector('[data-cinematic-canvas]')?.dataset.cinemaState==='active');
      report.pause.resumed=await sample('resumed');
    } catch(error) {report.errors.push({scenario:'CSS section pause',message:error.message});}
    finally {await context.close();await persist();}
  }

 }
  for(const locale of ['en','hi','gu']) {
    const context=await contextWithCapabilities();const page=await context.newPage();page.setDefaultTimeout(20000);
    try {
      // Language preference only. No authenticated cookie is imported or exported.
      await context.addCookies([{name:'NEXT_LOCALE',value:locale,url:origin,sameSite:'Lax'}]);
      const response=await page.goto(origin+articlePath,{waitUntil:'domcontentloaded'});await settle(page);
      const data=await page.evaluate(()=>{
        const scripts=[...document.querySelectorAll('script[type="application/ld+json"]')].map(el=>JSON.parse(el.textContent||'{}'));
        const nodes=scripts.flatMap(value=>value['@graph']||[value]);
        const article=nodes.find(value=>value['@type']==='Article');
        const heading=document.querySelector('main h1');
        const body=document.querySelector('main [data-public-part="prose"] section p');
        return {htmlLang:document.documentElement.lang,htmlDir:document.documentElement.dir,
          heading:heading?.textContent,inheritedHeadingLang:heading?.closest('[lang]')?.getAttribute('lang'),
          bodyText:body?.textContent,inheritedBodyLang:body?.closest('[lang]')?.getAttribute('lang'),
          breadcrumbLanguages:[...document.querySelectorAll('main nav a span[lang]')].slice(0,2).map(el=>({text:el.textContent,language:el.getAttribute('lang')})),
          documentTitle:document.title,canonical:document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
          article:article?{type:article['@type'],name:article.name,headline:article.headline,inLanguage:article.inLanguage,description:article.description}:null,
          localePicker:document.querySelector('select[aria-label]')?.value||null};
      });
      report.languages.push({requestedLocale:locale,httpStatus:response?.status(),...data,
        headingEqualsStructuredHeadline:data.heading===data.article?.headline,
        containsExpectedScript:locale==='hi'?/\p{Script=Devanagari}/u.test(data.heading||''):locale==='gu'?/\p{Script=Gujarati}/u.test(data.heading||''):true});
      if(locale!=='en')await capture(page,`seo-article-${productionLanguageOnly?'production-':''}${locale}`);
    } catch(error) {report.errors.push({scenario:`language ${locale}`,message:error.message});}
    finally {await context.close();await persist();}
  }

 if(!productionLanguageOnly) {
  const normal=report.hardware.find(v=>v.memory===8&&v.cores===8),lowMemory=report.hardware.find(v=>v.memory===4&&v.cores===8),lowCore=report.hardware.find(v=>v.cores===4);
  report.conclusions.push({id:'MOTION-01',reproduced:!!(normal?.stable&&normal.settled.home==='active'&&lowMemory?.stable&&lowMemory.settled.canvas==='low-power'&&lowMemory.settled.home==='active'&&lowMemory.homeMediaMoved&&lowCore?.settled.home==='static'),verifiedFixed:!!(normal?.stable&&normal.settled.home==='active'&&normal.homeMediaMoved&&lowMemory?.stable&&lowMemory.settled.canvas==='low-power'&&lowMemory.settled.home==='static'&&!lowMemory.homeMediaMoved&&lowCore?.settled.home==='static'),note:'Uses valid normal/low-core controls and actual media transform samples on the low-memory/high-core case.'});
  report.conclusions.push({id:'MOTION-02',reproduced:!!(report.pause?.enabled?.moves&&report.pause?.paused?.moves&&report.pause?.reloaded?.moves&&report.pause?.reloadedControlPressed==='true'),verifiedFixed:!!(report.pause?.enabled?.moves&&report.pause?.resumed?.moves&&report.pause?.reloadedControlPressed==='true'&&[report.pause.paused,report.pause.reloaded].every(state=>state?.observations.length===5&&state.observations.every(o=>o.canvas==='paused'&&o.preference==='paused'&&o.transform==='none'&&o.animationName==='none'))),note:'Uses actual transform changes while enabled/resumed and no transform after pause including persisted paused reload.'});
 }
  const translations=report.languages.filter(v=>v.requestedLocale!=='en');
  report.conclusions.push({id:'SEO-LANGUAGE-01',reproduced:translations.length===2&&translations.every(v=>v.httpStatus===200&&v.htmlLang===v.requestedLocale&&v.containsExpectedScript&&v.headingEqualsStructuredHeadline&&v.article?.inLanguage==='en'),note:'Requires translated visible heading and matching translated JSON-LD headline while JSON-LD language still declares English.'});
  report.conclusions.push({id:'A11Y-LANGUAGE-FALLBACK-01',verifiedFixed:translations.length===2&&translations.every(v=>v.httpStatus===200&&!v.containsExpectedScript&&v.htmlLang===v.requestedLocale&&v.inheritedHeadingLang==='en'&&v.inheritedBodyLang==='en'&&v.breadcrumbLanguages.some(label=>label.language===v.requestedLocale)),note:'Requires English fallback H1 and body to carry en while translated breadcrumb controls retain the requested interface language; this is DOM evidence, not native reader speech evidence.'});
} finally {await browser.close();await persist();}
console.log(JSON.stringify({browser:report.browser,conclusions:report.conclusions,errors:report.errors.map(e=>({scenario:e.scenario,message:e.message.split('\n')[0]})),blockedWrites:report.blockedWrites.length,captures:report.captures}));

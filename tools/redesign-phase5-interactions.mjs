import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {localBrowser,origin} from './old-design-migration/local-browser.mjs';
const out='output/playwright/redesign-phase5';await mkdir(out,{recursive:true});
const {browser,context,api}=await localBrowser(),report={checks:[],captures:[],issues:[],scope:'Isolated authenticated QA; edits are unsaved and never publish existing records'};
const check=(name,value)=>{assert.ok(value,name);report.checks.push(name);};
const rows=(await api('/api/studio/content?view=editor')).entries;
const fixture=JSON.parse(await readFile('output/redesign-phase5/lifecycle.json','utf8')).fixture;
const article=rows.find(e=>e.document.kind==='article'&&e.visible&&e.version>0);
try{for(const width of [1440,390]){
 const page=await context.newPage();await page.setViewportSize({width,height:width===390?844:1000});page.on('pageerror',e=>report.issues.push(e.message));
 const go=async path=>{await page.goto(origin+path,{waitUntil:'domcontentloaded'});await page.waitForLoadState('networkidle',{timeout:7000}).catch(()=>{});await page.locator('#main-content h1').first().waitFor();};
 const capture=async(name,target)=>{if(target){await target.scrollIntoViewIfNeeded();await target.evaluate(e=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,e.getBoundingClientRect().top+scrollY-32);});}await page.waitForTimeout(300);const file=width+'-'+name+'.png';await page.screenshot({path:out+'/'+file});report.captures.push(file);};
 await go('/studio/products');
 if(width===1440){await page.getByRole('button',{name:'Collapse Studio sidebar',exact:true}).click();check('Sidebar collapses',await page.locator('[data-collapsed=true]').count()===1);await page.getByRole('button',{name:'Expand Studio sidebar',exact:true}).click();}
 else {await page.getByRole('button',{name:'Open Studio navigation',exact:true}).click();check('Phone navigation opens',await page.locator('dialog[open]').count()===1);await capture('navigation');await page.keyboard.press('Escape');}
 await page.keyboard.press('Control+k');await page.locator('dialog[open] input').fill('journal');check(width+' page finder filters',await page.locator('dialog[open]').getByRole('link',{name:/Journal/}).count()===1);await capture('page-finder');await page.keyboard.press('Escape');
 await page.getByRole('searchbox',{name:'Find a piece',exact:true}).fill('River Channel');await page.getByRole('button',{name:/River Channel.*Published/}).first().click();
 check(width+' exact selected product',await page.locator('[data-studio-part=editor] h2').first().textContent()==='River Channel');
 await page.getByRole('button',{name:'Open existing product editing controls',exact:true}).click();
 for(const name of ['General Details','Story & Specs','Images & Visuals','Customization Form','Translations','History & Compare']){const tab=page.getByRole('tab',{name,exact:true});await tab.click();check(width+' '+name+' selected',await tab.getAttribute('aria-selected')==='true');await capture('product-'+name.toLowerCase().replaceAll(/[^a-z]+/g,'-'),page.locator('[role=tabpanel]').first());}
 await page.getByRole('tab',{name:'General Details',exact:true}).click();const name=page.locator('#products-field-name'),original=await name.inputValue();await name.fill(original+' — LOCAL UNSAVED CHECK');check(width+' product unsaved status',await page.locator('[data-edit-state=unsaved]').count()===1);await capture('product-unsaved',page.locator('[data-studio-part=recordStatus]'));
 if(width===390)await page.getByRole('button',{name:'Open Studio navigation',exact:true}).click();let blocked=false;page.once('dialog',async d=>{blocked=true;await d.dismiss();});await page.getByRole('link',{name:'Journal',exact:true}).first().click({force:true});await page.waitForTimeout(250);check(width+' cancelled navigation retains product draft',blocked&&await name.inputValue()===original+' — LOCAL UNSAVED CHECK');
 page.once('dialog',d=>d.accept());await go('/studio/journal');
 await page.getByLabel('Find content',{exact:true}).fill('phase5-no-such-record');await page.getByRole('button',{name:'Apply filters',exact:true}).click();await page.getByText('No records match this view.',{exact:false}).waitFor();check(width+' editorial empty filter',true);await capture('editorial-empty');await page.getByRole('button',{name:'Clear filters',exact:true}).click();await page.locator('[data-studio-part=libraryRows]>a').first().waitFor();
 await go('/studio/journal?record='+encodeURIComponent(article.document.id));await page.locator('#content-field-title').waitFor();await capture('article-editor',page.locator('[data-studio-part=recordStatus]'));
 await page.locator('summary').filter({hasText:'Translations and review'}).click();await page.getByLabel(/^Translation language/).selectOption('gu');check(width+' Gujarati editor remains available',await page.locator('textarea[lang=gu]').count()>0);await capture('translation-editor',page.getByLabel(/^Translation language/));
 const reviewed=await page.getByRole('button',{name:'Mark current translation reviewed',exact:true}).count();check(width+' review control retained without accepting review',reviewed===1);
 await go('/studio/site-images?record=page%3Aour-story&slot=header');await page.getByLabel(/^Approved image for this placement/).selectOption({index:1});await capture('image-editor',page.locator('[data-studio-part=editor]').first());
 if(width===390&&await page.getByRole('button',{name:'Mobile preview',exact:true}).count()){await page.getByRole('button',{name:'Mobile preview',exact:true}).first().click();check('Mobile crop view switches',await page.getByRole('button',{name:'Mobile preview',exact:true}).first().getAttribute('aria-pressed')==='true');await capture('mobile-crop',page.getByRole('button',{name:'Mobile preview',exact:true}).first());}
 page.once('dialog',d=>d.accept());await go('/studio/preview?'+new URLSearchParams({record:fixture.id,version:String(fixture.version)}));check(width+' exact saved preview marker',await page.locator('[data-saved-content-revision="'+fixture.version+'"]').count()>0);check(width+' public body preview style opted in',await page.locator('main').last().getAttribute('class')!==null);await capture('saved-public-preview');
 check(width+' no preview document overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.close();
}}finally{await browser.close();await writeFile(out+'/interactions.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({checks:report.checks.length,issues:report.issues,captures:report.captures.length}));assert.equal(report.issues.length,0);

import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {randomBytes,randomUUID,scryptSync} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {chromium,expect} from '@playwright/test';
import {assertLocalConfig,localTarget} from './guard.mjs';
import {candidateFingerprint} from './candidate-fingerprint.mjs';
import {localizeContent} from '../../src/lib/content-model.ts';
const output='test-results/old-design-migration',origin='http://127.0.0.1:4199',endpoint=origin+'/api/studio/presentation',key='presentation:home';
const qa=parseEnv(readFileSync(output+'/.env.qa','utf8'));assertLocalConfig(qa);assert.equal(globalThis.__rivyaMigrationLocalSql,true);
const {default:pg}=await import(pathToFileURL(process.env.RIVYA_MIGRATION_PG_MODULE).href);
const client=new pg.Client(localTarget);await client.connect();
const report={at:new Date().toISOString(),candidate:candidateFingerprint(),scope:'Compiled loopback app, source fixtures and new presentation record only',completed:false,human:false,physicalDevice:false,checks:[],browserErrors:[]};
const check=(name,details={})=>{report.checks.push({name,passed:true,...details});console.log('Passed: '+name);};
async function login(id,password){
 const html=await(await fetch(origin+'/studio/login')).text(),form=new FormData();
 for(const tag of html.matchAll(/<input\b[^>]*>/g)){const attrs=Object.fromEntries([...tag[0].matchAll(/([\w$:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2].replace(/&quot;/g,'"').replace(/&amp;/g,'&')]));if(attrs.name?.startsWith('$ACTION'))form.set(attrs.name,attrs.value||'');}
 assert.ok([...form.keys()].length);form.set('id',id);form.set('password',password);
 const response=await fetch(origin+'/studio/login',{method:'POST',headers:{Origin:origin},body:form,redirect:'manual'});
 const cookie=response.headers.getSetCookie().map(c=>c.split(';')[0]).find(c=>c.startsWith('__Host-rivya-studio='));assert.ok(cookie,'Local fixture login failed');return cookie;
}
const admin=await login(qa.STUDIO_ADMIN_ID,qa.STUDIO_ADMIN_PASSWORD);
async function api(body,cookie=admin,requestOrigin=origin){const response=await fetch(endpoint,{headers:{Cookie:cookie,Origin:requestOrigin,'Content-Type':'application/json'},...(body?{method:'POST',body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()};}
const baseline=(await client.query("SELECT md5(jsonb_agg(row_to_json(t) ORDER BY content_key)::text) AS digest FROM rivya_content t")).rows[0].digest;
const editorId=randomUUID(),editorLogin='migration-qa-'+editorId,editorPassword=randomBytes(24).toString('hex'),salt=randomBytes(16).toString('hex');
 let browser,trigger=false;
try{
 assert.equal((await api(undefined,'')).status,401);assert.equal((await api({operation:'publish',version:1},'')).status,401);
 assert.equal((await api({operation:'publish',version:1},admin,'https://unrelated.invalid')).status,403);
 check('Anonymous reads/writes return 401 and cross-origin writes return 403');
 await client.query('INSERT INTO rivya_staff(id,login,name,password_hash,role) VALUES($1,$2,$3,$4,$5)',[editorId,editorLogin,'Isolated QA editor',salt+':'+scryptSync(editorPassword,salt,64).toString('hex'),'editor']);
 const editor=await login(editorLogin,editorPassword);
 assert.equal((await api({operation:'publish',version:1},editor)).status,403);check('Authenticated editor cannot publish through the API');
 let entry=(await api()).data.entry;
 const layoutA={schemaVersion:1,hero:'split',manifesto:'statement',featured:'bento'},layoutB={schemaVersion:1,hero:'cinematic',manifesto:'strip',featured:'row'};
 assert.equal((await api({operation:'draft',version:entry.version,layout:layoutA,home:{title:'tampered'}})).status,400);
 assert.equal((await api({operation:'publish',version:entry.version||1,layout:layoutA})).status,400);check('Client content/snapshot injection and unsaved publish payloads are rejected');
 let response=await api({operation:'draft',version:entry.version,layout:layoutA},editor);assert.equal(response.status,200,JSON.stringify(response.data));entry=response.data.entry;
 const savedA=entry.version;assert.equal(entry.document.home.homeSnapshot.issues.length,0,JSON.stringify(entry.document.home.homeSnapshot.issues));
 assert.equal((await api({operation:'draft',version:entry.version-1,layout:layoutB})).status,409);check('Editor saves an additive design; stale revision returns 409 without changes');
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const equals=admin.indexOf('=');await context.addCookies([{name:admin.slice(0,equals),value:admin.slice(equals+1),url:origin.replace('http:','https:'),secure:true,httpOnly:true,sameSite:'Strict'}]);
 const page=await context.newPage();page.on('pageerror',e=>report.browserErrors.push(e.message.slice(0,180)));
 const publicPage=await context.newPage();await publicPage.goto(origin+'/',{waitUntil:'networkidle'});
 const initialPublic=await publicPage.locator('[data-home-revision]').getAttribute('data-presentation-revision');
 const selectedLinks=await publicPage.locator('#selected article a[href^="/pieces/"]').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href')));
 const publicHeading=await publicPage.locator('h1').innerText();
 await page.goto(origin+'/studio/presentation/preview?version='+savedA+'&locale=en',{waitUntil:'networkidle'});
 assert.equal(await page.locator('[data-presentation-revision]').getAttribute('data-home-hero'),'split');assert.equal(await page.locator('h1').innerText(),publicHeading);
 assert.deepEqual(await page.locator('#selected article a[href^="/pieces/"]').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href'))),selectedLinks);
 check('Saved preview uses the real shared renderer with unchanged heading and product selection order');
 await page.screenshot({path:output+'/screenshots/m3-preview-desktop.png'});
 await page.setViewportSize({width:1440,height:2100});
 await page.locator('#selected').evaluate(node=>window.scrollTo(0,node.getBoundingClientRect().top+window.scrollY-120));
 await page.screenshot({path:output+'/screenshots/m3-featured-layout.png'});
 for(const width of [320,390,800,1440]){await page.setViewportSize({width,height:width<700?844:1000});await page.reload({waitUntil:'networkidle'});await page.evaluate(()=>window.scrollTo(0,0));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);assert.equal(await page.locator('h1').count(),1);if(width===390)await page.screenshot({path:output+'/screenshots/m3-preview-mobile.png'});}
 check('Saved composition has one H1 and no body overflow at 320, 390, 800 and 1440 px');
 response=await api({operation:'draft',version:entry.version,layout:layoutB});assert.equal(response.status,200);entry=response.data.entry;
 await page.goto(origin+'/studio/presentation/preview?version='+savedA+'&locale=gu',{waitUntil:'networkidle'});
 assert.equal(await page.locator('[data-presentation-revision]').getAttribute('data-home-hero'),'split');assert.equal(await page.locator('h1').innerText(),localizeContent(response.data.entry.document.home,'gu').title);
 await publicPage.reload({waitUntil:'networkidle'});assert.equal(await publicPage.locator('[data-home-revision]').getAttribute('data-presentation-revision'),initialPublic);
 check('Later drafts do not change historical preview or public layout; explicit Gujarati preview uses captured review state');
 await page.goto(origin+'/studio/presentation/preview?version='+savedA+'&locale=en&viewport=mobile',{waitUntil:'networkidle'});
 await expect(page.getByText('Mobile preview · revision '+savedA,{exact:true})).toBeVisible();
 const frameResponse=await fetch(origin+'/studio/presentation/preview/frame?version='+savedA,{headers:{Cookie:admin}});
 assert.equal(frameResponse.headers.get('x-frame-options'),'SAMEORIGIN');assert.match(frameResponse.headers.get('content-security-policy'),/frame-ancestors 'self'/);
 assert.equal((await fetch(origin+'/studio/sections',{headers:{Cookie:admin}})).headers.get('x-frame-options'),'DENY');
 assert.equal(await page.frameLocator('iframe').locator('[data-presentation-revision]').getAttribute('data-home-hero'),'split');check('Mobile preview loads the exact saved revision in an actual 390 px iframe');
 // Fault injection is confined to the NEW QA presentation record. Protected content/media are never altered.
 const original=entry.document,missing=structuredClone(original);missing.dependencies.push({kind:'media',key:'/media/migration-qa-missing.webp',version:0,fingerprint:'unavailable'});
 await client.query('UPDATE rivya_presentations SET draft=$1::jsonb WHERE presentation_key=$2',[JSON.stringify(missing),key]);
 response=await api({operation:'publish',version:entry.version});assert.equal(response.status,409);
 await client.query('UPDATE rivya_presentations SET draft=$1::jsonb WHERE presentation_key=$2',[JSON.stringify(original),key]);
 check('Simulated missing saved media reference prevents publication atomically');
 const changed=structuredClone(original);changed.dependencies.find(d=>d.kind==='content'&&d.key==='page:home').fingerprint='changed';
 await client.query('UPDATE rivya_presentations SET draft=$1::jsonb WHERE presentation_key=$2',[JSON.stringify(changed),key]);assert.equal((await api({operation:'publish',version:entry.version})).status,409);
 await client.query('UPDATE rivya_presentations SET draft=$1::jsonb WHERE presentation_key=$2',[JSON.stringify(original),key]);check('Simulated changed homepage fingerprint prevents publishing a stale captured design');
 const beforeFault=(await client.query('SELECT md5(row_to_json(t)::text) AS digest FROM rivya_presentations t WHERE presentation_key=$1',[key])).rows[0].digest;
 await client.query("CREATE FUNCTION rivya_migration_qa_fail_history() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'isolated QA history failure'; END $$");
 await client.query('CREATE TRIGGER rivya_migration_qa_fail BEFORE INSERT ON rivya_presentation_revisions FOR EACH ROW EXECUTE FUNCTION rivya_migration_qa_fail_history()');trigger=true;
 assert.equal((await api({operation:'draft',version:entry.version,layout:layoutA})).status,503);assert.equal((await api({operation:'publish',version:entry.version})).status,503);
 assert.equal((await client.query('SELECT md5(row_to_json(t)::text) AS digest FROM rivya_presentations t WHERE presentation_key=$1',[key])).rows[0].digest,beforeFault);
 await client.query('DROP TRIGGER rivya_migration_qa_fail ON rivya_presentation_revisions');await client.query('DROP FUNCTION rivya_migration_qa_fail_history()');trigger=false;
 check('History failure rolls back both draft and publication writes without changing the saved row');
 // The browser now completes save -> exact preview -> publish -> public check -> restore.
 await page.goto(origin+'/studio/sections',{waitUntil:'networkidle'});await expect(page.locator('[data-design-version]')).toHaveText(String(entry.version));
 await page.getByRole('combobox',{name:'Opening image',exact:true}).selectOption('split');await page.getByRole('combobox',{name:'Manifesto',exact:true}).selectOption('statement');await page.getByRole('combobox',{name:'Selected pieces',exact:true}).selectOption('bento');
 page.once('dialog',d=>d.dismiss());await page.getByRole('navigation',{name:'Studio navigation',exact:true}).getByRole('link',{name:'Site copy',exact:true}).click();assert.equal(new URL(page.url()).pathname,'/studio/sections');assert.equal(await page.getByRole('combobox',{name:'Opening image',exact:true}).inputValue(),'split');
 check('Cancelled unsaved Studio navigation retains all design choices');
 // A real saved response is deliberately lost after the server commits.
 await page.route('**/api/studio/presentation',async route=>{if(route.request().method()==='POST'){await route.fetch();await route.abort('failed');}else await route.continue();});
 await page.getByRole('button',{name:'Save design draft',exact:true}).click();await expect(page.getByRole('status').first()).toContainText('connection was interrupted');
 assert.equal(await page.locator('[data-unsaved=true]').count(),1);await page.unroute('**/api/studio/presentation');
 await page.getByRole('button',{name:'Check latest saved version',exact:true}).click();await page.getByRole('button',{name:/Keep my choices against revision/}).click();
 assert.equal(await page.getByRole('combobox',{name:'Opening image',exact:true}).inputValue(),'split');
 check('Lost post-save response keeps edits; latest comparison safely reconciles the committed revision');
 await page.getByRole('button',{name:'Save design draft',exact:true}).click();await expect(page.getByRole('status').first()).toContainText('Draft saved');
 const uiSaved=Number(await page.locator('[data-design-version]').innerText());
 const popupPromise=page.waitForEvent('popup');await page.getByRole('link',{name:'Preview saved design ↗',exact:true}).click();const preview=await popupPromise;await preview.waitForLoadState('networkidle');assert.equal(await preview.locator('[data-presentation-revision]').getAttribute('data-presentation-revision'),String(uiSaved));await preview.close();
 await page.getByRole('button',{name:'Publish saved design',exact:true}).click();await expect(page.getByText('Public page confirmed design revision '+(uiSaved+1)+'.',{exact:true})).toBeVisible();
 await publicPage.reload({waitUntil:'networkidle'});assert.equal(await publicPage.locator('[data-presentation-revision]').getAttribute('data-presentation-revision'),String(uiSaved+1));assert.equal(await publicPage.locator('[data-home-hero=split]').count(),1);
 assert.equal(await publicPage.locator('h1').innerText(),publicHeading);assert.deepEqual(await publicPage.locator('#selected article a[href^="/pieces/"]').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href'))),selectedLinks);
 check('Browser saves and previews the exact revision, publishes it, and confirms actual public revision and unchanged selections',{saved:uiSaved,published:uiSaved+1});
 await page.getByRole('button',{name:'Restore revision '+entry.version+' to draft',exact:true}).click();await expect(page.getByRole('status').first()).toContainText('restored into a new draft');
 assert.equal(await page.getByRole('combobox',{name:'Opening image',exact:true}).inputValue(),'cinematic');await publicPage.reload({waitUntil:'networkidle'});assert.equal(await publicPage.locator('[data-presentation-revision]').getAttribute('data-home-hero'),'split');
 check('Revision recovery creates a new draft while leaving the public composition unchanged');
 await page.screenshot({path:output+'/screenshots/m3-studio-desktop.png'});await page.setViewportSize({width:390,height:844});await page.reload({waitUntil:'networkidle'});await page.evaluate(()=>window.scrollTo(0,0));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await page.screenshot({path:output+'/screenshots/m3-studio-mobile.png'});
 assert.equal((await api()).data.history.length<=30,true);check('History list is bounded and Studio editor fits a 390 px viewport');
 assert.equal((await client.query("SELECT md5(jsonb_agg(row_to_json(t) ORDER BY content_key)::text) AS digest FROM rivya_content t")).rows[0].digest,baseline);
 assert.deepEqual(report.browserErrors,[]);check('No browser runtime errors or protected content changes');
 report.final=(await api()).data.entry;report.final={version:report.final.version,publishedVersion:report.final.publishedVersion};
 report.completed=true;
}finally{
 if(trigger){await client.query('DROP TRIGGER IF EXISTS rivya_migration_qa_fail ON rivya_presentation_revisions');await client.query('DROP FUNCTION IF EXISTS rivya_migration_qa_fail_history()');}
 // Remove only this run's freshly created QA identity; no original staff exists in this fixture.
 await client.query('DELETE FROM rivya_studio_sessions WHERE staff_id=$1',[editorId]);await client.query('DELETE FROM rivya_staff WHERE id=$1 AND login=$2',[editorId,editorLogin]);
 if(browser)await browser.close();await client.end();
 writeFileSync(output+'/m3-workflow.json',JSON.stringify(report,null,2)+'\n');
}
console.log(JSON.stringify({checks:report.checks.length,browserErrors:report.browserErrors.length}));

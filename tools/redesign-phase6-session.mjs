import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {chromium} from '@playwright/test';
import {localBrowser as signIn,origin} from './old-design-migration/local-browser.mjs';
export {origin};
// Reuse one genuinely authenticated localhost QA session across this phase's
// browser scripts. This does not reset or bypass the server login limiter.
// The ignored session file is deleted at the final handoff.
export async function localBrowser(){
 assert.equal(globalThis.__rivyaMigrationLocalSql,true);
 const path='output/redesign-phase6/.local-session.json';let cookies;
 try{cookies=JSON.parse(await readFile(path,'utf8'));}catch{/* First login. */}
 const session=cookies?.find(c=>c.name==='__Host-rivya-studio'&&c.domain==='127.0.0.1');
 if(!session){const fresh=await signIn();await writeFile(path,JSON.stringify(await fresh.context.cookies()),{mode:0o600});return fresh;}
 const cookie=session.name+'='+session.value;
 const identity=await fetch(origin+'/api/studio/workspace',{headers:{Cookie:cookie}});assert.equal(identity.status,200,'Saved local QA session expired; sign in again through the normal login');
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}),context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});await context.addCookies(cookies);
 const api=async(path,body)=>{const res=await fetch(origin+path,{headers:{Cookie:cookie,Origin:origin,'Content-Type':'application/json'},...(body?{method:'POST',body:JSON.stringify(body)}:{})});const data=await res.json();assert.equal(res.status,200,'Local API operation rejected');return data;};
 return {browser,context,api};
}

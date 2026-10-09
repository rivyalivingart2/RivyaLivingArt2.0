import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {chromium} from '@playwright/test';
import {assertLocalConfig} from './guard.mjs';
export const origin='http://127.0.0.1:4199';
export async function localBrowser(){
 assert.equal(globalThis.__rivyaMigrationLocalSql,true);
 const qa=parseEnv(readFileSync('test-results/old-design-migration/.env.qa','utf8'));assertLocalConfig(qa);
 const html=await(await fetch(origin+'/studio/login')).text(),form=new FormData();
 for(const tag of html.matchAll(/<input\b[^>]*>/g)){const attrs=Object.fromEntries([...tag[0].matchAll(/([\w$:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2].replace(/&quot;/g,'"').replace(/&amp;/g,'&')]));if(attrs.name?.startsWith('$ACTION'))form.set(attrs.name,attrs.value||'');}
 assert.ok([...form.keys()].length);form.set('id',qa.STUDIO_ADMIN_ID);form.set('password',qa.STUDIO_ADMIN_PASSWORD);
 const response=await fetch(origin+'/studio/login',{method:'POST',headers:{Origin:origin},body:form,redirect:'manual'});
 const cookie=response.headers.getSetCookie().map(c=>c.split(';')[0]).find(c=>c.startsWith('__Host-rivya-studio='));assert.ok(cookie,'Local fixture login failed');
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),equals=cookie.indexOf('=');
 await context.addCookies([{name:cookie.slice(0,equals),value:cookie.slice(equals+1),url:origin.replace('http:','https:'),secure:true,httpOnly:true,sameSite:'Strict'}]);
 const api=async(path,body)=>{const r=await fetch(origin+path,{headers:{Cookie:cookie,Origin:origin,'Content-Type':'application/json'},...(body?{method:'POST',body:JSON.stringify(body)}:{})});const data=await r.json();assert.equal(r.status,200,JSON.stringify(data));return data;};
 return {browser,context,api};
}

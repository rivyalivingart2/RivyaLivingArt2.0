import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {assertLocalConfig} from './guard.mjs';
export const origin='http://127.0.0.1:4199';
/** Isolated HTTP contract checks only; this never controls a browser or targets a live host. */
export async function localApi(credentials){
 assert.equal(globalThis.__rivyaMigrationLocalSql,true);
 const qa=parseEnv(readFileSync('test-results/old-design-migration/.env.qa','utf8'));assertLocalConfig(qa);
 const html=await(await fetch(origin+'/studio/login')).text(),form=new FormData();
 for(const tag of html.matchAll(/<input\b[^>]*>/g)){const attrs=Object.fromEntries([...tag[0].matchAll(/([\w$:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2].replace(/&quot;/g,'"').replace(/&amp;/g,'&')]));if(attrs.name?.startsWith('$ACTION'))form.set(attrs.name,attrs.value||'');}
 assert.ok([...form.keys()].length);form.set('id',credentials?.id||qa.STUDIO_ADMIN_ID);form.set('password',credentials?.password||qa.STUDIO_ADMIN_PASSWORD);
 const response=await fetch(origin+'/studio/login',{method:'POST',headers:{Origin:origin},body:form,redirect:'manual'});
 const cookie=response.headers.getSetCookie().map(c=>c.split(';')[0]).find(c=>c.startsWith('__Host-rivya-studio='));assert.ok(cookie,'Local fixture login failed');
 const request=(path,options={})=>{assert.ok(path.startsWith('/')&&!path.startsWith('//'));return fetch(origin+path,{redirect:'manual',...options,headers:{Cookie:cookie,Origin:origin,...options.headers}});};
 const api=async(path,body,status=200)=>{const response=await request(path,{...(body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{})});const data=await response.json();assert.equal(response.status,status,JSON.stringify({path,error:data.error}));return data;};
 return {api,request};
}

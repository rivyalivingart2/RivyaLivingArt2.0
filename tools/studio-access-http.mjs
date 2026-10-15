import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
assert.equal(globalThis.__rivyaMigrationLocalSql,true);
assert.equal(process.env.RIVYA_DATA_MODE,'isolated');
const origin='http://127.0.0.1:4199',checks=[];
const check=(name,condition)=>{assert.ok(condition,name);checks.push(name);};
function actionForm(html){
 const form=new FormData();
 for(const match of html.matchAll(/<input\b[^>]*>/g)){
  const attrs=Object.fromEntries([...match[0].matchAll(/([\w$:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2].replace(/&quot;/g,'"').replace(/&amp;/g,'&')]));
  if(attrs.name?.startsWith('$ACTION'))form.set(attrs.name,attrs.value||'');
 }
 assert.ok([...form.keys()].length>0);return form;
}
for(const route of ['/studio/login','/studio/request-access','/studio/forgot-password','/studio/set-password']){
 const res=await fetch(origin+route);check(route+' responds',res.status===200);check(route+' protects referrers',res.headers.get('referrer-policy')==='no-referrer');
}
check('Anonymous request list denied',(await fetch(origin+'/api/studio/access-requests')).status===401);
const page=await(await fetch(origin+'/studio/login')).text(),form=actionForm(page);
form.set('id',process.env.STUDIO_ADMIN_ID);form.set('password',process.env.STUDIO_ADMIN_PASSWORD);
const signedIn=await fetch(origin+'/studio/login',{method:'POST',headers:{Origin:origin},body:form,redirect:'manual'});
const cookie=signedIn.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
check('Existing owner sign-in still succeeds',signedIn.status===303&&cookie.includes('__Host-rivya-studio='));
const headers={Origin:origin,Cookie:cookie,'Content-Type':'application/json'};
const list=await fetch(origin+'/api/studio/access-requests',{headers});check('Admin can read queue',list.status===200);
const safe=await list.json();check('Queue omits token material',safe.requests.every(r=>!('token_hash' in r)&&!('token' in r)));
const payload={id:randomUUID(),version:1,operation:'approve'};
check('Cross-origin decisions denied',(await fetch(origin+'/api/studio/access-requests',{method:'POST',headers:{...headers,Origin:'https://example.invalid'},body:JSON.stringify(payload)})).status===403);
check('Approval requires explicit identity verification',(await fetch(origin+'/api/studio/access-requests',{method:'POST',headers,body:JSON.stringify(payload)})).status===400);
check('Invalid request body rejected',(await fetch(origin+'/api/studio/access-requests',{method:'POST',headers,body:'{}'})).status===400);
const requestPage=await(await fetch(origin+'/studio/request-access')).text();
const login='access-http-'+randomUUID().slice(0,8);
const send=async(kind,consent=true)=>{
 const f=actionForm(requestPage);Object.entries({kind,login,name:'LOCAL QA - fictional request',contact:'no-contact@example.invalid',...(consent?{consent:'on'}:{})}).forEach(([k,v])=>f.set(k,v));
 const r=await fetch(origin+'/studio/request-access',{method:'POST',headers:{Origin:origin},body:f});return await r.text();
};
check('Public request requires consent',(await send('access',false)).includes('Confirm that an administrator'));
check('Public account request acknowledged',(await send('access')).includes('Request received.'));
check('Duplicate request receives same acknowledgement',(await send('access')).includes('Request received.'));
check('Unknown recovery receives generic acknowledgement',(await send('recovery')).includes('Request received.'));
check('Per-ID public throttling applies',(await send('access')).includes('Too many requests'));
const queue=await(await fetch(origin+'/api/studio/access-requests',{headers})).json();
check('Submitted request reaches admin queue',queue.requests.some(r=>r.login===login&&r.kind==='access'));
await writeFile('test-results/studio-access/http.json',JSON.stringify({at:new Date().toISOString(),scope:'Loopback HTTP and isolated database; fictional requests only',login,checks},null,2));
console.log(JSON.stringify({passed:checks.length,scope:'local HTTP',requests:'Two fictional requests retained for visual review; no accounts approved'}));

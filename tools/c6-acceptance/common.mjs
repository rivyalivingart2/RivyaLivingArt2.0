import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {resolve} from 'node:path';
import {neon} from '@neondatabase/serverless';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {createHash} from 'node:crypto';

assert.ok(process.env.RIVYA_QA_CONFIG_PATH,'Provide the existing isolated QA configuration-file path; never credentials on the command line.');
export const qa=parseEnv(readFileSync(process.env.RIVYA_QA_CONFIG_PATH,'utf8'));
const local=qa.RIVYA_QA_TARGET==='local',database=local?'rivya_acceptance_local':'rivya_qa_20260924',role=local?'rivya_local_qa':'rivya_qa_runtime_20260924';
assert.equal(new URL(qa.DATABASE_URL).pathname,'/'+database);
assert.equal(decodeURIComponent(new URL(qa.DATABASE_URL).username),role);
assert.equal(qa.RIVYA_QA_BLOB_STORE_ID,local?'local-no-objects':'store_maHrpDDHXPR93N0w');
if(local){assert.equal(new URL(qa.DATABASE_URL).hostname,'localhost');assert.equal(globalThis.__rivyaLocalSql,true,'Load the guarded local SQL transport before local QA');}
else assert.ok(!new URL(qa.DATABASE_URL).hostname.includes('ep-delicate-silence-awjxadrd'),'Broad QA must not consume the shared live project allowance. Use local QA or a separately isolated project.');
export const sql=neon(qa.DATABASE_URL);
const identity=(await sql`SELECT current_database() AS database,current_user AS role`)[0];
assert.equal(identity.database,database);assert.equal(identity.role,role);
const port=Number(process.env.RIVYA_QA_PORT||4194);assert.ok(Number.isInteger(port)&&port>=1024&&port<=65535);
export const origin='http://127.0.0.1:'+port;
export const output=resolve('test-results/c6-acceptance');mkdirSync(output,{recursive:true});
export function record(name,data){writeFileSync(resolve(output,name+'.json'),JSON.stringify(data,null,2));}
export async function request(cookie,path,body,headers={}){
 const response=await fetch(origin+path,{headers:{Cookie:cookie,Origin:origin,...(body?{'Content-Type':'application/json'}:{}),...headers},...(body?{method:'POST',body:JSON.stringify(body)}:{}),redirect:'manual'});
 return {status:response.status,data:await response.json().catch(()=>null),headers:response.headers};
}
export async function login(id=qa.STUDIO_ADMIN_ID,password=qa.STUDIO_ADMIN_PASSWORD){
 const html=await(await fetch(origin+'/studio/login')).text(),form=new FormData();
 for(const tag of html.matchAll(/<input\b[^>]*>/g)){
  const attributes=Object.fromEntries([...tag[0].matchAll(/([\w$:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2].replace(/&quot;/g,'"').replace(/&amp;/g,'&')]));
  if(attributes.name?.startsWith('$ACTION'))form.set(attributes.name,attributes.value||'');
 }
 assert.ok([...form.keys()].length,'Server-action sign-in form available');form.set('id',id);form.set('password',password);
 const response=await fetch(origin+'/studio/login',{method:'POST',headers:{Origin:origin},body:form,redirect:'manual'});
 const cookie=response.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
 assert.ok(cookie&&[200,303].includes(response.status),'Isolated QA sign-in succeeded (response withheld)');
 // Prove the running local app issued this session into the pinned QA database.
 // The token and its hash remain in memory and never enter evidence files.
 const token=cookie.split('; ').find(value=>value.startsWith('__Host-rivya-studio='))?.slice('__Host-rivya-studio='.length);
 assert.ok(token&&/^[A-Za-z0-9_-]{43}$/.test(token),'Local QA session token is present');
 const digest=createHash('sha256').update(token).digest('hex');
 assert.equal(Number((await sql`SELECT count(*) AS count FROM rivya_studio_sessions WHERE token_hash=${digest} AND expires_at>now()`)[0].count),1,'Local server session must exist in the verified isolated QA database before any fixture mutation');
 return cookie;
}
export async function launch(cookie,options={}){
 const browser=await chromium.launch({executablePath:process.env.RIVYA_BROWSER_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000},...options});
 await addSession(context,cookie);
 const page=await context.newPage();page.setDefaultTimeout(15000);page.setDefaultNavigationTimeout(45000);
 return {browser,context,page};
}
export async function addSession(context,cookie){
 // Store the production cookie with its HTTPS source. Chrome permits secure
 // cookies on trustworthy loopback; no production cookie settings are changed.
 await context.addCookies(cookie.split('; ').map(part=>{const i=part.indexOf('=');return {name:part.slice(0,i),value:part.slice(i+1),url:origin.replace('http:','https:'),secure:true,httpOnly:true,sameSite:'Lax'};}));
}
export const modules=['','inquiries','follow-ups','products','content','site-copy','media','site-images','content-health','translations','navigation','legacy','route-review','activity','staff','settings'];
export async function open(page,path){await page.goto(origin+path);await page.locator('#main-content h1').waitFor();}
export async function fingerprint(){
 return sql`SELECT (SELECT md5(string_agg(row_to_json(c)::text,'' ORDER BY product_id)) FROM rivya_catalogue c) AS catalogue,(SELECT md5(string_agg(row_to_json(m)::text,'' ORDER BY path)) FROM rivya_public_media m) AS media,(SELECT md5(string_agg(row_to_json(b)::text,'' ORDER BY id)) FROM rivya_business_settings b) AS business`;
}
export async function existingRows(){
 const tables=['rivya_content','rivya_inquiries','rivya_studio_orders','rivya_staff'];
 const result={};for(const table of tables){const key=table==='rivya_content'?'content_key':'id';const rows=await sql.query(`SELECT ${key}::text AS id,md5(row_to_json(t)::text) AS digest FROM ${table} t ORDER BY ${key}`);result[table]=Object.fromEntries(rows.map(r=>[r.id,r.digest]));}return result;
}
export async function preserve(before,protectedBefore){const after=await existingRows();for(const [table,rows] of Object.entries(before))for(const [id,digest] of Object.entries(rows))assert.equal(after[table][id],digest,'Pre-existing '+table+' row unchanged');assert.deepEqual(await fingerprint(),protectedBefore);}

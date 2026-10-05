import {login,launch,modules,origin,record} from './common.mjs';
const session=await launch(await login()),rows=[];
try{
 for(const moduleName of modules){
  const page=await session.context.newPage(),calls=new Set(),errors=[];page.setDefaultTimeout(25000);
  page.on('request',r=>{if(r.url().includes('/api/studio/'))calls.add(new URL(r.url()).pathname+new URL(r.url()).search);});
  page.on('pageerror',e=>errors.push(e.message.slice(0,180)));
  await page.goto(origin+'/studio'+(moduleName?'/'+moduleName:''));await page.locator('#main-content h1').waitFor();
  await page.waitForFunction(()=>![...document.querySelectorAll('#main-content [role="status"]')].some(e=>/^(Loading|Opening|Checking saved)/.test(e.textContent.trim())),{},{timeout:30000}).catch(()=>{});
  const row={module:moduleName||'overview',heading:await page.locator('#main-content h1').innerText(),buttons:await page.locator('#main-content button').allTextContents(),api:[...calls],errors};rows.push(row);
  record('read-ui',rows);console.log(JSON.stringify({module:row.module,api:row.api,buttons:row.buttons.slice(0,8),errors}));await page.close();
 }
}finally{await session.browser.close();}

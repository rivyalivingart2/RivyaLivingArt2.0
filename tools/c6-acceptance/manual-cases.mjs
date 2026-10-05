import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {login,launch,origin,record} from './common.mjs';
const require=createRequire(import.meta.url),{browser,page}=await launch(await login(),{reducedMotion:'reduce'}),checks=[],scans=[];
const pass=(name,value)=>{assert.ok(value,name);checks.push(name);};
const linear=c=>(c/=255)<=.04045?c/12.92:((c+.055)/1.055)**2.4;
const lum=rgb=>rgb.reduce((s,c,i)=>s+linear(c)*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
const samples=[];
async function inspect(locator,label,underline=false){
 await locator.scrollIntoViewIfNeeded();await locator.focus();
 const style=await locator.evaluate(e=>{
  const s=getComputedStyle(e),r=e.getBoundingClientRect(),surfaces=[];let opacity=1;
  for(let n=e;n;n=n.parentElement){const style=getComputedStyle(n);surfaces.push({color:style.backgroundColor.match(/[\d.]+/g).map(Number),image:style.backgroundImage});opacity*=Number(style.opacity);}
  return {color:s.color.match(/[\d.]+/g).map(Number),surfaces,opacity,decoration:s.textDecorationLine,visible:r.x>=-1&&r.right<=innerWidth+1&&r.y>=-1&&r.bottom<=innerHeight+1,focused:e===document.activeElement};
 });
 pass(label+' is reachable within the viewport',style.visible&&style.focused);
 pass(label+' uses the inspected solid backgrounds',style.surfaces.every(s=>s.image==='none'));
 let bg=[255,255,255];for(const s of style.surfaces.reverse()){const alpha=s.color[3]??1;bg=s.color.slice(0,3).map((c,i)=>alpha*c+(1-alpha)*bg[i]);}
 const alpha=(style.color[3]??1)*style.opacity,fg=style.color.slice(0,3).map((c,i)=>alpha*c+(1-alpha)*bg[i]),ratio=contrast(fg,bg);
 pass(label+' text contrast is at least 4.5:1',ratio>=4.5);if(underline)pass(label+' has an underline independent of colour',style.decoration.includes('underline'));
 samples.push({label,foreground:fg,background:bg,ratio:Math.round(ratio*100)/100,decoration:style.decoration,reachable:true});
}
async function scan(route,width){
 await page.setViewportSize({width,height:1000});await page.goto(origin+route,{waitUntil:'networkidle'});await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 const result=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return {violations:r.violations.map(v=>v.id),incomplete:r.incomplete.map(v=>({id:v.id,count:v.nodes.length}))};});
 pass(route+' '+width+' automated recheck',!result.violations.length);scans.push({route,width,...result});
}
try{
 for(const width of [1440,390]){
  for(const route of ['/pieces/river-channel','/pieces/vow-framed-varmala-keepsake','/studio/site-images','/studio/products','/studio/content-health']){
   await scan(route,width);
   if(route.startsWith('/pieces/'))pass('Product thumbnails expose their named group at '+width,await page.getByRole('group',{name:'Choose a product image',exact:true}).count()===1);
   if(route==='/studio/site-images')pass('Page placements expose their named group at '+width,await page.getByRole('group',{name:'Pages with image placements',exact:true}).count()===1);
   if(route==='/studio/products'){
    const next=page.getByRole('button',{name:'Next',exact:true});await inspect(next,'Catalogue next page at '+width);
    const counter=next.locator('..').locator('span');await counter.scrollIntoViewIfNeeded();
    const first=await counter.textContent();await next.click();pass('Catalogue page changes without changing products at '+width,await counter.textContent()!==first);
    await page.getByRole('button',{name:'Prev',exact:true}).click();pass('Catalogue returns to original page at '+width,await counter.textContent()===first);
   }
   if(route==='/studio/content-health'){
    const container=width===1440?page.locator('table'):page.locator('[class*="__healthMobile"]');
    await inspect(container.getByRole('link',{name:'Open field ↗',exact:true}).first(),'Content health repair link at '+width,true);
   }
  }
 }
 await scan('/studio/follow-ups',1440);
 const rows=await page.locator('tbody tr').count();
 pass('Empty follow-up table has an explicit empty result, or real data cells',rows>0||await page.getByText(/No inquiries (match these filters|are available in your scope)/).count()>0);
 record('manual-cases',{at:new Date().toISOString(),complete:true,checks,scans,samples,dispositions:{'th-has-data-cells':rows?'Table contains data cells':'Zero matching follow-ups, caption/headers and explicit empty-result paragraph; not a missing populated table cell','partially-obscured':'Scroll containers were moved to expose catalogue pagination and health repair links; controls are reachable and their actual solid colours meet contrast','aria-prohibited-attr':'Product thumbnails and page-image records now use named group roles'},scope:'Assistant review and browser checks, not human screen-reader or physical-phone use. No record save, publication or customer message.'});
}finally{await browser.close();}

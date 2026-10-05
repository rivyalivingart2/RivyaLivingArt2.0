import {login,launch,modules,origin,record,output} from './common.mjs';
import {expect as baseExpect} from '@playwright/test';
import assert from 'node:assert/strict';
const expect=baseExpect.configure({timeout:30000}),cookie=await login(),{browser,context}=await launch(cookie),rows=[],keyboard=[],errors=[];
try{
 for(const moduleName of modules){
  const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push((moduleName||'overview')+': '+e.message));
  await page.goto(origin+'/studio'+(moduleName?'/'+moduleName:''));await expect(page.locator('#main-content h1')).toBeVisible();
  await page.waitForFunction(()=>![...document.querySelectorAll('#main-content [role="status"]')].some(e=>/^(Loading|Opening|Checking saved)/.test(e.textContent.trim())),{},{timeout:40000});
  for(const width of [1440,720,390]){
   await page.setViewportSize({width,height:1000});
   const metrics=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
   assert.ok(metrics.scroll<=width+1&&metrics.body<=width+1,'No body overflow '+moduleName+' '+width);rows.push({module:moduleName||'overview',...metrics});
  }
  const trigger=page.getByRole('button',{name:'Open Studio navigation',exact:true});await trigger.focus();await page.keyboard.press('Enter');const dialog=page.getByRole('dialog',{name:'Studio navigation',exact:true});await expect(dialog).toBeVisible();
  await dialog.getByRole('button',{name:'Close navigation',exact:true}).focus();await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement?.closest('dialog')?.open),true);await page.keyboard.press('Tab');await expect(dialog.getByRole('button',{name:'Close navigation',exact:true})).toBeFocused();await page.keyboard.press('Escape');await expect(trigger).toBeFocused();keyboard.push((moduleName||'overview')+' mobile modal keyboard wrap, Escape and opener focus');
  if(['site-images','content-health','navigation'].includes(moduleName))await page.screenshot({path:output+'/'+moduleName+'-mobile.png',fullPage:false});
  await page.close();record('layout-keyboard',{rows,keyboard,errors,complete:false});console.log('PASS '+(moduleName||'overview')+' widths and keyboard');
 }
 const page=await context.newPage();await page.goto(origin+'/studio/products?record=DP001');await expect(page.getByRole('tablist',{name:'Product editor sections'})).toBeVisible();
 const tabs=page.getByRole('tablist',{name:'Product editor sections'}).getByRole('tab');await tabs.first().focus();await page.keyboard.press('End');await expect(tabs.last()).toBeFocused();await expect(tabs.last()).toHaveAttribute('aria-selected','true');await page.keyboard.press('Home');await expect(tabs.first()).toBeFocused();await page.keyboard.press('ArrowRight');await expect(tabs.nth(1)).toBeFocused();await expect(page.getByRole('tabpanel')).toBeVisible();keyboard.push('Product tabs support End, Home, ArrowRight with one selected tab and visible named panel');
 await page.keyboard.press('Control+k');await expect(page.getByRole('dialog',{name:'Find a Studio page'})).toBeVisible();await page.getByRole('searchbox',{name:'Page name'}).fill('site images');const destination=page.getByRole('navigation',{name:'Matching Studio pages'}).getByRole('link').first();await destination.focus();await page.keyboard.press('Enter');await expect(page.locator('#main-content h1')).toHaveText('Images, in their place.');await expect(page.locator('#main-content h1')).toBeFocused();keyboard.push('Page finder keyboard navigation focuses destination heading');
 assert.deepEqual(errors,[]);record('layout-keyboard',{checkedAt:new Date().toISOString(),rows,keyboard,errors,complete:true,zoomNote:'720 CSS-pixel reflow is the layout-width equivalent of a 1440-pixel desktop at 200%. This does not certify human browser zoom, screen-reader use or a physical device.'});
}finally{await browser.close();}

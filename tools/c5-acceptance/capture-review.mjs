import {readFileSync} from 'node:fs';
import {login,launch,origin,output} from './common.mjs';
import {expect as baseExpect} from '@playwright/test';
const expect=baseExpect.configure({timeout:30000}),{browser,page}=await launch(await login());
try{
 const fixture=JSON.parse(readFileSync(output+'/browser-fixtures.json','utf8'));
 await page.goto(origin+'/studio/content?record='+encodeURIComponent(fixture.pageId));await expect(page.locator('#content-field-title')).toBeVisible();await page.getByText('Saved revision history',{exact:true}).click();await page.getByRole('button',{name:'Load recent revisions',exact:true}).click();await expect(page.getByRole('link',{name:/Preview saved revision/}).first()).toBeVisible();await page.getByText('Saved revision history',{exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:output+'/revision-history.png'});
 await page.goto(origin+'/studio/navigation');await expect(page.getByLabel('English label',{exact:true}).first()).toBeVisible();await page.route('**/api/studio/site-settings',route=>route.fulfill({status:503,json:{error:'Navigation is temporarily unavailable.'}}));await page.getByRole('button',{name:'Reload',exact:true}).click();await expect(page.getByText('Previously loaded settings and any unsaved edits are retained;',{exact:false})).toBeVisible();await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:output+'/navigation-retry.png'});
 console.log('Read-only screenshots saved for retained revision history and failed navigation refresh.');
}finally{await browser.close();}

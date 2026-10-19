import {test as base,expect,type Page,type Locator} from '@playwright/test';
import {readFile} from 'node:fs/promises';

export type ProductFixture={id:string;slug:string;name:string;tier:'large'|'memory'|'personal';category:string;material:string;images:string[];fields:{id:string;label:string;type:string;options?:string[];visibleWhen?:unknown}[]};
type Fixtures={products:ProductFixture[];readOnlyBoundary:void};
export const test=base.extend<Fixtures>({
 products:async({},provide)=>{const fixture=JSON.parse(await readFile('test-results/rivya-master-audit/e2e-final/public-fixtures.json','utf8'));await provide(fixture.products);},
 readOnlyBoundary:[async({context,page},provide)=>{
  const blocked:string[]=[],errors:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  await context.route('**/*',async route=>{
   const request=route.request(),url=new URL(request.url());
   if(['http:','https:'].includes(url.protocol)&&url.origin!=='http://127.0.0.1:4173'){blocked.push('External '+request.method()+' '+url.origin);return route.abort('blockedbyclient');}
   if(!['GET','HEAD'].includes(request.method())){
    // Opening a customization form normally prepares a session with POST.
    // This suite verifies the explicit unavailable-saving UI, never writes it.
    if(url.origin==='http://127.0.0.1:4173'&&url.pathname==='/api/inquiry/session'&&request.method()==='POST')return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Read-only browser test: saving is unavailable.'})});
    blocked.push(request.method()+' '+url.pathname);return route.abort('blockedbyclient');
   }
   return route.continue();
  });
  await provide();
  expect(blocked,'No persistent mutation or external message is attempted').toEqual([]);
  expect(errors,'No uncaught browser errors').toEqual([]);
 },{auto:true}],
});
export {expect};
export const cards=(page:Page)=>page.locator('[data-lighting-card="product"]');
export const titles=(page:Page)=>cards(page).getByRole('heading',{level:3}).allTextContents();
export const filterForm=(page:Page)=>page.getByRole('form',{name:'Filter the collection'});
export const results=(page:Page)=>page.locator('#catalogue-results');
export async function applyFilters(page:Page){await filterForm(page).getByRole('button',{name:'Apply filters',exact:true}).click();await expect(results(page)).toBeVisible();}
export async function noOverflow(page:Page){const sizes=await page.evaluate(()=>({width:document.documentElement.clientWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));expect(sizes.document).toBeLessThanOrEqual(sizes.width+1);expect(sizes.body).toBeLessThanOrEqual(sizes.width+1);}
export async function decoded(image:Locator){await image.scrollIntoViewIfNeeded();await expect(image).toBeVisible();expect(await image.evaluate(async(element:HTMLImageElement)=>{await element.decode();return element.naturalWidth>0&&element.naturalHeight>0;})).toBe(true);}
export async function publicPage(page:Page,path:string){const response=await page.goto(path);expect(response?.status(),path).toBe(200);await expect(page.getByRole('main')).toHaveCount(1);await expect(page.getByRole('heading',{level:1})).toBeVisible();await noOverflow(page);}
export async function openMenu(page:Page){const trigger=page.getByRole('button',{name:'Open navigation',exact:true});await trigger.click();const dialog=page.getByRole('dialog',{name:'Explore RivyaLivingArt'});await expect(dialog).toBeVisible();await expect(dialog).toHaveJSProperty('open',true);await expect(trigger).toHaveAttribute('aria-expanded','true');await expect(page.locator('body')).toHaveCSS('overflow','hidden');return {trigger,dialog};}
export async function expectContainsFocus(page:Page,dialog:Locator){const count=await dialog.locator('a[href],button,input,select,textarea').count();for(const key of ['Tab','Shift+Tab'])for(let i=0;i<count+1;i++){await page.keyboard.press(key);expect(await dialog.evaluate(element=>element.contains(document.activeElement)),key+' keeps focus in the dialog').toBe(true);}}
export const productPath=(product:ProductFixture)=>'/pieces/'+product.slug;

import {test,expect,cards,decoded,noOverflow,publicPage,openMenu,expectContainsFocus,productPath,resourceErrorKey} from './helpers';

const routes=[['home','/'],['collectible-design','/collectible-design'],['memory-art','/memory-art'],['personal-art','/personal-art'],['first furniture','first'],['second furniture','second'],['studio sign in','/studio']] as const;
for(const [name,destination] of routes)test(`${name}: responsive layout, decoded media and current publication`,async({page,products},testInfo)=>{
 const furniture=products.filter(p=>p.tier==='large');
 const path=destination==='first'?productPath(furniture[0]):destination==='second'?productPath(furniture[1]):destination;
 await publicPage(page,path);
 if(path==='/studio'){
  await expect(page).toHaveURL(/\/studio\/login$/);
  await expect(page.getByLabel('Staff ID',{exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Sign in to Studio',exact:true})).toBeVisible();
 }else{
  const images=page.locator('main img');
  for(const image of await images.all())if(await image.isVisible()){
   await expect(image).toHaveAttribute('alt'); // Empty alternatives remain valid for decorative images.
   await decoded(image);
  }
  if(destination==='first'||destination==='second')await expect(page.getByRole('heading',{level:1,name:furniture[destination==='first'?0:1].name,exact:true})).toBeVisible();
 }
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.screenshot({path:testInfo.outputPath(name.replaceAll(' ','-')+'.png'),fullPage:true});
});

test('furniture and collection journeys navigate through current published links',async({page,products})=>{
 await publicPage(page,'/collectible-design');
 const first=products.find(p=>p.tier==='large')!;
 await cards(page).getByRole('link').filter({has:page.getByRole('heading',{level:3,name:first.name,exact:true})}).click();
 await expect(page).toHaveURL(new RegExp(productPath(first)+'$'));
 await expect(page.getByRole('heading',{level:1,name:first.name,exact:true})).toBeVisible();
 await page.getByRole('navigation',{name:'Breadcrumb',exact:true}).getByRole('link',{name:'Furniture & spatial art',exact:true}).click();
 await expect(page).toHaveURL(/\/collectible-design$/);
 for(const path of ['/memory-art','/personal-art']){
  await page.locator('footer').locator(`a[href="${path}"]`).first().click();
  await expect(page).toHaveURL(new RegExp(path+'$'));
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
 }
});

test('unknown collection, piece and nested routes return actual 404s with recovery',async({page,expectedHttpErrors})=>{
 for(const path of ['/not-an-existing-collection','/pieces/not-an-existing-piece','/not-an-existing/nested/route']){
  expectedHttpErrors.add(resourceErrorKey('http://127.0.0.1:4173'+path,404));
  expect((await page.goto(path))?.status(),path).toBe(404);
  await expect(page.getByRole('heading',{level:1,name:'This page is unavailable.'})).toBeVisible();
  await noOverflow(page);
  await page.getByRole('main').getByRole('link',{name:'Explore the collection ↗',exact:true}).click();
  await expect(page).toHaveURL(/\/collectible-design$/);
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
 }
});

test('reduced motion keeps content visible and disables automatic cinematic movement',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await publicPage(page,'/');
 const canvas=page.locator('[data-cinematic-canvas]').first();
 await expect(canvas).toHaveAttribute('data-cinema-state','reduced-motion');
 await page.mouse.move(100,180);await page.mouse.move(500,400);
 expect(await page.locator('video').evaluateAll(videos=>videos.every(video=>(video as HTMLVideoElement).paused))).toBe(true);
 expect(await page.locator('[data-lighting-active]').count()).toBe(0);
 await expect(page.getByRole('heading',{level:1})).toBeVisible();await noOverflow(page);
});

test.describe('mobile navigation',()=>{
 test.beforeEach(async({page,viewport})=>{test.skip(!viewport||viewport.width>=1101,'Navigation dialog is below the current 1101px breakpoint.');await publicPage(page,'/');});
 test('modal fits the viewport and contains Tab and Shift+Tab focus',async({page},testInfo)=>{
  const {dialog}=await openMenu(page),box=await dialog.boundingBox(),viewport=page.viewportSize();
  expect(box).not.toBeNull();expect(viewport).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(-1);expect(box!.y).toBeGreaterThanOrEqual(-1);
  expect(box!.x+box!.width).toBeLessThanOrEqual(viewport!.width+1);expect(box!.y+box!.height).toBeLessThanOrEqual(viewport!.height+1);
  expect(await dialog.evaluate(element=>element.scrollWidth<=element.clientWidth+1)).toBe(true);
  await expect(dialog.getByRole('button',{name:'Close navigation',exact:true})).toBeFocused();
  await expectContainsFocus(page,dialog);await page.screenshot({path:testInfo.outputPath('mobile-menu.png')});
 });
 test('Escape and Close release scroll lock and restore trigger focus without scrolling',async({page})=>{
  const trigger=page.getByRole('button',{name:'Open navigation',exact:true});await trigger.focus();
  await page.evaluate(()=>window.scrollTo({top:50,behavior:'instant'}));const scroll=await page.evaluate(()=>window.scrollY);
  await page.keyboard.press('Enter');const dialog=page.getByRole('dialog',{name:'Explore RivyaLivingArt'});await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await expect(trigger).toBeFocused();await expect(trigger).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');expect(await page.evaluate(()=>window.scrollY)).toBe(scroll);
  await page.keyboard.press('Enter');await dialog.getByRole('button',{name:'Close navigation',exact:true}).click();
  await expect(dialog).not.toBeVisible();await expect(trigger).toBeFocused();await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');
 });
 test('a collection selection navigates and releases the dialog',async({page})=>{
  const {dialog}=await openMenu(page);await dialog.locator('a[href="/collectible-design"]').click();
  await expect(page).toHaveURL(/\/collectible-design$/);await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await expect(page.getByRole('dialog',{name:'Explore RivyaLivingArt'})).not.toBeVisible();await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');
 });
 test('current atelier navigation opens its page and remains usable',async({page})=>{
  const {dialog}=await openMenu(page);await dialog.locator('a[href="/our-story"]').click();
  await expect(page).toHaveURL(/\/our-story$/);await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await expect(page.getByRole('dialog',{name:'Explore RivyaLivingArt'})).not.toBeVisible();await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');await noOverflow(page);
 });
 test('resizing to desktop closes the dialog and restores desktop navigation',async({page})=>{
  const {dialog}=await openMenu(page);await page.setViewportSize({width:1200,height:900});
  await expect(dialog).not.toBeVisible();await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');
  const navigation=page.getByRole('navigation',{name:'Main navigation',exact:true});await expect(navigation).toBeVisible();
  await navigation.locator('summary').click();await navigation.locator('a[href="/memory-art"]').click();
  await expect(page).toHaveURL(/\/memory-art$/);await expect(page.getByRole('heading',{level:1})).toBeVisible();
 });
});

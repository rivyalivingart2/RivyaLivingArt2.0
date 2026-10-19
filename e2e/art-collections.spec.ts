import {test,expect,cards,titles,filterForm,results,applyFilters,noOverflow,publicPage,decoded,productPath} from './helpers';

const worlds=[{tier:'memory',path:'/memory-art'},{tier:'personal',path:'/personal-art'}] as const;
for(const world of worlds){
 test(`${world.tier} collection renders published pieces and preserves view-size history`,async({page,products},testInfo)=>{
  const expected=products.filter(p=>p.tier===world.tier);await publicPage(page,world.path);
  await expect(cards(page)).toHaveCount(Math.min(12,expected.length));expect(await titles(page)).toEqual(expected.slice(0,12).map(p=>p.name));
  for(const card of await cards(page).all())expect(await card.locator('a a,a button').count()).toBe(0);
  await decoded(cards(page).first().locator('img'));
  await filterForm(page).getByRole('combobox',{name:'Pieces per view',exact:true}).selectOption('24');await applyFilters(page);
  await expect(page).toHaveURL(url=>url.searchParams.get('size')==='24');await expect(cards(page)).toHaveCount(Math.min(24,expected.length));
  await noOverflow(page);await page.screenshot({path:testInfo.outputPath(world.tier+'-collection.png')});
  await page.goBack();await expect(filterForm(page).getByRole('combobox',{name:'Pieces per view',exact:true})).toHaveValue('12');await expect(cards(page)).toHaveCount(Math.min(12,expected.length));
 });
 test(`${world.tier} invalid and repeated URL filters normalize to current controls`,async({page,products})=>{
  const expected=products.filter(p=>p.tier===world.tier);const category=expected[0].category;
  await publicPage(page,world.path+'?category=unknown&category='+encodeURIComponent(category)+'&sort=unknown&size=-1&show=-4');
  await expect(filterForm(page).getByRole('combobox',{name:'Category',exact:true})).toHaveValue('all');
  await expect(filterForm(page).getByRole('combobox',{name:'Arrange by',exact:true})).toHaveValue('featured');
  await expect(filterForm(page).getByRole('combobox',{name:'Pieces per view',exact:true})).toHaveValue('12');
  await expect(cards(page)).toHaveCount(Math.min(12,expected.length));await noOverflow(page);
 });
 test(`${world.tier} name ordering persists and current pricing stays request based`,async({page,products})=>{
  const expected=products.filter(p=>p.tier===world.tier).toSorted((a,b)=>a.name.localeCompare(b.name,'en')||a.id.localeCompare(b.id,'en'));
  await publicPage(page,world.path);await filterForm(page).getByRole('combobox',{name:'Arrange by',exact:true}).selectOption('name');await applyFilters(page);
  await expect.poll(()=>titles(page)).toEqual(expected.slice(0,12).map(p=>p.name));
  await page.reload();await expect(filterForm(page).getByRole('combobox',{name:'Arrange by',exact:true})).toHaveValue('name');
  for(const card of await cards(page).all())await expect(card).toContainText('Price on request');
  await expect(filterForm(page).getByRole('combobox',{name:'Arrange by',exact:true}).locator('option')).toHaveText(['Collection order','Name A–Z','Name Z–A']);
 });
 test(`${world.tier} filters collapse with keyboard input and recover from an empty search`,async({page})=>{
  await publicPage(page,world.path);const summary=page.locator('[data-public-part="filter"] > summary');
  await summary.focus();await page.keyboard.press('Enter');await expect(filterForm(page)).not.toBeVisible();await page.keyboard.press('Space');await expect(filterForm(page)).toBeVisible();
  await filterForm(page).getByRole('searchbox',{name:'Find your piece',exact:true}).fill('rivya-no-matching-'+world.tier+'-f10b92');await applyFilters(page);
  await expect(cards(page)).toHaveCount(0);await expect(results(page)).toHaveText(/No pieces to show/);
  await page.getByRole('link',{name:'Clear filters',exact:true}).click();await expect(page).toHaveURL(new RegExp(world.path+'$'));expect(await cards(page).count()).toBeGreaterThan(0);await noOverflow(page);
 });
}

test('memory category and search choices survive reload Back and reset',async({page,products})=>{
 const product=products.find(p=>p.tier==='memory')!;await publicPage(page,'/memory-art');const form=filterForm(page);
 await form.getByRole('combobox',{name:'Category',exact:true}).selectOption(product.category);await form.getByRole('searchbox',{name:'Find your piece',exact:true}).fill(product.name);await applyFilters(page);
 await expect(cards(page).getByRole('heading',{name:product.name,exact:true})).toBeVisible();await page.reload();await expect(form.getByRole('searchbox',{name:'Find your piece',exact:true})).toHaveValue(product.name);
 await form.getByRole('link',{name:'Reset',exact:true}).click();await expect(page).toHaveURL(/\/memory-art$/);await page.goBack();await expect(form.getByRole('combobox',{name:'Category',exact:true})).toHaveValue(product.category);await noOverflow(page);
});

test('personal category chips can be removed without losing the search',async({page,products})=>{
 const product=products.find(p=>p.tier==='personal')!;
 await publicPage(page,'/personal-art?category='+encodeURIComponent(product.category)+'&q='+encodeURIComponent(product.name));
 const chips=page.getByRole('navigation',{name:'Applied filters',exact:true});await expect(chips).toBeVisible();
 await chips.getByRole('link',{name:'Remove filter: '+product.category,exact:true}).click();
 await expect(page).toHaveURL(url=>!url.searchParams.has('category')&&url.searchParams.get('q')===product.name);
 await expect(cards(page).getByRole('heading',{name:product.name,exact:true})).toBeVisible();
 await chips.getByRole('link',{name:'Clear all filters',exact:true}).click();await expect(page).toHaveURL(/\/personal-art$/);await noOverflow(page);
});

test('memory detail keeps preservation guidance care and related pieces accessible',async({page,products},testInfo)=>{
 const product=products.find(p=>p.tier==='memory')!;await publicPage(page,productPath(product));
 await expect(page.getByRole('heading',{level:1,name:product.name,exact:true})).toBeVisible();
 await expect(page.getByText('First-time preservation?',{exact:true})).toBeVisible();
 await expect(page.getByText("Share clear photographs and wait for the studio's guidance before sending anything irreplaceable.",{exact:true})).toBeVisible();
 const care=page.locator('summary').filter({hasText:'Living with your piece'});await care.focus();await page.keyboard.press('Enter');await expect(care.locator('..')).toHaveAttribute('open','');
 for(const link of await page.locator('[data-public-part="related"] [data-public-part="card"]').all()){
  const href=await link.getAttribute('href');expect(products.some(p=>p.tier==='memory'&&p.id!==product.id&&productPath(p)===href)).toBe(true);
 }
 await noOverflow(page);await page.screenshot({path:testInfo.outputPath('memory-detail.png')});
 await page.getByRole('link',{name:'process guide',exact:true}).click();await expect(page).toHaveURL(/\/process$/);await expect(page.getByRole('heading',{level:1})).toBeVisible();
});

test('personal customization choices reset on reload and do not change the displayed piece',async({page,products})=>{
 const product=products.find(p=>p.tier==='personal'&&p.fields.some(f=>f.type==='select'&&!f.visibleWhen&&(f.options?.length||0)>1));
 expect(product,'Published QA must include an unconditional personal choice field').toBeTruthy();
 const field=product!.fields.find(f=>f.type==='select'&&!f.visibleWhen&&(f.options?.length||0)>1)!;
 await publicPage(page,productPath(product!));
 await page.getByRole('link',{name:/Customize this piece/}).first().click();await expect(page).toHaveURL(new RegExp(productPath(product!)+'/customize$'));
 const select=page.locator('#answer-'+field.id);await expect(select).toBeVisible();const image=page.locator('[data-public-part="form-summary"] img'),source=await image.getAttribute('src');
 await select.selectOption(field.options![1]);await expect(select).toHaveValue(field.options![1]);await expect(image).toHaveAttribute('src',source!);
 await expect(page.getByText('Read-only browser test: saving is unavailable.',{exact:true})).toBeVisible();
 page.once('dialog',dialog=>dialog.accept());await page.reload();await expect(select).toHaveValue('');await noOverflow(page);
});

test('saved personal pieces survive reload without creating an inquiry',async({page,products})=>{
 const product=products.find(p=>p.tier==='personal')!;await publicPage(page,productPath(product));
 const save=page.getByRole('button',{name:'Save to saved pieces: '+product.name,exact:true});await save.click();
 await expect(page.getByRole('button',{name:'Remove from saved pieces: '+product.name,exact:true})).toHaveAttribute('aria-pressed','true');
 await page.goto('/saved-pieces');await expect(cards(page)).toHaveCount(1);await expect(cards(page).getByRole('heading',{name:product.name,exact:true})).toBeVisible();
 await page.reload();await expect(cards(page)).toHaveCount(1);await expect(page.getByText('Saved on this browser only.',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'Clear saved pieces',exact:true}).click();await expect(cards(page)).toHaveCount(0);await expect(page.getByRole('heading',{name:'No saved pieces yet.',exact:true})).toBeVisible();await noOverflow(page);
});

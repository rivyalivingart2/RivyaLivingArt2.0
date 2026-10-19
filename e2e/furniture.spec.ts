import {test,expect,cards,titles,filterForm,results,applyFilters,noOverflow,publicPage,decoded,expectContainsFocus,productPath,resourceErrorKey} from './helpers';

test('display and body typography use distinct loaded local fonts',async({page})=>{
 await publicPage(page,'/');
 const fonts=await page.evaluate(async()=>{await document.fonts.ready;const first=(value:string)=>value.split(',')[0].trim().replaceAll('"','').replaceAll("'",'');return {heading:first(getComputedStyle(document.querySelector('h1')!).fontFamily),body:first(getComputedStyle(document.body).fontFamily),loaded:Array.from(document.fonts).filter(font=>font.status==='loaded').map(font=>first(font.family))};});
 expect(fonts.heading).not.toBe(fonts.body);expect(fonts.loaded).toContain(fonts.heading);expect(fonts.loaded).toContain(fonts.body);
});

test('incremental catalogue loading preserves earlier pieces and browser Back',async({page,products},testInfo)=>{
 await publicPage(page,'/search');await expect(cards(page)).toHaveCount(12);
 await expect(results(page)).toHaveText(`Showing 1–12 / ${products.length} pieces`);const first=await titles(page);
 await page.getByRole('link',{name:/^Show \d+ more pieces/}).click();
 await expect(page).toHaveURL(url=>url.searchParams.get('show')==='24');
 await expect(cards(page)).toHaveCount(Math.min(24,products.length));
 const expanded=await titles(page);expect(expanded.slice(0,12)).toEqual(first);expect(new Set(expanded).size).toBe(expanded.length);
 await noOverflow(page);await page.screenshot({path:testInfo.outputPath('catalogue-expanded.png')});
 await page.goBack();await expect(cards(page)).toHaveCount(12);expect(await titles(page)).toEqual(first);
});

test('invalid URL filters and extreme page sizes normalize safely',async({page})=>{
 await publicPage(page,'/search?category=unknown&collection=unknown&sort=unknown&size=-42&show=-42');
 const form=filterForm(page);
 for(const label of ['Category','Collection'])await expect(form.getByRole('combobox',{name:label,exact:true})).toHaveValue('all');
 await expect(form.getByRole('combobox',{name:'Arrange by',exact:true})).toHaveValue('featured');
 await expect(form.getByRole('combobox',{name:'Pieces per view',exact:true})).toHaveValue('12');
 await expect(cards(page)).toHaveCount(12);await expect(page.getByText('An unavailable filter has been reset. Choose from the current collection options.',{exact:true})).toBeVisible();
 await page.goto('/search?size=999999&show=9999999');await expect(cards(page)).toHaveCount(12);await noOverflow(page);
});

test('search category and view size survive reload and browser Back',async({page,products})=>{
 const target=products.find(p=>p.tier==='large')!;
 await publicPage(page,'/search');const form=filterForm(page);
 await form.getByRole('combobox',{name:'Category',exact:true}).selectOption(target.category);
 await form.getByRole('searchbox',{name:'Find your piece',exact:true}).fill(target.name);
 await form.getByRole('combobox',{name:'Pieces per view',exact:true}).selectOption('24');await applyFilters(page);
 await expect(page).toHaveURL(url=>url.searchParams.get('category')===target.category&&url.searchParams.get('q')===target.name&&url.searchParams.get('size')==='24');
 await expect(cards(page).getByRole('heading',{name:target.name,exact:true})).toBeVisible();
 await page.reload();await expect(form.getByRole('searchbox',{name:'Find your piece',exact:true})).toHaveValue(target.name);await expect(form.getByRole('combobox',{name:'Category',exact:true})).toHaveValue(target.category);
 await form.getByRole('link',{name:'Reset',exact:true}).click();await expect(page).toHaveURL(/\/search$/);
 await page.goBack();await expect(form.getByRole('searchbox',{name:'Find your piece',exact:true})).toHaveValue(target.name);await noOverflow(page);
});

test('category selection exposes current published furniture through real cards',async({page,products})=>{
 const target=products.find(p=>p.tier==='large')!;
 await publicPage(page,'/collectible-design?category='+encodeURIComponent(target.category));
 const expected=products.filter(p=>p.tier==='large'&&p.category===target.category).slice(0,12).map(p=>p.name);
 await expect(cards(page)).toHaveCount(expected.length);expect(await titles(page)).toEqual(expected);
 await cards(page).getByRole('link').first().click();await expect(page.getByRole('heading',{level:1,name:expected[0],exact:true})).toBeVisible();
});

test('name sorting changes actual result order and survives expanded loading',async({page,products})=>{
 await publicPage(page,'/search');const form=filterForm(page);
 for(const direction of ['name','name-desc']){
  await form.getByRole('combobox',{name:'Arrange by',exact:true}).selectOption(direction);await applyFilters(page);
  const ordered=products.toSorted((a,b)=>(direction==='name'?1:-1)*a.name.localeCompare(b.name,'en')||a.id.localeCompare(b.id,'en')).map(p=>p.name);
  await expect.poll(()=>titles(page)).toEqual(ordered.slice(0,12));
 }
 await page.getByRole('link',{name:/^Show \d+ more pieces/}).click();await expect(page).toHaveURL(url=>url.searchParams.get('sort')==='name-desc'&&url.searchParams.get('show')==='24');
 const expected=products.toSorted((a,b)=>-a.name.localeCompare(b.name,'en')||a.id.localeCompare(b.id,'en')).slice(0,24).map(p=>p.name);
 await expect.poll(()=>titles(page)).toEqual(expected);
});

test('empty search exposes accessible reset without empty product cards',async({page},testInfo)=>{
 await publicPage(page,'/search?q=rivya-e2e-no-matching-piece-7f906a');
 await expect(results(page)).toHaveText(/No pieces to show/);await expect(cards(page)).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'A different starting point.',exact:true})).toBeVisible();
 await expect(page.getByRole('link',{name:/^Show \d+ more pieces/})).toHaveCount(0);
 await noOverflow(page);await page.screenshot({path:testInfo.outputPath('empty-search.png')});
 await page.getByRole('link',{name:'Clear filters',exact:true}).click();await expect(page).toHaveURL(/\/search$/);await expect(cards(page)).toHaveCount(12);
});

test('filter disclosure closes and opens from the keyboard',async({page})=>{
 await publicPage(page,'/search');const summary=page.locator('[data-public-part="filter"] > summary');
 await summary.focus();await page.keyboard.press('Enter');await expect(filterForm(page)).not.toBeVisible();
 await page.keyboard.press('Space');await expect(filterForm(page)).toBeVisible();await noOverflow(page);
});

test('customization choices are editable with explicit unavailable saving and reset on reload',async({page,products})=>{
 const product=products.find(p=>p.tier==='large'&&p.fields.some(f=>f.type==='select'&&!f.visibleWhen&&(f.options?.length||0)>1));
 expect(product,'Published QA must include an unconditional selectable furniture field').toBeTruthy();
 const field=product!.fields.find(f=>f.type==='select'&&!f.visibleWhen&&(f.options?.length||0)>1)!;
 await publicPage(page,productPath(product!)+'/customize');const select=page.locator('#answer-'+field.id);
 await expect(select).toBeVisible();await select.selectOption(field.options![1]);await expect(select).toHaveValue(field.options![1]);
 await expect(page.getByText('Read-only browser test: saving is unavailable.',{exact:true})).toBeVisible();
 page.once('dialog',dialog=>dialog.accept());await page.reload();await expect(select).toHaveValue('');await noOverflow(page);
});

test('gallery zoom decodes media and restores keyboard focus and scroll on dismissal',async({page,products},testInfo)=>{
 const product=products.find(p=>p.tier==='large'&&p.images.length>1)!;expect(product).toBeTruthy();
 await publicPage(page,productPath(product));const trigger=page.getByRole('button',{name:'Enlarge image of '+product.name,exact:true});
 await trigger.focus();const before=await page.evaluate(()=>window.scrollY);await page.keyboard.press('Enter');
 const dialog=page.getByRole('dialog',{name:product.name,exact:true});await expect(dialog).toBeVisible();await decoded(dialog.locator('img'));
 await expectContainsFocus(page,dialog);await page.screenshot({path:testInfo.outputPath('gallery-zoom.png')});
 await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await expect(trigger).toBeFocused();
 await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');expect(await page.evaluate(()=>window.scrollY)).toBe(before);
});

test('failed product media keeps written details and offers a working image retry',async({page,products,expectedHttpErrors})=>{
 const product=products.find(p=>p.tier==='large')!;let fail=true;
 await page.route('**/*',async route=>{const url=new URL(route.request().url());const image=url.pathname==='/_next/image'?url.searchParams.get('url'):url.pathname;if(fail&&product.images.includes(image||'')){expectedHttpErrors.add(resourceErrorKey(url.href,503));return route.fulfill({status:503,body:'Intentional image-failure test'});}return route.fallback();});
 await publicPage(page,productPath(product));const visual=page.locator('[data-public-part="gallery-image"]');
 await expect(visual.getByRole('img',{name:/Image unavailable/})).toBeVisible();await expect(page.getByRole('heading',{level:1,name:product.name,exact:true})).toBeVisible();
 fail=false;await visual.getByRole('button',{name:'Retry image',exact:true}).click();await decoded(visual.locator('img'));
 await expect(page.getByRole('link',{name:/Customize this piece/}).first()).toHaveAttribute('href',productPath(product)+'/customize');
});

test('failed card media preserves the product destination and honest fallback',async({page,products,expectedHttpErrors},testInfo)=>{
 const product=products.find(p=>p.tier==='large')!;
 await page.route('**/_next/image?**',async route=>{const url=new URL(route.request().url()),path=url.searchParams.get('url');if(product.images.includes(path||'')){expectedHttpErrors.add(resourceErrorKey(url.href,503));return route.fulfill({status:503,body:'Intentional card-image failure'});}return route.fallback();});
 await publicPage(page,'/search?q='+encodeURIComponent(product.name));const card=cards(page).filter({has:page.getByRole('heading',{name:product.name,exact:true})});
 await card.scrollIntoViewIfNeeded();await expect(card.getByRole('img',{name:/Image unavailable/})).toBeVisible();
 await expect(card.getByRole('link')).toHaveAttribute('href',productPath(product));await expect(card.locator('img')).toHaveCount(0);await noOverflow(page);
 await page.screenshot({path:testInfo.outputPath('card-image-fallback.png')});
});

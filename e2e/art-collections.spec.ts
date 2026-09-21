import { test, expect, type Page } from "@playwright/test";

const pageErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  pageErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
});

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page), "The memory and personal journeys have no uncaught or console errors").toEqual([]);
});

function cards(page: Page, tier: "memory" | "personal") {
  return page.locator(`#collection-results article[data-tier="${tier}"]`);
}

async function titles(page: Page, tier: "memory" | "personal") {
  return cards(page, tier).getByRole("heading", { level: 3 }).allTextContents();
}

async function expectNoHorizontalOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(sizes.document, "The document fits the viewport").toBeLessThanOrEqual(sizes.viewport);
  expect(sizes.body, "The body fits the viewport").toBeLessThanOrEqual(sizes.viewport);
}

async function applyFilters(page: Page) {
  const expected = await page.locator("form").evaluate((form: HTMLFormElement) => Object.fromEntries(new FormData(form)));
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page).toHaveURL((url) => Object.entries(expected).every(([key, value]) => url.searchParams.get(key) === value));
}

const worlds = [
  {
    tier: "memory", path: "/memory-art", heading: "Art for the memory.",
    selects: ["Occasion", "Preservation"], params: ["occasion", "preservation"],
    firstTitle: "Vow Framed Varmala Keepsake", firstSlug: "vow-framed-varmala-keepsake",
    action: "Preserve Your Memory",
    names: ["Vow Framed Varmala Keepsake", "Hourglass Floral Wall Clock", "Union Engagement Tray", "Letterlight Invitation Frame", "Threshold Family Nameplate", "First Chapter Baby Keepsake"],
    priceOrder: ["Union Engagement Tray", "Threshold Family Nameplate", "Letterlight Invitation Frame", "Hourglass Floral Wall Clock", "Vow Framed Varmala Keepsake", "First Chapter Baby Keepsake"],
    requestOnly: "First Chapter Baby Keepsake",
  },
  {
    tier: "personal", path: "/personal-art", heading: "Art for the person.",
    selects: ["Recipient", "Colour", "Festival"], params: ["recipient", "colour", "festival"],
    firstTitle: "Botanical Resin Pendant", firstSlug: "botanical-resin-pendant",
    action: "Personalize & Enquire",
    names: ["Botanical Resin Pendant", "Thread of Light Resin Rakhi", "Initial Story Keychain", "Chaptermark Flower Bookmark", "Everyday Resin Coaster Set", "Little Archive Keepsake Box"],
    priceOrder: ["Thread of Light Resin Rakhi", "Chaptermark Flower Bookmark", "Initial Story Keychain", "Botanical Resin Pendant", "Everyday Resin Coaster Set", "Little Archive Keepsake Box"],
    requestOnly: "Little Archive Keepsake Box",
  },
] as const;

for (const world of worlds) {
  test(`${world.tier} collection paginates six correctly labelled studies and restores browser history`, async ({ page }, testInfo) => {
    await page.goto(world.path);
    await expect(page.getByRole("heading", { level: 1, name: world.heading })).toBeVisible();
    await expect(page.getByRole("status")).toHaveText("Showing 1–4 of 6 studies");
    await expect(cards(page, world.tier)).toHaveCount(4);
    expect(await titles(page, world.tier)).toEqual(world.names.slice(0, 4));
    await expect(cards(page, world.tier).getByRole("img", { name: /visual pending/i })).toHaveCount(4);
    await expect(cards(page, world.tier).locator("img")).toHaveCount(0);
    const first = cards(page, world.tier).first();
    await expect(first.getByRole("link", { name: world.firstTitle, exact: true })).toHaveAttribute("href", `/pieces/${world.firstSlug}`);
    await expect(first.getByRole("link", { name: `${world.action} — ${world.firstTitle}`, exact: true })).toHaveAttribute("href", `/pieces/${world.firstSlug}#guidance`);
    await expect(first.locator("a a, a button")).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: testInfo.outputPath(`${world.tier}-collection.png`), fullPage: true });
    await page.getByRole("link", { name: "Next →", exact: true }).click();
    await expect(page).toHaveURL((url) => url.pathname === world.path && url.searchParams.get("page") === "2" && url.hash === "#collection-results");
    await expect(page.getByRole("status")).toHaveText("Showing 5–6 of 6 studies");
    expect(await titles(page, world.tier)).toEqual(world.names.slice(4));
    await expect(page.getByRole("link", { name: "Page 2", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("link", { name: "Next →", exact: true })).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
    await page.goBack();
    await expect(page.getByRole("status")).toHaveText("Showing 1–4 of 6 studies");
    expect(await titles(page, world.tier)).toEqual(world.names.slice(0, 4));
  });

  test(`${world.tier} invalid and repeated URL filters normalize to safe controls`, async ({ page }) => {
    const invalid = world.params.map((key) => `${key}=unknown`).join("&");
    await page.goto(`${world.path}?${invalid}&sort=width-asc&page=-42`);
    for (const name of world.selects) await expect(page.getByRole("combobox", { name, exact: true })).toHaveValue("all");
    await expect(page.getByRole("combobox", { name: "Sort by", exact: true })).toHaveValue("featured");
    await expect(page.getByRole("status")).toHaveText("Showing 1–4 of 6 studies");
    const key = world.params[0];
    const value = world.tier === "memory" ? "wedding" : "friend";
    await page.goto(`${world.path}?${key}=${value}&${key}=all&sort=price-asc&sort=title-asc&page=1&page=2`);
    await expect(page.getByRole("combobox", { name: world.selects[0], exact: true })).toHaveValue("all");
    await expect(page.getByRole("combobox", { name: "Sort by", exact: true })).toHaveValue("featured");
    await expect(page.getByRole("status")).toHaveText("Showing 1–4 of 6 studies");
    await page.goto(`${world.path}?page=999999`);
    await expect(page.getByRole("status")).toHaveText("Showing 5–6 of 6 studies");
    await expectNoHorizontalOverflow(page);
  });

  test(`${world.tier} sample-price sorting persists into pagination and keeps request-only prices honest`, async ({ page }) => {
    await page.goto(world.path);
    await page.getByRole("combobox", { name: "Sort by", exact: true }).selectOption("price-asc");
    await applyFilters(page);
    expect(await titles(page, world.tier)).toEqual(world.priceOrder.slice(0, 4));
    await page.getByRole("link", { name: "Next →", exact: true }).click();
    await expect(page).toHaveURL((url) => url.searchParams.get("page") === "2" && url.searchParams.get("sort") === "price-asc");
    await expect(page.getByRole("combobox", { name: "Sort by", exact: true })).toHaveValue("price-asc");
    expect(await titles(page, world.tier)).toEqual(world.priceOrder.slice(4));
    const requestOnly = cards(page, world.tier).filter({ has: page.getByRole("heading", { name: world.requestOnly, exact: true }) });
    await expect(requestOnly.getByText("Price on request", { exact: true })).toBeVisible();
    await expect(requestOnly).not.toContainText("₹0");
  });

  test(`${world.tier} filters collapse with keyboard input and recover from an empty result`, async ({ page }, testInfo) => {
    await page.goto(world.path);
    const summary = page.locator("summary").filter({ hasText: "Refine the collection" });
    const firstSelect = page.getByRole("combobox", { name: world.selects[0], exact: true });
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(firstSelect).not.toBeVisible();
    await expect(summary).toBeFocused();
    await page.keyboard.press("Space");
    await page.keyboard.press("Tab");
    await expect(firstSelect).toBeFocused();
    if (world.tier === "memory") {
      await firstSelect.selectOption("new-arrival");
      await page.getByRole("combobox", { name: "Preservation", exact: true }).selectOption("paper");
    } else {
      await firstSelect.selectOption("host");
      await page.getByRole("combobox", { name: "Festival", exact: true }).selectOption("rakhi");
    }
    await applyFilters(page);
    await expect(page.getByRole("status")).toHaveText("No matching studies");
    await expect(page.getByRole("heading", { name: "No studies match this combination." })).toBeVisible();
    await expect(cards(page, world.tier)).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Collection pages" })).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: testInfo.outputPath(`${world.tier}-empty.png`), fullPage: true });
    await page.getByRole("link", { name: "View all studies", exact: true }).click();
    await expect(page).toHaveURL((url) => url.pathname === world.path && url.search === "" && url.hash === "#collection-results");
    await expect(page.getByRole("status")).toHaveText("Showing 1–4 of 6 studies");
    for (const name of world.selects) await expect(page.getByRole("combobox", { name, exact: true })).toHaveValue("all");
  });
}

test("memory occasion and preservation choices survive reload, Back and reset", async ({ page }) => {
  await page.goto("/memory-art");
  await page.getByRole("combobox", { name: "Occasion", exact: true }).selectOption("wedding");
  await page.getByRole("combobox", { name: "Preservation", exact: true }).selectOption("flowers");
  await page.getByRole("combobox", { name: "Sort by", exact: true }).selectOption("title-asc");
  await applyFilters(page);
  const firstNames = await titles(page, "memory");
  expect(firstNames).toEqual(["Hourglass Floral Wall Clock", "Vow Framed Varmala Keepsake"]);
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Occasion", exact: true })).toHaveValue("wedding");
  await expect(page.getByRole("combobox", { name: "Preservation", exact: true })).toHaveValue("flowers");
  await expect(page.getByRole("combobox", { name: "Sort by", exact: true })).toHaveValue("title-asc");
  expect(await titles(page, "memory")).toEqual(firstNames);
  await page.getByRole("combobox", { name: "Preservation", exact: true }).selectOption("paper");
  await applyFilters(page);
  expect(await titles(page, "memory")).toEqual(["Letterlight Invitation Frame"]);
  await page.goBack();
  await expect(page.getByRole("combobox", { name: "Preservation", exact: true })).toHaveValue("flowers");
  expect(await titles(page, "memory")).toEqual(firstNames);
  await page.getByRole("link", { name: "Reset filters", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Showing 1–4 of 6 studies");
});

test("personal recipient, colour and festival facets survive reload and Back", async ({ page }) => {
  await page.goto("/personal-art");
  await page.getByRole("combobox", { name: "Recipient", exact: true }).selectOption("reader");
  await page.getByRole("combobox", { name: "Colour", exact: true }).selectOption("clear");
  await page.getByRole("combobox", { name: "Festival", exact: true }).selectOption("everyday");
  await page.getByRole("combobox", { name: "Sort by", exact: true }).selectOption("price-asc");
  await applyFilters(page);
  expect(await titles(page, "personal")).toEqual(["Chaptermark Flower Bookmark"]);
  await page.reload();
  for (const [name, value] of [["Recipient", "reader"], ["Colour", "clear"], ["Festival", "everyday"], ["Sort by", "price-asc"]]) {
    await expect(page.getByRole("combobox", { name, exact: true })).toHaveValue(value);
  }
  await page.getByRole("combobox", { name: "Festival", exact: true }).selectOption("rakhi");
  await applyFilters(page);
  await expect(page.getByRole("status")).toHaveText("No matching studies");
  await page.goBack();
  await expect(page.getByRole("combobox", { name: "Festival", exact: true })).toHaveValue("everyday");
  expect(await titles(page, "personal")).toEqual(["Chaptermark Flower Bookmark"]);
  await page.getByRole("link", { name: "Reset filters", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Showing 1–4 of 6 studies");
});

test("memory detail presents preservation fields and a working local guidance destination", async ({ page }, testInfo) => {
  await page.goto("/memory-art");
  const vow = cards(page, "memory").filter({ has: page.getByRole("heading", { name: "Vow Framed Varmala Keepsake", exact: true }) });
  await expect(vow.getByText("Price on request", { exact: true })).toBeVisible();
  await vow.getByRole("link", { name: "Vow Framed Varmala Keepsake", exact: true }).click();
  await expect(page).toHaveURL(/\/pieces\/vow-framed-varmala-keepsake$/);
  await expect(page.getByRole("heading", { level: 1, name: "Vow", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sample size options", exact: true })).toBeVisible();
  await expect(page.getByText("Framed botanical composition", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Intimate frame", exact: true })).toBeVisible();
  await expect(page.getByText("300 × 55 × 400 mm", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Statement frame", exact: true })).toBeVisible();
  await expect(page.getByText("400 × 65 × 500 mm", { exact: true })).toBeVisible();
  const figure = page.locator("main figure").first();
  await expect(figure.getByRole("img", { name: /visual pending/i })).toBeVisible();
  await expect(figure.locator("img")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "View image", exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /installation/i })).toHaveCount(0);
  const care = page.locator("summary").filter({ hasText: "Care & preservation" });
  await care.focus();
  await page.keyboard.press("Enter");
  await expect(care.locator("..")).toHaveAttribute("open", "");
  await expectNoHorizontalOverflow(page);
  // Start full-page evidence at the top so fixed offscreen skip links stay outside the capture.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("memory-detail.png"), fullPage: true });
  await page.getByRole("link", { name: "Preserve Your Memory", exact: true }).click();
  await expect(page).toHaveURL(/#guidance$/);
  await expect(page.getByRole("heading", { name: /Before you send\s*a keepsake\./ })).toBeInViewport();
  await expect(page.locator('main article[data-tier="memory"]')).toHaveCount(3);
  await expect(page.locator('main article[data-tier="personal"]')).toHaveCount(0);
  const related = page.locator('main article[data-tier="memory"] .concept-link').first();
  await related.click();
  await expect(page).not.toHaveURL(/vow-framed-varmala-keepsake/);
  await expect(page.getByRole("heading", { name: /Before you send\s*a keepsake\./ })).toBeVisible();
  await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: /Memory art$/ }).click();
  await expect(page).toHaveURL(/\/memory-art$/);
});

test("personal variant choice follows into local guidance and resets after reload", async ({ page }, testInfo) => {
  await page.goto("/personal-art");
  await cards(page, "personal").first().getByRole("link", { name: "Botanical Resin Pendant", exact: true }).click();
  await expect(page).toHaveURL(/\/pieces\/botanical-resin-pendant$/);
  const group = page.getByRole("group", { name: "Sample variant", exact: true });
  const price = page.locator("main").getByText("₹1,800", { exact: true });
  await expect(price).toBeVisible();
  await expect(page.getByText("24 × 7 × 34 mm", { exact: false })).toBeVisible();
  const radios = group.getByRole("radio");
  expect(await radios.count()).toBeGreaterThan(1);
  await expect(radios.first()).toBeChecked();
  const secondLabel = await radios.nth(1).evaluate((input: HTMLInputElement) => input.labels?.[0]?.textContent?.trim() ?? "");
  expect(secondLabel.length).toBeGreaterThan(0);
  await radios.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(radios.nth(1)).toBeChecked();
  await expect(page.getByText(`Preview selection: ${secondLabel}`, { exact: true })).toBeVisible();
  await expect(price).toHaveText("₹1,800");
  await page.getByRole("link", { name: "Personalize & Enquire", exact: true }).click();
  await expect(page).toHaveURL(/#guidance$/);
  await expect(page.getByRole("heading", { name: "A gift, made personal.", exact: true })).toBeInViewport();
  await expect(page.getByText(`Selected sample variant: ${secondLabel}`, { exact: true })).toBeVisible();
  await expect(page.locator("main form, main input[type='file'], main a[href^='https://wa.me'], main a[href^='mailto:']")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "View image", exact: true })).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("personal-detail.png"), fullPage: true });
  await expect(page.locator('main article[data-tier="personal"]')).toHaveCount(3);
  await expect(page.locator('main article[data-tier="memory"]')).toHaveCount(0);
  await page.reload();
  await expect(radios.first()).toBeChecked();
  await expect(radios.nth(1)).not.toBeChecked();
  await page.locator('main article[data-tier="personal"] .concept-link').first().click();
  await expect(page).not.toHaveURL(/botanical-resin-pendant/);
  await expect(page.getByRole("heading", { name: "A gift, made personal.", exact: true })).toBeVisible();
  await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: /Personal art & gifts$/ }).click();
  await expect(page).toHaveURL(/\/personal-art$/);
});

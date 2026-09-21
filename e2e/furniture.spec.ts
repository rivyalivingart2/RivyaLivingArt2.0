import { test, expect, type Page } from "@playwright/test";

const pageErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  pageErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page), "The furniture journey has no uncaught JavaScript errors").toEqual([]);
});

function collectionCards(page: Page) {
  return page.locator("#collection-results .concept-card");
}

async function cardTitles(page: Page) {
  return collectionCards(page).getByRole("heading", { level: 3 }).allTextContents();
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);
}

async function applyFilters(page: Page) {
  const expected = await page.locator("form").evaluate((form: HTMLFormElement) => Object.fromEntries(new FormData(form)));
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page).toHaveURL((url) => Object.entries(expected).every(([key, value]) => url.searchParams.get(key) === value));
  await expect(page.getByRole("heading", { name: "The collection", exact: true })).toBeVisible();
}

test("display and body typography use distinct successfully loaded local fonts", async ({ page }) => {
  await page.goto("/");
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    const firstFamily = (value: string) => value.split(",")[0].trim().replaceAll('"', "").replaceAll("'", "");
    const heading = firstFamily(getComputedStyle(document.querySelector("h1")!).fontFamily);
    const body = firstFamily(getComputedStyle(document.body).fontFamily);
    const loaded = Array.from(document.fonts).filter((font) => font.status === "loaded").map((font) => firstFamily(font.family));
    return { heading, body, loaded };
  });
  expect(fonts.heading).not.toBe(fonts.body);
  expect(fonts.loaded).toContain(fonts.heading);
  expect(fonts.loaded).toContain(fonts.body);
});

test("collection pagination exposes all twelve labelled studies and Back restores the page", async ({ page }, testInfo) => {
  await page.goto("/collectible-design");
  await expect(page.getByRole("status")).toHaveText("Showing 1–6 of 12 studies");
  await expect(collectionCards(page)).toHaveCount(6);
  const firstPage = await cardTitles(page);
  await expect(page.getByRole("link", { name: "Page 1", exact: true })).toHaveAttribute("aria-current", "page");
  await page.getByRole("link", { name: "Next →", exact: true }).click();
  await expect(page).toHaveURL(/\?page=2#collection-results$/);
  await expect(page.getByRole("status")).toHaveText("Showing 7–12 of 12 studies");
  await expect(collectionCards(page)).toHaveCount(6);
  const secondPage = await cardTitles(page);
  expect(new Set([...firstPage, ...secondPage]).size, "No duplicate study replaces a missing page item").toBe(12);
  await expect(page.getByRole("link", { name: "Page 2", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: "Next →", exact: true })).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("collection-page-two.png"), fullPage: true });
  await page.goBack();
  await expect(page.getByRole("status")).toHaveText("Showing 1–6 of 12 studies");
  expect(await cardTitles(page)).toEqual(firstPage);
});

test("invalid URL filter values and page numbers render safe normalized controls", async ({ page }) => {
  await page.goto("/collectible-design?category=unknown&material=unknown&size=unknown&sort=unknown&page=-42");
  for (const label of ["Category", "Material", "Size"]) {
    await expect(page.getByRole("combobox", { name: label, exact: true })).toHaveValue("all");
  }
  await expect(page.getByRole("combobox", { name: "Sort by", exact: true })).toHaveValue("featured");
  await expect(page.getByRole("status")).toHaveText("Showing 1–6 of 12 studies");
  await expect(collectionCards(page)).toHaveCount(6);
  await page.goto("/collectible-design?page=999999");
  await expect(page.getByRole("status")).toHaveText("Showing 7–12 of 12 studies");
  await expect(page.getByRole("link", { name: "Page 2", exact: true })).toHaveAttribute("aria-current", "page");
  await page.goto("/collectible-design?category=seating&category=consoles&page=1&page=2");
  await expect(page.getByRole("combobox", { name: "Category", exact: true })).toHaveValue("all");
  await expect(page.getByRole("status")).toHaveText("Showing 1–6 of 12 studies");
  await expectNoHorizontalOverflow(page);
});

test("category, material and size selections survive URL reload and browser Back", async ({ page }, testInfo) => {
  await page.goto("/collectible-design");
  await page.getByRole("combobox", { name: "Category", exact: true }).selectOption("tables");
  await page.getByRole("combobox", { name: "Material", exact: true }).selectOption("wood");
  await page.getByRole("combobox", { name: "Size", exact: true }).selectOption("compact");
  await page.getByRole("combobox", { name: "Sort by", exact: true }).selectOption("title-asc");
  await applyFilters(page);
  const params = new URL(page.url()).searchParams;
  expect(Object.fromEntries(params)).toEqual({ category: "tables", material: "wood", size: "compact", sort: "title-asc" });
  await expect(page.getByRole("status")).toHaveText("Showing 1–2 of 2 studies");
  expect(await cardTitles(page)).toEqual(["Basin", "Twinleaf"]);
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Category", exact: true })).toHaveValue("tables");
  await expect(page.getByRole("combobox", { name: "Material", exact: true })).toHaveValue("wood");
  await expect(page.getByRole("combobox", { name: "Size", exact: true })).toHaveValue("compact");
  await expect(page.getByRole("combobox", { name: "Sort by", exact: true })).toHaveValue("title-asc");
  await page.getByRole("combobox", { name: "Size", exact: true }).selectOption("statement");
  await applyFilters(page);
  expect(await cardTitles(page)).toEqual(["Riverline", "Single-Slab"]);
  await page.goBack();
  await expect(page.getByRole("combobox", { name: "Size", exact: true })).toHaveValue("compact");
  expect(await cardTitles(page)).toEqual(["Basin", "Twinleaf"]);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("collection-filtered.png"), fullPage: true });
  await page.getByRole("link", { name: "Reset filters" }).click();
  await expect(page).toHaveURL(/\/collectible-design#collection-results$/);
  await expect(page.getByRole("status")).toHaveText("Showing 1–6 of 12 studies");
});

test("furniture categories expose seating, consoles and installations through ordinary links", async ({ page }) => {
  await page.goto("/collectible-design");
  const categories = page.getByRole("navigation", { name: "Furniture categories" });
  for (const { label, value, titles } of [
    { label: "Seating", value: "seating", titles: ["Petal", "Threshold"] },
    { label: "Consoles", value: "consoles", titles: ["Span"] },
    { label: "Art & installations", value: "installations", titles: ["Horizon", "Lattice", "Estuary"] },
  ]) {
    await categories.getByRole("link", { name: new RegExp(label) }).click();
    await expect(page.getByRole("combobox", { name: "Category", exact: true })).toHaveValue(value);
    await expect(categories.getByRole("link", { name: new RegExp(label) })).toHaveAttribute("aria-current", "true");
    expect(await cardTitles(page)).toEqual(titles);
  }
});

test("name, width and sample-price sort controls change the actual result order", async ({ page }) => {
  await page.goto("/collectible-design");
  for (const { sort, titles } of [
    { sort: "title-asc", titles: ["Basin", "Estuary", "Horizon", "Lattice", "Orbit", "Petal"] },
    { sort: "width-asc", titles: ["Twinleaf", "Petal", "Lattice", "Orbit", "Basin", "Threshold"] },
    { sort: "price-asc", titles: ["Twinleaf", "Threshold", "Basin", "Orbit", "Span", "Riverline"] },
  ]) {
    await page.getByRole("combobox", { name: "Sort by", exact: true }).selectOption(sort);
    await applyFilters(page);
    expect(new URL(page.url()).searchParams.get("sort")).toBe(sort);
    expect(await cardTitles(page)).toEqual(titles);
  }
  await page.getByRole("link", { name: "Next →", exact: true }).click();
  expect(new URL(page.url()).searchParams.get("sort")).toBe("price-asc");
  await expect(page.getByRole("combobox", { name: "Sort by", exact: true })).toHaveValue("price-asc");
  await expect(page.getByRole("status")).toHaveText("Showing 7–12 of 12 studies");
});

test("an empty filter combination has an accessible reset and no empty product cards", async ({ page }, testInfo) => {
  await page.goto("/collectible-design");
  await page.getByRole("combobox", { name: "Category", exact: true }).selectOption("seating");
  await page.getByRole("combobox", { name: "Material", exact: true }).selectOption("metal");
  await page.getByRole("combobox", { name: "Size", exact: true }).selectOption("compact");
  await applyFilters(page);
  await expect(page.getByRole("status")).toHaveText("No matching studies");
  await expect(page.getByRole("heading", { name: "No studies match this combination." })).toBeVisible();
  await expect(collectionCards(page)).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Collection pages" })).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("collection-empty.png"), fullPage: true });
  await page.getByRole("link", { name: "View all studies" }).click();
  await expect(page.getByRole("status")).toHaveText("Showing 1–6 of 12 studies");
  for (const label of ["Category", "Material", "Size"]) {
    await expect(page.getByRole("combobox", { name: label, exact: true })).toHaveValue("all");
  }
});

test("the filter disclosure closes and opens from the keyboard", async ({ page }) => {
  await page.goto("/collectible-design");
  const summary = page.locator("summary").filter({ hasText: "Refine the collection" });
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("combobox", { name: "Category", exact: true })).not.toBeVisible();
  await expect(summary).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.getByRole("combobox", { name: "Category", exact: true })).toBeVisible();
  await expect(summary).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("combobox", { name: "Category", exact: true })).toBeFocused();
  await expectNoHorizontalOverflow(page);
});

test("finish radios announce the sample preference without changing or persisting the image", async ({ page }, testInfo) => {
  await page.goto("/pieces/riverline-live-edge-dining-table");
  const image = page.locator("main figure img").first();
  await expect(image).toBeVisible();
  const initialSource = await image.getAttribute("src");
  const satin = page.getByRole("radio", { name: "Satin", exact: true });
  const polished = page.getByRole("radio", { name: "Polished", exact: true });
  await expect(satin).toBeChecked();
  await satin.focus();
  await page.keyboard.press("ArrowRight");
  await expect(polished).toBeChecked();
  await expect(satin).not.toBeChecked();
  await expect(page.locator('fieldset [aria-live="polite"]')).toContainText("Polished:");
  await expect(image).toHaveAttribute("src", initialSource!);
  await expect(page.getByText(/your selection is not saved or submitted/)).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("riverline-detail.png"), fullPage: true });
  await page.reload();
  await expect(satin).toBeChecked();
  await expect(polished).not.toBeChecked();
  await expect(image).toHaveAttribute("src", initialSource!);
});

test("gallery zoom decodes the actual image and restores keyboard focus and scroll on dismissal", async ({ page }, testInfo) => {
  await page.goto("/pieces/riverline-live-edge-dining-table");
  const trigger = page.getByRole("button", { name: "View image", exact: true });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  const originalScroll = await page.evaluate(() => window.scrollY);
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Riverline — concept image", exact: true });
  const close = dialog.getByRole("button", { name: "Close", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty("open", true);
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(close).toBeFocused();
  const decoded = await dialog.locator("img").evaluate(async (element: HTMLImageElement) => {
    await element.decode();
    return element.complete && element.naturalWidth === 560 && element.naturalHeight === 700;
  });
  expect(decoded, "Zoom uses the existing Riverline image, not another view or a recolour").toBe(true);
  for (const key of ["Tab", "Shift+Tab"]) {
    await page.keyboard.press(key);
    await expect(close).toBeFocused();
  }
  const box = await dialog.boundingBox();
  const viewport = page.viewportSize();
  if (!box || !viewport) throw new Error("The opened gallery must have a real viewport rectangle.");
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.height).toBeLessThanOrEqual(viewport.height);
  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("riverline-gallery.png") });
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  expect(await page.evaluate(() => window.scrollY)).toBe(originalScroll);
  await page.keyboard.press("Enter");
  await close.click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  expect(await page.evaluate(() => window.scrollY)).toBe(originalScroll);
});

test("a new study has an honest missing-visual fallback, related work and commission navigation", async ({ page }, testInfo) => {
  await page.goto("/collectible-design");
  const stillwater = collectionCards(page).filter({ has: page.getByRole("heading", { name: "Stillwater", exact: true }) });
  await expect(stillwater.getByRole("img", { name: /visual pending/i })).toBeVisible();
  await stillwater.getByRole("link").click();
  await expect(page).toHaveURL(/\/pieces\/stillwater-full-pour-dining-table$/);
  await expect(page.getByRole("heading", { level: 1, name: "Stillwater", exact: true })).toBeVisible();
  const figure = page.locator("main figure").first();
  await expect(figure.getByRole("img", { name: /visual pending/i })).toBeVisible();
  await expect(figure.locator("img")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "View image", exact: true })).toHaveCount(0);
  await expect(page.getByText("Sample content, not a live catalogue.", { exact: true })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("stillwater-pending-visual.png"), fullPage: true });
  const related = page.locator("main .concept-link").first();
  await expect(related).toBeVisible();
  await related.click();
  await expect(page.getByRole("heading", { level: 1, name: "Riverline", exact: true })).toBeVisible();
  const care = page.locator("summary").filter({ hasText: "Care & handling" });
  await care.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText(/Sample care note: discuss surface protection/)).toBeVisible();
  await page.getByRole("link", { name: "Explore commissioning Riverline", exact: true }).click();
  await expect(page).toHaveURL(/\/#commission$/);
  await expect(page.locator("#commission")).toBeInViewport();
});

test("a forced image failure falls back in the card and gallery without a broken zoom control", async ({ page }, testInfo) => {
  let failedRequests = 0;
  await page.route("**/media/concepts/riverline.avif", async (route) => {
    failedRequests += 1;
    await route.fulfill({ status: 404, contentType: "text/plain", body: "Deliberate browser test image failure" });
  });
  await page.goto("/collectible-design");
  const riverline = collectionCards(page).filter({ has: page.getByRole("heading", { name: "Riverline", exact: true }) });
  await expect(riverline.getByRole("img", { name: /Image unavailable/ })).toBeVisible();
  await riverline.getByRole("link").click();
  await expect(page.getByRole("heading", { level: 1, name: "Riverline", exact: true })).toBeVisible();
  const figure = page.locator("main figure").first();
  await expect(figure.getByRole("img", { name: /Image unavailable/ })).toBeVisible();
  await expect(figure.locator("img")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "View image", exact: true })).toHaveCount(0);
  expect(failedRequests, "The browser actually requested the intentionally failed asset").toBeGreaterThan(0);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("riverline-failed-image.png"), fullPage: true });
});

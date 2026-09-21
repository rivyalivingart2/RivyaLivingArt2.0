import { test, expect, type Page } from "@playwright/test";

const routes = [
  { path: "/", name: "home", heading: /Not just an object/ },
  { path: "/collectible-design", name: "collectible-design", heading: "Art for the space." },
  { path: "/memory-art", name: "memory-art", heading: "Art for the memory." },
  { path: "/personal-art", name: "personal-art", heading: "Art for the person." },
  { path: "/pieces/riverline-live-edge-dining-table", name: "riverline", heading: "Riverline" },
  { path: "/pieces/basin-shallow-pour-coffee-table", name: "basin", heading: "Basin" },
  { path: "/studio", name: "studio-status", heading: "The working side of the atelier." },
] as const;

const pageErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  pageErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page), "No uncaught browser JavaScript errors").toEqual([]);
});

function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

async function expectNoHorizontalOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(sizes.document, "Document fits the viewport").toBeLessThanOrEqual(sizes.viewport);
  expect(sizes.body, "Body fits the viewport").toBeLessThanOrEqual(sizes.viewport);
}

async function decodePageImages(page: Page) {
  const images = page.locator("main img");
  for (const image of await images.all()) {
    // Scrolling activates the browser's actual lazy-loading behavior.
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute("alt", /\S/);
    const decoded = await image.evaluate(async (element: HTMLImageElement) => {
      await element.decode();
      return element.complete && element.naturalWidth > 0 && element.naturalHeight > 0;
    });
    expect(decoded, "A rendered image must decode, not just return HTTP 200").toBe(true);
  }
}

async function openMenu(page: Page) {
  const trigger = page.getByRole("button", { name: "Menu", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Explore RivyaLivingArt" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty("open", true);
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  return { trigger, dialog };
}

for (const route of routes) {
  test(`${route.name}: responsive layout, decoded media and labelled preview`, async ({ page }, testInfo) => {
    const consoleErrors = collectConsoleErrors(page);
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
    await expect(page.getByText(/Development preview/)).toBeVisible();
    await expect(page.getByText("Sample content, not a live catalogue.", { exact: true })).toBeVisible();
    await decodePageImages(page);
    await expectNoHorizontalOverflow(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: testInfo.outputPath(`${route.name}.png`), fullPage: true });
    expect(consoleErrors, "No console errors on an existing preview route").toEqual([]);
  });
}

test("furniture and collection journeys navigate through rendered links", async ({ page }) => {
  const consoleErrors = collectConsoleErrors(page);
  await page.goto("/");
  await page.getByRole("link", { name: "Explore collectible design", exact: true }).click();
  await expect(page).toHaveURL(/\/collectible-design$/);
  await expect(page.getByRole("heading", { name: "Art for the space.", level: 1 })).toBeVisible();
  await page.locator("main .concept-link").filter({ has: page.getByRole("heading", { name: "Riverline", exact: true }) }).click();
  await expect(page).toHaveURL(/\/pieces\/riverline-live-edge-dining-table$/);
  await expect(page.getByRole("heading", { name: "Riverline", exact: true, level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "← Collectible design", exact: true }).click();
  await page.locator("main .concept-link").filter({ has: page.getByRole("heading", { name: "Basin", exact: true }) }).click();
  await expect(page).toHaveURL(/\/pieces\/basin-shallow-pour-coffee-table$/);
  await expect(page.getByRole("heading", { name: "Basin", exact: true, level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "RivyaLivingArt home", exact: true }).click();
  await page.locator('.world-card[href="/memory-art"]').click();
  await expect(page.getByRole("heading", { level: 1, name: "Art for the memory." })).toBeVisible();
  await page.getByRole("link", { name: "RivyaLivingArt home", exact: true }).click();
  await page.locator('.world-card[href="/personal-art"]').click();
  await expect(page.getByRole("heading", { level: 1, name: "Art for the person." })).toBeVisible();
  await page.getByRole("link", { name: "Studio development status", exact: true }).click();
  await expect(page).toHaveURL(/\/studio$/);
  await expect(page.getByRole("heading", { level: 1, name: "The working side of the atelier." })).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test("unknown collection, piece and nested routes are actual 404s", async ({ page }) => {
  for (const path of ["/not-an-existing-collection", "/pieces/not-an-existing-piece", "/not-an-existing/nested/route"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: /This piece of the story/ })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.getByRole("link", { name: "Back to RivyaLivingArt" }).click();
    await expect(page.getByRole("heading", { level: 1, name: /Not just an object/ })).toBeVisible();
  }
});

test("reduced motion removes transitions, animation and image hover transforms", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator(".concept-link").first().hover();
  const movingElements = await page.locator("body, body *").evaluateAll((elements) => elements.flatMap((element) => {
    const style = getComputedStyle(element);
    const durationIsZero = (value: string) => value.split(",").every((duration) => parseFloat(duration) === 0);
    return durationIsZero(style.transitionDuration) && durationIsZero(style.animationDuration)
      ? [] : [{ tag: element.tagName, className: element.className, transition: style.transitionDuration, animation: style.animationDuration }];
  }));
  expect(movingElements).toEqual([]);
  await expect(page.locator(".concept-link img").first()).toHaveCSS("transform", "none");
});

test.describe("mobile navigation", () => {
  test.beforeEach(async ({ page, viewport }) => {
    test.skip(!viewport || viewport.width > 760, "Mobile dialog is only available below the navigation breakpoint.");
    await page.goto("/");
  });

  test("modal is centered, fits and contains Tab and Shift+Tab focus", async ({ page }, testInfo) => {
    const { dialog } = await openMenu(page);
    const box = await dialog.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    if (!box || !viewport) throw new Error("The mobile dialog must have an actual viewport rectangle.");
    expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThanOrEqual(1);
    expect(Math.abs(box.y + box.height / 2 - viewport.height / 2)).toBeLessThanOrEqual(1);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.width).toBeLessThanOrEqual(viewport.width);
    expect(box.height).toBeLessThanOrEqual(viewport.height);
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
    const controlCount = await dialog.locator("a[href], button").count();
    for (const key of ["Tab", "Shift+Tab"]) {
      for (let step = 0; step < controlCount + 1; step += 1) {
        await page.keyboard.press(key);
        expect(await dialog.evaluate((element) => element.contains(document.activeElement)), `${key} step ${step + 1} stays within the modal`).toBe(true);
      }
    }
    await page.screenshot({ path: testInfo.outputPath("mobile-menu.png") });
  });

  test("Escape and Close release scroll lock and restore trigger focus without scrolling", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Menu", exact: true });
    await trigger.focus();
    await page.evaluate(() => window.scrollTo(0, 50));
    const initialScroll = await page.evaluate(() => window.scrollY);
    // Keyboard activation avoids Playwright's pointer-click auto-scrolling before
    // the application's click handler. Check the user's actual keyboard position.
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Explore RivyaLivingArt" });
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    expect(await page.evaluate(() => window.scrollY)).toBe(initialScroll);
    await page.keyboard.press("Enter");
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    expect(await page.evaluate(() => window.scrollY)).toBe(initialScroll);
  });

  test("a mobile route selection navigates and releases the dialog", async ({ page }) => {
    const { dialog } = await openMenu(page);
    await dialog.getByRole("link", { name: /Collectible design/ }).click();
    await expect(page).toHaveURL(/\/collectible-design$/);
    await expect(page.getByRole("heading", { level: 1, name: "Art for the space." })).toBeVisible();
    await expect(dialog).not.toBeVisible();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });

  test("same-page anchor navigation keeps the destination instead of returning focus to the header", async ({ page }) => {
    const { dialog, trigger } = await openMenu(page);
    await dialog.getByRole("link", { name: /The atelier/ }).click();
    await expect(page).toHaveURL(/\/#atelier$/);
    await expect(dialog).not.toBeVisible();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    await expect(page.locator("#atelier")).toBeInViewport();
    await expect(trigger).not.toBeFocused();
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  });

  test("resizing to desktop closes the mobile dialog and releases background navigation", async ({ page }) => {
    const { dialog } = await openMenu(page);
    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(dialog).not.toBeVisible();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    const desktopNavigation = page.getByRole("navigation", { name: "Main navigation" });
    await expect(desktopNavigation).toBeVisible();
    await desktopNavigation.getByRole("link", { name: "Memory art", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Art for the memory." })).toBeVisible();
  });
});

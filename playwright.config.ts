import { defineConfig } from "@playwright/test";

if (process.env.VERCEL_ENV !== undefined) {
  throw new Error("These browser tests start a local preview only; run them outside a Vercel deployment.");
}

// A separate local production process exercises the real built application.
// Run `npm run build` first; an existing server is never silently reused.
const port = 4173;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  outputDir: "test-results",
  use: {
    baseURL,
    browserName: "chromium",
    launchOptions: process.env.RIVYA_BROWSER_EXECUTABLE
      ? { executablePath: process.env.RIVYA_BROWSER_EXECUTABLE }
      : {},
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop-1440", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "tablet-768", use: { viewport: { width: 768, height: 1024 } } },
    { name: "mobile-390", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "narrow-320", use: { viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: `npm start -- --hostname 127.0.0.1 --port ${port}`,
    url: `${baseURL}/robots.txt`,
    reuseExistingServer: false,
    timeout: 30_000,
    env: {
      NODE_ENV: "production",
      NEXT_TELEMETRY_DISABLED: "1",
      RIVYA_VISUAL_PREVIEW: "1",
      VERCEL_ENV: "",
      VERCEL: "",
      RIVYA_DATA_MODE: "isolated",
      RIVYA_ENV: "preview",
      DATABASE_URL: "",
      DATABASE_URL_UNPOOLED: "",
      BLOB_READ_WRITE_TOKEN: "",
      STUDIO_ADMIN_ID: "",
      STUDIO_ADMIN_PASSWORD: "",
      STUDIO_SESSION_SECRET: "",
      RIVYA_ORDER_INTAKE_ENABLED: "false",
      RIVYA_ORDER_MESSAGE_RETRY_ENABLED: "false",
      SITE_INDEXABLE: "false",
    },
  },
});

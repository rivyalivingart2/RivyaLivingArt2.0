import { defineConfig } from "@playwright/test";
import {existsSync} from 'node:fs';
import {reportRoot} from './e2e/report-paths';

if (process.env.VERCEL_ENV !== undefined) {
  throw new Error("These browser tests start a local preview only; run them outside a Vercel deployment.");
}

const listing=process.argv.includes('--list');
if(!listing&&process.env.RIVYA_E2E_ISOLATED_QA!=='1')throw new Error('Set RIVYA_E2E_ISOLATED_QA=1 to run against the guarded local QA database. See tools/master-audit/E2E-README.md.');
if(!listing&&(!process.versions.node.startsWith('22.')||Number(process.versions.node.split('.')[1])<16))throw new Error('Browser tests require the project Node 22 runtime (22.16 or newer).');
if(!listing&&(!existsSync('test-results/old-design-migration/.env.qa')||!process.env.RIVYA_MIGRATION_PG_MODULE||!existsSync(process.env.RIVYA_MIGRATION_PG_MODULE)))throw new Error('Existing isolated QA configuration and RIVYA_MIGRATION_PG_MODULE are required. No fixture or database is created by this suite.');

// Own a separate process; the existing owner preview at 4199 is never reused.
// run-local validates the actual fixed loopback database identity before startup.
const port = 4173;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 2,
  reporter: [["list"], ["html", { open: "never",outputFolder:`${reportRoot}/e2e-final-report` }],['json',{outputFile:`${reportRoot}/e2e-final-results.json`}]],
  outputDir: `${reportRoot}/e2e-final`,
  globalSetup:'./tools/master-audit/e2e-setup.ts',
  timeout:60_000,
  expect:{timeout:10_000},
  use: {
    baseURL,
    browserName: "chromium",
    contextOptions:{reducedMotion:'reduce'},
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
    command: `"${process.execPath}" tools/old-design-migration/run-local.mjs node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port ${port}`,
    url: `${baseURL}/robots.txt`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});

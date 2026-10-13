import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  // Preserved experiments and generated verification bundles are not source inputs.
  globalIgnores(["experiments/**", "output/**", ".next/**", "out/**", "next-env.d.ts", "*.tsbuildinfo", "playwright-report/**", "test-results/**"]),
]);

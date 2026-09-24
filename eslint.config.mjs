import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  // Preserved design experiments are not application/build inputs.
  globalIgnores(["experiments/**", ".next/**", "out/**", "next-env.d.ts", "*.tsbuildinfo", "playwright-report/**", "test-results/**"]),
]);

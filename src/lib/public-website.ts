import { isVisualPreviewAllowed } from "./preview-mode";

/** Owner-authorized public release; Studio authentication is a separate boundary. */
export function isProductionWebsite(env: Readonly<Record<string, string | undefined>>): boolean {
  // The host environment takes precedence over a copied application variable.
  return env.VERCEL_ENV ? env.VERCEL_ENV === "production" : env.RIVYA_ENV === "production";
}
export function isPublicWebsiteAvailable(env: Readonly<Record<string, string | undefined>>): boolean {
  return isProductionWebsite(env) || isVisualPreviewAllowed(env);
}

import { isVisualPreviewAllowed } from "./preview-mode";
import { deploymentContext } from "./hosting-environment";

/** Owner-authorized public release; Studio authentication is a separate boundary. */
export function isProductionWebsite(env: Readonly<Record<string, string | undefined>>): boolean {
  // The host environment takes precedence over a copied application variable.
  return deploymentContext(env) === "production";
}
export function isPublicWebsiteAvailable(env: Readonly<Record<string, string | undefined>>): boolean {
  const publishedPreview = deploymentContext(env) === "preview" && env.RIVYA_PUBLISHED_PREVIEW === "1";
  return isProductionWebsite(env) || publishedPreview || isVisualPreviewAllowed(env);
}

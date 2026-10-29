import {deploymentContext, hostingPlatform} from './hosting-environment';

/** A deployment flag is not authentication. Online preview also requires protection.
 * This pure policy has no client query-string, cookie or localStorage override.
 */
export function isVisualPreviewAllowed(env: Readonly<Record<string, string | undefined>>): boolean {
  if (env.RIVYA_DATA_MODE === "shared") return false;
  const context = deploymentContext(env);
  if (context === "production" || context === "unknown" || env.RIVYA_ENV === "production") return false;
  if (env.NODE_ENV === "development" && hostingPlatform(env) === "local") return true;
  return env.RIVYA_VISUAL_PREVIEW === "1" &&
    (context === "local" || context === "preview" || context === "development");
}

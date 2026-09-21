/** A deployment flag is not authentication. Online preview also requires protection.
 * This pure policy has no client query-string, cookie or localStorage override.
 */
export function isVisualPreviewAllowed(env: Readonly<Record<string, string | undefined>>): boolean {
  if (env.VERCEL_ENV === "production") return false;
  if (env.NODE_ENV === "development" && !env.VERCEL_ENV) return true;
  return env.RIVYA_VISUAL_PREVIEW === "1" &&
    (!env.VERCEL_ENV || env.VERCEL_ENV === "preview" || env.VERCEL_ENV === "development");
}

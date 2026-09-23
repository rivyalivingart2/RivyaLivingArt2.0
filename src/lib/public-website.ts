import { isVisualPreviewAllowed } from "./preview-mode";

/** Owner-authorized public release; Studio authentication is a separate boundary. */
export function isPublicWebsiteAvailable(env: Readonly<Record<string, string | undefined>>): boolean {
  return env.VERCEL_ENV === "production" || isVisualPreviewAllowed(env);
}

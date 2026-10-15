# Studio access revision 6 - understated account navigation

15 October 2026. Owner rejected the heavy boxed switcher in revision 5. Removed its enclosing border, white fill and solid active button. The navigation now uses open text links, a fine baseline and a restrained gold active underline with a dark edge. Active text is semibold. Desktop text is 16px, narrow-screen text 14-15px, and both choices retain at least 48px target height. The labels remain larger than the original low-visibility revision 4 links. High-contrast ink is retained on the animated glass.

CSS-only refinement. Existing label text, route links, aria-current state, logo, glass animation, account approval and reset behavior are unchanged. No forms submitted or data changed. Local preview: http://127.0.0.1:4199/studio/login. No push or release.

Historical revision 5 is a rejected visual direction, not current owner approval. The optional detector remains unavailable due to the Windows cache_directory_failed launcher error. Captures: test-results/studio-access/revision6/. Automated/local browser results do not imply native-device or production certification.

Verification: full local build including TypeScript passed; diff whitespace check passed. Rendered desktop at 1408px and mobile signup at 320px inspected. Both navigation links work and aria-current follows the destination; links remain 48px tall, mobile text is 14px and there is no horizontal overflow. No authentication submission or backend regression rerun for this CSS-only edit.

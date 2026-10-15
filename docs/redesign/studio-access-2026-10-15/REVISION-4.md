# Studio access revision 4 - animated transparent glass

15 October 2026. Owner requested 30-50% opacity and a frosted glass gradient animation. This is a local presentation refinement of revision 3.

The white gradient uses alpha stops 0.50 / 0.30 / 0.44 / 0.50 with a slow 16-second alternating flow. Only the background animates; panel content opacity stays 1. A fixed 20px blur softens the photograph, while a luminance floor in the backdrop protects readable dark text at the lowest alpha. The background is consequently more translucent but not raw, unfiltered transparency. Main navy/gold branding, original logo, website copy, media and access behavior remain intact.

A Pause motion / Resume motion toggle is available. Hover or keyboard focus pauses the effect during form use. The effect also pauses when the panel leaves the viewport or the document is hidden. Reduced-motion preference uses a static gradient and hides the redundant pause control. Unsupported backdrop-filter browsers retain the solid-white fallback. No dependency was added; listeners and the visibility observer are cleaned up when the shell unmounts.

The only application changes are the shared access shell and its CSS. Authentication, administrator approval, password reset, database records and production settings are unchanged. No forms were submitted or accounts created during this revision. Existing setup requirements remain in SETUP-AND-CONTINUATION.md. Local preview: http://127.0.0.1:4199/studio/login. No push or release.

Verification results and captures are recorded in revision4-verification.json and test-results/studio-access/revision4/. Browser-responsive checks do not certify physical devices, field performance or native assistive technology. The optional design detector remains unavailable because its Windows launcher fails with cache_directory_failed.

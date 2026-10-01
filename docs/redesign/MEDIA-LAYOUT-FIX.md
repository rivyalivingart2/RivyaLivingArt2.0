# Studio media thumbnail layout correction

1 October 2026. Local fix on `codex/fix-studio-media-thumbnails`, based on main `37f164486440e13a14188e3c350b6dbe967ac59c`. The owner's screenshot showed overlapping product thumbnails at `/studio/media`. No push or deployment is authorized by this fix request; the owner's local-first, detailed-PR publication rule remains in force.

The issue was reproduced in the compiled application against the established isolated QA resources. All 131 product-media buttons collapsed to 44px grid rows even though each image was 130px high, causing images and captions to escape their cards. The shared scrollable grid now uses `grid-auto-rows: max-content`, `align-content: start` and `align-self: start`. Both product and editorial lists use this rule; the existing image framing, responsive columns and scroll-height limit are retained.

Verification on the rebuilt application:

- Production build and TypeScript compilation passed.
- Both libraries (131 product and 5 editorial records in isolated QA) checked at widths 1903, 1440, 1024, 768, 390 and 320 pixels. No card content escaped its bounds, and neither the page nor either library overflowed horizontally.
- Exact-file search retained a naturally sized single card. Keyboard Enter opened the existing metadata editor. Empty search, clearing search and scrolling to/selecting the final product image worked. Editorial selection opened its existing editor.
- All captured Studio read requests returned HTTP 200; no browser console or page errors were captured. Desktop and mobile screenshots were visually inspected.
- `git diff --check` passed. The only application change is shared Studio CSS. No media record, file, product association, contact detail, scraper, permission or publishing workflow was changed.

Detailed local measurements and screenshots are saved in the chat workspace under `outputs/Media-Layout-Fix/`; the temporary browser verification helper is under `work/check-media-layout.mjs`. Browser checks made no save, publish or upload requests. The local QA server was stopped afterwards. These checks establish this layout correction, not full-site performance or accessibility acceptance.

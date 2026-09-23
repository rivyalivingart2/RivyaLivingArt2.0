# Supplied image integration — 23 September 2026

The owner supplied the generated-assets Drive folder and explicitly requested image implementation, publication to rivyalivingart2/RivyaLivingArt2.0, and visibility on Vercel. This authorizes this asset payload and a protected frontend preview; it does not require exposing demo fixtures in production or changing the audience of the existing Site.

## Implemented

- Imported 113 named WebP portraits using their exact DP001–DP120 identifiers; retained the seven approved primary portraits and their display names.
- All 120 product primary slots now have images: 84 furniture/spatial, 24 memory and 12 personal/gift concepts.
- Imported seven matching detail images and connected them to catalogue galleries and the Studio picker (127 selectable product images).
- Shared zoom/thumbnail galleries now display matching views for furniture, memory and gift products.
- Added supplied browser/app icons and the supplied stacked logo in the footer on its specified light background. Kept the approved dark header wordmark and hero unchanged. Other supplied logo formats are available under public/brand.
- Preserved exact downloaded image bytes without recolouring or regenerating them. The duplicate river-channel-edge-detail file is retained as a supplied asset; DP001 uses the equivalent ID-named detail.
- Original large PNG masters remain in Drive; only web derivatives and brand outputs are checked in. No continuous Drive synchronization is added.

See supplied-asset-manifest.json for filenames, source IDs, exact byte sizes, dimensions and SHA-256 hashes. Supplied media remain labelled as AI concepts, not completed commissions. The webmanifest name alone is normalized to the exact brand; image bytes are unchanged.

## Boundaries and validation

Root TypeScript compilation completed successfully as implementation feedback. Import compared every downloaded byte size with Drive metadata and decoded image dimensions. Formal QA remains deferred under the owner's development-first policy. A deployment build is necessary for this expressly requested publication, not a claim of final QA.

Counts remain 120 products, 36 article drafts, 42 FAQs, 24 fictional testimonials and 40 fictional enquiries. Saves, revision history and publication demos remain browser-local. Database, staff authentication, real storage and WhatsApp handoff remain pending R8 integration. The Vercel production fixture guard is preserved.

GitHub work continues on codex/sites-approved-design, fast-forwarded to verified main 11961830f7dd432fffcf318764a5a8e195a08a1a (PR #13 was already merged). This update is published separately without merging main. Vercel's existing Git integration creates the updated Preview; publication IDs and verified URLs are recorded after deployment.

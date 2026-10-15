# Revision 3 visual finish review

Date: 2026-10-15. Disposition: **PASS for the requested local visual refinement.** No material visual blocker found in the supplied evidence.

## Evidence and scope

Independently inspected `test-results/studio-access/revision3/desktop.png`, `mobile.png`, `mobile-bottom.png`, `request-desktop.png`, and `request-mobile.png`, plus the supplied prior screenshot. Read `src/components/studio/access-shell.tsx`, `src/components/studio/studio-access.module.css`, `src/components/studio-login.tsx`, and Impeccable's `reference/craft-floor.md`. This was a narrow screenshot/source review; no browser operation, authentication submission, or backend validation was performed by this reviewer.

## Fidelity

- The original full-image split composition remains recognizable. The photographic making scene continues across the desktop layout, with the introduction on the left and access form on the right. Mobile stacks these naturally.
- The original horizontal Rivya logo is now inside both access panels. Its proportions and transparent presentation are intact, with breathing room before account navigation.
- The panel reads as white frosted glass, with softened photographic tones visible through it. Source provides 82% white with 24px backdrop blur and a solid-white fallback.
- Display typography now uses the site's `var(--font-display)` rather than the previous heavy sans-serif treatment. “Art for the way you live” and “Furniture with presence. Objects with meaning.” match the supplied main-site wording. The atelier headings extend that voice while the form controls retain explicit actions.

## Craft and material findings

- Desktop hierarchy is clear: brand, account navigation, display heading, explanation, fields, primary action, secondary action, access condition. Mobile heading wraps are balanced and readable; no clipping is visible in the reviewed frames.
- The glass treatment is specifically requested and supports the photographic composition. Existing rounded panel geometry is retained as part of the approved reference direction. It should not be replaced merely to satisfy a generic radius preference.
- Navy text, restrained gold accents, a soft offset shadow, thin input rules, and pill actions form a consistent palette. The blurred surface keeps the photograph from competing with labels and fields.
- The login bottom screenshot shows both actions and the administrator-approval condition intact. It also visibly demonstrates the password button focus ring. Longer mobile and account-request content requires ordinary vertical scrolling; this is appropriate for the preserved introduction and real form content.
- Source includes explicit labels, password visibility semantics, pending/disabled handling, error/status presentation, themed selection and caret, visible focus treatment, and reduced-motion handling. Screenshots do not independently prove every interactive state.
- Parent-reported verification: build and focused lint passed; DOM inspection found loaded images, no horizontal overflow at 390/1408 widths, working password visibility and keyboard focus, and the expected white alpha/blur. Reported conservative contrast on #d1d1d1 is 5.25:1 for secondary text and 3.80:1 for field boundaries. These are supplied verification results, not independently rerun measurements.

## Limits and disposition

No additional visual changes are required for this narrow request. The automated design detector did not complete because its Windows launcher reported `cache_directory_failed`; no detector pass is claimed. The evidence supports local screenshot/source acceptance only. Production deployment, native-device behavior, screen-reader acceptance, successful authentication, and live account approval remain outside this review.

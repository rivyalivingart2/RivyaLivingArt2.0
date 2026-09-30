# Navigation + localization completion

Updated: 2026-09-30

## Status
COMPLETE / RELEASED

The owner explicitly authorized completing the remaining deferred navigation editor, localization workflow and final audit-note work.

## Navigation editor (D2)
Completed.

- Studio route: `/studio/navigation`
- Admin-only navigation and language settings editor.
- Manages collection, header and footer menus.
- Supports add/remove, reorder, show/hide, safe destination validation and new-tab behavior.
- Supports per-language navigation labels.
- Uses optimistic versioning and Studio audit logging.
- Public desktop, mobile, no-JS and footer navigation read the same published settings.
- No new navigation table or database migration was introduced.

Persistence uses the existing singleton `rivya_business_settings.details` JSONB document under `details.site`.
Contact-detail saves were changed to merge their four fields without overwriting nested site settings.

## Localization
Completed as an owner-managed publication workflow.

Supported locale contract:
- English (en)
- Hindi (hi)
- Gujarati (gu)
- Arabic (ar, RTL)
- Spanish (es)
- German (de)
- French (fr)
- Simplified Chinese (zh)
- Japanese (ja)

Implemented:
- public language preference stored in a one-year SameSite=Lax `NEXT_LOCALE` cookie;
- enabled-language enforcement;
- `<html lang>` and RTL/LTR `dir` switching;
- translated core navigation/chrome strings;
- per-language navigation labels;
- page and journal translation overrides in the existing content JSON revision model;
- product translation overrides in the existing catalogue JSON revision model;
- English per-field fallback when a translated value is blank;
- Studio translation editors for content and catalogue records.

Safe production default:
- localization is disabled initially;
- enabled locale list defaults to English only;
- the public language selector is hidden until an administrator deliberately enables reviewed languages.
This prevents partially translated content from being presented as complete localization.

## Validation
Feature branch: `feature/navigation-localization`
Final tested feature source: `f7a5330c688bdbf81fdbd9b45ac39c99df7911b2`
Preview deployment: `dpl_CHQmh7AdLfueDMZ92YTus9naLAFY` — READY.

Validation results:
- TypeScript / Next type generation: PASS.
- ESLint: PASS.
- Repository tests: 188/190 pass.
- The two failures are pre-existing timezone-format expectation failures (tests 175 and 190) and reproduce identically on production `main`; they are not navigation/localization regressions.
- Browser verification confirmed Hindi preference persistence and Arabic RTL behavior on the enabled-language preview.
- An RTL horizontal-overflow defect caused by the old off-screen skip-link technique was found, fixed and revalidated.
- Final safe-default Preview at 320×740: HTTP 200, English/LTR, zero horizontal overflow, no language selector exposed, and disabled-language POST correctly rejected.

## Production release
Previous production base: `770c66818688077014a828859f08f78c21f2a5be`
Production release commit: `be00d6fc8be17bfcbf49cbe9a8db1343b4801d81`
Production deployment: `dpl_2Cd6U94pnzCGkzH3f57H6bKbvtsf` — READY.

Production aliases:
- `www.rivyalivingart.com`
- `rivyalivingart.com`

Post-release smoke:
- homepage: HTTP 200 on the new deployment;
- `/collectible-design`: HTTP 200 on the new deployment;
- `/studio`: HTTP 200 on the new deployment;
- default document locale: English;
- public language selector hidden until reviewed languages are enabled;
- Vercel runtime errors in verification window: none.

## Data and release safety
- No database migration was required.
- No product records were created, imported, duplicated or deleted during this work.
- No real order/inquiry was submitted.
- No WhatsApp or email was sent.
- Existing contact settings remain backward compatible.

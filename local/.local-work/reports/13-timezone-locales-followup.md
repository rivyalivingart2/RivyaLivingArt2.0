# Timezone + locale follow-up

Updated: 2026-09-30

## Status
COMPLETE / RELEASED

## Timezone formatter
The two previously failing repository tests were caused by runtime-dependent `Intl.DateTimeFormat('en-IN', {dateStyle:'medium'})` output. On the current Node/ICU runtime this rendered `25-Sept-2026`, while the repository contract expects a stable human-readable IST format.

The formatter now renders the date portion explicitly and keeps only the time-of-day formatting delegated to Intl:
- example: `25 Sept 2026, 12:00 am IST`
- timezone remains `Asia/Kolkata`
- business-date rollover behavior is unchanged.

Validation:
- TypeScript / Next type generation: PASS
- ESLint: PASS
- repository tests: **190/190 PASS**

## Public languages
All supported locales are now enabled by default:
- en
- hi
- gu
- ar
- es
- de
- fr
- zh
- ja

The existing English per-field fallback remains in place for untranslated product/page/navigation fields.
Arabic retains RTL document direction and was browser-verified with zero horizontal overflow.
Hindi and Arabic locale persistence were browser-verified through the existing one-year `NEXT_LOCALE` cookie.

## Tested feature release
Feature branch: `fix/timezone-enable-locales`
Tested source head: `2751c663aa27672a9d5ac41c880220af4d40414e`
Preview deployment: `dpl_4X4ndyQZ5AW77G9Cw3uQTpBfRZvp` — READY.

## Production release
Production commit: `1827a5a94979b58ffd25f41978b752143040c078`
Production deployment: `dpl_HZeU7ruiWhEc8jss6UquSN8bp83K` — READY.

Live verification:
- `www.rivyalivingart.com`: HTTP 200
- deployment id in live HTML: `dpl_HZeU7ruiWhEc8jss6UquSN8bp83K`
- all nine language options present
- default document language remains English
- Vercel runtime errors in verification window: none

No database migration or production data mutation was required.

# Owner-authorized production release — 23 September 2026

The owner confirmed successful private Studio login and instructed: “yes i am abel to login it now push full thing on main branch of git and also vercel production”. This explicitly authorizes merging the supplied-image/private-Studio work to main and deploying the approved website to the existing Vercel production project and owner-configured domain. Free services only.

This supersedes the earlier no-main/no-production/holding-page restrictions for this release. Public pages now use a dedicated public-release policy in production. The development-only system-state routes retain their production denial. Studio and order APIs retain server-side authentication; no public Studio link is added. Existing sample/concept disclosures and noindex remain; production deployment does not turn fictional reviews into customer testimonials or local catalogue editing into a backend CMS.

The owner already configured three Secret admin variables for Production. A separate Neon Free database is provisioned for Production only; Preview retains its existing isolated database. Apply the existing empty Studio schema, without copying preview sessions or orders. No upgrade, payment, email delivery, public enquiry submission or full CMS implementation is included.

Compilation may resolve implementation wiring. The required Vercel deployment build and visibility checks establish deployment status only. Formal QA remains deferred under the owner's development-first instruction; successful owner login on Preview is separately reported evidence.

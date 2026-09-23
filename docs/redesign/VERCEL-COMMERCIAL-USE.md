# RivyaLivingArt — Vercel commercial-use review

Reviewed 23 September 2026 against Vercel's current official documentation.

## What the restriction actually covers

The recorded project plan is Vercel Hobby. Hobby permits personal, non-commercial use. Vercel defines commercial use by a deployment's financial purpose and explicitly includes advertising products or services. A payment gateway is not required. [Hobby plan](https://vercel.com/docs/plans/hobby) · [Commercial-use policy](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage)

The features below are our application of that policy to this repository, not a separate list of features prohibited by Vercel.

| RivyaLivingArt feature or use | Why it matters |
|---|---|
| Product collections, product pages, customization and commission invitations | Promote products and services for sale. |
| Saved inquiries, quote requests and WhatsApp sales handoff | Generate and advance sales leads, including offline sales. |
| Studio inquiry pipeline, assignments, follow-ups and customer reference images | Support business sales operations; making them private does not establish an exemption. |
| Atelier, architects, contact, portfolio and journal pages used to market the business | Can serve the same commercial purpose even as static pages. |
| Future checkout, payment links, advertising or affiliate monetization | Would add commercial uses; these are not part of the approved implementation. |

Removing checkout, prices, customer accounts, WhatsApp, or database writes alone would not make a business-marketing website personal/non-commercial. Nor should a protected Preview be assumed exempt: the policy refers to deployments generally. Obtain Vercel's written clarification for any uncertain development-only arrangement. [Official fair-use guidance](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage)

## What is not inherently the problem

Next.js, React, navigation, galleries, animation, accessibility, forms, authentication and databases are technical capabilities. Their business use on the hosting plan is the issue. A free resource allowance is not commercial-use permission.

Keeping source code in GitHub and working locally does not deploy that code to Vercel. We can preserve the approved design and business workflow in source while hosted activation remains on hold.

## Changes made following your instruction

- Vercel is the only selected hosting target. Netlify hosting configuration, storage integration, dependency and platform-only proxy were removed.
- Private reference storage now uses Vercel Blob only and rejects unsupported providers.
- The existing applied database migration is retained as history; its unused alternate-provider value does not activate another host. No database or customer data was deleted.
- Automatic Git deployment is disabled in this branch's `vercel.json`. The GitHub source push is separate from a release. This setting does not disable manual deployments or change configuration on other branches. [Vercel Git deployment configuration](https://vercel.com/docs/project-configuration/git-configuration#git.deploymentenabled)
- No new hosting account, paid upgrade, trial, production migration or deployment was requested or performed in this update.

## Current hold and next decision

Do not activate the business catalogue/inquiry/Studio workflow on Hobby while this eligibility issue remains unresolved. Do not treat a static marketing rewrite or an off-site WhatsApp sale as a workaround.

The previous live deployment was not taken offline or altered by this source update. Its existing commercial use still needs resolution; this report does not certify that deployment as compliant.

Your free-only and Vercel-only requirements remain in force. A commercial release therefore stays on hold unless Vercel confirms an applicable no-cost permission or you later change one of those requirements. No exception has been obtained. Final integrated QA is also still outstanding.

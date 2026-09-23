# RivyaLivingArt — Commercial Implementation Plan

**Revision:** 3.5 — Phase 5 customization source complete; approved scope retained
**Prepared:** 23 September 2026  
**Status:** Phase 5 source complete — forms and recovery; next task P6.1
**Scope:** Every public page, product/customization instance, private Studio screen and shared state.  
**Hosting direction:** Vercel only; free services only; commercial deployment eligibility unresolved. No Netlify.  
**Execution boundary:** The owner authorized Phase 5 and GitHub publication. All 120 product schemas, Studio validation, selected-product/bespoke forms and recovery boundaries are implemented in source. Bespoke saving remains explicitly unavailable until Phase 6 v2 persistence. No database operation, publication or deployment. Formal QA remains Phase 11; release remains Phase 12.

**Canonical plan after publication:** `docs/redesign/RivyaLivingArt-Commercial-Implementation-Plan.md` in the existing repository. The outputs file is a synchronized delivery copy of the same revision, not a competing plan. Read `docs/decisions/2026-09-23-revised-phase-1-approved.md` for the approval record. No repeat plan approval is needed.

## A. Understanding, authority and preserved work

WhatsApp has one application purpose: **transport the prepared details of a saved product/custom order to RivyaLivingArt's WhatsApp number**. The customer selects or describes a piece, supplies customization and personal details, adds optional notes/references, reviews the brief and selects **Place Order**. The server validates and saves the complete order/inquiry, makes it available in Studio, generates and saves the order message from the saved record, then offers the WhatsApp handoff. The customer must manually press Send in WhatsApp.

The database and Studio remain the operational record. Kanban manages the order lifecycle independently of WhatsApp. The platform neither sends messages automatically nor observes whether a message was sent, read, replied to, quoted, paid or fulfilled. A human can discuss the submitted order outside the website; this plan does not build software for that conversation.

There is **no payment gateway, customer account, shopping-cart checkout, generic WhatsApp contact/chat/support system, chatbot, marketing, broadcast, newsletter, notification, automated follow-up, WhatsApp login, account connection, CRM synchronization or sharing integration**. Studio follow-up dates and internal notes are retained as internal order-management tools.

“Place Order” means submitting an order request. Supporting text must explain that the design, feasibility and quotation still require staff confirmation; a saved request is not an accepted quotation, payment or production booking. This is a commerce business with a non-transactional website, not a claim that the business itself is non-commercial.

### A1. Source priority and the missing filename resolved

1. Latest owner instructions, including this correction and the new Phase 1 approval boundary.
2. The owner's pasted **MASTER PROMPT — WhatsApp Scope Correction** workflow. The owner explicitly answered **“Use the pasted workflow as the reference”** when the separate `WHATSAPP_ORDER_GUIDE.md` could not be found. Its absence is therefore not a blocker and no invented guide is being cited.
3. This approved revised plan.
4. Current database and genuine operational records, which must be preserved.
5. Current repository architecture and verified behavior.
6. The two original plans and previous master, as historical evidence.
7. Legacy demo assumptions, which have no authority over the corrected workflow.

This document is now the sole implementation plan. The original plans and revision 2.5 master remain unchanged historical sources. `Current-State-Reconciliation.md` and `IMPLEMENTATION_PROGRESS.md` accompany this plan as evidence and progress records, not alternative plans.

### A2. Documents consolidated

| Input | Retained contribution | Correction in this revision |
|---|---|---|
| `RivyaLivingArt-Experience-Implementation-Plan.md` | Editorial design, reference principles, navy/forest palette, page structure, motion, content and media strategy | Narrow all WhatsApp wording to saved-order transport; carry source work forward rather than repeat it |
| `RivyaLivingArt-Design-and-WhatsApp-Order-Plan.md` | Original code findings, saved inquiry contract, Studio roles, private uploads and release requirements | Historical demo findings are not presented as current defects; general staff WhatsApp action becomes saved-order Open/Copy only |
| `RivyaLivingArt-Master-Full-Website-Redesign-Plan.md`, revision 2.5, including pasted copy | 48-row scope register, prior decisions, completed source work and migration receipts | Superseded after new approval; phases renumbered 0–12; commercial eligibility separated from WhatsApp scope |
| Latest pasted correction and owner's follow-up | Sole intended WhatsApp behavior; custom and selected-product requests; planning-only boundary | Overrides previous implementation authorization for this revision |
| Repository notes and source at `7c7b38a48f721b54cc32c628454d9d571583af5e` | Current implementation, preserved drafts, schema and publication evidence | Every claim is identified as source evidence, recorded infrastructure evidence or current read-only observation |

### A3. Current baseline — continue, do not restart

Repository: `C:/Users/gonda/Documents/Codex/2026-09-23/rivyalivingart-website-studio-preview-sites-project/work/repo`.

- Work branch: `codex/whatsapp-order-experience`; clean local HEAD `7c7b38a48f721b54cc32c628454d9d571583af5e`. Prior GitHub readback verified the same commit. Redesign source is `0ae2c9f`; Vercel-only correction is `583b0b6`.
- The current authenticated Vercel deployment listing still identifies production `dpl_7HRC8CVEJ98ih86yRxoppxVgMgR2`, READY, main commit `f9533bbbaf3cc2843025f1a1243442b0a9d920e8`. The redesign branch is not a deployed candidate. READY describes deployment state, not correctness.
- The original drafts were preserved before implementation. Reuse the existing tokens, compact header, catalogue, versioned form models, saved receipt, inquiry transaction, private references, Studio and authoring components.
- Source inventory contains **120 product identities**, **36 article candidates**, **11 page/policy records**, **131 public-media records**, and **48 public/Studio coverage rows**. The prepared insert-only publication has not run. There are also historical **8 fictional projects, 24 fictional testimonials and 40 operational fixtures**, which remain unpublished.
- Recorded Preview receipts report **16 public tables**, a private pre-migration schema snapshot and zero orders/catalogue/content/revisions at the last count. These are prior receipts read during this audit, not a fresh database inspection. Production schema/data were not inspected in this turn. Never assume a migration is absent or reapply it blindly.
- Preview database/Blob values were masked locally. Connectivity and end-to-end behavior remain unproved. Previous TypeScript wiring checks are not formal QA; no current coverage row is TESTED.
- Vercel-only configuration is already committed. Netlify integration was removed. `vercel.json` disables automatic Git deployment for commits carrying that file; it does not disable manual deployments or alter other branches' configuration.

### A4. Audit limits

This is a read-only source/document and production-readiness audit. No customer submission, security attack, migration, authenticated order operation, formal test suite, build or performance measurement was run. Public-domain and production-URL retrieval failed in the text-fetch tool; the bounded browser fallback also encountered an unavailable in-app session and a Chrome extension control conflict. No fresh Rivya homepage rendering was obtained. These are observation limitations, not evidence the site is down. Reference-site observations are qualified in the benchmark section. Live rendered behavior, database permissions and every instance must still be verified in the approved implementation phases.

## B. WhatsApp cleanup audit

**Important correction:** source searches found actual `wa.me` URL construction only in `src/lib/whatsapp.ts`, used by the saved-order receipt. They did not find an implemented general WhatsApp chat, bot or marketing system. Cleanup must remove confirmed scope drift, not pretend absent features were implemented or delete useful order code.

| Existing/planned WhatsApp feature | Keep / Remove / Rewrite | Reason | New behavior |
|---|---|---|---|
| Product order handoff after database and Studio save | KEEP | Core requested behavior already has a source implementation | Handoff only for a saved, authorized order with a finalized saved message |
| Saved receipt Open / reopen / copy | KEEP; refine labels | Recovery belongs to the same order | **Open WhatsApp**, **Open WhatsApp Again**, **Copy Order Message**; never claim Sent |
| Summary prepared before the save transaction | REWRITE | Currently saved atomically, but latest reference requires generation from saved canonical data | Read saved immutable snapshot, render and persist versioned message, then enable handoff |
| Generic “conversation”, quotation/payment/delivery wording throughout site | REWRITE | Copy suggests a broader software role than exists | Explain order-message transport; describe staff-managed decisions separately |
| Studio “phone/WhatsApp contact action” in old plan | REWRITE | Could imply free-form or general messaging | Authorized **Open Order in WhatsApp** and **Copy Order Message** for an existing saved record only |
| Current Studio saved-summary display | KEEP + ADD order-only controls | Summary exists; Open/Copy controls do not yet exist | Reuse persisted message, not reconstructed or edited form data |
| Kanban, assigned staff, due dates, internal notes | KEEP | These are internal operations, not WhatsApp automation | No outbound messages or WhatsApp-derived status changes |
| Order-message destination setting | KEEP; rename scope | Server-owned business destination is necessary | Label **WhatsApp order destination**; admin-only, validated, audited |
| Contact page phone/email/map and order-entry CTA | KEEP | Current active page has no generic WhatsApp chat link | Ordinary contact stays phone/email; new-order CTA opens the order flow |
| General contact form redirect to WhatsApp | REMOVE from permitted scope; NOT FOUND in active code | Ordinary inquiries are not order handoffs | If a contact form is retained/approved, persist it separately without WhatsApp |
| Floating chat, support widget, chatbot, broadcasts, newsletters, marketing, notifications, authentication, account integration and sharing | EXCLUDE; NOT FOUND as active integrations | Explicitly prohibited by owner | Do not add endpoints, credentials, UI or tracking for these functions |
| Old simulated handoff/recovery and state-gallery behavior | REMOVE from reachable production after dependency audit | Demo success must never appear to be a saved order | Preserve historical source first; keep only useful gated development fixtures |
| Analytics around WhatsApp engagement | REWRITE to minimal order-funnel events | An open/copy action is observable; delivery is not | Optional open/reopen/copy counts without message contents or customer identity |

Source evidence: `src/app/actions/inquiry.ts:45–76`; `src/components/shop/order-form.tsx:58–73`; `src/components/shop/saved-receipt.tsx:6–16`; `src/lib/whatsapp.ts:4–7`; `src/components/studio/inquiry-board.tsx:27`; `src/lib/shop-editorial.ts`; `src/components/shop/shop-frame.tsx`; `src/components/inquiry-recovery.tsx:53–103`. These paths describe the audited commit, not a later release.

### B1. Conflicts and safe correction

| Current behavior → risk | Recommended change | Migration impact | Approval required? |
|---|---|---|---|
| Summary built from validated inputs before transaction → does not literally follow the new saved-record sequence | Add recoverable message-finalization step based solely on saved snapshot | Add message state/version/destination metadata; preserve every historical summary | Revised plan approval; routine design then proceeds without another approval |
| Answers stored under display labels → no direct stable field-ID/type representation for future interoperability | Store stable field ID plus immutable label, typed value and schema version; existing validator already rejects duplicate labels and product snapshots preserve historical labels | Additive snapshot format; retain old answer JSON and mark legacy format; no guessed relabeling or claim of demonstrated answer loss | Revised plan approval |
| Consent is checked but exact disclosure/time not recorded → acceptance evidence missing | Persist minimal consent version and accepted timestamp with disclosure reference | Existing rows stay legacy/unknown; never invent historic consent | New retention/policy facts require business confirmation only where missing |
| `/commission` only offers catalogue choices → bespoke custom-product request unavailable | Add explicit custom-request branch using a versioned custom brief schema | Add request kind and conditional product association without fake product IDs | Custom work requested by owner; schema design included in approval |
| Reference files are private; message contains count only → owner might expect automatic file attachment | Retain private Studio references and clearly state the count in text | No public image links or automatic attachments added | Existing approved architecture retained; any future public sharing needs separate decision |
| Saved receipt uses a bounded same-browser capability → cross-device or delayed recovery unavailable | Keep 24-hour same-browser recovery with clear expiry; staff lookup by reference | No customer account, long-lived token or PII local-storage workaround | Longer recovery is optional, not a launch dependency |
| Broad order-conversation copy → implies extra integration | Rewrite visible copy, metadata, FAQ, terms, journal and Studio labels consistently | Content revisions only; old drafts retained | Covered by this scope correction |
| Old lifecycle already has the eight requested stages → renaming could damage history | Preserve codes, labels and historical events | No stage migration needed by this plan | Only a later explicit lifecycle change would need mapping |

## C. Commercial readiness: what still needs to change

### C1. Hosting eligibility is separate from WhatsApp scope

The project's recorded tier is Vercel Hobby. Vercel reserves Hobby for personal non-commercial use and explicitly includes product/service advertising in its commercial-use definition. Narrowing WhatsApp to order details is the correct product decision, but it does not remove the business purpose of the catalogue and orders. Checkout removal, a static site or off-site sales do not by themselves resolve this. A protected Preview is not assumed exempt. [Vercel Hobby](https://vercel.com/docs/plans/hobby) · [Vercel commercial-use guidance](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage)

**Decision:** retain Vercel-only and free-only constraints. No paid upgrade, trial, Netlify or alternate host. Keep commercial deployment on hold unless Vercel confirms applicable permission at no cost or the owner later changes a constraint. No exception has been obtained. No arbitrary feature removal is presented as a compliance workaround. Existing production has not been taken offline or certified compliant by this audit.

### C2. Gap register

Severity describes release impact and investigation priority. “Not verified” is not a demonstrated vulnerability. No Critical exploit was established in this source audit.

| ID | Area | Current state | Problem | Severity | Required change | Phase |
|---|---|---|---|---|---|---|
| C01 | Hosting | Vercel-only, recorded Hobby; deployment hold committed | Commercial eligibility unresolved | Critical release blocker | Obtain applicable permission or explicit constraint change; keep hold until resolved | 2, 10, 12 |
| C02 | Integrated flow | Substantial source exists; local connection masked; candidate not seeded | No proof that the exact app saves and retrieves one complete order | High | Isolated allowed integration; reconcile real schema and verify database → Studio → receipt | 2, 6, 11 |
| C03 | Message finalization | Summary saved but constructed before transaction | Saved-record sequence, renderer version and recovery state incomplete | High | Idempotent post-save finalization from immutable canonical snapshot | 2, 6 |
| C04 | Historical form integrity | Full product snapshot; label-keyed answers | Stable field IDs and value types not retained directly in answers | High | Versioned answer snapshot; migration compatibility for legacy rows | 2, 5, 6 |
| C05 | Consent/source metadata | Consent checkbox required; source inferred | Missing consent version/time and explicit submission provenance | High | Minimal consent/source/template metadata; unknown historical values stay unknown | 2, 6, 10 |
| C06 | Bespoke orders | Selected-product path only | Custom product without an existing catalogue match has no real path | High for requested scope | Typed custom-request branch with same save/Studio/handoff guarantees | 2, 5, 6 |
| C07 | Duplicate/concurrent submission | UUID, payload hash, unique constraint and retry readback exist | Not verified under timeouts, races and pending message finalization | High verification | One inquiry/reference per logical submission; retry safely at every state | 6, 11 |
| C08 | Authentication/authorization | Named staff, hashed sessions, revocation, SQL assignment scope | Direct API, expired-session and cross-role behavior unproved | High verification | Negative permission checks on every read/mutation/export/reference | 7, 10, 11 |
| C09 | Anti-abuse | Server limits and guest ownership exist; honeypot checked but not rendered | Dead honeypot check and shared login throttle availability risk | Medium | Wire or remove misleading honeypot; review account+IP limits and accessible escalation | 5, 10, 11 |
| C10 | Private uploads | Decode/MIME/size/slot controls and private Blob source exist | Runtime access, interrupted upload and budget reconciliation unproved | High verification | Test ownership, MIME spoofing, retries, expiry and actual private access | 6, 10, 11 |
| C11 | Personal-data lifecycle | Only expired unattached-upload cleanup implemented | Attached inquiries/images have no agreed retention/deletion lifecycle | High | Owner policy plus admin reviewed deletion/anonymization and object reconciliation | 2, 7, 10 |
| C12 | Backup/restore | Snapshot inside same Preview database | Not independent disaster recovery; no restore drill | High | Protected independent backup, retention, restore rehearsal and production rollback plan | 2, 10, 12 |
| C13 | Form recovery | Save failures preserve in-memory input | Reload/revision change can lose a long brief; progress/error accessibility gaps | Medium | Unsaved navigation warning, safe schema refresh and accessible upload status; no plaintext persistent browser PII | 5, 11 |
| C14 | Studio order actions | Saved message visible | Saved-order Open/Copy missing | Medium | Add authorized order-only actions with no sent/confirmed claim | 7 |
| C15 | Kanban completeness | Search/stage/assignee/due/page, drag and Move To source | Product/category/date filters and useful card context missing; bulk behavior undecided | Medium | Add filters, reference/age/assignee/reference-count context; safe scoped bulk actions only where useful | 7, 11 |
| C16 | General contact | Active phone/email/map; no contact-form endpoint | Old copy could suggest general WhatsApp support | Medium | Clear contact/order distinction; any retained form has own persisted flow and no handoff | 8 |
| C17 | Production content | Reviewed candidates coexist with historical fixtures | Publication must not leak dummy records or unsupported facts | High | Classify all instances; whitelist publishable facts/media; quarantine fixtures | 4, 8, 10 |
| C18 | Portfolio/CMS | Empty approved-project set and real-project template; editor is page/article only | Full portfolio authoring absent | Medium; optional content not launch blocker | Truthful empty/unpublished state; add typed durable portfolio authoring before any real case is published | 7, 8 |
| C19 | Policies | Drafts exist and supplied set approved | Exact retention, fulfillment/cancellation particulars and data practice consistency incomplete | High | Confirm only missing facts; revise specific policies; no invented legal promises | 8, 10 |
| C20 | SEO | Canonical/sitemap/robots controls exist; no active JSON-LD found | Final route/metadata/draft/privacy behavior unverified | Medium | Published-only metadata, truthful structured data, redirects and private noindex checks | 8, 10, 11 |
| C21 | Accessibility | Native controls/dialogs and responsive styles source | Keyboard, contrast, announcements, touch and screen-reader evidence missing | High verification | WCAG-oriented manual and automated checks on each interaction family | 3, 9, 11 |
| C22 | Performance | Optimized assets and bundle boundaries planned/source present | No measured LCP/CLS/INP or database performance evidence | Medium | Budgeted media/JS, representative lab checks and postlaunch field monitoring when eligible | 9–11 |
| C23 | Monitoring | Audits in source; no verified operational alert/runbook | Failures may not be noticed or recoverable | High operational | Redacted correlation IDs, available free provider logs, incident and recovery procedures | 10, 12 |
| C24 | Analytics | No active order-funnel events found | Optional visibility absent | Low / recommended | Minimal non-PII website/order events; no delivery tracking | 10 |
| C25 | Reachable demo behavior | Historical fixtures/components retained | Source inventory alone does not prove production isolation | High verification | Route/import audit and final HTTP/browser checks; remove reachable demos safely | 8, 11, 12 |
| C26 | Final release proof | Only TypeScript wiring checks recorded | Source completeness is not production readiness | High | Exact-commit lint/typecheck/tests/build/runtime/browser and rollback evidence | 10–12 |

## D. Revised architecture and data contract

### D1. End-to-end flow

```text
Customer
  → Catalogue product OR explicit custom-product request
  → Versioned, product-appropriate customization
  → Customer details + optional notes/private reference images
  → Review → PLACE ORDER
  → Client validation → server validation, ownership and anti-abuse checks
  → Atomic durable save: order/inquiry + immutable snapshot + references + history
  → Same saved record is available to authorized Studio staff
  → Read canonical saved snapshot → render and persist final order message
  → Saved receipt: Open WhatsApp / Open WhatsApp Again / Copy Order Message
  → WhatsApp opens to RivyaLivingArt → CUSTOMER manually presses Send

Studio → retrieve saved brief → assignment/notes/Kanban/manual decisions
       → saved-order Open/Copy controls only

Private reference files → private Blob → authorized Studio viewer
                       → message contains saved-reference count, not file URLs
```

The staff interface need not be open when a customer submits. “Available in Studio” means the canonical database record is queryable under staff authorization, not that the customer's browser waits for a staff browser to acknowledge it.

### D2. Two durable stages; no false success

1. **Save core order atomically.** Validate a published product/schema or approved bespoke schema, stable request key, guest identity, all visible answers, customer fields and ready private uploads. Commit the same-ID Studio order/inquiry, canonical snapshot, linked references, initial NEW event and audit. Failure commits none of these and never opens WhatsApp.
2. **Finalize its message idempotently.** Read only the saved immutable brief; render text using an explicit template version and server-owned business destination; persist text and finalization state. This is not an asynchronous WhatsApp sender. A transient failure leaves a saved inquiry in `handoff_pending` or `handoff_failed`, separate from its business stage. Retry resumes message finalization on the same inquiry; it must not create another order.
3. **Expose handoff only when ready.** Receipt endpoints return the stored message only under the short-lived guest capability. UI distinguishes “Request saved; preparing your message” from “Could not save”. Stage remains NEW until staff change it. A successful open/copy does not imply Send, receipt or confirmation.

Retain the existing atomic save and idempotency work. The exact adapter/transaction choice is resolved in P2.3/P6.2, with concurrency proof in Phase 11. Never split core order/Studio/reference creation into unrelated writes. Historical messages remain immutable even when a template/product is later revised.

### D3. Durable records and minimum fields

| Record | Required data and rules | Existing base / proposed work |
|---|---|---|
| Catalogue | Stable product ID/slug/title, tier/category, factual description, approved gallery, draft/published schema, revision | `rivya_catalogue`; reuse draft/publish/version controls |
| Custom request definition | Stable schema ID/version and supported custom categories; no invented capabilities | Add typed custom schema/registry; proposed `/commission/customize` |
| Order/inquiry | UUID, human reference, request kind, nullable product association only for explicit custom kind, immutable product/custom schema snapshot, field-ID answers with label/value/unit snapshot, name/phone/optional email, notes, source, server timestamp, consent version/time | Preserve `rivya_studio_orders` and same-ID `rivya_inquiries`; additive schema changes, compatibility for old payloads |
| Message | Saved text, renderer/template version, destination snapshot/config version, finalization state/time | Preserve current `summary`; version new format without overwriting old text |
| Reference metadata | Random ID/path, private provider, normalized type, bytes, owner/request association, state, upload/linked timestamps, inquiry relation | `rivya_references` plus upload-session and budget tables; never expose raw object paths publicly |
| Operational state | Existing status, optimistic version, assignee, follow-up date, internal notes, actor/time/reason history | Existing order/events/notes/audit; staff edits do not rewrite original brief |
| Staff/session | Staff ID, role, active/version, strong password hash, hashed session capability, expiry/revocation | Existing staff/session tables; verify every server boundary |
| Content/media/settings/revisions | Draft/published versions, approved provenance, safe structured content, business contacts, revision snapshots and restore-to-draft | Existing content/media/settings/revision tables; portfolio extension only when needed |

Product association must remain valid without deleting historical inquiries if a product is hidden or archived. New `request_kind` constraints must allow a product ID only where it is meaningful; do not assign bespoke requests a fictional catalogue ID. Keep the original snapshot rather than joining current product text to reconstruct old requests.

### D4. Customer and form model

Three logical steps remain: **Your piece → Your details & references → Review**. A compact product can use the same groups on one page if clearer. Selected-product routes must carry the correct product/version without requiring selection again.

| Product family | Candidate fields to validate against real capabilities |
|---|---|
| Tables, consoles and furniture | Dimensions/units or help choosing, intended use, colour/resin direction, base/finish where offered, placement, city, access constraints, desired timing, references |
| Wall art and spatial pieces | Format/dimensions, orientation, visual direction, mounting where offered, room/placement, city, references |
| Nameplates | Exact text, dimensions, orientation, supported typography/mounting, colour/finish, reference direction |
| Coasters and small sets | Quantity, supported size, colour, embedding/personalization where offered, finish |
| Memory/preservation | Item and condition, format/dimensions, arrangement, text/date, reference images, suitability acknowledgement; no guarantee before review |
| Bespoke custom piece | Type/purpose, approximate scale, material/colour direction, known constraints, city/timing, notes/references; quote on review |

Use stable field IDs, typed values, bounds, maximum lengths, units, allowed options, required flags, safe conditional visibility and accessible help. Declarative schemas only: no administrator-authored executable code. Hidden answers must not be silently accepted. Distinguish unsupported choices from “help me choose”. Save the accepted schema and display labels with every submission. Product edits must not alter old orders.

Required customer information: name and usable phone; city/address detail only where needed for that product/service. Email remains optional. Do not require full delivery address or sensitive documents merely to submit a brief. No plaintext PII autosave to persistent browser storage. Preserve inputs during retries; use an unsaved-change warning and a reviewed refresh strategy for stale schemas.

### D5. Order message specification

Destination is the supplied business number **918320404132**, formatted as **+91 83204 04132** in visible copy. The customer's phone is message data, never an accidental destination. Studio Open Order uses the same saved business-order destination, not a generic message-to-customer feature.

Retain destination/config-version evidence at submission, but revalidate its approval before every handoff/reopen. Never blindly send old customer details to a retired or reassigned number. If the saved destination is no longer approved, disable the old link until an admin authorizes and audits the switch to the current verified business destination; explain the changed destination without rewriting the saved message.

Message content, in order:

1. RivyaLivingArt order request and saved reference.
2. Request kind; selected product title/ID/slug, or explicitly labelled custom request; schema/version where useful operationally.
3. Customer name, phone and optional email; supplied location/timing fields.
4. Complete accepted customization fields in human-readable order, including units.
5. Customer notes/additional instructions without silent truncation.
6. Count of references saved privately in Studio, and a clear statement that files are available there.
7. Neutral request for the atelier to review the submitted requirements; no payment request or automatic confirmation.

Persist the exact full text. Encode Unicode, punctuation, newlines and emoji safely. Existing code uses an 1,800-character encoded-link budget; treat this as an application threshold to validate on supported devices, not a universal WhatsApp guarantee. Above the validated budget, display the complete saved text, provide **Copy Order Message**, and offer a clearly labelled short reference-only link. Never imply the shorter link contains the full brief. Clipboard denial must leave selectable text. Do not put private reference URLs, receipt capabilities or staff links into the message.

If popups/app launch are blocked, keep the saved receipt and normal link available. No customer account, app-install requirement or redirect loop. The customer manually sends; the website cannot verify that action. Reopen/copy must not create another order.

Privacy disclosure must explain that **opening the encoded WhatsApp link passes the prepared text and included contact details to WhatsApp before the customer presses Send**. Manual Send controls delivery into the conversation; it does not postpone the initial handoff to that provider. Offer the saved-message view/copy option, never include private images/capabilities in the URL, and keep handoff URLs out of logs, analytics and referrers.

### D6. Private references and lifecycle

Retain the existing proposed limits: **three images, 3MB each**, JPEG/PNG/WebP, with actual decoded MIME validation, still-image checks, decoder pixel limit, orientation normalization, metadata stripping and bounded derivatives. Existing source uses a 20MP decoding ceiling, maximum 1,800-pixel derivative and a 500MB application reservation budget. These are application controls requiring runtime verification, not guaranteed provider entitlements. Reject unsupported uploads clearly; never silently discard an accepted image.

Uploads use guest/request/upload identities, private Vercel Blob storage, atomic slot/byte reservation and pending/ready/deleting states. Link only owned, unexpired ready uploads when the inquiry commits. No private image through the public image optimizer, public catalogue, Git, analytics or searchable URLs. Staff access is server-authorized for admin or assigned editor, with private/no-store responses.

Keep existing cleanup of unsubmitted uploads older than 24 hours. Failed provider deletion retains metadata/accounting for retry. Attached customer reference retention is a separate owner-policy decision; implement reviewed admin deletion/anonymization only after that policy is settled. Preview an exact affected-record/object count, preserve permitted audit history, reconcile partial failures, and never auto-delete existing customer records merely because they look like fixtures.

## E. Studio, operations and security design

### E1. Studio is the primary management system

Saved order detail contains: reference; customer; request kind and product snapshot; structured customization; private references; customer notes; source/submission time/consent record; current stage; assignee/due date; internal notes; activity history; saved order message; authorized Open/Copy actions. Separate immutable submitted information from editable staff fields. A correction adds an attributed amendment; it does not silently replace the customer's original submission.

Keep the current stages and codes: **New → Contacted → Qualified → Quoted → Confirmed → In Production → Completed → Closed**. Staff perform transitions; WhatsApp open/copy never changes them. Closing and backward transitions require reasons according to the existing rules. Preserve version checks, prior stage, actor and timestamp. On conflict/failure, restore/refetch durable state and explain what happened.

Kanban must support desktop drag, native **Move To**, keyboard and touch. Cards show the saved reference, meaningful product/custom title, age, assignee, due indicator and reference count without exposing unnecessary personal data. Filters cover search, stage, assignee, product/category, submission date and follow-up; retain server pagination. Scope filters and counts to the staff member's actual permissions. Any bulk assignment/stage action uses explicit selection/count, per-record authorization and conflict results; bulk messaging is excluded.

### E2. Roles and publication

| Capability | Admin | Editor |
|---|---|---|
| Inquiry/customer/reference read | All authorized business records | Assigned records only |
| Stage, follow-up and internal notes | Allowed with audit | Assigned records, permitted transitions |
| Manual order creation/correction | Allowed, source explicitly staff-entered | Not enabled by default |
| Catalogue/form/content/media draft edits | Allowed | Permitted editorial scope |
| Public publication/hide/restore | Allowed after validation | No publication privilege |
| Staff roles/session revocation/business destination | Admin only | No |
| Personal-data export/cleanup/deletion | Admin only with exact scope/confirmation | No |

Server checks apply independently of hidden buttons. Verify staff revocation, changed roles/assignments and session expiry against direct endpoints. Current source has 8-hour absolute and 30-minute idle session bounds; retain unless evidence warrants a documented change. Refreshing sign-in must not discard unsaved editorial work. Avoid a shared login throttle that lets one attacker lock out all staff.

Catalogue/content publication must be durable and visible across devices without localStorage. Maintain draft/live comparison, validated form schemas, gallery ordering, metadata and revisions. Restore old content into a new draft using the current record version; never overwrite another editor's changes silently. Public media and private customer references remain separate.

### E3. Security and data-integrity work

- Parameterized database operations, safe structured rendering, output escaping and strict allowed-field/schema validation. Do not accept HTML/scripts or trust client product names, destination numbers, roles, hidden answers or file metadata.
- Same-origin mutation checks where relevant, secure HttpOnly/SameSite guest and staff cookies, hashed capability storage, short receipt expiry, random IDs and non-enumerable lookup. No customer details in Rivya public/receipt URLs, logs or analytics. The deliberately encoded order-message handoff URL is the disclosed WhatsApp exception described in D5.
- Rate limits at account/IP/guest/request layers, bounded request bodies, a functioning low-friction honeypot if retained, and idempotency keys tied to guest/payload. Do not silently add a paid bot service or inaccessible challenge.
- Validate real images and private access, not just file extensions. Prevent cross-guest attachment linking and cross-staff reference access. No raw credentials or sensitive exceptions in client responses.
- Environment isolation: Preview and Production database/storage/session secrets remain separate; migrations never run during ordinary build. Back up before changes, use additive constraints/mappings, and preserve original rows/history.
- Independent protected backups and a restore rehearsal are required. The existing snapshot inside the same database is useful migration evidence, but cannot survive loss of that database. Agree recoverable data scope, retention and realistic recovery targets; do not invent an RPO/RTO promise.
- Minimize production logs. Log opaque correlation ID, operation, stage and sanitized failure category; exclude names, phones, emails, notes, images, message bodies, cookies and access URLs. Restrict exports and neutralize CSV formulas.

## F. Design, content and media system

### F1. Visual direction and header correction

Preserve the exact brand **RivyaLivingArt**, supplied logo and approved media. Furniture/spatial art leads; memory and personal art remain distinct secondary journeys. Develop an architectural, editorial gallery with generous spacing and useful product information, rather than turning the interface into an animation demo.

| Token | Intended role | Contrast finding for opaque flat colors |
|---|---|---|
| Forest `#19221C` | Existing primary brand identity, material/editorial dark sections | Ivory contrast approximately 14.23:1 |
| Navy `#0B1728` | Complementary dark-blue shell, hero framing and controls | Ivory contrast approximately 15.69:1 |
| Ivory `#F3EFE7` | Main reading/product surface and text on dark backgrounds | Supports both principal dark colors |
| Bronze `#B08D57` | Restrained accent, rules and selected decorative details | About 2.70:1 on ivory: not normal text; about 5.82:1 on navy |

Calculated ratios are design-token checks, not a full accessibility pass. Navy against forest is only about 1.10:1: never use that pair for readable text or necessary control boundaries. Test overlays, disabled states, focus and photographs separately. Forest remains the primary brand color; navy complements it rather than replacing the identity by assumption.

Header: constrained logo asset with correct proportions; proposed 80–88px desktop and 64–72px mobile envelope, subject to actual logo/navigation fit; readable 15–16px navigation; 44px preferred control targets; clear focus and active state. Do not shrink labels to force a crowded row. Collapse to the mobile menu at the content-driven breakpoint. Sticky behavior must not obscure anchor destinations, errors or focused controls.

Navigation: Collections, Our Atelier, Process, Journal, Contact; search and **Begin a piece**. Collections exposes the three journeys. No public account/cart/Studio or generic WhatsApp control. Footer has useful policies, verified phone/email/map and the order entry link. Use native scrolling, meaningful headings, consistent grid/spacing and independently usable mobile navigation.

Reuse existing local fonts/license evidence; pair expressive display headings with readable body/form type. Keep Studio denser and task-focused, with the same colors and accessible controls. Display typography must not impair data entry, long product names, status scanning or form errors.

### F2. Page-specific composition

Home: clear brand proposition → furniture-led collection entry → selected pieces → material/detail chapter → actual process → journal → order invitation. A hero image must load useful content immediately; optional short video needs a poster and mobile/reduced-motion fallback.

Collections: distinct category context, supported filters, useful result count, consistent portrait cards and preserved URL state. Memory art uses careful suitability language; personal pieces emphasize meaningful personalization. Search provides relevant results, zero-state recovery and browser Back behavior.

Product: generous gallery, product title/purpose, factual material/size direction, customization preview, feasibility caveats, care and related pieces; a clear customization CTA. Real photographs and design visualizations must be accurately identified. No invented inventory, reviews, discounts, measurements or manufacturing claims.

Forms: selected-piece context, short logical groups, progressive relevant fields, visible required/optional distinctions, clear review and error recovery. Saved receipt focuses on the reference and message handoff; it does not show a shopping-cart thank-you or payment success.

Editorial: distinct story/process/materials/architects/contact layouts rather than interchangeable text blocks. Journal has category/introduction/reading hierarchy, factual original articles, relevant images and related pieces. Portfolio publishes only evidenced work. Policies prioritize legibility and accurate business practice.

### F3. Motion and interaction specification

Motion supports orientation and material storytelling: proposed 160–240ms control transitions, 300–600ms image/section reveals, restrained stagger and modest transform distances. Treat those as tunable design values. Essential headings, navigation, price-on-request context and CTAs remain available without animation or JavaScript. No scroll hijacking, mandatory intro, perpetual cursor effects or interaction delay.

Gallery supports swipe, thumbnail selection, keyboard previous/next and native accessible zoom dialog with focus return. Menu/search/dialog transitions respect reduced motion. Kanban feedback is immediate but confirms server state; a failed optimistic move rolls back. Buttons expose pending states and prevent duplicate action. No sound autoplay or decorative video that competes with the form. Pause controls and static/poster alternatives accompany any continuing animation.

### F4. Content and asset rules

All public copy must be original, useful and factual. Approved supplied facts/assets are already authorized; do not restart a blanket rights-approval loop. That approval does not transform explicitly fictional testimonials/projects/orders into actual business evidence. Classify every source item as **Approved / Needs Review / Draft Only / Dummy-Test / Missing**. Preserve questionable material unpublished; deletion stays owner-controlled.

Every published product needs individual title/description, capabilities, configurable fields, imagery/alt text, care and related context. Every article needs reviewed prose and useful references. No placeholder policies, demo labels, fake scarcity, guaranteed lead times, fabricated founding story, award badges or customer reviews. Unknown necessary business facts are marked **OWNER INPUT REQUIRED** in internal records and withheld from published claims.

Use supplied Drive assets and approved derivatives first. Existing source points to the [owner's supplied Originals folder](https://drive.google.com/drive/folders/1P2HCTmPge6HsEwtoo-xGEzPTSn68oZOW); this planning turn did not re-download or newly validate every original. Preserve provenance and match each asset to its actual product/use. Do not recolor a real product or fabricate workshop/project evidence. Generated material is allowed after approval where a defined gap remains, and must not masquerade as a real completed commission.

Maintain an asset manifest: **Asset ID; page; section; purpose; type; aspect ratio; desktop/mobile crop; subject; composition; lighting; material; color direction; camera; negative constraints; filename; alt-text intent; source; rights/evidence; real-photo/visualization classification; dimensions/bytes; publication status**. Define these before generation. Prefer CSS/SVG for simple original icons. Use responsive derivatives, explicit aspect ratios and meaningful alt text; customer references never enter this manifest.

### F5. Accessibility and performance targets

Target WCAG 2.2 AA for retained public and Studio flows: semantic landmarks/headings, labels/instructions, visible focus, keyboard access, errors announced and linked to fields, dialog focus handling, reflow/zoom, text/non-text contrast and non-drag alternatives. Prefer 44px controls even where the standard permits smaller targets with conditions. Validate manually as well as with automated tools; make no conformance claim until evidence supports it. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

Aim for LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at the 75th percentile in real usage. Before launch, use representative mobile lab measurements and interaction diagnostics; field INP cannot be claimed from a single lab run. Budget hero media, reserve geometry, lazy-load below-fold images, subset/local-load licensed fonts, separate Studio bundles, limit client code and avoid database N+1 work. No target is currently claimed achieved. [Web Vitals](https://web.dev/articles/vitals)

### F6. Reference and Awwwards audit

Fresh qualitative review covered desktop homepages of all five requested sites, AOI collection/product pages and its product page at **390 × 844**, ERA catalogue text, and the listed Awwwards entries/examples. It did not measure conversion, animation frame rate, Core Web Vitals or full accessibility. Mobile was sampled on AOI only. Earlier deeper observations in the Experience plan remain historical evidence, not fresh tests. No reference forms were submitted and no assets were copied.

| Reference and evidence | Useful principle | RivyaLivingArt application | Exclude or correct |
|---|---|---|---|
| [ERA Residence](https://www.era-residence.com/) and [apartment catalogue](https://www.era-residence.com/apartments): framed burgundy opening, architectural imagery, small overlay navigation; typology/bedroom filters and detailed specifications in catalogue | Emotional scene → practical discovery → factual detail | Room-scale furniture imagery; strong collection entry; legible, useful product filters/specifications | No blocking intro, miniature navigation, unnecessary day/night control or forced scroll |
| [Spyker](https://spykercars.com/): large object/detail media, sparse overlay controls, craft/heritage/news sequence; initially unavailable media subsequently rendered | Product object and material details form distinct narrative chapters | Whole piece, resin/wood macro, scale and supported craftsmanship explanation | No mandatory video/sound or invented provenance; still fallback required |
| [AOI collection](https://aoiofficial.com/collections/sculptures) and [7-S-3 product](https://aoiofficial.com/products/7-s-3-black-obsidian-geometric-sculpture-lison-de-caunes-aoi): controlled object grid, filters/sort, substantial gallery and craft text; mobile gallery/thumbnails with persistent inquiry action | Gallery clarity and consistent object hierarchy across devices | Product photography/visualization, useful thumbnails, reading hierarchy and persistent mobile Customize action that does not obscure content | **Do not copy direct WhatsApp bypass.** All Rivya order actions first enter a form and complete save; no invented editions/scarcity |
| [MDE Beauty](https://mdebeauty.com/): navy/gold/ivory product presentation, ornament, numbered principles and layered material explanations; account/cart/rewards controls visible | Complete product storytelling and consistent page-family polish | Original restrained resin-line accents, material/care chapters, considered utility pages | No account/cart/rewards, copied ornament, faint navigation or borrowed claims |
| [Storey Architecture](https://www.storeyarchitecture.co.uk/): large spatial scene, compact navigation, project-led chapters; project/location/timing brief structure | Space and purpose make the product understandable | Furniture scale, real project templates, relevant bespoke-brief questions, editorial rhythm | No hover-only discovery, motion-dependent reading or fictional projects; cinematic effects do not belong in Studio operations |

[Awwwards e-commerce category](https://www.awwwards.com/websites/e-commerce/) supplied further comparisons. An entry's nomination is not an award win, and no award outcome is promised for RivyaLivingArt.

| Concrete benchmark | Verified entry/flow | Transfer |
|---|---|---|
| [Maison Des Elites](https://www.awwwards.com/sites/maison-des-elites) | Nominee, 18 September 2026; entry highlights hero, product/material, collection, mobile and not-found work | Give product, editorial, mobile and failure states the same design attention as home |
| [COCOON](https://www.awwwards.com/sites/cocoon-2), [store](https://www.cocoonblanket.com/) and [catalogue](https://www.cocoonblanket.com/collections/all) | Honorable Mention, 25 August 2026; product/lookbook perspectives and grouped discovery controls | Offer complementary object/room imagery and clear filters; no checkout, discount pressure or membership scope |
| [Coutumes](https://www.awwwards.com/sites/coutumes) and [custom builder](https://coutumes.com/products/create-your-own) | Nominee, 5 September 2026; ordered base/addition/engraving decisions, summary and exit confirmation | Relevant step order, progressive disclosure, exact text review and unsaved-exit handling; no jewelry-specific choices, paid add-ons or cart |

## G. Complete phase-based implementation plan

**New phase numbering supersedes the old ten-phase numbering.** Old Phase 2–4 source work is retained inside the relevant new phases; it is not reset to zero. No new phase is marked executed merely because a related old source task was complete. Source implementation, UI readiness, backend connection and TESTED remain distinct states.

Formal integrated verification stays after backend integration. “Testing” below specifies acceptance work to prepare; execute the comprehensive readiness checks in Phase 10 and formal suite/device QA in Phase 11. During Phases 2–9, source inspection and compiler feedback may resolve development wiring without being labelled QA. Phase 12 repeats only checks justified by a changed release candidate or deployment environment.

### Phase 0 — Source reconciliation

**Objective:** establish an honest baseline and classify every WhatsApp use before changing anything.

**Tasks:** P0.1 read both source plans, pasted master/correction and repository instructions; P0.2 record branch/commit/routes/schema receipts and source-versus-live differences; P0.3 search WhatsApp creation/UI/copy/legacy routes and classify KEEP/REWRITE/REMOVE/ORDER-RELATED ONLY/NEEDS REVIEW; P0.4 inventory products, schemas, content, assets, staff/stages and outstanding verification; P0.5 resolve the missing guide reference and document limits.

**Dependencies:** read access; latest owner scope. **Files/systems:** repository, attachments, prior outputs, Vercel read-only listing. **Database impact:** none; recorded receipts inspected, live reconciliation still due. **UI impact:** audit only. **Security:** no secrets in documents and no test customer writes. **Testing:** no implementation QA; verify source pointers and consistency. **Deliverables:** `Current-State-Reconciliation.md`, audit sections A–C. **Exit criteria:** actual versus absent WhatsApp features clearly separated; preserved baseline and unknowns recorded. **Resume point:** P1.1. **Status:** complete within the documented read-only limits.

### Phase 1 — Revised master and approval

**Objective:** consolidate one reviewable strategy with exact workflow, all-page coverage and honest commercial release gates.

**Tasks:** P1.1 reconcile conflicts and reference authority; P1.2 define data/Studio/message contract; P1.3 benchmark and specify design/content/media; P1.4 assign gaps, phases and acceptance criteria; P1.5 publish the plan, reconciliation and progress checkpoint for approval.

**Dependencies:** Phase 0. **Files/systems:** this plan, reconciliation/progress records and repository authority/checkpoint guidance. **Database impact:** none. **UI impact:** proposed specifications only. **Security:** flag risks without claiming exploitation or certification. **Testing:** document integrity, scope/instance coverage and publication checks. **Deliverables:** approved master, reconciliation, progress and approval record. **Exit criteria:** complete plan presented, approved and registered in the existing repository; publish the Phase 1 checkpoint to the work branch. **Resume point:** **P2.1**. **Status:** complete; owner approval recorded. This request finishes Phase 1 and its publication.

### Phase 2 — Foundation and data architecture

**Objective:** extend the real existing architecture safely, with no fresh-start scaffold or blind migration.

**Tasks:** P2.1 verify the latest approved plan, exact work-branch head/remote, clean or preserved working tree and deployment hold; snapshot any new drafts. P2.2 reconcile current Preview/Production schemas, migration receipts, permissions and environment scopes read-only; never assume zero records remain. P2.3 design additive request kind, stable answer snapshot, consent/source metadata and message-finalization fields with legacy compatibility. P2.4 define independent backup/restore, retention and deletion mapping. P2.5 define bespoke schema registry and references/guest ownership. P2.6 resolve permitted local/hosted integration environment under the Vercel eligibility hold; keep secrets ignored and separate. P2.7 update schema/data/role/instance registers and migration/rollback instructions.

**Dependencies:** revised approval; required secrets only in secure local/provider configuration; hosting eligibility before any hosted business activation. **Files/systems:** `scripts/*schema.sql`, `src/lib/studio-db.ts`, models, `docs/redesign`, ignored configuration. **Database impact:** additive migrations only after schema reconciliation and backup; no deletion/backfill invention; Preview first when permitted, Production later. **UI impact:** none beyond architecture prerequisites. **Security:** explicit owner/admin/editor and private-reference boundaries; isolate environment identities. **Testing:** prepare migration invariants and recovery cases; final restore/constraint tests in Phases 10–11. **Deliverables:** current schema map, migration/rollback bundle, environment matrix and decision log. **Exit criteria:** each planned change maps to current schema; historical data remains readable; no secret exposure; any external blocker has an exact local continuation task. **Resume point:** P3.1. **Status:** Phase 2 foundation complete. Live Preview/Production schema reconciliation, proposed migration/rollback bundle, typed contracts and environment/role/instance registers are saved; activation blockers have exact continuation tasks. No migration applied.

### Phase 3 — Shared design system

**Objective:** refine the existing redesign into a consistent, legible public/Studio system.

**Tasks:** P3.1 audit token/font/component reuse; P3.2 establish forest/navy/ivory contrast roles and responsive grid; P3.3 correct logo/header/navigation/menu/sticky behavior; P3.4 standardize buttons, fields, cards, dialogs, feedback and focus; P3.5 define motion/static/reduced-motion rules and Studio density; P3.6 remove broad WhatsApp labels from shared chrome without adding generic replacements.

**Dependencies:** Phase 2 source baseline; existing brand assets. **Files/systems:** `src/styles/tokens.css`, `src/components/shop/*`, Studio styles and login. **Database impact:** none. **UI impact:** every shared public and Studio component. **Security:** no public staff entry or customer account; dialog states must not reveal private data. **Testing:** prepare keyboard/focus/contrast/reflow scenarios; compiler/source checks only until integrated QA. **Deliverables:** updated design-system specification, responsive component/source coverage. **Exit criteria:** every shared state has a specified usable static version, readable header and no generic WhatsApp affordance. **Resume point:** P4.1. **Status:** P3.1–P3.6 complete at the source/specification gate; see PHASE-3-DESIGN-SYSTEM.md. Compiler/source checks only; visual/device/accessibility proof remains Phase 11.

### Phase 4 — Product discovery and all-product presentation

**Objective:** make the full approved catalogue understandable on any device.

**Tasks:** P4.1 reconcile all 120 IDs/slugs against actual publishable records; P4.2 refine furniture-led home and three distinct collection journeys; P4.3 complete URL search/filter/sort/result/back behavior; P4.4 refine every product's gallery/specification/care/related pieces and image states; P4.5 route each Customize action to the exact product/schema; P4.6 classify content/media rather than silently publish fixtures.

**Dependencies:** Phase 3; approved factual content/media and publication controls. **Files/systems:** catalogue models/queries, shop site/browser, product routes, instance/media registers. **Database impact:** versioned draft content; deliberate reviewed publication later, no seed during build. **UI impact:** P01–P06 and shared gallery. **Security:** published-only reads; no guessed object URLs or draft leakage. **Testing:** prepare every-instance review, filters/back navigation and unavailable-product cases. **Deliverables:** product-level completion matrix with content/schema/image evidence. **Exit criteria:** every retained published product has correct information and customization entry; held records have reasons and safe disposition. **Resume point:** P5.1. **Status:** P4.1–P4.6 complete at the source gate; see PHASE-4-CATALOGUE.md and phase-4-products.json. Current runtime publication is not inferred; final visual/behavioral proof remains Phase 11.

### Phase 5 — Product-specific and bespoke customization

**Objective:** collect the right brief for each product/custom request with recoverable, accessible entry.

**Tasks:** P5.1 reconcile field families and actual capabilities; P5.2 complete stable typed field IDs, versioning/conditions and Studio builder validation; P5.3 complete selected-product form and the proposed bespoke `/commission/customize` branch; P5.4 customer fields, optional references/notes and review/edit controls; P5.5 stale-schema, upload, navigation and retry recovery without persistent plaintext browser PII; P5.6 connect a real honeypot if retained, visible upload status and linked error descriptions; P5.7 replace demo-only form behavior with genuine service/error boundaries.

**Dependencies:** Phases 2–4 and approved supported product capabilities. **Files/systems:** `product-form.ts`, order form, customization routes, form editor and request/upload contracts. **Database impact:** draft/published schema versions and custom-kind support; preserve old schema/answers. **UI impact:** P07–P10, new P32, S09. **Security:** server validates all options/conditions; ignore no untrusted fields; bounded notes/files. **Testing:** prepare per-product required/conditional cases, mobile keyboards, Unicode, revision changes, attachment progress/failure and unsaved navigation. **Deliverables:** schema inventory, working source forms and exact review copy. **Exit criteria:** each accepted brief has stable structure and version, no fake success, no generic WhatsApp path. **Resume point:** P6.1. **Status:** P5.1–P5.7 complete at the source gate; see PHASE-5-CUSTOMIZATION.md and phase-5-schemas.json. Bespoke prepare/review/copy is ready in source; uploads/save/handoff await Phase 6. No runtime QA or database integration completion is claimed.

### Phase 6 — Durable order save and WhatsApp handoff

**Objective:** implement the exact owner-approved sequence and recover from every partial failure without losing or duplicating an order.

**Tasks:** P6.1 enforce validation/ownership/request identity; P6.2 retain atomic core order/inquiry/reference/history creation; P6.3 read saved canonical snapshot, finalize/persist message and destination/version metadata idempotently; P6.4 implement pending/ready/failure receipt states and authorized recovery; P6.5 full-message encoding, long-link fallback, clipboard denial and blocked-app recovery; P6.6 make saved records independently retrievable in Studio; P6.7 update all order terminology and ensure customer manually sends; P6.8 remove only confirmed out-of-scope wiring/reachable demos, preserving historical data.

**Dependencies:** Phase 5, actual isolated permitted database/private storage, no unresolved schema ambiguity. **Files/systems:** `src/app/actions/inquiry.ts`, receipt/upload/session routes, `whatsapp.ts`, saved receipt, schema and transaction code. **Database impact:** real integration writes only in an allowed isolated environment with clearly labelled synthetic tests; no live customer data for QA; historical messages untouched. **UI impact:** Place Order → saved receipt → Open/reopen/copy. **Security:** guest-bound receipt, expiry/no-store/noindex, server destination, full permission checks and no public references. **Testing:** prepare exact record-count/snapshot/message assertions; exercise in Phase 11, including core-save versus message-finalization failures. **Deliverables:** connected source contract, recorded integration status and failure matrix. **Exit criteria:** code uses only saved record for handoff; every failure has nonduplicating recovery; no claim of verified runtime until later evidence. **Resume point:** P7.1.

### Phase 7 — Studio, Kanban and durable publishing

**Objective:** staff can understand and manage every order without reconstructing it from WhatsApp.

**Tasks:** P7.1 complete detail layout and immutable/original-versus-amended separation; P7.2 add saved-order Open/Copy and pending-message recovery controls; P7.3 refine list/Kanban card context, filters, assignment, due dates, keyboard/touch Move To and optimistic conflict handling; P7.4 preserve eight stages/events and manual record source; P7.5 complete roles/session revocation and unsaved-work recovery; P7.6 review catalogue/form/content/media drafts, publication and revision restore across devices; P7.7 add portfolio authoring only if actual approved projects need it; P7.8 complete admin-only settings/export/retention tools and internal activity, with no outbound notification system.

**Dependencies:** Phases 2 and 6; current staff model and confirmed operational policies. **Files/systems:** `src/components/studio/*`, Studio APIs, auth/order/content/media/settings/revision modules. **Database impact:** audited operational/content changes; controlled migrations only where required; preserve manual historical orders. **UI impact:** all S01–S17. **Security:** enforce assigned-editor scope on reads, filters, aggregates, files and mutations; publication/export/admin-only restrictions. **Testing:** prepare two-role/two-session concurrency, assignment/revocation, direct API denial, stage rollback, cross-device publish and unsaved editor cases. **Deliverables:** complete Studio capability matrix and permission evidence plan. **Exit criteria:** every requested staff task has a durable source path and clear failure state; no WhatsApp inbox, broadcast or auto-follow-up. **Resume point:** P8.1.

### Phase 8 — Remaining public pages and corrected copy

**Objective:** finish every retained page and remove wording that expands WhatsApp beyond the saved order.

**Tasks:** P8.1 redesign/review Atelier, process, materials/care, architects, contact and FAQ; P8.2 review all 36 articles and related media; P8.3 publish only genuine projects or use truthful empty/unpublished states; P8.4 finalize privacy/terms/shipping/changes/accessibility copy from actual practices; P8.5 reconcile aliases, product/article redirects, metadata, canonical/sitemap/robots and truthful structured data; P8.6 inventory every public form and ensure general contact never hands off to WhatsApp; P8.7 complete 404/error/loading/empty/expired states and production route isolation.

**Dependencies:** Phases 3–7; only genuinely missing business facts require confirmation. **Files/systems:** app public routes, editorial/content models, reviewed copies, metadata/sitemap/robots, CMS. **Database impact:** versioned drafts/publication after review; original content retained. **UI impact:** P12–P31 and associated instances. **Security:** no private/customer data in public metadata, structured data, previews or search; draft/private noindex is additional protection, not authentication. **Testing:** prepare route/redirect/status, contact links, content factuality and fixture-exposure checks. **Deliverables:** reviewed page/article/policy matrix and corrected copy log. **Exit criteria:** all public routes have explicit final disposition; no placeholders, fake evidence or generic WhatsApp function. **Resume point:** P9.1.

### Phase 9 — Integrated motion, media and responsive refinement

**Objective:** reach a consistent high-quality experience across public and Studio page families.

**Tasks:** P9.1 reconcile remaining assets and generate only defined approved gaps; P9.2 optimize/crop gallery and hero media per device; P9.3 refine transitions/microinteractions/reduced motion; P9.4 align all breakpoints, long content, sticky actions and touch targets; P9.5 tune bundle/query/image/font loading and recoverable states; P9.6 reconcile every route/instance against the coverage register.

**Dependencies:** complete integrated public/Studio source; approved content/assets. **Files/systems:** shared components/styles, asset manifest/derivatives, image configuration and data-query boundaries. **Database impact:** media metadata/content revisions only. **UI impact:** complete platform; no motion added at the expense of task completion. **Security:** keep customer media outside public assets and generation tools. **Testing:** prepare visual/device/static fallback cases; comprehensive measurement follows Phase 10/11. **Deliverables:** finished candidate, optimized media manifest and unresolved-issue register. **Exit criteria:** all required source/instance work reconciled; remaining issues explicitly assigned to readiness/QA rather than hidden. **Resume point:** P10.1.

### Phase 10 — Commercial-readiness audit and remediation

**Objective:** determine whether the complete candidate is safe and eligible to operate commercially.

**Tasks:** P10.1 resolve hosting eligibility and account/environment evidence; P10.2 audit authorization, validation, secrets, references and personal-data lifecycle; P10.3 verify schema integrity, isolation, backup/restore and operational runbooks; P10.4 confirm business/policy/content truthfulness and no demo exposure; P10.5 audit SEO/accessibility/performance on the integrated candidate; P10.6 verify monitoring and optionally add minimal non-PII funnel events; P10.7 remediate findings and publish explicit release-gate status.

**Dependencies:** integrated Phases 2–9; authorized isolated environment; required owner facts. **Files/systems:** entire candidate, provider settings, backups, logs, content and evidence. **Database impact:** controlled isolated audit/test records, independent backups and restore destination; no production destructive tests. **UI impact:** fixes for discovered blockers. **Security:** ordinary authorized functional checks only; no public-provider load/penetration testing or sensitive-data logging. **Testing:** integrated operational, role, privacy, accessibility/performance and restore checks begin here after integration. **Deliverables:** `RivyaLivingArt-Commercial-Readiness-Report.md`; each finding has ID, area, severity, issue, evidence, commercial impact, fix, files/components and status. **Exit criteria:** no unresolved Critical/High release risk; all nontechnical release blockers honestly resolved or release remains held. **Resume point:** P11.1 when testable; no bypass for hosting eligibility.

### Phase 11 — Final integrated QA

**Objective:** prove the complete journey on the exact release-candidate commit, including negative and failure cases.

**Tasks:** P11.1 run repository lint/typecheck/unit/preflight/build/runtime/e2e checks, updating obsolete expectations without weakening intended assertions; P11.2 complete browser/device/keyboard/screen-reader/reduced-motion matrix; P11.3 verify every published product/form/article/project and every Studio screen; P11.4 test saved-core/message-failure/retry/upload/long-message/popup/clipboard paths; P11.5 prove permissions/concurrency/retention/restore; P11.6 repair defects and rerun affected checks, then freeze evidence to the final candidate SHA.

**Dependencies:** Phase 10 findings resolved sufficiently for testing; required real services permitted and connected. **Files/systems:** tests/tools, application, isolated database/storage and browser evidence. **Database impact:** synthetic labelled records in isolated test scope only; export evidence without customer data; cleanup requires established authorization and exact scope. **UI impact:** defect corrections, not unreviewed scope expansion. **Security:** never send test messages to real people; inspect prepared links and browser handoff without automatically pressing WhatsApp Send. **Testing:** full matrix in section I; distinguish emulator evidence from real Android/iPhone evidence. **Deliverables:** exact-commit QA report, captures, failure evidence and route/instance completion register. **Exit criteria:** all required tests and gates pass; no serious known issues; any unavailable device evidence is explicitly recorded and resolved before a required gate is claimed. **Resume point:** P12.1.

### Phase 12 — Main publication and eligible Vercel release

**Objective:** publish the finalized verified code to main and release only under satisfied deployment conditions.

**Tasks:** P12.1 verify final branch/remote/main diff, approval scope and release checklist; P12.2 back up Production and rehearse/record migration/rollback; P12.3 verify production environment/storage/secrets/indexing/domain and disable unintended triggers; P12.4 perform reviewed backward-compatible migration and content publication; P12.5 publish verified code to main and intentionally deploy eligible Vercel production; P12.6 confirm exact deployed SHA, public/Studio smoke results and data/private-access behavior; P12.7 update phase summary, release receipt and maintenance runbook.

**Dependencies:** revised approval, Phases 10–11 evidence, Vercel commercial eligibility, free-only authorization, production data/secret readiness and rollback capability. **Files/systems:** GitHub main, Vercel configuration/deployment, Production database/Blob and final evidence. **Database impact:** backed-up reviewed additive migration/publication; no fixture import or destructive reset. **UI impact:** verified redesign becomes public only after gates. **Security:** secret scan, environment separation, exact target review, no unprotected preview or private-index leakage. **Testing:** repeat justified release checks after any candidate/configuration change; post-deploy read-only smoke and controlled end-to-end verification. **Deliverables:** main/deployed SHAs and URLs, migration/backup receipts, release/rollback status and final phase summary. **Exit criteria:** deployment and business workflow verified on the released commit, or explicit **release blocked** report—never “complete” merely because code reached main. **Resume point:** maintenance only after success; otherwise the exact failed gate/task remains active.

If eligibility is unresolved, do not push an auto-deploying main release, purchase a plan, switch host or publish a stripped marketing site as an assumed loophole. Finalized code may be preserved on the work branch; the final main/release gate remains open.

## H. Complete route, screen and instance coverage

All rows are **pending revised implementation/verification**, not newly completed. Preserve the existing P01–P31 and S01–S17 IDs; add **P32** for the requested bespoke path. A screen may share a route or dialog. Each completion record must identify source/data/media, desktop/mobile design, motion fallback, access rules, tested commit/device evidence and final disposition. A row finishes only as **redesigned and verified**, **verified redirect**, or **intentionally unpublished with reason**.

| ID | Public route/surface | Required outcome | Phase |
|---|---|---|---|
| P01 | `/` | Furniture-led home, clear discovery, factual copy, useful hero fallback | 4, 9, 11 |
| P02 | `/collectible-design` | Furniture collection, relevant types/filters/scale | 4, 11 |
| P03 | `/memory-art` | Preservation-specific context without unsupported guarantees | 4, 11 |
| P04 | `/personal-art` | Gift/personalization-specific catalogue and information | 4, 11 |
| P05 | `/search` | URL search/filter/sort, results/zero state and Back restoration | 4, 11 |
| P06 | Every `/pieces/[slug]` | All 120 identities reconciled; each public instance has correct media/facts/form CTA | 4, 9, 11 |
| P07 | Every `/pieces/[slug]/customize` | Correct product/version, conditional fields, review and real save | 5–6, 11 |
| P08 | `/commission` | Clear choice of selected product or bespoke request; context preserved | 4–6, 11 |
| P09 | `/preserve` | Legacy entry resolves to appropriate preservation form/context | 5, 8, 11 |
| P10 | `/personalize` | Legacy gifting entry preserves supported options and context | 5, 8, 11 |
| P11 | `/inquiry/received` | Private saved/pending-message/ready/expired recovery; no duplicate/false confirmation | 6, 8, 11 |
| P12 | `/our-story` | Original factual Atelier story and suitable imagery | 8–9, 11 |
| P13 | `/about` | Verified canonical redirect to `/our-story` | 8, 11 |
| P14 | `/process` | Exact saved-order sequence and human confirmation; no extra WhatsApp service | 8, 11 |
| P15 | `/materials-care` | Verified material/suitability/care guidance | 8, 11 |
| P16 | `/materials`, `/care` | Correct redirects/anchors, no stale duplicate pages | 8, 11 |
| P17 | `/architects` | Appropriate scale/use/location/access brief linked to saved product/custom flow | 5, 8, 11 |
| P18 | `/journal` | Published-only editorial index, meaningful categories and image states | 8–9, 11 |
| P19 | Every `/journal/[slug]` | All 36 article candidates reviewed; alias/related-content correctness | 8, 11 |
| P20 | `/contact` | Supplied phone/email/map; orders enter forms; no general WhatsApp action | 8, 11 |
| P21 | `/faq` | Answers match actual save/Studio/manual-Send behavior and business facts | 8, 11 |
| P22 | `/privacy` | Actual providers, data purpose/access/retention/request process and handoff disclosure | 8, 10, 11 |
| P23 | `/terms` | Order request versus acceptance clearly distinguished; no invented contract terms | 8, 10, 11 |
| P24 | `/shipping-delivery` | Verified areas/process/charges/timing approach; no fabricated promise | 8, 10, 11 |
| P25 | `/returns-cancellations` | Confirmed change/cancellation/custom-work rules | 8, 10, 11 |
| P26 | `/accessibility` | Evidence-backed accessibility statement and ordinary contact method | 8, 11 |
| P27 | `/portfolio` | Genuine evidence-led index or deliberate truthful empty/unpublished disposition | 8, 11 |
| P28 | Every `/portfolio/[slug]` | Only real approved projects; eight fictional examples held | 8, 11 |
| P29 | 404/unavailable product | Correct status and useful recovery, no fake substitute | 8, 11 |
| P30 | Loading/empty/error/offline/expiry | Clear recoverable states with entered data preserved where possible | 3, 5–9, 11 |
| P31 | Header/footer/mobile menu/search/gallery dialog | Legibility, keyboard/focus, touch, reduced motion and responsive behavior | 3, 9, 11 |
| P32 | Proposed `/commission/customize` | Explicit bespoke schema, no fake product ID; same database/Studio/handoff contract | 2, 5–6, 11 |

| ID | Studio route/screen | Required outcome | Phase |
|---|---|---|---|
| S01 | `/studio/login` | Real staff auth, validation, rate limits, expiry/recovery | 3, 7, 10–11 |
| S02 | `/studio` overview | Accurate scoped real counts, recent records and due work | 7, 11 |
| S03 | `/studio/inquiries` list | Search/filter/pagination, clear reference/source/assignment | 7, 11 |
| S04 | Kanban; `/studio/kanban` alias | Eight preserved stages, drag/Move To/touch, durable conflict recovery | 7, 11 |
| S05 | Saved inquiry/order detail | Full immutable brief, references, staff history and order-only Open/Copy | 7, 11 |
| S06 | Staff-entered order create/edit | Source distinguished; validation and audit; no fabricated website snapshot | 7, 11 |
| S07 | `/studio/products` list | Durable catalogue state, useful search/filter, draft/published distinction | 7, 11 |
| S08 | Product create/edit | Safe gallery/factual fields, dirty state and version conflicts | 5, 7, 11 |
| S09 | Customization builder; `/studio/forms` alias | Versioned safe schema drives client/server; no arbitrary code | 5, 7, 11 |
| S10 | Preview/publish/revisions | Admin-only cross-device publication, live comparison and restore-to-draft | 7, 11 |
| S11 | `/studio/content`; pages/journal aliases | Durable page/article/FAQ/policy authoring; real portfolio authoring if needed | 7–8, 11 |
| S12 | `/studio/media` | Approved public assets only; provenance/alt/crop; no customer references | 7, 9, 11 |
| S13 | `/studio/reference/[id]` | Admin/assigned-editor only, private stream, failure/retry and return context | 6–7, 11 |
| S14 | `/studio/staff` | Admin roles, revocation and safe staff edits | 7, 10–11 |
| S15 | `/studio/settings` | Verified business/order destination, no exposed secrets, scoped cleanup | 7, 10–11 |
| S16 | `/studio/activity`, `/studio/follow-ups`, export | Internal due work/audit; controlled export; no WhatsApp notifications | 7, 10–11 |
| S17 | Dialogs/loading/empty/error/session/permission/conflict states | Safe focus, useful errors, unsaved recovery and no unauthorized leakage | 3, 7, 9, 11 |

### H1. Instance coverage and utility endpoints

The companion reconciliation includes a concrete checklist of all **120 product IDs/slugs**, **36 article IDs/slugs** and **8 held project IDs/slugs**. Stable URLs and legacy aliases must be checked, even where display copy changes. Products are checked twice: P06 detail and P07 form. An instance can be withheld with a factual reason; the template must still work. Do not mark a family complete by reviewing one attractive example.

Also verify every discovered route in `docs/redesign/current-route-source.json`, including Studio catch-all/aliases and legacy article/product paths. `/api/inquiry/session`, `/api/inquiry/reference`, `/api/inquiry/receipt`, the order Server Action and all Studio order/workspace/content/media/revisions/settings/operations/cleanup/reference APIs require direct behavior/permission checks. `/robots.txt`, `/sitemap.xml`, social metadata, 404/error handlers and private cache headers are release surfaces. Preview/demo/state-gallery routes must be protected or absent in Production. They are not approved public content.

New routes discovered during Phase 2 are appended with an owner/task/final disposition; they must not disappear from scope because they were missing from this snapshot. Screens sharing a route are verified independently.

## I. Verification matrix and operational acceptance

### I1. Exact customer-path cases

| Scenario | Required result |
|---|---|
| Selected-product success | Exactly one inquiry and same-ID Studio order; correct product/schema/answers/customer/reference snapshot; saved full message; handoff only after ready |
| Bespoke success | Explicit custom kind/schema; no invented product identity; otherwise identical guarantees |
| Core save fails | No WhatsApp open; useful retry; current entries retained; no partial order/Studio/reference linkage |
| Core commit succeeds but response/message finalization fails | Saved record remains discoverable; same-key retry returns/resumes it; no duplicate; honest pending-message state |
| Double click/concurrent retry/refresh | One logical order; stable reference; repeated handoff does not create another record |
| Same request key with changed payload | Reject conflict clearly; deliberate new request only when appropriate |
| Product hidden/schema revised mid-form | No silent acceptance of invalid or obsolete options; explain and preserve recoverable data |
| Invalid/missing/conditional fields | Matching client/server decisions; errors linked/announced; hidden unsupported values rejected |
| Malicious/oversized/too many/expired/foreign references | Reject safely; no private object leakage, slot bypass or false saved count |
| Interrupted upload/retry/remove | Same upload identity recovers safely; count/budget correct; completed order references cannot be removed through guest upload delete |
| Long text, Unicode, punctuation, names and multiline notes | Stored without silent truncation; readable full saved message; transparent copy/reference-only fallback |
| WhatsApp unavailable/popups blocked/not installed | Saved receipt and copy text remain usable; no fake sent/confirmed event |
| Clipboard denied | Selectable complete message and useful manual instructions |
| Expired/foreign receipt capability | No customer data exposure; clear safe recovery without an account |

### I2. Staff, publication and data cases

- Admin versus assigned editor versus unassigned editor versus unauthenticated visitor; direct endpoint and private-image checks, not only UI buttons.
- Role change/revocation/assignment change affects active access. Session expiry preserves unsaved work while protecting further operations.
- Kanban drag, Move To, touch and keyboard produce identical durable transitions. Concurrent versions conflict safely; failures restore actual state; reasons/history survive.
- Manual historical orders remain readable and distinct. If they lack a saved message, do not fabricate one or expose a generic WhatsApp action; label the capability unavailable until a real brief exists.
- Search/filter/pagination/counts/export obey permissions. CSV formula content is neutralized and exports contain no private object URLs or capabilities.
- Product/schema edits do not rewrite old orders. Drafts never appear publicly. Admin publication from one device becomes visible correctly on another; cache behavior cannot expose drafts/private data.
- Independent backup restores into an isolated destination with row/attachment-link reconciliation. Migration rollback preserves data; application rollback is not confused with database rollback.
- Cleanup uses approved exact scope, handles object-delete failures and retains truthful budget/audit metadata; attached-record retention follows owner policy.

### I3. Browser/device/content matrix

Cover desktop Chromium/Firefox/Safari where available, tablet portrait/landscape, real Android Chrome and iPhone Safari, plus responsive emulation with its limitation labelled. Include widths around 320/390/768/1024/1440px as useful representative cases, zoom/reflow, keyboard-only use, screen-reader spot checks, reduced motion, slow network, offline interruption, image/video failure and long localized/Unicode text. A real WhatsApp app-switch test is distinct from viewport emulation; stop before sending any test message unless explicitly authorized.

Capture home, each collection, representative long/short product details and every field family, bespoke form/review/receipt, editorial/policy families, menu/gallery dialogs, Studio list/Kanban/detail/editor/media/settings and key error states. Review every published instance's content/assets/options separately. Treat external-app behavior, browser rendering and database evidence as separate observations.

Existing commands retained for Phase 11: `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:preflight`, `npm run build`, `npm run test:runtime`, `npm run test:e2e`. Use the project's supported Node 22 and pinned dependency contract. Do not simply delete old tests because routes changed; replace obsolete demo expectations with meaningful new behavior. Report actual passes/failures/skips and attach commit/environment/date to evidence.

### I4. Analytics and monitoring

Recommended events: `product_viewed`, `customization_started`, `customization_completed`, `order_submitted` after durable core save, `whatsapp_redirected` for an attempted handoff, `whatsapp_reopened`, `order_copy_used`, `search_used`, `filter_used`; `contact_submitted` only if a genuine independent contact form exists. Event names describe website actions, never message delivery. Do not collect phone/email/name, notes, reference files/URLs, full message, receipt token or detailed free-text search data in analytics. Use minimal categorical data and disclose actual instrumentation. No general WhatsApp engagement system or paid analytics dependency.

Operational evidence is required even if optional analytics is deferred: sanitized application/API/database/upload/order-finalization failures, deployment errors and recovery actions. Use available free service visibility and a documented staff review/incident procedure. No promise of real-time alerts that have not been implemented. Establish rollback owner, known-good code/config, protected backups and recovery sequence before release.

## J. Commercial release gates

| Class | Gate | Required evidence |
|---|---|---|
| **BLOCKER** | Vercel commercial eligibility under the owner's constraints | Applicable verified permission/eligible arrangement; no assumed exception |
| **BLOCKER — RESOLVED** | Revised plan approval | Owner accepted revision 3.0 and instructed Phase 1 completion/publication; revision 3.1 records that decision without scope expansion |
| **BLOCKER** | Complete durable order and Studio path | Exact-candidate success/failure/idempotency evidence; no WhatsApp before save/message readiness |
| **BLOCKER** | Customer data and private references protected | Role/guest/receipt/private-file denial checks; no sensitive public/log exposure |
| **BLOCKER** | No unresolved Critical/High release findings | Readiness register with evidence, fixes and verified status |
| **BLOCKER** | Safe production transition | Environment identity, independent backup/restore and rollback proof; no destructive unknown migration |
| **REQUIRED BEFORE PRODUCTION** | All public/Studio/instance dispositions closed | 49-row revised register plus instance checks, redirects and held-content reasons |
| **REQUIRED BEFORE PRODUCTION** | Corrected WhatsApp scope everywhere | Source/route/copy audit; only saved-order Open/reopen/copy; no general integration |
| **REQUIRED BEFORE PRODUCTION** | No dummy or invented public content | Classified publication manifest; genuine facts/media; policy consistency |
| **REQUIRED BEFORE PRODUCTION** | Exact-commit formal QA | Commands and browser/device cases passed; remaining risks explicitly accepted only if nonblocking |
| **REQUIRED BEFORE PRODUCTION** | Operational/privacy readiness | Confirmed missing policy facts, retention/deletion controls, sanitized monitoring and responsible staff procedure |
| **REQUIRED BEFORE PRODUCTION** | SEO/accessibility/performance baseline | Published-only indexing/canonicals; private exclusion; usable accessible flows; measured baseline and resolved severe regressions |
| **RECOMMENDED** | Minimal non-PII funnel analytics | Actual disclosed implementation or explicit deferred status |
| **RECOMMENDED** | More real project photography and richer editorial | Genuine owner-approved evidence, no invented case studies |
| **OPTIONAL FUTURE ENHANCEMENT** | Longer or cross-device guest recovery | Separately reviewed privacy/security need; no customer account implied |
| **OPTIONAL FUTURE ENHANCEMENT** | Additional safe bulk operations/advanced catalogue presentation | Demonstrated operational need and scoped permissions |

Not optional backlog items: payment gateways, customer accounts, carts, general WhatsApp systems and automation remain excluded. Previously excluded MFA/passkeys, PDF quotation builder, enhanced finish-comparison module and private client-approval portal are not reintroduced by this plan.

## K. Owner decisions genuinely required

1. **Revised plan approval — resolved.** The owner accepted the complete plan, confirmed the order-only WhatsApp explanation, and instructed Phase 1 completion and GitHub publication. Do not request the same approval again.
2. **Hosting eligibility before release.** Current Vercel-only/free-only instructions remain unchanged. The plan needs applicable Vercel permission or a later explicit change of constraints; no purchase or other host is presumed.
3. **Confirm only missing operating-policy facts.** Exact retention for submitted inquiries/reference images; who handles access/deletion requests; any still-undocumented delivery/installation area/charges, custom-work cancellation/change terms and legal business details required for public policies. The previously approved supplied product/policy/image set remains approved. Review only specific gaps identified from actual records, not the entire catalogue again.
4. **Evidence for any newly proposed factual claim or real project.** No need to invent a portfolio to launch; use the held/empty disposition until real documentation exists. Similarly, custom options must reflect actual production capability.

Already resolved: pasted workflow is the WhatsApp authority; business number/phone/email/map are supplied; no payment/customer accounts; Vercel only; eight Kanban stages preserved; private references; customer manual Send; no blanket re-approval of all assets. Database credentials belong in ignored/provider configuration, never chat. Routine component, schema, error-state or refactoring choices do not need separate approvals within the accepted plan.

## L. Phase summaries and resumable progress

### L1. Current phase ledger

| Phase | Status for this revised plan | Evidence / next action |
|---|---|---|
| 0 | Complete within audit limits | Source/plan reconciliation, WhatsApp classification, read-only deployment listing, benchmark sampling; live database/runtime checks explicitly outstanding |
| 1 | Complete — approved | Master, reconciliation, progress, approval record and repository guidance finalized for work-branch publication |
| 2 | Complete — foundation and architecture | P2.1–P2.7; see PHASE-2-DATA-ARCHITECTURE.md, PHASE-2-MIGRATION-RUNBOOK.md and phase-2-environments.json. No migration applied. |
| 3 | Complete — shared design-system source | P3.1–P3.6; tokens, responsive header, dialogs, controls, Studio density, motion/static rules and shared WhatsApp copy; see PHASE-3-DESIGN-SYSTEM.md |
| 4 | Complete — catalogue/discovery source | P4.1–P4.6; all 120 product records reconciled; PHASE-4-CATALOGUE.md and phase-4-products.json |
| 5 | Complete — customization source | P5.1–P5.7; PHASE-5-CUSTOMIZATION.md and phase-5-schemas.json; bespoke durable save remains P6 |
| 6–9 | Planned; prior source preserved | Next P6.1; product/bespoke ownership/identity, atomic save and saved-message finalization |
| 10 | Planned | Full integrated commercial-readiness report and remediation |
| 11 | Planned | Formal final QA on exact candidate |
| 12 | Planned; eligibility unresolved | Main and eligible production release only after gates |

### L2. Phase 0 summary — 23 September 2026

**Objective:** reconcile actual code with corrected WhatsApp scope. **Completed tasks:** P0.1–P0.5; guide substitution resolved by owner; retained source/data/route baseline; actual versus absent WhatsApp features separated. **Files changed:** planning outputs only. **Database changes:** none. **Design changes:** proposals only; five reference sites and concrete Awwwards examples reviewed. **Content changes:** no public content edited. **Tests:** read-only source/document review, token contrast calculation and benchmark sampling; no formal app tests. **Issues:** runtime/database/production browser coverage not freshly proved; hosting unresolved. **Decisions:** pasted workflow authoritative, no generic WhatsApp, preserve existing eight stages. **Commercial risks:** section C. **Owner input:** revised approval and genuinely missing release facts. **Next phase:** Phase 1 delivered. **Resume point:** review P1.5.

### L3. Phase 1 initial-delivery record — before approval

**Objective:** provide one complete revised plan. **Completed tasks:** P1.1–P1.5 planning deliverables. **Files changed:** new master/reconciliation/progress Markdown in the current outputs folder; original plans and application repository unchanged. **Database changes:** none. **Design changes:** navy/forest roles, shared/page-specific blueprint and reference-derived requirements documented. **Content changes:** corrected scope and copy rules proposed; no live edits. **Tests:** document completeness/source traceability review only. **Issues:** implementation and release gates remain open. **Decisions:** new phases 0–12; future implementation starts from existing checkpoint, not a scaffold. **Commercial risks:** deployment eligibility and unverified integrated operation remain separate blockers. **Owner input:** approval of this revision. **Next phase:** Phase 2 after approval. **Resume point:** P2.1.

### L4. Update protocol after approval

**Phase 1 completion addendum — 23 September 2026:** The owner said the plan looked perfect, confirmed WhatsApp is only for saved order details, then instructed Phase 1 completion and pushing all latest updates to the named GitHub repository. **Status:** complete and approved. **Completed tasks:** P1.1–P1.5 and repository registration/publication preparation. **Files changed:** this approved master, reconciliation/progress delivery copies and repository copies; approval decision; AGENTS, PROJECT_STATE, CODEX_WORKFLOW and current checkpoint guidance. **Database changes:** none. **Design/content changes:** no new application edits; accepted specifications unchanged. **Tests:** document integrity, all 13 phase fields, 49 route/screen rows, 164 instance entries, sensitive-file exclusion and remote branch verification; no formal app QA. **Issues/commercial risks:** C01–C26 remain as recorded; hosting eligibility and runtime evidence unresolved. **Decisions:** this plan supersedes revision 2.5; saved-order-only WhatsApp, Vercel-only/free-only and deployment hold preserved. **Owner input:** no plan approval outstanding; only later specific policy/eligibility decisions. **Next phase/resume:** Phase 2, P2.1. Git publication is on `codex/whatsapp-order-experience`; main/production stay unchanged.

At the end of every phase and working session, append a dated master summary containing **Phase, Status, Objective, Completed Tasks, Files Changed, Database Changes, Design Changes, Content Changes, Tests, Issues, Decisions, Commercial Risks, Owner Input Required, Next Phase and Resume Point**. Evidence must identify commit/environment/date; “phase complete” alone is insufficient.

Maintain `IMPLEMENTATION_PROGRESS.md` with **Current Phase, Current Task, Completed, In Progress, Pending, Blocked, Owner Input Required, Files Changed, Database Changes, Testing Completed, Known Issues, Next Exact Task and Resume Instruction**. The accepted plan/progress paths are now registered in repository guidance; retain old documents as historical sources.

Before an output/context limit, save pending work and the exact next task, current branch/SHA, service state, unfinished command/session if any, and any migration receipt. Never expose secrets/customer data. A new chat reads the plan, progress, AGENTS and project state, verifies the current branch, and resumes the first incomplete task. It does not repeat research, approvals, seeding or migrations unless new evidence requires it.

Approval is recorded. It does not waive hosting eligibility, final QA, privacy or release requirements. Phase 1 completion/publication does not mean the Phase 2–12 application work has been executed.

### L5. Phase 2 completion — 23 September 2026

**Phase:** 2 — Foundation and data architecture. **Status:** complete within the approved architecture scope; migration and integration remain gated. **Objective:** extend the preserved source safely. **Completed Tasks:** P2.1 baseline/hold verified, new branch from merged main bdfd78f; P2.2 live read-only Preview/Production columns, constraints, indexes, counts and dashboard-role permissions; P2.3 versioned brief/message/consent/source contract and proposed DDL; P2.4 independent backup/restore and retention/deletion mapping; P2.5 inactive bespoke v1 registry and guest/reference boundaries; P2.6 environment isolation matrix and permitted local continuation; P2.7 schema/role/instance/coverage registers and rollback instructions. **Files Changed:** order-contract.ts, bespoke-schema.ts, phase2-schema-inspection.sql, phase2-order-contract.sql; Phase 2 architecture/runbook/environment/migration registers; master/progress/guidance/coverage/instance records. **Database Changes:** none; Preview has 16 tables, one storage-budget row and one existing session, all other inspected counts zero; Production has four original tables, all counts zero. These observations do not authorize deletion or remove the need for a fresh pre-write inventory. **Design Changes:** none; bespoke definition is inactive. **Content Changes:** no published copy/records changed. **Tests:** TypeScript compiler wiring passes under existing Node 22.23.2; document/contract/register consistency and sensitive-file checks; no lint/build/browser/constraint/restore tests or final QA claimed. **Issues:** current runtime lacks v2 readers/writer; local DB/Blob values masked; Production lacks the later migrations. **Decisions:** retain Neon HTTP atomic core and two-stage saved-message finalization; explicit legacy compatibility; no destructive down migration. **Commercial Risks:** Vercel Hobby hold, shared environment admin credentials, unverified runtime grants and pending recovery/privacy policy remain release gates. **Owner Input Required:** no plan approval; later specific backup custody/retention and hosting eligibility decisions only. **Next Phase:** 3. **Resume Point:** P3.1 on codex/phase-2-foundation; read current Git state because upstream merges may advance it.

### L6. Phase 3 completion — 23 September 2026

**Phase:** 3 — Shared design system. **Status:** P3.1–P3.6 source/specification complete; final integrated QA remains pending. **Objective:** refine preserved public/Studio components into a consistent readable system. **Completed Tasks:** token/font/component audit; forest/navy/ivory/bronze roles and grid; 84px/72px sticky header with 16px navigation; unified modal lock/focus lifecycle and native no-JavaScript navigation; controls/cards/fields/feedback focus and state styling; static/reduced-motion parity and Studio density; broad WhatsApp wording removed from shared footer/default metadata. **Files Changed:** tokens.css, shop header/dialog/feedback/frame/styles, Studio login/workspace/board styles, root layout/global anchor offsets; DESIGN-SYSTEM, PHASE-3-DESIGN-SYSTEM, coverage/master/progress/continuation and owner decision records. **Database Changes:** none. **Design Changes:** existing logo/local fonts/assets retained; no new dependency or paid service. **Content Changes:** shared footer and metadata only; drafts, catalogue/editorial records and saved messages preserved. **Tests:** Node 22.23.2 TypeScript compiler wiring passes; CSS parse, token contrast calculation, source/component/register consistency and preservation review. No lint/build/suites/browser/device/runtime QA executed; not TESTED. **Issues:** product-level content/behavior, message sequencing and Studio runtime proof remain in later phases; source contrast does not certify rendered accessibility. **Decisions:** continue existing source from Phase 2 PR #16 merge 85b476df358d9fb07c9a8ec07cc478da581138f4 on codex/phase-3-design-system; publish only source/sanitized records to GitHub. **Commercial Risks:** existing hosting eligibility, credentials/grants, backup/privacy and release gates unchanged; automatic deployment remains disabled. **Owner Input Required:** none for this phase; no repeat plan approval. **Next Phase:** 4. **Resume Point:** P4.1 — reconcile all 120 product IDs/slugs against actual publishable records. Git history identifies this source snapshot; verify current refs before continuing.

**Phase 3 publication receipt:** implementation commit 34989309c785ad72cb3f33af6db699f6951da9e1 pushed to codex/phase-3-design-system and verified against GitHub remote refs on 23 September 2026. Main remained 85b476df358d9fb07c9a8ec07cc478da581138f4. See phase-3-github-publication.json; this documentation-only receipt follows the implementation commit. No production deployment or database change.

### L7. Phase 4 completion — 23 September 2026

**Phase:** 4 — Product discovery and all-product presentation. **Status:** P4.1–P4.6 source complete; record activation/final QA pending. **Objective:** understandable responsive catalogue with truthful published-only presentation. **Completed Tasks:** 120 ID/slug/copy/schema/media inventories (84 furniture, 24 memory, 12 personal); published furniture-led home and distinct journeys with empty recovery; URL collection/category/material search, sorts, page-size/show-more/history; robust gallery and tier-specific care/category-first related pieces; exact canonical/legacy customization routing; explicit source-ready/held classifications. **Files Changed:** shop-discovery, shop-catalogue, catalogue browser/gallery, public image, shop site/styles, customization route; source inventory script/120-row matrix, instance/media/coverage registers, report/master/progress/decision/checkpoint. **Database Changes:** none; no fresh live visibility claim or publication. **Design Changes:** existing visual system/assets retained, compact filter controls and clear result/image/empty states. **Content Changes:** home/product handoff wording narrowed to saved order details and manual Send; reviewed product/candidate copy and drafts preserved. **Tests:** Node 22.23.2 TypeScript compiler wiring, source identity/copy/media hash reconciliation and CSS/source checks only; no lint/build/suites/browser/database/application QA. **Issues:** DP110 earrings and DP119 ring dish have broad ring-matching size fields assigned to P5.1; source-ready does not mean published or TESTED. **Decisions:** same-product published media required; no fixture image/data fallback or guessed URLs; preserve all existing identifiers. **Commercial Risks:** eligibility, credentials/grants, backup/privacy and deployment hold unchanged. **Owner Input Required:** none for Phase 4; no repeat plan approval. **Next Phase:** 5. **Resume Point:** P5.1 reconcile field families and actual capabilities. Branch codex/phase-4-catalogue starts at owner merge 47323c51a9c225cac0ee719203612bc579d5ede0 (PR #17); Git identifies the phase snapshot.

**Phase 4 publication receipt:** implementation a75d95bb662093564a6ff84b04583238a81b394d pushed to codex/phase-4-catalogue and independently matched against GitHub remote refs on 23 September 2026. Main remained 47323c51a9c225cac0ee719203612bc579d5ede0. See phase-4-github-publication.json; this documentation receipt follows the implementation commit. No database or production deployment changes.

### L8. Phase 5 completion — 23 September 2026

**Phase:** 5 — Product-specific and bespoke customization. **Status:** P5.1–P5.7 source complete; durable bespoke saving is P6 and final QA P11. **Objective:** collect the correct versioned brief with recoverable, accessible entry. **Completed Tasks:** explicit 120-product/27-family capability registry and 111 changed proposals, correcting DP110/DP119 ring sizing; shared stable field/condition/bounds validation and deliberate Studio draft apply; typed product/bespoke definitions and /commission/customize; contact/consent/private-reference/review/edit controls; tab-memory recovery, stale-schema reconciliation, stable request/upload identity and paused editing after uncertain save; real honeypot, upload progress and linked error summaries; honest unavailable bespoke service boundary. **Files Changed:** product capabilities/fields, shared schema/brief/definition validators, order form/tab draft memory/styles, schema API/custom route, legacy action validation/reference DELETE, Studio editor; source inventory/report/decision/master/progress/coverage/routes/guidance. **Database Changes:** none; no fresh read/write/migration/seed/publication. **Design Changes:** shared visual system retained; clearer steps/review/errors/upload states. **Content Changes:** form labels/help/service-state copy; historical candidate content unchanged. **Tests:** Node 22.23.2 TypeScript wiring, source-schema inventory/CSS/preservation checks only; no application QA or runtime proof. **Issues:** bespoke v2 writer and saved-message sequencing remain P6; reload/close loses tab memory; late-upload/deletion races require later reconciliation proof. **Decisions:** no silent schema migration or fake product/save; source template revision differs from durable published version. **Commercial Risks:** existing free-only/Vercel eligibility, credentials/grants, backup/privacy and deployment hold unchanged. **Owner Input Required:** none for this source phase. **Next Phase:** 6. **Resume Point:** P6.1 validation/ownership/request identity; follow Phase 2 backup/schema/environment gates before integration. Baseline main a007d0fb0b2cc05f4ce55e0f3ebff6d66f51c17f (PR #18), branch codex/phase-5-customization.

## M. Final recommendation

Continue the approved saved-order-only scope from the Phase 5 source checkpoint at P6.1. Preserve working database/Studio foundations; correct actual message sequencing, metadata, bespoke flow, copy and staff controls; prove the full platform before release. Do not remove legitimate order functionality merely to seek a Hobby-plan workaround.

The statement below applies to **this revised implementation**. Substantial earlier source work exists and is preserved; it has not been reset or falsely described as nonexistent.

PHASE 1 STATUS: COMPLETE — APPROVED

PHASE 2 STATUS: COMPLETE — FOUNDATION AND ARCHITECTURE; NO MIGRATION APPLIED.

PHASE 3 STATUS: COMPLETE — SHARED DESIGN-SYSTEM SOURCE; FINAL QA PENDING.

PHASE 4 STATUS: COMPLETE — PRODUCT DISCOVERY SOURCE; ACTIVATION AND FINAL QA PENDING.

PHASE 5 STATUS: COMPLETE — CUSTOMIZATION SOURCE; BESPOKE SAVE P6, FINAL QA P11.

NEXT ACTION:
Begin Phase 6 from task P6.1.

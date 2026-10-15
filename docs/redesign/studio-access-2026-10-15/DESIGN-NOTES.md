---
name: RivyaLivingArt Studio access surface
description: Source-extracted rounded access composition within the established contemporary material gallery identity.
colors:
  ocean: "#08283a"
  obsidian: "#080a0e"
  sapphire: "#164e6b"
  sapphire-hover: "#1d6389"
  champagne: "#b89b63"
  ivory: "#f4f1e9"
  stone: "#ddd6cb"
  muted: "#a9b4bc"
  control-border: "#78828c"
  input-surface: "#101c26"
  frame-border: "#b89b6359"
  error: "#fca5a5"
  artwork-caption: "#080a0ee8"
  artwork-caption-mobile: "#080a0edb"
typography:
  display:
    fontFamily: "var(--font-instrument), Georgia, serif"
    fontSize: "clamp(36px,3.5vw,52px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-.025em"
  body:
    fontFamily: "var(--font-body)"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "var(--font-body)"
    fontSize: "14px"
  action:
    fontFamily: "var(--font-body)"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.4
  note:
    fontFamily: "var(--font-body)"
    fontSize: "13px"
    lineHeight: 1.7
  success-title:
    fontFamily: "var(--font-instrument), Georgia, serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.2
rounded:
  frame: "28px"
  artwork: "22px"
  artwork-mobile: "16px"
  control: "12px"
  visibility: "10px"
  logo-backing: "4px"
spacing:
  outer: "clamp(16px,4vw,64px)"
  panel: "clamp(28px,4.5vw,72px)"
  form-gap: "18px"
  field-gap: "8px"
  input: "12px 16px"
  action: "12px 20px"
  logo-backing: "10px 14px"
components:
  button-primary:
    backgroundColor: "{colors.sapphire}"
    textColor: "{colors.ivory}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "{spacing.action}"
  button-primary-hover:
    backgroundColor: "{colors.sapphire-hover}"
  input:
    backgroundColor: "{colors.input-surface}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.control}"
    padding: "{spacing.input}"
  logo-backing:
    backgroundColor: "{colors.ivory}"
    rounded: "{rounded.logo-backing}"
    padding: "{spacing.logo-backing}"
---

# Design notes: Studio access

## Overview

15 October 2026. **Creative North Star: "Contemporary material gallery"**, carried forward from the established Rivya identity. This is a scoped source extraction of the Studio access extension, not a replacement visual world or root design authority. The owner-pinned rounded split-login reference governs this surface's composition; original logo assets, main palette and existing font families remain binding. The surface operates in **Operate** mode: safe sign-in and understandable next steps take priority.

The desktop form and inset material artwork share a rounded obsidian frame against ocean surroundings. Mobile keeps the artwork as a short banner and gives the form one readable column. Serif headings provide the brand voice; labels, help and actions remain restrained body typography. The existing Studio staff editor and its new request queue retain their own workspace styling.

Authority and context: [DIRECTION.md](DIRECTION.md), [PRODUCT.md](../../../PRODUCT.md), [Phase 3 design extraction](../../../experiments/redesign-phase3/DESIGN.md), [VISUAL-REVIEW.md](VISUAL-REVIEW.md) and [SETUP-AND-CONTINUATION.md](SETUP-AND-CONTINUATION.md). Frontmatter records actual scoped CSS values; implementation source remains authoritative. No root DESIGN.md or design sidecar was created or rewritten.

Source inspected: [login](../../../src/components/studio-login.tsx), [access shell](../../../src/components/studio/access-shell.tsx), [request form](../../../src/components/studio/access-request-form.tsx), [password form](../../../src/components/studio/access-password-form.tsx), [request queue](../../../src/components/studio/access-requests.tsx), [access styles](../../../src/components/studio/studio-access.module.css), [staff editor](../../../src/components/studio/staff-editor.tsx), [root tokens](../../../src/styles/tokens.css), [form actions](../../../src/app/studio/login/access-actions.ts) and [validation/acknowledgment](../../../src/lib/studio-access-validation.ts).

**Evidence boundary.** The independent review returns **ship** for public login, account request and recovery request visual design at local owner-review scope. It inspected seven supplied screenshots covering desktop, 390px and 320px public resting states, including paired mobile login captures. This documentation pass read that review and the source; it did not open a browser, independently review those screenshots, rerun authentication tests or certify admin queue appearance. Password redemption and dynamic states below are source observations. Reported build/runtime/security/preservation receipts remain in the continuation file, not newly executed checks. The detector launcher failed with `cache_directory_failed`; unavailable evidence is not a pass. Production, physical-device, assistive-technology and human acceptance are not certified.

The implementation handoff additionally reports localhost inspection of the final admin queue and approval dialog, with `test-results/studio-access/admin-queue-desktop.jpg`, `admin-review-desktop.jpg` and `admin-review-mobile.jpg`. It reports correct text encoding and an approval action disabled until the verification checkbox is selected; no browser approval or real credential change was performed. These are separate builder receipts, not evidence examined by this documenter or an expansion of the independent public visual review. The same handoff reports 21 HTTP flow, 30 isolated-database security, 350 unit, 403 runtime and 12 preflight checks passing; this documentation pass did not rerun them.

**Pre-existing documentation drift, preserved.** PRODUCT.md retains Phase 2-only authorization and disconnected-integration wording. The Phase 3 document retains its historical phase/release restrictions and explicit exclusion of Studio. The current Studio direction and checkpoint establish this later local extension; neither document was rewritten or used to infer authorization for a global redesign or production release. Root DESIGN.md is absent. The historical Phase 3 unresolved `--hairline` observation is not a verified border rule for this surface: access styles declare their own borders explicitly.

## Colors

The main palette matches root tokens exactly. Ocean is the surrounding canvas and artwork fallback; obsidian is the form frame. Ivory is primary reading text and the logo backing. Stone is the field-label and link color; muted supports descriptions, placeholders and secondary guidance.

Sapphire identifies the primary action and password-visibility hover; its existing brighter hover variant provides feedback. Champagne is the focus outline, caret, checkbox accent, selection background and translucent frame edge. Error copy uses the scoped error token. The input surface and artwork-caption alpha values are local supporting values, not new main brand colors. Success uses the existing neutral text and control rules rather than a separate green card.

**The Original Identity Rule.** Keep the original horizontal transparent logo on ivory, contained and without filtering or recoloring. The shell references `/brand/rivyalivingart-logo-horizontal-transparent.png` with intrinsic dimensions 410 by 116.

## Typography

Instrument Serif is the existing display family; the body variable resolves through local Inter subsets, Arial, Helvetica and sans-serif in root tokens. No font was introduced for this access surface. Frontmatter records the principal roles rather than inventing a global scale.

- The page heading is balanced, regular-weight serif with a 16px lower margin. At 640px and below it uses a fixed 38px size.
- Description copy uses 1.7 line-height, a 36ch maximum and a 30px lower margin, reduced to 24px on mobile.
- Labels are 14px; inputs inherit typography from their label context. Guidance is 13px with a 44ch maximum. Recovery and account-approval explanations remain readable body text.
- Artwork title uses regular serif at `clamp(30px,3vw,44px)` with 1.1 line-height and a 10ch maximum. Mobile uses 24px and removes that width limit. The secondary artwork caption is 12px/1.6, reduced to 11px on mobile.
- Forgot-password, account-request and website-return links use 14px body type. Error copy is 14px and permits wrapping anywhere for long messages.

## Layout

The canvas has a 100svh minimum and centers a frame of `min(1320px,100%)`. The desktop frame uses `minmax(0,1fr) minmax(0,1.05fr)` columns, with a minimum height of `min(820px,calc(100svh - 100px))`. The form panel centers its contents vertically. These are minimums, not fixed form heights; longer requests can grow naturally.

| Area | Desktop | Responsive treatment |
| --- | --- | --- |
| Frame | Two columns, clipped rounded edge | At 640px and below, one column, 22px radius, no minimum height |
| Outer canvas | Fluid padding from frontmatter | At 900px and below, 24px; at 640px and below, 14px and top alignment |
| Form panel | Fluid padding from frontmatter | At 900px and below, 32px; at 640px and below, 28px 24px |
| Logo | 190px wide, automatic height; backing lower margin 44px | At 900px and below, 160px wide and 32px lower margin; mobile margin 28px |
| Artwork | Minimum height 640px, inset 10px on top/right/bottom and zero on left | At 900px and below, 580px minimum; at 640px and below, moves visually first with 160px height, zero minimum and 8px top/side insets |
| Artwork caption | 36px padding; title and attribution side by side | At 900px and below, 24px padding and block layout; at 640px and below, side by side with 12px 18px padding |
| Very wide frame | Normal viewport-derived minimum | At 1700px and above, minimum height 850px |

Form fields use an 18px grid gap and an 8px label-to-control gap. The website-return link sits 32px below content, reduced to 24px on mobile. Account-request copy sits 26px below the form. Preserve the panel's solid reading surface; no form text overlays the image.

### Artwork provenance and fitting

The [approved Phase 2 media register](../modern-design-2026-10-13/phase2-media-register.json) identifies **Flow study**, original [Drive JPEG](https://drive.google.com/file/d/1RNN4QxbJXw9VsRrb9x3EMZ9Rtzkqfmxf/view), source ID `1RNN4QxbJXw9VsRrb9x3EMZ9Rtzkqfmxf`, 1920 by 1080, 229,943 bytes. Its recorded source SHA-256 is `53dfc87a74c50b6ca72a2e76e1d85df051afa01acfc434b26974f804e0cc81c8`. This is recorded provenance, not a fresh Drive download or rights investigation.

The 1440px WebP derivative at `experiments/redesign-phase2/media/texture-resin-flow-1440.webp` was copied to `public/media/studio-access/resin-flow.webp`. This documentation pass independently checked both local hashes: `b306f4bcdc8e3efab7ca24aef0ad704ecd4a24997d8b983996d29cf0e8ff235f`, matching the registered derivative. The access copy is 77,970 bytes. No new image generation or Drive write occurred.

The shell fills the art frame with `object-fit:cover` and `object-position:46% center`, with responsive image sizes and priority loading. This display framing does not edit the media register's original 50/50 focal records or any Studio crop. The image is an owner-supplied visualization/material study, not evidence of a customer or completed project. The register does not establish source-specific creator/permission evidence from the download; retain that provenance limit. The image has descriptive alt text and the aside is labeled as a material study, although its purpose is decorative brand atmosphere.

## Elevation & Depth

The access surface uses tonal layers, a fine frame border and an inset artwork rectangle. It declares no box shadow or backdrop blur. Near-opaque obsidian caption backing protects artwork text. Success feedback sits between two control-colored rules with 24px vertical padding rather than floating in a raised card.

Motion is limited to 160ms ease transitions for field border and primary-action background. The access subtree removes transitions when reduced motion is requested. There is no source-added parallax, entrance reveal or animation prerequisite to using the form.

## Shapes

The owner-pinned rounded frame and inset artwork are local composition decisions. Their frontmatter radii coexist with the established rectilinear public homepage; they do not redefine website-wide geometry. Inputs and primary buttons share the control radius. The password visibility button has its own smaller radius and the original logo keeps a modest rounded backing.

Controls and success separators use a one-pixel control-colored border; the outer frame uses its translucent champagne border. Overflow clipping belongs to the outer frame and artwork, while the panel and form allow long content to grow. The checkbox is a 20px native control with a nonshrinking box and a wrapping consent label.

## Components

### Shared access shell and navigation

Each access route uses one main landmark, an explicit page h1, and a section labeled by that heading. The main landmark has a programmatic focus target. The original logo returns home; a separate Back to the website link remains after each form. Links use a one-pixel underline offset 5px, becoming two pixels with ivory text on hover. The website-return link has a 44px minimum height. Forgot-password and account-request links have their own smaller declared minima (32px and 36px); do not describe every link as a 44px target.

### Fields, actions and feedback

Text/password inputs have a 50px minimum height. Primary actions have a 52px minimum height and a centered icon/text row where supplied. The password visibility control is 44 by 44px, with 52px input right padding to reserve its space. Its accessible label alternates Show password/Hide password, with pressed state and a reference to the controlled input.

Focus-visible uses a three-pixel champagne outline offset 4px throughout the access surface. Disabled controls use opacity .65 and a not-allowed cursor. Inputs change their border to champagne on hover; the primary hover applies only while enabled. Empty error regions are visually removed. These are source accessibility affordances, not keyboard, screen-reader or exhaustive contrast certification.

| Flow/state | Visible behavior and semantic contract |
| --- | --- |
| Sign-in, ready | Staff ID and password have explicit labels, required constraints and username/current-password autocomplete. Sign in to Studio remains the primary action; recovery and account request are secondary links. |
| Sign-in, pending | Form exposes `aria-busy`; inputs, visibility control and submit action disable; action reads Signing in… |
| Sign-in, unavailable | Missing configuration replaces credential controls with a setup status. Runtime unavailability or action error appears in an alert region. |
| Account/recovery request, ready | Name, Staff ID and contact are required; Staff ID accepts 3–80 allowed characters, with associated guidance. Explicit required consent authorizes administrator review of supplied details. |
| Request, pending/error | Controls disable and action reads Sending request…; validation, consent, throttling or temporary unavailability errors occupy the alert region. No account-existence result is shown. |
| Request, acknowledged | The form is replaced by Request received in a status region and a sign-in link. Shared acknowledgment asks the person to contact their administrator through the usual trusted channel, promises review only if eligible, and states no automatic email. It is not access approval. |
| Password, preparing/missing link | Initial client preparation uses a status message. Missing fragment token produces an alert telling the person to reopen the complete administrator link, including after refresh, and offers Request a new link. |
| Password, ready/pending | New password and confirmation use new-password autocomplete, required 16–200-character constraints and guidance. Save password becomes Saving password… with disabled controls. Copy explains 30-minute single-use links and previous-session sign-out. |
| Password, error/success | Invalid/expired/used/changed-access links, mismatch and throttling return actionable alert text. An uncertain save tells the person to try signing in before requesting another link. Success replaces the form with a status and a sign-in link; it does not auto-sign the person in. |

### Security UX and administrative request review

The public request surface must continue to distinguish a received request from an enabled account. Administrator-assisted recovery is the chosen workflow. The public form does not report whether a Staff ID exists. Submitted contact details are expressly unverified; the administrator must use an established contact or verify in person. No automatic email or external message is sent.

The staff editor embeds Account & password requests before the existing Staff list and access form, using incumbent workspace styles and dialog. Its queue explains editor defaults and owner-account hosting management, lists up to 100 open requests oldest first, and provides loading, empty, refresh and status feedback. The request review dialog requires explicit identity-verification confirmation before Approve & create link or Replace one-time link is enabled. Reject remains a separate decision. Busy state prevents repeated decisions.

Approval copy explains that a new account is reserved disabled and access begins only after the verified person sets a password. Recovery copy preserves role and cannot enable a disabled account. A newly issued private link appears in a read-only selectable field with IST expiry, Copy private link and Hide link controls. Clipboard failure offers manual copying. The interface explicitly says the link is shown once, replacement invalidates the previous link, and no message has been sent. If the mutation succeeded but refresh failed, feedback says the decision was saved and instructs the administrator to keep the link and refresh before another decision.

The password component reads the token from the URL fragment and removes that fragment from the address bar after mounting. The checkpoint records hashed token persistence, one-time redemption, 30-minute expiry, credential-version checks and session revocation; this extraction does not independently re-audit those backend guarantees. Preserve the distinction between these recorded security checks and source-observed UI messaging. Never reproduce real issued links, passwords or request contact details in design examples.

The existing staff editor still describes administrator/editor roles, owner credentials in secure hosting settings, password hashing and session revocation on access changes. Its review dialog retains before/after role and enabled-state summaries, and typed edits are retained on an unconfirmed save failure. This documentation does not extend the public visual ship disposition to those admin controls.

## Do's and Don'ts

- **Do** preserve original logo, exact main palette, current font families and the owner-pinned rounded access composition.
- **Do** keep sign-in primary, fields on solid backing, long forms naturally scrollable and help adjacent to the action it explains.
- **Do** preserve consent, generic acknowledgments, identity verification, manual trusted-channel sharing and honest mutation/refresh feedback.
- **Do** retain the registered asset lineage and distinguish display fitting from stored media/crop edits.
- **Do** keep the independent review, source observations, reported technical receipts and unperformed production/human/device tests clearly separated.
- **Don't** promote this surface's rounded geometry into a global design replacement or rewrite historical product/design artifacts as a side effect.
- **Don't** add reference-template trial offers, unsupported social sign-in, automatic messaging or claims that a received request grants access.
- **Don't** treat material artwork as a real customer/project photograph or a hash match as independent rights evidence.
- **Don't** deploy, publish, alter production schema or treat this local document/reviewer disposition as release authorization.

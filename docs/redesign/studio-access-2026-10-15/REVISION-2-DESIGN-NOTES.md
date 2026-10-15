---
name: Rivya Studio access revision 2
description: Scoped extraction of the full-image welcome and ivory access panel
colors:
  obsidian: "#080a0e"
  ocean: "#08283a"
  sapphire: "#164e6b"
  ivory: "#f4f1e9"
  champagne: "#b89b63"
  supporting-text: "#40535f"
  placeholder: "#54646b"
  control-border: "#7b8986"
  error: "#9c2929"
  visibility-hover: "#e2e5dd"
  secondary-hover: "#e7e7df"
typography:
  welcome:
    fontFamily: "var(--font-body)"
    fontSize: "clamp(48px,5.65vw,86px)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-.04em"
  heading:
    fontFamily: "var(--font-body)"
    fontSize: "clamp(36px,4vw,60px)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-.04em"
  body:
    fontFamily: "var(--font-body)"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  input:
    fontFamily: "var(--font-body)"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  panel: "26px"
  panel-mobile: "22px"
  action: "999px"
  brand: "3px"
spacing:
  outer: "22px"
  panel: "26px 32px 28px"
  form-gap: "21px"
  field-gap: "4px"
components:
  primary-action:
    backgroundColor: "{colors.sapphire}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.action}"
    padding: "12px 22px"
  primary-action-hover:
    backgroundColor: "{colors.ocean}"
  access-panel:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ocean}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel}"
---

# Studio access: revision 2 design notes

## Overview

15 October 2026. This is a source extraction of the owner's replacement reference: a full-image craft backdrop, large sans-serif welcome on the left and an opaque ivory access card on the right. [REVISION-2.md](REVISION-2.md) supersedes the rejected rounded dark split-panel direction. [DESIGN-NOTES.md](DESIGN-NOTES.md) and revision 1 visual approval are historical. The established contemporary material gallery identity and Operate priority remain: recognizable Rivya branding, readable controls and clear access decisions.

Sources: [shared shell](../../../src/components/studio/access-shell.tsx), [scoped styles](../../../src/components/studio/studio-access.module.css), [login](../../../src/components/studio-login.tsx), request/password forms in the same Studio directory, [root tokens](../../../src/styles/tokens.css), [PRODUCT.md](../../../PRODUCT.md) and the [media register](../modern-design-2026-10-13/phase2-media-register.json). Root PRODUCT.md retains historical Phase 2 scope wording; the current revision direction supplies this later local presentation scope. Global design files and their authority are preserved.

**Evidence boundary:** this pass inspected source and verified the local media hashes; it did not use a browser. The independent review handoff reported one field-boundary contrast issue at 2.90:1. Current source has the corrected `#7b8986` border, reported as 3.23:1 against ivory; the subsequent final handoff confirmed all six captures were refreshed and the reviewer inspected desktop-1408.jpg and mobile-390.jpg, resolving R2-01 with a ship disposition for local visual review. This is not a fresh rendered contrast audit or a final visual sign-off. Browser captures, physical-device checks, assistive-technology checks, owner acceptance and production readiness remain separate evidence.

## Colors

The exact original obsidian, ocean, sapphire, ivory and champagne values are retained. Their roles change locally: ivory is now the solid card and logo backing; ocean is card text and the backdrop fallback; sapphire is the primary action, links, caret and card focus outline. Champagne accents the Explore border, active navigation underline and text selection. Supporting text, placeholder, border, hover and error colors are scoped additions, not changes to the main brand palette. The panel explicitly uses `color-scheme:light`.

Inputs, secondary-action outlines and success separators share the corrected control-border token. Error copy uses dark red on ivory. Background text is ivory over the image scrim; its rendered legibility depends on the actual crop and is not established by the solid-color field-border calculation.

## Typography

All access headings now use the existing body family, which resolves to local Inter subsets, Arial, Helvetica and sans-serif. No font was added; the site's Instrument Serif family remains available elsewhere. The welcome is 600 weight, the card heading 500, with tight `-.04em` tracking. The welcome has a 10ch maximum on desktop. Card descriptions are 13px/1.6 with a 47ch maximum; welcome copy is 16px/1.6 with a 31ch maximum. Labels are 12px, input values 18px, placeholders 16px, actions 14px and small notes 11px/1.7 (12px inside a form). Success headings are 28px/1.2, weight 500.

## Layout

The canvas has a `100svh` minimum and 22px obsidian inset. Its image-backed frame has a `calc(100svh - 44px)` minimum, `36px clamp(32px,4vw,64px)` padding, a fluid 32–80px gap and `minmax(0,1fr) minmax(420px,.88fr)` columns. The left welcome stretches vertically, with the logo above, introduction in the middle and a small Private Studio signature below. The right card centers vertically and grows with its contents; no fixed card height is imposed. The form uses 21px gaps, reduced to 18px on mobile.

| Viewport | Implemented behavior |
| --- | --- |
| At least 1600px wide | Card capped at 620px; 32px 40px card padding; 80px frame gap; 72px navigation lower margin. |
| At most 1050px wide | Frame padding/gap 28px; right column minimum 370px; card padding 22px 26px; smaller welcome and vertical spacing. |
| At most 760px wide | No outer inset; frame becomes a natural vertical stack with 24px 20px padding and `100svh` minimum. Logo is 148px; welcome 48px; card heading 42px; card radius 22px. Signature is hidden. |
| At most 360px wide | Frame padding 20px 14px; welcome 41px; card heading 36px; card padding 18px 20px 24px; navigation gap 18px. |

Mobile intentionally places the welcome before the form. Login and especially request forms can extend below the first viewport and require ordinary page scrolling. There is no sticky card, height-specific compact mode or short-screen fitting guarantee. A tall full-page capture can show the whole composition but does not prove that the submit action is visible on a physical phone without scrolling. The backdrop fills the entire growing frame, so `cover` crop changes with document height; desktop and mobile captures must be interpreted at their recorded dimensions.

**Media lineage:** the backdrop is the existing **Making study**, a supplied visualization of a person polishing a blue and gold resin bowl, sourced from [the registered Drive item](https://drive.google.com/file/d/1VK6Y7T8LDJi5eEGFBFjXg26VNNVGYyVh/view). The register records a 1536×1024 original, 136,116 bytes, SHA-256 `138776d5f9a02ec85a613ce32d892643aed732d356779bfd36792c0b89347cd5`. Its 1440px WebP derivative was copied from `experiments/redesign-phase2/media/maker-hands-1440.webp` to `public/media/studio-access/making-study.webp`. Both local copies independently matched the registered derivative SHA-256 `62495bbf349d12443f40874860e1fbf5d92e2c1d0cfa4ccbe60d20f9f129bbdd`; the access copy is 63,538 bytes.

The image uses `fill`, `sizes="100vw"`, priority loading and `object-fit:cover`, positioned at `50% 42%` on desktop and `45% top` on mobile. It is decorative (`alt=""`), not an identified employee, customer or completed project. These display positions do not alter registered focal records or Studio crops. Source-specific creator/permission evidence remains unestablished by the historical download. No generation, fresh Drive download, Drive write or Studio media reassociation occurred in this documentation pass.

## Elevation & Depth

The opaque ivory card is separated from the full-frame image by tone and shape, with no shadow or backdrop blur. Desktop uses a horizontal ocean scrim, `linear-gradient(90deg,rgba(8,40,58,.78),rgba(8,40,58,.2) 58%,rgba(8,40,58,.24))`; mobile uses uniform `rgba(8,40,58,.68)`. Motion is limited to 150ms ease transitions for field borders and primary-action backgrounds. Reduced-motion preference removes transitions within the access subtree.

## Shapes

The image-backed frame has square outer corners; the ivory card has the scoped rounded corners in frontmatter. Primary, secondary and Explore actions are pills. Fields are transparent with a one-pixel bottom rule and no corner radius. The eye control is circular, 44×44px. The original horizontal logo is contained at 180px desktop width on a modest ivory backing, without recoloring or filtering; these access shapes do not redefine global component geometry.

## Components

The shell supplies a focusable main landmark and one card h1. The large welcome is a paragraph, preserving the card heading as the page title. The logo and Explore Rivya link return home. A Studio access navigation group provides Request an account and Sign in; matching titles currently set the appropriate link's `aria-current`. Primary sign-in remains the central action, with recovery as a nearby text link and account request as an outlined pill. Historical introductory text inside `.join` remains in the markup at `font-size:0`; the action link has its own visible type size.

Inputs have explicit labels, 50px minimum height and a sapphire hover rule. Primary actions have 48px minimum height; the secondary pill has 46px; the password toggle is 44px. Account navigation has 32px minimum height and Forgot password has 38px, so not every link is a 44px target. Focus-visible is a 3px sapphire outline offset 4px on the card, changing to ivory in the welcome area. Disabled controls use opacity .6 and a not-allowed cursor. Hover shades and text underlines provide additional feedback.

| State | Source-observed behavior retained |
| --- | --- |
| Login ready/pending | Staff ID and password retain required constraints and username/current-password autocomplete. Visibility toggles Show password/Hide password, pressed state and controlled-input reference. Pending exposes `aria-busy`, disables controls and reads Signing in…. |
| Setup/unavailability/error | Missing configuration replaces credential controls with a setup status. Temporary unavailability/action errors use an alert; empty alerts are hidden. |
| Account/recovery request | Existing required name, Staff ID, contact and consent remain. Pending disables controls; errors use alerts; acknowledgment replaces the form with a status and sign-in link. Receipt is not account approval. |
| Password setup | Existing preparation, missing-link, ready, pending, error and success states remain. New-password fields retain 16–200-character constraints. Success offers sign-in; it does not automatically sign the person in. |

Backend authentication, administrator approval, recovery, roles, routes and database records are unchanged by this presentation revision. Existing consent, generic request acknowledgments, identity verification and manual trusted-channel link sharing remain the contract. There is no automatic email, social sign-in or remember-me function. This extraction neither repeats historical security fixtures nor certifies backend guarantees; the original implementation evidence remains in [SETUP-AND-CONTINUATION.md](SETUP-AND-CONTINUATION.md).

## Do's and Don'ts

- **Do** follow the replacement reference, exact original brand colors/logo and the existing Inter family for this access surface.
- **Do** keep controls on the opaque ivory panel and let long forms grow naturally; review narrow and short viewports independently of tall full-page captures.
- **Do** retain the making-study provenance and distinguish source extraction, independent review, final captures and owner acceptance.
- **Don't** reuse revision 1 visual approval for this composition, identify the visualization as a real maker, or change global design files as a side effect.
- **Don't** infer production authorization from this local document. Production migration/grants, an authorized PR and deployment remain separately pending; no database writes or content publication were performed here.

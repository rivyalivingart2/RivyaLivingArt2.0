# Studio access visual finish review

15 October 2026. Fresh independent review of supplied local screenshots and source. No browser use, implementation edits, deployment, or publication performed by this reviewer.

## 1. Evidence validity and coverage

Inspected the latest supplied Metarist reference, PRODUCT.md, DIRECTION.md, the Impeccable craft floor, and the five named public access component/style files. No root DESIGN.md is present; the specific owner-pinned direction supplies this review's composition authority.

All seven required images in `test-results/studio-access/` contain valid, legible rendered content:

- `login-desktop.jpg`: desktop framed composition, sign-in form, account request and recovery links, artwork and website return.
- `login-mobile.jpg` and `login-mobile-bottom.jpg`: complementary first and lower 390-width viewport views covering the complete login surface. Their overlap confirms continuity; neither is a black compositor frame. The paired evidence is sufficient, with no full-page recapture requested.
- `login-320.jpg`: narrow first viewport, including both credential fields, password visibility control, recovery link and primary sign-in button.
- `request-desktop.jpg` and `request-mobile.jpg`: account request form and approval guidance; mobile supplies the complete lower content.
- `recovery-mobile.jpg`: complete administrator-assisted recovery request, consent, next-step explanation and return navigation.

Rendered structure, copy, palette and control styles are consistent with the inspected source. This is visual evidence for the supplied public resting states, not independent execution of the authentication lifecycle. Dynamic errors, pending/success states and password-link redemption were inspected in source only. Admin queue screenshots were not supplied to this reviewer and are outside this disposition. Physical phones, assistive technology, human acceptance and production behavior are not certified.

The implementation handoff reports one Impeccable detector attempt failed with Windows `cache_directory_failed`. That is unavailable detector evidence, not a detector pass; this review does not claim otherwise.

## 2. Brief and direction fidelity

The desktop result follows the newer Metarist composition's useful hierarchy: rounded outer frame, a generous left form area and a decisive inset right image. The retained Rivya logo asset, navy surroundings, ivory type/logo surface and gold detail translate the reference into the existing identity. The owner-pinned rounded frame takes precedence over generic corner guidance.

Mobile adapts the image into a short material banner above a single readable form column. It preserves the image-led character while keeping the actual fields on a solid surface. The local artwork path agrees with DIRECTION.md's existing Drive-derived material study; it is presented as artwork and carries no invented customer or project claims. Byte provenance was supplied by the implementation handoff and was not independently rehashed in this visual review.

Existing sign-in remains the primary action. Forgot password and account request are plainly named and discoverable. Account approval and administrator-assisted recovery are explained directly, including the absence of automatic email. Unsupported trial offers and social sign-in from the reference are absent. The composition respects Operate mode and the local-only release boundary.

## 3. Craft and usability assessment

The artwork is large enough to carry the desktop composition; the form has ample width and separation. Instrument Serif supplies a recognizable display voice without making field labels decorative. The logo, heading, explanation, credentials and primary button have a clear reading order. Text and form alignment remain coherent across the supplied desktop, 390 and 320 captures, without visible horizontal overflow, clipped controls or overlapping copy.

Mobile sign-in and recovery remain readable. At 320 the primary sign-in control is visible in the first capture, while secondary account access continues naturally below the fold. Longer request and recovery pages grow vertically; the complete mobile captures show the consent, submission, explanation and return links without truncation. Scrolling here does not obstruct the task.

Source provides explicit labels, credential autocomplete, 50px input minimum height, a 52px primary action, a 44px password visibility button, a 3px gold focus-visible outline, disabled/pending behavior, alert/status semantics, and reduced-motion handling. These are source observations, not a keyboard or screen-reader certification. Representative declared color pairs meet the text contrast floor: secondary copy on the main panel 9.38:1, placeholder on input 8.17:1, ivory primary-button text 7.96:1 and labels on the panel 13.73:1. These calculations do not constitute an exhaustive accessibility audit.

## 4. Material findings

None within the reviewed public login, account-request and recovery-request visual scope. No material defect warrants an implementation fix, recapture or rebuild on the supplied evidence. Unreviewed admin and dynamic-state coverage remains explicitly outside this conclusion rather than being counted as passed.

## 5. Final disposition

**ship** — Public login, account-request and administrator-assisted recovery-request visual design, for local owner review only. This disposition does not authorize a release and does not extend to the admin queue, password-redemption runtime behavior, production state or human/device acceptance.

## Supplemental screenshot review

15 October 2026, subsequent evidence. The original review and its scope above remain intact. Independently inspected six additional valid images from the final local build: `login-current-browser.jpg`, `admin-queue-desktop.jpg`, `admin-review-desktop.jpg`, `admin-review-mobile.jpg`, `reset-missing-link-mobile.jpg` and `reset-form-mobile.jpg`. No browser interaction or account grant was performed by this reviewer.

The current-browser login retains the balanced form/artwork composition at the reported 1408 × 932 viewport, with no visible horizontal clipping. The administrator queue clearly distinguishes request kinds, supplied contact information and review actions. Its fictional QA records are explicitly labelled. The review dialog separates the identity-confirmation checkbox from the decision buttons; the disabled approval control is visibly distinct. On mobile the text and actions wrap within the dialog without overlap or clipping. A focused confirmation dialog is appropriate for this access decision.

The mobile missing-link state gives a readable explanation and recovery action. The password form places the two fields, passphrase guidance and Save password action in a clear vertical order, with expiration/session guidance immediately below. It shares the reviewed public visual language. The handoff states an unissued dummy token revealed the form and no real credentials were entered; these captures establish layout, not successful password redemption.

Inspected the updated `access-password-form.tsx`: the same-tab fragment-change handler reads the replacement token, removes the fragment and cleans up its listener. The builder reports verifying same-tab reopening without reload. This supplemental review did not independently execute that behavior and does not turn that report into a runtime certification.

Material visual findings: none in the six supplied supplemental states. **ship** — Supplemental current-browser login, desktop administrator request queue, desktop/mobile pre-approval review dialog, and mobile missing-link/password-entry layouts, for local owner review only. Enabled approval, generated-link delivery, completed redemption and other unsupplied dynamic states remain outside this visual disposition; release, native-device, assistive-technology and human acceptance remain separate.

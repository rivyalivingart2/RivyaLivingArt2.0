# Independent security and release review

Review date: 19 October 2026. Audit evidence interval: 17–19 October 2026.

Reviewed the local working-tree changes on `codex/rivya-master-audit`, whose checkpoint HEAD was `40907ff0906fa279f2314b4d9653fdbed5606537`. That checkpoint preserves the earlier acceptance work; it is not the released production SHA. Production baseline evidence from 17 October refers to `66e82ef04f76b8460654bab4329ccbadfb47f28e`. This reviewer made no production requests that mutate state, no package installations, no application edits and no release operation. The only authored file is this report.

The current owner's audit instruction takes precedence over older release authorization in historical checkpoints: local fixes and verification are authorized; push, merge, deployment, CMS publication and production data changes require fresh explicit authorization.

## Decision

The dependency findings warranted a local patch update before treating the candidate as review-ready. The coordinator has now updated the existing Next.js and Sharp versions and refreshed the affected source-map dependency. The final production-dependency audit receipt contains **zero reported vulnerabilities**. The full dependency audit still reports **one unresolved development-tool advisory propagated across five packages**. This is not a clean full dependency audit and must remain disclosed.

No additional concrete security or functional regression was established in the reviewed application diff. The previously identified PostgreSQL year-zero date edge is now rejected in source and has a focused HTTP regression assertion. Final post-update build, application tests and browser results belong in `FINAL-VERIFICATION.md`; this independent source review does not substitute for those executions or establish production readiness.

## Dependency findings and actual source applicability

The original `test-results/rivya-master-audit/npm-audit.json` reported three vulnerable production dependency packages: one critical and two high severity. Package severity is an upstream classification; it is not proof that the public website was exploited or that every advisory is reachable in this application.

| Dependency / advisory | Source exposure assessment | Local action and status |
|---|---|---|
| Next.js 16.3.5 — Node `ImageResponse` remote code execution, [GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j) | The advisory requires attacker-controlled SVG values reaching Node `next/og` image generation. Searches of application source found no `ImageResponse`, `next/og` or `@vercel/og` usage. This specific prerequisite was not found. | Existing Next version updated to 16.3.8, beyond the 16.3.6 patch. **VERIFIED_FIXED locally by package/lock inspection and production-only audit.** No production rollout claimed. |
| Next.js image-optimization SSRF, [GHSA-cjq9-62q9-8jv4](https://github.com/advisories/GHSA-cjq9-62q9-8jv4) | The advisory describes attacker-controlled allowlisted remote URLs. `next.config.ts` defines only three local image path patterns and no `images.remotePatterns`. The advisory explicitly excludes that configuration from this particular attack. | Next 16.3.8 contains the upstream patch. **VERIFIED_FIXED locally at dependency level.** |
| Other Next advisories in the original audit: cache isolation/poisoning, development MCP and metadata-image route behavior | No `draftMode`, `use cache`, dynamic Open Graph/Twitter image handlers or `generateImageMetadata` usage was found in the inspected application. Production is hosted on Vercel; this review did not reproduce advisory-specific cache behavior or inspect hosting internals. | The original audit's affected Next ranges end before 16.3.8. The final production-only audit no longer reports them. Do not convert absence of a matching source pattern into a universal security certification. |
| Sharp 0.35.4 / librsvg, [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) | This is a relevant decoder boundary. `src/app/api/inquiry/reference/route.ts` checks a caller-supplied MIME label, then calls `sharp(input).metadata()` before checking the actual decoded format. `src/lib/editorial-media-processing.ts` also probes metadata before restricting the detected format. JPEG/PNG/WebP-only UI labels therefore do not prove that untrusted bytes cannot reach an SVG decoder. The upstream RCE impact additionally depends on Linux/runtime conditions; those production binary details were not verified and no exploit was attempted. | Sharp updated to 0.35.5 with its updated prebuilt native dependencies. **VERIFIED_FIXED locally at dependency level.** Preserve upload limits and decoded-format checks. A local Windows build alone cannot establish the deployed Linux binary version. |
| `source-map-js` 1.2.1 indexed-map denial of service, [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | No direct application import or endpoint accepting source-map input was found. The package is transitive, including CSS tooling. Runtime attacker-controlled map parsing was not demonstrated. | Compatible transitive lockfile update to 1.2.2, without adding a new direct application dependency. **VERIFIED_FIXED locally by lockfile and audit.** |
| `braces` 3.0.3 deeply nested-pattern denial of service, [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) | Development-only chain: `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`. No direct `src` imports were found. Installed Next lint `get-root-dirs` obtains its pattern from maintainer-controlled `context.settings.next.rootDir`; the repository's ESLint config does not set it. No runtime exposure was established. | **DEFERRED: upstream patch unavailable.** Public npm metadata on the review date identifies 3.0.3 as the latest/highest published release; the official advisory lists no patched version. Do not downgrade the matched Next lint config to 14.2.35 simply to satisfy npm's suggested resolution. |

For the unresolved `braces` advisory, retain trusted repository lint configuration and do not feed customer-controlled patterns into lint tooling. A malicious repository/configuration is a separate development-environment trust boundary. A future patch can be evaluated when actually published; this report creates no monitoring automation or upstream contribution.

## Minimal patch compatibility

Public npm registry metadata was read directly without installing packages in this review. The source versions selected by the coordinator are the smallest documented patch-line changes needed for the original receipt, rather than a framework minor/major migration:

| Package | Previous | Candidate | Registry compatibility observation |
|---|---|---|---|
| `next` | 16.3.5 | 16.3.8 | Node >=20.9.0; React/React DOM peer ranges accept installed 19.3.0. |
| `eslint-config-next` | 16.3.5 | 16.3.8 | Matched to framework; accepts ESLint >=9 and TypeScript >=3.3.1. Existing ESLint 9.39.1 and TypeScript 5.9.3 qualify. |
| `sharp` | 0.35.4 | 0.35.5 | Node >=20.9.0, compatible with the project's pinned Node 22 runtime. |
| `source-map-js` | 1.2.1 | 1.2.2 | Compatible with existing `^1.2.1` transitive requirements; no new direct dependency. |

Registry references: [Next 16.3.8](https://registry.npmjs.org/next/16.3.8), [matched lint config](https://registry.npmjs.org/eslint-config-next/16.3.8), [Sharp 0.35.5](https://registry.npmjs.org/sharp/0.35.5), [source-map-js 1.2.2](https://registry.npmjs.org/source-map-js/1.2.2), and [braces release metadata](https://registry.npmjs.org/braces). Version compatibility is necessary but does not replace executable tests.

The original receipt is preserved. Current receipts inspected by this reviewer:

- `test-results/rivya-master-audit/npm-audit-production-final.json`: no vulnerabilities; total 0.
- `test-results/rivya-master-audit/npm-audit-full-final.json`: five high-severity package entries, all arising from the one unresolved `braces` development chain; critical 0.
- `test-results/rivya-master-audit/npm-audit-interim.json`: intermediate evidence before source-map resolution; not the final production result.

## Application diff review

| Area | Independent review finding |
|---|---|
| Follow-up changes | The SQL branch still preserves the inquiry's actual assignee for follow-up-only actions and retains session, assignment, current-version and Origin checks. The audit note now describes the date change rather than implying reassignment. |
| Calendar validation | Shape, finite parsing and exact ISO round-trip reject impossible dates before the PostgreSQL cast. Explicit rejection of `0000-` closes the reviewer-observed mismatch between JavaScript ISO support and PostgreSQL date validity. The focused test includes invalid dates, non-leap February, year zero, unchanged version, valid leap day and clearing the date. |
| Editorial localization | Effective language is resolved from the original reviewed revision before localization changes its review fingerprint. Missing, incomplete, unreviewed and stale Hindi/Gujarati translations retain the original English fallback. Public projection still strips unpublished/private fields. This changes rendering metadata, not publication or review decisions. |
| Saved preview semantics | Callers now pass the original saved revision into the shared localized renderer. Captured dependencies remain captured; the change does not authorize fetching future drafts into an exact saved revision. |
| Structured data | The extracted JSON-LD renderer preserves escaping of `<` and the focused test retains an administrator-supplied script-boundary case. Metadata language follows the content actually rendered. No new executable markup path was introduced. |
| Unsaved editor navigation | Modified clicks preserve normal open-in-new-tab/window behavior. The explicit return link owns its confirmation, avoiding the prior duplicate prompt; normal discard cancellation and saving-state blocking remain in place. Browser stress findings remain a separate performance/navigation issue. |
| Motion and presentation | Low-memory eligibility and pause handling are narrow changes. They introduce no database, authentication or external-service behavior. Pagination and the focusable comparison region are presentational/accessibility changes. |
| E2E isolation | Normal execution requires an explicit isolated-QA flag, Node 22, existing local QA configuration and the known PostgreSQL module. The owned server uses fixed loopback port 4173 with reuse disabled. Fixture discovery runs a read-only transaction and verifies exact database/role/address/port identity. It does not seed production records. |
| Evidence hygiene | Raw screenshots, traces, audit receipts and local fixture descriptors are under ignored `test-results/`. Documentation should contain sanitized observations and source links, not credentials, private records or authenticated deployment URLs. |

The newly added language boundaries are not a claim of complete multilingual assistive testing. Source-only residual candidates include FAQ entries, collection document copy, related editorial cards and story-rail labels whose language attributes are not independently verified here. These are pre-existing coverage candidates, not established regressions from the current fix.

## Release limits

The dependency patch is local. Previously deployed versions remain unchanged until a separately authorized release and exact deployment verification. A release reviewer must use the final candidate's package lock, build and test receipts, not the older 17 October dependency set or a previously passing deployment.

The unresolved development-tool advisory must remain in the issue register. The settled production access-request panel failure, released slow-mobile performance observations, any still-reproducible Studio navigation stress stall, missing physical-device/native-reader evidence, unavailable field observations, and private-storage/erasure test limits remain separate gates. This review neither closes them nor recommends changing production data to make them disappear.

Review outcome: **local dependency remediation verified; independent diff review found no additional concrete regression; full release approval remains withheld pending the coordinator's final post-patch verification and the owner's fresh release authorization.**

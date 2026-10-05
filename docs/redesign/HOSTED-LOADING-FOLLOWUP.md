# Hosted collection loading follow-up

5 October 2026. The owner's pending-work request includes release and hosted performance. PR39 released database/CSS/preview/SEO improvements; PR40 released the responsive opening-image preload. Both exact production deployments reached READY. Production indexing is enabled and private/Preview exclusions remain intact.

## Measurements

| Candidate | Mobile collection LCP | Performance | Report |
|---|---:|---:|---|
| After PR39 | 3.545s | 88 | https://pagespeed.web.dev/analysis/https-www-rivyalivingart-com-collectible-design/p5am6z0vv1?form_factor=mobile |
| After PR40 | 3.376s | 90 | https://pagespeed.web.dev/analysis/https-www-rivyalivingart-com-collectible-design/5k9i0g4kfn?form_factor=mobile |

After PR40, the observed image breakdown is 200ms response, 490ms discovery, 1470ms loading and 10ms render delay. Lighthouse's simulated LCP differs from the sum of observed trace parts. There is no field data. Neither result meets the 2.5s target.

Bounded HEAD checks on the same 828px, quality-60 opening image:

| Response | Time | Encoded bytes | Cache |
|---|---:|---:|---|
| AVIF first check | 2172ms | 30,202 | MISS |
| AVIF repeated check | 211ms | 30,202 | HIT |
| WebP first check | 883ms | 72,430 | MISS |

These are sequential diagnostics from this workstation, not controlled codec benchmarks or phone measurements; upstream caches may have warmed. They identify a large cold-response cost and an explicit transfer-size trade-off.

## Focused change

- Use the standard WebP optimization output to reduce first-request encoding work. Existing responsive sizes and quality values still apply. WebP may transfer more bytes than AVIF; verify the overall hosted result rather than treating the format as a guaranteed improvement.
- Allow the private Blob CDN to reuse immutable editorial source bytes. These UUID/variant objects are created with `allowOverwrite:false`. The public route still validates the current published database record before reading the blob; credentials and public/private access boundaries are unchanged.
- Customer references use separate storage/retention behavior and are untouched. No source image, crop, product association, publication record or contact/social setting is modified by this code.

Next documents the cold-encoding/size trade-off in its [Image API](https://nextjs.org/docs/app/api-reference/components/image#formats). Vercel documents the authenticated CDN layer for [private Blob storage](https://vercel.com/docs/vercel-blob/private-storage). External CSS remains cacheable across pages; experimental global inline CSS was reviewed but not enabled.

The PR records exact checks, head/merge and production deployment, followed by the hosted result. A source revert restores the prior format/cache option without touching database content. Full C6 remains partial until hosted targets and the separately unavailable human/device/field evidence are satisfied.

## Editorial checkpoint

Twelve pages / 472 Hindi-Gujarati values are current and published. Seven page records and 36 articles remain English fallback. The renewed Studio sign-in requested after expiry is still needed for further preview/publication. Independent native-reader, full crop/content sign-off and a legitimate business inquiry cannot be inferred from the release.

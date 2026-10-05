# Enable indexing with the next approved release

The owner answered: “Enable indexing with the next approved release.”

Prepare public metadata and sitemap validation now. At the next explicitly approved code release, set `SITE_INDEXABLE=true` for Production only, deploy that exact reviewed candidate, then verify the production robots response, sitemap, canonical URLs and indexing metadata. Vercel environment changes affect new deployments, not existing ones.

Keep Preview and Studio/private/inquiry/customization/search/saved-piece destinations non-indexable. Only validated published pages, products and genuinely approved portfolio records belong in the sitemap. Do not submit customer data or activate analytics as part of indexing.

The current follow-up does not authorize another Git push, PR merge or deployment. PR38 completed the previous release instruction. The current live noindex setting remains until that next release. Search-engine inclusion is not guaranteed by enabling crawling.

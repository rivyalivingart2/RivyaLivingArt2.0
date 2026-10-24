import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const dir='docs/restoration/exact-legacy-2026-10-21';
const parse=file=>{const rows=readFileSync(file,'utf8').trim().split(/\r?\n/).map(line=>[...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m=>m[1].replaceAll('""','"')));return rows.slice(1).map(row=>Object.fromEntries(rows[0].map((key,i)=>[key,row[i]])));};
const csv=rows=>[Object.keys(rows[0]),...rows.map(row=>Object.values(row))].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
const actions=parse(dir+'/inventory/legacy-actions.csv');
const groups={
 'auth-public':['src/lib/studio-auth.ts; src/app/studio/login/access-actions.ts','PROTECTED_CURRENT_EQUIVALENT','4','Do not transfer auth secrets; verify owner-approved account recovery against current security.'],
 blog:['src/lib/content-model.ts; src/components/studio/content-editor.tsx','EXISTING_EDITOR_NEEDS_TAXONOMY_AND_BULK_PARITY','4','Keep article IDs/routes, drafts and translation review states.'],
 'catalog-fill':['proposed import-run/conflict/tombstone stores','ADDITIVE_BACKEND_REQUIRED','3,4','No build-time filling; stage explicit bounded preview and conflict plan.'],
 'catalog-mirror':['proposed confirmed catalogue projection','ADDITIVE_BACKEND_REQUIRED','3,6','Only confirmed reviewed selection; not every scraped or published row.'],
 categories:['src/lib/catalogue-extra.ts; category metadata extension','EXISTING_DERIVED_CATEGORIES_NEED_METADATA','3,4','Preserve memberships; add mapped images/descriptions/order.'],
 'custom-pages':['src/lib/landing-model.ts; src/components/studio/landing-editor.tsx','EXISTING_EDITOR_ADAPT_BLOCKS','4','Keep valid documents and URL identity; add old-only block behavior.'],
 demo:['tools/exact-legacy/local-guard.mjs','ISOLATED_FIXTURE_EQUIVALENT','1,7','No production seeding or demo publication.'],
 faqs:['src/lib/editorial-record-model.ts; src/components/shop/faq-browser.tsx','EXISTING_EDITOR_ADAPT_BULK','4','Answers require source/policy; retain sorting and conditional states.'],
 'form-options':['src/lib/bespoke-schema.ts; src/lib/field-schema.ts','EXISTING_VALIDATION_EXTEND_OPTIONS','3,4','Preserve conditional fields and current saved form versions.'],
 helpers:['src/lib/studio-auth.ts; src/lib/studio-db.ts','INTERNAL_HELPER_NOT_STANDALONE_FEATURE','4','Permission and transaction helper behavior must be enforced at each entry point.'],
 import:['proposed legacy import preview/parser/ledger service','ADDITIVE_BACKEND_REQUIRED','3,4','Current import status screen is not an importer.'],
 inquiries:['src/lib/inquiry.ts; src/lib/studio-orders.ts','EXISTING_PRIVATE_WORKFLOW_MAPPING_REQUIRED','3,4','Never copy private reference uploads into public media or claim delivery from save.'],
 media:['src/lib/editorial-media-model.ts; src/components/studio/media-editor.tsx','EXISTING_MEDIA_ADAPT_RELATIONSHIPS','3,4','Preserve originals/crops/privacy and approved usage associations.'],
 'nav-menus':['src/lib/site-settings-model.ts','EXISTING_SETTINGS_ADAPT_NAVIGATION','2,4','Keep valid current URLs and protected business destinations.'],
 order:['src/lib/inquiry.ts; src/components/shop/order-form-entry.tsx','EXISTING_SECURE_MANUAL_WHATSAPP_EQUIVALENT','4','Persistence precedes prepared message; customer presses Send.'],
 'page-sections':['src/lib/presentation-model.ts; src/lib/content-model.ts','EXISTING_PRESENTATION_ADAPT_SECTION_TYPES','2,4','Current populated content stays authoritative.'],
 pages:['src/lib/content-model.ts','EXISTING_EDITOR_ADAPT_PAGE_FIELDS','3,4','Keep snapshots/revisions and valid page URLs.'],
 portfolio:['src/lib/editorial-record-model.ts; src/components/shop/legacy-project-document.tsx','TEMPLATE_PORTED_EXTRA_FIELDS_REQUIRE_MAPPING','2,3,4','Concept versus genuine classification; no invented customer evidence.'],
 products:['src/lib/shop-model.ts; src/components/studio/catalogue-editor.tsx','EXISTING_EDITOR_EXTRA_BULK_AND_PROVENANCE_REQUIRED','3,4','Current IDs/URLs/prices/variants/media protected; additive field conflicts explicit.'],
 public:['proposed consent-aware subscriber/workshop handlers','ADDITIVE_BACKEND_REQUIRED','3,4','Do not submit production newsletter forms during QA or invent subscribers.'],
 publish:['src/app/api/studio/content/route.ts; current revision/publication stores','EXISTING_SNAPSHOT_EQUIVALENT_VERIFY_PER_TYPE','4','Publication is an explicit separate action; respect hidden and erased states.'],
 research:['src/components/studio/conditional-workspace.tsx; proposed legacy research store','SEPARATE_RESEARCH_WORKFLOW_REQUIRED','3,5','Current editorial research does not satisfy scraped product research.'],
 search:['src/lib/shop-discovery.ts; src/components/shop/catalogue-browser.tsx','EXISTING_DISCOVERY_EXTEND_OLD_FILTERS','4','Unsupported old facets need mapping rather than silently resetting them.'],
 settings:['src/lib/site-settings-model.ts; src/lib/business-settings-model.ts','PROTECTED_CURRENT_SETTINGS_EXTEND','3,4','Keep logo, contacts and main color; new-only values remain valid.'],
 shop:['src/lib/shop-discovery.ts; src/components/shop/product-gallery.tsx','EXISTING_PRODUCT_DISCOVERY_ADAPT','2,4','Current product selection, gallery and saved-piece behavior retained.'],
 'site-copy':['src/lib/shared-copy-model.ts','EXISTING_TRANSLATION_COPY_ADAPT','3,4','Traceable title proposals; preserve populated copy and review states.'],
 'site-images':['src/lib/editorial-media-model.ts','EXISTING_USAGE_MAP_REQUIRED','3,4','Preserve image IDs, crops, original bytes and relationship privacy.'],
 starter:['tools/exact-legacy/local-guard.mjs','ISOLATED_FIXTURE_ONLY','1,7','Old production bootstrap behavior is replaced with explicit isolated preparation.'],
 testimonials:['src/lib/editorial-record-model.ts','EXTEND_GENUINE_IMAGE_RATING_CONTRACT','3,4','Unknown ratings remain unknown; never use import defaults as review evidence.'],
 users:['src/lib/studio-staff.ts','PROTECTED_CURRENT_STAFF_EQUIVALENT','4','Keep current access approval/session model; no old password/hash import.'],
};
const rows=actions.map(row=>{const group=row.source.split('/').at(-1).replace('.ts','');const contract=group.startsWith('scraper-')?['proposed isolated scraper stores and old src/lib/scraper adapters','ADDITIVE_PIPELINE_REQUIRED','3,4,5','Phase 2 registry is read-only reference only; jobs, quality, shortlist, analytics and embedding actions need bounded authenticated services.']:groups[group];assert.ok(contract,group);return {...row,destination:contract[0],status:contract[1],phase:contract[2],resolution:contract[3],verification:'SOURCE_ACCOUNTED_FOR_NOT_END_TO_END_VERIFIED'};});
assert.equal(rows.length,156);writeFileSync(dir+'/inventory/action-parity.csv',csv(rows));
const entities=parse(dir+'/inventory/legacy-entities.csv'),routes=parse(dir+'/inventory/legacy-routes.csv');
assert.equal(entities.length,45);assert.equal(routes.length,98);
for(const row of entities)assert.ok(row.destinationCandidate&&row.contract&&row.treatment);
for(const row of routes)assert.ok(row.destinationCandidate&&row.reason);
writeFileSync(dir+'/inventory/phase1-accounting.json',JSON.stringify({sourceCommit:'2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6',routesAccounted:routes.length,entitiesAccounted:entities.length,actionsAccounted:rows.length,fieldInventory:575,allHaveDestinationOrExplainedGap:true,recordMatching:'Source namespace + immutable source ID -> explicit destination ID; no title-only joins',sourceRows:'UNAVAILABLE_READ_ONLY_CONNECTION_REQUIRED',sourceExportAttempt:'Correct Vercel project returned DATABASE_URL metadata but no value; existing secret access cannot be assumed',databaseWrites:0,status:'DISCOVERY_ACCOUNTED_FOR_WITH_EXPLICIT_ACCESS_AND_RUNTIME_GAPS'},null,2)+'\n');
console.log('Accounted for 98 routes, 45 entities and 156 actions; source rows remain unavailable.');

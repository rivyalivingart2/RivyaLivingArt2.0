import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Offline artifact builder only. No database, Studio, Drive, browser, or network writes.
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../../..');
const migration = path.join(repo, 'docs/redesign/old-design-migration-2026-10-08');
const read = async p => JSON.parse(await readFile(p, 'utf8'));
const hash = x => createHash('sha256').update(typeof x === 'string' || Buffer.isBuffer(x) ? x : JSON.stringify(x)).digest('hex');
const save = (name, data) => writeFile(path.join(here, name), JSON.stringify(data, null, 2) + '\n', 'utf8');
const sourceFile = path.join(here, '../article-review.json');
const sourceBytes = await readFile(sourceFile);
const source = JSON.parse(sourceBytes.toString('utf8'));
const rules = {};
for (const name of (await readdir(here)).filter(n => /^corrections-.*\.json$/.test(n)).sort()) {
  for (const [id, rule] of Object.entries((await read(path.join(here, name))).records)) {
    assert(!rules[id], `Duplicate rules for ${id}`);
    rules[id] = rule;
  }
}
const expectedIds = source.records.filter(r => !['DB001', 'DB010'].includes(r.id)).map(r => r.id);
assert.deepEqual(Object.keys(rules).sort(), expectedIds.sort());
await mkdir(path.join(here, 'draft-imports'), { recursive: true });
const records = [], diffs = [], imports = [];
for (const original of source.records.filter(r => rules[r.id])) {
  const rule = rules[original.id];
  const english = original.fields.map(({ path, source }) => ({ path, source }));
  assert.equal(hash(english), original.sourceHash, `English source hash ${original.id}`);
  const fields = structuredClone(original.fields);
  for (const locale of ['hi', 'gu']) {
    for (const [find, replacement] of [...(rule.replace?.[locale] || [])].sort((a, b) => b[0].length - a[0].length)) {
      let hits = 0;
      for (const field of fields) {
        if (field[locale].includes(find)) {
          hits += field[locale].split(find).length - 1;
          field[locale] = field[locale].split(find).join(replacement);
        }
      }
      assert(hits > 0, `Unmatched correction ${original.id}/${locale}: ${find}`);
    }
    for (const [key, replacement] of Object.entries(rule.override?.[locale] || {})) {
      const field = fields.find(f => f.path === key);
      assert(field, `Unknown path ${original.id}/${key}`);
      field[locale] = replacement;
    }
    const packet = { documentId: original.id, locale, fields: Object.fromEntries(fields.map(f => [f.path, f[locale]])) };
    assert.deepEqual(Object.keys(packet.fields), english.map(f => f.path));
    for (const field of fields) {
      assert.equal(typeof field[locale], 'string');
      assert(field[locale].trim().length > 0);
      assert(!field[locale].includes('\uFFFD'), `Replacement character ${original.id}/${field.path}`);
      assert((locale === 'hi' ? /[\u0900-\u097f]/ : /[\u0a80-\u0aff]/).test(field[locale]), `Target script ${original.id}/${field.path}`);
      const old = original.fields.find(f => f.path === field.path)[locale];
      // These source articles have explicit ASCII quantities only in DB035.
      assert.deepEqual(field[locale].match(/\d+(?:\.\d+)?/g) || [], old.match(/\d+(?:\.\d+)?/g) || [], `Numeric drift ${original.id}/${field.path}/${locale}`);
      if (old !== field[locale]) diffs.push({ id: original.id, path: field.path, locale, english: field.source, before: old, after: field[locale] });
    }
    const filename = `draft-imports/${original.id}.${locale}.json`;
    await save(filename, packet);
    imports.push({ file: filename, documentId: original.id, locale, fieldCount: fields.length, sha256: hash(packet), sourceHash: original.sourceHash, reviewed: false, publication: 'NOT IMPORTED OR PUBLISHED' });
  }
  assert.deepEqual(fields.map(({ path, source }) => ({ path, source })), english);
  records.push({
    id: original.id, route: original.route, title: english[0].source,
    sourceHash: original.sourceHash, sourceFieldCount: fields.length,
    sourceSnapshotDate: '2026-10-06', currentStudioSourceMatch: 'NOT RECHECKED; required before applying',
    reviewType: 'Codex AI assistant full source/target meaning pass', reviewedAt: '2026-10-12',
    reviewScope: 'Every English field compared with the existing Hindi and Gujarati drafts; corrections address meaning, ambiguity and terminology. Native idiom and independent acceptance remain open.',
    independentNativeReview: { hi: false, gu: false }, reviewStatusForStudio: 'NEEDS REVIEW',
    publication: 'LOCAL CANDIDATE ONLY; no Studio save or publication',
    notes: rule.notes,
    changedValues: diffs.filter(d => d.id === original.id).length,
    candidateFieldsHash: hash(fields), fields,
  });
}
assert.equal(hash(await readFile(sourceFile)), hash(sourceBytes));
const ledger = records.map(({ fields, ...r }) => ({ ...r, reviewedFieldPaths: fields.map(f => f.path) }));
const pages = await read(path.join(here, '../page-review.json'));
const media = await read(path.join(repo, 'docs/editorial-production/m9/media-manifest.json'));
const manifest = await read(path.join(repo, 'docs/editorial-production/m9/content-manifest.json'));
const files = (await readdir(path.join(repo, 'docs/editorial-production/m9/batches'))).filter(n => n.endsWith('.json'));
const content = (await Promise.all(files.map(f => read(path.join(repo, 'docs/editorial-production/m9/batches', f))))).flat();
assert.equal(content.length, 480);
assert.equal(new Set(content.map(x => x.id)).size, 480);
const portfolios = content.filter(x => x.editorial?.kind === 'portfolio');
const testimonials = content.filter(x => x.editorial?.kind === 'testimonial');
assert.equal(portfolios.length, 120);
assert.equal(testimonials.length, 120);
for (const r of portfolios) {
  assert.equal(r.editorial.classification, 'concept');
  assert(JSON.stringify(r).includes('Unbuilt educational concept; no customer or completed-project claim.'));
  assert(JSON.stringify(r).includes('No customer, site, fabrication or installation is being reported.'));
}
for (const r of testimonials) {
  assert.equal(r.editorial.classification, 'fictional');
  assert(r.sections.some(s => s.heading === 'Fictional sample — not customer feedback'));
  assert(JSON.stringify(r).includes('It is not a quote from a customer, evidence of a commission, or a rating.'));
  assert(!r.headerImage && !r.image, `Fictional reviewer image ${r.id}`);
  assert(!r.rating && !r.stars && !r.reviewRating, `Invented rating ${r.id}`);
}
const drive = await read(path.join(here, 'drive-evidence.json'));
const freshness = await read(path.join(migration, 'm10-language-freshness-evidence.json'));
assert.equal(freshness.historicalSourceSnapshotSha256, hash(sourceBytes));
assert.equal(freshness.scope.articles, records.length);
const summary = {
  at: '2026-10-12', status: 'ASSISTANT MEANING PASS COMPLETE FOR REMAINING 34; INDEPENDENT NATIVE AND RIGHTS ACCEPTANCE OPEN',
  translation: {
    newAssistantReviewedArticles: records.length,
    priorAssistantReviewedArticles: ['DB001', 'DB010'],
    totalAssistantReviewedArticlesAcrossReceipts: 36,
    sourceFieldsReviewedThisPass: records.reduce((n, r) => n + r.sourceFieldCount, 0),
    targetValuesComparedThisPass: records.reduce((n, r) => n + r.sourceFieldCount * 2, 0),
    correctedValues: diffs.length,
    correctedArticles: new Set(diffs.map(d => d.id)).size,
    importCandidates: imports.length,
    independentNativeApproved: 0,
    sourceFileSha256: hash(sourceBytes),
    englishSourceHashes: 'ALL MATCH; exact source strings preserved',
    studioWrites: 0, publications: 0,
    protectedPageTranslationsEdited: 0,
    pageReviewSource: { records: pages.records.length, fields: pages.records.reduce((n, r) => n + r.fields.length, 0), status: 'Prior assistant page evidence retained; no independent review inferred' },
    freshness: 'Separate read-only production verification at ' + freshness.at + ' matched all 34 draft and published English sources. All 68 current Hindi/Gujarati target maps were empty; 924 historical target values are not currently stored there. This packet remains local and unreviewed. Recheck source and target absence immediately before any later draft import.',
    freshnessEvidence: { report: 'M10-LANGUAGE-FRESHNESS.md', receipt: 'm10-language-freshness-evidence.json', at: freshness.at, summary: freshness.summary },
    limitations: 'AI meaning review is fallible and not independent fluent-human or native-reader acceptance. Natural idiom, terms and regional preference still need that review.'
  },
  m9: {
    sourceDocumentsChecked: content.length, uniqueIds: new Set(content.map(r => r.id)).size,
    conceptsWithClassificationAndNoCustomerClaim: portfolios.length,
    fictionalSamplesWithDisclosureAndNoRatingOrPortrait: testimonials.length,
    publishedEntries: 480, publicationEvidence: 'release-m5-m9-evidence.json, superseding historical draft-only manifests',
    newHiGuTranslations: 0, languageBehavior: '480 English documents retain explicit Hindi/Gujarati English fallback',
    mediaReferences: media.length,
    mediaRightsPending: media.filter(x => x.ownerRightsApproval === 'Pending').length,
    mediaCropPending: media.filter(x => x.cropApproval === 'Pending').length,
    linkedManifestEntries: manifest.length,
    originalCustomerProjectsOrReviewsCreated: 0,
    note: 'Static disclosure checks are not a full second editorial reading of all 62,611 M9 words. Publication authorization is established; provenance and per-use approval evidence are separate.'
  },
  drive: { folderId: drive.folder.id, currentChildren: drive.folder.children.length, queries: drive.searches, evidence: 'docs/editorial-translations/m10-followup/drive-evidence.json', conclusion: drive.conclusion },
  factualBoundary: 'English originals, policy obligations/retention, business/contact facts, product claims, media/crops and orders are not modified. No new promise, customer, quote, rating, license or reviewer evidence is invented.',
  remaining: [
    { id: 'LANG-NATIVE', requires: 'Actual independent Hindi and Gujarati reviewers: identity, date, exact source/candidate hashes, whole-text corrections and explicit approval. No such receipt exists in examined evidence.' },
    { id: 'LANG-CURRENT', requires: 'Source freshness was verified separately at the recorded timestamp; all 68 target maps were empty. Recheck source hashes and target absence immediately before any later draft import, then inspect exact saved previews. Historical before-values are not a current production target baseline. No article candidate imported in this task.' },
    { id: 'MEDIA-PROVENANCE', requires: 'For 21 M9 media references: creator or rights holder, source/creation evidence, allowed public use, restrictions and any necessary third-party consent. Owner instruction to use supplied images is not independent provenance proof.' },
    { id: 'MEDIA-CROP', requires: 'Actual owner acceptance tied to every public slot/desktop/mobile crop; prior visual inspection is preserved but no approver receipt invented.' },
    { id: 'FACTUAL', requires: 'Real materials, dimensions, prices, availability, delivery, installation, preservation and performance claims must be backed by applicable owner/technical records. Current educational concepts and fictional samples do not establish these claims.' }
  ],
  verification: { sourceHashes: true, exactFieldCoverage: true, nonEmptyTargetScript: true, existingNumericValuesPreserved: true, historicalSourceUntouched: true, conceptDisclosures120: true, fictionalDisclosures120: true, fictionalRatingAndPortraitAbsent120: true },
  evidence: { ledger: 'docs/editorial-translations/m10-followup/review-ledger.json', diff: 'docs/editorial-translations/m10-followup/correction-diff.json', candidates: 'docs/editorial-translations/m10-followup/candidate-review.json', imports: 'docs/editorial-translations/m10-followup/import-manifest.json' }
};
await save('candidate-review.json', { at: '2026-10-12', nativeApproval: false, publication: 'LOCAL DRAFT CANDIDATES ONLY', records });
await save('review-ledger.json', ledger);
await save('correction-diff.json', diffs);
await save('import-manifest.json', imports);
await save('verification.json', summary);
await writeFile(path.join(migration, 'm10-language-rights-evidence.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ ...summary.translation, staticDisclosureChecks: summary.verification, mediaReferences: media.length, driveChildren: drive.folder.children.length }, null, 2));


import {test} from 'node:test';
import assert from 'node:assert/strict';
import {contentListDocument} from '../src/lib/content-list-document.ts';
import {homeCandidate} from '../src/lib/homepage-model.ts';

test('content list retains search identities without leaking snapshots into selectable summaries',()=>{
 const full=structuredClone(homeCandidate);full.homeSnapshot={schemaVersion:1,dependencies:[{key:'private-test-marker'}]};full.translations={hi:{title:'Example'}};
 const before=structuredClone(full),summary=contentListDocument(full);
 assert.deepEqual(full,before);assert.equal(summary.id,full.id);assert.equal(summary.route,full.route);assert.equal(summary.title,full.title);
 assert.deepEqual(summary.sections.map(s=>[s.heading,s.group]),full.sections.map(s=>[s.heading,s.group]));
 assert.equal(summary.homeSnapshot,undefined);assert.equal(summary.translations,undefined);assert.equal(summary.homepage,undefined);
 assert.ok(summary.sections.every(s=>s.paragraphs.length===0));
 summary.sections[0].heading='Different local summary';assert.notEqual(full.sections[0].heading,summary.sections[0].heading);
});

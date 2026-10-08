import {test} from 'node:test';
import assert from 'node:assert/strict';
import {contentListDocument,contentListDraftState} from '../src/lib/content-list-document.ts';
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

test('content list reflects a newly saved translation even when its previous status was aligned',()=>{
 const published=structuredClone(homeCandidate),document={...published,translations:{hi:{fields:{title:'बदला हुआ शीर्षक'}}}};
 const saved={document,published,version:2,draftStatus:'Aligned'};
 assert.equal(contentListDraftState(saved),'Changes pending');
 // The reduced list intentionally omits translations, so its server comparison must survive.
 const compact={...saved,document:contentListDocument(document),published:contentListDocument(published),detailPending:true,draftStatus:'Changes pending'};
 assert.deepEqual(compact.document,compact.published);assert.equal(contentListDraftState(compact),'Changes pending');
});

test('content list clears a stale pending label after publication and handles new drafts',()=>{
 const document=structuredClone(homeCandidate);
 assert.equal(contentListDraftState({document,published:structuredClone(document),version:3,draftStatus:'Changes pending'}),'Aligned');
 assert.equal(contentListDraftState({document,published:null,version:0}),'Source candidate');
 assert.equal(contentListDraftState({document,published:null,version:1}),'Unpublished draft');
});

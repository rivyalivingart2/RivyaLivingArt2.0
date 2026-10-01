import {test} from 'node:test';
import assert from 'node:assert/strict';
import {supportedSavedPreview} from '../src/lib/content-preview-model.ts';
import {baselineContent} from '../src/lib/content-model.ts';

test('saved preview accepts every registered page and article plus durable new article identities',()=>{
 for(const document of baselineContent)assert.equal(supportedSavedPreview(document.id),true,document.id);
 assert.equal(supportedSavedPreview('article:14fc9a32-be67-4d67-878a-8564e110f4f2'),true);
});
test('saved preview rejects paths, arrays, unregistered pages and malformed article ids',()=>{
 for(const value of [null,undefined,{},['page:imprint'],'/imprint','../../private','page:unknown','article:'+ '-'.repeat(36),'article:14fc9a32-be67-4d67-878a-8564e110f4f2/other'])assert.equal(supportedSavedPreview(value),false);
});

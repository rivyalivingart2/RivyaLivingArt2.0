import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeCsv} from './csv-file-summary.mjs';
test('counts logical records with quoted embedded lines, commas and doubled quotes',()=>{
 assert.deepEqual(summarizeCsv('\ufeffid,copy\r\n1,"one, two\nthree"\r\n2,"a ""quote"""\r\n'),{records:2,columns:2,headers:['id','copy'],nonconformingRows:0});
});
test('accounts for trailing empty cells, blank lines and malformed row widths',()=>{
 assert.deepEqual(summarizeCsv('id,copy\n\n1,\n2\n3,yes,extra'),{records:3,columns:2,headers:['id','copy'],nonconformingRows:2});
});
test('refuses truncated or invalid quoting instead of reporting false recovery counts',()=>{
 assert.throws(()=>summarizeCsv('id,copy\n1,"unfinished'),/Unclosed/);
 assert.throws(()=>summarizeCsv('id,copy\n1,"closed"invalid'),/Unexpected/);
});

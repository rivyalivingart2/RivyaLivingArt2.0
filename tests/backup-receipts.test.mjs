import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,readdirSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname,resolve,basename} from 'node:path';
import * as receipts from '../scripts/operations/backup-receipts.mjs';
test('same-day backups, verification retries and older readbacks preserve the latest verified archive',()=>{
 const dir=mkdtempSync(join(tmpdir(),'rivya-receipts-'));
 try{
  const morning={backupCreatedAt:'2026-10-03T02:00:00.000Z',verifiedAt:'2026-10-03T02:01:00.000Z',archiveSha256:'a'.repeat(64),remoteFileId:'synthetic-a'};
  const later={...morning,backupCreatedAt:'2026-10-03T08:00:00.000Z',archiveSha256:'b'.repeat(64),remoteFileId:'synthetic-b'};
  receipts.saveVerifiedReceipt(dir,morning);receipts.saveVerifiedReceipt(dir,later);
  assert.equal(readdirSync(dir).filter(p=>p.endsWith('-receipt.json')).length,2);
  assert.deepEqual(receipts.saveVerifiedReceipt(dir,{...later,verifiedAt:'2026-10-03T09:00:00.000Z'}),later);
  receipts.saveVerifiedReceipt(dir,morning);
  assert.deepEqual(JSON.parse(readFileSync(join(dir,'latest-verified.json'),'utf8')),later);
  assert.throws(()=>receipts.saveVerifiedReceipt(dir,{...later,archiveSha256:'c'.repeat(64)}),/identity conflicts/);
  assert.throws(()=>receipts.saveVerifiedReceipt(dir,{...later,backupCreatedAt:'../../invalid'}),/Invalid/);
  assert.equal(readdirSync(dir).some(p=>p.endsWith('.lock')||p.endsWith('.tmp')),false);
 }finally{assert.equal(dirname(resolve(dir)),resolve(tmpdir()));assert.ok(basename(dir).startsWith('rivya-receipts-'));rmSync(dir,{recursive:true,force:true});}
});

/** LOCAL OPERATOR JOURNAL only. Never application/Netlify record authority.
 * One exclusive owner-only file, fsynced append-only entries and strict replay.
 * A crash lock or partial/corrupt append is quarantined, never auto-expired. */
import {createHash} from 'node:crypto';
import {open,lstat,unlink} from 'node:fs/promises';
import {join} from 'node:path';
import {canonicalArtifactJson} from '../../src/lib/google-workspace/record-codec.ts';
import {createPrivateRecoveryDirectory,verifyPrivateRecoveryDirectory,writePrivateRecoveryFile,assertRecoveryPath} from './local-recovery-files.mjs';
import {verifyPrivateFilePermissions} from './private-file.ts';
import {SourceDocumentMigrationError} from './source-document-migration.mjs';
import {checkSourceDocumentSignal,SourceDocumentDeadlineError} from './source-document-deadline.mjs';

const fail=code=>{throw new SourceDocumentMigrationError(code);};
const sha=text=>createHash('sha256').update(text,'utf8').digest('hex');
const json=canonicalArtifactJson;
const header=json({format:'rivya-local-source-document-journal-v1',scope:'LOCAL_OPERATOR_JOURNAL'});
const MAX_BYTES=16*1024*1024;
const validKey=key=>typeof key==='string'&&/^sd_[a-f0-9]{64}$/.test(key);
const phase=phase=>['registration','verified'].includes(phase);
function validateValue(key,kind,value){
  if(!validKey(key)||!phase(kind)||!value||value.operationId!==key||value.format!==`rivya-source-document-${kind==='registration'?'intent':'verified'}-v1`||Buffer.byteLength(json(value))>12000)fail('INVALID_JOURNAL_ENTRY');
  return value;
}

export async function openLocalSourceDocumentJournal({mode,directory,create=false}){
  if(mode!=='local-operator'||typeof create!=='boolean')fail('INVALID_CONFIGURATION');
  const root=create?await createPrivateRecoveryDirectory(directory):await verifyPrivateRecoveryDirectory(directory);
  const path=join(root,'document-operations.jsonl'),lockPath=join(root,'document-operations.lock');
  await assertRecoveryPath(path);await assertRecoveryPath(lockPath);
  let lockOwned=false,handle,closed=false,quarantined=false,queue=Promise.resolve();
  try{
    // Exclusive file creation rejects a live or abandoned lock alike. The
    // operator must investigate a stale lock; there is no timer-based takeover.
    try{await writePrivateRecoveryFile(lockPath,Buffer.from('LOCAL_OPERATOR_JOURNAL\n'));lockOwned=true;}catch{fail('JOURNAL_LOCKED');}
    if(create)await writePrivateRecoveryFile(path,Buffer.from(header+'\n'));
    await verifyPrivateFilePermissions(path);
    handle=await open(path,'r+');
    const opened=await handle.stat();
    const replay=async()=>{
      const actual=await lstat(path),stats=await handle.stat();
      if(actual.isSymbolicLink()||actual.dev!==opened.dev||actual.ino!==opened.ino||stats.size<1||stats.size>MAX_BYTES)fail('JOURNAL_CORRUPT');
      const bytes=Buffer.alloc(stats.size);let offset=0;
      while(offset<bytes.length){const read=await handle.read(bytes,offset,bytes.length-offset,offset);if(read.bytesRead===0)fail('JOURNAL_CORRUPT');offset+=read.bytesRead;}
      const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
      if(!text.endsWith('\n'))fail('JOURNAL_CORRUPT');
      const lines=text.slice(0,-1).split('\n');if(lines[0]!==header||lines.length>10001)fail('JOURNAL_CORRUPT');
      const entries=new Map();let previousSha256=sha(header),sequence=0;
      for(const line of lines.slice(1)){
        let value;try{value=JSON.parse(line);}catch{fail('JOURNAL_CORRUPT');}
        if(json(value)!==line||Object.keys(value).sort().join(',')!=='entry,previousSha256,sequence,sha256'||value.sequence!==++sequence||value.previousSha256!==previousSha256||!value.entry||Object.keys(value.entry).sort().join(',')!=='key,phase,value')fail('JOURNAL_CORRUPT');
        const {key,phase:kind,value:stored}=value.entry;
        validateValue(key,kind,stored);
        if(value.sha256!==sha(json({sequence,previousSha256,entry:value.entry}))||entries.has(key+':'+kind))fail('JOURNAL_CORRUPT');
        entries.set(key+':'+kind,stored);previousSha256=value.sha256;
      }
      if((await handle.stat()).size!==stats.size)fail('JOURNAL_CORRUPT');
      return {entries,sequence,previousSha256,size:stats.size};
    };
    await replay();
    const serialized=work=>{const result=queue.then(async()=>{
      if(closed)fail('JOURNAL_CLOSED');if(quarantined)fail('JOURNAL_OUTCOME_UNKNOWN');
      try{return await work();}catch(error){
        if(!['ABORTED','TIMEOUT','JOURNAL_CONFLICT','JOURNAL_CAPACITY'].includes(error?.code))quarantined=true;
        if(error instanceof SourceDocumentMigrationError||error instanceof SourceDocumentDeadlineError)throw error;fail('JOURNAL_UNAVAILABLE');
      }
    });queue=result.catch(()=>{});return result;};
    const checkSignal=checkSourceDocumentSignal;
    return Object.freeze({scope:'LOCAL_OPERATOR_JOURNAL',
      read(key,kind,signal){return serialized(async()=>{checkSignal(signal);if(!validKey(key)||!phase(kind))fail('INVALID_JOURNAL_ENTRY');return (await replay()).entries.get(key+':'+kind)??null;});},
      putIfAbsent(key,kind,value,signal){return serialized(async()=>{
        checkSignal(signal);validateValue(key,kind,value);
        const state=await replay(),prior=state.entries.get(key+':'+kind);
        if(prior!==undefined){if(json(prior)!==json(value))fail('JOURNAL_CONFLICT');return;}
        if(kind==='verified'&&!state.entries.has(key+':registration'))fail('JOURNAL_CONFLICT');
        const entry={key,phase:kind,value},body={sequence:state.sequence+1,previousSha256:state.previousSha256,entry};
        const bytes=Buffer.from(json({...body,sha256:sha(json(body))})+'\n');
        if(state.size+bytes.length>MAX_BYTES||state.sequence>=10000)fail('JOURNAL_CAPACITY');
        checkSignal(signal);let offset=0;
        while(offset<bytes.length){const written=await handle.write(bytes,offset,bytes.length-offset,state.size+offset);if(written.bytesWritten===0)fail('JOURNAL_OUTCOME_UNKNOWN');offset+=written.bytesWritten;}
        await handle.sync();
        const confirmed=(await replay()).entries.get(key+':'+kind);
        if(json(confirmed)!==json(value))fail('JOURNAL_OUTCOME_UNKNOWN');
      });},
      async close(){
        await queue;if(closed)return;closed=true;
        try{if(!quarantined)await handle.sync();}catch{quarantined=true;}
        finally{await handle.close();handle=null;}
        // Page-cache readback after a failed fsync is not durable evidence.
        // Keep the exclusive lock after uncertain append/sync/corrupt replay so
        // a clean-looking later read cannot silently adopt that operation.
        if(quarantined)fail('JOURNAL_OUTCOME_UNKNOWN');
        await assertRecoveryPath(lockPath,{exists:true});await unlink(lockPath);lockOwned=false;
      },
    });
  }catch(error){await handle?.close().catch(()=>{});if(lockOwned)await unlink(lockPath).catch(()=>{});if(error instanceof SourceDocumentMigrationError)throw error;fail('JOURNAL_UNAVAILABLE');}
}

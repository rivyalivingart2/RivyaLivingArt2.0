// Called only after remote ciphertext and authenticated decryption have verified.
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
export function saveVerifiedReceipt(directory,receipt){
 if(!path.isAbsolute(directory)||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(receipt.backupCreatedAt)||!Number.isFinite(Date.parse(receipt.backupCreatedAt))||!/^[a-f0-9]{64}$/.test(receipt.archiveSha256)||!receipt.remoteFileId)throw Error('Invalid verified receipt');
 fs.mkdirSync(directory,{recursive:true});
 const lock=path.join(directory,'.receipt-write.lock');
 const handle=fs.openSync(lock,'wx');
 try{
  // Catch-up and pre-release backups can verify on the same calendar day.
  const filename=path.join(directory,receipt.backupCreatedAt.replaceAll(':','-')+'-receipt.json');
  let saved=receipt;
  if(fs.existsSync(filename)){
   saved=JSON.parse(fs.readFileSync(filename,'utf8'));
   if(saved.archiveSha256!==receipt.archiveSha256||saved.remoteFileId!==receipt.remoteFileId)throw Error('Receipt identity conflicts');
  }else fs.writeFileSync(filename,JSON.stringify(receipt,null,2),{flag:'wx'});
  const latest=path.join(directory,'latest-verified.json');
  const previous=fs.existsSync(latest)?JSON.parse(fs.readFileSync(latest,'utf8')):null;
  if(!previous||Date.parse(saved.backupCreatedAt)>=Date.parse(previous.backupCreatedAt)){
   const pending=path.join(directory,'.latest-'+randomUUID()+'.tmp');
   try{fs.writeFileSync(pending,JSON.stringify(saved,null,2),{flag:'wx'});fs.renameSync(pending,latest);}
   finally{if(fs.existsSync(pending))fs.unlinkSync(pending);}
  }
  return saved;
 }finally{fs.closeSync(handle);fs.unlinkSync(lock);}
}

/** Inactive GET-only provider adapter. Explicit private registrations/token;
 * no environment lookup, Drive search, permission changes or runtime import. */
import {SourceDocumentMigrationError} from './source-document-migration.mjs';
import {sourceDocumentDeadline,SourceDocumentDeadlineError} from './source-document-deadline.mjs';
const fail=code=>{throw new SourceDocumentMigrationError(code);};
const id=value=>typeof value==='string'&&/^[A-Za-z0-9_-]{10,160}$/.test(value);
export function createGoogleDriveDocumentPrivacyReader({registeredIds,timeoutMs=15000},{token,fetch:fetchResponse}){
  if(!Array.isArray(registeredIds)||!registeredIds.length||registeredIds.length>10000||registeredIds.some(x=>!id(x))||new Set(registeredIds).size!==registeredIds.length||typeof token!=='function'||typeof fetchResponse!=='function'||!Number.isSafeInteger(timeoutMs)||timeoutMs<1||timeoutMs>30000)fail('INVALID_CONFIGURATION');
  const ids=new Set(registeredIds);
  return async(fileId,outer)=>{
    if(!ids.has(fileId))fail('REGISTRATION_MISMATCH');
    const deadline=sourceDocumentDeadline(timeoutMs,outer),{signal}=deadline;
    async function get(url){
      const credential=await deadline.run(()=>token(signal));
      if(typeof credential!=='string'||credential.length>8192||!/^[\x21-\x7e]+$/.test(credential))fail('PRIVACY_UNAVAILABLE');
      const response=await deadline.run(()=>fetchResponse(url.href,{method:'GET',headers:{Authorization:'Bearer '+credential,Accept:'application/json'},redirect:'manual',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal}));
      const deny=()=>{void response.body?.cancel().catch(()=>{});fail('PRIVACY_UNAVAILABLE');};
      if(response.status!==200||response.redirected||response.url&&response.url!==url.href||(response.headers.get('content-type')??'').split(';')[0].trim().toLowerCase()!=='application/json')deny();
      const length=response.headers.get('content-length');
      if(length!==null&&(!/^\d+$/.test(length)||!Number.isSafeInteger(Number(length))||Number(length)>128*1024))deny();
      if(!response.body)deny();
      const reader=response.body.getReader(),chunks=[];let count=0;
      try{while(true){const part=await deadline.run(()=>reader.read());if(part.done)break;count+=part.value.byteLength;if(count>128*1024)fail('PRIVACY_UNAVAILABLE');chunks.push(part.value);}}
      catch(error){void reader.cancel().catch(()=>{});throw error;}finally{reader.releaseLock();}
      if(length!==null&&!response.headers.get('content-encoding')&&count!==Number(length))fail('PRIVACY_UNAVAILABLE');
      const bytes=Buffer.concat(chunks);let result;
      try{result=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{fail('PRIVACY_UNAVAILABLE');}
      if(!result||typeof result!=='object'||Array.isArray(result))fail('PRIVACY_UNAVAILABLE');return result;
    }
    try{
      const metadata=new URL('https://www.googleapis.com/drive/v3/files/'+fileId);metadata.searchParams.set('fields','id,mimeType,parents,trashed,owners(emailAddress)');metadata.searchParams.set('supportsAllDrives','true');
      const permissions=new URL('https://www.googleapis.com/drive/v3/files/'+fileId+'/permissions');permissions.searchParams.set('fields','nextPageToken,permissions(type,role,emailAddress,deleted,pendingOwner)');permissions.searchParams.set('pageSize','100');permissions.searchParams.set('supportsAllDrives','true');
      const result={metadata:await get(metadata),permissions:await get(permissions)};deadline.check();return result;
    }catch(error){try{deadline.check();}catch(ended){fail(ended.code);}if(error instanceof SourceDocumentDeadlineError)fail(error.code);if(error instanceof SourceDocumentMigrationError)throw error;fail('PRIVACY_UNAVAILABLE');}
    finally{deadline.close();}
  };
}

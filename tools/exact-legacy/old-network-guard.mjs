/** Runtime guard for the disposable old copy: all server fetches stay local. */
import assert from 'node:assert/strict';
const url=new URL(process.env.DATABASE_URL||'');
assert.equal(url.hostname,'127.0.0.1');assert.equal(url.port,'55444');assert.equal(url.pathname,'/rivya_old_reference');
for(const key of ['RESEND_API_KEY','BLOB_READ_WRITE_TOKEN','VERCEL','CRON_SECRET'])assert.ok(!process.env[key]);
const original=globalThis.fetch;
globalThis.fetch=(input,init)=>{
 const target=new URL(typeof input==='string'||input instanceof URL?input:input.url);
 if(!['localhost','127.0.0.1','[::1]'].includes(target.hostname))return Promise.reject(Error('Old reference refuses external fetch'));
 return original(input,init);
};

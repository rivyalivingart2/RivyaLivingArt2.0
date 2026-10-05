import {qa,record} from './common.mjs';
import assert from 'node:assert/strict';
import {isDeepStrictEqual} from 'node:util';
process.env.DATABASE_URL=qa.DATABASE_URL;
const {publishedSource,publishedSourceIdentity,publicationIdentity,readPublishedSource}=await import('../../src/lib/published-source.ts');
const {publishedShellSource}=await import('../../src/lib/published-shell-source.ts');
const samples=[];
for(let run=1;run<=3;run++){
 const results=await Promise.all([['published',publishedSource],['shell',publishedShellSource],['validation',publishedSourceIdentity]].map(async([name,read])=>{const start=performance.now(),data=await read();return {name,ms:Math.round(performance.now()-start),bytes:Buffer.byteLength(JSON.stringify(data)),...(typeof data==='object'?{groups:Object.fromEntries(Object.entries(data).map(([key,value])=>[key,{bytes:Buffer.byteLength(JSON.stringify(value)),count:Array.isArray(value)?value.length:1}]))}:{})};}));
 samples.push({run,results});console.log(JSON.stringify({run,results}));
}
const reference=await readPublishedSource();assert.equal(await publishedSourceIdentity(),publicationIdentity(reference));assert.ok(isDeepStrictEqual(await publishedSource(),reference),'Validated snapshot matches the complete current read');
record('source-profile',{at:new Date().toISOString(),scope:'Read-only direct queries from this computer to the isolated QA database; no documents or connection details recorded.',validatedEqualsFresh:true,samples});

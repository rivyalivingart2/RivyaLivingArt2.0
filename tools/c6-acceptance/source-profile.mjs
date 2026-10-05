import {qa,record} from './common.mjs';
process.env.DATABASE_URL=qa.DATABASE_URL;
const {publishedSource}=await import('../../src/lib/published-source.ts');
const {publishedShellSource}=await import('../../src/lib/published-shell-source.ts');
const samples=[];
for(let run=1;run<=3;run++){
 const results=await Promise.all([['published',publishedSource],['shell',publishedShellSource]].map(async([name,read])=>{const start=performance.now(),data=await read();return {name,ms:Math.round(performance.now()-start),bytes:Buffer.byteLength(JSON.stringify(data)),groups:Object.fromEntries(Object.entries(data).map(([key,value])=>[key,{bytes:Buffer.byteLength(JSON.stringify(value)),count:Array.isArray(value)?value.length:1}]))};}));
 samples.push({run,results});console.log(JSON.stringify({run,results}));
}
record('source-profile',{at:new Date().toISOString(),scope:'Read-only direct queries from this computer to the isolated QA database; no documents or connection details recorded.',samples});

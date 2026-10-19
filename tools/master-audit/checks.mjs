import {spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';

// Run only through the repository's fixed-target local QA guard.
if (!globalThis.__rivyaMigrationLocalSql) throw new Error('Isolated QA guard required');
const out=process.argv[2]||'test-results/rivya-master-audit';
if(!/^test-results\/[a-z0-9-]+$/.test(out))throw new Error('Use one dedicated test-results folder');
await mkdir(out,{recursive:true});
const checks=[
 ['lint',['node_modules/eslint/bin/eslint.js','.']],
 ['unit',['--import','tsx','--test','tests/*.test.mjs']],
 ['preflight',['--test','tools/codex-preflight.test.mjs']],
 ['build',['node_modules/next/dist/bin/next','build']],
 ['typegen',['node_modules/next/dist/bin/next','typegen']],
 ['typecheck',['node_modules/typescript/bin/tsc','--noEmit']],
 ['runtime',['--import','tsx','--test','tools/frontend-runtime.test.mjs']],
];
const results=[];
for(const [name,args] of checks){
 const startedAt=new Date().toISOString();
 console.log('Starting '+name);
 const result=await new Promise(resolve=>{
  let log='';const proc=spawn(process.execPath,args,{env:process.env,windowsHide:true});
  proc.stdout.on('data',s=>log+=s);proc.stderr.on('data',s=>log+=s);
  proc.on('error',e=>resolve({code:null,log:log+e.message}));
  proc.on('exit',code=>resolve({code,log}));
 });
 await writeFile(`${out}/${name}.log`,result.log);
 const counts=[...result.log.matchAll(/^# (tests|pass|fail|cancelled|skipped|todo) (\d+)/gm)].map(m=>[m[1],Number(m[2])]);
 const row={name,args,startedAt,finishedAt:new Date().toISOString(),exitCode:result.code,...Object.fromEntries(counts)};
 results.push(row);await writeFile(`${out}/checks.json`,JSON.stringify({scope:'Fixed loopback QA; no production credentials',results},null,2)+'\n');
 console.log(JSON.stringify(row));
}
if(results.some(r=>r.exitCode!==0))process.exitCode=1;

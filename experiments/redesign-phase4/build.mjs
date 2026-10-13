import {build} from 'esbuild';
import {resolve} from 'node:path';
import {mkdir,readFile,writeFile,readdir} from 'node:fs/promises';
const out='output/redesign-phase4';await mkdir(out,{recursive:true});
await build({entryPoints:['experiments/redesign-phase4/fixtures.tsx'],outfile:out+'/fixtures.mjs',bundle:true,platform:'node',format:'esm',jsx:'automatic',packages:'external',plugins:[{name:'static-next-adapters',setup(b){b.onResolve({filter:/^server-only$/},()=>({path:resolve("experiments/redesign-phase4/server-only.mjs")}));b.onResolve({filter:/^next\/(image|link|navigation|headers|server|dynamic)$/},args=>args.path==='next/image'?{path:resolve('experiments/redesign-phase3/next-image-node.mjs')}:args.path==='next/navigation'?{path:resolve('experiments/redesign-phase4/navigation.mjs')}:{path:args.path+'.js',external:true});}}]});
await import('../../'+out+'/fixtures.mjs?'+Date.now());
const html=await (await fetch('http://127.0.0.1:4199/')).text();
const sheets=[...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map(m=>m[0]).join('');
const htmlClass=html.match(/<html[^>]*class="([^"]*)"/)?.[1]||'',bodyClass=html.match(/<body[^>]*class="([^"]*)"/)?.[1]||'';
for(const file of (await readdir(out)).filter(f=>f.endsWith('.markup.html'))){const name=file.replace('.markup.html','');const markup=await readFile(out+'/'+file,'utf8');await writeFile(out+'/'+name+'.html','<!doctype html><html lang="en" class="'+htmlClass+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Phase 4 static layout fixture</title>'+sheets+'<link rel="stylesheet" href="/fixtures.css"></head><body class="'+bodyClass+'"><aside style="padding:16px;background:#f4f1e9;color:#18202a;font:16px sans-serif">LOCAL STATIC LAYOUT FIXTURE — synthetic content; controls are illustrative; no saved records or publication.</aside>'+markup+'</body></html>');}
console.log('Built static Phase 4 layout fixtures.');

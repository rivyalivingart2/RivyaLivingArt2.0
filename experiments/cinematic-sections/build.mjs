import {build} from 'esbuild';
import {resolve} from 'node:path';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
const out='output/cinematic-sections';await mkdir(out,{recursive:true});
await build({entryPoints:['experiments/cinematic-sections/fixtures.tsx'],outfile:out+'/fixtures.mjs',bundle:true,platform:'node',format:'esm',jsx:'automatic',packages:'external',plugins:[{name:'next-node-extension',setup(b){b.onResolve({filter:/^next\/(image|link)$/},args=>args.path==='next/image'?{path:resolve('experiments/redesign-phase3/next-image-node.mjs')}:{path:args.path+'.js',external:true});}}]});
await import('../../'+out+'/fixtures.mjs?'+Date.now());
const html=await (await fetch('http://127.0.0.1:4199/')).text();
const sheets=[...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map(m=>m[0]).join('');
const htmlClass=html.match(/<html[^>]*class="([^"]*)"/)?.[1]||'',bodyClass=html.match(/<body[^>]*class="([^"]*)"/)?.[1]||'';
for(const name of ['all','classic','editorial','empty']){
 const markup=await readFile(out+'/'+name+'.markup.html','utf8');
 await writeFile(out+'/'+name+'.html','<!doctype html><html lang="en" class="'+htmlClass+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Cinematic sections layout fixture</title>'+sheets+'<link rel="stylesheet" href="/fixtures.css"></head><body class="'+bodyClass+'"><aside style="padding:16px;background:#f4f1e9;color:#18202a;font:16px sans-serif">LOCAL STATIC LAYOUT FIXTURE — synthetic optional sections; no publication or working form/video controls.</aside>'+markup+'</body></html>');
}
console.log('Built four read-only static layout fixtures.');

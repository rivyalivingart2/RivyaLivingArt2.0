import {build} from 'esbuild';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
const dir='output/redesign-phase2';await mkdir(dir,{recursive:true});
await build({entryPoints:['experiments/redesign-phase2/client.tsx'],outfile:`${dir}/client.js`,bundle:true,format:'esm',jsx:'automatic',minify:true,define:{'process.env.NODE_ENV':'"production"'},metafile:true}).then(async r=>writeFile(`${dir}/bundle-meta.json`,JSON.stringify(r.metafile,null,2)));
await build({entryPoints:['experiments/redesign-phase2/App.tsx'],outfile:`${dir}/ssr.mjs`,bundle:true,platform:'node',format:'esm',jsx:'automatic',packages:'external'});
const {App}=await import(`../../${dir}/ssr.mjs?${Date.now()}`);const {renderToString}=await import('react-dom/server');const {createElement}=await import('react');
for(const studio of [false,true]){
 const markup=renderToString(createElement(App,{studio}));
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Rivya — Phase 2 ${studio?'Studio controls':'animation & media'} preview</title><link rel="stylesheet" href="/foundation.css"><link rel="stylesheet" href="/styles.css"></head><body><div id="root">${markup}</div><script type="module" src="/client.js"></script></body></html>`;
 await writeFile(`${dir}/${studio?'studio':'index'}.html`,html);
}
const js=await readFile(`${dir}/client.js`);console.log(JSON.stringify({bundleBytes:js.length,gzipBytes:gzipSync(js).length,productionRoutesImportFoundation:false}));

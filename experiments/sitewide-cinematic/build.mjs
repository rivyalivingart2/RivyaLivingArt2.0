import {build} from 'esbuild';
import {resolve} from 'node:path';
import {mkdir,readFile,writeFile} from 'node:fs/promises';

const origin=process.env.SITEWIDE_FIXTURE_ORIGIN||'http://127.0.0.1:4199';
const out='output/sitewide-cinematic';
await mkdir(out,{recursive:true});
// StructuredData imports a constant from the server metadata module. Extract only
// that literal; never load its publication/catalogue readers into a static specimen.
const metadataSource=await readFile('src/lib/site-metadata.ts','utf8');
const siteOrigin=metadataSource.match(/export const siteOrigin=['"]([^'"]+)['"]/)?.[1];
if(!siteOrigin)throw new Error('The real metadata origin could not be read safely');
const result=await build({
 entryPoints:['experiments/sitewide-cinematic/fixtures.tsx'],outfile:out+'/fixtures.mjs',bundle:true,platform:'node',format:'esm',jsx:'automatic',packages:'external',metafile:true,
 plugins:[{name:'read-only-static-adapters',setup(builder){
  builder.onResolve({filter:/^@\/lib\/business-settings$/},()=>({path:'fixture-business-reader',namespace:'static-guard'}));
  builder.onResolve({filter:/^@\/lib\/site-metadata$/},()=>({path:'fixture-metadata-origin',namespace:'static-guard'}));
  builder.onLoad({filter:/.*/,namespace:'static-guard'},args=>({contents:args.path==='fixture-metadata-origin'?'export const siteOrigin='+JSON.stringify(siteOrigin)+';':"export async function publishedBusiness(){throw new Error('Static specimen must never read business settings or a database');}",loader:'js'}));
  // There is intentionally no general server-only shim: an unexpected server module
  // is a build error rather than permission to load persistence/authentication code.
  builder.onResolve({filter:/^server-only$/},()=>({errors:[{text:'Unexpected server-only import in read-only static specimens'}]}));
  builder.onResolve({filter:/^next\/(image|link|navigation)$/},args=>args.path==='next/image'?{path:resolve('experiments/redesign-phase3/next-image-node.mjs')}:args.path==='next/navigation'?{path:resolve('experiments/redesign-phase4/navigation.mjs')}:{path:args.path+'.js',external:true});
 }}],
});
const forbiddenInputs=Object.keys(result.metafile.inputs).filter(path=>/studio-db|published-source|published-shell-source|studio-auth|homepage-persistence|editorial-order-store/.test(path));
if(forbiddenInputs.length)throw new Error('Static specimen imported persistence: '+forbiddenInputs.join(', '));
await import('../../'+out+'/fixtures.mjs?'+Date.now());

const response=await fetch(origin+'/',{signal:AbortSignal.timeout(60000)});
if(!response.ok)throw new Error('Local application shell was unavailable: '+response.status);
const html=await response.text();
const sheets=[...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map(match=>match[0].replace(/href="([^"]+)"/,(_all,href)=>'href="'+new URL(href,origin).href+'"')).join('');
if(!sheets)throw new Error('Local application did not expose its real stylesheets/fonts');
const htmlClass=html.match(/<html[^>]*class="([^"]*)"/)?.[1]||'';
const bodyClass=html.match(/<body[^>]*class="([^"]*)"/)?.[1]||'';
const manifest=JSON.parse(await readFile(out+'/fixture-manifest.json','utf8'));
const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const specimen of manifest.specimens){
 let markup=await readFile(out+'/'+specimen.name+'.markup.html','utf8');
 // Keep asset requests on the local app (including its image optimizer). This also
 // lets the parent expose these output files at any isolated preview port/path.
 markup=markup.replace(/\b(src|poster|srcset|imagesrcset)="([^"]*)"/gi,(all,attribute,value)=>{
  if(['srcset','imagesrcset'].includes(attribute.toLowerCase()))return attribute+'="'+value.split(',').map(item=>item.trim().replace(/^(\/\S+)/,path=>origin+path)).join(', ')+'"';
  return value.startsWith('/')?attribute+'="'+origin+value+'"':all;
 });
 if([...markup.matchAll(/\b(src|poster|srcset|imagesrcset)="([^"]*)"/gi)].some(match=>/(?:^|,\s*)\//.test(match[2])))throw new Error('Relative media URL remains in '+specimen.name);
 if(specimen.name==='landing-faqPicker')markup=markup.replace(/<details(?![^>]*\bopen\b)([^>]*)>/g,'<details$1 open>');
 const notice='<aside style="padding:16px 20px;background:#f4f1e9;color:#16242b;font:14px/1.55 system-ui,sans-serif"><strong>LOCAL STATIC LAYOUT SPECIMEN</strong><br>'+escape(specimen.title)+'<br>Synthetic text; existing media; no publication or database access. All content below is inert. Animation, video playback, keyboard behavior and forms must be tested on the real application.</aside>';
 const page='<!doctype html><html lang="en" class="'+escape(htmlClass)+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta http-equiv="Content-Security-Policy" content="script-src \'none\'; object-src \'none\'; base-uri \'none\'; form-action \'none\'"><title>'+escape(specimen.title)+' — local static specimen</title>'+sheets+'<link rel="stylesheet" href="./fixtures.css"></head><body class="'+escape(bodyClass)+'">'+notice+'<div inert>'+markup+'</div></body></html>';
 await writeFile(out+'/'+specimen.name+'.html',page);
}
await writeFile(out+'/fixture-build-receipt.json',JSON.stringify({builtAt:new Date().toISOString(),origin,specimens:manifest.specimens.length,landingBlocks:manifest.specimens.filter(specimen=>specimen.name.startsWith('landing-')).length,forbiddenInputs,serverOnlyShim:false,businessReader:'throwing fixture guard, never called',metadata:'Only the unchanged siteOrigin literal is extracted from source; no metadata reader imported',styles:'Current component CSS bundled by esbuild; local application stylesheets and font classes retained',interactive:false,urls:manifest.specimens.map(specimen=>'./'+specimen.name+'.html')},null,2)+'\n');
console.log(JSON.stringify({out,fixtures:manifest.specimens.length,landingBlocks:manifest.specimens.filter(specimen=>specimen.name.startsWith('landing-')).length,forbiddenInputs,origin},null,2));

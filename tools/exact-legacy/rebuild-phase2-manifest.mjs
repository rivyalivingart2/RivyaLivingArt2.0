/** Recover this checkpoint's screenshot manifest from its bounded filename convention. */
import {readFileSync,writeFileSync,readdirSync,statSync} from 'node:fs';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const root=resolve('test-results/exact-legacy-2026-10-21');
const baseline=new Set(JSON.parse(readFileSync(resolve(root,'captures.json'),'utf8')).map(c=>c.path));
const routes={
 'restoration-home':['/','/'],drawer:['/','/'],'mega-menu':['/','/'],'search-dialog':['/','/'],
 'search-result':['/shop','/search?q=River'],'product-detail':['/product/resin-mini-maha-mrityunjaya-mantra-frame','/pieces/river-channel'],
 'article-detail':['/blog/why-resin-art-cannot-be-rushed','/journal/comparing-two-possible-positions-without-moving-furniture'],
 footer:['/blog/why-resin-art-cannot-be-rushed','/'],login:['/studio/login','/studio/login'],
 'faq-expanded':['/faq','/faq'],'faq-empty':['/faq','/faq'],'portfolio-state':['/portfolio','/portfolio'],
 'editor-unsaved':['/studio/products','/studio/products'],'home-fullpage':['/','/']
};
const captures=[];
for(const file of readdirSync(resolve(root,'screenshots'))){
 const path='screenshots/'+file;if(baseline.has(path))continue;
 const match=/^([a-z-]+)-(old|current|candidate)-(\d+)(?:x(\d+))?\.jpg$/.exec(file);if(!match)continue;
 const [,family,label,requested]=match;assert.ok(routes[family],'Unknown checkpoint family: '+family);
 const info=await sharp(resolve(root,path)).metadata();assert.equal(info.width,Number(requested));
 const route=family==='footer'&&label==='current'?routes['article-detail'][1]:routes[family][label==='old'?0:1];
 captures.push({family:family==='faq-empty'&&label==='current'?'faq-filter':family,label,path,route,width:info.width,requestedWidth:info.width,height:info.height,heading:'Recorded UI state',scope:label==='candidate'?'isolated-restoration':'live-reference',fileModifiedAt:statSync(resolve(root,path)).mtime.toISOString()});
}
assert.ok(captures.length>=40,'Incomplete recovered evidence');
writeFileSync(resolve(root,'phase2-captures.json'),JSON.stringify(captures,null,2));
console.log(JSON.stringify({files:captures.length,families:[...new Set(captures.map(c=>c.family))]}));

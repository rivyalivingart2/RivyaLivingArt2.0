import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {resolve,relative,dirname,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import ts from 'typescript';

const base='docs/redesign/old-design-migration-2026-10-08';
const read=name=>JSON.parse(readFileSync(resolve(base,name),'utf8'));
const root=resolve(process.env.RIVYA_OLD_REFERENCE_ROOT);
const slash=path=>path.split(sep).join('/');
const hash=text=>createHash('sha256').update(text).digest('hex');
const routes=read('old-route-parity.json'),sections=read('old-section-manifest.json'),tracker=read('implementation-tracker.json'),editorial=read('editorial-production-register.json'),drive=read('drive-inventory.json');
function walk(directory){return readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(resolve(directory,entry.name)):[resolve(directory,entry.name)]);}
const pages=walk(resolve(root,'src/app')).filter(file=>file.endsWith('/page.tsx')||file.endsWith('\\page.tsx')).map(file=>slash(relative(root,file))).sort();
assert.equal(pages.length,85);assert.deepEqual(routes.rows.map(row=>row.oldSource).sort(),pages);
assert.equal(pages.filter(file=>file.includes('/studio/')).length,60);
assert.equal(sections.reduce((n,group)=>n+group.sections.length,0),74);
assert.equal(sections.find(group=>group.group==='HOME').sections.length,18);
const sectionSource=readFileSync(resolve(root,'src/lib/page-sections.ts'),'utf8');
for(const group of sections)for(const section of group.sections){assert.ok(sectionSource.includes(`key: "${section.key}"`));assert.ok(section.source&&section.copyPrefixes&&section.imageKeys);}
const blockSource=readFileSync(resolve(root,'src/lib/custom-blocks.ts'),'utf8');
const landingBlocks=[...blockSource.match(/export const CUSTOM_BLOCK_TYPES = \[([\s\S]*?)\] as const/)[1].matchAll(/"([\w]+)"/g)].map(match=>match[1]);assert.equal(landingBlocks.length,16);
assert.equal(tracker.tickets.length,60);assert.equal(new Set(tracker.tickets.map(t=>t.id)).size,60);
assert.equal(tracker.studioModules.length,32);
assert.equal(editorial.records.length,480);assert.equal(new Set(editorial.records.map(row=>row.id)).size,480);
const contentCounts={};for(const kind of ['Journal','Portfolio','Testimonials','FAQs']){const rows=editorial.records.filter(row=>row.kind===kind);assert.equal(rows.length,120);contentCounts[kind]={planned:rows.length,created:rows.filter(r=>r.newRecordId).length};}
assert.equal(drive.records.length,111);
const graph=new Map();
function resolveImport(importer,specifier){
  const target=specifier.startsWith('@/')?resolve(root,'src',specifier.slice(2)):specifier.startsWith('.')?resolve(dirname(importer),specifier):null;
  if(!target)return null;
  assert.ok(!relative(root,target).startsWith('..'),'Reference import escapes source root');
  return [target,...['.ts','.tsx','.js','.jsx','.json','.css','/index.ts','/index.tsx'].map(ext=>target+ext)].find(candidate=>existsSync(candidate)&&statSync(candidate).isFile())||null;
}
function inspect(file){
  const key=slash(relative(root,file));if(graph.has(key))return graph.get(key);
  const source=readFileSync(file,'utf8'),parsed=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true);
  const entry={file:key,sha256:hash(source),imports:[],externalImports:[],unresolvedLocalImports:[],conditionals:[],jsxElements:[]};graph.set(key,entry);
  function visit(node){
    let specifier;
    if((ts.isImportDeclaration(node)||ts.isExportDeclaration(node))&&node.moduleSpecifier&&ts.isStringLiteral(node.moduleSpecifier))specifier=node.moduleSpecifier.text;
    if(ts.isCallExpression(node)&&node.expression.kind===ts.SyntaxKind.ImportKeyword&&node.arguments.length===1&&ts.isStringLiteral(node.arguments[0]))specifier=node.arguments[0].text;
    if(specifier){const found=resolveImport(file,specifier);if(found)entry.imports.push(slash(relative(root,found)));else (specifier.startsWith('.')||specifier.startsWith('@/')?entry.unresolvedLocalImports:entry.externalImports).push(specifier);}
    if(ts.isJsxOpeningElement(node)||ts.isJsxSelfClosingElement(node))entry.jsxElements.push(node.tagName.getText(parsed));
    if(ts.isIfStatement(node)||ts.isConditionalExpression(node)){const expression=ts.isIfStatement(node)?node.expression:node.condition;entry.conditionals.push({line:parsed.getLineAndCharacterOfPosition(node.getStart()).line+1,expression:expression.getText(parsed).slice(0,220)});}
    ts.forEachChild(node,visit);
  }
  visit(parsed);for(const key of ['imports','externalImports','unresolvedLocalImports','jsxElements'])entry[key]=[...new Set(entry[key])].sort();
  for(const imported of entry.imports)if(/\.[jt]sx?$/.test(imported))inspect(resolve(root,imported));
  return entry;
}
function closure(file,seen=new Set()){
  if(seen.has(file))return seen;seen.add(file);const entry=graph.get(file);
  for(const imported of entry?.imports||[])if(graph.has(imported))closure(imported,seen);
  return seen;
}
const sourceRows=routes.rows.map(row=>{
  inspect(resolve(root,row.oldSource));
  let directory=dirname(resolve(root,row.oldSource));const layouts=[];
  while(directory.startsWith(resolve(root,'src/app'))){for(const name of ['layout.tsx','loading.tsx','error.tsx','not-found.tsx']){const file=resolve(directory,name);if(existsSync(file)){inspect(file);layouts.push(slash(relative(root,file)));}}directory=dirname(directory);}
  const related=new Set([...closure(row.oldSource),...layouts.flatMap(layout=>[...closure(layout)])]);
  return {oldRoute:row.oldRoute,source:row.oldSource,target:row.target,phase:row.phase,disposition:row.disposition,guard:row.guard,sharedBoundaries:layouts,nestedSourceFiles:[...related].sort(),implementationStatus:'not-implemented',visualAcceptance:'not-run'};
});
const oldRevision=execFileSync('git',[`--git-dir=${resolve(root,'.git')}`,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
assert.equal(oldRevision,'2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6');
const report={at:new Date().toISOString(),oldRevision,currentBase:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),method:'Read-only TypeScript AST trace; no old module execution. Imports and conditional expressions are source evidence, not runtime/visual acceptance.',counts:{pages:pages.length,publicUtility:25,studioPages:60,sections:74,homeSections:18,landingBlocks:16,studioDestinations:32,tickets:60,driveCandidates:111},contentCounts,landingBlocks,sourceRows,graph:[...graph.values()].sort((a,b)=>a.file.localeCompare(b.file))};
writeFileSync(resolve(base,'source-reconciliation.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report.counts,sourceFiles:graph.size,unresolvedLocalImports:report.graph.flatMap(row=>row.unresolvedLocalImports).length,contentCounts}));

import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
const old=resolve('../OLDWEBSITE-reference'),doc='docs/restoration/exact-legacy-2026-10-21';
const commit=execFileSync('git',['-C',old,'rev-parse','HEAD'],{encoding:'utf8',windowsHide:true}).trim();
assert.equal(commit,'2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6');
const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
const csv=(rows)=>[Object.keys(rows[0]),...rows.map(row=>Object.values(row))].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
const seedPath='src/lib/scraper/seed-data.ts',source=readFileSync(resolve(old,seedPath),'utf8');
const tree=ts.createSourceFile(seedPath,source,ts.ScriptTarget.Latest,true);
let initializer;
for(const statement of tree.statements)if(ts.isVariableStatement(statement))for(const declaration of statement.declarationList.declarations)if(declaration.name.getText(tree)==='SEED_SOURCES')initializer=declaration.initializer;
assert.ok(initializer&&ts.isArrayLiteralExpression(initializer));
// Parse literal fields only: never execute old database/bootstrap code.
const seeds=initializer.elements.map(element=>{
 assert.ok(ts.isObjectLiteralExpression(element),'Unexpected dynamic seed; review explicitly');
 const record={};
 for(const prop of element.properties){assert.ok(ts.isPropertyAssignment(prop));const key=prop.name.getText(tree).replaceAll('"','');const value=prop.initializer;
 if(ts.isStringLiteral(value))record[key]=value.text;
 else if(value.kind===ts.SyntaxKind.TrueKeyword||value.kind===ts.SyntaxKind.FalseKeyword)record[key]=value.kind===ts.SyntaxKind.TrueKeyword;
 else throw Error('Nonliteral registry field: '+key);}
 return record;
});
assert.equal(new Set(seeds.map(s=>s.key)).size,seeds.length);
writeFileSync('src/components/studio/legacy-sources.json',JSON.stringify(seeds,null,2)+'\n');
const frames=readdirSync('public/legacy-reference/pour-cure').filter(f=>f.endsWith('.webp')).sort();
assert.equal(frames.length,121);
const assets=frames.map(name=>{const src='public/sequences/pour-cure/'+name,dest='public/legacy-reference/pour-cure/'+name,bytes=readFileSync(dest),digest=hash(bytes);assert.equal(digest,hash(readFileSync(resolve(old,src))));return {sourceCommit:commit,source:src,destination:dest,bytes:bytes.length,sha256:digest,treatment:'EXACT_TRACKED_PUBLIC_ASSET_COPY'};});
writeFileSync(doc+'/inventory/material-sequence-assets.csv',csv(assets));
const adapted={
 'docs/redesign-contract.md':'LEGACY-DESIGN-CONTRACT.md',
 'README.md':'legacy-knowledge/SETUP-AND-ARCHITECTURE.md',
 'docs/studio-workflow.md':'legacy-knowledge/STUDIO-AND-IMPORT.md',
 'docs/product-lifecycle.md':'legacy-knowledge/STUDIO-AND-IMPORT.md',
 'docs/import/README.md':'legacy-knowledge/STUDIO-AND-IMPORT.md',
 'docs/scraper.md':'legacy-knowledge/SCRAPER-OPERATIONS.md',
 'docs/source-adapters.md':'legacy-knowledge/SCRAPER-OPERATIONS.md',
 'docs/troubleshooting.md':'legacy-knowledge/OPERATIONS-AND-RECOVERY.md',
};
const files=execFileSync('git',['-C',old,'ls-files','-z'],{encoding:'utf8',windowsHide:true}).split('\0').filter(f=>/\.md$/i.test(f));
const rows=files.map(file=>{const bytes=readFileSync(resolve(old,file)),text=bytes.toString('utf8');return {source_repository:'OLDWEBSITE',source_commit:commit,source_path:file,source_sha256:hash(bytes),title:text.match(/^#\s+(.+)$/m)?.[1]||file,destination:adapted[file]?doc+'/'+adapted[file]:'Retained in pinned OLDWEBSITE reference',status:adapted[file]?'ADAPTED_WITH_CURRENT_AUTHORITY':'REFERENCE_ONLY_NOT_MIGRATED',reason:adapted[file]?'Useful contracts adapted; historical commands and exclusions corrected.':file.startsWith('content/')?'Editorial record migration requires Phase 3 identity and content checks.':/archive|audit|QA|COMPLETED|LOG|REPORT/i.test(file)?'Dated evidence retained for traceability; not current runtime proof.':'Specialized historical guidance retained at source; no unreviewed instructions copied into active rules.'};});
assert.equal(rows.length,286);
writeFileSync(doc+'/MARKDOWN-MIGRATION.csv',csv(rows));
writeFileSync(doc+'/inventory/phase12-source-provenance.json',JSON.stringify({referenceCommit:commit,registry:{source:seedPath,sourceSha256:hash(source),records:seeds.length,status:'HISTORICAL_CONFIGURATION_NOT_LIVE_EXTRACTION'},material:{frames:assets.length,bytes:assets.reduce((n,a)=>n+a.bytes,0),exactHashesMatch:true},markdown:{inventoried:rows.length,adapted:rows.filter(r=>r.status==='ADAPTED_WITH_CURRENT_AUTHORITY').length,referenceOnly:rows.filter(r=>r.status!=='ADAPTED_WITH_CURRENT_AUTHORITY').length},databaseWrites:0,externalRequests:0},null,2)+'\n');
console.log(JSON.stringify({frames:assets.length,registry:seeds.length,markdown:rows.length,adapted:Object.keys(adapted).length}));

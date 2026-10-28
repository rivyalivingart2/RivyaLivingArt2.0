import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdtemp,readFile,writeFile,rm,stat,symlink,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {verifyPrivateFilePermissions} from '../tools/google-workspace/private-file.ts';
import {
  WORKBOOK_SPECS,DRIVE_FOLDER_SPECS,TAB_SPECS,GRID,
  IsolatedSetupError,validateIsolatedSetupRegistry,createIsolatedSetupScaffold,
  buildIsolatedStructuralPlan,readyControlCell,ISOLATED_WEBAPP,isolatedAppsScriptManifest,
} from '../tools/google-workspace/isolated-setup.ts';
import {RECORD_COLUMNS} from '../src/lib/google-workspace/record-codec.ts';
import {LEDGER_COLUMNS,AUDIT_COLUMNS,HISTORY_COLUMNS} from '../src/lib/google-workspace/controlled-writer.ts';

// Syntactically valid unit-only metadata. No test calls Google or asserts that
// these identities/resources exist; real installation is a separate verifier.
function registry(){
  return {
    schemaVersion:1,environment:'isolated',ownerEmail:'owner@rivya-acceptance.dev',runtimePrincipalEmail:'owner@rivya-acceptance.dev',
    writer:{scriptId:'registered_script_2468',deploymentId:'registered_deployment_2468',versionNumber:1,
      endpoint:'https://script.google.com/macros/s/registered_deployment_2468/exec',keyId:'acceptance-v1',executionIdentityEmail:'writer@rivya-acceptance.dev'},
    workbooks:Object.fromEntries(Object.keys(WORKBOOK_SPECS).map(group=>[group,{
      workbookId:`registered_workbook_${group}_2468`,resourceKey:WORKBOOK_SPECS[group].resourceKey,
      sheetIds:{records:0,ledger:1,audit:2,history:3,writerControl:4},
    }])),
    drive:{rootFolderId:'registered_drive_root_2468',folders:Object.fromEntries(Object.keys(DRIVE_FOLDER_SPECS).map(key=>[key,`registered_folder_${key}_2468`]))},
  };
}
const rejects=(value,code)=>assert.throws(()=>validateIsolatedSetupRegistry(value),error=>error instanceof IsolatedSetupError&&error.code===code);

test('null scaffold cannot become a usable registration or a structural write plan',()=>{
  const scaffold=createIsolatedSetupScaffold();
  assert.equal(scaffold.ownerEmail,null);assert.equal(scaffold.writer.scriptId,null);
  for(const workbook of Object.values(scaffold.workbooks)){
    assert.equal(workbook.workbookId,null);
    assert.ok(Object.values(workbook.sheetIds).every(value=>value===null));
  }
  assert.ok(Object.values(scaffold.drive.folders).every(value=>value===null));
  rejects(scaffold,'MISSING_IDENTITY');
  assert.throws(()=>buildIsolatedStructuralPlan(scaffold),IsolatedSetupError);
});

test('known owner can be sole runtime and script identity without inventing another account',()=>{
  const scaffold=createIsolatedSetupScaffold('owner@rivya-acceptance.dev');
  assert.equal(scaffold.ownerEmail,'owner@rivya-acceptance.dev');
  assert.equal(scaffold.runtimePrincipalEmail,scaffold.ownerEmail);
  assert.equal(scaffold.writer.executionIdentityEmail,scaffold.ownerEmail);
  assert.equal(scaffold.writer.scriptId,null);rejects(scaffold,'INVALID_TARGET');
  assert.throws(()=>createIsolatedSetupScaffold('owner@example.invalid'),IsolatedSetupError);
  const input=registry();input.writer.executionIdentityEmail=input.ownerEmail;
  const plan=buildIsolatedStructuralPlan(input);
  for(const workbook of plan.workbooks)for(const request of workbook.initialization.requests.slice(5)){
    assert.deepEqual(request.addProtectedRange.protectedRange.editors.users,[input.ownerEmail]);
  }
});

test('registry validation checks explicit isolation, identities, exact shape and absence of secrets',async t=>{
  for(const [label,change,code] of [
    ['production',r=>r.environment='production','INVALID_REGISTRY'],
    ['missing owner',r=>r.ownerEmail=null,'MISSING_IDENTITY'],
    ['example identity',r=>r.runtimePrincipalEmail='owner@example.com','MISSING_IDENTITY'],
    ['placeholder account',r=>r.ownerEmail='owner@example.invalid','MISSING_IDENTITY'],
    ['unknown root key',r=>r.sourceDatabase='forbidden','INVALID_REGISTRY'],
    ['writer secret',r=>r.writer.secret='do-not-reflect-me','INVALID_REGISTRY'],
    ['missing workbook',r=>delete r.workbooks.security,'INVALID_REGISTRY'],
    ['extra folder',r=>r.drive.folders.businessData='registered_extra_folder_2468','INVALID_REGISTRY'],
    ['changed resource key',r=>r.workbooks.content.resourceKey='products','INVALID_REGISTRY'],
  ])await t.test(label,()=>{const value=registry();change(value);rejects(value,code);});
});

test('target validation rejects absent, emulator, malformed and duplicate identities',async t=>{
  for(const [label,change,code] of [
    ['missing ID',r=>r.workbooks.content.workbookId=null,'INVALID_TARGET'],
    ['emulator ID',r=>r.workbooks.content.workbookId='local_fixture_workbook','INVALID_TARGET'],
    ['placeholder ID',r=>r.workbooks.content.workbookId='YOUR_WORKBOOK_ID','INVALID_TARGET'],
    ['repeated character',r=>r.workbooks.content.workbookId='a'.repeat(32),'INVALID_TARGET'],
    ['URL instead of ID',r=>r.workbooks.content.workbookId='https://sheets.google.com/anything','INVALID_TARGET'],
    ['same workbook',r=>r.workbooks.system.workbookId=r.workbooks.content.workbookId,'DUPLICATE_TARGET'],
    ['folder is root',r=>r.drive.folders.jobs=r.drive.rootFolderId,'DUPLICATE_TARGET'],
    ['folder is workbook',r=>r.drive.folders.jobs=r.workbooks.content.workbookId,'DUPLICATE_TARGET'],
    ['duplicate folders',r=>r.drive.folders.jobs=r.drive.folders.originals,'DUPLICATE_TARGET'],
  ])await t.test(label,()=>{const value=registry();change(value);rejects(value,code);});
});

test('tab IDs must be real nonnegative integers and distinct inside each workbook',async t=>{
  for(const [label,value] of [['null',null],['negative',-1],['fraction',0.5],['string','5'],['overflow',2_147_483_648]]){
    await t.test(label,()=>{const input=registry();input.workbooks.content.sheetIds.writerControl=value;rejects(input,'INVALID_SHEET_IDS');});
  }
  const duplicate=registry();duplicate.workbooks.operations.sheetIds.writerControl=duplicate.workbooks.operations.sheetIds.records;
  rejects(duplicate,'INVALID_SHEET_IDS');
  const valid=validateIsolatedSetupRegistry(registry());
  assert.equal(valid.workbooks.content.sheetIds.records,0);
  assert.equal(valid.workbooks.operations.sheetIds.records,0,'sheet IDs may repeat across distinct workbooks');
});

test('writer metadata binds exact deployment URL and installed version without accepting a signing key',async t=>{
  for(const [label,change,code] of [
    ['unversioned HEAD',r=>r.writer.versionNumber=0,'INVALID_WRITER'],
    ['wrong deployment',r=>r.writer.endpoint='https://script.google.com/macros/s/registered_other_2468/exec','INVALID_WRITER'],
    ['development URL',r=>r.writer.endpoint=r.writer.endpoint.replace('/exec','/dev'),'INVALID_WRITER'],
    ['query parameter',r=>r.writer.endpoint+='?token=private','INVALID_WRITER'],
    ['non-HTTPS',r=>r.writer.endpoint=r.writer.endpoint.replace('https:','http:'),'INVALID_WRITER'],
    ['missing execution identity',r=>r.writer.executionIdentityEmail=null,'MISSING_IDENTITY'],
    ['placeholder key ID',r=>r.writer.keyId='YOUR_KEY','INVALID_WRITER'],
  ])await t.test(label,()=>{const value=registry();change(value);rejects(value,code);});
});

test('validated registry is detached from mutable caller metadata',()=>{
  const input=registry(),checked=validateIsolatedSetupRegistry(input);
  input.workbooks.content.workbookId='local_fixture_workbook';
  input.drive.folders.jobs='local_fixture_folder';
  assert.equal(checked.workbooks.content.workbookId,'registered_workbook_content_2468');
  assert.equal(checked.drive.folders.jobs,'registered_folder_jobs_2468');
});

test('structural plan contains exact header/control cells, bounded grids and protected complete tabs only',()=>{
  const input=registry(),plan=buildIsolatedStructuralPlan(input);
  assert.equal(plan.status,'prepared-not-installed');assert.equal(plan.googleExistenceVerified,false);
  assert.equal(plan.externalWritesPerformed,0);assert.equal(plan.businessRowsIncluded,0);
  assert.equal(plan.workbooks.length,4);assert.equal(plan.drive.folders.length,8);
  assert.deepEqual(GRID,{rowCount:100,columnCount:12});
  const expectedHeaders=[RECORD_COLUMNS,LEDGER_COLUMNS,AUDIT_COLUMNS,HISTORY_COLUMNS,[readyControlCell()]];
  for(const workbook of plan.workbooks){
    assert.equal(workbook.parentFolderId,input.drive.rootFolderId,'sandbox workbooks belong directly to the private registered root');
    assert.equal(workbook.tabs.length,5);assert.equal(workbook.initialization.resetExistingControlAllowed,false);
    assert.match(workbook.initialization.requiredPrecondition,/completely-empty/);
    assert.equal(workbook.initialization.requests.length,10);
    for(const tab of workbook.tabs)assert.deepEqual(tab.gridProperties,{rowCount:100,columnCount:12});
    workbook.initialization.requests.slice(0,5).forEach((request,index)=>{
      assert.deepEqual(Object.keys(request),['updateCells']);
      const update=request.updateCells;
      assert.equal(update.start.rowIndex,0);assert.equal(update.start.columnIndex,0);
      assert.equal(update.start.sheetId,workbook.tabs[index].sheetId);assert.equal(update.rows.length,1);
      assert.equal(update.fields,'userEnteredValue');
      assert.deepEqual(update.rows[0].values,expectedHeaders[index].map(value=>({userEnteredValue:{stringValue:value}})));
    });
    workbook.initialization.requests.slice(5).forEach((request,index)=>{
      const protection=request.addProtectedRange.protectedRange;
      assert.deepEqual(protection.range,{sheetId:workbook.tabs[index].sheetId});
      assert.equal(protection.warningOnly,false);assert.equal(protection.editors.domainUsersCanEdit,false);
      assert.deepEqual(protection.editors.users,[input.ownerEmail,input.writer.executionIdentityEmail]);
    });
  }
  assert.deepEqual(JSON.parse(readyControlCell()),{format:'rivya-writer-gate-v1',state:'ready',mutationId:null,requestSha256:null,actorId:null});
  const registrations=JSON.parse(plan.writer.scriptProperties.GW_RESOURCES_JSON);
  assert.equal(Object.keys(registrations).length,4);
  for(const workbook of plan.workbooks){
    assert.deepEqual(registrations[workbook.resource.key],workbook.registration);
    assert.equal(workbook.registration.controlSheetId,input.workbooks[workbook.group].sheetIds.writerControl);
    assert.equal(workbook.registration.maxRows,100);assert.equal(workbook.registration.maxColumns,12);
  }
  assert.deepEqual(Object.keys(plan.writer.scriptProperties),['GW_RESOURCES_JSON']);
  assert.match(plan.writer.signingSecretRequirement,/local HMAC cannot use a network-proxy placeholder/);
  assert.equal(plan.writer.scheduledTriggers,0);
  assert.ok(plan.drive.folders.every(folder=>folder.parentId===input.drive.rootFolderId));
  assert.deepEqual(plan.workbooks[0].tabs.map(tab=>tab.title),Object.values(TAB_SPECS).map(tab=>tab.title));
});

test('isolated installation manifest adds only the explicit HMAC gateway webapp policy',async()=>{
  const path='tools/google-workspace/apps-script/appsscript.json',before=await readFile(path,'utf8');
  const baseline=JSON.parse(before),manifest=isolatedAppsScriptManifest();
  assert.deepEqual(ISOLATED_WEBAPP,{executeAs:'USER_DEPLOYING',access:'ANYONE_ANONYMOUS'});
  assert.deepEqual(manifest,{...baseline,webapp:{...ISOLATED_WEBAPP}});
  assert.deepEqual(manifest.oauthScopes,baseline.oauthScopes,'no OAuth scope expansion');
  assert.equal(Object.hasOwn(baseline,'webapp'),false,'tracked foundation manifest stays unchanged');
  assert.equal(await readFile(path,'utf8'),before);
  assert.deepEqual(buildIsolatedStructuralPlan(registry()).writer.installationManifest,manifest);
  manifest.webapp.access='DOMAIN';
  assert.deepEqual(isolatedAppsScriptManifest().webapp,ISOLATED_WEBAPP,'callers cannot mutate future plans');
});

test('CLI writes private null scaffold, refuses overwrite, and refuses to validate incomplete metadata',async t=>{
  const directory=await mkdtemp(join(tmpdir(),'rivya-isolated-setup-'));
  t.after(()=>rm(directory,{recursive:true,force:true}));
  const output=join(directory,'scaffold.json'),command='tools/google-workspace/isolated-setup.ts';
  const run=promisify(execFile);
  const result=await run(process.execPath,['--import','tsx',command,'prepare','--scaffold','--output',output]);
  assert.equal(JSON.parse(result.stdout).status,'incomplete-scaffold-invalid-until-configured');
  await verifyPrivateFilePermissions(output);
  const original=await readFile(output,'utf8');assert.deepEqual(JSON.parse(original),createIsolatedSetupScaffold());
  await assert.rejects(run(process.execPath,['--import','tsx',command,'prepare','--scaffold','--output',output]),error=>{
    assert.equal(JSON.parse(error.stderr).code,'OUTPUT_EXISTS');return true;
  });
  assert.equal(await readFile(output,'utf8'),original);
  await assert.rejects(run(process.execPath,['--import','tsx',command,'check','--registry',output]),error=>{
    assert.equal(JSON.parse(error.stderr).code,'MISSING_IDENTITY');return true;
  });
  const configured=join(directory,'registry.json');await writeFile(configured,JSON.stringify(registry()),{mode:0o600});
  const checked=await run(process.execPath,['--import','tsx',command,'check','--registry',configured]);
  assert.deepEqual(JSON.parse(checked.stdout),{status:'configuration-valid-not-provider-verified',workbooks:4,folders:9,externalWritesPerformed:0});
  assert.doesNotMatch(checked.stdout,/owner@|registered_/);
  const planFile=join(directory,'plan.json');
  const prepared=await run(process.execPath,['--import','tsx',command,'prepare','--registry',configured,'--output',planFile]);
  assert.equal(JSON.parse(prepared.stdout).status,'structural-plan-prepared-not-installed');
  assert.doesNotMatch(prepared.stdout,/owner@|registered_/);
  await verifyPrivateFilePermissions(planFile);
  assert.deepEqual(JSON.parse(await readFile(planFile,'utf8')),buildIsolatedStructuralPlan(registry()));
});

test('CLI refuses repository-visible output and never reflects malformed registry values',async t=>{
  const directory=await mkdtemp(join(tmpdir(),'rivya-isolated-reject-'));
  t.after(()=>rm(directory,{recursive:true,force:true}));
  const run=promisify(execFile),command='tools/google-workspace/isolated-setup.ts';
  await assert.rejects(run(process.execPath,['--import','tsx',command,'prepare','--scaffold','--output','isolated-private-metadata.json']),error=>{
    assert.equal(JSON.parse(error.stderr).code,'PRIVATE_OUTPUT_REQUIRED');return true;
  });
  const input=registry();input.writer.endpoint='secret-marker-never-log';
  const path=join(directory,'bad.json');await writeFile(path,JSON.stringify(input));
  await assert.rejects(run(process.execPath,['--import','tsx',command,'check','--registry',path]),error=>{
    assert.equal(JSON.parse(error.stderr).code,'INVALID_WRITER');assert.doesNotMatch(error.stderr,/secret-marker/);return true;
  });
});

test('CLI checks resolved parents so ignored and external symlinks cannot expose private metadata in source',async t=>{
  const external=await mkdtemp(join(tmpdir(),'rivya-isolated-symlinks-'));
  await mkdir('test-results',{recursive:true});
  const ignored=await mkdtemp(resolve('test-results/isolated-output-links-'));
  t.after(async()=>{await rm(external,{recursive:true,force:true});await rm(ignored,{recursive:true,force:true});});
  const run=promisify(execFile),command='tools/google-workspace/isolated-setup.ts';
  for(const parent of [external,ignored]){
    const alias=join(parent,'source-alias');await symlink(resolve('src'),alias,process.platform==='win32'?'junction':'dir');
    await assert.rejects(run(process.execPath,['--import','tsx',command,'prepare','--scaffold','--output',join(alias,'isolated-private-metadata.json')]),error=>{
      assert.equal(JSON.parse(error.stderr).code,'PRIVATE_OUTPUT_REQUIRED');return true;
    });
  }
  await assert.rejects(stat(resolve('src/isolated-private-metadata.json')),error=>error.code==='ENOENT');
  const safeAlias=join(external,'ignored-alias');await symlink(ignored,safeAlias,process.platform==='win32'?'junction':'dir');
  await run(process.execPath,['--import','tsx',command,'prepare','--scaffold','--output',join(safeAlias,'safe.json')]);
  await verifyPrivateFilePermissions(join(ignored,'safe.json'));
  assert.deepEqual(JSON.parse(await readFile(join(ignored,'safe.json'),'utf8')),createIsolatedSetupScaffold());
});

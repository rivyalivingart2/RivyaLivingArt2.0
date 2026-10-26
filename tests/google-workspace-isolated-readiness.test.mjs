import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {verifyIsolatedGoogleReadiness} from '../tools/google-workspace/verify-isolated.ts';
import {WORKBOOK_SPECS,DRIVE_FOLDER_SPECS,TAB_SPECS,readyControlCell,isolatedAppsScriptManifest} from '../tools/google-workspace/isolated-setup.ts';

// All identities, IDs and API responses in this file are inert local test inputs.
// These tests do not contact Google or establish real installation/acceptance.
const identity='owner@rivya-acceptance.dev',token='unit-only.private-token';
const registry=()=>({schemaVersion:1,environment:'isolated',ownerEmail:identity,runtimePrincipalEmail:identity,
  writer:{scriptId:'registered_script_2468',deploymentId:'registered_deployment_2468',versionNumber:2,
    endpoint:'https://script.google.com/macros/s/registered_deployment_2468/exec',keyId:'acceptance_v1',executionIdentityEmail:identity},
  workbooks:Object.fromEntries(Object.entries(WORKBOOK_SPECS).map(([key,spec])=>[key,{workbookId:'registered_workbook_'+key+'_2468',resourceKey:spec.resourceKey,sheetIds:{records:1,ledger:2,audit:3,history:4,writerControl:5}}])),
  drive:{rootFolderId:'registered_drive_root_2468',folders:Object.fromEntries(Object.keys(DRIVE_FOLDER_SPECS).map(key=>[key,'registered_folder_'+key+'_2468']))},
});
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
const literal=value=>({userEnteredValue:{stringValue:value},effectiveValue:{stringValue:value}});
const grid=(config,group)=>({spreadsheetId:config.workbooks[group].workbookId,properties:{title:WORKBOOK_SPECS[group].title},
  sheets:Object.entries(TAB_SPECS).map(([key,spec])=>({properties:{sheetId:config.workbooks[group].sheetIds[key],title:spec.title,gridProperties:{rowCount:100,columnCount:12}},
    protectedRanges:[{range:{sheetId:config.workbooks[group].sheetIds[key]},warningOnly:false,editors:{users:[identity],groups:[],domainUsersCanEdit:false}}],
    data:[{startRow:0,startColumn:0,rowData:[{values:(spec.headers??[readyControlCell()]).map(literal)}]}],
  })),
});
function harness(config=registry(),modify=()=>undefined){
  const requests=[];
  const files=new Map();
  files.set(config.drive.rootFolderId,{name:'Rivya Workspace Sandbox',mimeType:'application/vnd.google-apps.folder'});
  for(const [key,id] of Object.entries(config.drive.folders))files.set(id,{name:DRIVE_FOLDER_SPECS[key],mimeType:'application/vnd.google-apps.folder',parents:[config.drive.rootFolderId]});
  for(const [key,entry] of Object.entries(config.workbooks))files.set(entry.workbookId,{name:WORKBOOK_SPECS[key].title,mimeType:'application/vnd.google-apps.spreadsheet',parents:[config.drive.rootFolderId]});
  files.set(config.writer.scriptId,{name:'Private Writer',mimeType:'application/vnd.google-apps.script'});
  const fetch=async(raw,init)=>{
    const url=new URL(raw);requests.push({url,init});
    let body;
    if(url.pathname==='/drive/v3/about')body={user:{emailAddress:config.runtimePrincipalEmail}};
    else if(url.pathname.endsWith('/permissions'))body={permissions:[{type:'user',role:'owner',emailAddress:identity}]};
    else if(url.pathname.startsWith('/drive/v3/files/')){
      const id=url.pathname.split('/').at(-1);assert.ok(files.has(id),'test transport forbids unknown resource reads');
      body={id,...files.get(id),trashed:false,owners:[{emailAddress:identity}]};
    }else if(url.hostname==='sheets.googleapis.com'){
      const group=Object.keys(config.workbooks).find(key=>url.pathname.endsWith(config.workbooks[key].workbookId));assert.ok(group);
      body=grid(config,group);
    }else if(url.pathname.endsWith('/content'))body={scriptId:config.writer.scriptId,files:[
      {name:'Writer',type:'SERVER_JS',source:readFileSync(new URL('../tools/google-workspace/apps-script/Writer.gs',import.meta.url),'utf8')},
      {name:'appsscript',type:'JSON',source:JSON.stringify(isolatedAppsScriptManifest())},
    ]};
    else if(url.pathname.includes('/deployments/'))body={deploymentId:config.writer.deploymentId,
      deploymentConfig:{scriptId:config.writer.scriptId,versionNumber:config.writer.versionNumber,manifestFileName:'appsscript'},
      entryPoints:[{entryPointType:'WEB_APP',webApp:{url:config.writer.endpoint,entryPointConfig:{executeAs:'USER_DEPLOYING',access:'ANYONE_ANONYMOUS'}}}],
    };
    else assert.fail('test transport received an unexpected API operation');
    const override=modify({url,init,body});
    return override instanceof Response ? override : json(body);
  };
  return {requests,run:options=>verifyIsolatedGoogleReadiness(config,{token,fetch,...options})};
}
const check=(result,id)=>result.checks.find(item=>item.id===id);

test('local mocked management audit checks exact registered resources with GET only and leaves full acceptance unrun',async()=>{
  const h=harness(),result=await h.run();
  assert.equal(result.status,'management-checks-passed');assert.equal(result.verificationBoundary,'management-api-reads-only');
  assert.match(result.source.expectedWriterSha256,/^[a-f0-9]{64}$/);assert.match(result.source.expectedIsolatedManifestSha256,/^[a-f0-9]{64}$/);
  assert.ok(result.checks.length>=30);assert.equal(result.acceptance.length,9);assert.ok(result.acceptance.every(item=>item.status==='not-run'));
  assert.deepEqual(result.effects,{googleWrites:0,appConfigurationChanges:0,productsAdded:0,migrations:0});
  assert.equal(h.requests.length,35);
  for(const {url,init} of h.requests){
    assert.ok(['www.googleapis.com','sheets.googleapis.com','script.googleapis.com'].includes(url.hostname));
    assert.equal(init.method,'GET');assert.equal(init.redirect,'manual');assert.equal(init.credentials,'omit');assert.equal(init.body,undefined);
    assert.equal(init.headers.Authorization,'Bearer '+token);
    assert.ok(!url.pathname.endsWith('/files'),'no folder listing or account-wide scans');
  }
  const source=h.requests.find(item=>item.url.pathname.endsWith('/content'));assert.equal(source.url.searchParams.get('versionNumber'),'2');
  const output=JSON.stringify(result);assert.ok(!output.includes(identity));assert.ok(!output.includes(token));assert.ok(!output.includes('registered_'));
});

test('missing token or invalid private registry makes no external requests and returns explicit blockers',async()=>{
  const h=harness(),missing=await h.run({token:undefined});
  assert.equal(missing.status,'blocked');assert.equal(check(missing,'runtime-access').reason,'RIVYA_GOOGLE_ACCESS_TOKEN-missing-or-invalid');assert.equal(h.requests.length,0);
  let calls=0;const invalid=await verifyIsolatedGoogleReadiness({schemaVersion:1},{token,fetch:async()=>{calls++;throw Error('must not fetch');}});
  assert.equal(check(invalid,'registry').status,'blocked');assert.equal(calls,0);
});

test('opaque managed proxy credentials are accepted without being exposed in readiness receipts',async()=>{
  const proxyCredential='proxy:<opaque-local-test-binding>';
  const h=harness(),result=await h.run({token:proxyCredential});
  assert.equal(result.status,'management-checks-passed');assert.ok(h.requests.length>0);
  assert.ok(h.requests.every(({init})=>init.headers.Authorization==='Bearer '+proxyCredential));
  assert.ok(!JSON.stringify(result).includes(proxyCredential));
});

test('unsafe or oversized credential header values fail before any external request',async()=>{
  for(const invalid of ['', ' leading-space', 'embedded space', 'trailing-space ', 'line\rbreak', 'line\nbreak', 'tab\tvalue', 'nul\0value', 'delete\x7fvalue', 'unicode-π', 'x'.repeat(8193)]){
    const h=harness(),result=await h.run({token:invalid});
    assert.equal(result.status,'blocked');assert.equal(check(result,'runtime-access').reason,'RIVYA_GOOGLE_ACCESS_TOKEN-missing-or-invalid');
    assert.equal(h.requests.length,0);
  }
});

test('wrong authenticated account stops before any registered workbook or folder access',async()=>{
  const h=harness(registry(),({url,body})=>{if(url.pathname.endsWith('/about'))body.user.emailAddress='wrong@rivya-acceptance.dev';});
  const result=await h.run();assert.equal(check(result,'runtime-account').reason,'runtime-account-mismatch');assert.equal(h.requests.length,1);
  assert.equal(check(result,'registered-resource-reads').status,'not-run');
});

test('access denials, redirects and network exceptions never surface provider diagnostics',async()=>{
  for(const response of [json({private:'secret-token owner@private.invalid'},403),new Response(null,{status:302,headers:{Location:'https://evil.invalid/private'}})]){
    const h=harness(registry(),()=>response);const result=await h.run();assert.equal(result.status,'blocked');assert.equal(h.requests.length,1);
    assert.doesNotMatch(JSON.stringify(result),/secret-token|private.invalid|evil.invalid/);
  }
  const result=await verifyIsolatedGoogleReadiness(registry(),{token,fetch:async()=>{throw Error('private-secret registered_workbook_content_2468');}});
  assert.equal(check(result,'runtime-account').reason,'provider-read-failed');assert.doesNotMatch(JSON.stringify(result),/private-secret|registered_workbook/);
});

test('bounded request handles a transport that ignores cancellation',async()=>{
  const begin=Date.now();const result=await verifyIsolatedGoogleReadiness(registry(),{token,timeoutMs:10,fetch:()=>new Promise(()=>{})});
  assert.equal(check(result,'runtime-account').reason,'request-timeout');assert.ok(Date.now()-begin<1000);
});

test('oversized JSON is rejected before parsing private response content',async()=>{
  const result=await harness(registry(),()=>json({private:'sensitive'.repeat(100)})).run({maxResponseBytes:100});
  assert.equal(check(result,'runtime-account').reason,'response-too-large');assert.doesNotMatch(JSON.stringify(result),/sensitive/);
});

test('public/domain sharing, absent permissions and paginated permission evidence are blocked',async()=>{
  const variants=[{permissions:[{type:'anyone',role:'reader'}]},{permissions:[{type:'domain',role:'reader'}]},{permissions:[]},{permissions:[{type:'user',role:'owner',emailAddress:identity}],nextPageToken:'private-page'}];
  for(const variant of variants){
    const h=harness(registry(),({url})=>url.pathname.endsWith('/permissions')?json(variant):undefined);
    const result=await h.run();assert.equal(check(result,'drive.root.permissions').status,'blocked');assert.equal(result.status,'blocked');assert.doesNotMatch(JSON.stringify(result),/private-page/);
    assert.equal(h.requests.length,3);assert.equal(check(result,'registered-resource-reads').status,'not-run');
  }
});

test('wrong owner and wrong child/workbook parent fail without reading file contents',async()=>{
  const h=harness(registry(),({url,body})=>{
    if(url.pathname.includes('/files/')&&!url.pathname.endsWith('/permissions')){
      if(body.mimeType==='application/vnd.google-apps.spreadsheet')body.parents=['outside_private_folder_2468'];
      else if(body.name==='Originals')body.owners=[{emailAddress:'unknown@rivya-acceptance.dev'}];
    }
  });
  const result=await h.run();assert.equal(check(result,'drive.originals.metadata').reason,'resource-owner-mismatch');
  assert.equal(check(result,'workbook.content.metadata').reason,'resource-parent-mismatch');
  assert.ok(h.requests.every(({url})=>url.searchParams.get('alt')!=='media'));
  assert.ok(h.requests.every(({url})=>url.hostname!=='sheets.googleapis.com'),'wrong workbook parent prevents reading cell data');
  assert.equal(check(result,'workbook.content.structure').status,'not-run');
});

test('unprotected sheets, formulas, bad headers, wrong dimensions and pre-existing data block readiness',async()=>{
  const mutations=[
    body=>{body.sheets[0].protectedRanges=[];},
    body=>{body.sheets[0].protectedRanges[0].warningOnly=true;},
    body=>{body.sheets[0].data[0].rowData[0].values[0]={userEnteredValue:{formulaValue:'=1'},effectiveValue:{numberValue:1}};},
    body=>{body.sheets[0].data[0].rowData[0].values[0]=literal('wrong_header');},
    body=>{body.sheets[0].properties.gridProperties.rowCount=1000;},
    body=>{body.sheets[0].data[0].rowData.push({values:[literal('already-populated')]});},
    body=>{body.sheets[4].data[0].rowData[0].values=[literal('{"state":"committed"}')];},
  ];
  for(const mutate of mutations){
    const h=harness(registry(),({url,body})=>{if(url.hostname==='sheets.googleapis.com')mutate(body);});
    const result=await h.run();assert.equal(check(result,'workbook.content.structure').status,'blocked');assert.equal(result.status,'blocked');
  }
});

test('Google omitted zero sheetId in a protected GridRange verifies the registered zero sheet',async()=>{
  const config=registry();for(const workbook of Object.values(config.workbooks))workbook.sheetIds.records=0;
  const h=harness(config,({url,body})=>{
    if(url.hostname==='sheets.googleapis.com')body.sheets[0].protectedRanges[0].range={};
  });
  const result=await h.run();assert.equal(result.status,'management-checks-passed');
  for(const group of Object.keys(WORKBOOK_SPECS))assert.equal(check(result,'workbook.'+group+'.structure').status,'passed');
});

test('omitted GridRange sheetId cannot match nonzero sheets and malformed zero ranges remain rejected',async()=>{
  const nonzero=await harness(registry(),({url,body})=>{
    if(url.hostname==='sheets.googleapis.com')body.sheets[0].protectedRanges[0].range={};
  }).run();
  assert.equal(check(nonzero,'workbook.content.structure').reason,'canonical-sheet-protection-unverified');
  for(const range of [undefined,null,[],{sheetId:null},{sheetId:'0'},{sheetId:-1},{sheetId:0.5},{sheetId:2}]){
    const config=registry();for(const workbook of Object.values(config.workbooks))workbook.sheetIds.records=0;
    const result=await harness(config,({url,body})=>{
      if(url.hostname==='sheets.googleapis.com')body.sheets[0].protectedRanges[0].range=range;
    }).run();
    assert.equal(check(result,'workbook.content.structure').reason,'canonical-sheet-protection-unverified');
    assert.equal(result.status,'blocked');
  }
});

test('deployed version and exact source must match; current HEAD source cannot stand in for versioned source',async()=>{
  for(const mutation of [
    ({url,body})=>{if(url.pathname.includes('/deployments/'))body.deploymentConfig.versionNumber=1;},
    ({url,body})=>{if(url.pathname.endsWith('/content'))body.files[0].source+='\nfunction unreviewed(){}';},
    ({url,body})=>{if(url.pathname.endsWith('/content'))body.files.push({name:'Extra',type:'SERVER_JS',source:'function doPost(){}'});},
    ({url,body})=>{if(url.pathname.includes('/deployments/'))body.entryPoints[0].webApp.entryPointConfig.executeAs='USER_ACCESSING';},
    ({url,body})=>{if(url.pathname.endsWith('/content')){const manifest=JSON.parse(body.files[1].source);manifest.oauthScopes.push('https://www.googleapis.com/auth/drive');body.files[1].source=JSON.stringify(manifest);}},
    ({url,body})=>{if(url.pathname.endsWith('/content')){const manifest=JSON.parse(body.files[1].source);delete manifest.webapp;body.files[1].source=JSON.stringify(manifest);}},
  ]){
    const result=await harness(registry(),mutation).run();assert.equal(result.status,'blocked');assert.ok(result.checks.some(item=>item.id.startsWith('apps-script.')&&item.status==='blocked'));
  }
});

test('wrong script owner stops before deployment metadata or versioned source is fetched',async()=>{
  const h=harness(registry(),({url,body})=>{if(url.pathname.endsWith('/registered_script_2468'))body.owners=[{emailAddress:'other@rivya-acceptance.dev'}];});
  const result=await h.run();assert.equal(check(result,'apps-script.project.metadata').status,'blocked');
  assert.equal(check(result,'apps-script.deployed-source').status,'not-run');assert.ok(h.requests.every(({url})=>url.hostname!=='script.googleapis.com'));
});

test('CLI with no private registry fails closed and prints only a sanitized readiness receipt',async()=>{
  try {
    await promisify(execFile)(process.execPath,['--import','tsx','tools/google-workspace/verify-isolated.ts'],{
      cwd:new URL('..',import.meta.url),env:{...process.env,RIVYA_GOOGLE_REGISTRY_PATH:'',RIVYA_GOOGLE_ACCESS_TOKEN:''},timeout:10000,
    });
    assert.fail('missing registry must produce nonzero exit');
  } catch(error){
    assert.equal(error.code,1);const result=JSON.parse(error.stdout);assert.equal(result.status,'blocked');
    assert.equal(check(result,'registry').reason,'private-registry-missing-unreadable-or-invalid');assert.equal(error.stderr,'');
  }
});

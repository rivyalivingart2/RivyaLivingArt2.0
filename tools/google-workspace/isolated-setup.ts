import {readFileSync} from 'node:fs';
import {readFile, mkdir, open, realpath} from 'node:fs/promises';
import {resolve, dirname, basename, relative, isAbsolute, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {RECORD_COLUMNS, canonicalArtifactJson} from '../../src/lib/google-workspace/record-codec';
import {LEDGER_COLUMNS, AUDIT_COLUMNS, HISTORY_COLUMNS} from '../../src/lib/google-workspace/controlled-writer';

/** Structural preparation only. This module never contacts Google, creates a key,
 * seeds data, installs a provider, or establishes that target metadata is real.
 * Actual identities, ownership and installation require the read-only verifier. */
export const WORKBOOK_SPECS = {
  content: {title:'Rivya Workspace Sandbox — Content',resourceKey:'sandbox_content_probe'},
  operations: {title:'Rivya Workspace Sandbox — Operations',resourceKey:'sandbox_operations_probe'},
  security: {title:'Rivya Workspace Sandbox — Security',resourceKey:'sandbox_security_probe'},
  system: {title:'Rivya Workspace Sandbox — System',resourceKey:'sandbox_system_probe'},
} as const;
export const DRIVE_FOLDER_SPECS = {
  originals:'Originals',derivatives:'Derivatives',privateAttachments:'Private Attachments',
  publicationSnapshots:'Publication Snapshots',catalogueTemplates:'Catalogue Templates',
  catalogueOutputs:'Catalogue Outputs',jobs:'Jobs',recovery:'Recovery',
} as const;
export const TAB_SPECS = {
  records:{title:'records',headers:RECORD_COLUMNS},ledger:{title:'ledger',headers:LEDGER_COLUMNS},
  audit:{title:'audit',headers:AUDIT_COLUMNS},history:{title:'history',headers:HISTORY_COLUMNS},
  writerControl:{title:'writer_control',headers:null},
} as const;
export const GRID = {rowCount:100,columnCount:12} as const;
export const DRIVE_ROOT_NAME = 'Rivya Workspace Sandbox';
/** The HTTP entry point accepts the server's HMAC envelope, not Google login.
 * The deployment owner executes the script; underlying resources stay private. */
export const ISOLATED_WEBAPP = {executeAs:'USER_DEPLOYING',access:'ANYONE_ANONYMOUS'} as const;
export function isolatedAppsScriptManifest():Record<string,unknown>{
  const baseline=JSON.parse(readFileSync(new URL('./apps-script/appsscript.json',import.meta.url),'utf8')) as Record<string,unknown>;
  return {...baseline,webapp:{...ISOLATED_WEBAPP}};
}
export type WorkbookGroup = keyof typeof WORKBOOK_SPECS;
export type DriveFolderKey = keyof typeof DRIVE_FOLDER_SPECS;
export type TabKey = keyof typeof TAB_SPECS;
export type IsolatedSetupRegistry = {
  schemaVersion:1; environment:'isolated'; ownerEmail:string; runtimePrincipalEmail:string;
  writer:{scriptId:string;deploymentId:string;versionNumber:number;endpoint:string;keyId:string;executionIdentityEmail:string};
  workbooks:Record<WorkbookGroup,{workbookId:string;resourceKey:string;sheetIds:Record<TabKey,number>}>;
  drive:{rootFolderId:string;folders:Record<DriveFolderKey,string>};
};
export type IsolatedSetupErrorCode = 'INVALID_REGISTRY'|'MISSING_IDENTITY'|'INVALID_TARGET'|'DUPLICATE_TARGET'|'INVALID_SHEET_IDS'|'INVALID_WRITER'|'INVALID_ARGUMENTS'|'PRIVATE_OUTPUT_REQUIRED'|'OUTPUT_EXISTS'|'FILE_UNAVAILABLE';
export class IsolatedSetupError extends Error {
  constructor(public readonly code:IsolatedSetupErrorCode){super(`Isolated Google setup: ${code}.`);this.name='IsolatedSetupError';}
}
function fail(code:IsolatedSetupErrorCode):never{throw new IsolatedSetupError(code);}
const keys = <T extends object>(value:T)=>Object.keys(value) as (keyof T)[];
function exact(value:unknown,expected:readonly string[]): asserts value is Record<string,unknown>{
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.getPrototypeOf(value)!==Object.prototype||
    Object.keys(value).sort().join('|')!==[...expected].sort().join('|'))fail('INVALID_REGISTRY');
}
const placeholders=/(?:^|[_-])(?:fixture|example|placeholder|replace|changeme|todo|dummy|sample|local|your)(?:[_-]|$)|^(?:your|replaceWith|insertHere)/i;
function googleId(value:unknown):asserts value is string{
  if(typeof value!=='string'||!/^[A-Za-z0-9_-]{10,160}$/.test(value)||placeholders.test(value)||/^(.)\1+$/.test(value))fail('INVALID_TARGET');
}
function email(value:unknown):asserts value is string{
  if(typeof value!=='string'||value.length>254||!/^[-A-Za-z0-9.!#$%&'*+/=?^_`{|}~]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/.test(value)||
    /@(?:[^@]+\.)?(?:example\.(?:com|net|org)|localhost)$|\.(?:invalid|test)$/i.test(value)||value!==value.trim())fail('MISSING_IDENTITY');
}
/** Validate explicit private metadata, not Google existence or authorization.
 * Null scaffold values, sample IDs, unknown fields and secret fields fail closed. */
export function validateIsolatedSetupRegistry(input:unknown):IsolatedSetupRegistry{
  exact(input,['schemaVersion','environment','ownerEmail','runtimePrincipalEmail','writer','workbooks','drive']);
  if(input.schemaVersion!==1||input.environment!=='isolated')fail('INVALID_REGISTRY');
  email(input.ownerEmail);email(input.runtimePrincipalEmail);
  exact(input.writer,['scriptId','deploymentId','versionNumber','endpoint','keyId','executionIdentityEmail']);
  googleId(input.writer.scriptId);googleId(input.writer.deploymentId);email(input.writer.executionIdentityEmail);
  if(!Number.isSafeInteger(input.writer.versionNumber)||Number(input.writer.versionNumber)<1||
    typeof input.writer.keyId!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(input.writer.keyId)||placeholders.test(input.writer.keyId)||
    input.writer.endpoint!==`https://script.google.com/macros/s/${input.writer.deploymentId}/exec`)fail('INVALID_WRITER');
  exact(input.workbooks,keys(WORKBOOK_SPECS));
  const targetIds=new Set<string>();
  const unique=(id:unknown)=>{googleId(id);if(targetIds.has(id))fail('DUPLICATE_TARGET');targetIds.add(id);};
  for(const group of keys(WORKBOOK_SPECS)){
    const workbook=input.workbooks[group];exact(workbook,['workbookId','resourceKey','sheetIds']);
    unique(workbook.workbookId);
    if(workbook.resourceKey!==WORKBOOK_SPECS[group].resourceKey)fail('INVALID_REGISTRY');
    exact(workbook.sheetIds,keys(TAB_SPECS));
    const ids=Object.values(workbook.sheetIds);
    if(ids.some(id=>!Number.isSafeInteger(id)||Number(id)<0||Number(id)>2_147_483_647)||new Set(ids).size!==ids.length)fail('INVALID_SHEET_IDS');
  }
  exact(input.drive,['rootFolderId','folders']);unique(input.drive.rootFolderId);
  exact(input.drive.folders,keys(DRIVE_FOLDER_SPECS));
  for(const key of keys(DRIVE_FOLDER_SPECS))unique(input.drive.folders[key]);
  // Return an independent copy so callers cannot widen a checked registration.
  return JSON.parse(canonicalArtifactJson(input)) as IsolatedSetupRegistry;
}

/** Incomplete metadata is intentionally null. This is never a usable registry. */
export function createIsolatedSetupScaffold(ownerEmail?:string){
  if(ownerEmail!==undefined)email(ownerEmail);
  return {
    schemaVersion:1,environment:'isolated',ownerEmail:ownerEmail??null,runtimePrincipalEmail:ownerEmail??null,
    writer:{scriptId:null,deploymentId:null,versionNumber:null,endpoint:null,keyId:null,executionIdentityEmail:ownerEmail??null},
    workbooks:Object.fromEntries(keys(WORKBOOK_SPECS).map(group=>[group,{
      workbookId:null,resourceKey:WORKBOOK_SPECS[group].resourceKey,
      sheetIds:Object.fromEntries(keys(TAB_SPECS).map(key=>[key,null])),
    }])),
    drive:{rootFolderId:null,folders:Object.fromEntries(keys(DRIVE_FOLDER_SPECS).map(key=>[key,null]))},
  };
}

export function readyControlCell(){
  return canonicalArtifactJson({format:'rivya-writer-gate-v1',state:'ready',mutationId:null,requestSha256:null,actorId:null});
}
/** Reviewable payloads for structural initialization. They are not executed here.
 * Every target must first be independently verified EMPTY; an already populated
 * or initialized tab must never receive these writes or have its control reset. */
export function buildIsolatedStructuralPlan(input:unknown){
  const registry=validateIsolatedSetupRegistry(input);
  const editorEmails=[...new Set([registry.ownerEmail,registry.writer.executionIdentityEmail])];
  const registrations:Record<string,unknown>={};
  const workbooks=keys(WORKBOOK_SPECS).map(group=>{
    const selected=registry.workbooks[group],ids=selected.sheetIds;
    const resource={key:selected.resourceKey,workbookId:selected.workbookId,recordSheetId:ids.records,
      ledgerSheetId:ids.ledger,auditSheetId:ids.audit,historySheetId:ids.history};
    const registration={...resource,controlSheetId:ids.writerControl,maxRows:GRID.rowCount,maxColumns:GRID.columnCount};
    registrations[selected.resourceKey]=registration;
    const tabs=keys(TAB_SPECS).map(key=>({key,title:TAB_SPECS[key].title,sheetId:ids[key],gridProperties:{...GRID}}));
    const headers=keys(TAB_SPECS).map(key=>({updateCells:{
      start:{sheetId:ids[key],rowIndex:0,columnIndex:0},
      rows:[{values:(TAB_SPECS[key].headers??[readyControlCell()]).map(value=>({userEnteredValue:{stringValue:value}}))}],
      fields:'userEnteredValue',
    }}));
    const protections=keys(TAB_SPECS).map(key=>({addProtectedRange:{protectedRange:{
      range:{sheetId:ids[key]},description:'Rivya canonical data: controlled writer only',
      warningOnly:false,editors:{users:editorEmails,domainUsersCanEdit:false},
    }}}));
    return {group,title:WORKBOOK_SPECS[group].title,workbookId:selected.workbookId,parentFolderId:registry.drive.rootFolderId,resource,registration,tabs,
      initialization:{requiredPrecondition:'all-registered-tabs-completely-empty-with-exact-grid-and-reviewed-identity',
        resetExistingControlAllowed:false,requests:[...headers,...protections]}};
  });
  return {
    schemaVersion:1,kind:'rivya-isolated-structural-plan',status:'prepared-not-installed',
    googleExistenceVerified:false,externalWritesPerformed:0,businessRowsIncluded:0,
    workbooks,drive:{root:{id:registry.drive.rootFolderId,name:DRIVE_ROOT_NAME},
      folders:keys(DRIVE_FOLDER_SPECS).map(key=>({key,id:registry.drive.folders[key],name:DRIVE_FOLDER_SPECS[key],parentId:registry.drive.rootFolderId})),
      sharing:'private-owner-and-approved-service-identities-only'},
    writer:{...registry.writer,source:'tools/google-workspace/apps-script/Writer.gs',
      manifest:'tools/google-workspace/apps-script/appsscript.json',
      installationManifest:isolatedAppsScriptManifest(),
      requiredAdvancedService:{userSymbol:'Sheets',serviceId:'sheets',version:'v4'},
      scriptProperties:{GW_RESOURCES_JSON:canonicalArtifactJson(registrations)},
      missingPrivateSecretProperty:'GW_KEYS_JSON',
      signingSecretRequirement:'Actual secure runtime key matching private Script Properties; local HMAC cannot use a network-proxy placeholder.',
      scheduledTriggers:0},
  };
}

async function readRegistry(path:string){
  let text:string;
  try{text=await readFile(path,'utf8');}catch{return fail('FILE_UNAVAILABLE');}
  if(Buffer.byteLength(text)>1_000_000)fail('INVALID_REGISTRY');
  try{return JSON.parse(text) as unknown;}catch{return fail('INVALID_REGISTRY');}
}
async function privateOutput(path:string,value:unknown){
  const target=resolve(path),repo=fileURLToPath(new URL('../../',import.meta.url));
  try{
    await mkdir(dirname(target),{recursive:true,mode:0o700});
    // Resolve parent links before checking privacy, then open that checked path.
    // An ignored alias or /tmp alias must not redirect metadata into tracked source.
    const actualParent=await realpath(dirname(target)),actualRepo=await realpath(repo);
    const actualTarget=resolve(actualParent,basename(target)),fromRepo=relative(actualRepo,actualTarget);
    if(fromRepo===''||fromRepo!=='..'&&!fromRepo.startsWith(`..${sep}`)&&!isAbsolute(fromRepo)){
      try{execFileSync('git',['check-ignore','--no-index','--quiet','--',actualTarget],{cwd:actualRepo,stdio:'ignore'});}
      catch{return fail('PRIVATE_OUTPUT_REQUIRED');}
    }
    const handle=await open(actualTarget,'wx',0o600);
    try{await handle.writeFile(JSON.stringify(value,null,2)+'\n');}finally{await handle.close();}
  }catch(error){
    if(error instanceof IsolatedSetupError)throw error;
    if((error as NodeJS.ErrnoException).code==='EEXIST')fail('OUTPUT_EXISTS');return fail('FILE_UNAVAILABLE');
  }
}
export async function isolatedSetupCli(args:readonly string[]){
  if(args.length===1&&args[0]==='--help'){
    console.log('node --import tsx tools/google-workspace/isolated-setup.ts prepare --scaffold [--owner-email <owner>] --output <private.json>\nnode --import tsx tools/google-workspace/isolated-setup.ts prepare --registry <private.json> --output <private-plan.json>\nnode --import tsx tools/google-workspace/isolated-setup.ts check --registry <private.json>');return;
  }
  const [mode,...rest]=args;
  if(mode!=='prepare'&&mode!=='check')fail('INVALID_ARGUMENTS');
  const options=new Map<string,string|true>();
  for(let i=0;i<rest.length;i++){
    const key=rest[i];if(!['--registry','--output','--scaffold','--owner-email'].includes(key)||options.has(key))fail('INVALID_ARGUMENTS');
    if(key==='--scaffold'){options.set(key,true);continue;}
    const value=rest[++i];if(!value||value.startsWith('--'))fail('INVALID_ARGUMENTS');options.set(key,value);
  }
  const registryPath=options.get('--registry'),outputPath=options.get('--output'),scaffold=options.has('--scaffold'),ownerEmail=options.get('--owner-email');
  if(mode==='check'){
    if(typeof registryPath!=='string'||outputPath||scaffold||ownerEmail)fail('INVALID_ARGUMENTS');
    validateIsolatedSetupRegistry(await readRegistry(registryPath));
    console.log(JSON.stringify({status:'configuration-valid-not-provider-verified',workbooks:4,folders:9,externalWritesPerformed:0}));return;
  }
  if(typeof outputPath!=='string'||scaffold===Boolean(registryPath)||ownerEmail&&!scaffold)fail('INVALID_ARGUMENTS');
  const output=scaffold?createIsolatedSetupScaffold(ownerEmail as string|undefined):buildIsolatedStructuralPlan(await readRegistry(registryPath as string));
  await privateOutput(outputPath,output);
  console.log(JSON.stringify({status:scaffold?'incomplete-scaffold-invalid-until-configured':'structural-plan-prepared-not-installed',externalWritesPerformed:0}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  isolatedSetupCli(process.argv.slice(2)).catch(error=>{
    console.error(JSON.stringify({status:'blocked',code:error instanceof IsolatedSetupError?error.code:'FILE_UNAVAILABLE',externalWritesPerformed:0}));
    process.exitCode=1;
  });
}

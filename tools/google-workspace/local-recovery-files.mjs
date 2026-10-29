/** Local recovery filesystem/key protection. No provider or service operations. */
import {mkdir, open, lstat, realpath, readFile, chmod} from 'node:fs/promises';
import {resolve, relative, sep, join, dirname, isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync, spawn} from 'node:child_process';
import {restrictPrivateFilePermissions, verifyPrivateFilePermissions} from './private-file.ts';

const repo=fileURLToPath(new URL('../../',import.meta.url));
const fail=()=>{throw Error('RECOVERY_PRIVATE_PATH_OR_PERMISSIONS');};
const shell=()=>join(process.env.SystemRoot??'C:/Windows','System32/WindowsPowerShell/v1.0/powershell.exe');
const env=()=>Object.fromEntries(Object.entries(process.env).filter(([key])=>/^(?:Path|PATH|SystemRoot|SYSTEMROOT|WINDIR|TEMP|TMP|USERPROFILE|APPDATA|LOCALAPPDATA)$/i.test(key)));
const args=script=>['-NoProfile','-NonInteractive','-EncodedCommand',Buffer.from(script,'utf16le').toString('base64')];
const literal=value=>"'"+value.replaceAll("'","''")+"'";

/** An ignored repository path is necessary but not sufficient: reject links,
 * traversal outside test-results and any tracked destination. */
export async function assertRecoveryPath(path,{exists=false,directory=false}={}){
  const root=resolve(repo,'test-results'),target=resolve(path),inside=relative(root,target);
  if(!inside||isAbsolute(inside)||inside==='..'||inside.startsWith(`..${sep}`)||resolve(root,inside)!==target)fail();
  try{
    execFileSync('git',['check-ignore','--no-index','--quiet','--',target],{cwd:repo,stdio:'ignore',windowsHide:true});
    // An ignore pattern still matches a previously tracked, now missing path.
    // Reject that path (or a directory containing tracked descendants) before
    // any private file can be created there. Literal pathspecs avoid wildcards.
    let tracked=false;
    try{execFileSync('git',['--literal-pathspecs','ls-files','--error-unmatch','--',target],{cwd:repo,stdio:'ignore',windowsHide:true});tracked=true;}
    catch(error){if(error?.status!==1)fail();}
    if(tracked)fail();
    let current=root;
    if((await lstat(root)).isSymbolicLink()||await realpath(root)!==root)fail();
    for(const part of inside.split(sep)){
      current=join(current,part);
      try{if((await lstat(current)).isSymbolicLink())fail();}
      catch(error){if(error?.code!=='ENOENT')throw error;if(exists)fail();break;}
    }
    if(exists){const info=await lstat(target);if(directory?!info.isDirectory():!info.isFile())fail();}
  }catch{fail();}
  return target;
}

async function directoryPermissions(path,restrict){
  if(process.platform!=='win32'){
    if(restrict)await chmod(path,0o700);
    if(((await lstat(path)).mode&0o777)!==0o700)fail();
    return;
  }
  const script=`$ErrorActionPreference='Stop'
    $identity=[System.Security.Principal.WindowsIdentity]::GetCurrent().User
    $target=${literal(path)}
    ${restrict?`$acl=New-Object System.Security.AccessControl.DirectorySecurity
    $acl.SetOwner($identity)
    $acl.SetAccessRuleProtection($true,$false)
    $rule=New-Object System.Security.AccessControl.FileSystemAccessRule($identity,'FullControl','ContainerInherit,ObjectInherit','None','Allow')
    $acl.AddAccessRule($rule)
    Set-Acl -LiteralPath $target -AclObject $acl`:''}
    $actual=Get-Acl -LiteralPath $target
    if(-not $actual.AreAccessRulesProtected -or $actual.GetOwner([System.Security.Principal.SecurityIdentifier]).Value -ne $identity.Value){exit 2}
    $rules=@($actual.GetAccessRules($true,$true,[System.Security.Principal.SecurityIdentifier]))
    if($rules.Count -ne 1){exit 3}
    $one=$rules[0]
    if($one.IsInherited -or $one.IdentityReference.Value -ne $identity.Value -or $one.AccessControlType -ne 'Allow' -or $one.FileSystemRights -ne 'FullControl' -or $one.InheritanceFlags.ToString() -ne 'ContainerInherit, ObjectInherit'){exit 4}`;
  try{execFileSync(shell(),args(script),{env:env(),stdio:'ignore',windowsHide:true,timeout:15000});}catch{fail();}
}

/** Creates one NEW owner-only directory; parent must already exist. Never
 * replaces an old checkpoint or changes permissions on an existing directory. */
export async function createPrivateRecoveryDirectory(path){
  const target=await assertRecoveryPath(path);
  try{await realpath(dirname(target));await mkdir(target,{mode:0o700});await directoryPermissions(target,true);}
  catch{fail();}
  return target;
}
export async function verifyPrivateRecoveryDirectory(path){
  const target=await assertRecoveryPath(path,{exists:true,directory:true});
  await directoryPermissions(target,false);return target;
}
export async function writePrivateRecoveryFile(path,bytes){
  const target=await assertRecoveryPath(path);
  await verifyPrivateRecoveryDirectory(dirname(target));
  const handle=await open(target,'wx',0o600);
  try{await restrictPrivateFilePermissions(target);await handle.writeFile(bytes);await handle.sync();}
  finally{await handle.close();}
  await verifyPrivateFilePermissions(target);
  return target;
}
export async function readPrivateRecoveryFile(path,maxBytes){
  const target=await assertRecoveryPath(path,{exists:true});
  await verifyPrivateRecoveryDirectory(dirname(target));
  await verifyPrivateFilePermissions(target);
  const size=(await lstat(target)).size;if(size<1||size>maxBytes)throw Error('RECOVERY_FILE_BUDGET');
  const bytes=await readFile(target);if(bytes.length!==size)throw Error('RECOVERY_FILE_CHANGED');return bytes;
}

async function dpapi(operation,bytes){
  if(process.platform!=='win32')throw Error('RECOVERY_WINDOWS_DPAPI_REQUIRED');
  if(!Buffer.isBuffer(bytes)||bytes.length<1||bytes.length>65536)throw Error('RECOVERY_KEY_INVALID');
  const script=`$ErrorActionPreference='Stop'
    Add-Type -AssemblyName System.Security
    $data=[Convert]::FromBase64String([Console]::In.ReadToEnd())
    $entropy=[Text.Encoding]::UTF8.GetBytes('Rivya.SourceRecords.LocalRecovery.v1')
    $result=[Security.Cryptography.ProtectedData]::${operation}($data,$entropy,[Security.Cryptography.DataProtectionScope]::CurrentUser)
    [Console]::Out.Write([Convert]::ToBase64String($result))
    [Array]::Clear($data,0,$data.Length)
    [Array]::Clear($result,0,$result.Length)`;
  return new Promise((accept,reject)=>{
    let output='',failed=false;
    const child=spawn(shell(),args(script),{env:env(),windowsHide:true,stdio:['pipe','pipe','pipe']});
    const stop=()=>{if(failed)return;failed=true;child.kill();reject(Error('RECOVERY_KEY_PROTECTION_FAILED'));};
    const timer=setTimeout(stop,15000);
    child.once('error',stop);child.stdin.once('error',stop);
    child.stdout.on('data',chunk=>{output+=chunk.toString('ascii');if(output.length>100000)stop();});
    child.stderr.resume(); // Never propagate PowerShell diagnostics or key material.
    child.once('close',code=>{clearTimeout(timer);if(failed)return;if(code!==0||!/^[A-Za-z0-9+/]+={0,2}$/.test(output)){stop();return;}accept(Buffer.from(output,'base64'));});
    child.stdin.end(bytes.toString('base64'));
  });
}
export const windowsDpapiKeyProtection=Object.freeze({id:'windows-dpapi-current-user-v1',protect:key=>dpapi('Protect',key),unprotect:value=>dpapi('Unprotect',value)});

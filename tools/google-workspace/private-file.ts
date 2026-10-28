import {chmod, stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {join, resolve} from 'node:path';

/** Run the Windows ACL operation without a shell or inherited output. The file
 * is still empty when permissions are restricted; private bytes are written only
 * after native readback confirms an owner-only, non-inherited allow list. */
function windowsPermissions(path: string, restrict: boolean): void {
  const literal = "'" + resolve(path).replaceAll("'", "''") + "'";
  const script = `
    $ErrorActionPreference = 'Stop'
    $ProgressPreference = 'SilentlyContinue'
    $identity = [System.Security.Principal.WindowsIdentity]::GetCurrent().User
    $target = ${literal}
    ${restrict ? `
      $acl = New-Object System.Security.AccessControl.FileSecurity
      $acl.SetOwner($identity)
      $acl.SetAccessRuleProtection($true, $false)
      $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($identity, 'FullControl', 'Allow')
      $acl.AddAccessRule($rule)
      Set-Acl -LiteralPath $target -AclObject $acl
    ` : ''}
    $actual = Get-Acl -LiteralPath $target
    if (-not $actual.AreAccessRulesProtected) { exit 2 }
    if ($actual.GetOwner([System.Security.Principal.SecurityIdentifier]).Value -ne $identity.Value) { exit 3 }
    $rules = @($actual.GetAccessRules($true, $true, [System.Security.Principal.SecurityIdentifier]))
    if ($rules.Count -ne 1) { exit 4 }
    $one = $rules[0]
    if ($one.IsInherited -or $one.IdentityReference.Value -ne $identity.Value -or $one.AccessControlType -ne 'Allow' -or $one.FileSystemRights -ne 'FullControl') { exit 5 }
  `;
  try {
    execFileSync(join(process.env.SystemRoot ?? 'C:/Windows', 'System32/WindowsPowerShell/v1.0/powershell.exe'),
      ['-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(script, 'utf16le').toString('base64')],
      {stdio: 'ignore', windowsHide: true, timeout: 15_000,
        // Do not autoload incompatible PowerShell 7 modules in Windows PowerShell.
        env: {...process.env, PSModulePath: join(process.env.SystemRoot ?? 'C:/Windows', 'System32/WindowsPowerShell/v1.0/Modules')}});
  } catch { throw new Error('PRIVATE_FILE_PERMISSIONS_UNVERIFIED'); }
}

export async function verifyPrivateFilePermissions(path: string): Promise<void> {
  if (process.platform === 'win32') return windowsPermissions(path, false);
  if (((await stat(path)).mode & 0o777) !== 0o600) throw new Error('PRIVATE_FILE_PERMISSIONS_UNVERIFIED');
}

export async function restrictPrivateFilePermissions(path: string): Promise<void> {
  if (process.platform === 'win32') return windowsPermissions(path, true);
  await chmod(path, 0o600);
  await verifyPrivateFilePermissions(path);
}

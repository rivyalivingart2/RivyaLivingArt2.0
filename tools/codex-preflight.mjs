/** Read-only repository/source inventory. Never fetches, writes or runs package scripts. */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, lstatSync, realpathSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';

export const EXPECTED_REPOSITORY = 'rivyalivingart2/RivyaLivingArt2.0';
const ENTRY_POINTS = [
  'src/app/layout.tsx', 'src/app/layout.jsx', 'src/app/layout.js',
  'app/layout.tsx', 'app/layout.jsx', 'app/layout.js',
  'src/pages/_app.tsx', 'src/pages/index.tsx', 'pages/_app.tsx', 'pages/index.tsx',
];
const LOCKFILES = ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lock', 'bun.lockb'];

/** Return only a normalized repository identity, never credentials/query strings. */
export function repositoryIdentity(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const raw = value.trim();
  const scp = raw.match(/^git@github\.com:([\w.-]+\/[\w.-]+)$/i);
  let path;
  if (scp) path = scp[1];
  else {
    try {
      const url = new URL(raw);
      if (!['https:', 'ssh:'].includes(url.protocol) || url.hostname.toLowerCase() !== 'github.com') return null;
      if (url.port && !['22', '443'].includes(url.port)) return null;
      path = url.pathname.replace(/^\//, '');
    } catch { return null; }
  }
  path = path.replace(/\/$/, '').replace(/\.git$/i, '');
  return /^[\w.-]+\/[\w.-]+$/.test(path) ? path : null;
}

function git(cwd, args) {
  try {
    return execFileSync('git', ['-C', cwd, ...args], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 5000,
      maxBuffer: 512 * 1024,
    }).trim();
  } catch { return null; } // Do not echo raw stderr; a remote URL may contain credentials.
}

function regularFile(root, name) {
  const file = resolve(root, name);
  if (!existsSync(file)) return false;
  const resolved = realpathSync(file);
  const rel = relative(root, resolved);
  return !rel.startsWith('..') && !isAbsolute(rel) && lstatSync(file).isFile();
}

export function inspectRepository(input = process.cwd(), appPath = '.') {
  const cwd = realpathSync(resolve(input));
  const detectedRoot = git(cwd, ['rev-parse', '--show-toplevel']);
  const root = detectedRoot ? realpathSync(detectedRoot) : cwd;
  const appRoot = resolve(root, appPath);
  const appRelative = relative(root, appRoot);
  if (appRelative.startsWith('..') || isAbsolute(appRelative) || !existsSync(appRoot)) {
    throw new Error('App root must be an existing directory inside the selected repository.');
  }
  const actualAppRoot = realpathSync(appRoot);
  const actualRelative = relative(root, actualAppRoot);
  if (actualRelative.startsWith('..') || isAbsolute(actualRelative)) {
    throw new Error('App root must not resolve outside the selected repository.');
  }
  const origin = repositoryIdentity(git(root, ['remote', 'get-url', 'origin']));
  const pushOrigin = repositoryIdentity(git(root, ['remote', 'get-url', '--push', 'origin']));
  const packagePresent = regularFile(actualAppRoot, 'package.json');
  let manifest = null;
  if (packagePresent) {
    try {
      const path = resolve(actualAppRoot, 'package.json');
      if (lstatSync(path).size <= 1024 * 1024) manifest = JSON.parse(readFileSync(path, 'utf8'));
    } catch { /* Report invalid without echoing file contents. */ }
  }
  const nextDeclared = Boolean(manifest?.dependencies?.next || manifest?.devDependencies?.next);
  const entries = ENTRY_POINTS.filter(name => regularFile(actualAppRoot, name));
  const lockfiles = LOCKFILES.filter(name => regularFile(actualAppRoot, name));
  const sourceIdentified = packagePresent && manifest !== null && nextDeclared && entries.length > 0;
  const identityMatches = Boolean(detectedRoot && origin?.toLowerCase() === EXPECTED_REPOSITORY.toLowerCase()
    && pushOrigin?.toLowerCase() === EXPECTED_REPOSITORY.toLowerCase());
  const blockers = [];
  if (!detectedRoot) blockers.push('NOT_A_GIT_CHECKOUT');
  if (!identityMatches) blockers.push('EXPECTED_ORIGIN_NOT_VERIFIED');
  if (!sourceIdentified) blockers.push('APPLICATION_SOURCE_NOT_IDENTIFIED');
  if (sourceIdentified && lockfiles.length === 0) blockers.push('LOCKFILE_MISSING');
  const branch = git(root, ['branch', '--show-current']);
  if (detectedRoot && !branch) blockers.push('DETACHED_HEAD');
  return {
    expectedRepository: EXPECTED_REPOSITORY,
    observedOrigin: origin ? (identityMatches ? EXPECTED_REPOSITORY : '[different repository]') : null,
    repositoryIdentityMatches: identityMatches,
    branch: branch || null,
    commit: git(root, ['rev-parse', '--verify', 'HEAD']),
    appRoot: actualRelative || '.',
    packageManifestPresent: packagePresent,
    packageManifestValid: packagePresent && manifest !== null,
    nextDeclared,
    entryPoints: entries,
    lockfiles,
    applicationSourceIdentified: sourceIdentified,
    deploymentSafety: 'NOT_CHECKED',
    dependencyInstall: 'NOT_RUN',
    applicationBuild: 'NOT_RUN',
    blockers,
    nextAction: !sourceIdentified
      ? 'Restore/identify application source, or obtain explicit permission to initialize the first application here. Do not rerun a missing-remote diagnosis as a source fix.'
      : 'Read repository instructions, audit source and scripts, verify deployment triggers and safe work branch, then begin the next frontend slice.',
  };
}

export function exitCode(report) {
  if (!report.repositoryIdentityMatches) return 2;
  if (!report.applicationSourceIdentified) return 3;
  return report.blockers.length ? 4 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    let root = process.cwd();
    let appRoot = '.';
    let reportOnly = false;
    const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--report-only') reportOnly = true;
      else if ((args[i] === '--root' || args[i] === '--app-root') && args[i + 1] && !args[i + 1].startsWith('--')) {
        if (args[i] === '--root') root = args[++i]; else appRoot = args[++i];
      } else if (args[i] === '--help') {
        console.log('node tools/codex-preflight.mjs [--root PATH] [--app-root RELATIVE_PATH] [--report-only]\nRead-only. Exit: 0 source identified (not build/deploy approval), 2 remote mismatch, 3 no app, 4 other source blockers, 1 invalid invocation.');
        process.exit(0);
      } else throw new Error('Unknown or incomplete argument. Use --help.');
    }
    const report = inspectRepository(root, appRoot);
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = reportOnly ? 0 : exitCode(report);
  } catch {
    console.error('Preflight could not inspect this path or arguments. Verify the checkout and use --help. No files were changed.');
    process.exitCode = 1;
  }
}

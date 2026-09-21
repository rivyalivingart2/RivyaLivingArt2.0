import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXPECTED_REPOSITORY, repositoryIdentity, inspectRepository, exitCode } from './codex-preflight.mjs';

const tool = fileURLToPath(new URL('./codex-preflight.mjs', import.meta.url));
const remote = `https://github.com/${EXPECTED_REPOSITORY}.git`;
function fixture(t, useRemote = true) {
  const dir = mkdtempSync(join(tmpdir(), 'rivya-preflight-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  execFileSync('git', ['init', '-b', 'work', dir], { stdio: 'ignore' });
  if (useRemote) execFileSync('git', ['-C', dir, 'remote', 'add', 'origin', remote]);
  writeFileSync(join(dir, 'README.md'), '# Brief only\n');
  return dir;
}
function addSource(dir) {
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ dependencies: { next: 'test-only' } }));
  mkdirSync(join(dir, 'src/app'), { recursive: true });
  writeFileSync(join(dir, 'src/app/layout.tsx'), '// fixture, not a real app\n');
  writeFileSync(join(dir, 'package-lock.json'), '{}\n');
}

test('normalizes approved HTTPS, scp and SSH identities without secrets', () => {
  for (const value of [remote, `git@github.com:${EXPECTED_REPOSITORY}.git`, `ssh://git@github.com/${EXPECTED_REPOSITORY}.git`, `https://user:private@github.com/${EXPECTED_REPOSITORY}.git?token=private`]) {
    assert.equal(repositoryIdentity(value), EXPECTED_REPOSITORY);
  }
});
test('rejects unknown hosts, local paths, transports and malformed paths', () => {
  for (const value of ['', null, '/tmp/repo', 'file:///tmp/repo', 'https://github.com.evil.test/a/b', 'https://github.com/a/b/tree/main', 'git://github.com/a/b']) assert.equal(repositoryIdentity(value), null);
});
test('distinguishes brief-only source from a confirmed remote', t => {
  const dir = fixture(t);
  const before = readFileSync(join(dir, '.git/config'), 'utf8');
  const report = inspectRepository(dir);
  assert.equal(report.repositoryIdentityMatches, true);
  assert.equal(report.applicationSourceIdentified, false);
  assert.equal(exitCode(report), 3);
  assert.equal(report.deploymentSafety, 'NOT_CHECKED');
  assert.equal(readFileSync(join(dir, '.git/config'), 'utf8'), before);
});
test('missing origin does not imply permission to add or overwrite it', t => {
  const report = inspectRepository(fixture(t, false));
  assert.equal(report.repositoryIdentityMatches, false);
  assert.equal(exitCode(report), 2);
});
test('separate push destination is checked, not printed', t => {
  const dir = fixture(t);
  execFileSync('git', ['-C', dir, 'remote', 'set-url', '--push', 'origin', 'https://private:secret@github.com/other/target.git']);
  const report = inspectRepository(dir);
  assert.equal(report.repositoryIdentityMatches, false);
  assert.equal(JSON.stringify(report).includes('secret'), false);
});
test('recognizes source without claiming install, build or deployment tests passed', t => {
  const dir = fixture(t); addSource(dir);
  const report = inspectRepository(dir);
  assert.equal(report.applicationSourceIdentified, true);
  assert.equal(exitCode(report), 0);
  assert.equal(report.applicationBuild, 'NOT_RUN');
});
test('invalid manifest is reported without printing content', t => {
  const dir = fixture(t);
  writeFileSync(join(dir, 'package.json'), 'secret-not-json');
  const report = inspectRepository(dir);
  assert.equal(report.packageManifestValid, false);
  assert.equal(JSON.stringify(report).includes('secret-not-json'), false);
});
test('missing lockfile remains a distinct blocker', t => {
  const dir = fixture(t); addSource(dir); rmSync(join(dir, 'package-lock.json'));
  const report = inspectRepository(dir);
  assert.equal(report.applicationSourceIdentified, true);
  assert.equal(exitCode(report), 4);
});
test('explicit nested app root can be inspected', t => {
  const dir = fixture(t); const child = join(dir, 'apps/web'); mkdirSync(child, { recursive: true }); addSource(child);
  assert.equal(inspectRepository(dir, 'apps/web').applicationSourceIdentified, true);
});
test('app root cannot escape repository through parent path or symlink', t => {
  const dir = fixture(t);
  assert.throws(() => inspectRepository(dir, '..'));
  symlinkSync(tmpdir(), join(dir, 'escape'));
  assert.throws(() => inspectRepository(dir, 'escape'));
});
test('CLI respects source-blocked exit code and diagnostic report-only mode', t => {
  const dir = fixture(t);
  const run = spawnSync(process.execPath, [tool, '--root', dir], { encoding: 'utf8' });
  assert.equal(run.status, 3);
  assert.equal(JSON.parse(run.stdout).repositoryIdentityMatches, true);
  const diagnostic = spawnSync(process.execPath, [tool, '--root', dir, '--report-only'], { encoding: 'utf8' });
  assert.equal(diagnostic.status, 0);
  assert.equal(JSON.parse(diagnostic.stdout).applicationSourceIdentified, false);
});
test('invalid arguments fail safely', () => {
  const run = spawnSync(process.execPath, [tool, '--root'], { encoding: 'utf8' });
  assert.equal(run.status, 1);
  assert.match(run.stderr, /No files were changed/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  setStorageProvider,
  getStorageProvider,
  isGoogleWorkspaceActive,
  isSqlDisabled,
  assertSqlAllowed,
} from '../src/lib/google-workspace/provider-switch.ts';

test('GW-403: Default provider is postgres when unconfigured', () => {
  setStorageProvider(null);
  const cleanEnv = {};

  assert.equal(getStorageProvider(cleanEnv), 'postgres');
  assert.equal(isGoogleWorkspaceActive(cleanEnv), false);
  assert.equal(isSqlDisabled(cleanEnv), false);

  // Throws if DATABASE_URL is missing
  assert.throws(
    () => assertSqlAllowed(cleanEnv),
    /Studio storage is not configured/
  );

  // Succeeds if valid DATABASE_URL is present
  const validEnv = {DATABASE_URL: 'postgresql://synthetic@localhost:5432/db'};
  assert.doesNotThrow(() => assertSqlAllowed(validEnv));
});

test('GW-403: Environment RIVYA_STORAGE_PROVIDER activates google-workspace', () => {
  setStorageProvider(null);
  const gwEnv = {
    RIVYA_STORAGE_PROVIDER: 'google-workspace',
    DATABASE_URL: 'postgresql://synthetic@localhost:5432/db',
  };

  assert.equal(getStorageProvider(gwEnv), 'google-workspace');
  assert.equal(isGoogleWorkspaceActive(gwEnv), true);
  assert.equal(isSqlDisabled(gwEnv), true);

  // assertSqlAllowed blocks SQL execution even if DATABASE_URL is present
  assert.throws(
    () => assertSqlAllowed(gwEnv),
    /Studio SQL database is disabled in Google Workspace provider mode/
  );
});

test('GW-403: Environment RIVYA_SQL_DISABLED disables SQL without switching provider', () => {
  setStorageProvider(null);
  const disabledEnv = {
    RIVYA_SQL_DISABLED: 'true',
    DATABASE_URL: 'postgresql://synthetic@localhost:5432/db',
  };

  assert.equal(getStorageProvider(disabledEnv), 'disabled');
  assert.equal(isGoogleWorkspaceActive(disabledEnv), false);
  assert.equal(isSqlDisabled(disabledEnv), true);

  assert.throws(
    () => assertSqlAllowed(disabledEnv),
    /Studio SQL database is disabled in Google Workspace provider mode/
  );
});

test('GW-403: Runtime setStorageProvider overrides environment configuration', () => {
  const env = {RIVYA_STORAGE_PROVIDER: 'google-workspace'};

  setStorageProvider('postgres');
  assert.equal(getStorageProvider(env), 'postgres');
  assert.equal(isGoogleWorkspaceActive(env), false);
  assert.equal(isSqlDisabled(env), false);

  setStorageProvider('google-workspace');
  assert.equal(getStorageProvider(env), 'google-workspace');
  assert.equal(isGoogleWorkspaceActive(env), true);
  assert.equal(isSqlDisabled(env), true);

  // Reset
  setStorageProvider(null);
});

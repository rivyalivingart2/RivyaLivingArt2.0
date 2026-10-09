import assert from 'node:assert/strict';

// This harness has one fixed, loopback-only target. It never accepts a live URL.
export const localTarget = Object.freeze({host:'127.0.0.1', port:55439, user:'rivya_migration_qa', database:'rivya_migration_local'});
export const localUrl = 'postgresql://rivya_migration_qa@localhost:55439/rivya_migration_local';
export function assertLocalConfig(config) {
  assert.equal(config.DATABASE_URL, localUrl, 'Migration QA requires its dedicated loopback database');
  assert.equal(config.RIVYA_QA_TARGET, 'migration-local');
  assert.equal(config.RIVYA_DATA_MODE, 'isolated');
  assert.ok(!config.BLOB_READ_WRITE_TOKEN, 'Migration QA cannot use a remote object-store credential');
  for (const key of ['STUDIO_ADMIN_ID','STUDIO_ADMIN_PASSWORD','STUDIO_SESSION_SECRET']) assert.ok(config[key], 'Missing local QA authentication configuration');
}
export function localRuntime(config, inherited=process.env) {
  assertLocalConfig(config);
  const env={...inherited};
  // Clear inherited deployment credentials, including paths Next may reload.
  for (const key of Object.keys(env)) if (/DATABASE|BLOB|NEON|VERCEL|STUDIO_|^RIVYA_|^SITE_INDEXABLE$/.test(key)) delete env[key];
  Object.assign(env, config, {DATABASE_URL_UNPOOLED:'', QA_MIGRATION_DATABASE_URL:'', BLOB_READ_WRITE_TOKEN:'', VERCEL:'', VERCEL_ENV:'preview', RIVYA_PUBLISHED_PREVIEW:'1', RIVYA_ORDER_INTAKE_ENABLED:'true', RIVYA_ORDER_MESSAGE_RETRY_ENABLED:'true', SITE_INDEXABLE:'false', NEXT_TELEMETRY_DISABLED:'1', NODE_ENV:'production'});
  return env;
}

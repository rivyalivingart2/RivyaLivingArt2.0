import 'server-only';
import {neon} from '@neondatabase/serverless';
import {
  type StorageProvider,
  setStorageProvider,
  getStorageProvider,
  isGoogleWorkspaceActive,
  isSqlDisabled,
  assertSqlAllowed,
} from './google-workspace/provider-switch';

export {
  type StorageProvider,
  setStorageProvider,
  getStorageProvider,
  isGoogleWorkspaceActive,
  isSqlDisabled,
  assertSqlAllowed,
};

export function studioDb() {
  assertSqlAllowed(process.env);
  const url = process.env.DATABASE_URL;
  if (!url || !/^postgres(?:ql)?:\/\//.test(url)) throw new Error('Studio storage is not configured');
  return neon(url);
}

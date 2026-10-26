export type StorageProvider = 'postgres' | 'google-workspace' | 'disabled';

let configuredProvider: StorageProvider | null = null;

export function setStorageProvider(provider: StorageProvider | null): void {
  configuredProvider = provider;
}

export function getStorageProvider(env: NodeJS.ProcessEnv = process.env): StorageProvider {
  if (configuredProvider) return configuredProvider;
  if (env.RIVYA_STORAGE_PROVIDER === 'google-workspace') {
    return 'google-workspace';
  }
  if (env.RIVYA_SQL_DISABLED === 'true') {
    return 'disabled';
  }
  return 'postgres';
}

export function isGoogleWorkspaceActive(env: NodeJS.ProcessEnv = process.env): boolean {
  return getStorageProvider(env) === 'google-workspace';
}

export function isSqlDisabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const provider = getStorageProvider(env);
  return provider === 'disabled' || provider === 'google-workspace';
}

export function assertSqlAllowed(env: NodeJS.ProcessEnv = process.env): void {
  if (isSqlDisabled(env)) {
    throw new Error('Studio SQL database is disabled in Google Workspace provider mode.');
  }
  const url = env.DATABASE_URL;
  if (!url || !/^postgres(?:ql)?:\/\//.test(url)) {
    throw new Error('Studio storage is not configured');
  }
}

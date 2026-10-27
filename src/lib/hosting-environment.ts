export type HostingEnvironment = Readonly<Record<string, string | undefined>>;
export type HostingPlatform = 'local' | 'vercel' | 'netlify' | 'unknown';
export type DeploymentContext = 'local' | 'development' | 'preview' | 'production' | 'unknown';

/** Hosting identity comes from server configuration, never request headers. */
export function hostingPlatform(env: HostingEnvironment): HostingPlatform {
  const netlify = env.NETLIFY === 'true' || Boolean(env.SITE_ID && env.SITE_NAME) ||
    env.RIVYA_HOSTING_PROVIDER === 'netlify';
  const vercel = Boolean(env.VERCEL || env.VERCEL_ENV);
  if (netlify && vercel) return 'unknown';
  if (netlify) return 'netlify';
  if (vercel) return 'vercel';
  return env.RIVYA_HOSTING_PROVIDER ? 'unknown' : 'local';
}

export function isHostedEnvironment(env: HostingEnvironment): boolean {
  return hostingPlatform(env) !== 'local';
}

export function deploymentContext(env: HostingEnvironment): DeploymentContext {
  const platform = hostingPlatform(env);
  if (platform === 'unknown') return 'unknown';
  if (platform === 'netlify') {
    // CONTEXT is build metadata. Functions need this context-scoped application
    // variable configured through Netlify's environment API, not just TOML.
    const context = env.CONTEXT || env.RIVYA_DEPLOY_CONTEXT;
    if (context === 'production') return 'production';
    if (context === 'deploy-preview' || context === 'branch-deploy') return 'preview';
    if (context === 'dev') return 'development';
    return 'unknown';
  }
  if (platform === 'vercel') {
    if (env.VERCEL_ENV === 'production') return 'production';
    if (env.VERCEL_ENV === 'preview') return 'preview';
    if (env.VERCEL_ENV === 'development') return 'development';
    return 'unknown';
  }
  if (env.RIVYA_ENV === 'production') return 'production';
  if (env.RIVYA_ENV === 'preview') return 'preview';
  if (env.RIVYA_ENV === 'development') return 'development';
  return env.RIVYA_ENV ? 'unknown' : 'local';
}

export function secureCookies(env: HostingEnvironment): boolean {
  return env.NODE_ENV === 'production' || isHostedEnvironment(env) ||
    deploymentContext(env) === 'production';
}

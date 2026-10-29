/** Server-only offline OAuth renewal. Inactive until trusted server configuration
 * supplies an existing owner credential. No consent, scope expansion, environment
 * mutation, persistence or logging occurs here. The cache is disposable access
 * token state, never authoritative application data. */
export type OAuthTokenErrorCode = 'configuration' | 'aborted' | 'timeout' | 'reauthorization-required' | 'unavailable' | 'invalid-response';
export class OAuthTokenError extends Error {
  constructor(public readonly code: OAuthTokenErrorCode) { super(`Google credential renewal failed: ${code}.`); this.name = 'OAuthTokenError'; }
}
const fail = (code: OAuthTokenErrorCode): never => { throw new OAuthTokenError(code); };
const tokenEndpoint = 'https://oauth2.googleapis.com/token';
const boundedSecret = (value: unknown): value is string => typeof value === 'string' && value.length > 0 && value.length <= 8192 && /^[\x21-\x7e]+$/.test(value);

function abortable<T>(work: () => Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) return Promise.reject(new OAuthTokenError('aborted'));
  return new Promise((resolve, reject) => {
    const abort = () => reject(new OAuthTokenError('aborted'));
    signal.addEventListener('abort', abort, {once: true});
    Promise.resolve().then(() => { if (signal.aborted) return fail('aborted'); return work(); })
      .then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}

export function createGoogleOAuthTokenProvider(config: {
  clientId: string; clientSecret: string; refreshToken: string; timeoutMs?: number;
}, dependencies: {fetch: (url: string, init: RequestInit) => Promise<Response>; clock?: () => number}) {
  if (typeof window !== 'undefined' || !config || ![config.clientId, config.clientSecret, config.refreshToken].every(boundedSecret) || typeof dependencies?.fetch !== 'function') return fail('configuration');
  const timeoutMs = config.timeoutMs ?? 10_000;
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 30_000) return fail('configuration');
  const {clientId, clientSecret, refreshToken} = config;
  const clock = dependencies.clock ?? Date.now;
  let cached: {token: string; usableUntil: number} | null = null;
  let pending: Promise<string> | null = null;
  let reauthorizationRequired = false;
  const now = () => { const at = clock(); if (!Number.isSafeInteger(at) || at < 0) return fail('configuration'); return at; };

  async function renew(): Promise<string> {
    const startedAt = now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await abortable(() => dependencies.fetch(tokenEndpoint, {
        method: 'POST', redirect: 'manual', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', signal: controller.signal,
        headers: {'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json'},
        body: new URLSearchParams({grant_type: 'refresh_token', client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken}).toString(),
      }), controller.signal);
      if (response.redirected || response.status >= 300 && response.status < 400 || response.url && response.url !== tokenEndpoint) {
        void response.body?.cancel().catch(() => {}); return fail('invalid-response');
      }
      if ((response.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase() !== 'application/json' || !response.body) {
        void response.body?.cancel().catch(() => {}); return fail('invalid-response');
      }
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let count = 0;
      try {
        while (true) {
          const part = await abortable(() => reader.read(), controller.signal);
          if (part.done) break;
          count += part.value.byteLength;
          if (count > 32_768) return fail('invalid-response');
          chunks.push(part.value);
        }
      } finally { void reader.cancel().catch(() => {}); reader.releaseLock(); }
      let data: Record<string, unknown>;
      try { data = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return fail('invalid-response'); }
      if (!data || typeof data !== 'object' || Array.isArray(data)) return fail('invalid-response');
      if ((response.status === 400 || response.status === 401) && ['invalid_grant', 'invalid_client', 'unauthorized_client'].includes(String(data.error))) {
        reauthorizationRequired = true; return fail('reauthorization-required');
      }
      if (response.status !== 200) return fail('unavailable');
      // Rotation cannot silently disappear into process memory. A changed refresh
      // token requires an owner-controlled secret update outside this provider.
      if (data.refresh_token !== undefined && data.refresh_token !== refreshToken) { reauthorizationRequired = true; return fail('reauthorization-required'); }
      if (!boundedSecret(data.access_token) || data.token_type !== 'Bearer' || !Number.isSafeInteger(data.expires_in) || (data.expires_in as number) < 120 || (data.expires_in as number) > 86_400) return fail('invalid-response');
      const usableUntil = startedAt + (data.expires_in as number) * 1000 - 60_000;
      if (now() >= usableUntil) return fail('invalid-response');
      cached = {token: data.access_token, usableUntil};
      return cached.token;
    } catch (error) {
      cached = null;
      if (controller.signal.aborted) return fail('timeout');
      if (error instanceof OAuthTokenError) throw error;
      return fail('unavailable');
    } finally { clearTimeout(timer); }
  }

  return Object.freeze({
    async token(signal: AbortSignal): Promise<string> {
      if (signal.aborted) return fail('aborted');
      if (reauthorizationRequired) return fail('reauthorization-required');
      if (cached && now() < cached.usableUntil) return cached.token;
      // One aborted caller does not cancel another caller's bounded refresh.
      if (!pending) pending = renew().finally(() => { pending = null; });
      const renewal = pending;
      return abortable(() => renewal, signal);
    },
    invalidate(): void { cached = null; },
    status() { return {configured: true, reauthorizationRequired}; },
  });
}

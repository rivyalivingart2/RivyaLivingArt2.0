import {createHmac, randomUUID, timingSafeEqual} from 'node:crypto';
import {canonicalArtifactJson} from './record-codec';
import type {ControlledWriterDependencies, WriterSnapshot, AtomicCommitOutcome} from './controlled-writer';

/** Server-only by dependency, inactive until explicitly wired by a trusted server.
 * No environment lookup, browser route, credential persistence or automatic retry. */
export type GatewayAction = 'read' | 'commit';
export type GatewayErrorCode = 'configuration' | 'invalid-request' | 'unavailable' | 'outcome-unknown' | 'invalid-response' | 'aborted';
export class WriterGatewayError extends Error {
  constructor(public readonly code: GatewayErrorCode) { super(`Controlled writer: ${code}.`); this.name = 'WriterGatewayError'; }
}
export type WriterGatewayConfig = {endpoint: string; keyId: string; secret: string; timeoutMs?: number; maxResponseBytes?: number};
export type WriterGatewayDependencies = {fetch: typeof fetch; now?: () => number; nonce?: () => string};
const MAX_REQUEST = 1_800_000;
const mac = (text: string, secret: string) => createHmac('sha256', secret).update(text, 'utf8').digest('hex');
const exact = (value: unknown, keys: string[]): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).sort().join('|') === [...keys].sort().join('|');
function fail(code: GatewayErrorCode): never {throw new WriterGatewayError(code);}

export function createWriterGateway(config: WriterGatewayConfig, dependencies: WriterGatewayDependencies) {
  const {endpoint, keyId, secret} = config;
  const timeoutMs = config.timeoutMs ?? 20_000, maxResponseBytes = config.maxResponseBytes ?? 6_000_000;
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]{10,200}\/exec$/.test(endpoint) || !/^[a-zA-Z0-9_-]{1,64}$/.test(keyId) || !/^[a-f0-9]{64,128}$/.test(secret) || !Number.isSafeInteger(timeoutMs) || timeoutMs < 10 || timeoutMs > 30_000 || !Number.isSafeInteger(maxResponseBytes) || maxResponseBytes < 100 || maxResponseBytes > 8_000_000 || typeof dependencies.fetch !== 'function') fail('configuration');
  const clock = dependencies.now ?? Date.now, nonce = dependencies.nonce ?? randomUUID;
  return {
    async request<T>(action: GatewayAction, payload: unknown, options: {signal?: AbortSignal} = {}): Promise<T> {
      if (!['read','commit'].includes(action)) fail('invalid-request');
      if (options.signal?.aborted) fail('aborted');
      const requestId = nonce(), issuedAt = clock();
      if (!/^[A-Za-z0-9_-]{16,100}$/.test(requestId) || !Number.isSafeInteger(issuedAt)) fail('configuration');
      let message: string;
      try { message = canonicalArtifactJson({version:1, keyId, requestId, issuedAt, expiresAt:issuedAt + 30_000, action, payload}); }
      catch { return fail('invalid-request'); }
      if (Buffer.byteLength(message) > MAX_REQUEST) fail('invalid-request');
      const body = JSON.stringify({message, signature:mac(message, secret)});
      if (Buffer.byteLength(body) > MAX_REQUEST) fail('invalid-request');
      const abort = new AbortController();
      let dispatched = false;
      const cancelled = () => abort.abort();
      options.signal?.addEventListener('abort', cancelled, {once:true});
      const timer = setTimeout(() => abort.abort(), timeoutMs);
      const uncertain = (): GatewayErrorCode => action === 'commit' && dispatched ? 'outcome-unknown' : options.signal?.aborted ? 'aborted' : 'unavailable';
      const bounded = <V>(promise: Promise<V>): Promise<V> => new Promise((resolve,reject) => {
        const listener = () => reject(new WriterGatewayError(uncertain()));
        if (abort.signal.aborted) {listener(); return;}
        abort.signal.addEventListener('abort', listener, {once:true});
        promise.then(resolve,reject).finally(() => abort.signal.removeEventListener('abort', listener));
      });
      try {
        dispatched = true;
        let response = await bounded(dependencies.fetch(endpoint, {method:'POST', headers:{'Content-Type':'application/json'}, body, redirect:'manual', signal:abort.signal, credentials:'omit', cache:'no-store'}));
        // ContentService uses a one-time GET redirect. Never forward the signed body or credentials.
        if ([302,303].includes(response.status)) {
          const target = new URL(response.headers.get('location') ?? '');
          if (target.protocol !== 'https:' || target.hostname !== 'script.googleusercontent.com' || target.port || target.username || target.password || target.pathname !== '/macros/echo' || target.hash) fail('invalid-response');
          void response.body?.cancel().catch(() => {});
          response = await bounded(dependencies.fetch(target.href, {method:'GET', redirect:'manual', signal:abort.signal, credentials:'omit', cache:'no-store'}));
          if (response.url && response.url !== target.href) fail('invalid-response');
        } else if (response.url && response.url !== endpoint) fail('invalid-response');
        if (response.status !== 200 || !response.headers.get('content-type')?.toLowerCase().startsWith('application/json')) fail('invalid-response');
        const reader = response.body?.getReader();
        if (!reader) fail('invalid-response');
        const chunks: Uint8Array[] = []; let bytes = 0;
        try { while (true) { const item = await bounded(reader.read()); if (item.done) break; bytes += item.value.byteLength; if (bytes > maxResponseBytes) fail('invalid-response'); chunks.push(item.value); } }
        finally { void reader.cancel().catch(() => {}); }
        const outer: unknown = JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(chunks)));
        if (!exact(outer,['message','signature']) || typeof outer.message !== 'string' || typeof outer.signature !== 'string' || !/^[a-f0-9]{64}$/.test(outer.signature)) fail('invalid-response');
        const expected = mac(outer.message, secret);
        if (!timingSafeEqual(Buffer.from(expected,'hex'),Buffer.from(outer.signature,'hex'))) fail('invalid-response');
        const result: unknown = JSON.parse(outer.message);
        if (!exact(result,['version','keyId','requestId','action','ok','result']) || result.version !== 1 || result.keyId !== keyId || result.requestId !== requestId || result.action !== action || typeof result.ok !== 'boolean' || canonicalArtifactJson(result) !== outer.message) fail('invalid-response');
        if (!result.ok) {
          // Trusted rejection is explicit: no body/URL/token is ever surfaced in errors.
          const error = result.result;
          if (exact(error,['code']) && error.code === 'outcome-unknown') fail('outcome-unknown');
          fail('unavailable');
        }
        return result.result as T;
      } catch (error) {
        if (error instanceof WriterGatewayError && error.code === 'outcome-unknown') throw error;
        if (action === 'commit' && dispatched) fail('outcome-unknown');
        if (error instanceof WriterGatewayError) throw error;
        fail(uncertain());
      } finally {clearTimeout(timer); options.signal?.removeEventListener('abort',cancelled);}
    },
  };
}

/** The application must provide trusted domain policies to createControlledWriter.
 * This adapter only implements its remote, signed snapshot/CAS transport. */
export function createAppsScriptWriterProvider(gateway: ReturnType<typeof createWriterGateway>): Omit<ControlledWriterDependencies,'now'> {
  return {
    readSnapshot: (resource, options) => gateway.request<WriterSnapshot>('read',{resourceKey:resource.key},options),
    async commitAtomic(prepared, options): Promise<AtomicCommitOutcome> {
      try { return await gateway.request<AtomicCommitOutcome>('commit',prepared,options); }
      catch { return {status:'unknown'}; }
    },
  };
}

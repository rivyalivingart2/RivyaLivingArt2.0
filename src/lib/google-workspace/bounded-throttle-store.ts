import {createHash, randomUUID} from 'node:crypto';
import {BOUNDED_LIMITS, BoundedStoreError, createBoundedStore, validateBoundedLayout,
  type BoundedLayout, type createBoundedProvider} from './bounded-store';
import {canonicalArtifactJson, canonicalJson, type GoogleWorkspaceRecord, type RecordMutationCommand} from './record-codec';
import {SecurityAdapterError, type SecurityDataStore, type StudioLoginLimitRecord} from './security-adapter';

/** Inactive persistent v2 login limiter. One guarded record is authoritative;
 * every caller shares its source-derived identity and the provider's root CAS.
 * No snapshot load, local counter, SQL fallback or runtime activation. */
export function createBoundedThrottleStore(config: {
  layout: BoundedLayout; actorId: string; clock: () => number; timeoutMs?: number;
}, provider: ReturnType<typeof createBoundedProvider>): Pick<SecurityDataStore, 'consumeLoginAttempt'> {
  const layout = validateBoundedLayout(config.layout), actorId = config.actorId;
  const timeoutMs = config.timeoutMs ?? BOUNDED_LIMITS.operationTimeoutMs;
  if (typeof actorId !== 'string' || !actorId || actorId.length > 240 || /[\s\u0000-\u001f\u007f-\u009f]/u.test(actorId) ||
    typeof config.clock !== 'function' || !Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > BOUNDED_LIMITS.operationTimeoutMs) {
    throw new SecurityAdapterError('INVALID_THROTTLE', 'Invalid bounded writer configuration.');
  }
  const fail = (): never => { throw new SecurityAdapterError('THROTTLE_UNAVAILABLE', 'Login protection is unavailable.'); };
  const clock = () => {
    const value = config.clock();
    if (!Number.isSafeInteger(value) || value < 0 || value > 8_640_000_000_000_000) return fail();
    return value;
  };
  function readLimit(record: GoogleWorkspaceRecord | null, recordId: string, key: string): StudioLoginLimitRecord | null {
    if (!record) return null;
    const value = record.payload as unknown as StudioLoginLimitRecord;
    if (record.recordId !== recordId || record.sourceUpdatedAt !== null || record.archivedAt !== null || record.lastMutationId === null ||
      !value || Object.keys(value).sort().join(',') !== 'attempts,key,reset_at' || value.key !== key ||
      !Number.isSafeInteger(value.attempts) || value.attempts < 0 || Object.is(value.attempts, -0) ||
      typeof value.reset_at !== 'string' || !Number.isFinite(Date.parse(value.reset_at))) return fail();
    return value;
  }
  return Object.freeze({
    async consumeLoginAttempt(input) {
      // Monotonic time bounds the entire invocation, including initial reads,
      // policy work and every safe retry; wall time only defines the window.
      const deadline = performance.now() + timeoutMs, controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const check = () => { if (controller.signal.aborted || performance.now() >= deadline) return fail(); };
      try {
        const request = JSON.parse(canonicalJson(input)) as typeof input, now = clock();
        if (Object.keys(request).sort().join(',') !== 'key,limit,now,windowMinutes' || typeof request.key !== 'string' || !request.key || request.key.length > 240 ||
          !Number.isSafeInteger(request.limit) || request.limit < 1 || request.limit > 1000 ||
          !Number.isSafeInteger(request.windowMinutes) || request.windowMinutes < 1 || request.windowMinutes > 1440 ||
          typeof request.now !== 'string' || !Number.isFinite(Date.parse(request.now)) || Math.abs(Date.parse(request.now) - now) > 30_000) return fail();
        const key = request.key, recordId = 'r_' + createHash('sha256').update(canonicalJson(['rivya_studio_login_limits', [key]])).digest('hex');
        const actor = {id: actorId}, options = {signal: controller.signal, deadline};
        const reader = createBoundedStore({layout, timeoutMs, now: () => new Date(clock()).toISOString(), policy: {
          authorize: context => context.actor.id === actorId && context.commands.length === 0,
          validate: () => false,
        }}, provider);
        for (let attempt = 0; attempt < 4; attempt++) {
          check();
          try {
            const current = await reader.load(recordId, actor, options); check();
            const existing = readLimit(current, recordId, key), at = clock(); check();
            const active = existing !== null && Date.parse(existing.reset_at) > at;
            if (active && existing.attempts >= request.limit) return false;
            const payload = {key, attempts: active ? existing.attempts + 1 : 1,
              reset_at: active ? existing.reset_at : new Date(at + request.windowMinutes * 60_000).toISOString()};
            const commitBefore = Date.parse(payload.reset_at), expectedRevision = current?.revision ?? 0;
            const mutationId = 'throttle:' + randomUUID(), operationId = 'throttle:' + randomUUID();
            const command: RecordMutationCommand = {recordId, expectedRevision, mutationId, payload, sourceUpdatedAt: null, archivedAt: null};
            const expectedRecord = canonicalArtifactJson(current), expectedCommand = canonicalArtifactJson(command);
            const writer = createBoundedStore({layout, timeoutMs, now: () => new Date(clock()).toISOString(), policy: {
              authorize: context => context.actor.id === actorId && context.operationId === operationId && context.commands.length === 1 &&
                context.commands[0].recordId === recordId,
              validate: context => {
                check();
                if (context.replay || context.phase !== 'guarded' || context.commitBefore !== commitBefore ||
                  canonicalArtifactJson(context.commands[0]) !== expectedCommand) return false;
                const guarded = context.records.get(recordId) ?? null;
                readLimit(guarded, recordId, key);
                // A newer verified record is an explicit pre-dispatch conflict,
                // so an independent caller may reload within the same deadline.
                if (canonicalArtifactJson(guarded) !== expectedRecord) throw new BoundedStoreError('conflict');
                if (!context.originalsByMutation.has(mutationId) || canonicalArtifactJson(context.originalsByMutation.get(mutationId)) !== expectedRecord) return false;
                return true;
              },
            }}, provider);
            check();
            const outcome = await writer.mutate({actor, commands: [command], operationId, commitBefore}, options); check();
            if (outcome.status === 'committed') return true;
            if (outcome.status === 'conflict') continue;
            // A lost result may already have consumed this attempt. Never retry
            // it as a fresh increment or grant admission from a local guess.
            return fail();
          } catch (error) {
            check();
            if (error instanceof BoundedStoreError && error.code === 'conflict') continue;
            return fail();
          }
        }
        return fail();
      } catch { return fail(); }
      finally { clearTimeout(timer); controller.abort(); }
    },
  });
}

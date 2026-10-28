import {createHash, randomUUID} from 'node:crypto';
import {canonicalArtifactJson, canonicalJson, type GoogleWorkspaceRecord} from './record-codec';
import {createControlledWriter, decodeCanonicalWriterSnapshot, ControlledWriteError, resolveWriterLimits,
  type ControlledWriterDependencies, type WriterLimits, type WriterResource} from './controlled-writer';
import {SecurityAdapterError, type SecurityDataStore, type StudioLoginLimitRecord} from './security-adapter';

/** A narrow persistent throttle operation, reusable by the security store.
 * The existing signed writer owns concurrency; no local mutex/Map is authority.
 * Not runtime-activated until the security workbook and policy are verified. */
export function createCanonicalThrottleStore(config: {
  resource: WriterResource; actorId: string; clock: () => number; limits?: Partial<WriterLimits>;
}, dependencies: ControlledWriterDependencies): Pick<SecurityDataStore, 'consumeLoginAttempt'> {
  const resource = structuredClone(config.resource), limits = resolveWriterLimits(config.limits);
  if (!config.actorId || typeof config.clock !== 'function') throw new SecurityAdapterError('INVALID_THROTTLE', 'Invalid writer configuration.');
  const fail = (): never => { throw new SecurityAdapterError('THROTTLE_UNAVAILABLE', 'Login protection is unavailable.'); };
  function readLimit(record: GoogleWorkspaceRecord | null, key: string): StudioLoginLimitRecord | null {
    if (!record) return null;
    const value = record.payload as unknown as StudioLoginLimitRecord;
    if (record.archivedAt !== null || !value || Object.keys(value).sort().join(',') !== 'attempts,key,reset_at' ||
      value.key !== key || !Number.isSafeInteger(value.attempts) || value.attempts < 0 || typeof value.reset_at !== 'string' || !Number.isFinite(Date.parse(value.reset_at))) return fail();
    return value;
  }
  return {
    async consumeLoginAttempt(input) {
      const now = config.clock();
      if (typeof input.key !== 'string' || !input.key || input.key.length > 240 || !Number.isSafeInteger(input.limit) || input.limit < 1 || input.limit > 1000 ||
        !Number.isSafeInteger(input.windowMinutes) || input.windowMinutes < 1 || input.windowMinutes > 1440 ||
        !Number.isSafeInteger(now) || now < 0 || !Number.isFinite(Date.parse(input.now)) || Math.abs(Date.parse(input.now) - now) > 30_000) return fail();
      const key = input.key, id = 'r_' + createHash('sha256').update(canonicalJson(['rivya_studio_login_limits', [key]])).digest('hex');
      const deadline = AbortSignal.timeout(limits.timeoutMs);
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const raw = await dependencies.readSnapshot(resource, {signal: deadline, limits});
          const current = decodeCanonicalWriterSnapshot(resource, raw, limits).get(id) ?? null;
          const existing = readLimit(current, key);
          const at = config.clock();
          const active = existing && Date.parse(existing.reset_at) > at;
          if (active && existing.attempts >= input.limit) return false;
          const payload = {key, attempts: active ? existing.attempts + 1 : 1,
            reset_at: active ? existing.reset_at : new Date(at + input.windowMinutes * 60_000).toISOString()};
          const expectedRevision = current?.revision ?? 0;
          const mutationId = 'throttle:' + randomUUID();
          const writer = createControlledWriter({resources: [resource], limits: {...limits, maxConflicts: 0}, policies: {
            [resource.key]: {
              authorize: context => context.actor.id === config.actorId && context.command.recordId === id,
              validate: context => {
                if (context.replay || (context.current?.revision ?? 0) !== expectedRevision || context.command.expectedRevision !== expectedRevision ||
                  context.command.mutationId !== mutationId || context.command.sourceUpdatedAt !== null || context.command.archivedAt !== null ||
                  context.commitBefore !== Date.parse(payload.reset_at)) return false;
                const prior = readLimit(context.current, key);
                if (canonicalArtifactJson(prior) !== canonicalArtifactJson(existing)) return false;
                return canonicalArtifactJson(context.command.payload) === canonicalArtifactJson(payload);
              },
            },
          }}, dependencies);
          await writer.mutate({resourceKey: resource.key, actor: {id: config.actorId}, commitBefore: Date.parse(payload.reset_at),
            command: {recordId: id, expectedRevision, mutationId, payload, sourceUpdatedAt: null, archivedAt: null}}, {signal: deadline});
          return true;
        } catch (error) {
          // Retry only an explicit no-write conflict. Unknown outcomes and outages
          // deny login and are never replaced with an uncoordinated increment.
          if (error instanceof ControlledWriteError && ['conflict', 'policy-rejected'].includes(error.code) && !deadline.aborted) continue;
          return fail();
        }
      }
      return fail();
    },
  };
}

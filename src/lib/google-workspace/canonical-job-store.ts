import {canonicalArtifactJson, canonicalJson, decodeRecord, digestPayload, type GoogleWorkspaceRecord, type MutationActor, type JsonValue} from './record-codec';
import {
  createControlledWriter, decodeCanonicalWriterSnapshot, resolveWriterLimits,
  type ControlledWriterDependencies, type WriterLimits, type WriterResource, type WriterValidationContext,
} from './controlled-writer';
import {createJob, transitionJob, validateJob, JobError, type DurableJob, type JobAction, type JobStore, type JobSnapshot} from './durable-jobs';

export type JobAuthorizationContext = {
  operation: 'read' | 'create' | 'transition'; actor: MutationActor;
  /** Mutation authorization runs before reading (current=null), then again
   * against the guarded prior revision. Both checks must permit the action. */
  current: DurableJob | null; next: DurableJob | null; action: JobAction | null;
};
// Authorization metadata can contain both old and new bounded job documents.
// It is not one Sheets cell; keep the individual job limit in validateJob.
const clone = <T>(value: T): T => JSON.parse(canonicalArtifactJson(value)) as T;
const same = (a: unknown, b: unknown): boolean => canonicalJson(a) === canonicalJson(b);
const fail = (code: ConstructorParameters<typeof JobError>[0]): never => { throw new JobError(code); };
const validTime = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) >= 0 && Number(value) <= 8_640_000_000_000_000;

async function abortable<T>(work: () => Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) return fail('aborted');
  return new Promise<T>((resolve, reject) => {
    const stop = () => reject(new JobError('aborted'));
    signal.addEventListener('abort', stop, {once: true});
    Promise.resolve().then(() => { if (signal.aborted) return fail('aborted'); return work(); }).then(resolve, reject).finally(() => signal.removeEventListener('abort', stop));
  });
}

function asJobRecord(record: GoogleWorkspaceRecord): JobSnapshot {
  const job = validateJob(record.payload);
  if (record.recordId !== job.id || record.archivedAt !== null || record.sourceUpdatedAt !== null) return fail('unavailable');
  return {revision: record.revision, job};
}

/** Adapts job CAS to the four-part canonical record/ledger/audit/history writer.
 * No database, local persistence, credential lookup or runtime activation.
 * The provider must implement the signed shared-lock gateway contract, including
 * its lock-time commitBefore deadline. An unknown outcome is never a failed write.
 *
 * Callers cannot replace arbitrary job fields: the trusted domain policy reruns
 * the submitted action on the exact guarded prior revision and checks equality.
 * It also validates replay intent against that prior revision in guarded history. */
export function createCanonicalJobStore(config: {
  resource: WriterResource; actor: MutationActor; clock: () => number;
  authorize: (context: JobAuthorizationContext) => boolean | Promise<boolean>;
  limits?: Partial<WriterLimits>;
}, dependencies: ControlledWriterDependencies): JobStore {
  if (!config || typeof config.clock !== 'function' || typeof config.authorize !== 'function' || !config.actor || Object.keys(config.actor).join(',') !== 'id' || typeof config.actor.id !== 'string' || !config.actor.id.length || !dependencies || typeof dependencies.readSnapshot !== 'function' || typeof dependencies.commitAtomic !== 'function') return fail('invalid-action');
  const resource = clone(config.resource), actor = clone(config.actor), limits = resolveWriterLimits(config.limits);
  const clock = config.clock, authorize = config.authorize, readSnapshot = dependencies.readSnapshot, commitAtomic = dependencies.commitAtomic;
  const now = (): number => { const value = clock(); if (!validTime(value)) return fail('invalid-action'); return value; };
  const permission = async (context: Omit<JobAuthorizationContext, 'actor'>): Promise<boolean> => await authorize(clone({...context, actor})) === true;
  const read = async (recordId: string, signal: AbortSignal): Promise<JobSnapshot | null> => {
    const raw = await abortable(() => readSnapshot(clone(resource), {signal, limits: {...limits}}), signal);
    const records = decodeCanonicalWriterSnapshot(resource, raw, limits), record = records.get(recordId);
    return record ? asJobRecord(record) : null;
  };
  async function bounded<T>(signal: AbortSignal, action: (boundedSignal: AbortSignal) => Promise<T>): Promise<T> {
    if (signal.aborted) return fail('aborted');
    const controller = new AbortController(), relay = () => controller.abort();
    signal.addEventListener('abort', relay, {once: true});
    const timer = setTimeout(relay, limits.timeoutMs);
    try { return await abortable(() => action(controller.signal), controller.signal); }
    catch (error) { if (signal.aborted) return fail('aborted'); if (error instanceof JobError) throw error; return fail('unavailable'); }
    finally { clearTimeout(timer); controller.abort(); signal.removeEventListener('abort', relay); }
  }
  return Object.freeze({
    async load(recordId, signal) {
      if (typeof recordId !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$/.test(recordId)) return fail('invalid-action');
      return bounded(signal, async boundedSignal => {
        const current = await read(recordId, boundedSignal);
        if (!await abortable(() => permission({operation: 'read', current: current?.job ?? null, next: null, action: null}), boundedSignal)) return fail('unavailable');
        return current;
      });
    },
    async compareAndSet(inputValue, signal) {
      let input: Parameters<JobStore['compareAndSet']>[0];
      try { input = clone(inputValue); } catch { return fail('invalid-action'); }
      const allowed = ['id', 'expectedRevision', 'job', 'mutationId', 'action', 'transitionAt', 'guard'];
      if (!input || Object.keys(input).some(key => !allowed.includes(key)) || !Object.hasOwn(input, 'action') || !Number.isSafeInteger(input.expectedRevision) || input.expectedRevision < 0 || !validTime(input.transitionAt) || input.transitionAt > now()) return fail('invalid-action');
      const proposed = validateJob(input.job);
      if (proposed.id !== input.id || typeof input.mutationId !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$/.test(input.mutationId)) return fail('invalid-action');
      const workerAction = input.action !== null && input.action.type !== 'claim' && input.action.type !== 'cancel';
      if (workerAction ? !input.guard : input.guard !== undefined) return fail('invalid-action');
      const commitBefore = workerAction ? input.guard!.expiresAt : null;
      if (commitBefore !== null && (!validTime(commitBefore) || commitBefore <= input.transitionAt)) return fail('lease-lost');
      let prior: DurableJob | null = null;
      const policy = {
        authorize: async () => permission({operation: input.action === null ? 'create' : 'transition', current: prior, next: proposed, action: input.action}),
        validate: async (context: WriterValidationContext): Promise<boolean> => {
          try {
            if (context.resource.key !== resource.key || context.actor.id !== actor.id || context.commitBefore !== commitBefore || context.command.recordId !== input.id || context.command.expectedRevision !== input.expectedRevision || context.command.mutationId !== input.mutationId || context.command.sourceUpdatedAt !== null || context.command.archivedAt !== null || !same(context.command.payload, proposed)) return false;
            let original: GoogleWorkspaceRecord | null = null;
            if (input.expectedRevision > 0) {
              if (context.current?.revision === input.expectedRevision) original = context.current;
              else {
                const rows = context.sheets.get(resource.historySheetId); if (!rows) return false;
                for (const row of rows.slice(1)) { const record = decodeRecord(row); if (record.recordId === input.id && record.revision === input.expectedRevision) { if (original) return false; original = record; } }
              }
              if (!original) return false;
            }
            prior = original ? asJobRecord(original).job : null;
            let expected: DurableJob;
            if (input.action === null) {
              if (prior !== null || input.expectedRevision !== 0 || proposed.createdAt > input.transitionAt) return false;
              expected = createJob({id: proposed.id, type: proposed.type, inputId: proposed.inputId, inputRevision: proposed.inputRevision, inputSha256: proposed.inputSha256, maxAttempts: proposed.maxAttempts, now: proposed.createdAt});
            } else {
              if (!prior) return false;
              if (workerAction && (!same(prior.lease, input.guard) || input.action.type === 'claim' || input.action.type === 'cancel' || input.action.token.owner !== input.guard!.owner || input.action.token.fence !== input.guard!.fence)) return false;
              expected = transitionJob(prior, input.action, input.transitionAt);
              if (same(expected, prior)) return false;
            }
            if (!same(expected, proposed)) return false;
            return permission({operation: input.action === null ? 'create' : 'transition', current: prior, next: proposed, action: input.action});
          } catch { return false; }
        },
      };
      const writer = createControlledWriter({resources: [resource], policies: {[resource.key]: policy}, limits}, {readSnapshot, commitAtomic, now: () => new Date(now()).toISOString()});
      try {
        const result = await writer.mutate({resourceKey: resource.key, actor, commitBefore, command: {recordId: input.id, expectedRevision: input.expectedRevision, mutationId: input.mutationId, payload: proposed as unknown as JsonValue, sourceUpdatedAt: null, archivedAt: null}}, {signal});
        if (result.receipt.recordId !== input.id || result.receipt.revision !== input.expectedRevision + 1 || result.receipt.payloadSha256 !== digestPayload(proposed) || result.receipt.lastMutationId !== input.mutationId) return fail('unavailable');
        return {applied: true, snapshot: {revision: result.receipt.revision, job: clone(proposed)}};
      } catch (error) {
        const code = error && typeof error === 'object' && 'code' in error ? error.code : null;
        if (code === 'outcome-unknown') return fail('outcome-unknown');
        if (code === 'commit-expired') return fail('lease-lost');
        if (code === 'aborted' || signal.aborted) return fail('aborted');
        if (code === 'REVISION_CONFLICT' || code === 'conflict' || code === 'policy-rejected') {
          const current = await bounded(signal, async boundedSignal => {
            const value = await read(input.id, boundedSignal);
            if (!await abortable(() => permission({operation: 'read', current: value?.job ?? null, next: null, action: null}), boundedSignal)) return fail('unavailable');
            return value;
          });
          if (current && (current.revision !== input.expectedRevision || code === 'conflict')) return {applied: false, snapshot: current};
          if (!current && input.expectedRevision > 0) return fail('missing');
          return fail('invalid-action');
        }
        if (error instanceof JobError) throw error;
        return fail('unavailable');
      }
    },
  });
}

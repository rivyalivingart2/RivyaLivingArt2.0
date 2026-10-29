import {createHash} from 'node:crypto';
import {
  BOUNDED_LIMITS, createBoundedStore, validateBoundedLayout,
  type BoundedLayout, type BoundedPolicy, type BoundedPolicyContext, type createBoundedProvider,
} from './bounded-store';
import {
  canonicalArtifactJson, digestPayload,
  type GoogleWorkspaceRecord, type JsonValue, type MutationActor,
} from './record-codec';
import {createJob, transitionJob, validateJob, JobError, type DurableJob, type JobStore, type JobSnapshot} from './durable-jobs';
import type {JobAuthorizationContext} from './canonical-job-store';

const clone = <T>(value: T): T => JSON.parse(canonicalArtifactJson(value)) as T;
const same = (left: unknown, right: unknown): boolean => canonicalArtifactJson(left) === canonicalArtifactJson(right);
const fail = (code: ConstructorParameters<typeof JobError>[0]): never => { throw new JobError(code); };
const validId = (value: unknown): value is string => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$/.test(value);
const validTime = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) >= 0 && Number(value) <= 8_640_000_000_000_000;
const errorCode = (error: unknown): unknown => error && typeof error === 'object' && 'code' in error ? error.code : null;

function asJobRecord(record: GoogleWorkspaceRecord): JobSnapshot {
  const job = validateJob(record.payload);
  if (record.recordId !== job.id || record.archivedAt !== null || record.sourceUpdatedAt !== null) return fail('unavailable');
  return {revision: record.revision, job};
}

/** Inactive, explicitly constructed v2 adapter. No credentials, automatic
 * provider selection or persistence outside the canonical writer. Domain
 * transitions are recomputed against a verified prior revision, including
 * historical replay; ordinary reads use only current bounded proof pages. */
export function createBoundedJobStore(config: {
  layout: BoundedLayout;
  actor: MutationActor;
  clock: () => number;
  authorize: (context: JobAuthorizationContext) => boolean | Promise<boolean>;
  timeoutMs?: number;
}, provider: ReturnType<typeof createBoundedProvider>): JobStore {
  if (!config || typeof config.clock !== 'function' || typeof config.authorize !== 'function' ||
      !config.actor || Object.keys(config.actor).join(',') !== 'id' || !validId(config.actor.id)) return fail('invalid-action');
  const layout = validateBoundedLayout(config.layout), actor = clone(config.actor);
  const clock = config.clock, authorize = config.authorize, timeoutMs = config.timeoutMs ?? BOUNDED_LIMITS.operationTimeoutMs;
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > BOUNDED_LIMITS.operationTimeoutMs) return fail('invalid-action');
  const now = (): number => { const value = clock(); if (!validTime(value)) return fail('invalid-action'); return value; };
  const permission = async (context: Omit<JobAuthorizationContext, 'actor'>): Promise<boolean> => await authorize(clone({...context, actor})) === true;
  const storage = (policy: BoundedPolicy) => createBoundedStore({layout, policy, timeoutMs, now: () => new Date(now()).toISOString()}, provider);
  const check = (signal: AbortSignal, deadline: number): void => {
    if (signal.aborted) return fail('aborted');
    if (performance.now() >= deadline) return fail('unavailable');
  };
  const read = async (recordId: string, signal: AbortSignal, deadline: number): Promise<JobSnapshot | null> => {
    check(signal, deadline);
    const record = await storage({
      authorize: async context => {
        if (context.phase === 'preflight') return true;
        const value = context.records.get(recordId);
        return permission({operation: 'read', current: value ? asJobRecord(value).job : null, next: null, action: null});
      },
      validate: () => false,
    }).load(recordId, actor, {signal, deadline});
    check(signal, deadline);
    return record ? asJobRecord(record) : null;
  };
  const mapFailure = (error: unknown, signal: AbortSignal): never => {
    // A dispatched cancellation must never be reported as a known failed write.
    const code = errorCode(error);
    if (code === 'outcome-unknown') return fail('outcome-unknown');
    if (code === 'commit-expired') return fail('lease-lost');
    if (signal.aborted) return fail('aborted');
    if (error instanceof JobError) throw error;
    return fail('unavailable');
  };

  return Object.freeze({
    async load(recordId, signal) {
      const deadline = performance.now() + timeoutMs;
      if (!validId(recordId)) return fail('invalid-action');
      try { return await read(recordId, signal, deadline); }
      catch (error) { return mapFailure(error, signal); }
    },
    async compareAndSet(inputValue, signal) {
      // The budget starts before cloning/validation, and conflict reconciliation
      // shares this exact deadline instead of receiving another timeout window.
      const deadline = performance.now() + timeoutMs;
      check(signal, deadline);
      let input: Parameters<JobStore['compareAndSet']>[0];
      try { input = clone(inputValue); } catch { return fail('invalid-action'); }
      const allowed = ['id', 'expectedRevision', 'job', 'mutationId', 'action', 'transitionAt', 'guard'];
      if (!input || Object.keys(input).some(key => !allowed.includes(key)) || !Object.hasOwn(input, 'action') ||
          !validId(input.id) || !validId(input.mutationId) || !Number.isSafeInteger(input.expectedRevision) ||
          input.expectedRevision < 0 || !validTime(input.transitionAt) || input.transitionAt > now()) return fail('invalid-action');
      const proposed = validateJob(input.job);
      if (proposed.id !== input.id) return fail('invalid-action');
      const workerAction = input.action !== null && input.action.type !== 'claim' && input.action.type !== 'cancel';
      if (workerAction ? !input.guard : input.guard !== undefined) return fail('invalid-action');
      const commitBefore = workerAction ? input.guard!.expiresAt : null;
      if (commitBefore !== null && (!validTime(commitBefore) || commitBefore <= input.transitionAt)) return fail('lease-lost');
      // Bind the full domain intent, even when two different valid actions would
      // happen to produce identical record payloads (for example a short renewal).
      const operationId = 'job-operation:' + createHash('sha256').update(canonicalArtifactJson({
        actorId: actor.id, id: input.id, mutationId: input.mutationId, expectedRevision: input.expectedRevision,
        action: input.action, transitionAt: input.transitionAt, guard: input.guard ?? null,
        payloadSha256: digestPayload(proposed),
      })).digest('hex');
      const operation = input.action === null ? 'create' : 'transition';
      const original = (context: BoundedPolicyContext): DurableJob | null => {
        if (!context.originalsByMutation.has(input.mutationId)) return fail('invalid-action');
        const record = context.originalsByMutation.get(input.mutationId)!;
        if (record === null) {
          if (input.expectedRevision !== 0) return fail('invalid-action');
          return null;
        }
        if (record.recordId !== input.id || record.revision !== input.expectedRevision) return fail('invalid-action');
        return asJobRecord(record).job;
      };
      const policy: BoundedPolicy = {
        authorize: async context => {
          if (context.phase === 'preflight') return permission({operation, current: null, next: proposed, action: input.action});
          // Domain validation below resolves stale revision conflicts. Do not
          // bypass its read-authorized reconciliation by throwing here.
          return true;
        },
        validate: async context => {
          try {
            const command = context.commands[0];
            if (context.phase !== 'guarded' || !same(context.layout, layout) || context.actor.id !== actor.id ||
                context.operationId !== operationId || context.commitBefore !== commitBefore || context.commands.length !== 1 ||
                command.recordId !== input.id || command.expectedRevision !== input.expectedRevision ||
                command.mutationId !== input.mutationId || command.sourceUpdatedAt !== null || command.archivedAt !== null ||
                !same(command.payload, proposed)) return false;
            const prior = original(context);
            let expected: DurableJob;
            if (input.action === null) {
              if (prior !== null || input.expectedRevision !== 0 || proposed.createdAt > input.transitionAt) return false;
              expected = createJob({id: proposed.id, type: proposed.type, inputId: proposed.inputId,
                inputRevision: proposed.inputRevision, inputSha256: proposed.inputSha256,
                maxAttempts: proposed.maxAttempts, now: proposed.createdAt});
            } else {
              if (!prior) return false;
              if (workerAction && (!same(prior.lease, input.guard) || input.action.type === 'claim' || input.action.type === 'cancel' ||
                  input.action.token.owner !== input.guard!.owner || input.action.token.fence !== input.guard!.fence)) return false;
              expected = transitionJob(prior, input.action, input.transitionAt);
              if (same(expected, prior)) return false;
            }
            if (!same(expected, proposed)) return false;
            return permission({operation, current: prior, next: proposed, action: input.action});
          } catch { return false; }
        },
      };
      const reconcile = async (cause: unknown): Promise<{applied: boolean; snapshot: JobSnapshot}> => {
        const current = await read(input.id, signal, deadline);
        if (current && current.revision !== input.expectedRevision) return {applied: false, snapshot: current};
        if (!current && input.expectedRevision > 0) return fail('missing');
        if (commitBefore !== null && now() >= commitBefore) return fail('lease-lost');
        if (current && cause === 'conflict') return {applied: false, snapshot: current};
        return fail('invalid-action');
      };
      try {
        check(signal, deadline);
        const result = await storage(policy).mutate({actor, operationId, commitBefore, commands: [{
          recordId: input.id, expectedRevision: input.expectedRevision, mutationId: input.mutationId,
          payload: proposed as unknown as JsonValue, sourceUpdatedAt: null, archivedAt: null,
        }]}, {signal, deadline});
        if (result.status === 'unknown') return fail('outcome-unknown');
        if (result.status === 'conflict') return await reconcile('conflict');
        if (!('receipts' in result)) return fail('outcome-unknown');
        const receipt = result.receipts[0];
        if (result.receipts.length !== 1 || receipt.recordId !== input.id || receipt.revision !== input.expectedRevision + 1 ||
            receipt.payloadSha256 !== digestPayload(proposed) || receipt.lastMutationId !== input.mutationId ||
            receipt.sourceUpdatedAt !== null || receipt.archivedAt !== null) return fail('outcome-unknown');
        const snapshot = {revision: receipt.revision, job: clone(proposed)};
        // Successful storage may already be durable. Expiry during receipt
        // verification/cloning cannot be reclassified as a known failed write.
        if (signal.aborted || performance.now() >= deadline) return fail('outcome-unknown');
        return {applied: true, snapshot};
      } catch (error) {
        const code = errorCode(error);
        if (code === 'REVISION_CONFLICT' || code === 'conflict' || code === 'policy-rejected') {
          try { return await reconcile(code); } catch (readError) { return mapFailure(readError, signal); }
        }
        return mapFailure(error, signal);
      }
    },
  });
}

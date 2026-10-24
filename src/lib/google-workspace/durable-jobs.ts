import {createHash} from 'node:crypto';
import {setTimeout as wait} from 'node:timers/promises';
import {canonicalJson, type JsonValue} from './record-codec';

/** No timers or persistence are started on import. All durable state belongs in
 * the supplied canonical store, whose CAS must include its audit/idempotency
 * receipt in the same workbook transaction. Handlers run outside that lock. */
export type JobState = 'queued' | 'running' | 'retry_wait' | 'succeeded' | 'failed' | 'cancelled';
export type JobFailureCode = 'rate-limited' | 'provider-unavailable' | 'invalid-input' | 'worker-failed' | 'interrupted' | 'attempts-exhausted';
export type JobErrorCode = 'invalid-job' | 'invalid-action' | 'not-due' | 'busy' | 'terminal' | 'lease-lost' | 'checkpoint-conflict' | 'output-conflict' | 'conflict' | 'missing' | 'unavailable' | 'aborted' | 'run-limit' | 'input-changed' | 'outcome-unknown';
const failureMessages: Record<JobFailureCode, string> = {
  'rate-limited': 'The provider requested a later retry.',
  'provider-unavailable': 'The provider could not complete this attempt.',
  'invalid-input': 'The frozen job input failed validation.',
  'worker-failed': 'The worker could not complete this attempt.',
  interrupted: 'The attempt was interrupted and may be resumed.',
  'attempts-exhausted': 'The job reached its attempt limit.',
};
export class JobError extends Error {
  constructor(public readonly code: JobErrorCode) { super(`Job operation failed: ${code}.`); this.name = 'JobError'; }
}
/** Worker-facing failure classification. Never persist an arbitrary exception,
 * URL, token, stack or provider message in a job error summary. */
export class JobWorkError extends Error {
  constructor(public readonly code: JobFailureCode) { super(failureMessages[code] ?? failureMessages['worker-failed']); this.name = 'JobWorkError'; }
}
const fail = (code: JobErrorCode): never => { throw new JobError(code); };
const hash = (value: unknown): string => createHash('sha256').update(canonicalJson(value), 'utf8').digest('hex');
const clone = <T>(value: T): T => JSON.parse(canonicalJson(value)) as T;
const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const exact = (value: unknown, keys: readonly string[]): Record<string, unknown> => {
  if (!isObject(value) || Object.keys(value).length !== keys.length || Object.keys(value).some(key => !keys.includes(key))) return fail('invalid-job');
  return value;
};
const id = (value: unknown): value is string => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$/.test(value);
const digest = (value: unknown): value is string => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const integer = (value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): value is number => Number.isSafeInteger(value) && (value as number) >= min && (value as number) <= max;
const time = (value: unknown): value is number => integer(value, 0, 8_640_000_000_000_000);
const failure = (code: JobFailureCode) => {
  if (!Object.hasOwn(failureMessages, code)) return fail('invalid-action');
  return {code, summary: failureMessages[code]};
};
export type JobOutput = {slot: string; key: string; id: string; sha256: string};
export type JobLease = {owner: string; fence: number; expiresAt: number};
export type JobCheckpoint = {sequence: number; key: string | null; data: JsonValue};
export type DurableJob = {
  version: 1; id: string; type: string; inputId: string; inputRevision: number; inputSha256: string;
  state: JobState; attempts: number; maxAttempts: number; fence: number; lease: JobLease | null;
  checkpoint: JobCheckpoint; outputs: JobOutput[]; nextRetryAt: number | null;
  error: {code: JobFailureCode; summary: string} | null; createdAt: number; updatedAt: number;
};
const jobKeys = ['version', 'id', 'type', 'inputId', 'inputRevision', 'inputSha256', 'state', 'attempts', 'maxAttempts', 'fence', 'lease', 'checkpoint', 'outputs', 'nextRetryAt', 'error', 'createdAt', 'updatedAt'];
const terminal = (state: JobState) => state === 'succeeded' || state === 'failed' || state === 'cancelled';
const inputIdentity = (job: DurableJob) => [job.id, job.type, job.inputId, job.inputRevision, job.inputSha256, job.maxAttempts, job.createdAt];

/** Stable across leases/retries/restarts. The output provider must atomically
 * ensure/reuse this identity; find-then-create without coordination is not safe. */
export function jobOutputKey(job: Pick<DurableJob, 'id' | 'type' | 'inputId' | 'inputRevision' | 'inputSha256'>, slot: string): string {
  if (![job.id, job.type, job.inputId, slot].every(id) || !integer(job.inputRevision, 1) || !digest(job.inputSha256)) return fail('invalid-action');
  return 'job-output:' + hash([job.id, job.type, job.inputId, job.inputRevision, job.inputSha256, slot]);
}

export function validateJob(value: unknown): DurableJob {
  let safe: unknown;
  try { safe = clone(value); } catch { return fail('invalid-job'); }
  const job = exact(safe, jobKeys) as unknown as DurableJob;
  if (job.version !== 1 || ![job.id, job.type, job.inputId].every(id) || !integer(job.inputRevision, 1) || !digest(job.inputSha256)) return fail('invalid-job');
  if (!['queued', 'running', 'retry_wait', 'succeeded', 'failed', 'cancelled'].includes(job.state) || !integer(job.maxAttempts, 1, 100) || !integer(job.attempts, 0, job.maxAttempts) || !integer(job.fence, job.attempts)) return fail('invalid-job');
  if (!time(job.createdAt) || !time(job.updatedAt) || job.updatedAt < job.createdAt) return fail('invalid-job');
  if (job.state === 'queued' && job.attempts !== 0) return fail('invalid-job');
  if (job.state === 'running') {
    const lease = exact(job.lease, ['owner', 'fence', 'expiresAt']);
    if (!id(lease.owner) || lease.fence !== job.fence || !integer(lease.fence, 1) || !time(lease.expiresAt) || lease.expiresAt <= job.updatedAt || job.attempts < 1) return fail('invalid-job');
  } else if (job.lease !== null) return fail('invalid-job');
  if (job.state === 'retry_wait') {
    if (!time(job.nextRetryAt) || job.nextRetryAt < job.updatedAt || job.attempts < 1 || job.attempts >= job.maxAttempts) return fail('invalid-job');
  } else if (job.nextRetryAt !== null) return fail('invalid-job');
  if (job.error !== null) {
    const error = exact(job.error, ['code', 'summary']);
    if (typeof error.code !== 'string' || !Object.hasOwn(failureMessages, error.code) || error.summary !== failureMessages[error.code as JobFailureCode]) return fail('invalid-job');
  }
  const checkpoint = exact(job.checkpoint, ['sequence', 'key', 'data']);
  if (!integer(checkpoint.sequence) || canonicalJson(checkpoint.data).length > 8_000) return fail('invalid-job');
  if (checkpoint.sequence === 0 ? checkpoint.key !== null || checkpoint.data !== null : !id(checkpoint.key)) return fail('invalid-job');
  if (!Array.isArray(job.outputs) || job.outputs.length > 32) return fail('invalid-job');
  const slots = new Set<string>();
  for (const output of job.outputs) {
    exact(output, ['slot', 'key', 'id', 'sha256']);
    if (!id(output.slot) || !id(output.id) || !digest(output.sha256) || output.key !== jobOutputKey(job, output.slot) || slots.has(output.slot)) return fail('invalid-job');
    slots.add(output.slot);
  }
  return job;
}

export function createJob(input: {id: string; type: string; inputId: string; inputRevision: number; inputSha256: string; maxAttempts: number; now: number}): DurableJob {
  if (!input || Object.keys(input).length !== 7) return fail('invalid-job');
  return validateJob({version: 1, id: input.id, type: input.type, inputId: input.inputId, inputRevision: input.inputRevision, inputSha256: input.inputSha256, maxAttempts: input.maxAttempts, state: 'queued', attempts: 0, fence: 0, lease: null, checkpoint: {sequence: 0, key: null, data: null}, outputs: [], nextRetryAt: null, error: null, createdAt: input.now, updatedAt: input.now});
}

export type JobLeaseToken = {owner: string; fence: number};
export type JobAction =
  | {type: 'claim'; owner: string; leaseMs: number}
  | {type: 'renew'; token: JobLeaseToken; leaseMs: number}
  | {type: 'checkpoint'; token: JobLeaseToken; checkpoint: JobCheckpoint}
  | {type: 'output'; token: JobLeaseToken; output: JobOutput}
  | {type: 'retry'; token: JobLeaseToken; delayMs: number; code: JobFailureCode}
  | {type: 'fail'; token: JobLeaseToken; code: JobFailureCode}
  | {type: 'complete'; token: JobLeaseToken}
  | {type: 'cancel'};

function activeLease(job: DurableJob, token: JobLeaseToken, now: number): void {
  if (!token || Object.keys(token).length !== 2 || !id(token.owner) || !integer(token.fence, 1)) return fail('invalid-action');
  if (job.state !== 'running' || !job.lease || job.lease.expiresAt <= now || job.lease.owner !== token.owner || job.lease.fence !== token.fence) return fail('lease-lost');
}
function leaseExpiry(now: number, leaseMs: number): number {
  if (!integer(leaseMs, 1_000, 300_000) || !time(now + leaseMs)) return fail('invalid-action');
  return now + leaseMs;
}

/** Pure transitions only. Pass trusted server time and persist the returned
 * document through CAS; validating a local transition alone gives no durability. */
export function transitionJob(value: DurableJob, actionValue: JobAction, now: number): DurableJob {
  const job = validateJob(value);
  if (!time(now) || now < job.updatedAt) return fail('invalid-action');
  let action: JobAction;
  try { action = clone(actionValue); } catch { return fail('invalid-action'); }
  if (!isObject(action) || typeof action.type !== 'string') return fail('invalid-action');
  if (action.type === 'cancel') {
    if (Object.keys(action).length !== 1) return fail('invalid-action');
    if (job.state === 'cancelled') return job;
    if (terminal(job.state)) return fail('terminal');
    return validateJob({...job, state: 'cancelled', fence: job.fence + 1, lease: null, nextRetryAt: null, updatedAt: now});
  }
  if (action.type === 'claim') {
    if (Object.keys(action).length !== 3 || !id(action.owner)) return fail('invalid-action');
    const expiresAt = leaseExpiry(now, action.leaseMs);
    if (terminal(job.state)) return fail('terminal');
    if (job.state === 'running' && job.lease!.expiresAt > now) return fail('busy');
    if (job.state === 'retry_wait' && job.nextRetryAt! > now) return fail('not-due');
    if (job.attempts >= job.maxAttempts) return validateJob({...job, state: 'failed', lease: null, nextRetryAt: null, error: failure('attempts-exhausted'), updatedAt: now});
    const fence = job.fence + 1;
    return validateJob({...job, state: 'running', attempts: job.attempts + 1, fence, lease: {owner: action.owner, fence, expiresAt}, nextRetryAt: null, error: null, updatedAt: now});
  }
  const keys: Record<string, readonly string[]> = {renew: ['type', 'token', 'leaseMs'], checkpoint: ['type', 'token', 'checkpoint'], output: ['type', 'token', 'output'], retry: ['type', 'token', 'delayMs', 'code'], fail: ['type', 'token', 'code'], complete: ['type', 'token']};
  if (!keys[action.type] || Object.keys(action).length !== keys[action.type].length || Object.keys(action).some(key => !keys[action.type].includes(key))) return fail('invalid-action');
  activeLease(job, action.token, now);
  if (action.type === 'renew') return validateJob({...job, lease: {...job.lease!, expiresAt: Math.max(job.lease!.expiresAt, leaseExpiry(now, action.leaseMs))}, updatedAt: now});
  if (action.type === 'checkpoint') {
    const checkpoint = action.checkpoint;
    if (!checkpoint || !integer(checkpoint.sequence, 1) || !id(checkpoint.key) || canonicalJson(checkpoint.data).length > 8_000) return fail('invalid-action');
    if (checkpoint.sequence === job.checkpoint.sequence && canonicalJson(checkpoint) === canonicalJson(job.checkpoint)) return job;
    if (checkpoint.sequence !== job.checkpoint.sequence + 1 || checkpoint.key === job.checkpoint.key) return fail('checkpoint-conflict');
    return validateJob({...job, checkpoint, updatedAt: now});
  }
  if (action.type === 'output') {
    const output = action.output;
    if (!output || output.key !== jobOutputKey(job, output.slot)) return fail('invalid-action');
    const existing = job.outputs.find(item => item.slot === output.slot);
    if (existing) { if (canonicalJson(existing) !== canonicalJson(output)) return fail('output-conflict'); return job; }
    return validateJob({...job, outputs: [...job.outputs, output], updatedAt: now});
  }
  if (action.type === 'complete') return validateJob({...job, state: 'succeeded', lease: null, updatedAt: now});
  const error = failure(action.code);
  if (action.type === 'fail' || job.attempts >= job.maxAttempts) return validateJob({...job, state: 'failed', lease: null, error, updatedAt: now});
  if (!integer(action.delayMs, 0, 86_400_000) || !time(now + action.delayMs)) return fail('invalid-action');
  return validateJob({...job, state: 'retry_wait', lease: null, nextRetryAt: now + action.delayMs, error, updatedAt: now});
}

export type JobSnapshot = {revision: number; job: DurableJob};
export type JobStore = {
  load: (id: string, signal: AbortSignal) => Promise<JobSnapshot | null>;
  /** Under the canonical writer lock, compare revision AND (when supplied) the
   * current lease with guard; reject an expired lease at trusted commit time.
   * Rejections must mean no write, except JobError('outcome-unknown'). A lost
   * response must retain/quarantine its original identity, never mean failure. */
  compareAndSet: (input: {id: string; expectedRevision: number; job: DurableJob; mutationId: string; action: JobAction | null; transitionAt: number; guard?: JobLease}, signal: AbortSignal) => Promise<{applied: boolean; snapshot: JobSnapshot}>;
};
export type JobOutputProvider = {
  /** Must guarantee atomic ensure/reuse of key, including an output created
   * before a crash. Must enforce permissions and cancellation independently. */
  ensure: (input: {key: string; slot: string; job: DurableJob; signal: AbortSignal}) => Promise<{id: string; sha256: string}>;
};
export type JobContext = {
  job: DurableJob; signal: AbortSignal;
  checkpoint: (checkpoint: JobCheckpoint) => Promise<DurableJob>;
  ensureOutput: (slot: string) => Promise<JobOutput>;
  renew: () => Promise<DurableJob>;
};
export type JobRunnerResult = {status: JobState | 'busy' | 'not-due' | 'missing' | 'unavailable' | 'aborted' | 'run-limit' | 'lease-lost'; job?: DurableJob};
export type JobRunnerOptions = {signal?: AbortSignal};

async function abortable<T>(work: () => Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) return fail('aborted');
  return new Promise<T>((resolve, reject) => {
    const abort = () => reject(new JobError('aborted'));
    signal.addEventListener('abort', abort, {once: true});
    Promise.resolve().then(() => { if (signal.aborted) return fail('aborted'); return work(); }).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}
type MutationTracker = {pending: number; uncertain: boolean};
/** Once CAS is dispatched, cancellation cannot prove it did not commit. Track
 * this synchronously on abort, before an outer handler/monitor race rejects. */
async function mutationBoundary<T>(work: () => Promise<T>, signal: AbortSignal, tracker: MutationTracker): Promise<T> {
  if (signal.aborted) return fail('aborted');
  if (tracker.uncertain || tracker.pending) return fail('outcome-unknown');
  return new Promise<T>((resolve, reject) => {
    let dispatched = false;
    const stop = () => {
      if (dispatched) tracker.uncertain = true;
      reject(new JobError(dispatched ? 'outcome-unknown' : 'aborted'));
    };
    const settled = () => { if (dispatched) tracker.pending--; signal.removeEventListener('abort', stop); };
    signal.addEventListener('abort', stop, {once: true});
    Promise.resolve().then(() => {
      if (signal.aborted) return fail('aborted');
      dispatched = true; tracker.pending++; return work();
    }).then(value => { settled(); resolve(value); }, error => {
      if (error instanceof JobError && error.code === 'outcome-unknown') tracker.uncertain = true;
      settled(); reject(error);
    });
  });
}
const snapshot = (value: JobSnapshot, expectedId: string): JobSnapshot => {
  if (!value || !integer(value.revision, 1) || Object.keys(value).length !== 2) return fail('unavailable');
  const job = validateJob(value.job); if (job.id !== expectedId) return fail('unavailable');
  return {revision: value.revision, job};
};

/** Explicit bounded dispatch only; no background service and no memory-backed
 * persistence. Abort stops the attempt and schedules an interrupted retry when
 * a still-valid lease can be released. cancel() durably cancels the whole job. */
export function createJobRunner(config: {
  owner: string; store: JobStore; clock: () => number; outputs?: JobOutputProvider;
  leaseMs?: number; maxRunMs?: number; pollMs?: number; maxPolls?: number; maxCasAttempts?: number; retryDelayMs?: number;
  sleep?: (milliseconds: number, signal: AbortSignal) => Promise<void>;
}) {
  if (!config) return fail('invalid-action');
  const leaseMs = config.leaseMs ?? 30_000, maxRunMs = config.maxRunMs ?? 120_000, pollMs = config.pollMs ?? 1_000, maxPolls = config.maxPolls ?? 240, maxCasAttempts = config.maxCasAttempts ?? 6, retryDelayMs = config.retryDelayMs ?? 5_000;
  if (!id(config.owner) || !config.store || typeof config.store.load !== 'function' || typeof config.store.compareAndSet !== 'function' || typeof config.clock !== 'function' || !integer(leaseMs, 1_000, 300_000) || !integer(maxRunMs, 1, 300_000) || !integer(pollMs, 1, 60_000) || pollMs >= leaseMs || !integer(maxPolls, 1, 1_000) || !integer(maxCasAttempts, 1, 12) || !integer(retryDelayMs, 0, 86_400_000)) return fail('invalid-action');
  const owner = config.owner, store = config.store, clock = config.clock, outputs = config.outputs;
  const sleep = config.sleep ?? ((milliseconds: number, signal: AbortSignal) => wait(milliseconds, undefined, {signal}));
  const now = () => { const value = clock(); if (!time(value)) return fail('invalid-action'); return value; };
  const load = async (jobId: string, signal: AbortSignal) => { const value = await abortable(() => store.load(jobId, signal), signal); return value === null ? null : snapshot(value, jobId); };
  async function change(jobId: string, action: JobAction, signal: AbortSignal, original?: DurableJob, tracker: MutationTracker = {pending: 0, uncertain: false}): Promise<JobSnapshot> {
    for (let attempt = 0; attempt < maxCasAttempts; attempt++) {
      if (tracker.uncertain || tracker.pending) return fail('outcome-unknown');
      const current = await load(jobId, signal); if (!current) return fail('missing');
      if (original && canonicalJson(inputIdentity(current.job)) !== canonicalJson(inputIdentity(original))) return fail('input-changed');
      const transitionAt = now(), next = transitionJob(current.job, action, transitionAt);
      if (canonicalJson(next) === canonicalJson(current.job)) return current;
      const mutationId = 'job-mutation:' + hash([jobId, current.revision, action, next]);
      const guard = action.type === 'claim' || action.type === 'cancel' ? undefined : current.job.lease!;
      const result = await mutationBoundary(() => store.compareAndSet({id: jobId, expectedRevision: current.revision, job: next, mutationId, action: clone(action), transitionAt, ...(guard ? {guard: clone(guard)} : {})}, signal), signal, tracker);
      if (!result || typeof result.applied !== 'boolean') { tracker.uncertain = true; return fail('outcome-unknown'); }
      let saved: JobSnapshot;
      try { saved = snapshot(result.snapshot, jobId); }
      catch (error) { if (result.applied) { tracker.uncertain = true; return fail('outcome-unknown'); } throw error; }
      if (result.applied) {
        if (saved.revision !== current.revision + 1 || canonicalJson(saved.job) !== canonicalJson(next)) { tracker.uncertain = true; return fail('outcome-unknown'); }
        return saved;
      }
    }
    return fail('conflict');
  }
  async function bounded<T>(options: JobRunnerOptions, callback: (signal: AbortSignal) => Promise<T>, tracker: MutationTracker): Promise<T> {
    const controller = new AbortController(), relay = () => controller.abort();
    if (options.signal?.aborted) return fail('aborted');
    options.signal?.addEventListener('abort', relay, {once: true});
    const timer = setTimeout(relay, maxRunMs);
    try { return await abortable(() => callback(controller.signal), controller.signal); }
    catch (error) { if (tracker.uncertain || tracker.pending) return fail('outcome-unknown'); throw error; }
    finally { clearTimeout(timer); controller.abort(); options.signal?.removeEventListener('abort', relay); }
  }
  return Object.freeze({
    /** Creation must itself be authorized by the store's server-side writer. */
    async enqueue(job: DurableJob, options: JobRunnerOptions = {}): Promise<JobSnapshot> {
      const candidate = validateJob(job); if (candidate.state !== 'queued') return fail('invalid-action');
      const fresh = createJob({id: candidate.id, type: candidate.type, inputId: candidate.inputId, inputRevision: candidate.inputRevision, inputSha256: candidate.inputSha256, maxAttempts: candidate.maxAttempts, now: candidate.createdAt});
      if (canonicalJson(candidate) !== canonicalJson(fresh)) return fail('invalid-action');
      const tracker = {pending: 0, uncertain: false};
      return bounded(options, async signal => {
        const existing = await load(candidate.id, signal);
        if (existing) { if (canonicalJson(inputIdentity(existing.job)) !== canonicalJson(inputIdentity(candidate))) return fail('input-changed'); return existing; }
        const result = await mutationBoundary(() => store.compareAndSet({id: candidate.id, expectedRevision: 0, job: candidate, mutationId: 'job-enqueue:' + hash(candidate), action: null, transitionAt: now()}, signal), signal, tracker);
        if (!result || typeof result.applied !== 'boolean') { tracker.uncertain = true; return fail('outcome-unknown'); }
        let saved: JobSnapshot;
        try { saved = snapshot(result.snapshot, candidate.id); }
        catch (error) { if (result.applied) { tracker.uncertain = true; return fail('outcome-unknown'); } throw error; }
        if (canonicalJson(inputIdentity(saved.job)) !== canonicalJson(inputIdentity(candidate)) || result.applied && (saved.revision !== 1 || canonicalJson(saved.job) !== canonicalJson(candidate))) { if (result.applied) tracker.uncertain = true; return fail(result.applied ? 'outcome-unknown' : 'unavailable'); }
        return saved;
      }, tracker);
    },
    async cancel(jobId: string, options: JobRunnerOptions = {}): Promise<DurableJob> {
      if (!id(jobId)) return fail('invalid-action');
      const tracker = {pending: 0, uncertain: false};
      return bounded(options, async signal => (await change(jobId, {type: 'cancel'}, signal, undefined, tracker)).job, tracker);
    },
    async run(jobId: string, handler: (context: JobContext) => Promise<void>, options: JobRunnerOptions = {}): Promise<JobRunnerResult> {
      if (!id(jobId) || typeof handler !== 'function') return fail('invalid-action');
      const controller = new AbortController(), relay = () => controller.abort();
      if (options.signal?.aborted) return {status: 'aborted'};
      options.signal?.addEventListener('abort', relay, {once: true});
      let limited = false, claimed: DurableJob | undefined;
      const tracker = {pending: 0, uncertain: false};
      const timer = setTimeout(() => { limited = true; controller.abort(); }, maxRunMs);
      try {
        const first = await load(jobId, controller.signal); if (!first) return {status: 'missing'};
        if (terminal(first.job.state)) return {status: first.job.state, job: first.job};
        claimed = (await change(jobId, {type: 'claim', owner, leaseMs}, controller.signal, undefined, tracker)).job;
        if (claimed.state !== 'running') return {status: claimed.state, job: claimed};
        const initial = claimed, token = {owner, fence: initial.lease!.fence};
        // Serialize this attempt's actions (including heartbeat and completion)
        // so a pending CAS cannot be followed by a different mutation. This is
        // local sequencing only; remote safety still comes from the writer CAS.
        let mutations: Promise<unknown> = Promise.resolve();
        const mutate = (action: JobAction): Promise<JobSnapshot> => {
          const operation = mutations.then(() => change(jobId, action, controller.signal, initial, tracker));
          mutations = operation.then(() => undefined, () => undefined);
          return operation;
        };
        const inspect = async () => {
          const current = await load(jobId, controller.signal); if (!current) return fail('missing');
          if (canonicalJson(inputIdentity(current.job)) !== canonicalJson(inputIdentity(initial))) return fail('input-changed');
          activeLease(current.job, token, now()); return current.job;
        };
        await inspect();
        const context: JobContext = {
          job: clone(initial), signal: controller.signal,
          checkpoint: async checkpoint => (await mutate({type: 'checkpoint', token, checkpoint})).job,
          renew: async () => (await mutate({type: 'renew', token, leaseMs})).job,
          ensureOutput: async slot => {
            if (!id(slot) || !outputs || typeof outputs.ensure !== 'function') return fail('invalid-action');
            const current = await inspect(), existing = current.outputs.find(output => output.slot === slot); if (existing) return clone(existing);
            const key = jobOutputKey(initial, slot);
            const result = await abortable(() => outputs.ensure({key, slot, job: clone(initial), signal: controller.signal}), controller.signal);
            const output = {slot, key, id: result.id, sha256: result.sha256};
            const saved = await mutate({type: 'output', token, output}); return saved.job.outputs.find(item => item.slot === slot)!;
          },
        };
        const monitor = async (): Promise<never> => {
          for (let poll = 0; poll < maxPolls; poll++) {
            await abortable(() => sleep(pollMs, controller.signal), controller.signal);
            const current = await inspect();
            if (current.lease!.expiresAt - now() <= leaseMs / 2) await context.renew();
          }
          limited = true; return fail('run-limit');
        };
        await Promise.race([abortable(() => handler(context), controller.signal), monitor()]);
        const completed = (await mutate({type: 'complete', token})).job;
        return {status: completed.state, job: completed};
      } catch (error) {
        // Stop the handler before releasing its lease. A handler/provider that
        // ignores AbortSignal must still be fenced/idempotent at its own boundary.
        controller.abort();
        const code = error instanceof JobError ? error.code : undefined;
        if (code === 'outcome-unknown' || tracker.uncertain || tracker.pending) return {status: 'unavailable'};
        if (code === 'busy' || code === 'not-due') return {status: code};
        if (code === 'missing') return {status: 'missing'};
        if (!claimed || claimed.state !== 'running') return {status: options.signal?.aborted ? 'aborted' : limited ? 'run-limit' : 'unavailable'};
        const cleanup = new AbortController(), cleanupTimer = setTimeout(() => cleanup.abort(), Math.min(5_000, maxRunMs));
        try {
          const current = await load(jobId, cleanup.signal); if (!current) return {status: 'missing'};
          if (terminal(current.job.state)) return {status: current.job.state, job: current.job};
          if (code === 'lease-lost' || code === 'input-changed') return {status: 'lease-lost'};
          const failureCode = error instanceof JobWorkError && Object.hasOwn(failureMessages, error.code) ? error.code : options.signal?.aborted || limited ? 'interrupted' : 'worker-failed';
          const action: JobAction = failureCode === 'invalid-input' ? {type: 'fail', token: {owner, fence: claimed.lease!.fence}, code: failureCode} : {type: 'retry', token: {owner, fence: claimed.lease!.fence}, delayMs: retryDelayMs, code: failureCode};
          const saved = (await change(jobId, action, cleanup.signal, claimed, tracker)).job;
          return {status: options.signal?.aborted ? 'aborted' : limited ? 'run-limit' : saved.state, job: saved};
        } catch (cleanupError) { return {status: cleanupError instanceof JobError && cleanupError.code === 'lease-lost' ? 'lease-lost' : 'unavailable'}; }
        finally { clearTimeout(cleanupTimer); cleanup.abort(); }
      } finally { clearTimeout(timer); controller.abort(); options.signal?.removeEventListener('abort', relay); }
    },
  });
}

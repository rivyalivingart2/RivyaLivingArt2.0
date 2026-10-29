import {BOUNDED_LIMITS, type BoundedOperationOptions} from './bounded-store';

export type SecurityWorkflowErrorCode = 'configuration' | 'invalid-input' | 'integrity' | 'coverage-unverified' |
  'capacity' | 'unauthorized' | 'conflict' | 'expired' | 'unavailable' | 'outcome-unknown';
export class SecurityWorkflowError extends Error {
  constructor(public readonly code: SecurityWorkflowErrorCode) { super('Security workflow: ' + code + '.'); }
}
export function securityWorkflowFail(code: SecurityWorkflowErrorCode): never { throw new SecurityWorkflowError(code); }
export type SecurityOperation = {signal: AbortSignal; deadline: number; dispatched: boolean; check: () => void};

/** One deadline covers policy, all proof reads, retries and commit acknowledgement. */
export async function runSecurityOperation<T>(timeoutMs: number, options: BoundedOperationOptions,
  work: (operation: SecurityOperation) => Promise<T>): Promise<T> {
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > BOUNDED_LIMITS.operationTimeoutMs ||
      options.deadline !== undefined && (!Number.isFinite(options.deadline) || options.deadline < 0)) securityWorkflowFail('configuration');
  const start = performance.now(), deadline = Math.min(start + timeoutMs, options.deadline ?? Infinity);
  const controller = new AbortController(), abort = () => controller.abort();
  const operation: SecurityOperation = {signal: controller.signal, deadline, dispatched: false, check() {
    if (controller.signal.aborted || performance.now() >= deadline) securityWorkflowFail(operation.dispatched ? 'outcome-unknown' : 'unavailable');
  }};
  options.signal?.addEventListener('abort', abort, {once: true});
  if (options.signal?.aborted) abort();
  let cancel: () => void = () => {};
  const cancelled = new Promise<never>((_, reject) => {
    cancel = () => reject(new SecurityWorkflowError(operation.dispatched ? 'outcome-unknown' : 'unavailable'));
    controller.signal.addEventListener('abort', cancel, {once: true});
  });
  const timer = setTimeout(abort, Math.max(0, deadline - start));
  try { operation.check(); const value = await Promise.race([work(operation), cancelled]); operation.check(); return value; }
  catch (error) {
    if (error instanceof SecurityWorkflowError) throw error;
    const code = error && typeof error === 'object' && 'code' in error ? error.code : null;
    if (code === 'conflict' || code === 'REVISION_CONFLICT') securityWorkflowFail('conflict');
    if (code === 'commit-expired') securityWorkflowFail('expired');
    if (code === 'capacity') securityWorkflowFail('capacity');
    return securityWorkflowFail(operation.dispatched || code === 'outcome-unknown' ? 'outcome-unknown' : 'unavailable');
  } finally {
    clearTimeout(timer); options.signal?.removeEventListener('abort', abort);
    controller.signal.removeEventListener('abort', cancel); controller.abort();
  }
}

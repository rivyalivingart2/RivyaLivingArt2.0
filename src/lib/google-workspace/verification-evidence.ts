/** Evidence aggregation only. Callers supply trusted, independently collected
 * receipts. This module does not run provider/browser tests or authorize release. */
export type EvidenceStatus = 'passed' | 'failed' | 'blocked' | 'unverified';
export type EvidenceKind = 'provider' | 'browser' | 'migration' | 'recovery';
export interface VerificationContext {
  revision: string;
  deployment: string;
  environment: 'isolated' | 'preview' | 'production';
}
export interface VerificationReceipt extends VerificationContext {
  checkId: string;
  kind: EvidenceKind | 'simulation';
  status: EvidenceStatus;
  observedAt: string;
  /** SHA-256 of retained private evidence, never its contents, URL or credentials. */
  evidenceSha256: string;
  /** Actual requests made by the verifier, not inferred from provider flags. */
  networkRequests: number;
}
export interface VerificationRequirement { id: string; kind: EvidenceKind }
export interface VerificationCheck {
  id: string;
  status: EvidenceStatus;
  reason: 'missing-context' | 'missing-evidence' | 'duplicate-evidence' | 'invalid-evidence' | 'receipt-passed' | 'receipt-failed' | 'receipt-blocked' | 'receipt-unverified';
  evidenceSha256: string | null;
}

export function evaluateVerificationEvidence(
  requirements: readonly VerificationRequirement[],
  context?: VerificationContext,
  receipts: readonly VerificationReceipt[] = [],
  now = new Date(),
): { allChecksPassed: boolean; checks: VerificationCheck[] } {
  const validContext = context && /^[a-f0-9]{40}$/.test(context.revision) &&
    /^[A-Za-z0-9_-]{1,160}$/.test(context.deployment) &&
    ['isolated', 'preview', 'production'].includes(context.environment) && Number.isFinite(now.getTime());
  const checks = requirements.map(({id, kind}): VerificationCheck => {
    const reject = (reason: VerificationCheck['reason']): VerificationCheck => ({id, status: 'unverified', reason, evidenceSha256: null});
    if (!validContext) return reject('missing-context');
    const matches = receipts.filter(receipt => receipt.checkId === id);
    if (!matches.length) return reject('missing-evidence');
    if (matches.length !== 1) return reject('duplicate-evidence');
    const receipt = matches[0], time = Date.parse(receipt.observedAt);
    if (receipt.kind !== kind || receipt.revision !== context.revision || receipt.deployment !== context.deployment ||
      receipt.environment !== context.environment || !Number.isFinite(time) || time > now.getTime() ||
      now.getTime() - time > 24 * 60 * 60 * 1000 || !/^[a-f0-9]{64}$/.test(receipt.evidenceSha256) ||
      !Number.isSafeInteger(receipt.networkRequests) || receipt.networkRequests < 1 ||
      !['passed', 'failed', 'blocked', 'unverified'].includes(receipt.status)) return reject('invalid-evidence');
    return {id, status: receipt.status, reason: `receipt-${receipt.status}`, evidenceSha256: receipt.evidenceSha256};
  });
  return {allChecksPassed: checks.length > 0 && checks.every(check => check.status === 'passed'), checks};
}

import {getStorageProvider, isSqlDisabled} from './provider-switch';
import {evaluateVerificationEvidence, type VerificationContext, type VerificationReceipt, type VerificationRequirement} from './verification-evidence';

export const PRODUCTION_ACCEPTANCE_REQUIREMENTS: readonly VerificationRequirement[] = [
  {id: 'deployment-revision', kind: 'provider'},
  {id: 'public-design-and-login', kind: 'browser'},
  {id: 'authenticated-studio-workflows', kind: 'browser'},
  {id: 'auth-expiry-revocation-concurrency', kind: 'provider'},
  {id: 'records-and-relationships', kind: 'migration'},
  {id: 'media-bytes-and-privacy', kind: 'migration'},
  {id: 'backup-restore', kind: 'recovery'},
  {id: 'post-cutover-write-recovery', kind: 'recovery'},
  {id: 'provider-independence', kind: 'provider'},
];

/** Read-only receipt evaluation. No probe writes, synthetic backup or inferred
 * visual/security verdicts. An environment flag is never acceptance evidence. */
export function verifyProductionAcceptance(
  env: NodeJS.ProcessEnv = process.env,
  evidence: {context?: VerificationContext; receipts?: readonly VerificationReceipt[]; now?: Date} = {},
) {
  const result = evaluateVerificationEvidence(PRODUCTION_ACCEPTANCE_REQUIREMENTS, evidence.context, evidence.receipts, evidence.now);
  const production = evidence.context?.environment === 'production';
  return {
    schemaVersion: 2 as const,
    timestamp: (evidence.now ?? new Date()).toISOString(),
    kind: 'evidence-review' as const,
    context: evidence.context ?? null,
    provider: getStorageProvider(env),
    sqlDisabled: isSqlDisabled(env),
    ...result,
    verdict: result.allChecksPassed && production ? 'EVIDENCE_COMPLETE_PENDING_RELEASE_REVIEW' as const : 'NOT_READY' as const,
    releaseAuthorized: false as const,
    networkRequestsPerformed: 0,
    limitations: ['This evaluator does not authenticate receipts or run the checks. Review their retained evidence and exact deployment before release.'],
  };
}

export type ProductionAcceptanceReport = ReturnType<typeof verifyProductionAcceptance>;

import {evaluateVerificationEvidence, type VerificationContext, type VerificationReceipt, type VerificationRequirement} from './verification-evidence';

export const CANONICAL_SEVEN_VIEWPORTS = [
  {width: 320, height: 800}, {width: 512, height: 900}, {width: 768, height: 1024},
  {width: 992, height: 900}, {width: 1200, height: 900}, {width: 1440, height: 900},
  {width: 1920, height: 1080},
] as const;
export const REQUIRED_BROWSER_SURFACES = ['home', 'creations', 'signature-footer', 'login', 'studio'] as const;
export const RESPONSIVE_REQUIREMENTS: readonly VerificationRequirement[] = REQUIRED_BROWSER_SURFACES.flatMap(surface =>
  CANONICAL_SEVEN_VIEWPORTS.map(({width}) => ({id: `responsive:${surface}:${width}`, kind: 'browser' as const})),
);
export const INTEGRATED_REQUIREMENTS: readonly VerificationRequirement[] = [
  {id: 'browser-api-store-reload', kind: 'browser'},
  {id: 'publication-public-readback', kind: 'browser'},
  {id: 'security-and-concurrent-workers', kind: 'provider'},
  {id: 'durable-jobs-restart-and-fencing', kind: 'provider'},
  {id: 'catalogue-editable-slides-pdf', kind: 'provider'},
  {id: 'provider-failures-and-quota', kind: 'provider'},
  {id: 'obsolete-provider-independence', kind: 'provider'},
  ...RESPONSIVE_REQUIREMENTS,
];

/** Missing, old, simulated or wrong-revision captures remain unverified.
 * Receipt generation belongs to a real browser runner. */
export function verifySevenWidthResponsiveMatrix(context?: VerificationContext, receipts: readonly VerificationReceipt[] = [], now?: Date) {
  const result = evaluateVerificationEvidence(RESPONSIVE_REQUIREMENTS, context, receipts, now);
  return {...result, viewportsTested: CANONICAL_SEVEN_VIEWPORTS.filter(({width}) =>
    REQUIRED_BROWSER_SURFACES.every(surface => result.checks.some(check => check.id === `responsive:${surface}:${width}` && check.status === 'passed')),
  ).length, allViewportsPass: result.allChecksPassed};
}

/** Aggregates receipts only; unit-test simulations never become end-to-end
 * provider acceptance. No global storage-provider change occurs during inspection. */
export async function runFullIntegratedVerification(
  context?: VerificationContext,
  receipts: readonly VerificationReceipt[] = [],
  now?: Date,
) {
  const result = evaluateVerificationEvidence(INTEGRATED_REQUIREMENTS, context, receipts, now);
  return {
    schemaVersion: 2 as const, kind: 'evidence-review' as const, context: context ?? null,
    timestamp: (now ?? new Date()).toISOString(), ...result,
    networkRequestsPerformed: 0,
    responsiveMatrix: verifySevenWidthResponsiveMatrix(context, receipts, now),
    unresolvedIssues: result.checks.filter(check => check.status !== 'passed').map(check => `${check.id}:${check.reason}`),
  };
}

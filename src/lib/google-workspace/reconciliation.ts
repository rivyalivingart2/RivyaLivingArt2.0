import { createHash } from 'node:crypto';
import { canonicalArtifactJson } from './record-codec';
import { reconcileSource } from '../../../tools/google-workspace/migration.mjs';
import publicCreations from '../selected-creations-public.json';
import type {
  SourceSchemaDefinition,
  ImporterPlanResult,
  ImporterCheckpoint,
  RestorationConflict,
  MediaMappingEntry,
} from './importer';

export interface TableReconciliationSummary {
  sourceTable: string;
  workbook: string;
  sheet: string;
  sourceRows: number;
  inlinePlanned: number;
  driveArtifactsPlanned: number;
  recordsCommitted: null;
  reportedCommitClaims: number;
  conflictsRecorded: number;
  stableIdsUnique: boolean;
  plannedPayloadSetSha256: string;
  status: 'planned' | 'discrepancy';
}

export interface ReconciliationReport {
  schemaVersion: 1;
  kind: 'google-workspace-migration-reconciliation-report';
  generatedAt: string;
  gitRevision: string;
  scope: 'ISOLATED_SYNTHETIC_REHEARSAL';
  productionAuthorityRetained: boolean;
  summary: {
    tablesTotal: number;
    tablesReconciled: number;
    sourceRowsTotal: number;
    inlineRecordsCommitted: null;
    reportedInlineCommitClaims: number;
    sourcePlanAccountsForAllRows: boolean;
    driveArtifactsPlanned: number;
    conflictsRecorded: number;
    allSourceRecordsAccountedFor: boolean;
    relationshipsValid: boolean;
    mediaAssetsReconciled: boolean;
    interruptionRecoveryVerified: boolean;
  };
  mediaLineage: {
    approvedCreationsCount: number;
    expectedCreationsCount: 169;
    variantsCount: number;
    expectedVariantsCount: 507;
    unassignedProductAssociations: number;
    lineageConsistent: boolean;
  };
  recoverySimulation: {
    simulatedInterruptionRow: number;
    resumedRowsCommitted: number;
    duplicateCommits: number;
    cleanResumeVerified: boolean;
  };
  tables: TableReconciliationSummary[];
  conflicts: RestorationConflict[];
  limitations: string[];
}

export interface GenerateReconciliationOptions {
  schema: SourceSchemaDefinition;
  sourceData: Record<string, readonly Record<string, unknown>[]>;
  plan: ImporterPlanResult;
  checkpoint: ImporterCheckpoint;
  mediaLineage?: readonly MediaMappingEntry[];
  gitRevision?: string;
  now?: string;
  recoverySimulation?: {
    simulatedInterruptionRow: number;
    resumedRowsCommitted: number;
    duplicateCommits: number;
    cleanResumeVerified: boolean;
  };
}

export function generateReconciliationReport(
  options: GenerateReconciliationOptions
): ReconciliationReport {
  const {
    schema,
    sourceData,
    plan,
    checkpoint,
    mediaLineage = [],
    gitRevision = 'unspecified',
    now = new Date().toISOString(),
    recoverySimulation = {
      simulatedInterruptionRow: 0,
      resumedRowsCommitted: 0,
      duplicateCommits: 0,
      cleanResumeVerified: false,
    },
  } = options;

  const tables: TableReconciliationSummary[] = [];
  let reconciledTablesCount = 0;
  let totalSourceRows = 0;
  let totalInline = 0;
  let totalArtifacts = 0;

  for (const table of schema.tables) {
    const rows = sourceData[table.sourceTable] || [];
    const tablePlan = plan.tableSummaries.find(t => t.sourceTable === table.sourceTable);
    const tableCkpt = checkpoint.tableCheckpoints[table.sourceTable];

    const sourceRowsCount = rows.length;
    const inlineCount = tablePlan?.inlineCount ?? 0;
    const artifactCount = tablePlan?.driveArtifactCount ?? 0;
    const committedClaim = tableCkpt?.rowsProcessed ?? 0;
    const conflicts = plan.conflictEntries.filter(c => c.sourceEntity === table.sourceTable).length;

    totalSourceRows += sourceRowsCount;
    totalInline += inlineCount;
    totalArtifacts += artifactCount;

    const shaList = tableCkpt?.sha256Set && tableCkpt.sha256Set.length > 0
      ? [...tableCkpt.sha256Set].sort()
      : plan.crosswalkEntries.filter(c => c.sourceEntity === table.sourceTable).map(c => c.payloadSha256).sort();

    const payloadSetSha256 = createHash('sha256').update(canonicalArtifactJson(shaList)).digest('hex');
    const stableIdsUnique = tablePlan?.stableIdsUnique ?? false;
    const isReconciled = stableIdsUnique && (inlineCount + artifactCount === sourceRowsCount);

    if (isReconciled) {
      reconciledTablesCount++;
    }

    tables.push({
      sourceTable: table.sourceTable,
      workbook: table.workbook,
      sheet: table.sheet,
      sourceRows: sourceRowsCount,
      inlinePlanned: inlineCount,
      driveArtifactsPlanned: artifactCount,
      recordsCommitted: null,
      reportedCommitClaims: committedClaim,
      conflictsRecorded: conflicts,
      stableIdsUnique,
      plannedPayloadSetSha256: payloadSetSha256,
      status: isReconciled ? 'planned' : 'discrepancy',
    });
  }

  // Media Lineage verification
  const creationImages = new Set<string>();
  let validVariantsCount = 0;
  let invalidAssociations = 0;

  const approved = new Map(publicCreations.images.flatMap(image => image.variants.map(variant => [variant.url, variant] as const)));
  const seenVariants = new Set<string>();
  for (const entry of mediaLineage) {
    if (entry.provenance === 'owner-completed-resin-work') {
      const match = entry.mediaId.match(/owner-creation-(\d+)/);
      if (match) {
        creationImages.add(match[1]);
      }
      const variant = approved.get(entry.derivativePath);
      if (variant && variant.width === entry.width && variant.height === entry.height && variant.bytes === entry.bytes && variant.sha256 === entry.sha256 && !seenVariants.has(entry.derivativePath)) {
        validVariantsCount++;
        seenVariants.add(entry.derivativePath);
      }
      if (entry.associatedEntity !== undefined) {
        invalidAssociations++;
      }
    }
  }

  const mediaAssetsReconciled =
    creationImages.size === 169 &&
    validVariantsCount === 507 &&
    invalidAssociations === 0;

  const allSourceRecordsAccountedFor =
    reconciledTablesCount === schema.tables.length &&
    totalInline + totalArtifacts === totalSourceRows;

  let relationshipsValid = false;
  try { reconcileSource(schema, sourceData); relationshipsValid = true; } catch { /* Invalid source is reported without private values. */ }

  return {
    schemaVersion: 1,
    kind: 'google-workspace-migration-reconciliation-report',
    generatedAt: now,
    gitRevision,
    scope: 'ISOLATED_SYNTHETIC_REHEARSAL',
    productionAuthorityRetained: true,
    summary: {
      tablesTotal: schema.tables.length,
      tablesReconciled: 0,
      sourceRowsTotal: totalSourceRows,
      inlineRecordsCommitted: null,
      reportedInlineCommitClaims: checkpoint.inlineCommitted,
      sourcePlanAccountsForAllRows: allSourceRecordsAccountedFor,
      driveArtifactsPlanned: checkpoint.driveArtifactsPlanned,
      conflictsRecorded: checkpoint.conflictsRecorded,
      allSourceRecordsAccountedFor: false,
      relationshipsValid,
      mediaAssetsReconciled: false,
      interruptionRecoveryVerified: false,
    },
    mediaLineage: {
      approvedCreationsCount: creationImages.size,
      expectedCreationsCount: 169,
      variantsCount: validVariantsCount,
      expectedVariantsCount: 507,
      unassignedProductAssociations: invalidAssociations,
      lineageConsistent: mediaAssetsReconciled,
    },
    recoverySimulation: {
      simulatedInterruptionRow: recoverySimulation.simulatedInterruptionRow,
      resumedRowsCommitted: recoverySimulation.resumedRowsCommitted,
      duplicateCommits: recoverySimulation.duplicateCommits,
      cleanResumeVerified: recoverySimulation.cleanResumeVerified,
    },
    tables,
    conflicts: [...plan.conflictEntries],
    limitations: [
      'Scope is a synthetic planning simulation. No target readback or actual committed record is verified.',
      'Source relationships are checked; source planning is separate from destination reconciliation.',
      'Media metadata matching is separate from reading and hashing original/derivative bytes.',
      'No cloud mutations, Sheets API writes, or Drive uploads performed in rehearsal.',
      'Synthetic records used where owner business exports are not present.',
      'All 169 creation photos remain strictly design-visualization without invented product associations.',
      'Real production cutover and CMS publication retain distinct required authorization gates.',
    ],
  };
}

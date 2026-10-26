import {
  canonicalArtifactJson,
  type GoogleWorkspaceRecord,
} from './record-codec';
import {
  planSourceRecord,
  reconcileSource,
} from '../../../tools/google-workspace/migration.mjs';

export interface SourceFieldDefinition {
  name: string;
  sqlType: string;
  nullable: boolean;
  representation: 'text' | 'integer' | 'decimal-string' | 'boolean' | 'preserved-json';
}

export interface SourceConstraintDefinition {
  name: string;
  definition: string;
}

export interface SourceTableDefinition {
  sourceTable: string;
  workbook: string;
  sheet: string;
  primaryKey: readonly string[];
  fields: readonly SourceFieldDefinition[];
  constraints: readonly SourceConstraintDefinition[];
}

export interface SourceSchemaDefinition {
  schemaVersion: 1;
  workbooks: Record<string, { classification: string; canonicalEditors: string; directEditing: string }>;
  tables: readonly SourceTableDefinition[];
}

export interface ImporterCheckpoint {
  schemaVersion: 1;
  checkpointId: string;
  createdAt: string;
  updatedAt: string;
  currentTableIndex: number;
  currentRowIndex: number;
  completedTables: string[];
  totalRowsProcessed: number;
  inlineCommitted: number;
  driveArtifactsPlanned: number;
  conflictsRecorded: number;
  lastCommittedRecordId: string | null;
  tableCheckpoints: Record<string, {
    rowsTotal: number;
    rowsProcessed: number;
    completed: boolean;
    sha256Set: string[];
  }>;
}

export interface MediaMappingEntry {
  mediaId: string;
  originalPath?: string;
  derivativePath: string;
  width: number;
  height: number;
  bytes: number;
  sha256: string;
  classification: 'design-visualization' | 'material-visualization' | 'documentary-photography' | 'unknown';
  provenance: string;
  associatedEntity?: { table: string; id: string };
}

export interface RestorationConflict {
  sourceNamespace: string;
  sourceEntity: string;
  sourceId: string;
  fieldPath: string;
  sourceValueJson: string;
  destinationValueJson: string;
  disposition: 'PENDING_REVIEW' | 'RETAINED_CURRENT' | 'MERGED_VALID' | 'EXCLUDED';
  detectedAt: string;
}

export interface RestorationCrosswalk {
  sourceNamespace: string;
  sourceEntity: string;
  sourceId: string;
  destinationWorkbook: string;
  destinationSheet: string;
  recordId: string;
  payloadSha256: string;
  evidence: string;
}

export interface ImporterPlanResult {
  tablesPlanned: number;
  totalRows: number;
  inlineCount: number;
  driveArtifactCount: number;
  crosswalkEntries: RestorationCrosswalk[];
  conflictEntries: RestorationConflict[];
  mediaEntries: MediaMappingEntry[];
  tableSummaries: {
    sourceTable: string;
    workbook: string;
    sheet: string;
    rows: number;
    inlineCount: number;
    driveArtifactCount: number;
    stableIdsUnique: boolean;
  }[];
}

export interface TargetWriterAdapter {
  commitBatch: (
    workbook: string,
    sheet: string,
    records: GoogleWorkspaceRecord[]
  ) => Promise<{ committed: number }>;
  readExistingRecord: (
    workbook: string,
    sheet: string,
    recordId: string
  ) => Promise<GoogleWorkspaceRecord | null>;
}

export class ImporterError extends Error {
  constructor(public readonly code: string, message: string) {
    super(`${code}: ${message}`);
    this.name = 'ImporterError';
  }
}

export function createInitialCheckpoint(checkpointId: string, now = new Date().toISOString()): ImporterCheckpoint {
  return {
    schemaVersion: 1,
    checkpointId,
    createdAt: now,
    updatedAt: now,
    currentTableIndex: 0,
    currentRowIndex: 0,
    completedTables: [],
    totalRowsProcessed: 0,
    inlineCommitted: 0,
    driveArtifactsPlanned: 0,
    conflictsRecorded: 0,
    lastCommittedRecordId: null,
    tableCheckpoints: {},
  };
}

export class IsolatedImporter {
  constructor(
    private readonly schema: SourceSchemaDefinition,
    private readonly mediaLineage: readonly MediaMappingEntry[] = []
  ) {
    if (!schema || schema.schemaVersion !== 1 || !Array.isArray(schema.tables)) {
      throw new ImporterError('INVALID_SCHEMA', 'Schema definition must have schemaVersion 1 and tables array');
    }
  }

  /**
   * Plan migration rehearsal in memory without network or mutations.
   * Enforces that product entities are excluded from archive import.
   */
  public plan(sourceData: Record<string, readonly Record<string, unknown>[]>): ImporterPlanResult {
    reconcileSource(this.schema, sourceData as Record<string, Record<string, unknown>[]>);

    const crosswalkEntries: RestorationCrosswalk[] = [];
    const conflictEntries: RestorationConflict[] = [];
    const tableSummaries: ImporterPlanResult['tableSummaries'] = [];
    let totalInline = 0;
    let totalArtifacts = 0;
    let totalRows = 0;

    for (const table of this.schema.tables) {
      const rows = sourceData[table.sourceTable] || [];
      totalRows += rows.length;

      const seenIds = new Set<string>();
      let inlineForTable = 0;
      let artifactsForTable = 0;

      for (const row of rows) {
        const planned = planSourceRecord(table, row);
        const recId = planned.disposition === 'inline' ? planned.record.recordId : planned.recordId;

        if (seenIds.has(recId)) {
          conflictEntries.push({
            sourceNamespace: 'production_migration',
            sourceEntity: table.sourceTable,
            sourceId: String(row[table.primaryKey[0]] ?? recId),
            fieldPath: table.primaryKey.join('+'),
            sourceValueJson: canonicalArtifactJson(row),
            destinationValueJson: '',
            disposition: 'PENDING_REVIEW',
            detectedAt: new Date().toISOString(),
          });
        }
        seenIds.add(recId);

        if (planned.disposition === 'inline') {
          inlineForTable++;
          totalInline++;
          crosswalkEntries.push({
            sourceNamespace: 'production_migration',
            sourceEntity: table.sourceTable,
            sourceId: table.primaryKey.map(k => String(row[k])).join('+'),
            destinationWorkbook: table.workbook,
            destinationSheet: table.sheet,
            recordId: recId,
            payloadSha256: planned.record.payloadSha256,
            evidence: 'GW-301-isolated-rehearsal',
          });
        } else {
          artifactsForTable++;
          totalArtifacts++;
          crosswalkEntries.push({
            sourceNamespace: 'production_migration',
            sourceEntity: table.sourceTable,
            sourceId: table.primaryKey.map(k => String(row[k])).join('+'),
            destinationWorkbook: table.workbook,
            destinationSheet: table.sheet,
            recordId: recId,
            payloadSha256: planned.payloadSha256,
            evidence: 'GW-301-isolated-drive-artifact-required',
          });
        }
      }

      tableSummaries.push({
        sourceTable: table.sourceTable,
        workbook: table.workbook,
        sheet: table.sheet,
        rows: rows.length,
        inlineCount: inlineForTable,
        driveArtifactCount: artifactsForTable,
        stableIdsUnique: seenIds.size === rows.length,
      });
    }

    return {
      tablesPlanned: this.schema.tables.length,
      totalRows,
      inlineCount: totalInline,
      driveArtifactCount: totalArtifacts,
      crosswalkEntries,
      conflictEntries,
      mediaEntries: [...this.mediaLineage],
      tableSummaries,
    };
  }

  /**
   * Execute or resume an isolated migration batch run against a target writer.
   * Interruption-safe: returns updated checkpoint if stopped or interrupted.
   */
  public async execute(options: {
    sourceData: Record<string, readonly Record<string, unknown>[]>;
    targetWriter: TargetWriterAdapter;
    checkpoint?: ImporterCheckpoint;
    batchSize?: number;
    signal?: AbortSignal;
    now?: () => string;
  }): Promise<{
    status: 'completed' | 'interrupted';
    checkpoint: ImporterCheckpoint;
    recordsCommitted: number;
    conflictsEncountered: number;
    artifactsEncountered: number;
  }> {
    const {sourceData, targetWriter, batchSize = 50, signal, now = () => new Date().toISOString()} = options;
    const checkpoint = options.checkpoint
      ? (JSON.parse(canonicalArtifactJson(options.checkpoint)) as ImporterCheckpoint)
      : createInitialCheckpoint(`ckpt_${Date.now()}`, now());

    let recordsCommittedThisRun = 0;
    let conflictsThisRun = 0;
    let artifactsThisRun = 0;

    for (let tIdx = checkpoint.currentTableIndex; tIdx < this.schema.tables.length; tIdx++) {
      if (signal?.aborted) {
        checkpoint.updatedAt = now();
        return {
          status: 'interrupted',
          checkpoint,
          recordsCommitted: recordsCommittedThisRun,
          conflictsEncountered: conflictsThisRun,
          artifactsEncountered: artifactsThisRun,
        };
      }

      const table = this.schema.tables[tIdx];
      const rows = sourceData[table.sourceTable] || [];

      if (!checkpoint.tableCheckpoints[table.sourceTable]) {
        checkpoint.tableCheckpoints[table.sourceTable] = {
          rowsTotal: rows.length,
          rowsProcessed: 0,
          completed: false,
          sha256Set: [],
        };
      }

      const tableCkpt = checkpoint.tableCheckpoints[table.sourceTable];
      const rowStart = (tIdx === checkpoint.currentTableIndex) ? checkpoint.currentRowIndex : 0;

      let pendingBatch: GoogleWorkspaceRecord[] = [];

      for (let rIdx = rowStart; rIdx < rows.length; rIdx++) {
        if (signal?.aborted) {
          if (pendingBatch.length > 0) {
            await targetWriter.commitBatch(table.workbook, table.sheet, pendingBatch);
            recordsCommittedThisRun += pendingBatch.length;
            checkpoint.inlineCommitted += pendingBatch.length;
            checkpoint.totalRowsProcessed += pendingBatch.length;
            checkpoint.lastCommittedRecordId = pendingBatch[pendingBatch.length - 1].recordId;
            tableCkpt.rowsProcessed += pendingBatch.length;
            pendingBatch = [];
          }
          checkpoint.currentTableIndex = tIdx;
          checkpoint.currentRowIndex = rIdx;
          checkpoint.updatedAt = now();
          return {
            status: 'interrupted',
            checkpoint,
            recordsCommitted: recordsCommittedThisRun,
            conflictsEncountered: conflictsThisRun,
            artifactsEncountered: artifactsThisRun,
          };
        }

        const row = rows[rIdx];
        const planned = planSourceRecord(table, row);

        if (planned.disposition === 'inline') {
          const existing = await targetWriter.readExistingRecord(table.workbook, table.sheet, planned.record.recordId);
          if (existing && existing.payloadSha256 !== planned.record.payloadSha256) {
            conflictsThisRun++;
            checkpoint.conflictsRecorded++;
            continue;
          }

          pendingBatch.push(planned.record);
          tableCkpt.sha256Set.push(planned.record.payloadSha256);

          if (pendingBatch.length >= batchSize) {
            await targetWriter.commitBatch(table.workbook, table.sheet, pendingBatch);
            recordsCommittedThisRun += pendingBatch.length;
            checkpoint.inlineCommitted += pendingBatch.length;
            checkpoint.totalRowsProcessed += pendingBatch.length;
            checkpoint.lastCommittedRecordId = pendingBatch[pendingBatch.length - 1].recordId;
            tableCkpt.rowsProcessed += pendingBatch.length;
            checkpoint.currentRowIndex = rIdx + 1;
            checkpoint.updatedAt = now();
            pendingBatch = [];
          }
        } else {
          artifactsThisRun++;
          checkpoint.driveArtifactsPlanned++;
          checkpoint.totalRowsProcessed++;
          tableCkpt.rowsProcessed++;
          tableCkpt.sha256Set.push(planned.payloadSha256);
          checkpoint.currentRowIndex = rIdx + 1;
        }
      }

      if (pendingBatch.length > 0) {
        await targetWriter.commitBatch(table.workbook, table.sheet, pendingBatch);
        recordsCommittedThisRun += pendingBatch.length;
        checkpoint.inlineCommitted += pendingBatch.length;
        checkpoint.totalRowsProcessed += pendingBatch.length;
        checkpoint.lastCommittedRecordId = pendingBatch[pendingBatch.length - 1].recordId;
        tableCkpt.rowsProcessed += pendingBatch.length;
        pendingBatch = [];
      }

      tableCkpt.completed = true;
      if (!checkpoint.completedTables.includes(table.sourceTable)) {
        checkpoint.completedTables.push(table.sourceTable);
      }
      checkpoint.currentTableIndex = tIdx + 1;
      checkpoint.currentRowIndex = 0;
      checkpoint.updatedAt = now();
    }

    return {
      status: 'completed',
      checkpoint,
      recordsCommitted: recordsCommittedThisRun,
      conflictsEncountered: conflictsThisRun,
      artifactsEncountered: artifactsThisRun,
    };
  }
}

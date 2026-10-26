import type { GoogleWorkspaceRecord } from '../../src/lib/google-workspace/record-codec';

export class MigrationValidationError extends Error {
  code: string;
  table: string;
  field?: string;
  constructor(code: string, table: string, field?: string);
}

export type PlannedRecord =
  | {
      disposition: 'inline';
      record: GoogleWorkspaceRecord;
      cells: string[];
    }
  | {
      disposition: 'drive-artifact-required';
      recordId: string;
      payloadSha256: string;
      characters: number;
      bytes: number;
      mimeType: string;
      driveFileId: null;
    };

export function parseLosslessRow(text: string): Record<string, unknown>;
export function validateSourceRow(table: unknown, row: unknown): Record<string, unknown>;
export function stableRecordId(table: unknown, row: unknown): string;
export function prepareRecord(table: unknown, row: unknown): { record: GoogleWorkspaceRecord; cells: string[] };
export function planSourceRecord(table: unknown, row: unknown): PlannedRecord;
export function verifySourceShape(schema: unknown, columns: unknown, constraints: unknown): boolean;
export function reconcileSource(schema: unknown, source: unknown): { tables: number; rows: number; constraintsChecked: number };
export function toGoogleCells(values: string[]): { userEnteredValue: { stringValue: string } }[];

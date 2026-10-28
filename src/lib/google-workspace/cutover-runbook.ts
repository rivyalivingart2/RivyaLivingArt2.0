import { createHash } from 'node:crypto';
import schemaData from './schema.json';
import publicCreationsData from '../selected-creations-public.json';

export type CutoverStage =
  | 'PRE_CUTOVER_STANDBY'
  | 'WRITE_PAUSE_ACQUIRED'
  | 'DELTA_SYNC_COMMITTED'
  | 'POINTER_SWITCHED'
  | 'POST_CUTOVER_ACTIVE'
  | 'ROLLED_BACK';

export interface BackupTableManifest {
  readonly sourceTable: string;
  readonly workbook: string;
  readonly sheet: string;
  readonly rowCount: number | null;
  readonly primaryKey: readonly string[];
  readonly payloadSha256: string | null;
}

export interface BackupRecoveryManifest {
  readonly schemaVersion: 1;
  readonly snapshotId: string;
  readonly createdAt: string;
  readonly tablesTotal: number;
  readonly totalRows: number | null;
  readonly tables: readonly BackupTableManifest[];
  readonly mediaAssets: {
    readonly creationsCount: number;
    readonly variantsCount: number;
    readonly manifestSha256: string;
    readonly bytesVerified: false;
  };
  readonly workbooks: Record<string, { readonly classification: string; readonly sheetCount: number }>;
  readonly status: 'INVENTORY_ONLY_NOT_A_BACKUP';
  readonly evidenceKind: 'source-schema';
}

export interface WritePauseOptions {
  readonly durationSeconds: number;
  readonly drainTimeoutMs: number;
  readonly reason: string;
  readonly operator: string;
}

export interface WritePauseReceipt {
  readonly mode: 'simulation';
  readonly lockId: string;
  readonly acquiredAt: string;
  readonly expiresAt: string;
  readonly durationSeconds: number;
  readonly inFlightDrained: boolean;
  readonly reason: string;
}

export interface FinalDeltaSyncItem {
  readonly table: string;
  readonly action: 'insert' | 'update';
  readonly recordId: string;
  readonly revision: number;
  readonly sha256: string;
}

export interface FinalDeltaSyncPlan {
  readonly mode: 'simulation';
  readonly planId: string;
  readonly createdAt: string;
  readonly items: readonly FinalDeltaSyncItem[];
  readonly totalChanges: number;
  readonly zeroCanonicalDeletions: boolean;
  readonly batchSha256: string;
}

export interface PointerSwitchReceipt {
  readonly mode: 'simulation';
  readonly switchId: string;
  readonly previousRevision: number;
  readonly newRevision: number;
  readonly targetArtifactId: string;
  readonly targetChecksum: string;
  readonly switchedAt: string;
  readonly reversible: boolean;
}

export interface PostCutoverAuditRecord {
  readonly mode: 'simulation';
  readonly sequence: number;
  readonly timestamp: string;
  readonly table: string;
  readonly operation: 'insert' | 'update' | 'archive';
  readonly recordId: string;
  readonly payload: unknown;
  readonly actor: string;
  readonly signature: string;
}

/** In-process planning model only. It does not pause application writes, drain
 * transactions, change durable authority or persist a recovery ledger. */
class CutoverOrchestrator {
  private currentStage: CutoverStage = 'PRE_CUTOVER_STANDBY';
  private writePauseLock: WritePauseReceipt | null = null;
  private postCutoverLedger: PostCutoverAuditRecord[] = [];
  private sequenceCounter = 0;
  private activePointerRevision = 1;
  private previousPointerRevision = 1;

  public getStage(): CutoverStage {
    return this.currentStage;
  }

  public setStage(stage: CutoverStage): void {
    this.currentStage = stage;
  }

  /**
   * GW-1000: Generate machine-readable backup and recovery manifest
   * across all 28 canonical tables and 169 selected creations.
   */
  public generateBackupRecoveryManifest(snapshotId?: string): BackupRecoveryManifest {
    const id = snapshotId || `manifest-snap-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const workbookCounts: Record<string, number> = {
      content: 0,
      operations: 0,
      security: 0,
      system: 0,
    };

    const tables: BackupTableManifest[] = schemaData.tables.map((t) => {
      const wb = t.workbook;
      if (workbookCounts[wb] !== undefined) {
        workbookCounts[wb]++;
      }

      return {
        sourceTable: t.sourceTable,
        workbook: t.workbook,
        sheet: t.sheet,
        rowCount: null,
        primaryKey: t.primaryKey,
        payloadSha256: null,
      };
    });

    const creationsCount = publicCreationsData.images.length;
    const variantsCount = publicCreationsData.images.reduce(
      (acc: number, img) => acc + img.variants.length,
      0
    );

    const mediaSeed = JSON.stringify(publicCreationsData.images.map((img) => ({
      index: img.index,
      variants: img.variants.map((v) => ({ width: v.width, url: v.url })),
    })));
    const mediaChecksum = createHash('sha256').update(mediaSeed).digest('hex');

    return {
      schemaVersion: 1,
      snapshotId: id,
      createdAt: now,
      tablesTotal: tables.length,
      totalRows: null,
      tables,
      mediaAssets: {
        creationsCount,
        variantsCount,
        manifestSha256: mediaChecksum,
        bytesVerified: false,
      },
      workbooks: {
        content: { classification: 'private-editorial', sheetCount: workbookCounts.content },
        operations: { classification: 'confidential-business', sheetCount: workbookCounts.operations },
        security: { classification: 'restricted-identity', sheetCount: workbookCounts.security },
        system: { classification: 'restricted-operations', sheetCount: workbookCounts.system },
      },
      status: 'INVENTORY_ONLY_NOT_A_BACKUP',
      evidenceKind: 'source-schema',
    };
  }

  /**
   * GW-1000: Acquire bounded inbound write pause with safety timeout budget (< 30s).
   */
  public acquireWritePause(options: WritePauseOptions): WritePauseReceipt {
    if (!Number.isFinite(options.durationSeconds) || options.durationSeconds <= 0 || options.durationSeconds > 30) {
      throw new Error(`Write pause duration of ${options.durationSeconds}s exceeds 30s safety budget.`);
    }

    const now = Date.now();
    const expiresAtMs = now + options.durationSeconds * 1000;
    const lockId = `wp-lock-${createHash('sha256').update(`${options.operator}:${now}`).digest('hex').slice(0, 16)}`;

    this.writePauseLock = {
      mode: 'simulation',
      lockId,
      acquiredAt: new Date(now).toISOString(),
      expiresAt: new Date(expiresAtMs).toISOString(),
      durationSeconds: options.durationSeconds,
      inFlightDrained: false,
      reason: options.reason,
    };

    this.currentStage = 'WRITE_PAUSE_ACQUIRED';
    return this.writePauseLock;
  }

  public isWritePaused(): boolean {
    if (!this.writePauseLock) return false;
    const now = Date.now();
    const expiresAt = new Date(this.writePauseLock.expiresAt).getTime();
    if (now > expiresAt) {
      this.writePauseLock = null;
      return false;
    }
    return true;
  }

  public releaseWritePause(lockId: string): boolean {
    if (this.writePauseLock && this.writePauseLock.lockId === lockId) {
      this.writePauseLock = null;
      return true;
    }
    return false;
  }

  /**
   * GW-1000: Plan final delta sync between source store and Google Workspace target.
   */
  public planFinalDeltaSync(
    sourceItems: readonly { table: string; id: string; rev: number; data: unknown }[]
  ): FinalDeltaSyncPlan {
    const items: FinalDeltaSyncItem[] = sourceItems.map((item) => {
      const sha256 = createHash('sha256').update(JSON.stringify(item.data)).digest('hex');
      return {
        table: item.table,
        action: 'insert',
        recordId: item.id,
        revision: item.rev,
        sha256,
      };
    });

    const batchHash = createHash('sha256')
      .update(JSON.stringify(items.map((i) => i.sha256)))
      .digest('hex');

    const planId = `delta-plan-${batchHash.slice(0, 12)}`;
    return {
      mode: 'simulation',
      planId,
      createdAt: new Date().toISOString(),
      items,
      totalChanges: items.length,
      zeroCanonicalDeletions: true,
      batchSha256: batchHash,
    };
  }

  /**
   * GW-1000: Execute active publication pointer switch with rollback tracking.
   */
  public executeActivePointerSwitch(
    targetArtifactId: string,
    targetChecksum: string
  ): PointerSwitchReceipt {
    this.previousPointerRevision = this.activePointerRevision;
    this.activePointerRevision += 1;

    const switchId = `ptr-sw-${createHash('sha256').update(targetArtifactId + this.activePointerRevision).digest('hex').slice(0, 12)}`;
    this.currentStage = 'POINTER_SWITCHED';

    return {
      mode: 'simulation',
      switchId,
      previousRevision: this.previousPointerRevision,
      newRevision: this.activePointerRevision,
      targetArtifactId,
      targetChecksum,
      switchedAt: new Date().toISOString(),
      reversible: true,
    };
  }

  /**
   * GW-1000: Capture post-cutover write events into isolated recovery ledger.
   */
  public capturePostCutoverWrite(
    entry: Omit<PostCutoverAuditRecord, 'sequence' | 'timestamp' | 'signature' | 'mode'>
  ): PostCutoverAuditRecord {
    this.sequenceCounter++;
    const timestamp = new Date().toISOString();
    const signature = createHash('sha256')
      .update(`${this.sequenceCounter}:${timestamp}:${entry.table}:${entry.recordId}:${entry.actor}`)
      .digest('hex');

    const record: PostCutoverAuditRecord = {
      mode: 'simulation',
      sequence: this.sequenceCounter,
      timestamp,
      table: entry.table,
      operation: entry.operation,
      recordId: entry.recordId,
      payload: entry.payload,
      actor: entry.actor,
      signature,
    };

    this.postCutoverLedger.push(record);
    return record;
  }

  public getPostCutoverLedger(): readonly PostCutoverAuditRecord[] {
    return [...this.postCutoverLedger];
  }

  public reset(): void {
    this.currentStage = 'PRE_CUTOVER_STANDBY';
    this.writePauseLock = null;
    this.postCutoverLedger = [];
    this.sequenceCounter = 0;
    this.activePointerRevision = 1;
    this.previousPointerRevision = 1;
  }
}

export const cutoverOrchestrator = new CutoverOrchestrator();

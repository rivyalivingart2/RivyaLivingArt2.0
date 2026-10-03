import 'server-only';
import {studioDb} from './studio-db';
export {eraseOrderData,replayErasureLedger,ErasureConflict} from './erasure-execution';

export type ErasureReason = 'customer_request' | 'retention_expiry' | 'administrative_order';

export interface ErasureResult {
  success: boolean;
  orderId: string;
  reference: string;
  referencesDeleted: number;
  notesPurged: number;
  erasedAt: string;
}

export interface ErasureLedgerEntry {
  id: string;
  orderId: string;
  reference: string;
  requestedAt: string | null;
  identityVerifiedAt: string | null;
  erasedAt: string;
  erasedBy: string;
  reason: ErasureReason;
  referencesDeleted: number;
  notesPurged: number;
  details: Record<string, unknown>;
}

export interface ManagedExportEntry {
  id: string;
  actor: string;
  rowCount: number;
  criteria: Record<string, unknown>;
  createdAt: string;
  expiresAt: string;
  invalidatedAt: string | null;
  invalidationReason: string | null;
  isExpired: boolean;
  daysRemaining: number;
}

/**
 * Returns erasure ledger history.
 */
export async function getErasureLedger(orderId?: string): Promise<ErasureLedgerEntry[]> {
  const sql = studioDb();
  const rows = await sql`
    SELECT id, order_id AS "orderId", reference, requested_at AS "requestedAt",
           identity_verified_at AS "identityVerifiedAt", erased_at AS "erasedAt",
           erased_by AS "erasedBy", reason, references_deleted AS "referencesDeleted",
           notes_purged AS "notesPurged", details
    FROM rivya_erasure_ledger
    WHERE (${orderId || null}::uuid IS NULL OR order_id = ${orderId || null}::uuid)
    ORDER BY erased_at DESC LIMIT 100
  `;
  return rows as ErasureLedgerEntry[];
}

/**
 * Records a managed CSV export with a mandatory 7-day expiry deadline (CR-04/18).
 */
export async function recordManagedExport(
  actor: string,
  rowCount: number,
  criteria: Record<string, unknown>
): Promise<string> {
  const sql = studioDb();
  const rows = await sql`
    INSERT INTO rivya_managed_exports (actor, row_count, criteria)
    VALUES (${actor}, ${rowCount}, ${JSON.stringify(criteria)}::jsonb)
    RETURNING id
  `;
  return String(rows[0].id);
}

/**
 * Returns active and expired managed export records with expiration countdown.
 */
export async function getManagedExports(): Promise<ManagedExportEntry[]> {
  const sql = studioDb();
  const rows = await sql`
    SELECT id, actor, row_count AS "rowCount", criteria, created_at AS "createdAt",
           expires_at AS "expiresAt", invalidated_at AS "invalidatedAt",
           invalidation_reason AS "invalidationReason",
           expires_at <= now() AS "isExpired",
           GREATEST(0, EXTRACT(epoch FROM (expires_at - now())) / 86400)::numeric(5,1) AS "daysRemaining"
    FROM rivya_managed_exports
    ORDER BY created_at DESC LIMIT 50
  `;
  return rows.map(r => ({
    id: String(r.id),
    actor: String(r.actor),
    rowCount: Number(r.rowCount),
    criteria: (r.criteria || {}) as Record<string, unknown>,
    createdAt: new Date(r.createdAt).toISOString(),
    expiresAt: new Date(r.expiresAt).toISOString(),
    invalidatedAt: r.invalidatedAt ? new Date(r.invalidatedAt).toISOString() : null,
    invalidationReason: r.invalidationReason ? String(r.invalidationReason) : null,
    isExpired: Boolean(r.isExpired),
    daysRemaining: Number(r.daysRemaining)
  }));
}

/**
 * Purges metadata for expired managed customer exports older than 7 days.
 */
export async function purgeExpiredExports(actor: string): Promise<number> {
  const sql = studioDb();
  const rows = await sql`
    DELETE FROM rivya_managed_exports
    WHERE expires_at <= now()
    RETURNING id
  `;
  if (rows.length > 0) {
    await sql`INSERT INTO rivya_audit(actor, action, entity)
              VALUES (${actor}, 'exports:purged_expired', ${JSON.stringify({ purgedCount: rows.length })})`;
  }
  return rows.length;
}

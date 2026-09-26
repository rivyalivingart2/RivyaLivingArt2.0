import 'server-only';
import {studioDb} from './studio-db';
import {deleteReference, type ReferenceProvider} from './reference-storage';
import {retentionDecision, type RetentionRecord} from './retention-policy';

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
 * Executes compliant personal-data erasure / anonymization (CR-04/18).
 * Scopes: rivya_inquiries, rivya_studio_orders, rivya_inquiry_notes, rivya_references,
 * Vercel Blob private storage, and marks rivya_privacy_controls while recording in rivya_erasure_ledger.
 */
export async function eraseOrderData(
  orderId: string,
  actor: string,
  reason: ErasureReason = 'customer_request',
  customDetails: Record<string, unknown> = {}
): Promise<ErasureResult> {
  const sql = studioDb();

  // 1. Fetch current controls and inquiry status
  const [ctrlRows, inqRows] = await Promise.all([
    sql`SELECT order_id AS id, last_contact_at AS "lastContactAt", became_order AS "becameOrder", closed_at AS "closedAt",
               ongoing_follow_up AS "ongoingFollowUp", hold_reason AS "holdReason", hold_review_on AS "holdReviewOn",
               deletion_requested_at AS "deletionRequestedAt", identity_verified_at AS "identityVerifiedAt",
               erased_at AS "erasedAt", version
        FROM rivya_privacy_controls WHERE order_id = ${orderId}::uuid`,
    sql`SELECT id, reference, name, phone, email, request_kind, product_id, product_snapshot, contract_version
        FROM rivya_inquiries WHERE id = ${orderId}::uuid`
  ]);

  const control = ctrlRows[0];
  if (!control) throw new Error('Retention controls not found for order ' + orderId);

  // Check if already erased
  if (control.erasedAt) {
    const existing = await sql`SELECT reference, erased_at FROM rivya_erasure_ledger WHERE order_id = ${orderId}::uuid ORDER BY erased_at DESC LIMIT 1`;
    return {
      success: true,
      orderId,
      reference: existing[0]?.reference || 'UNKNOWN',
      referencesDeleted: 0,
      notesPurged: 0,
      erasedAt: String(control.erasedAt)
    };
  }

  // 2. Validate hold policy
  if (control.holdReason && String(control.holdReason).trim() !== '') {
    throw new Error('Erasure blocked: A documented retention hold exists (' + control.holdReason + '). Release hold before erasing.');
  }

  // 3. Validate authority / policy eligibility
  const decision = retentionDecision(control as RetentionRecord);
  if (reason === 'retention_expiry' && !decision.canEraseInquiry) {
    throw new Error('Erasure blocked: Record has not reached its scheduled retention expiry boundary.');
  }

  if (reason === 'customer_request' && !control.identityVerifiedAt) {
    throw new Error('Erasure blocked: Identity verification has not been completed for this deletion request.');
  }

  const reference = inqRows[0]?.reference || ('RLA-' + orderId.replace(/-/g, '').slice(0, 12).toUpperCase());

  // 4. Clean up any uploaded private references from storage provider
  const references = await sql`SELECT id, pathname, storage_provider FROM rivya_references WHERE inquiry_id = ${orderId}::uuid`;
  let referencesDeleted = 0;

  for (const ref of references) {
    try {
      if (ref.pathname && ref.storage_provider) {
        await deleteReference(ref.pathname, ref.storage_provider as ReferenceProvider);
      }
      referencesDeleted++;
    } catch {
      // Storage deletion retryable; proceed with DB transaction
    }
  }

  // 5. Execute transactional database anonymization & ledger recording
  const now = new Date();
  const erasedAtStr = now.toISOString();

  await sql.transaction([
    // Delete reference database records
    sql`DELETE FROM rivya_references WHERE inquiry_id = ${orderId}::uuid`,

    // Purge inquiry internal notes
    sql`DELETE FROM rivya_inquiry_notes WHERE inquiry_id = ${orderId}::uuid`,

    // Anonymize inquiry personal brief details while preserving contract schema invariants
    sql`UPDATE rivya_inquiries SET
          name = '[ERASED]',
          phone = '+000000000000',
          email = 'erased@anonymized.invalid',
          notes = '',
          summary = '[Customer brief and contact details permanently erased per compliance policy]',
          answer_snapshot = '[]'::jsonb,
          product_snapshot = CASE WHEN product_snapshot IS NOT NULL
            THEN jsonb_build_object('id', product_snapshot->>'id', 'name', product_snapshot->>'name', 'tier', product_snapshot->>'tier')
            ELSE NULL END,
          reference_count = 0,
          guest_hash = '0000000000000000000000000000000000000000000000000000000000000000'
        WHERE id = ${orderId}::uuid`,

    // Sanitize studio orders client & title
    sql`UPDATE rivya_studio_orders SET
          client = '[ERASED]',
          title = 'Artisan Piece (Erased)',
          status = 'CLOSED',
          updated_at = now()
        WHERE id = ${orderId}::uuid`,

    // Mark privacy controls with erasure timestamp
    sql`UPDATE rivya_privacy_controls SET
          erased_at = now(),
          hold_reason = '',
          hold_review_on = NULL,
          ongoing_follow_up = false,
          version = version + 1,
          updated_by = ${actor},
          updated_at = now()
        WHERE order_id = ${orderId}::uuid`,

    // Record into minimal compliance erasure ledger
    sql`INSERT INTO rivya_erasure_ledger (
          order_id, reference, requested_at, identity_verified_at, erased_at,
          erased_by, reason, references_deleted, notes_purged, details
        ) VALUES (
          ${orderId}::uuid, ${reference}, ${control.deletionRequestedAt}::timestamptz,
          ${control.identityVerifiedAt}::timestamptz, now(), ${actor}, ${reason},
          ${referencesDeleted}, (SELECT count(*)::integer FROM rivya_inquiry_notes WHERE inquiry_id = ${orderId}::uuid),
          ${JSON.stringify({ ...customDetails, previousStatus: inqRows[0]?.request_kind })}::jsonb
        )`,

    // Invalidate active managed exports that may have included this order
    sql`UPDATE rivya_managed_exports SET
          invalidated_at = now(),
          invalidation_reason = ${'Contains erased order ' + reference}
        WHERE invalidated_at IS NULL AND expires_at > now()`,

    // Log immutable audit entry
    sql`INSERT INTO rivya_audit(actor, action, entity)
        VALUES (${actor}, 'privacy:erasure_completed', ${orderId + ':' + reference})`
  ]);

  return {
    success: true,
    orderId,
    reference,
    referencesDeleted,
    notesPurged: 0,
    erasedAt: erasedAtStr
  };
}

/**
 * Replays erasure ledger against restored database backups (CR-04/18 Restore Replay).
 */
export async function replayErasureLedger(actor: string): Promise<{ replayedCount: number }> {
  const sql = studioDb();
  const ledger = await sql`SELECT order_id, reference, erased_at FROM rivya_erasure_ledger ORDER BY erased_at ASC`;
  let replayedCount = 0;

  for (const entry of ledger) {
    const unErased = await sql`SELECT id FROM rivya_inquiries WHERE id = ${entry.order_id}::uuid AND name != '[ERASED]'`;
    if (unErased.length) {
      await sql.transaction([
        sql`UPDATE rivya_inquiries SET
              name = '[ERASED]',
              phone = '+000000000000',
              email = 'erased@anonymized.invalid',
              notes = '',
              summary = '[Customer brief and contact details permanently erased per compliance policy]',
              answer_snapshot = '[]'::jsonb,
              reference_count = 0,
              guest_hash = '0000000000000000000000000000000000000000000000000000000000000000'
            WHERE id = ${entry.order_id}::uuid`,
        sql`UPDATE rivya_studio_orders SET client = '[ERASED]', title = 'Artisan Piece (Erased)', status = 'CLOSED', updated_at = now() WHERE id = ${entry.order_id}::uuid`,
        sql`UPDATE rivya_privacy_controls SET erased_at = COALESCE(erased_at, now()), updated_by = ${actor}, updated_at = now() WHERE order_id = ${entry.order_id}::uuid`
      ]);
      replayedCount++;
    }
  }

  if (replayedCount > 0) {
    await sql`INSERT INTO rivya_audit(actor, action, entity) VALUES (${actor}, 'privacy:restore_replay', ${JSON.stringify({ replayedCount })})`;
  }

  return { replayedCount };
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

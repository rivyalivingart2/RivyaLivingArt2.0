import 'server-only';
import {studioDb} from './studio-db';
/** Off until isolated migration/backup checks are recorded. These are not public build flags. */
export const intakeEnabled=()=>process.env.RIVYA_ORDER_INTAKE_ENABLED==='true';
export const messageRetryEnabled=()=>process.env.RIVYA_ORDER_MESSAGE_RETRY_ENABLED==='true';
export async function requireOrderWrites(mode:'intake'|'message'='intake'){
 if(!(mode==='intake'?intakeEnabled():messageRetryEnabled()))throw Error('Order service is in maintenance');
 const sql=studioDb();
 const rows=await sql`SELECT
  (SELECT count(*) FROM information_schema.columns WHERE table_schema='public' AND table_name='rivya_inquiries'
   AND column_name=ANY(ARRAY['contract_version','schema_snapshot','answer_snapshot','message_state','message_destination','consent_version','message_attempts'])) AS columns,
  (SELECT count(*) FROM pg_constraint WHERE conrelid='public.rivya_inquiries'::regclass
   AND conname=ANY(ARRAY['rivya_inquiries_contract_version','rivya_inquiries_request_kind','rivya_inquiries_contract_v2','rivya_inquiries_message_state'])) AS constraints,
  (SELECT count(*) FROM information_schema.columns WHERE table_schema='public' AND table_name='rivya_references'
   AND column_name=ANY(ARRAY['normalized_mime','linked_at','upload_sha256','write_token','write_expires_at'])) AS reference_columns`;
 if(Number(rows[0]?.columns)!==7||Number(rows[0]?.constraints)!==4||Number(rows[0]?.reference_columns)!==5)throw Error('Order schema is not ready');
}

import 'server-only';
import {studioDb} from './studio-db';
import {publishedBusiness} from './business-settings';
import {intakeEnabled,messageRetryEnabled} from './order-service';
import {isProductionWebsite} from './public-website';

/** Administrator-only aggregate inspection; never returns records or credentials. */
export async function serviceStatus(){
 const [business,rows]=await Promise.all([
  publishedBusiness(),
  studioDb()`SELECT
   (SELECT count(*)::integer FROM rivya_inquiries WHERE contract_version=2 AND message_state='handoff_pending' AND created_at<now()-interval '10 minutes') AS pending,
   (SELECT count(*)::integer FROM rivya_inquiries WHERE contract_version=2 AND message_state='handoff_failed') AS failed,
   (SELECT count(*)::integer FROM rivya_references WHERE inquiry_id IS NULL AND created_at<now()-interval '24 hours') AS expired,
   (SELECT count(*)::integer FROM rivya_references WHERE state='deleting') AS deleting,
   (SELECT bool_and(COALESCE(has_table_privilege(current_user,to_regclass('public.'||name),privilege),false))
    FROM (VALUES ('rivya_erasure_ledger','SELECT'),('rivya_erasure_ledger','INSERT'),('rivya_erasure_ledger','UPDATE'),
      ('rivya_managed_exports','SELECT'),('rivya_managed_exports','INSERT'),('rivya_managed_exports','UPDATE'),('rivya_managed_exports','DELETE'),
      ('rivya_inquiry_notes','DELETE')) AS required(name,privilege))
    AND (SELECT bool_and(COALESCE(has_column_privilege(current_user,to_regclass('public.'||name),
      (SELECT attnum FROM pg_attribute WHERE attrelid=to_regclass('public.'||name) AND attname=column_name AND NOT attisdropped),privilege),false))
      FROM (VALUES ('rivya_studio_order_events','reason','UPDATE'),('rivya_audit','entity','UPDATE'),
        ('rivya_privacy_controls','erased_at','SELECT'),('rivya_privacy_controls','erased_at','UPDATE'),
        ('rivya_managed_exports','invalidated_at','UPDATE'),('rivya_managed_exports','invalidation_reason','UPDATE')) AS required(name,column_name,privilege)) AS privacy_ready`
 ]);
 const token=process.env.BLOB_READ_WRITE_TOKEN;
 return {
  services:{
   'Database':'Read succeeded',
   'Privacy release prerequisites':rows[0].privacy_ready===true?'Required added schema and permissions verified for this runtime':'Operator review required — added schema or permissions are missing',
   'Business contact details':business.version>0?'Published':'Not published — approved defaults displayed',
   'Private reference storage':token&&token!=='[SENSITIVE]'?'Credential configured — storage access not checked':'Not configured',
   'New order requests':intakeEnabled()?'Enabled — release requirements still apply':'Paused',
   'Saved order message preparation':messageRetryEnabled()?'Enabled — release requirements still apply':'Paused',
   'Search indexing':process.env.SITE_INDEXABLE==='true'&&isProductionWebsite(process.env)?'Enabled':'Disabled',
   'Data environment':process.env.RIVYA_DATA_MODE==='shared'?'Shared live data — no test submissions':process.env.RIVYA_DATA_MODE==='isolated'?'Declared isolated — verify destination before testing':'Not declared',
  },
  attention:{'Messages pending for over 10 minutes':Number(rows[0].pending),'Failed message preparations':Number(rows[0].failed),'Unsubmitted references older than 24 hours':Number(rows[0].expired),'Reference deletions awaiting completion':Number(rows[0].deleting)},
 };
}

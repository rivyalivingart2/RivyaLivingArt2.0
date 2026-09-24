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
   (SELECT count(*)::integer FROM rivya_references WHERE state='deleting') AS deleting`
 ]);
 const token=process.env.BLOB_READ_WRITE_TOKEN;
 return {
  services:{
   'Database':'Read succeeded',
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

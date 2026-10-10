import {baselineContent} from './content-model';
import {isCustomPageId} from './custom-page-identity';
import {isEditorialId} from './editorial-record-model';
/** Matches the content contract; paths and unknown page ids are never preview records. */
export function supportedSavedPreview(record:unknown):record is string{
 return typeof record==='string'&&(baselineContent.some(d=>d.id===record)||isCustomPageId(record)||isEditorialId(record)||/^article:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(record));
}

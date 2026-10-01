import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
import {validContent} from './content-model';
import {sharedCopyId,sharedCopyCandidate,sharedCopyValues} from './shared-copy-model';
import type {Locale} from './site-settings-model';
export const publishedCopy=cache(async(locale:Locale='en')=>{
 try{const rows=await studioDb()`SELECT published,published_version FROM rivya_content WHERE content_key=${sharedCopyId} AND visible=true AND published IS NOT NULL`;const row=rows[0];if(row&&validContent(row.published,sharedCopyCandidate))return {values:sharedCopyValues(row.published,locale),version:Number(row.published_version)};}catch{/* Shared labels retain reviewed defaults during an outage. */}
 return {values:sharedCopyValues(undefined,locale),version:0};
});

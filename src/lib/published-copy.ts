import 'server-only';
import {cache} from 'react';
import {publishedShellSource} from './published-shell-source';
import {validContent} from './content-model';
import {sharedCopyCandidate,sharedCopyValues} from './shared-copy-model';
import type {Locale} from './site-settings-model';
export const publishedCopy=cache(async(locale:Locale='en')=>{
 try{const {copy:row}=await publishedShellSource();if(row&&validContent(row.published,sharedCopyCandidate))return {values:sharedCopyValues(row.published,locale),version:Number(row.published_version)};}catch{/* Shared labels retain reviewed defaults during an outage. */}
 return {values:sharedCopyValues(undefined,locale),version:0};
});

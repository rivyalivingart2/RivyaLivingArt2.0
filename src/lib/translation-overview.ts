import type {ContentDocument} from './content-model';
import {translationStatus} from './translation-review';

type Review = ReturnType<typeof translationStatus>;
export type TranslationOverviewEntry = {
 id:string; title:string; route:string; version:number;
 reviews:Record<'hi'|'gu',{draft:Review;published:Review['state']|null}>;
};
type ReviewSource = {document:ContentDocument;published:ContentDocument|null;visible:boolean;version:number};

/** Read-only projection. Editors still load complete records before any save.
 * Keep the canonical review calculation: captured snapshots and translated text
 * are never sent to an overview that only displays coverage and destinations. */
export function translationOverviewEntry(entry:ReviewSource):TranslationOverviewEntry {
 const review=(locale:'hi'|'gu')=>({
  draft:translationStatus(entry.document,locale),
  published:entry.visible&&entry.published?translationStatus(entry.published,locale).state:null,
 });
 return {id:entry.document.id,title:entry.document.title,route:entry.document.route,version:entry.version,reviews:{hi:review('hi'),gu:review('gu')}};
}

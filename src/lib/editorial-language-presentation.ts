import type {LandingEntry} from './landing-dependencies';
import {applyReviewedTranslation,translationStatus} from './translation-review';
import type {ContentDocument} from './content-model';
import type {HomeArticle,HomeSnapshot} from './homepage-model';
import type {PageSnapshot} from './page-dependencies';

/** Capture only reviewed public card labels with the dependency revision. */
export function reviewedArticleLabels(document:ContentDocument):HomeArticle['localizedCopy']{
 const copy:NonNullable<HomeArticle['localizedCopy']>={};
 for(const locale of ['hi','gu'] as const){
  if(translationStatus(document,locale).state!=='reviewed')continue;
  const d=applyReviewedTranslation(document,locale);
  copy[locale]={title:d.title,eyebrow:d.eyebrow,description:d.description,imageAlt:d.headerImage?.alt||d.imageAlt};
 }
 return Object.keys(copy).length?copy:undefined;
}
/** Old snapshots retain English labels. Never pull new dependencies into an exact saved preview. */
export function localizeSnapshot<T extends HomeSnapshot>(snapshot:T,locale:string):T{
 if(locale!=='hi'&&locale!=='gu')return snapshot;
 const page=snapshot as PageSnapshot;
 const entry=(e:LandingEntry)=>({...e,...e.localizedCopy?.[locale]});
 return {...snapshot,articles:snapshot.articles.map(a=>({...a,...a.localizedCopy?.[locale]})),
  ...(page.faqEntries?{faqEntries:page.faqEntries.map(entry)}:{}),
  ...(page.discovery?{discovery:page.discovery.map(entry)}:{}),
  ...(page.landing?{landing:{...page.landing,entries:Object.fromEntries(Object.entries(page.landing.entries).map(([id,entries])=>[id,entries.map(entry)]))}}:{})};
}
export function savedEditorialImage(document:ContentDocument,snapshot:PageSnapshot){
 const image=snapshot.image;
 return {image:image?.path,imageAlt:image?(document.imageAlt||image.alt):undefined,imagePosition:image?.position};
}

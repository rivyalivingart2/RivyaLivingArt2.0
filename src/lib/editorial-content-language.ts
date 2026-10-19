import {localizeContent,type ContentDocument} from './content-model';
import type {HomeArticle} from './homepage-model';
import type {Locale} from './site-settings-model';

export type LocalizedEditorialDocument=ContentDocument&{contentLanguage:Locale};

/** Resolve from the original revision, before localization changes its review fingerprint. */
export function localizeEditorialContent(original:ContentDocument,locale:Locale):LocalizedEditorialDocument{
 const localized=localizeContent(original,locale);
 return {...localized,contentLanguage:localized===original?'en':locale};
}

/** Snapshot cards only translate when the captured revision includes reviewed labels. */
export function capturedEditorialLanguage(article:Pick<HomeArticle,'localizedCopy'>,locale:Locale):Locale{
 return (locale==='hi'||locale==='gu')&&article.localizedCopy?.[locale]?locale:'en';
}

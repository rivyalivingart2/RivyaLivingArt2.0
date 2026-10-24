import {usageAvailable} from '@/lib/homepage-model';
import Link from 'next/link';
import type {LandingEntry} from '@/lib/landing-dependencies';
import {editorialDisclosure} from '@/lib/editorial-record-model';
import {EditorialImage} from './editorial-image';
import s from './migration-public.module.css';
import shared from './shop.module.css';
export function EditorialEntryCard({entry,mediaPaths}:{entry:LandingEntry;mediaPaths?:string[]}){
 return <article data-lighting-card="editorial" data-public-part="entry" className={s.entry}>{entry.editorial&&<p data-public-part="disclosure" className={s.disclosure}>{editorialDisclosure(entry.editorial)}</p>}{entry.image&&(!mediaPaths||usageAvailable(entry.image,mediaPaths))&&<EditorialImage usage={entry.image}/>}<div><h3><Link href={entry.route}>{entry.title}</Link></h3><p>{entry.description}</p>{entry.editorial?.rating!==undefined&&<p aria-label={'Rated '+entry.editorial.rating+' out of 5'}>{entry.editorial.rating} / 5</p>}{entry.editorial?.avatar&&(!mediaPaths||usageAvailable(entry.editorial.avatar,mediaPaths))&&<EditorialImage usage={entry.editorial.avatar}/>} {entry.editorial?.attribution&&<p>{entry.editorial.attribution}</p>}<Link href={entry.route} className={shared.textLink}>Read {entry.editorial?.kind==='testimonial'?'the statement':'the story'}</Link></div></article>;
}

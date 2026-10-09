import Link from 'next/link';
import type {LandingEntry} from '@/lib/landing-dependencies';
import {editorialDisclosure} from '@/lib/editorial-record-model';
import {EditorialImage} from './editorial-image';
import s from './migration-public.module.css';
import shared from './shop.module.css';
export function EditorialEntryCard({entry,mediaPaths}:{entry:LandingEntry;mediaPaths?:string[]}){
 return <article className={s.entry}>{entry.editorial&&<p className={s.disclosure}>{editorialDisclosure(entry.editorial)}</p>}{entry.image&&(!mediaPaths||mediaPaths.includes(entry.image.path))&&<EditorialImage usage={entry.image}/>}<div><h3><Link href={entry.route}>{entry.title}</Link></h3><p>{entry.description}</p>{entry.editorial?.attribution&&<p>{entry.editorial.attribution}</p>}<Link href={entry.route} className={shared.textLink}>Read {entry.editorial?.kind==='testimonial'?'the statement':'the story'}</Link></div></article>;
}

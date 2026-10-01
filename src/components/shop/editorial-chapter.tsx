import type {ContentSection} from '@/lib/content-model';
import {SectionBody} from './section-body';
import {EditorialImage} from './editorial-image';
import p from './detailed-pages.module.css';
import s from './shop.module.css';
export function EditorialChapter({section:b,unavailable,mediaPaths}:{section:ContentSection;unavailable?:string[];mediaPaths?:string[]}){
 return <section id={b.id} className={p.chapter} data-layout={b.image?b.layout:b.layout==='statement'?'statement':undefined} aria-labelledby={b.id+'-heading'}>{b.image&&<EditorialImage usage={b.image} available={mediaPaths?.includes(b.image.path)}/>}<div>{b.stage&&<p className={s.eyebrow}>{b.stage==='customer'?'Your request and agreement':'Making: questions for your specification'}</p>}<h2 id={b.id+'-heading'}>{b.heading}</h2><SectionBody section={{...b,image:undefined}} unavailable={unavailable} mediaPaths={mediaPaths}/></div></section>;
}

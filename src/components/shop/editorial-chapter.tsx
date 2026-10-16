import {JourneyText} from './journey-language';
import type {ContentSection} from '@/lib/content-model';
import {SectionBody} from './section-body';
import {EditorialImage} from './editorial-image';
import {ChapterMedia} from './chapter-media';
import p from './detailed-pages.module.css';
import s from './shop.module.css';
import e from './editorial-reading.module.css';
export function EditorialChapter({section:b,unavailable,mediaPaths}:{section:ContentSection;unavailable?:string[];mediaPaths?:string[]}){
 const immersive=!!b.image&&!b.material&&!b.checklist?.length&&['statement','split','reverse'].includes(b.layout||'split');
 return <section id={b.id} data-public-part="chapter" className={p.chapter+' '+e.chapter} data-stage={b.stage} data-layout={b.image?b.layout:b.layout==='statement'?'statement':undefined} data-immersive={immersive} data-atmosphere={immersive?'media':b.material||b.checklist?.length?'reading':'story'} aria-labelledby={b.id+'-heading'}>{b.image&&(immersive?<ChapterMedia usage={b.image} available={mediaPaths?.includes(b.image.path)}/>:<EditorialImage usage={b.image} available={mediaPaths?.includes(b.image.path)}/>)}<div data-public-part="chapter-copy">{b.stage&&<p className={s.eyebrow}><JourneyText text={b.stage==='customer'?'Your request and agreement':'Making: questions for your specification'}/></p>}<h2 id={b.id+'-heading'} data-reveal>{b.heading}</h2><SectionBody section={{...b,image:undefined}} unavailable={unavailable} mediaPaths={mediaPaths}/></div></section>;
}

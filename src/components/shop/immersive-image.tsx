import type {EditorialUsage} from '@/lib/homepage-model';
import {JourneyText} from './journey-language';
import {EditorialImage} from './editorial-image';
import s from './immersive-image.module.css';

/** Saved focal points stay with the media; captions never move beneath an overlay. */
export function ImmersiveImage({usage,available=true}:{usage:EditorialUsage;available?:boolean}) {
 return <div className={s.media} data-home-parallax>
  <div className={s.layer} data-home-parallax-layer><EditorialImage usage={{...usage,caption:''}} available={available} sizes="100vw"/></div>
  <div className={s.overlay} aria-hidden="true"/>
  {usage.caption&&<p className={s.credit}><JourneyText text={usage.caption}/></p>}
 </div>;
}

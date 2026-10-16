import type {EditorialUsage} from '@/lib/homepage-model';
import {EditorialImage} from './editorial-image';
import Image from './public-image';
import {JourneyText} from './journey-language';
import r from './reference-pages.module.css';

/** Full-bleed editorial media keeps its saved crop and a stationary, complete caption. */
export function ChapterMedia({usage,available=true,priority=false}:{usage:EditorialUsage;available?:boolean;priority?:boolean}){
 return <><div className={r.fullBleed} data-cinematic-parallax>
  <div className={r.mediaLayer} data-cinematic-parallax-layer><EditorialImage usage={{...usage,caption:''}} available={available} priority={priority} sizes="100vw"/></div>
  <div className={r.mediaShade} aria-hidden="true"/>
 </div>{usage.caption&&<p className={r.mediaCredit} data-public-part="media-credit">{usage.caption}</p>}</>;
}

/** Legacy published images retain their original source, alt text and focal position. */
export function LegacyChapterMedia({src,alt,position,priority=false}:{src:string;alt:string;position?:string;priority?:boolean}){
 return <><div className={r.fullBleed} data-cinematic-parallax>
  <div className={r.mediaLayer} data-cinematic-parallax-layer><Image src={src} alt={alt} style={{objectFit:'cover',objectPosition:position}} fill quality={priority?60:75} preload={priority} loading={priority?undefined:'lazy'} sizes="100vw"/></div>
  <div className={r.mediaShade} aria-hidden="true"/>
 </div><p className={r.mediaCredit} data-public-part="media-credit"><JourneyText text="Design visualization"/></p></>;
}

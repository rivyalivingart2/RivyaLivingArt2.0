'use client';
import {useId} from 'react';
import type {PresentationFilm} from '@/lib/presentation-media';
import {CinematicVideo} from './cinematic-video';
import s from './material-film.module.css';

/** A self-contained cinematic chapter; its complete factual description stays visible. */
export function MaterialFilm({film}:{film:PresentationFilm}){
 const id=useId();
 return <figure id={'film-'+film.id+id} className={s.film} data-material-film={film.id} data-atmosphere="media" aria-labelledby={id}>
  <CinematicVideo film={film} describedBy={id+'-description'} controlClassName={s.filmControl} expandedPlayer/>
  <div className={s.intro}><p className={s.eyebrow}>Material visualization</p><h2 id={id}>{film.title}</h2><p>{film.description}</p></div>
  {/* The print-only source avoids an eager screen download and works before scrolling. */}
  <picture className={s.printStill}><source media="print" srcSet={film.poster.path}/>
   <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width={1920} height={1080} alt={film.description}/>
  </picture>
  <figcaption id={id+'-description'}>Silent, eight-second material visualization: a ribbon of deep blue resin with gold-toned streaks pours into a pool against a dark background. The sequence repeats. This is not a recording of a customer commission.</figcaption>
 </figure>;
}

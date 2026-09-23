import {ShopFrame} from './shop-frame';
import s from './shop.module.css';
export function ReadingLoading(){return <ShopFrame><section className={s.readingLoading} aria-busy="true"><span className={s.eyebrow}>RivyaLivingArt</span><h1>Opening this page.</h1><p role="status">Please wait while the published content loads.</p></section></ShopFrame>;}

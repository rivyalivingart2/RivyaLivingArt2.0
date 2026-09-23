import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
import type {ShopProduct} from './shop-model';

/** Every request reads the durable published version. Drafts never enter public props. */
export const publishedProducts=cache(async():Promise<ShopProduct[]>=>{
  // Missing storage is an unavailable service, never permission to publish fixtures.
  const rows=await studioDb()`SELECT published, published_version FROM rivya_catalogue WHERE visible=true AND published IS NOT NULL ORDER BY product_id`;
  const media=await studioDb()`SELECT path,published FROM rivya_public_media WHERE published IS NOT NULL`;
  const byPath=new Map(media.map(r=>[r.path,r.published]));
  return rows.map(r=>{
    const p={...r.published,revision:Number(r.published_version)} as ShopProduct,m=byPath.get(p.image);
    return {...p,...(m?{imageAlt:m.alt,imagePosition:m.focalX+'% '+m.focalY+'%'}:{}),
      imageCaption:m?.caption,sceneAlt:byPath.get(p.scene||'')?.alt,scenePosition:byPath.get(p.scene||'')?byPath.get(p.scene||'').focalX+'% '+byPath.get(p.scene||'').focalY+'%':undefined,sceneCaption:byPath.get(p.scene||'')?.caption,
      gallery:p.gallery?.map(g=>{const m=byPath.get(g.src);return m?{...g,alt:m.alt,caption:m.caption,position:m.focalX+'% '+m.focalY+'%'}:g;})};
  });
});

'use client';

import {useState,type CSSProperties} from 'react';

export type ImageVariant={src:string;width:number;format:'avif'|'webp';bytes?:number};
export type PictureAsset={id:string;alt:string;width:number;height:number;variants:ImageVariant[];desktop:[number,number];mobile:[number,number]};

export function ResponsivePicture({asset,sizes='100vw',priority=false,className=''}:{asset:PictureAsset;sizes?:string;priority?:boolean;className?:string}) {
  const [failed,setFailed]=useState(false);
  const webp=asset.variants.filter(v=>v.format==='webp'),avif=asset.variants.filter(v=>v.format==='avif');
  const fallback=webp.at(-1)??asset.variants.at(-1);
  const style={'--rv-focal-desktop':`${asset.desktop[0]}% ${asset.desktop[1]}%`,'--rv-focal-mobile':`${asset.mobile[0]}% ${asset.mobile[1]}%`} as CSSProperties;
  if(failed||!fallback)return <div className={`rv-image-fallback ${className}`} role="img" aria-label={asset.alt}>Image unavailable. {asset.alt}</div>;
  return <picture className={`rv-picture ${className}`} style={style}>
    {avif.length>0&&<source type="image/avif" srcSet={avif.map(v=>`${v.src} ${v.width}w`).join(', ')} sizes={sizes}/>}
    <img src={fallback.src} srcSet={webp.map(v=>`${v.src} ${v.width}w`).join(', ')} sizes={sizes} alt={asset.alt} width={asset.width} height={asset.height} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':undefined} decoding="async" onError={()=>setFailed(true)}/>
  </picture>;
}

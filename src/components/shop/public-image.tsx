'use client';
import NextImage,{type ImageProps} from 'next/image';
import {useState} from 'react';
import s from './shop.module.css';
type Props=ImageProps&{retry?:boolean};
function ImageAttempt({retry=false,...props}:Props){
 const [failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0);
 const missing=typeof props.src==='string'&&!props.src.trim();
 if(failed||missing)return <span className={s.imageUnavailable} aria-hidden={props.alt===''?true:undefined} style={props.fill?{position:'absolute',inset:0,minHeight:0,...(props.alt===''?{padding:0}:{})}:undefined}>{props.alt!==''&&<><span role="img" aria-label={props.alt+' — image unavailable'}>Image unavailable</span>{retry&&!missing&&<button type="button" onClick={()=>{setAttempt(v=>v+1);setFailed(false);}}>Retry image</button>}</>}</span>;
 return <NextImage {...props} key={attempt} onError={event=>{setFailed(true);props.onError?.(event);}}/>;
}
export default function PublicImage(props:Props){const source=typeof props.src==='string'?props.src:'default' in props.src?props.src.default.src:props.src.src;return <ImageAttempt key={source} {...props}/>;}

'use client';
import NextImage,{type ImageProps} from 'next/image';
import {useState} from 'react';
import s from './shop.module.css';
type Props=ImageProps&{retry?:boolean};
function ImageAttempt({retry=false,...props}:Props){
 const [failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0);
 if(failed)return <span className={s.imageUnavailable} style={props.fill?{position:'absolute',inset:0}:undefined}><span role="img" aria-label={props.alt+' — image unavailable'}>Image unavailable</span>{retry&&<button type="button" onClick={()=>{setAttempt(v=>v+1);setFailed(false);}}>Retry image</button>}</span>;
 return <NextImage {...props} key={attempt} onError={()=>setFailed(true)}/>;
}
export default function PublicImage(props:Props){return <ImageAttempt key={typeof props.src==='string'?props.src:props.src.toString()} {...props}/>;}

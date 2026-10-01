'use client';
import {useState,useSyncExternalStore} from 'react';
import {savedPiecesKey,parseSavedPieces,changeSavedPieces,storeSavedPieces} from '@/lib/saved-pieces';
import p from './detailed-pages.module.css';
const event='rivya-saved-pieces';
export function subscribe(listener:()=>void){window.addEventListener('storage',listener);window.addEventListener(event,listener);return()=>{window.removeEventListener('storage',listener);window.removeEventListener(event,listener);};}
export function snapshot(){try{return localStorage.getItem(savedPiecesKey)||'[]';}catch{return 'unavailable';}}
export const serverSnapshot=()=>null;
export function write(ids:string[]){try{if(!storeSavedPieces(localStorage,ids))return false;window.dispatchEvent(new Event(event));return true;}catch{return false;}}
export function SavePieceButton({id,name}:{id:string;name:string}){
 const raw=useSyncExternalStore(subscribe,snapshot,serverSnapshot),ids=parseSavedPieces(raw),selected=ids.includes(id),[message,setMessage]=useState('');
 return <div><button type="button" className={p.saveButton} aria-pressed={selected} aria-label={(selected?'Remove ':'Save ')+name+(selected?' from saved pieces':' to saved pieces')} onClick={()=>{if(!selected&&ids.length>=60){setMessage('Your list has 60 pieces. Remove one before adding another.');return;}setMessage(write(changeSavedPieces(ids,id))?(selected?'Removed from saved pieces.':'Saved on this browser.'):'This browser could not store your selection. Keep the piece’s page address instead.');}}>{selected?'Saved ✓':'Save piece'}</button>{message&&<p className={p.smallNotice} role="status">{message}</p>}</div>;
}

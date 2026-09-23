'use client';
import {useCallback,useEffect,useState} from 'react';
import {Dialog} from '@/components/shop/dialog';
import {studioFetch} from './workspace-api';
import s from './workspace.module.css';

export function ReferenceCleanup(){
 const [inventory,setInventory]=useState<{count:number;bytes:number}|null>(null);
 const [open,setOpen]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const load=useCallback(async()=>{try{setInventory(await studioFetch('/api/studio/cleanup'));}catch(e){setMessage(e instanceof Error?e.message:'Unable to count expired uploads.');}},[]);
 useEffect(()=>{void load();},[load]);
 async function remove(){setBusy(true);try{const result=await studioFetch('/api/studio/cleanup',{confirm:'delete-expired-unsubmitted'});setMessage(`${result.removed} expired uploads removed. ${result.failed} retained for retry.`);setOpen(false);await load();}catch(e){setMessage(e instanceof Error?e.message:'Cleanup did not finish. Please retry.');}finally{setBusy(false);}}
 return <section className={s.panel}><h2>Unsubmitted reference images</h2><p>Images left without a submitted inquiry expire after 24 hours. Saved inquiry references are excluded from this cleanup.</p><p>{inventory?`${inventory.count} expired uploads · ${(Number(inventory.bytes)/1048576).toFixed(1)} MB reserved`:'Loading expired upload count…'}</p><div className={s.actions}><button disabled={busy} onClick={()=>void load()}>Refresh count</button><button disabled={busy||!inventory?.count} onClick={()=>setOpen(true)}>Review cleanup</button></div><p role="status">{message}</p><Dialog open={open} title="Delete expired uploads?" onClose={()=>{if(!busy)setOpen(false);}}><p>This permanently removes up to 25 images that have no saved inquiry and are over 24 hours old. It frees their reserved storage. Images whose removal fails are retained for retry.</p><div className={s.actions}><button disabled={busy} onClick={()=>setOpen(false)}>Keep images</button><button disabled={busy} onClick={()=>void remove()}>{busy?'Removing…':'Delete expired uploads'}</button></div></Dialog></section>;
}

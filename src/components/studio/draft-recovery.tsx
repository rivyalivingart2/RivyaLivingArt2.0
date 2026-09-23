'use client';
import {useState} from 'react';
import s from './workspace.module.css';
export function DraftRecovery({value,busy,onReload}:{value:unknown;busy:boolean;onReload:()=>Promise<void>}) {
  const [show,setShow]=useState(false),[message,setMessage]=useState(''),[loading,setLoading]=useState(false);
  return <section className={s.panel} aria-label="Recover a draft conflict"><h3>Keep your work, then reload</h3>
    <p>If your session expires, renew sign-in in another tab and retry. If another device changed this record, preserve your edits below before loading its latest saved version. Reloading replaces the editor; it never publishes.</p>
    <div className={s.actions}><button type="button" disabled={busy||loading} onClick={()=>setShow(v=>!v)}>{show?'Hide local draft':'Show local draft for copying'}</button>
    <button type="button" disabled={busy||loading} onClick={async()=>{if(!window.confirm('Replace these editor contents with the latest saved version? Copy any edits you need first.'))return;setLoading(true);try{await onReload();setShow(false);setMessage('Latest saved version loaded.');}catch(e){setMessage(e instanceof Error?e.message:'Reload failed. Your editor is retained.');}finally{setLoading(false);}}}>Load latest saved version</button></div>
    {show&&<label>Local draft — select and copy<textarea readOnly rows={8} value={JSON.stringify(value,null,2)} onFocus={e=>e.target.select()}/></label>}<p role="status">{message}</p>
  </section>;
}

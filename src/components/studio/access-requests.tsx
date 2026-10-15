'use client';
import {useCallback,useEffect,useState} from 'react';
import {Dialog} from '@/components/shop/dialog';
import {studioFetch} from './workspace-api';
import s from './workspace.module.css';
type AccessRequest={id:string;kind:'access'|'recovery';login:string;name:string;contact:string;status:'pending'|'approved';version:number;createdAt:string;expiresAt:string|null};
export function AccessRequests({onReload}:{onReload:()=>Promise<void>}) {
  const [requests,setRequests]=useState<AccessRequest[]>([]),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false);
  const [message,setMessage]=useState(''),[selected,setSelected]=useState<AccessRequest|null>(null),[verified,setVerified]=useState(false);
  const [issued,setIssued]=useState<{url:string;expiresAt:string}|null>(null);
  const load=useCallback(async()=>{try{const data=await studioFetch('/api/studio/access-requests');setRequests(data.requests);return true;}catch(e){setMessage(e instanceof Error?e.message:'Requests could not load.');return false;}finally{setLoading(false);}},[]);
  useEffect(()=>{let current=true;studioFetch('/api/studio/access-requests').then(data=>{if(current)setRequests(data.requests);}).catch(e=>{if(current)setMessage(e instanceof Error?e.message:'Requests could not load.');}).finally(()=>{if(current)setLoading(false);});return()=>{current=false;};},[]);
  async function decide(operation:'approve'|'reject') {
    if (!selected||busy) return;
    setBusy(true);setMessage('');let saved=false;
    try {
      const result=await studioFetch('/api/studio/access-requests',{id:selected.id,version:selected.version,operation,verified});saved=true;
      if(result.token)setIssued({url:new URL('/studio/set-password#token='+result.token,window.location.origin).href,expiresAt:result.expiresAt});
      setSelected(null);setVerified(false);
      setMessage(operation==='approve'?'Link created. Share it only with the verified person through your trusted channel.':'Request rejected. Any link for it is invalid.');
      const refreshed=await load();await onReload();
      if(!refreshed)setMessage('Decision saved, but the queue did not refresh. Keep the issued link and refresh the list before another decision.');
    }catch(e){setMessage(saved?'Decision saved, but Studio did not refresh. Keep the issued link and reload before another decision.':e instanceof Error?e.message:'Decision could not be confirmed. Refresh before retrying.');}
    finally{setBusy(false);}
  }
  return <section data-studio-part="panel" className={s.panel} aria-labelledby="access-requests-title">
    <div className={s.heading}><div><h2 id="access-requests-title">Account & password requests</h2><p>Verify the person before granting access or resetting a password.</p></div><button disabled={busy||loading} onClick={()=>{setMessage('');void load();}}>{loading?'Loading requests...':'Refresh requests'}</button></div>
    <p className={s.help}>Contact details below are supplied by the requester, not verified. Use an established contact or verify in person. New accounts start as editors; the owner account stays managed in hosting settings.</p>
    <p role="status">{message}</p>
    {issued&&<div className={s.panel}><h3>One-time password link</h3><p>Expires {new Date(issued.expiresAt).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})} IST. This link is shown once. Creating another link invalidates the previous one. No message has been sent.</p><label>Private link<input readOnly type="text" value={issued.url} onFocus={e=>e.target.select()} autoComplete="off"/></label><div className={s.actions}><button onClick={async()=>{try{await navigator.clipboard.writeText(issued.url);setMessage('Private link copied. Share only with the verified person.');}catch{setMessage('Select the link above and copy it manually.');}}}>Copy private link</button><button onClick={()=>setIssued(null)}>Hide link</button></div></div>}
    {!loading&&!requests.length&&<p>No open requests. New requests and password recovery requests will appear here.</p>}
    {requests.map(r=><div className={s.member} data-studio-part="member" key={r.id}><div><strong>{r.name}</strong><p>{r.login}  /  {r.kind==='access'?'New account':'Password reset'}  /  {r.status==='approved'?'Link issued':'Awaiting review'}</p><p>Contact supplied: {r.contact}</p>{r.expiresAt&&<small>Link expires {new Date(r.expiresAt).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})} IST</small>}</div><button disabled={busy} onClick={()=>{setSelected(r);setVerified(false);setMessage('');}}>Review request</button></div>)}
    <p className={s.help}>Showing up to 100 open requests, oldest first. Review or reject these to bring later requests into view.</p>
    <Dialog open={!!selected} title="Review access request" onClose={()=>{if(!busy)setSelected(null);}}>
      {selected&&<><p>{selected.name}  /  {selected.login}</p><p>{selected.kind==='access'?'Approval reserves a disabled editor account. Access starts only when the verified person sets a password.':'A password reset does not change the account role or enable a disabled account. Existing sessions are revoked when the password is set.'}</p><p>Contact supplied: {selected.contact}</p><label className={s.check}><input type="checkbox" checked={verified} disabled={busy} onChange={e=>setVerified(e.target.checked)}/>I verified this person through an established contact or in person and approve this access request.</label><p role="status">{message}</p><div className={s.actions}><button disabled={busy} onClick={()=>setSelected(null)}>Cancel</button><button disabled={busy} onClick={()=>void decide('reject')}>Reject request</button><button className={s.primary} disabled={busy||!verified} onClick={()=>void decide('approve')}>{busy?'Saving...':selected.status==='approved'?'Replace one-time link':'Approve & create link'}</button></div></>}
    </Dialog>
  </section>;
}

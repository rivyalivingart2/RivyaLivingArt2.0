'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {journeyText} from '@/lib/journey-text';
import {localeLabels,type Locale} from '@/lib/site-settings-model';
import s from './shop.module.css';

export function LocaleSwitcher({locale,enabled}:{locale:Locale;enabled:Locale[]}){
 const router=useRouter(),[busy,setBusy]=useState(false),[error,setError]=useState('');
 if(enabled.length<2)return null;
 return <div className={s.localeSwitcher}><label>
  <span className={s.srOnly}>Language</span>
  <select aria-label="Language" value={locale} disabled={busy} onChange={async e=>{
   const next=e.target.value as Locale;setBusy(true);setError('');
   try{const r=await fetch('/api/locale',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({locale:next})});if(!r.ok)throw Error();router.refresh();}catch{setError(journeyText(locale,'Language could not be changed. Please retry.'));}finally{setBusy(false);}
  }}>
   {enabled.map(code=><option key={code} value={code}>{localeLabels[code]}</option>)}
  </select>
 </label>{error&&<p role="alert">{error}</p>}</div>;
}

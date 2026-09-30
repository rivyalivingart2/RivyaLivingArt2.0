'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {localeLabels,type Locale} from '@/lib/site-settings-model';
import s from './shop.module.css';

export function LocaleSwitcher({locale,enabled}:{locale:Locale;enabled:Locale[]}){
 const router=useRouter(),[busy,setBusy]=useState(false);
 if(enabled.length<2)return null;
 return <label className={s.localeSwitcher}>
  <span className={s.srOnly}>Language</span>
  <select aria-label="Language" value={locale} disabled={busy} onChange={async e=>{
   const next=e.target.value as Locale;setBusy(true);
   try{const r=await fetch('/api/locale',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({locale:next})});if(r.ok)router.refresh();}finally{setBusy(false);}
  }}>
   {enabled.map(code=><option key={code} value={code}>{localeLabels[code]}</option>)}
  </select>
 </label>;
}

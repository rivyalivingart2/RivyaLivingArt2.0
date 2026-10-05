'use client';
import Link from 'next/link';
import {useEffect,useMemo,useRef,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {studioFetch} from './workspace-api';
import {
 defaultNavigation,describeHrefProblem,localeLabels,locales,navigationReview,
 type Locale,type NavItem,type NavMenuKey,type SiteSettings
} from '@/lib/site-settings-model';
import s from './workspace.module.css';

const menuLabels:Record<NavMenuKey,{title:string;where:string}>={
 collections:{title:'Collections menu',where:'Desktop collection dropdown, mobile collection links and no-JS navigation'},
 header:{title:'Header pages',where:'Desktop header and mobile page links'},
 footerExplore:{title:'Footer · Explore',where:'First footer link column'},
 footerAtelier:{title:'Footer · Atelier',where:'Second footer link column'},
 footerLegal:{title:'Footer · Legal',where:'Small-print footer links'},
};
const menuKeys=Object.keys(menuLabels) as NavMenuKey[];

export function SiteSettingsEditor(){
 const [data,setData]=useState<{settings:SiteSettings;version:number}|null>(null);
 const params=useSearchParams();
 const requestedMenu=params.get('menu') as NavMenuKey;
 const focusedRecord=useRef('');
 const [menu,setMenu]=useState<NavMenuKey>(menuKeys.includes(requestedMenu)?requestedMenu:'header');
 useEffect(()=>{const record=params.get('record')||'';if(data&&record&&focusedRecord.current!==record){const field=document.getElementById('navigation-field-'+record+'-href');if(field){focusedRecord.current=record;field.focus();field.scrollIntoView({block:'center'});}}},[data,params]);
 const [locale,setLocale]=useState<Locale>('en');
 const [dirty,setDirty]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('Loading navigation…');

 async function load(){
  setBusy(true);
  try{const next=await studioFetch('/api/studio/site-settings');setData(next);setDirty(false);setMessage('Navigation and language settings loaded.');return true;}
  catch(e){setMessage((e instanceof Error?e.message:'Navigation could not be loaded.')+(data?' Previously loaded settings and any unsaved edits are retained; saved settings may be out of date.':' Use Reload to try again.'));return false;}
  finally{setBusy(false);}
 }
 useEffect(()=>{let active=true;void studioFetch('/api/studio/site-settings').then(next=>{if(active){setData(next);setMessage('Changes publish across the public site after review.');}}).catch(e=>{if(active)setMessage(e.message);});return()=>{active=false;};},[]);
 useEffect(()=>{const warn=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);

 const rows=useMemo(()=>data?.settings.navigation[menu]||[],[data,menu]);
 const enabled=data?.settings.localization.enabledLocales||['en'];
 const issues=useMemo(()=>rows.flatMap((item,index)=>{const href=describeHrefProblem(item.href);return href?[{index,message:href}]:[];}),[rows]);

 function patchSettings(next:SiteSettings){if(!data)return;setData({...data,settings:next});setDirty(true);}
 function patchRows(next:NavItem[]){if(!data)return;patchSettings({...data.settings,navigation:{...data.settings.navigation,[menu]:next}});}
 function patchItem(index:number,patch:Partial<NavItem>){patchRows(rows.map((row,i)=>i===index?{...row,...patch}:row));}
 function move(index:number,delta:number){const target=index+delta;if(target<0||target>=rows.length)return;const next=[...rows];[next[index],next[target]]=[next[target],next[index]];patchRows(next);}
 function add(){
  if(rows.length>=12)return;
  patchRows([...rows,{id:'custom-'+crypto.randomUUID().slice(0,12),label:{en:'New link'},href:'/contact',visible:true,newTab:false}]);
 }
 async function save(){
  if(!data||busy||issues.length)return;
  setBusy(true);setMessage('Publishing navigation and language settings…');
  try{
   const saved=await studioFetch('/api/studio/site-settings',data);
   setData({...data,version:saved.version});setDirty(false);const refreshed=await load();
   setMessage(refreshed?'Navigation and language settings published.':'Navigation was published, but saved settings could not refresh. Use Reload before making another change; do not publish again.');
  }catch(e){setMessage(e instanceof Error?e.message:'Settings were not saved.');}
  finally{setBusy(false);}
 }

 return <>
  <div className={s.heading}><div><h1>Navigation &amp; languages.</h1><p>Control public menu order, destinations and translated labels without changing application routes.</p></div><button disabled={busy||dirty} onClick={()=>void load()}>Reload</button></div>
  <p className={s.status} role="status">{message}</p>
  {!data?<p className={s.empty}>{busy||message==='Loading navigation…'?'Loading site settings…':'Saved settings are unavailable. Use Reload to try again.'}</p>:<fieldset disabled={busy} aria-label="Navigation and language settings editor">
   <section className={s.panel} data-unsaved={dirty}>
    <h2>Language availability</h2><p><Link href="/studio/translations">Review document translation coverage ↗</Link></p>
    <p className={s.help}>English is the authoritative fallback. Only English, Hindi and Gujarati are offered publicly. Other saved language settings are retained but held from the switcher. Missing or stale editorial translations use a visible English fallback.</p>
    <label className={s.check}><input type="checkbox" checked={data.settings.localization.enabled} onChange={e=>patchSettings({...data.settings,localization:{...data.settings.localization,enabled:e.target.checked}})}/>Show the public language switcher</label>
    <div className={s.grid}>
     {locales.map(code=><label className={s.check} key={code}><input type="checkbox" disabled={code==='en'} checked={enabled.includes(code)} onChange={e=>{
      const next=e.target.checked?[...enabled,code]:enabled.filter(v=>v!==code);
      patchSettings({...data.settings,localization:{...data.settings.localization,enabledLocales:locales.filter(v=>next.includes(v))}});
     }}/>{localeLabels[code]}{code==='en'?' · fallback':!['hi','gu'].includes(code)?' · held from public switcher':''}</label>)}
    </div>
   </section>

   <section className={s.panel} data-unsaved={dirty}>
    <div className={s.toolbar}>
     <label>Menu<select value={menu} onChange={e=>setMenu(e.target.value as NavMenuKey)}>{menuKeys.map(key=><option key={key} value={key}>{menuLabels[key].title}</option>)}</select></label>
     <label>Label language<select value={locale} onChange={e=>setLocale(e.target.value as Locale)}>{data.settings.localization.enabledLocales.map(code=><option key={code} value={code}>{localeLabels[code]}</option>)}</select></label>
     <span>{rows.length} {rows.length===1?'link':'links'}</span>
    </div>
    <h2>{menuLabels[menu].title}</h2><p className={s.help}>{menuLabels[menu].where}. Hidden links remain saved so they can be restored later.</p>

    <div className={s.list}>
     {rows.map((item,index)=>{
      const hrefIssue=describeHrefProblem(item.href);
      const translated=item.label[locale]||'';
      return <div className={s.panel} key={item.id}>
       <div className={s.grid}>
        <label>English label<input value={item.label.en} maxLength={60} onChange={e=>patchItem(index,{label:{...item.label,en:e.target.value}})}/></label>
        {locale!=='en'&&<label>{localeLabels[locale]} label<input dir={locale==='ar'?'rtl':'ltr'} value={translated} maxLength={60} placeholder={item.label.en+' · English fallback'} onChange={e=>patchItem(index,{label:{...item.label,[locale]:e.target.value}})}/><small>{item.reviewedLabels?.[locale]===navigationReview(item.label,locale)?'Reviewed against current English':'Unreviewed or stale — English fallback'}</small><button type="button" disabled={!translated.trim()} onClick={()=>patchItem(index,{reviewedLabels:{...item.reviewedLabels,[locale]:navigationReview(item.label,locale)}})}>Review this label</button></label>}
        <label className={s.wide}>Destination<input id={'navigation-field-'+item.id+'-href'} value={item.href} maxLength={500} aria-invalid={!!hrefIssue} onChange={e=>patchItem(index,{href:e.target.value})}/>{hrefIssue&&<small className={s.error}>{hrefIssue}</small>}</label>
       </div>
       <div className={s.actions}>
        <label className={s.check}><input type="checkbox" checked={item.visible} onChange={e=>patchItem(index,{visible:e.target.checked})}/>Visible</label>
        <label className={s.check}><input type="checkbox" checked={item.newTab} onChange={e=>patchItem(index,{newTab:e.target.checked})}/>Open in new tab</label>
        <button type="button" disabled={index===0} onClick={()=>move(index,-1)}>Move up</button>
        <button type="button" disabled={index===rows.length-1} onClick={()=>move(index,1)}>Move down</button>
        <button type="button" disabled={rows.length<=1} onClick={()=>{if(window.confirm('Remove this link from the menu?'))patchRows(rows.filter((_,i)=>i!==index));}}>Remove</button>
       </div>
      </div>;
     })}
    </div>
    <div className={s.actions}>
     <button type="button" disabled={rows.length>=12} onClick={add}>Add link</button>
     <button type="button" onClick={()=>{if(window.confirm('Restore this menu to the shipped links?'))patchRows(structuredClone(defaultNavigation[menu]));}}>Reset this menu</button>
    </div>
   </section>
   {issues.length>0&&<div className={s.panel} role="alert"><h2>Correct these links before publishing</h2><ul>{issues.map(issue=><li key={issue.index}>{rows[issue.index]?.label.en}: {issue.message}</li>)}</ul></div>}
   <div className={s.actions}><button className={s.primary} disabled={busy||!dirty||issues.length>0} onClick={()=>void save()}>Publish navigation &amp; languages</button><button disabled={busy} onClick={()=>{if(!dirty||window.confirm('Discard unsaved navigation changes?'))void load();}}>Discard &amp; reload</button></div>
  </fieldset>}
 </>;
}

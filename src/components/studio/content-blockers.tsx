'use client';
import {contentIssues,issueField} from '@/lib/content-issues';
import type {ContentDocument} from '@/lib/content-model';
import s from './workspace.module.css';
export function ContentBlockers({document:d,dirty,onRepair}:{document:ContentDocument;dirty:boolean;onRepair:(field:string)=>void}){
 const issues=[...contentIssues(d),...(!dirty?(d.homeSnapshot||d.pageSnapshot)?.issues.map(message=>({message,field:issueField(d,message)}))||[]:[])];
 if(!issues.length)return null;
 return <aside className={s.panel} aria-label="Publication blockers"><h3>Publication needs attention</h3><ul>{issues.map((issue,i)=><li key={i}><button type="button" className={s.repairLink} onClick={()=>{onRepair(issue.field);requestAnimationFrame(()=>requestAnimationFrame(()=>{const target=document.getElementById('content-field-'+issue.field);target?.focus();target?.scrollIntoView({block:'center'});}));}}>{issue.message}</button></li>)}</ul><p>Fix these fields and save a draft to recheck published references.</p></aside>;
}

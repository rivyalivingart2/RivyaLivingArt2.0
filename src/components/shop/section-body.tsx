import {JourneyText} from './journey-language';
import Link from 'next/link';
import type {ContentSection} from '@/lib/content-model';
import {safeEditorialHref,type TextRun} from '@/lib/editorial-body';
import {EditorialImage} from './editorial-image';
export function SectionBody({section,unavailable=[],mediaPaths}:{section:ContentSection;unavailable?:string[];mediaPaths?:string[]}){
 const run=(r:TextRun,i:number)=>{let node:React.ReactNode=r.text;if(r.bold)node=<strong>{node}</strong>;if(r.italic)node=<em>{node}</em>;if(r.href&&safeEditorialHref(r.href)&&!unavailable.includes(r.href))node=<Link href={r.href}>{node}</Link>;return <span key={i}>{node}</span>;};
 return <>{section.body?section.body.blocks.map(b=>b.kind==='quote'?<blockquote key={b.id}><p>{b.runs.map(run)}</p>{b.attribution&&<cite>{b.attribution}</cite>}</blockquote>:<p key={b.id}>{b.runs.map(run)}</p>):section.paragraphs.map((p,i)=><p key={i}>{p}</p>)}
 {!!section.checklist?.length&&<ul>{section.checklist.map((p,i)=><li key={i}>{p}</li>)}</ul>}
 {section.material&&<dl>{Object.entries(section.material).filter(([,v])=>v.trim()).map(([key,value])=><div key={key}><dt><JourneyText text={key[0].toUpperCase()+key.slice(1)}/></dt><dd>{value}</dd></div>)}</dl>}
 {section.image&&<EditorialImage usage={section.image} available={!mediaPaths||mediaPaths.includes(section.image.path)}/>}
 {section.action&&safeEditorialHref(section.action.href)&&!unavailable.includes(section.action.href)&&<p><Link href={section.action.href}>{section.action.label} ↗</Link></p>}
 {section.policyHref&&safeEditorialHref(section.policyHref)&&!unavailable.includes(section.policyHref)&&<p><Link href={section.policyHref}><JourneyText text="Read the related policy ↗"/></Link></p>}</>;
}

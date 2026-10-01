import {contentDifferences} from '@/lib/content-diff';
import Image from 'next/image';
import {validUsage,type EditorialUsage} from '@/lib/homepage-model';
import type {ContentDocument} from '@/lib/content-model';
import s from './workspace.module.css';
function usages(value:unknown){
 const document=value as Partial<ContentDocument>|null;
 const found=new Map<string,EditorialUsage>();
 for(const section of [...(document?.sections||[]),...(document?.homepage?.sections||[])])if(section.image&&typeof section.image==='object'&&validUsage(section.image))found.set(section.id,section.image);
 return found;
}
export function ContentCompare({before,after}:{before:unknown;after:unknown}){
 const differences=contentDifferences(before,after);
 const previous=usages(before),next=usages(after),changed=[...new Set([...previous.keys(),...next.keys()])].filter(id=>JSON.stringify(previous.get(id))!==JSON.stringify(next.get(id)));
 return <div className={s.differences}>{changed.map(id=><section key={'crop-'+id}><h4>{id} · Image placement</h4><div>{[['Before',previous.get(id)],['After',next.get(id)]].map(([label,value])=>{const usage=value as EditorialUsage|undefined;return <div key={label as string}><strong>{label as string}</strong>{usage?(['desktop','mobile'] as const).map(device=><figure key={device} style={{margin:0}}><div className={s.cropPreview} style={{aspectRatio:usage[device].ratio}}><Image src={usage.path} alt={usage.alt} fill sizes="300px" style={{objectFit:'cover',objectPosition:`${usage[device].x}% ${usage[device].y}%`}}/></div><figcaption>{device} · {usage.caption}</figcaption></figure>):<p>No image</p>}</div>;})}</div></section>)}{differences.length?differences.map(d=><section key={d.field}><h4>{d.field}</h4><div><p><strong>Before</strong><br/>{d.before}</p><p><strong>After</strong><br/>{d.after}</p></div></section>):<p>No editorial differences.</p>}</div>;
}

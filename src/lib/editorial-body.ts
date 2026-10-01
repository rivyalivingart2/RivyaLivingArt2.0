/** Versioned text-only format. Never accepts HTML, style, embeds or executable URLs. */
export type TextRun={text:string;bold?:boolean;italic?:boolean;href?:string};
export type TextBlock={id:string;kind:'paragraph'|'quote';runs:TextRun[];attribution?:string};
export type EditorialBody={schemaVersion:1;blocks:TextBlock[]};
export const safeEditorialHref=(value:unknown):value is string=>typeof value==='string'&&value.length<=240&&/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*){0,2})?(?:#[a-z0-9-]+)?$/.test(value)&&!value.startsWith('/studio')&&!value.startsWith('/api');
const text=(v:unknown,max:number)=>typeof v==='string'&&!!v.trim()&&v.length<=max&&!/[<>]/.test(v);
const keys=(v:object,allowed:string[])=>Object.keys(v).every(k=>allowed.includes(k));
export function validEditorialBody(value:unknown):value is EditorialBody{
 if(!value||typeof value!=='object')return false;
 const b=value as EditorialBody;
 return keys(b,['schemaVersion','blocks'])&&b.schemaVersion===1&&Array.isArray(b.blocks)&&b.blocks.length>0&&b.blocks.length<=12&&new Set(b.blocks.map(p=>p?.id)).size===b.blocks.length&&b.blocks.every(p=>
  p&&keys(p,['id','kind','runs','attribution'])&&/^[-a-z0-9]{1,80}$/.test(p.id)&&['paragraph','quote'].includes(p.kind)&&(!p.attribution||(p.kind==='quote'&&text(p.attribution,180)))&&Array.isArray(p.runs)&&p.runs.length>0&&p.runs.length<=30&&p.runs.every(r=>r&&keys(r,['text','bold','italic','href'])&&text(r.text,2500)&&(r.bold===undefined||typeof r.bold==='boolean')&&(r.italic===undefined||typeof r.italic==='boolean')&&(r.href===undefined||safeEditorialHref(r.href)))&&p.runs.map(r=>r.text).join('').length<=2500);
}
export const bodyParagraphs=(body:EditorialBody)=>body.blocks.map(p=>p.runs.map(r=>r.text).join('')+(p.attribution?' — '+p.attribution:''));
export const bodyFromParagraphs=(paragraphs:string[]):EditorialBody=>({schemaVersion:1,blocks:paragraphs.map((text,i)=>({id:'paragraph-'+(i+1),kind:'paragraph',runs:[{text}]}))});
export const bodyLinks=(body?:EditorialBody)=>body?.blocks.flatMap(b=>b.runs.flatMap(r=>r.href?[r.href]:[]))||[];

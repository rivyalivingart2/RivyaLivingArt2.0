export const editorFields = {
 content:{title:'content',description:'content',image:'content',imageAlt:'content'},
 products:{name:'general',subtitle:'general',story:'details',image:'images'},
 media:{alt:'metadata',caption:'metadata'},
} as const;
export type RecordEditor = keyof typeof editorFields;
export type RecordTarget = {record:string;tab:string;field:string};
export function studioRecordHref(editor:RecordEditor,record:string,field?:string) {
 const fields=editorFields[editor] as Record<string,string>;
 const section=editor==='content'&&field&&/^section-[-a-z0-9]{1,80}$/.test(field);
 const chosen=section||field&&Object.hasOwn(fields,field)?field!:Object.keys(fields)[0];
 return `/studio/${editor}?`+new URLSearchParams({record,tab:fields[chosen]||'content',field:chosen}).toString();
}
export function studioRecordTarget(editor:RecordEditor,params:Pick<URLSearchParams,'get'>):RecordTarget|null {
 const record=params.get('record');
 if(!record||record.length>1024||/[\u0000-\u001f]/.test(record))return null;
 const fields=editorFields[editor] as Record<string,string>;
 const requested=params.get('field')||'';
 const field=Object.hasOwn(fields,requested)||(editor==='content'&&/^section-[-a-z0-9]{1,80}$/.test(requested))?requested:Object.keys(fields)[0];
 // Field ownership chooses the tab. A tampered tab cannot hide the requested field.
 return {record,field,tab:fields[field]||'content'};
}

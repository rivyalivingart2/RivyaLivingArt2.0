import {concepts} from '@/lib/rivya/source/catalogue';
import {createStudioProductDraft,validateStudioProductDraft,type StudioProductDraft} from '@/lib/rivya/source/studio-product-draft';
import type {DemoState} from './demo-state';
export const importFields=['id','title','description','priceType','priceAmountMinor','width','depth','height'] as const;
export type ImportField=typeof importFields[number];
export type ImportTable={headers:string[];rows:string[][];checksum:string};
export type ImportMapping=Partial<Record<ImportField,string>>;
export type ImportRow={row:number;id:string;title:string;status:'ready'|'blocked'|'applied';messages:string[];draft?:StudioProductDraft;expectedRevision:number};
const MAX_BYTES=262144,MAX_ROWS=120,MAX_COLS=12;
/** Quoted commas, escaped quotes and multiline text; malformed quotes fail closed. */
export function parseCatalogueCsv(text:string):string[][]{
 const rows:string[][]=[];let row:string[]=[],cell='',quoted=false,closed=false;
 text=text.replace(/^\uFEFF/,'');
 const endCell=()=>{if(cell.length>6000)throw Error('A cell exceeds 6,000 characters.');row.push(cell);if(row.length>MAX_COLS)throw Error('Use at most 12 columns.');cell='';closed=false};
 const endRow=()=>{endCell();if(row.some(v=>v.trim()))rows.push(row);row=[];if(rows.length>MAX_ROWS+1)throw Error('Use at most 120 product rows.')};
 for(let i=0;i<text.length;i++){const c=text[i];if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++}else{quoted=false;closed=true}}else cell+=c;continue}
  if(c==='"'){if(cell||closed)throw Error('Unexpected quote in CSV. Quote the whole cell.');quoted=true}
  else if(c===',')endCell();else if(c==='\r'||c==='\n'){if(c==='\r'&&text[i+1]==='\n')i++;endRow()}
  else if(closed){if(c!==' '&&c!=='\t')throw Error('Unexpected characters after a quoted CSV cell.')}else cell+=c;
 }
 if(quoted)throw Error('A quoted CSV cell was not closed.');if(cell||row.length||closed)endRow();return rows;
}
function table(rows:string[][],checksum:string):ImportTable{
 if(rows.length<2||rows.length>MAX_ROWS+1)throw Error('Include one header row and 1–120 product rows.');
 const headers=rows[0].map(v=>v.trim());if(headers.length>MAX_COLS||headers.some(h=>!h||h.length>80)||new Set(headers).size!==headers.length)throw Error('Use 1–12 distinct, nonempty column headings.');
 if(headers.some(h=>/password|email|phone|address|customer|contact|consent|subscriber/i.test(h)))throw Error('This importer accepts synthetic product content only. Remove personal-data columns.');
 for(const row of rows.slice(1)){if(row.length>headers.length)throw Error('A row contains more cells than the header.');for(const cell of row)if(cell.length>6000||/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(cell))throw Error('A cell is too long or contains unsupported control characters.');}
 return {headers,rows:rows.slice(1),checksum};
}
export async function readCatalogueFile(file:File):Promise<ImportTable>{
 if(!/\.(csv|xlsx)$/i.test(file.name))throw Error('Choose a CSV or XLSX file. Legacy XLS and macro workbooks are unsupported.');
 if(!file.size||file.size>MAX_BYTES)throw Error('Choose a nonempty file smaller than 256 KiB.');
 const buffer=await file.arrayBuffer(),bytes=new Uint8Array(buffer);
 const checksum=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',buffer))).map(b=>b.toString(16).padStart(2,'0')).join('');
 if(/\.csv$/i.test(file.name))return table(parseCatalogueCsv(new TextDecoder('utf-8',{fatal:true}).decode(bytes)),checksum);
 const {unzipSync,zipSync}=await import('fflate');let total=0,count=0;
 const files=unzipSync(bytes,{filter:entry=>{total+=entry.originalSize;count++;if(count>64||total>1048576||entry.originalSize>524288||entry.name.includes('..')||entry.name.startsWith('/')||/externalLinks|vbaProject|embeddings|activeX/i.test(entry.name))throw Error('Workbook exceeds the local limits or contains unsupported embedded content.');return !entry.name.endsWith('/')}});
 if(!files['[Content_Types].xml']||!files['xl/workbook.xml'])throw Error('This file is not an XLSX workbook.');
 const sheets=Object.keys(files).filter(n=>/^xl\/worksheets\/sheet\d+\.xml$/.test(n));if(sheets.length!==1)throw Error('Use a workbook with one worksheet.');
 for(const [name,data] of Object.entries(files)){if(!/\.(xml|rels)$/.test(name))throw Error('Use a simple workbook without embedded files or images.');const xml=new TextDecoder('utf-8',{fatal:true}).decode(data);if(/<!DOCTYPE|<!ENTITY|<(?:[\w-]+:)?f(?:\s|>)|TargetMode\s*=\s*["']External|<hyperlink\b/i.test(xml))throw Error('Use plain values. Formulas, external links and embedded content are not accepted.');
  if(name===sheets[0]){for(const match of xml.matchAll(/\br="([A-Z]*)(\d+)"/g)){const col=[...match[1]].reduce((n,c)=>n*26+c.charCodeAt(0)-64,0);if(Number(match[2])>121||col>12)throw Error('Use only the first 12 columns and 121 rows, including the header.');}}
 }
 // Repack only the bounded, inspected data before passing it to the spreadsheet reader.
 const safe=zipSync(files),{readSheet}=await import('read-excel-file/browser');
 const rows=await readSheet(new Blob([new Uint8Array(safe)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
 return table(rows.map(row=>row.map(cell=>{if(cell==null)return '';if(typeof cell==='string'||typeof cell==='number'&&Number.isFinite(cell))return String(cell);throw Error('Use plain text and number cells; dates and booleans are unsupported here.')})),checksum);
}
export function suggestedMapping(headers:string[]):ImportMapping{
 const aliases:Record<ImportField,string[]>={id:['id','product_id','stable_id'],title:['title','display_name'],description:['description'],priceType:['priceType','pricing_mode'],priceAmountMinor:['priceAmountMinor','price_paise'],width:['width','width_mm'],depth:['depth','depth_mm'],height:['height','height_mm']};
 return Object.fromEntries(importFields.flatMap(field=>{const header=headers.find(h=>aliases[field].some(a=>a.toLowerCase()===h.toLowerCase()));return header?[[field,header]]:[]}));
}
export function previewCatalogueImport(input:ImportTable,mapping:ImportMapping,state:DemoState,applied:string[]=[]):ImportRow[]{
 const ids=input.rows.map(row=>row[input.headers.indexOf(mapping.id||'')]?.trim()||'');
 return input.rows.map((row,index)=>{const read=(key:ImportField)=>row[input.headers.indexOf(mapping[key]||'')]?.trim()||'',id=ids[index],p=concepts.find(p=>p.id===id),messages:string[]=[],expectedRevision=state.drafts[id]?.revision||0;
  const result:ImportRow={row:index+2,id,title:read('title'),status:'blocked',messages,expectedRevision};
  if(applied.includes(id))return {...result,status:'applied',messages:['Already checkpointed by this local import.']};
  if(!mapping.id||!mapping.title)messages.push('Map the stable ID and display title columns.');
  if(!p)messages.push('Unknown stable product ID; this demo updates existing samples only.');
  if(id&&ids.filter(v=>v===id).length>1)messages.push('Duplicate stable ID within this file; all repeated rows are blocked.');
  if(state.removed.includes(id))messages.push('Manually removed sample. Import never reinstalls it.');
  if(state.retained.includes(id)||state.drafts[id]||state.published[id])messages.push('Retained or locally edited sample; reconcile it in the product editor.');
  if(!read('title'))messages.push('A display title is required.');
  for(const cell of row)if(/^[=+@]|^-\D/.test(cell.trimStart()))messages.push('Formula-like cells are blocked. Use plain product values.');
  if(!p||messages.length)return result;
  const draft=createStudioProductDraft(p);draft.title=read('title');
  for(const key of ['description','width','depth','height','priceAmountMinor'] as const)if(mapping[key])draft[key]=read(key);
  if(mapping.priceType){if(!['ON_REQUEST','STARTING_FROM','FIXED'].includes(read('priceType')))messages.push('Invalid pricing mode.');else draft.priceType=read('priceType') as StudioProductDraft['priceType']}
  if(draft.title.length>160||draft.description.length>4000)messages.push('Title or description is too long.');
  messages.push(...Object.values(validateStudioProductDraft(draft)));
  return {...result,status:messages.length?'blocked':'ready',draft,messages:messages.length?messages:['Ready for a local draft checkpoint. Source and published snapshots are unchanged.']};
 });
}
export function catalogueCsv(rows:readonly (readonly unknown[])[]):string{
 return '\uFEFF'+rows.map(row=>row.map(value=>{let s=String(value??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'}).join(',')).join('\r\n');
}
export function downloadText(name:string,content:string,type='text/csv;charset=utf-8'){
 const url=URL.createObjectURL(new Blob([content],{type})),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

export type SubscriberFilters={q:string;source:''|'footer'|'journal';from:string;to:string;sort:'newest'|'oldest'|'email';page:number};
export type SubscriberRow={email:string;source:'footer'|'journal';createdAt:string};
export type SubscriberPage={rows:SubscriberRow[];total:number;page:number;pages:number;pageSize:number};
export const subscriberPageSize=50;
const date=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
export function subscriberFilters(params:URLSearchParams):SubscriberFilters|null{
 const q=(params.get('q')||'').trim(),source=params.get('source')||'',from=params.get('from')||'',to=params.get('to')||'',sort=params.get('sort')||'newest',page=params.get('page')||'1';
 if(q.length>254||/[\u0000-\u001f]/.test(q)||!['','footer','journal'].includes(source)||![from,to].every(v=>!v||date(v))||(from&&to&&from>to)||!['newest','oldest','email'].includes(sort)||!/^\d{1,7}$/.test(page)||Number(page)<1)return null;
 return {q,source:source as SubscriberFilters['source'],from,to,sort:sort as SubscriberFilters['sort'],page:Number(page)};
}
export function subscriberParams(filters:SubscriberFilters){const params=new URLSearchParams();for(const [k,v] of Object.entries(filters))if(v)params.set(k,String(v));return params;}
/** Preserve CSV quoting and neutralize formulas, including leading whitespace. */
export function subscriberCsvCell(value:string){const safe=/^[\s]*[=+@-]/.test(value)||/^[\t\r\n]/.test(value)?"'"+value:value;return '"'+safe.replaceAll('"','""')+'"';}
export function subscriberCsv(rows:SubscriberRow[]){return '\uFEFFEmail,Source,Subscribed (UTC)\r\n'+rows.map(r=>[r.email,r.source,r.createdAt].map(subscriberCsvCell).join(',')).join('\r\n')+(rows.length?'\r\n':'');}

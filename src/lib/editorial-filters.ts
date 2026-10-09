import type {DiscoveryMetadata} from './editorial-metadata';
export const facetKeys=['topic','journey','format','tag','material','context','language','classification'] as const;
export type EditorialFacet=typeof facetKeys[number];
export type DiscoveryItem={id:string;title:string;topic:string;search:string;discovery?:DiscoveryMetadata;languages?:string[];classification?:string};
export function facetValues(item:DiscoveryItem,key:EditorialFacet):string[]{
 const d=item.discovery;const values=key==='topic'?[item.topic]:key==='tag'?d?.tags:key==='material'?d?.materials:key==='language'?item.languages||['en']:key==='classification'?[item.classification||'Unclassified']:[d?.[key]];
 return values?.filter((v):v is string=>!!v?.trim()).length?values.filter((v):v is string=>!!v?.trim()):['Unclassified'];
}
export function editorialFilterView<T extends DiscoveryItem>(items:T[],params:{get:(key:string)=>string|null},fields:EditorialFacet[]){
 const q=(params.get('q')||'').slice(0,150),active=Object.fromEntries(fields.map(k=>[k,(params.get(k)||'').slice(0,100)])),sort=params.get('sort')==='title'?'title':'curated';
 const matches=(item:T,except?:string)=>item.search.toLocaleLowerCase().includes(q.trim().toLocaleLowerCase())&&fields.every(k=>k===except||!active[k]||active[k]==='all'||facetValues(item,k).includes(active[k]));
 const results=items.filter(i=>matches(i));if(sort==='title')results.sort((a,b)=>a.title.localeCompare(b.title)||a.id.localeCompare(b.id));
 const facets=Object.fromEntries(fields.map(k=>[k,[...new Set(items.flatMap(i=>facetValues(i,k)))].sort().map(value=>({value,count:items.filter(i=>matches(i,k)&&facetValues(i,k).includes(value)).length}))]));
 const page=Math.max(1,Math.floor(Number(params.get('page'))||1)),totalPages=Math.max(1,Math.ceil(results.length/12));
 return {q,active,sort,results,facets,page,totalPages,paged:results.slice((page-1)*12,page*12)};
}

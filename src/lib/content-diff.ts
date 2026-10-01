/** Compare editorial values only. Saved dependency snapshots are read-only evidence. */
export function contentDifferences(before:unknown,after:unknown){
 function flatten(value:unknown,path='',out:Record<string,string>={}){
  if(Array.isArray(value)){
   if(value.length&&value.every(v=>v&&typeof v==='object'&&'id' in v)){
    out[path+'.order']=value.map(v=>v.id).join(' → ');
    for(const item of value)flatten(item,path+'.'+item.id,out);
   }else out[path]=value.map(v=>typeof v==='string'?v:JSON.stringify(v)).join('\n');
  }else if(value&&typeof value==='object')for(const [key,item] of Object.entries(value)){if(key!=='homeSnapshot')flatten(item,path?path+'.'+key:key,out);}
  else out[path]=value==null?'':String(value);
  return out;
 }
 const a=flatten(before),b=flatten(after);
 return [...new Set([...Object.keys(a),...Object.keys(b)])].filter(key=>a[key]!==b[key]).map(field=>({field,before:a[field]||'—',after:b[field]||'—'}));
}

import assert from 'node:assert/strict';

/** Keep strings and line positions intact; block-comment prose is not a field. */
export function stripPrismaComments(source) {
 let out='', state='code';
 for(let i=0;i<source.length;i++){
  const c=source[i],next=source[i+1];
  if(state==='string'){out+=c;if(c==='\\'&&next){out+=next;i++;}else if(c==='"')state='code';continue;}
  if(state==='line'){if(c==='\n'){out+=c;state='code';}else out+=' ';continue;}
  if(state==='block'){if(c==='*'&&next==='/'){out+='  ';i++;state='code';}else out+=c==='\n'?'\n':' ';continue;}
  if(c==='"'){state='string';out+=c;}else if(c==='/'&&next==='/'){state='line';out+='  ';i++;}else if(c==='/'&&next==='*'){state='block';out+='  ';i++;}else out+=c;
 }
 assert.ok(!['block','string'].includes(state),'Unterminated schema comment/string');return out;
}
export function parsePrisma(source){
 const clean=stripPrismaComments(source),models=[],enums={};
 for(const m of clean.matchAll(/^enum\s+(\w+)\s*\{([\s\S]*?)^\}/gm))enums[m[1]]=m[2].split('\n').map(l=>l.trim().match(/^(\w+)/)?.[1]).filter(Boolean);
 for(const m of clean.matchAll(/^model\s+(\w+)\s*\{([\s\S]*?)^\}/gm)){
  const base=clean.slice(0,m.index).split('\n').length,fields=[];
  for(const [offset,line] of m[2].split('\n').entries()){
   const trimmed=line.trim();if(!trimmed||trimmed.startsWith('@@'))continue;
   const f=trimmed.match(/^(\w+)\s+(Unsupported\("[^"\n]+"\)|\w+)(\[\]|\?)?(?:\s+(.*))?$/);assert.ok(f,'Unsupported schema declaration: '+trimmed);
   fields.push({entity:m[1],field:f[1],baseType:f[2],type:f[2]+(f[3]||''),optional:f[3]==='?',list:f[3]==='[]',attributes:f[4]||'',line:base+offset});
  }
  models.push({entity:m[1],fields});
 }
 const names=new Set(models.map(m=>m.entity));
 const scalarTypes=new Set(['String','Boolean','Int','BigInt','Float','Decimal','DateTime','Json','Bytes']);
 for(const model of models)for(const field of model.fields){assert.ok(names.has(field.baseType)||Object.hasOwn(enums,field.baseType)||scalarTypes.has(field.baseType)||field.baseType.startsWith('Unsupported('),'Unsupported schema type: '+field.baseType);field.kind=names.has(field.baseType)?'relation':Object.hasOwn(enums,field.baseType)?'enum':'scalar';field.enumValues=enums[field.baseType]||[];}
 return {models,enums,fields:models.flatMap(m=>m.fields)};
}

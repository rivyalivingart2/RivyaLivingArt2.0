import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const snapshot=JSON.parse(readFileSync('docs/editorial-translations/source-baseline.json','utf8'));
const packs=JSON.parse(readFileSync('docs/editorial-translations/pages.json','utf8'));
const folder='docs/editorial-translations/imports';mkdirSync(folder,{recursive:true});
const review=[];
for(const [id,pack] of Object.entries(packs)){
 const source=snapshot.records.find(r=>r.id===id);assert.ok(source,`Unknown record ${id}`);
 assert.equal(source.sourceHash,pack.sourceHash,`English source changed: ${id}`);
 for(const locale of ['hi','gu']){
  assert.equal(pack[locale].length,source.fields.length,`Field count ${id}/${locale}`);
  const fields=Object.fromEntries(source.fields.map((f,i)=>{
   const value=pack[locale][i];assert.ok(value?.trim()&&!/[<>\u0000-\u0008]/.test(value)&&value.length<=6000,`Invalid text ${id}/${locale}/${f.path}`);
   return [f.path,value];
  }));
  const output=JSON.stringify({documentId:id,locale,fields},null,2);assert.ok(Buffer.byteLength(output)<64000);
  writeFileSync(`${folder}/${id.replace(':','-')}.${locale}.json`,output+'\n');
 }
 const currentFields=source.fields.map(f=>({...f,source:pack.sourceAmendments?.[f.path]||f.source}));
 review.push({...source,originalSourceHash:source.sourceHash,sourceHash:createHash('sha256').update(JSON.stringify(currentFields)).digest('hex'),fields:currentFields.map((f,i)=>({...f,hi:pack.hi[i],gu:pack.gu[i]})),sourceAmendments:pack.sourceAmendments||{},assistantReview:'Meaning checked against English; preview pending',nativeReaderReview:'NOT PERFORMED',publication:'PENDING'});
}
writeFileSync('docs/editorial-translations/page-review.json',JSON.stringify({sourceReadAt:snapshot.at,scope:'Editorial fields only. Imports cannot alter products, URLs, media paths or business settings. No native-reader approval is claimed.',records:review},null,2)+'\n');
console.log(JSON.stringify({records:review.length,imports:review.length*2,translatedFields:review.reduce((n,r)=>n+r.fields.length*2,0)}));

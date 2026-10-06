import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const snapshot=JSON.parse(readFileSync('docs/editorial-translations/source-baseline.json','utf8'));
const drafts=JSON.parse(readFileSync('docs/editorial-translations/articles-machine-drafts.json','utf8'));
assert.equal(drafts.completedBatches,drafts.totalBatches,'Finish the resumable translation batches first');
const glossary={Spaces:['स्थान','જગ્યાઓ'],Materials:['सामग्री','સામગ્રી'],Commissioning:['कृति बनवाना','કૃતિ બનાવડાવવી']};
const amendments={DB010:{imageAlt:'Horizon wall panel in an imagined interior — design visualization'}};
const review=[];let imports=0,values=0;
mkdirSync('docs/editorial-translations/article-imports',{recursive:true});
for(const original of snapshot.records.filter(r=>r.kind==='article')){
 const draft=drafts.records.find(r=>r.id===original.id);assert.ok(draft,original.id);
 assert.equal(draft.sourceHash,original.sourceHash,`Original source mismatch: ${original.id}`);
 const fields=original.fields.map(f=>({...f,source:amendments[original.id]?.[f.path]||f.source}));
 const sourceHash=createHash('sha256').update(JSON.stringify(fields)).digest('hex');
 const locales={};
 for(const [index,locale] of ['hi','gu'].entries()){
  assert.deepEqual(Object.keys(draft[locale]).sort(),fields.map(f=>f.path).sort(),`Missing/extra fields ${original.id}/${locale}`);
  const translated={...draft[locale]};
  const eyebrow=fields.find(f=>f.path==='eyebrow')?.source;
  if(glossary[eyebrow])translated.eyebrow=glossary[eyebrow][index];
  if(original.id==='DB010')translated.imageAlt=index===0?'काल्पनिक आंतरिक स्थान में Horizon दीवार पैनल — डिज़ाइन का दृश्य':'કલ્પિત આંતરિક જગ્યામાં Horizon દિવાલ પેનલ — ડિઝાઇનનું દૃશ્ય';
  for(const [path,value] of Object.entries(translated)){
   assert.ok(typeof value==='string'&&value.trim()&&value.length<=6000&&!/[<>\u0000-\u0008⟦⟧]/.test(value),`Invalid field ${original.id}/${locale}/${path}`);
   assert.ok((locale==='hi'?/[\u0900-\u097f]/:/[\u0a80-\u0aff]/).test(value),`Missing target script ${original.id}/${locale}/${path}`);
  }
  const output=JSON.stringify({documentId:original.id,locale,fields:translated},null,2);
  assert.ok(Buffer.byteLength(output)<64000,`Studio import exceeds limit ${original.id}/${locale}`);
  writeFileSync(`docs/editorial-translations/article-imports/${original.id}.${locale}.json`,output+'\n');
  locales[locale]=translated;imports++;values+=fields.length;
 }
 review.push({id:original.id,route:original.route,sourceHash,originalSourceHash:original.sourceHash,sourceAmendments:amendments[original.id]||{},status:'DRAFT — meaning and native-reader review required',publication:'NOT PUBLISHED',fields:fields.map(f=>({...f,hi:locales.hi[f.path],gu:locales.gu[f.path]}))});
}
assert.equal(review.length,36);
const packet={at:new Date().toISOString(),engine:drafts.engine,status:'DRAFTS COMPLETE; NOT LANGUAGE ACCEPTANCE',records:review,imports,translatedValues:values,meaningReview:'REQUIRED — machine wording can misread commission, finish, brief and dates',nativeReaderReview:'NOT PERFORMED',publication:'NO ARTICLE TRANSLATION HAS BEEN PUBLISHED'};
writeFileSync('docs/editorial-translations/article-review.json',JSON.stringify(packet,null,2)+'\n');
const pageReview=JSON.parse(readFileSync('docs/editorial-translations/page-review.json','utf8'));
const receipts=JSON.parse(readFileSync('docs/editorial-translations/publication-receipts.json','utf8'));
for(const page of pageReview.records){const receipt=receipts.records.find(r=>r.id===page.id);if(receipt){page.publication=`PUBLISHED AND ANONYMOUSLY VERIFIED — revision ${receipt.published}`;page.assistantReview='English meaning checked; both exact saved-language previews inspected';page.publishedVersion=receipt.published;}}
writeFileSync('docs/editorial-translations/page-review.json',JSON.stringify(pageReview,null,2)+'\n');
const records=[...pageReview.records,...review];
const folder=resolve('../../../outputs/CRAFT');mkdirSync(folder,{recursive:true});
const data=JSON.stringify(records).replace(/</g,'\\u003c');
writeFileSync(resolve(folder,'editorial-language-review.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Rivya editorial language review</title><style>body{margin:0;background:#101a23;color:#f5efe5;font:17px/1.65 system-ui}header,main{max-width:1400px;margin:auto;padding:24px}h1{font-size:32px;line-height:1.2}a{color:#efd096}select,input,textarea,button{font:inherit;color:inherit;background:#162c3a;border:1px solid #9aa6af;padding:10px;border-radius:4px}select{max-width:100%}button{cursor:pointer}fieldset{margin:25px 0;border:1px solid #71828e;padding:16px}legend{color:#efcc90}.columns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}.columns p{white-space:pre-wrap;overflow-wrap:anywhere;margin:0}.label{display:block;color:#b4c7d6;font-size:13px}textarea{width:100%;box-sizing:border-box;min-height:100px}.status{border-left:4px solid #dfad62;padding:12px;background:#192832}nav{display:flex;gap:12px;align-items:center;flex-wrap:wrap}@media(max-width:800px){.columns{grid-template-columns:1fr}header,main{padding:16px}}</style><header><h1>Editorial language review</h1><p>Seven pages are published with assistant meaning review. All 36 article translations are complete machine-assisted drafts. Independent native-reader approval has not been performed. This local review page cannot publish website content.</p><p class="status">Review meaning against English, craft vocabulary, numbers, negation, names and dates. Do not turn estimates into guarantees, visualizations into real projects, or a prepared WhatsApp message into an automatic send. Products and business facts stay unchanged.</p><nav><label>Document <select id="record"></select></label><button id="previous">Previous</button><button id="next">Next</button><button id="export">Export review notes</button></nav></header><main id="review"></main><script>
const records=${data},key='rivya-editorial-native-review-v1';let notes={};try{notes=JSON.parse(localStorage.getItem(key)||'{}')}catch{};
const select=document.getElementById('record'),main=document.getElementById('review');
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
records.forEach((r,i)=>{const o=document.createElement('option');o.value=i;o.textContent=r.id+' — '+r.fields.find(f=>f.path==='title')?.source;select.append(o)});
function show(){const r=records[Number(select.value)],n=notes[r.id]||{};main.innerHTML='<h2>'+escape(r.id)+'</h2><p class="status">'+escape(r.publication)+'</p><p>Source fingerprint: '+escape(r.sourceHash)+'</p><label>Reviewer name or initials <input id="reviewer" value="'+escape(n.reviewer||'')+'"></label><p><label><input id="hiReview" type="checkbox" '+(n.hi?'checked':'')+'> Native Hindi meaning review completed</label></p><p><label><input id="guReview" type="checkbox" '+(n.gu?'checked':'')+'> Native Gujarati meaning review completed</label></p><label>Corrections and unresolved questions<textarea id="notes">'+escape(n.notes||'')+'</textarea></label><p id="saveStatus" role="status"></p>'+r.fields.map(f=>'<fieldset><legend>'+escape(f.path)+'</legend><div class="columns"><p lang="en"><span class="label">English source</span>'+escape(f.source)+'</p><p lang="hi"><span class="label">Hindi draft / page translation</span>'+escape(f.hi)+'</p><p lang="gu"><span class="label">Gujarati draft / page translation</span>'+escape(f.gu)+'</p></div></fieldset>').join('');for(const id of ['reviewer','hiReview','guReview','notes'])document.getElementById(id).addEventListener('change',()=>{notes[r.id]={sourceHash:r.sourceHash,reviewer:document.getElementById('reviewer').value,hi:document.getElementById('hiReview').checked,gu:document.getElementById('guReview').checked,notes:document.getElementById('notes').value,at:new Date().toISOString()};try{localStorage.setItem(key,JSON.stringify(notes));document.getElementById('saveStatus').textContent='Notes saved in this browser only. Export a copy to share.'}catch{document.getElementById('saveStatus').textContent='Browser storage unavailable. Export your notes before closing.'}})}
select.onchange=show;document.getElementById('previous').onclick=()=>{select.selectedIndex=Math.max(0,select.selectedIndex-1);show()};document.getElementById('next').onclick=()=>{select.selectedIndex=Math.min(records.length-1,select.selectedIndex+1);show()};document.getElementById('export').onclick=()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify({at:new Date().toISOString(),notes},null,2)],{type:'application/json'}));a.href=url;a.download='rivya-language-review-notes.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};show();</script></html>`);
console.log(JSON.stringify({articles:review.length,imports,translatedValues:values,reviewDocument:resolve(folder,'editorial-language-review.html')}));

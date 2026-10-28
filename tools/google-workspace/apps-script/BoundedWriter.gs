/* LOCAL SOURCE ONLY — independent v2 endpoint; do not replace the existing v1
 * deployment or registrations without separate installation and acceptance.
 * GW_KEYS_JSON keyId->secret; GW_BOUNDED_RESOURCES_JSON key->BoundedLayout.
 * ScriptLock serializes cooperating requests only, NOT owner/unrelated API edits.
 * All uncertain writes remain fenced; no timer clears an inflight operation. */
var BW_PROTOCOL='rivya-bounded-v2';
var BW_PAGE_ROWS=8, BW_PAGE_CHARACTERS=131072, BW_METADATA_BYTES=1048576, BW_CHUNK_CHARACTERS=16384;
var BW_REQUEST_BYTES=1800000, BW_RESPONSE_BYTES=6000000;
function doPost(event) {
  var request,secret,authenticated=false;
  try {
    var text=event&&event.postData&&event.postData.contents;
    if(typeof text!=='string'||bwBytes(text)>BW_REQUEST_BYTES)throw Error('invalid-request');
    var envelope=JSON.parse(text);bwExact(envelope,['message','signature']);
    if(typeof envelope.message!=='string'||!/^[a-f0-9]{64}$/.test(envelope.signature))throw Error('invalid-request');
    request=JSON.parse(envelope.message);bwExact(request,['version','keyId','requestId','issuedAt','expiresAt','action','payload']);
    var keys=JSON.parse(PropertiesService.getScriptProperties().getProperty('GW_KEYS_JSON')||'{}');
    secret=Object.prototype.hasOwnProperty.call(keys,request.keyId)?keys[request.keyId]:null;
    if(typeof secret!=='string'||!/^[a-f0-9]{64,128}$/.test(secret)||!bwEqual(bwHmac(envelope.message,secret),envelope.signature))throw Error('unauthorized');authenticated=true;
    var now=Date.now();if(request.version!==1||!/^[A-Za-z0-9_-]{16,100}$/.test(request.requestId)||!Number.isSafeInteger(request.issuedAt)||!Number.isSafeInteger(request.expiresAt)||request.issuedAt>now+5000||request.expiresAt<=now||request.expiresAt-request.issuedAt!==30000||['read','commit'].indexOf(request.action)<0||bwCanonical(request)!==envelope.message)throw Error('invalid-request');
    var registrations=JSON.parse(PropertiesService.getScriptProperties().getProperty('GW_BOUNDED_RESOURCES_JSON')||'{}');
    var key=request.payload&&request.payload.resourceKey;if(!Object.prototype.hasOwnProperty.call(registrations,key))throw Error('not-registered');var layout=registrations[key];bwLayout(layout);if(layout.key!==key||request.payload.protocol!==BW_PROTOCOL)throw Error('invalid-request');
    Object.keys(registrations).forEach(function(otherKey){var r=registrations[otherKey];bwLayout(r);if(r.key!==otherKey)throw Error('configuration');if(otherKey!==key&&r.workbookId===layout.workbookId)throw Error('configuration');});
    var lock=LockService.getScriptLock();if(!lock.tryLock(5000))throw Error('busy');var result;
    try{result=request.action==='read'?bwRead(layout,request.payload):bwCommit(layout,request.payload);}finally{lock.releaseLock();}
    return bwResponse(request,secret,true,result);
  }catch(error){
    if(authenticated&&request&&secret)return bwResponse(request,secret,false,{code:error&&error.message==='outcome-unknown'?'outcome-unknown':'unavailable'});
    return ContentService.createTextOutput('{"error":"unauthorized"}').setMimeType(ContentService.MimeType.JSON);
  }
}
function bwExact(x,keys){if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).sort().join('|')!==keys.slice().sort().join('|'))throw Error('integrity');}
function bwNumber(x,min,max){return Number.isSafeInteger(x)&&x>=min&&x<=max;}
function bwId(x){return typeof x==='string'&&x.length>0&&x.length<=240&&!/[\s\u0000-\u001f\u007f-\u009f]/.test(x);}
function bwDigest(x){return typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);}
function bwSame(a,b){return bwCanonical(a)===bwCanonical(b);}
function bwLayout(r){
  bwExact(r,['protocol','key','workbookId','rootSheetId','metadataSheetId','dataSheetId','maxPages','maxMetadataChunks']);
  var ids=[r.rootSheetId,r.metadataSheetId,r.dataSheetId];
  if(r.protocol!==BW_PROTOCOL||!/^[a-z][a-z0-9_-]{0,63}$/.test(r.key)||!/^[A-Za-z0-9_-]{10,160}$/.test(r.workbookId)||ids.some(function(x){return !bwNumber(x,0,2147483647);})||new Set(ids).size!==3||!bwNumber(r.maxPages,1,8192)||!bwNumber(r.maxMetadataChunks,1,64))throw Error('configuration');
}
function bwChunks(m,r){var text=bwCanonical(m);if(bwBytes(text)>BW_METADATA_BYTES)throw Error('capacity');var chunks=[],offset=0;while(offset<text.length){var end=Math.min(text.length,offset+BW_CHUNK_CHARACTERS);if(end<text.length&&/[\uD800-\uDBFF]/.test(text[end-1]))end--;chunks.push(text.slice(offset,end));offset=end;}if(chunks.length>r.maxMetadataChunks)throw Error('capacity');return chunks;}
function bwManifest(r,root,m,allowInflight){
  bwExact(root,['format','epoch','revision','manifestSha256','metadataChunks','state','operationId','requestSha256','actorId']);
  if(root.format!=='rivya-bounded-root-v2'||!bwId(root.epoch)||!bwNumber(root.revision,0,Number.MAX_SAFE_INTEGER)||!bwDigest(root.manifestSha256)||!bwNumber(root.metadataChunks,1,r.maxMetadataChunks)||['ready','committed','inflight'].indexOf(root.state)<0)throw Error('integrity');
  if(root.state==='inflight'&&!allowInflight)throw Error('outcome-unknown');
  if(root.state==='ready'?(root.operationId!==null||root.requestSha256!==null||root.actorId!==null):(!bwId(root.operationId)||!bwDigest(root.requestSha256)||!bwId(root.actorId)))throw Error('integrity');
  bwExact(m,['format','layoutSha256','epoch','revision','pages','records','mutations','transactions']);
  if(m.format!=='rivya-bounded-manifest-v2'||m.layoutSha256!==bwSha(bwCanonical(r))||m.epoch!==root.epoch||m.revision!==root.revision||!Array.isArray(m.pages)||!Array.isArray(m.records)||!Array.isArray(m.mutations)||!Array.isArray(m.transactions)||m.pages.length>r.maxPages||m.transactions.length!==m.revision)throw Error('integrity');
  var chunks=bwChunks(m,r);if(chunks.length!==root.metadataChunks||bwSha(chunks.join(''))!==root.manifestSha256)throw Error('integrity');
  m.pages.forEach(function(p){if(!Array.isArray(p)||p.length!==3||['r','l','a','h'].indexOf(p[0])<0||!bwNumber(p[1],1,8)||!bwDigest(p[2]))throw Error('integrity');});
  var slots=new Set(),ids=new Set(),mutations=new Set(),operations=new Set(),last=new Map();
  function locate(kind,p,row){if(!bwNumber(p,0,m.pages.length-1)||m.pages[p][0]!==kind||!bwNumber(row,0,m.pages[p][1]-1))throw Error('integrity');var slot=p+':'+row;if(slots.has(slot))throw Error('integrity');slots.add(slot);}
  m.records.forEach(function(h){if(!Array.isArray(h)||h.length!==4||!bwId(h[0])||ids.has(h[0])||!bwNumber(h[3],0,m.mutations.length-1))throw Error('integrity');ids.add(h[0]);locate('r',h[1],h[2]);});
  m.mutations.forEach(function(x,i){if(!Array.isArray(x)||x.length!==9||!bwId(x[0])||mutations.has(x[0])||!bwNumber(x[1],0,m.records.length-1)||!bwNumber(x[2],-1,i-1)||x[2]!== (last.has(x[1])?last.get(x[1]):-1))throw Error('integrity');mutations.add(x[0]);last.set(x[1],i);locate('l',x[3],x[4]);locate('a',x[5],x[6]);locate('h',x[7],x[8]);});
  m.records.forEach(function(h,i){if(last.get(i)!==h[3])throw Error('integrity');});
  var next=0;m.transactions.forEach(function(t){if(!Array.isArray(t)||t.length!==3||!bwId(t[0])||operations.has(t[0])||t[1]!==next||!bwNumber(t[2],1,8)||t[1]+t[2]>m.mutations.length)throw Error('integrity');operations.add(t[0]);next+=t[2];});
  if(next!==m.mutations.length||slots.size!==m.pages.reduce(function(n,p){return n+p[1];},0))throw Error('integrity');
  if(root.state==='ready'?root.revision!==0:root.state==='committed'&&root.operationId!==m.transactions[m.transactions.length-1][0])throw Error('integrity');
}
function bwProperties(r){
  var result=Sheets.Spreadsheets.get(r.workbookId,{fields:'spreadsheetId,sheets(properties(sheetId,title,gridProperties))'});if(result.spreadsheetId!==r.workbookId||!Array.isArray(result.sheets))throw Error('integrity');
  var expected=[[r.rootSheetId,1,1],[r.metadataSheetId,r.maxMetadataChunks,1],[r.dataSheetId,r.maxPages*8,7]],titles=new Map();
  expected.forEach(function(e){var found=result.sheets.filter(function(s){return s.properties.sheetId===e[0];});if(found.length!==1)throw Error('integrity');var p=found[0].properties;if(typeof p.title!=='string'||!p.gridProperties||p.gridProperties.rowCount!==e[1]||p.gridProperties.columnCount!==e[2])throw Error('configuration');titles.set(e[0],p.title);});return titles;
}
function bwColumn(n){var text='';while(n>0){n--;text=String.fromCharCode(65+n%26)+text;n=Math.floor(n/26);}return text;}
function bwGet(r,titles,sheetId,startRow,count,width){
  var title=titles.get(sheetId);if(typeof title!=='string'||!bwNumber(startRow,0,r.maxPages*8)||!bwNumber(count,1,Math.max(8,r.maxMetadataChunks))||!bwNumber(width,1,7))throw Error('invalid-request');
  var range="'"+title.replace(/'/g,"''")+"'!A"+(startRow+1)+':'+bwColumn(width)+(startRow+count);
  var result=Sheets.Spreadsheets.get(r.workbookId,{includeGridData:true,ranges:[range],fields:'spreadsheetId,sheets(properties(sheetId),data(startRow,startColumn,rowData(values(userEnteredValue,effectiveValue))))'});
  if(result.spreadsheetId!==r.workbookId||!Array.isArray(result.sheets)||result.sheets.length!==1||result.sheets[0].properties.sheetId!==sheetId)throw Error('integrity');var data=result.sheets[0].data;if(!Array.isArray(data)||data.length!==1||(data[0].startRow||0)!==startRow||(data[0].startColumn||0)!==0)throw Error('integrity');
  var raw=data[0].rowData||[];if(raw.length>count)throw Error('integrity');var rows=[];
  for(var i=0;i<count;i++){var values=raw[i]&&raw[i].values||[];if(values.length>width)throw Error('integrity');var row=[];for(var j=0;j<width;j++){var cell=values[j]||{},entered=cell.userEnteredValue||{},effective=cell.effectiveValue||{};if(!Object.keys(entered).length&&!Object.keys(effective).length){row.push('');continue;}if(Object.keys(entered).length!==1||typeof entered.stringValue!=='string'||entered.stringValue.length>45000|| (Object.keys(effective).length===0?entered.stringValue!=='':Object.keys(effective).length!==1||effective.stringValue!==entered.stringValue))throw Error('integrity');row.push(entered.stringValue);}rows.push(row);}return rows;
}
function bwState(r,allowInflight){
  var titles=bwProperties(r),root=JSON.parse(bwGet(r,titles,r.rootSheetId,0,1,1)[0][0]);
  if(root.state==='inflight'&&!allowInflight)throw Error('outcome-unknown');
  var rows=bwGet(r,titles,r.metadataSheetId,0,r.maxMetadataChunks,1),chunks=rows.map(function(row){return row[0];});
  if(!bwNumber(root.metadataChunks,1,r.maxMetadataChunks)||chunks.slice(root.metadataChunks).some(function(x){return x!=='';})||chunks.slice(0,root.metadataChunks).some(function(x){return !x.length||x.length>BW_CHUNK_CHARACTERS;}))throw Error('integrity');
  var text=chunks.slice(0,root.metadataChunks).join('');if(bwBytes(text)>BW_METADATA_BYTES)throw Error('capacity');var manifest=JSON.parse(text);if(bwCanonical(manifest)!==text)throw Error('integrity');bwManifest(r,root,manifest,allowInflight);return {root:root,manifest:manifest,titles:titles};
}
function bwPage(r,state,pageId){
  if(!bwNumber(pageId,0,state.manifest.pages.length-1))throw Error('invalid-request');var d=state.manifest.pages[pageId],width=d[0]==='a'?5:d[0]==='l'?6:7;
  var rows=bwGet(r,state.titles,r.dataSheetId,pageId*8,8,7);if(rows.slice(d[1]).some(function(row){return row.some(function(v){return v!=='';});}))throw Error('integrity');
  rows=rows.slice(0,d[1]).map(function(row){if(row.slice(width).some(function(v){return v!=='';}))throw Error('integrity');return row.slice(0,width);});var text=bwCanonical(rows);if(text.length>BW_PAGE_CHARACTERS||bwSha(text)!==d[2])throw Error('integrity');return {id:pageId,rows:rows};
}
function bwPageInput(m,page){bwExact(page,['id','rows']);if(!bwNumber(page.id,0,m.pages.length-1)||!Array.isArray(page.rows))throw Error('integrity');var d=m.pages[page.id],width=d[0]==='a'?5:d[0]==='l'?6:7;if(page.rows.length!==d[1]||page.rows.some(function(row){return !Array.isArray(row)||row.length!==width||row.some(function(v){return typeof v!=='string'||v.length>45000;});}))throw Error('integrity');var text=bwCanonical(page.rows);if(text.length>BW_PAGE_CHARACTERS||bwSha(text)!==d[2])throw Error('integrity');}
function bwRead(r,request){
  if(request.mode==='manifest'){bwExact(request,['protocol','resourceKey','mode']);var state=bwState(r,false);return {root:state.root,manifest:state.manifest};}
  if(request.mode==='pages'){bwExact(request,['protocol','resourceKey','mode','expected','pageIds']);bwExact(request.expected,['epoch','revision','manifestSha256']);if(!Array.isArray(request.pageIds)||request.pageIds.length<1||request.pageIds.length>4||new Set(request.pageIds).size!==request.pageIds.length)throw Error('invalid-request');var state=bwState(r,false);if(request.expected.epoch!==state.root.epoch||request.expected.revision!==state.root.revision||request.expected.manifestSha256!==state.root.manifestSha256)throw Error('conflict');var result={root:state.root,pages:request.pageIds.map(function(pageId){return bwPage(r,state,pageId);})};if(bwBytes(bwCanonical(result))>BW_RESPONSE_BYTES/2)throw Error('capacity');return result;}
  bwExact(request,['protocol','resourceKey','mode','expected','pageId']);bwExact(request.expected,['epoch','revision','manifestSha256']);if(request.mode!=='page')throw Error('invalid-request');var state=bwState(r,false);if(request.expected.epoch!==state.root.epoch||request.expected.revision!==state.root.revision||request.expected.manifestSha256!==state.root.manifestSha256)throw Error('conflict');return {root:state.root,page:bwPage(r,state,request.pageId)};
}
function bwUpdate(sheetId,startRow,rows,width){return {updateCells:{start:{sheetId:sheetId,rowIndex:startRow,columnIndex:0},rows:rows.map(function(row){var values=[];for(var i=0;i<width;i++)values.push({userEnteredValue:{stringValue:row[i]||''}});return {values:values};}),fields:'userEnteredValue'}};}
function bwCommit(r,p){
  bwExact(p,['protocol','resourceKey','expected','next','manifest','pages','readPageIds','operationId','requestSha256','actorId','commitBefore']);
  if(p.protocol!==BW_PROTOCOL||p.resourceKey!==r.key||!bwId(p.operationId)||!bwDigest(p.requestSha256)||!bwId(p.actorId)||!Array.isArray(p.pages)||p.pages.length<1||p.pages.length>64||p.commitBefore!==null&&!bwNumber(p.commitBefore,1,Number.MAX_SAFE_INTEGER))throw Error('invalid-request');
  bwManifest(r,p.next,p.manifest,false);if(p.next.state!=='committed'||p.next.operationId!==p.operationId||p.next.requestSha256!==p.requestSha256||p.next.actorId!==p.actorId)throw Error('integrity');
  var current=bwState(r,true);if(current.root.state==='inflight')throw Error('outcome-unknown');
  if(bwSame(current.root,p.next))return {status:'replay'};
  if(!bwSame(current.root,p.expected)||p.commitBefore!==null&&Date.now()>=p.commitBefore)return {status:'conflict'};
  var old=current.manifest,m=p.manifest;
  if(m.epoch!==old.epoch||m.revision!==old.revision+1||m.pages.length<old.pages.length||m.records.length<old.records.length||m.mutations.length<=old.mutations.length||m.mutations.length-old.mutations.length>8||m.transactions.length!==old.transactions.length+1)throw Error('integrity');
  old.mutations.forEach(function(x,i){if(!bwSame(x,m.mutations[i]))throw Error('integrity');});old.transactions.forEach(function(x,i){if(!bwSame(x,m.transactions[i]))throw Error('integrity');});
  var transaction=m.transactions[m.transactions.length-1];if(transaction[0]!==p.operationId||transaction[1]!==old.mutations.length||transaction[2]!==m.mutations.length-old.mutations.length)throw Error('integrity');
  var members=new Set();m.mutations.slice(old.mutations.length).forEach(function(x){if(members.has(x[1]))throw Error('integrity');members.add(x[1]);});
  old.records.forEach(function(h,i){var n=m.records[i];if(n[0]!==h[0]||!members.has(i)&&n[3]!==h[3]||members.has(i)&&n[3]<old.mutations.length)throw Error('integrity');});
  if(!Array.isArray(p.readPageIds)||p.readPageIds.length>64||new Set(p.readPageIds).size!==p.readPageIds.length||p.readPageIds.some(function(id){return !bwNumber(id,0,old.pages.length-1);}))throw Error('integrity');
  members.forEach(function(index){var head=old.records[index];if(!head)return;var last=old.mutations[head[3]],required=[head[1],last[3],last[5],last[7]];if(last[2]>=0)required.push(old.mutations[last[2]][7]);if(required.some(function(id){return p.readPageIds.indexOf(id)<0;}))throw Error('integrity');});
  var changed=new Map(),previous=new Map();p.readPageIds.forEach(function(id){previous.set(id,bwPage(r,current,id));});p.pages.forEach(function(page){bwPageInput(m,page);if(changed.has(page.id))throw Error('integrity');changed.set(page.id,page);});
  m.pages.forEach(function(d,i){if(i>=old.pages.length||!bwSame(d,old.pages[i])){if(!changed.has(i))throw Error('integrity');}else if(changed.has(i))throw Error('integrity');if(i<old.pages.length&&d[0]!==old.pages[i][0])throw Error('integrity');});
  changed.forEach(function(page,pageId){if(pageId>=old.pages.length)return;var before=previous.get(pageId);if(!before)throw Error('integrity');if(old.pages[pageId][0]!=='r'&&(page.rows.length<before.rows.length||before.rows.some(function(row,i){return !bwSame(row,page.rows[i]);})))throw Error('integrity');});
  // Relocating a packed current-record page cannot alter other records. Their
  // historical indices and complete literal rows remain identical.
  old.records.forEach(function(h,i){if(members.has(i))return;var n=m.records[i];if(h[1]===n[1]&&h[2]===n[2]&&!changed.has(h[1]))return;
    var before=previous.get(h[1]);if(!before){before=bwPage(r,current,h[1]);previous.set(h[1],before);}var after=changed.get(n[1]);if(!after||!bwSame(before.rows[h[2]],after.rows[n[2]]))throw Error('integrity');});
  var chunks=bwChunks(m,r),metadataRows=[];for(var j=0;j<r.maxMetadataChunks;j++)metadataRows.push([chunks[j]||'']);var writes=[];
  changed.forEach(function(page){var rows=page.rows.slice();while(rows.length<8)rows.push([]);writes.push(bwUpdate(r.dataSheetId,page.id*8,rows,7));});
  writes.push(bwUpdate(r.metadataSheetId,0,metadataRows,1));writes.push(bwUpdate(r.rootSheetId,0,[[bwCanonical(p.next)]],1));
  if(bwBytes(JSON.stringify({requests:writes}))>BW_REQUEST_BYTES)throw Error('capacity');
  var marker=JSON.parse(bwCanonical(current.root));marker.state='inflight';marker.operationId=p.operationId;marker.requestSha256=p.requestSha256;marker.actorId=p.actorId;
  try{Sheets.Spreadsheets.batchUpdate({requests:[bwUpdate(r.rootSheetId,0,[[bwCanonical(marker)]],1)]},r.workbookId);}catch(error){throw Error('outcome-unknown');}
  if(p.commitBefore!==null&&Date.now()>=p.commitBefore)throw Error('outcome-unknown');
  try{Sheets.Spreadsheets.batchUpdate({requests:writes},r.workbookId);}catch(error){throw Error('outcome-unknown');}
  return {status:'committed'};
}
function bwCanonical(value){if(value===null||typeof value==='boolean'||typeof value==='string')return JSON.stringify(value);if(typeof value==='number'&&Number.isFinite(value))return Object.is(value,-0)?'-0':JSON.stringify(value);if(Array.isArray(value))return '['+value.map(bwCanonical).join(',')+']';if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(function(k){if(['__proto__','prototype','constructor'].indexOf(k)>=0)throw Error('invalid-request');return JSON.stringify(k)+':'+bwCanonical(value[k]);}).join(',')+'}';throw Error('invalid-request');}
function bwBytes(text){return Utilities.newBlob(text).getBytes().length;}
function bwHex(bytes){return bytes.map(function(b){return ('0'+((b+256)%256).toString(16)).slice(-2);}).join('');}
function bwSha(text){return bwHex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,text,Utilities.Charset.UTF_8));}
function bwHmac(text,secret){return bwHex(Utilities.computeHmacSha256Signature(text,secret,Utilities.Charset.UTF_8));}
function bwEqual(a,b){if(a.length!==b.length)return false;var diff=0;for(var i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0;}
function bwResponse(request,secret,ok,result){var message=bwCanonical({version:1,keyId:request.keyId,requestId:request.requestId,action:request.action,ok:ok,result:result}),text=JSON.stringify({message:message,signature:bwHmac(message,secret)});if(bwBytes(text)>BW_RESPONSE_BYTES)throw Error('capacity');return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);}

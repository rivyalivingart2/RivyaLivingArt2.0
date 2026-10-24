/* LOCAL SOURCE ONLY. No deployment or trigger is installed by this repository.
 * Enable the advanced Sheets v4 service only in an owner-approved isolated script.
 * Script properties: GW_KEYS_JSON (keyId -> signing secret), GW_RESOURCES_JSON
 * (resourceKey -> immutable registration). Never store them in source or Sheets.
 * Canonical ranges must be editable only by this writer identity. ScriptLock does
 * not exclude owners/unrelated API clients; those edits require reconciliation.
 */
function doPost(event) {
  var request, secret, authenticated=false;
  try {
    var text = event && event.postData && event.postData.contents;
    if (typeof text !== 'string' || text.length > 2000000) throw new Error('invalid-request');
    var envelope = JSON.parse(text);
    gwExact(envelope, ['message','signature']);
    if (typeof envelope.message !== 'string' || !/^[a-f0-9]{64}$/.test(envelope.signature)) throw new Error('invalid-request');
    request = JSON.parse(envelope.message);
    gwExact(request, ['version','keyId','requestId','issuedAt','expiresAt','action','payload']);
    var keys = JSON.parse(PropertiesService.getScriptProperties().getProperty('GW_KEYS_JSON') || '{}');
    secret = Object.prototype.hasOwnProperty.call(keys, request.keyId) ? keys[request.keyId] : null;
    if (typeof secret !== 'string' || !/^[a-f0-9]{64,128}$/.test(secret) || !gwEqual(gwHmac(envelope.message, secret), envelope.signature)) throw new Error('unauthorized');
    authenticated=true;
    var now = Date.now();
    if (request.version !== 1 || !/^[A-Za-z0-9_-]{16,100}$/.test(request.requestId) || !Number.isSafeInteger(request.issuedAt) || !Number.isSafeInteger(request.expiresAt) || request.issuedAt > now + 5000 || request.expiresAt <= now || request.expiresAt - request.issuedAt !== 30000 || ['read','commit'].indexOf(request.action) < 0 || gwCanonical(request) !== envelope.message) throw new Error('invalid-request');
    var resources = JSON.parse(PropertiesService.getScriptProperties().getProperty('GW_RESOURCES_JSON') || '{}');
    var key = request.payload && request.payload.resourceKey;
    if (!Object.prototype.hasOwnProperty.call(resources, key)) throw new Error('not-registered');
    var resource = resources[key];
    gwRegistration(resource, key);
    Object.keys(resources).forEach(function(otherKey) {
      var other=resources[otherKey];gwRegistration(other,otherKey);
      if(other.workbookId===resource.workbookId && other.controlSheetId!==resource.controlSheetId) throw new Error('configuration');
    });
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(5000)) throw new Error('busy');
    var result;
    try {
      // Read and CAS use the SAME script-wide lock. No lock crosses HTTP calls.
      result = request.action === 'read' ? gwRead(resource) : gwCommit(resource, request.payload);
    } finally { lock.releaseLock(); }
    return gwResponse(request, secret, true, result);
  } catch (error) {
    // Do not reflect provider diagnostics, credentials, URLs, or request payloads.
    if (authenticated && request && secret && typeof request.requestId === 'string') return gwResponse(request, secret, false, {code:error && error.message === 'outcome-unknown' ? 'outcome-unknown' : 'unavailable'});
    return ContentService.createTextOutput('{"error":"unauthorized"}').setMimeType(ContentService.MimeType.JSON);
  }
}

function gwRegistration(r, key) {
  if (!r || r.key !== key || !/^[A-Za-z0-9_-]{10,160}$/.test(r.workbookId) || !Number.isSafeInteger(r.maxRows) || r.maxRows < 2 || r.maxRows > 10000 || !Number.isSafeInteger(r.maxColumns) || r.maxColumns < 7 || r.maxColumns > 32) throw new Error('configuration');
  var ids = gwSheetIds(r).concat([r.controlSheetId]);
  if (ids.some(function(id) {return !Number.isSafeInteger(id) || id < 0;}) || new Set(ids).size !== ids.length) throw new Error('configuration');
}
function gwSheetIds(r) {return [r.recordSheetId,r.ledgerSheetId,r.auditSheetId,r.historySheetId].concat(r.relationshipSheetIds || []).sort(function(a,b){return a-b;});}
function gwRead(r) {
  var ids = gwSheetIds(r).concat([r.controlSheetId]);
  var properties = Sheets.Spreadsheets.get(r.workbookId, {fields:'spreadsheetId,sheets(properties(sheetId,title,gridProperties))'});
  if (properties.spreadsheetId !== r.workbookId) throw new Error('invalid-state');
  var selected = ids.map(function(id) {
    var sheet = properties.sheets.filter(function(s){return s.properties.sheetId === id;})[0];
    var p = sheet && sheet.properties;
    if (!p || !p.gridProperties || p.gridProperties.rowCount > r.maxRows || p.gridProperties.columnCount > r.maxColumns) throw new Error('capacity');
    return p;
  });
  var ranges = selected.map(function(p) {return "'" + p.title.replace(/'/g,"''") + "'!A1:" + gwColumn(p.gridProperties.columnCount) + p.gridProperties.rowCount;});
  var data = Sheets.Spreadsheets.get(r.workbookId, {includeGridData:true,ranges:ranges,fields:'spreadsheetId,sheets(properties(sheetId),data(startRow,startColumn,rowData(values(userEnteredValue,effectiveValue))))'});
  if (data.spreadsheetId !== r.workbookId || !Array.isArray(data.sheets) || data.sheets.length !== ids.length) throw new Error('invalid-state');
  var sheets = ids.map(function(id) {
    var sheet = data.sheets.filter(function(s){return s.properties.sheetId === id;})[0];
    if (!sheet || !Array.isArray(sheet.data) || sheet.data.length !== 1 || (sheet.data[0].startRow || 0) !== 0 || (sheet.data[0].startColumn || 0) !== 0) throw new Error('invalid-state');
    var rows = (sheet.data[0].rowData || []).map(function(row){return row.values || [];});
    gwNormalize(rows); // Reject formulas/coercion before returning any snapshot.
    return {sheetId:id,complete:true,rows:rows};
  });
  // The control sheet is private coordinator state, outside the record snapshot.
  var control = sheets.filter(function(s){return s.sheetId === r.controlSheetId;})[0];
  gwControl(control);
  return {workbookId:r.workbookId,sheets:sheets.filter(function(s){return s.sheetId !== r.controlSheetId;})};
}

function gwControlRead(r) {
  var p = Sheets.Spreadsheets.get(r.workbookId,{fields:'sheets(properties(sheetId,title))'}).sheets.filter(function(s){return s.properties.sheetId === r.controlSheetId;})[0];
  if (!p) throw new Error('invalid-state');
  var value = Sheets.Spreadsheets.get(r.workbookId,{includeGridData:true,ranges:["'" + p.properties.title.replace(/'/g,"''") + "'!A1:A1"],fields:'sheets(data(rowData(values(userEnteredValue,effectiveValue))))'});
  var rows = value.sheets[0].data[0].rowData || [];
  return gwControl({rows:rows.map(function(row){return row.values || [];})});
}
function gwControl(sheet) {
  var rows = gwNormalize(sheet.rows);
  if (rows.length !== 1 || rows[0].length !== 1) throw new Error('invalid-state');
  var value = JSON.parse(rows[0][0]);
  gwExact(value,['format','state','mutationId','requestSha256','actorId']);
  if (value.format !== 'rivya-writer-gate-v1' || ['ready','inflight','committed'].indexOf(value.state) < 0 || gwCanonical(value) !== rows[0][0]) throw new Error('invalid-state');
  return value;
}
function gwCommit(r, plan) {
  gwExact(plan,['schemaVersion','resourceKey','workbookId','mutationId','requestSha256','actorId','guards','batch','receipt','commitBefore']);
  if (plan.schemaVersion !== 1 || plan.resourceKey !== r.key || plan.workbookId !== r.workbookId || typeof plan.mutationId !== 'string' || !/^[a-f0-9]{64}$/.test(plan.requestSha256)) throw new Error('invalid-request');
  gwExact(plan.batch,['requests']);
  var requests = plan.batch.requests;
  var writeIds = [r.recordSheetId,r.ledgerSheetId,r.auditSheetId,r.historySheetId];
  if (!Array.isArray(requests) || requests.length !== 4) throw new Error('invalid-request');
  requests.forEach(function(request,index) {
    gwExact(request,['updateCells']); var update=request.updateCells;
    gwExact(update,['start','rows','fields']); gwExact(update.start,['sheetId','rowIndex','columnIndex']);
    if (update.start.sheetId !== writeIds[index] || !Number.isSafeInteger(update.start.rowIndex) || update.start.rowIndex < 1 || update.start.rowIndex >= r.maxRows || update.start.columnIndex !== 0 || update.fields !== 'userEnteredValue' || !Array.isArray(update.rows) || update.rows.length !== 1) throw new Error('invalid-request');
    gwExact(update.rows[0],['values']);
    var cells=update.rows[0].values;
    if (!Array.isArray(cells) || !cells.length || cells.length > r.maxColumns) throw new Error('invalid-request');
    cells.forEach(function(cell){gwExact(cell,['userEnteredValue']);gwExact(cell.userEnteredValue,['stringValue']);if(typeof cell.userEnteredValue.stringValue !== 'string' || cell.userEnteredValue.stringValue.length > 45000) throw new Error('invalid-request');});
  });
  var snapshot = gwRead(r), control = gwControlRead(r);
  var expectedIds=gwSheetIds(r);
  if (!Array.isArray(plan.guards) || plan.guards.length !== expectedIds.length || plan.guards.some(function(g,i){return g.sheetId !== expectedIds[i];})) throw new Error('invalid-request');
  var normalized = snapshot.sheets.map(function(sheet){return {sheetId:sheet.sheetId,rows:gwNormalize(sheet.rows)};});
  var ledger=normalized.filter(function(s){return s.sheetId === r.ledgerSheetId;})[0].rows;
  var plannedLedger=requests[1].updateCells.rows[0].values.map(function(c){return c.userEnteredValue.stringValue;});
  var previous=ledger.slice(1).filter(function(row){return row[0] === plan.mutationId;});
  if (previous.length) {
    if (control.state === 'inflight') throw new Error('outcome-unknown');
    // Same command prepared at another time has a different proposed committedAt.
    // Ask the server to reread/validate the ORIGINAL receipt and complete history;
    // never substitute this plan's new receipt for that stored result.
    if (previous.length !== 1 || JSON.stringify(previous[0]) !== JSON.stringify(plannedLedger)) return {status:'conflict'};
    return {status:'replay',receipt:plan.receipt};
  }
  if (control.state === 'inflight') throw new Error('outcome-unknown');
  if (plan.commitBefore !== null && (!Number.isSafeInteger(plan.commitBefore) || Date.now() >= plan.commitBefore)) return {status:'conflict'};
  var conflict=normalized.some(function(sheet) {
    var guard=plan.guards.filter(function(g){return g.sheetId===sheet.sheetId;})[0];
    var width=sheet.rows.reduce(function(n,row){return Math.max(n,row.length);},0);
    return guard.sha256 !== gwSha(JSON.stringify(sheet.rows)) || guard.rowCount !== sheet.rows.length || guard.columnCount !== width;
  });
  if (conflict) return {status:'conflict'};
  var marker={format:'rivya-writer-gate-v1',state:'inflight',mutationId:plan.mutationId,requestSha256:plan.requestSha256,actorId:plan.actorId};
  // Persist uncertainty BEFORE dispatch. If either request loses its response,
  // no unrelated write may pass this gate. Never retry a Sheets batch blindly.
  try { Sheets.Spreadsheets.batchUpdate({requests:[gwControlWrite(r,marker)]},r.workbookId); }
  catch (error) {throw new Error('outcome-unknown');}
  if (plan.commitBefore !== null && Date.now() >= plan.commitBefore) throw new Error('outcome-unknown');
  marker.state='committed';
  try { Sheets.Spreadsheets.batchUpdate({requests:requests.concat([gwControlWrite(r,marker)])},r.workbookId); }
  catch (error) {throw new Error('outcome-unknown');}
  return {status:'committed',receipt:plan.receipt};
}
function gwControlWrite(r,value){return {updateCells:{start:{sheetId:r.controlSheetId,rowIndex:0,columnIndex:0},rows:[{values:[{userEnteredValue:{stringValue:gwCanonical(value)}}]}],fields:'userEnteredValue'}};}
function gwNormalize(rows) {
  var result=rows.map(function(row) {
    var values=row.map(function(cell) {
      var raw=cell.userEnteredValue || {}, effective=cell.effectiveValue || {};
      if (!Object.keys(raw).length && !Object.keys(effective).length) return '';
      if (Object.keys(raw).length === 1 && raw.stringValue === '' && !Object.keys(effective).length) return '';
      if (Object.keys(raw).length !== 1 || Object.keys(effective).length !== 1 || typeof raw.stringValue !== 'string' || effective.stringValue !== raw.stringValue) throw new Error('invalid-state');
      return raw.stringValue;
    });
    return values;
  });
  while(result.length && result[result.length-1].every(function(v){return v==='';})) result.pop();
  if (!result.length) return [];
  var width=result[0].length;
  while(width && result[0][width-1] === '') width--;
  if(result[0].slice(0,width).some(function(v){return v==='';})) throw new Error('invalid-state');
  result=result.map(function(row) {
    if(row.slice(width).some(function(v){return v!=='';})) throw new Error('invalid-state');
    var normalized=row.slice(0,width);while(normalized.length<width)normalized.push('');return normalized;
  });
  return result;
}
function gwColumn(n){var text='';while(n>0){n--;text=String.fromCharCode(65+n%26)+text;n=Math.floor(n/26);}return text;}
function gwExact(value,keys){if(!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).sort().join('|') !== keys.slice().sort().join('|')) throw new Error('invalid-request');}
function gwCanonical(value) {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' && Number.isFinite(value)) return Object.is(value,-0)?'-0':JSON.stringify(value);
  if (Array.isArray(value)) return '['+value.map(gwCanonical).join(',')+']';
  if (value && typeof value === 'object') return '{'+Object.keys(value).sort().map(function(key){if(['__proto__','prototype','constructor'].indexOf(key)>=0)throw new Error('invalid-request');return JSON.stringify(key)+':'+gwCanonical(value[key]);}).join(',')+'}';
  throw new Error('invalid-request');
}
function gwHex(bytes){return bytes.map(function(b){return ('0'+((b+256)%256).toString(16)).slice(-2);}).join('');}
function gwSha(text){return gwHex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,text,Utilities.Charset.UTF_8));}
function gwHmac(text,secret){return gwHex(Utilities.computeHmacSha256Signature(text,secret,Utilities.Charset.UTF_8));}
function gwEqual(a,b){if(a.length!==b.length)return false;var diff=0;for(var i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0;}
function gwResponse(request,secret,ok,result){var message=gwCanonical({version:1,keyId:request.keyId,requestId:request.requestId,action:request.action,ok:ok,result:result});return ContentService.createTextOutput(JSON.stringify({message:message,signature:gwHmac(message,secret)})).setMimeType(ContentService.MimeType.JSON);}

import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createHash,createHmac} from 'node:crypto';
import {RECORD_COLUMNS,canonicalArtifactJson} from '../../src/lib/google-workspace/record-codec.ts';
import {LEDGER_COLUMNS,AUDIT_COLUMNS,HISTORY_COLUMNS} from '../../src/lib/google-workspace/controlled-writer.ts';

/** DISPOSABLE provider emulator; never used by the app or a durable job backend.
 * It executes the exact Apps Script source with literal-grid and atomic-batch
 * emulation. Google auth, permissions, quota and timing remain separate gates. */
export function gatewayHarness() {
  const resource={key:'documents',workbookId:'local_fixture_workbook',recordSheetId:1,ledgerSheetId:2,auditSheetId:3,historySheetId:4};
  const registration={...resource,controlSheetId:5,maxRows:100,maxColumns:12};
  const secret='ab'.repeat(32), endpoint='https://script.google.com/macros/s/local_fixture_gateway/exec';
  const literal=value=>({userEnteredValue:{stringValue:value},effectiveValue:{stringValue:value}});
  const headers=[RECORD_COLUMNS,LEDGER_COLUMNS,AUDIT_COLUMNS,HISTORY_COLUMNS];
  const state={now:Date.parse('2026-10-24T12:00:00.000Z'),batches:0,locks:0,held:false,fault:null,pending:null,
    sheets:new Map(headers.map((columns,i)=>[i+1,[[...columns].map(literal)]]))};
  state.sheets.set(5,[[literal(canonicalArtifactJson({format:'rivya-writer-gate-v1',state:'ready',mutationId:null,requestSha256:null,actorId:null}))]]);
  const apply=requests=>{
    const next=structuredClone(state.sheets);
    for(const request of requests){
      const update=request.updateCells;if(!update)throw new Error('unsupported fixture operation');
      const rows=next.get(update.start.sheetId);if(!rows)throw new Error('unknown fixture sheet');
      for(let offset=0;offset<update.rows.length;offset++){
        const index=update.start.rowIndex+offset;while(rows.length<=index)rows.push([]);
        rows[index]=update.rows[offset].values.map(cell=>literal(cell.userEnteredValue.stringValue));
      }
    }
    state.sheets=next;
  };
  let context;
  const restart=()=>{
    context=vm.createContext({Date:class extends Date {static now(){return state.now;}},
      PropertiesService:{getScriptProperties:()=>({getProperty:key=>key==='GW_KEYS_JSON'?JSON.stringify({test:secret}):JSON.stringify({documents:registration})})},
      LockService:{getScriptLock:()=>({tryLock(){if(state.held)return false;state.held=true;state.locks++;return true;},releaseLock(){state.held=false;}})},
      Utilities:{DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},computeDigest:(_,text)=>Array.from(createHash('sha256').update(text).digest()),computeHmacSha256Signature:(text,key)=>Array.from(createHmac('sha256',key).update(text).digest())},
      ContentService:{MimeType:{JSON:'application/json'},createTextOutput:text=>({text,setMimeType(){return this;}})},
      Sheets:{Spreadsheets:{
        get(workbook,options){
          if(workbook!==resource.workbookId)throw new Error('unregistered fixture workbook');
          if(!options.includeGridData)return {spreadsheetId:workbook,sheets:[...state.sheets.keys()].map(id=>({properties:{sheetId:id,title:'sheet_'+id,gridProperties:{rowCount:100,columnCount:12}}}))};
          return {spreadsheetId:workbook,sheets:options.ranges.map(range=>{
            const id=Number(/sheet_(\d+)/.exec(range)[1]);
            return {properties:{sheetId:id},data:[{startRow:0,startColumn:0,rowData:structuredClone(state.sheets.get(id)).map(values=>({values}))}]};
          })};
        },
        batchUpdate(body,workbook){
          if(workbook!==resource.workbookId||!state.held)throw new Error('write outside lock');
          state.batches++;const action=state.fault?.(state.batches,body.requests);
          if(action==='reject')throw new Error('untrusted provider diagnostic');
          if(action==='pending'){state.pending=structuredClone(body.requests);throw new Error('response unknown');}
          apply(body.requests);if(action==='lost')throw new Error('response lost');
          return {};
        },
      }},
    });
    vm.runInContext(readFileSync(new URL('../../tools/google-workspace/apps-script/Writer.gs',import.meta.url),'utf8'),context);
  };
  restart();
  return {resource,registration,secret,endpoint,state,restart,literal,apply,
    post:body=>context.doPost({postData:{contents:body}}).text,
    fetch:async(url,init)=>{
      if(url!==endpoint||init?.method!=='POST')throw new Error('fixture prevents network access');
      return new Response(context.doPost({postData:{contents:init.body}}).text,{status:200,headers:{'Content-Type':'application/json'}});
    },
  };
}

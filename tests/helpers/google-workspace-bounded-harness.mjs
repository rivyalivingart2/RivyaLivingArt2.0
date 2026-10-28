import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createHash,createHmac} from 'node:crypto';
import {buildBoundedState,encodeBoundedMetadata,validateBoundedLayout,createBoundedProvider} from '../../src/lib/google-workspace/bounded-store.ts';
import {createWriterGateway} from '../../src/lib/google-workspace/writer-gateway.ts';
import {canonicalArtifactJson} from '../../src/lib/google-workspace/record-codec.ts';

/** LOCAL EMULATOR ONLY. Executes the exact saved Apps Script source. Provider
 * permissions, service quotas, execution interruption and durability are unproven.
 * Unlike the v1 fixture, every get slices only the requested rows and columns. */
export const boundedFixtureLayout={protocol:'rivya-bounded-v2',key:'bounded_fixture',workbookId:'local_bounded_fixture_workbook',rootSheetId:1,metadataSheetId:2,dataSheetId:3,maxPages:512,maxMetadataChunks:64};
export function boundedGatewayHarness(initialState,layoutInput=boundedFixtureLayout) {
  const layout=validateBoundedLayout(layoutInput),initial=initialState??buildBoundedState({layout,epoch:'local-fixture-epoch',plans:[]});
  const secret='cd'.repeat(32),endpoint='https://script.google.com/macros/s/local_bounded_fixture_gateway/exec';
  const literal=value=>({userEnteredValue:{stringValue:value},effectiveValue:{stringValue:value}});
  const state={now:Date.parse('2026-10-28T12:00:00.000Z'),batches:0,held:false,locks:0,fault:null,pending:null,reads:[],requests:[],sheets:new Map()};
  state.sheets.set(layout.rootSheetId,[[literal(canonicalArtifactJson(initial.root))]]);
  state.sheets.set(layout.metadataSheetId,encodeBoundedMetadata(initial.manifest,layout).map(chunk=>[literal(chunk)]));
  const data=[];for(const page of initial.pages){for(let row=0;row<page.rows.length;row++)data[page.id*8+row]=page.rows[row].map(literal);}state.sheets.set(layout.dataSheetId,data);
  const apply=requests=>{
    const next=structuredClone(state.sheets);
    for(const request of requests){const u=request.updateCells;if(!u||u.start.columnIndex!==0||u.fields!=='userEnteredValue')throw Error('fixture only supports registered fixed-cell writes');const rows=next.get(u.start.sheetId);if(!rows)throw Error('unknown fixture sheet');
      for(let i=0;i<u.rows.length;i++)rows[u.start.rowIndex+i]=Array.from(u.rows[i].values,v=>literal(v.userEnteredValue.stringValue));}
    state.sheets=next;
  };
  let context,nonce=0;
  const dimensions=new Map([[layout.rootSheetId,{rowCount:1,columnCount:1}],[layout.metadataSheetId,{rowCount:layout.maxMetadataChunks,columnCount:1}],[layout.dataSheetId,{rowCount:layout.maxPages*8,columnCount:7}]]);
  const restart=()=>{
    state.held=false;
    context=vm.createContext({Date:class extends Date{static now(){return state.now;}},
      PropertiesService:{getScriptProperties:()=>({getProperty:key=>key==='GW_KEYS_JSON'?JSON.stringify({test:secret}):key==='GW_BOUNDED_RESOURCES_JSON'?JSON.stringify({[layout.key]:layout}):null})},
      LockService:{getScriptLock:()=>({tryLock(){if(state.held)return false;state.held=true;state.locks++;return true;},releaseLock(){state.held=false;}})},
      Utilities:{DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},newBlob:text=>({getBytes:()=>Array.from(Buffer.from(text))}),computeDigest:(_,text)=>Array.from(createHash('sha256').update(text).digest()),computeHmacSha256Signature:(text,key)=>Array.from(createHmac('sha256',key).update(text).digest())},
      ContentService:{MimeType:{JSON:'application/json'},createTextOutput:text=>({text,setMimeType(){return this;}})},
      Sheets:{Spreadsheets:{
        get(workbook,options){
          if(workbook!==layout.workbookId)throw Error('unregistered fixture workbook');
          if(!options.includeGridData)return {spreadsheetId:workbook,sheets:[...state.sheets.keys()].map(id=>({properties:{sheetId:id,title:'sheet_'+id,gridProperties:dimensions.get(id)}}))};
          return {spreadsheetId:workbook,sheets:options.ranges.map(range=>{
            const match=/^'sheet_(\d+)'!A(\d+):([A-Z]+)(\d+)$/.exec(range);if(!match)throw Error('fixture rejects unbounded range');
            const id=Number(match[1]),startRow=Number(match[2])-1,endRow=Number(match[4]),width=[...match[3]].reduce((n,c)=>n*26+c.charCodeAt(0)-64,0),allocation=dimensions.get(id);
            if(!allocation||startRow<0||endRow>allocation.rowCount||width>allocation.columnCount||endRow<=startRow)throw Error('range exceeds registered fixture allocation');
            const grid=state.sheets.get(id),rows=[];for(let i=startRow;i<endRow;i++)rows.push({values:structuredClone((grid[i]??[]).slice(0,width))});while(rows.length&&!rows.at(-1).values.length)rows.pop();
            state.reads.push({sheetId:id,startRow,rows:endRow-startRow,columns:width,returnedRows:rows.length,cells:rows.reduce((n,row)=>n+row.values.length,0),characters:JSON.stringify(rows).length});
            return {properties:{sheetId:id},data:[{startRow,startColumn:0,rowData:rows}]};
          })};
        },
        batchUpdate(body,workbook){
          if(workbook!==layout.workbookId||!state.held)throw Error('write outside fixture lock');state.batches++;state.requests.push(structuredClone(body.requests));
          const action=state.fault?.(state.batches,body.requests);
          if(action==='reject')throw Error('fixture rejected before applying');if(action==='pending'){state.pending=structuredClone(body.requests);throw Error('fixture unknown result');}
          apply(body.requests);if(action==='lost')throw Error('fixture response lost');return {};
        },
      }},
    });
    vm.runInContext(readFileSync(new URL('../../tools/google-workspace/apps-script/BoundedWriter.gs',import.meta.url),'utf8'),context);
  };
  restart();
  const post=body=>context.doPost({postData:{contents:body}}).text;
  const fetch=async(url,init)=>{if(url!==endpoint||init?.method!=='POST')throw Error('fixture prohibits network');return new Response(post(init.body),{status:200,headers:{'Content-Type':'application/json'}});};
  const gateway=createWriterGateway({endpoint,keyId:'test',secret},{fetch,now:()=>state.now,nonce:()=>`bounded_fixture_request_${String(++nonce).padStart(16,'0')}`});
  const snapshot=()=>{const root=JSON.parse(state.sheets.get(layout.rootSheetId)[0][0].userEnteredValue.stringValue),chunks=state.sheets.get(layout.metadataSheetId).slice(0,root.metadataChunks).map(row=>row[0].userEnteredValue.stringValue),manifest=JSON.parse(chunks.join(''));return {root,manifest,pages:manifest.pages.map((d,id)=>({id,rows:Array.from({length:d[1]},(_,row)=>state.sheets.get(layout.dataSheetId)[id*8+row].slice(0,d[0]==='l'?6:d[0]==='a'?5:7).map(c=>c.userEnteredValue.stringValue))}))};};
  return {layout,secret,endpoint,state,post,fetch,gateway,provider:createBoundedProvider(gateway,layout),literal,apply,restart,snapshot};
}

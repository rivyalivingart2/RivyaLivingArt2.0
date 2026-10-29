import {RECORD_COLUMNS} from '../../src/lib/google-workspace/record-codec.ts';

const nestedBytes=value=>Buffer.byteLength(JSON.stringify(JSON.stringify(value)),'utf8');
const emptyCellOverhead=nestedBytes({userEnteredValue:{stringValue:''},effectiveValue:{stringValue:''}})-nestedBytes({});
/** Sheets can omit both values for blank cells. Only the two timestamp/archive
 * fields may be blank in a migration record. Subtract BOTH possible omissions
 * for EVERY record/history row, even when a timestamp is populated. */
export function conservativeSignedWireLowerBound(representedBytes,inlineRows){
  if(!Number.isSafeInteger(representedBytes)||representedBytes<0||!Number.isSafeInteger(inlineRows)||inlineRows<0)throw Error('INVALID_CAPACITY_INPUT');
  return Math.max(0,representedBytes-4*inlineRows*emptyCellOverhead);
}

/** Source-derived lower bounds only. No target IDs, artificial records or writes. */
export function createSourceCapacityMeasurement() {
  const groups=new Map(['content','operations','security','system'].map(key=>[key,{rows:[],sourceRows:0,documents:0,documentBytes:0,documentCharacters:0}]));
  return {
    observe(table,plans) {
      const group=groups.get(table.workbook);
      if(!group || !Array.isArray(plans))throw Error('INVALID_CAPACITY_INPUT');
      for(const plan of plans){
        group.sourceRows++;
        if(plan.disposition==='inline'){
          if(!Array.isArray(plan.cells)||plan.cells.length!==RECORD_COLUMNS.length||plan.cells.some(x=>typeof x!=='string')||[0,1,2,3,6].some(i=>plan.cells[i]===''))throw Error('INVALID_CAPACITY_INPUT');
          group.rows.push(plan.cells);
        }else if(plan.disposition==='drive-artifact-required'){
          if(!Number.isSafeInteger(plan.bytes)||plan.bytes<0||!Number.isSafeInteger(plan.characters)||plan.characters<0||plan.driveFileId!==null)throw Error('INVALID_CAPACITY_INPUT');
          group.documents++;group.documentBytes+=plan.bytes;group.documentCharacters+=plan.characters;
        }else throw Error('INVALID_CAPACITY_INPUT');
      }
    },
    finish() {
      return {kind:'measured-source-encoding-lower-bounds',wireBasis:'conservative-blank-metadata-v1',targetWrites:0,rawRowsPersisted:0,providerVerified:false,
        excludedFromBounds:['large-document reference records (no actual target IDs exist)','ledger and audit rows','control and registration wrappers','existing sandbox probes','future history growth'],
        workbooks:[...groups].map(([workbook,g])=>{
          const rows=[Array.from(RECORD_COLUMNS),...g.rows];
          const normalizedCharacters=2*JSON.stringify(rows).length;
          const wireRows=rows.map(row=>row.map(value=>({userEnteredValue:{stringValue:value},effectiveValue:{stringValue:value}})));
          // Both record and initial-history arrays occur inside a signed JSON message.
          const representedBytes=2*(nestedBytes(wireRows)-2);
          const signedResponseBytes=conservativeSignedWireLowerBound(representedBytes,g.rows.length);
          return {workbook,sourceRows:g.sourceRows,measuredInlineRows:g.rows.length,unmaterializedDocuments:g.documents,documentPayloadBytes:g.documentBytes,documentPayloadCharacters:g.documentCharacters,
            recordAndInitialHistoryCharactersLowerBound:normalizedCharacters,signedResponseBytesWithExplicitEmptyCells:representedBytes,signedResponseBytesLowerBound:signedResponseBytes,
            exceedsDefaultSnapshotCharacters:normalizedCharacters>2*1024*1024,exceedsMaximumSnapshotCharacters:normalizedCharacters>8*1024*1024,
            exceedsDefaultGatewayBytes:signedResponseBytes>6000000,exceedsMaximumGatewayBytes:signedResponseBytes>8000000};
        })};
    },
  };
}

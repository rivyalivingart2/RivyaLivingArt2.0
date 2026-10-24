import test from 'node:test';
import assert from 'node:assert/strict';
import {subscriberFilters,subscriberParams,subscriberCsv,subscriberCsvCell} from '../src/lib/subscriber-model.ts';
test('subscriber filters default and round-trip without changing literal search characters',()=>{
 const initial=subscriberFilters(new URLSearchParams());assert.deepEqual(initial,{q:'',source:'',from:'',to:'',sort:'newest',page:1});
 const value={q:'person+%_@example.invalid',source:'journal',from:'2024-02-29',to:'2026-10-24',sort:'email',page:3};
 assert.deepEqual(subscriberFilters(subscriberParams(value)),value);
});
test('subscriber filters reject invalid dates, ranges, page numbers and source values',()=>{
 for(const query of ['from=2026-02-29','from=2026-04-31','from=2026-10-24&to=2026-10-23','page=0','page=-1','page=1.5','page=10000000','source=import','sort=sql','q=%00', 'q='+ 'a'.repeat(255)])assert.equal(subscriberFilters(new URLSearchParams(query)),null,query);
});
test('CSV neutralizes spreadsheet formulas including whitespace-prefixed payloads',()=>{
 for(const value of ['=1+1@example.invalid','+cmd@example.invalid','-1@example.invalid','@formula','  =SUM(1)','\tformula','\rformula'])assert.equal(subscriberCsvCell(value)[1],"'");
 assert.equal(subscriberCsvCell('normal@example.invalid'),'"normal@example.invalid"');
 assert.equal(subscriberCsvCell('a,"b"\nc'),'"a,""b""\nc"');
});
test('CSV preserves captured values and dates without fabricating consent fields',()=>{
 const csv=subscriberCsv([{email:'=test@example.invalid',source:'journal',createdAt:'2026-10-24T12:00:00.000Z'}]);
 assert.equal(csv,'\uFEFFEmail,Source,Subscribed (UTC)\r\n"\'=test@example.invalid","journal","2026-10-24T12:00:00.000Z"\r\n');
 assert.equal(subscriberCsv([]),'\uFEFFEmail,Source,Subscribed (UTC)\r\n');
});

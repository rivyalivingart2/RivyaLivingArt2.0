import test from 'node:test';
import assert from 'node:assert/strict';
import {retentionDecision} from '../src/lib/retention-policy.ts';
const inquiry={lastContactAt:'2026-01-01T00:00:00Z',closedAt:null,becameOrder:false,ongoingFollowUp:false,holdReason:''};
test('unconverted inquiry becomes due exactly 90 days after meaningful contact',()=>{
 assert.equal(retentionDecision(inquiry,new Date('2026-03-31T23:59:59Z')).canEraseInquiry,false);
 assert.equal(retentionDecision(inquiry,new Date('2026-04-01T00:00:00Z')).canEraseInquiry,true);
 assert.equal(retentionDecision({...inquiry,lastContactAt:'2026-03-01T00:00:00Z'},new Date('2026-04-01T00:00:00Z')).canEraseInquiry,false);
});
test('open accepted order is not erased under inquiry-only retention',()=>{
 const d=retentionDecision({...inquiry,becameOrder:true},new Date('2027-01-01T00:00:00Z'));
 assert.equal(d.canEraseInquiry,false);assert.equal(d.canEraseReferences,false);assert.equal(d.blocked,'Open order');
});
test('closed order keeps records twelve calendar months and references ninety days',()=>{
 const r={...inquiry,becameOrder:true,closedAt:'2026-01-31T10:00:00Z'};
 const d=retentionDecision(r,new Date('2026-05-01T10:00:00Z'));
 assert.equal(d.canEraseReferences,true);assert.equal(d.canEraseInquiry,false);assert.equal(d.inquiryDueAt,'2027-01-31T10:00:00.000Z');
});
test('leap-day closure uses the calendar-year anniversary without rolling into March',()=>{
 assert.equal(retentionDecision({...inquiry,becameOrder:true,closedAt:'2024-02-29T10:00:00Z'}).inquiryDueAt,'2025-02-28T10:00:00.000Z');
});
test('legal hold and requested follow-up each prevent policy deletion',()=>{
 for(const r of [{...inquiry,holdReason:'Active complaint'},{...inquiry,ongoingFollowUp:true}]){const d=retentionDecision(r,new Date('2030-01-01'));assert.equal(d.canEraseInquiry,false);assert.equal(d.canEraseReferences,false);assert.ok(d.blocked);}
});
test('invalid dates fail closed rather than making a record eligible',()=>{
 assert.throws(()=>retentionDecision({...inquiry,lastContactAt:'invalid'}),RangeError);
 assert.throws(()=>retentionDecision({...inquiry,closedAt:'invalid'}),RangeError);
});

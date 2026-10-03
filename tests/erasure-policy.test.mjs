import test from 'node:test';
import assert from 'node:assert/strict';
import {canErasePersonalData} from '../src/lib/erasure-policy.ts';
const now=new Date('2026-10-03T00:00:00Z'),record={lastContactAt:'2026-10-01T00:00:00Z',closedAt:null,becameOrder:false,ongoingFollowUp:false,holdReason:'',deletionRequestedAt:'2026-10-02T00:00:00Z',identityVerifiedAt:'2026-10-02T01:00:00Z'};
test('verified request cannot bypass hold, ongoing contact or an open order',()=>{
 assert.equal(canErasePersonalData(record,'customer_request',now),true);
 for(const blocked of [{holdReason:'Review remains due'},{ongoingFollowUp:true},{becameOrder:true},{erasedAt:'2026-10-02T02:00:00Z'}])assert.equal(canErasePersonalData({...record,...blocked},'customer_request',now),false);
});
test('customer request requires both recorded request and verified identity',()=>{
 for(const missing of [{deletionRequestedAt:null},{identityVerifiedAt:null}])assert.equal(canErasePersonalData({...record,...missing},'customer_request',now),false);
});
test('retention expiry never borrows eligibility from an early verified request',()=>{
 assert.equal(canErasePersonalData(record,'retention_expiry',now),false);
 const expired={...record,lastContactAt:'2026-01-01T00:00:00Z',deletionRequestedAt:null,identityVerifiedAt:null};
 assert.equal(canErasePersonalData(expired,'retention_expiry',now),true);
 assert.equal(canErasePersonalData({...expired,holdReason:'Hold'},'retention_expiry',now),false);
});

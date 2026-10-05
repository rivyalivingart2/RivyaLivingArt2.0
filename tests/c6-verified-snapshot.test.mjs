import {test} from 'node:test';
import assert from 'node:assert/strict';
import {verifiedSnapshot} from '../src/lib/verified-snapshot.ts';

test('each warm request validates current publication; updates and withdrawals are immediate',async()=>{
 let state={identity:'a',value:{products:['piece'],media:['image'],title:'Published'}},reads=0,checks=0;
 const read=verifiedSnapshot(async()=>{reads++;return structuredClone(state);},async()=>{checks++;return state.identity;});
 const first=await read();first.products.push('accidental caller edit');
 assert.deepEqual((await read()).products,['piece']);assert.equal(reads,1);assert.equal(checks,1);
 for(const next of [{identity:'b',value:{products:['piece'],media:['image'],title:'New publication'}},{identity:'c',value:{products:[],media:['image'],title:'New publication'}},{identity:'d',value:{products:[],media:[],title:'New publication'}}]){
  state=next;assert.deepEqual(await read(),next.value);
 }
 assert.equal(reads,4);assert.equal(checks,4);
});

test('storage errors never serve an earlier successful snapshot or poison a retry',async()=>{
 let identity='a',failIdentity=false,failRead=false;
 const read=verifiedSnapshot(async()=>{if(failRead)throw Error('read failed');return {identity,value:{identity}};},async()=>{if(failIdentity)throw Error('validation failed');return identity;});
 await read();failIdentity=true;await assert.rejects(read,/validation failed/);
 failIdentity=false;identity='b';failRead=true;await assert.rejects(read,/read failed/);
 failRead=false;assert.deepEqual(await read(),{identity:'b'});
});

test('a publication between validation and fetch uses the actual atomic snapshot identity',async()=>{
 let identity='a';const read=verifiedSnapshot(async()=>({identity,value:{identity}}),async()=>{const observed=identity;identity='c';return observed;});
 await read();identity='b';assert.deepEqual(await read(),{identity:'c'});
 assert.deepEqual(await read(),{identity:'c'});
});

test('out-of-order overlapping misses cannot bypass the following request validation',async()=>{
 let identity='a',release;const read=verifiedSnapshot(async()=>{
  const observed=identity;if(observed==='b')await new Promise(resolve=>{release=resolve;});
  return {identity:observed,value:{identity:observed}};
 },async()=>identity);
 await read();identity='b';const earlier=read();await new Promise(resolve=>setImmediate(resolve));
 identity='c';assert.deepEqual(await read(),{identity:'c'});release();assert.deepEqual(await earlier,{identity:'b'});
 assert.deepEqual(await read(),{identity:'c'});
});

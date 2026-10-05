import {test} from 'node:test';
import assert from 'node:assert/strict';
import {studioFetch,StudioRequestError} from '../src/components/studio/workspace-api.ts';

test('expired access is announced even when a proxy returns an HTML error body',async(t)=>{
 const events=[];
 t.mock.method(globalThis,'fetch',async()=>new Response('<h1>Expired</h1>',{status:401}));
 const original=globalThis.window;globalThis.window={dispatchEvent:event=>events.push(event.type)};
 try{await assert.rejects(studioFetch('/api/studio/content',{operation:'draft'}),e=>e instanceof StudioRequestError&&e.status===401&&/session expired/.test(e.message));assert.deepEqual(events,['studio-session-expired']);}finally{globalThis.window=original;}
});

test('an interrupted successful write asks for saved-record verification without retrying',async(t)=>{
 let calls=0;t.mock.method(globalThis,'fetch',async()=>{calls++;return new Response('{',{status:200});});
 await assert.rejects(studioFetch('/api/studio/content',{operation:'draft'}),e=>e.status===200&&/reload the saved record/.test(e.message));assert.equal(calls,1);
});

test('conflicts and network failures preserve status for recovery and never retry implicitly',async(t)=>{
 let calls=0;t.mock.method(globalThis,'fetch',async()=>{calls++;return new Response(JSON.stringify({error:'Newer saved revision'}),{status:409});});
 await assert.rejects(studioFetch('/api/studio/content',{}),e=>e.status===409&&e.message==='Newer saved revision');assert.equal(calls,1);
 t.mock.method(globalThis,'fetch',async()=>{throw Error('network');});await assert.rejects(studioFetch('/api/studio/content',{}),e=>e.status===0&&/edits remain/.test(e.message));
});

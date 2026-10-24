import {test} from 'node:test';
import assert from 'node:assert/strict';
import {localEnvironment,localUrl} from './local-guard.mjs';
const config=()=>({DATABASE_URL:localUrl,RIVYA_DATA_MODE:'isolated',RIVYA_QA_TARGET:'exact-legacy-local',STUDIO_ADMIN_ID:'synthetic-only-owner',STUDIO_ADMIN_PASSWORD:'synthetic-password-never-live',STUDIO_SESSION_SECRET:'synthetic-secret-never-live'});
test('drops inherited remote credentials and NODE_OPTIONS',()=>{const env=localEnvironment(config(),{PATH:'runtime',DATABASE_URL:'postgresql://remote',GOOGLE_TOKEN:'secret',BLOB_READ_WRITE_TOKEN:'secret',NODE_OPTIONS:'untrusted'});assert.equal(env.PATH,'runtime');assert.equal(env.DATABASE_URL,localUrl);assert.equal(env.GOOGLE_TOKEN,undefined);assert.equal(env.NODE_OPTIONS,undefined);assert.equal(env.BLOB_READ_WRITE_TOKEN,'');});
for(const url of ['postgresql://remote/database','postgresql://rivya_restoration_qa@127.0.0.1:55439/rivya_restoration_local','postgresql://rivya_restoration_qa@127.0.0.1:55443/other'])test('rejects alternate target '+url,()=>{assert.throws(()=>localEnvironment({...config(),DATABASE_URL:url}));});
test('refuses shared mode',()=>assert.throws(()=>localEnvironment({...config(),RIVYA_DATA_MODE:'shared'})));
test('refuses a remote blob credential',()=>assert.throws(()=>localEnvironment({...config(),BLOB_READ_WRITE_TOKEN:'remote'})));
test('keeps intake disabled and pages unindexed',()=>{const env=localEnvironment(config());assert.equal(env.RIVYA_ORDER_INTAKE_ENABLED,'false');assert.equal(env.SITE_INDEXABLE,'false');});

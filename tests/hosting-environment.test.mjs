import assert from 'node:assert/strict';
import {test} from 'node:test';
import {hostingPlatform, deploymentContext, secureCookies} from '../src/lib/hosting-environment.ts';
import {clientAddress} from '../src/lib/client-address.ts';
import {isVisualPreviewAllowed} from '../src/lib/preview-mode.ts';
import {isPublicWebsiteAvailable, isProductionWebsite} from '../src/lib/public-website.ts';
import {localEditorialRoot} from '../src/lib/local-editorial-store.ts';
import {localCreationAccess} from '../src/lib/owner-creation-model.ts';

const runtime = {SITE_ID:'synthetic-site', SITE_NAME:'synthetic-name'};
const local = {RIVYA_RESTORATION_LOCAL:'true',RIVYA_QA_TARGET:'exact-legacy-local',RIVYA_DATA_MODE:'isolated',DATABASE_URL:'postgresql://rivya_restoration_qa@localhost:55443/rivya_restoration_local'};

test('Netlify build and function contexts agree without relying on build-only metadata',()=>{
  for(const [context,expected] of [['production','production'],['deploy-preview','preview'],['branch-deploy','preview'],['dev','development']]) {
    assert.equal(deploymentContext({NETLIFY:'true',CONTEXT:context}),expected);
    assert.equal(deploymentContext({...runtime,RIVYA_DEPLOY_CONTEXT:context}),expected);
    assert.equal(deploymentContext({RIVYA_HOSTING_PROVIDER:'netlify',RIVYA_DEPLOY_CONTEXT:context}),expected);
  }
  assert.equal(hostingPlatform(runtime),'netlify');
});

test('host metadata takes precedence over copied production application flags',()=>{
  const preview={...runtime,RIVYA_DEPLOY_CONTEXT:'deploy-preview',RIVYA_ENV:'production',RIVYA_PUBLISHED_PREVIEW:'1'};
  assert.equal(isProductionWebsite(preview),false);
  assert.equal(isPublicWebsiteAvailable(preview),true);
  assert.equal(isVisualPreviewAllowed({...preview,RIVYA_VISUAL_PREVIEW:'1'}),false);
  assert.equal(deploymentContext({...preview,CONTEXT:'branch-deploy',RIVYA_DEPLOY_CONTEXT:'production'}),'preview');
});

test('unknown and conflicting hosting identities cannot expose preview fixtures or production pages',()=>{
  for(const env of [runtime,{NETLIFY:'true',CONTEXT:'unexpected'},{...runtime,VERCEL:'1',VERCEL_ENV:'production'},{RIVYA_HOSTING_PROVIDER:'unknown'}]) {
    assert.equal(deploymentContext(env),'unknown');
    const unsafe={...env,NODE_ENV:'development',RIVYA_ENV:'production',RIVYA_VISUAL_PREVIEW:'1',RIVYA_PUBLISHED_PREVIEW:'1'};
    assert.equal(isProductionWebsite(unsafe),false);
    assert.equal(isPublicWebsiteAvailable(unsafe),false);
    assert.equal(isVisualPreviewAllowed(unsafe),false);
  }
});

test('Netlify previews require explicit published access and shared data cannot use fixtures',()=>{
  const env={...runtime,RIVYA_DEPLOY_CONTEXT:'deploy-preview',RIVYA_DATA_MODE:'shared'};
  assert.equal(isPublicWebsiteAvailable(env),false);
  assert.equal(isPublicWebsiteAvailable({...env,RIVYA_PUBLISHED_PREVIEW:'1'}),true);
  assert.equal(isVisualPreviewAllowed({...env,RIVYA_VISUAL_PREVIEW:'1'}),false);
  assert.equal(isVisualPreviewAllowed({...runtime,RIVYA_DEPLOY_CONTEXT:'production',RIVYA_VISUAL_PREVIEW:'1'}),false);
});

test('hosted functions cannot open local editorial or unselected creation files',()=>{
  for(const host of [runtime,{NETLIFY:'true'},{RIVYA_HOSTING_PROVIDER:'netlify'},{VERCEL:'1'}]) {
    assert.throws(()=>localEditorialRoot({...local,...host}));
    assert.equal(localCreationAccess({...local,...host}),false);
  }
  assert.ok(localEditorialRoot(local));
  assert.equal(localCreationAccess(local),true);
});

test('hosted locale cookies stay Secure including preview and unknown contexts',()=>{
  for(const env of [runtime,{NETLIFY:'true',CONTEXT:'deploy-preview'},{VERCEL_ENV:'production'},{NODE_ENV:'production'},{RIVYA_ENV:'production'}]) assert.equal(secureCookies(env),true);
  assert.equal(secureCookies({NODE_ENV:'development'}),false);
});

test('client rate keys use only the selected host connection header',()=>{
  const h=new Headers({'x-nf-client-connection-ip':'203.0.113.1','x-vercel-forwarded-for':'203.0.113.2, 203.0.113.3','x-forwarded-for':'203.0.113.4','x-real-ip':'203.0.113.5'});
  assert.equal(clientAddress(h,runtime),'203.0.113.1');
  assert.equal(clientAddress(h,{VERCEL:'1'}),'203.0.113.2');
  assert.equal(clientAddress(h,{}),'local');
  assert.equal(clientAddress(h,{...runtime,VERCEL:'1'}),'unknown');
  assert.equal(clientAddress(new Headers({'x-nf-client-connection-ip':'2001:db8::1'}),runtime),'2001:db8::1');
});

test('missing or malformed connection metadata cannot create attacker-selected rate buckets',()=>{
  for(const value of ['', 'attacker','203.0.113.1, 203.0.113.2','203.0.113.1:1234']) {
    assert.equal(clientAddress(new Headers({'x-nf-client-connection-ip':value,'x-forwarded-for':'203.0.113.8'}),runtime),'unknown');
  }
  assert.equal(clientAddress(new Headers({'x-forwarded-for':'203.0.113.8'}),runtime),'unknown');
});

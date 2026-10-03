import {test} from 'node:test';
import assert from 'node:assert/strict';
import {legacyRoutes,resolveLegacyRoute,legacyDiscoveryQuery} from '../src/lib/legacy-routes.ts';
import {studioDestinations} from '../src/lib/studio-work-queue.ts';

test('reviewed redirects are local, distinct and never lead to another legacy redirect',()=>{
 const active=legacyRoutes.filter(row=>row.disposition==='redirect');
 assert.equal(active.length,7);assert.equal(new Set(legacyRoutes.map(row=>row.source)).size,legacyRoutes.length);
 for(const row of active){const result=resolveLegacyRoute(row.source);assert.equal(result.kind,'redirect');assert.equal(result.href,row.destination);assert.ok(/^\/(?!\/)/.test(result.href));assert.ok(!active.some(other=>other.source===result.href));assert.ok(row.evidence);}
});
test('supported old discovery choices survive without carrying arbitrary private query fields',()=>{
 const query=new URLSearchParams('q=blue+table&sort=name&token=private&receipt=private&email=private&phone=private&message=private&next=https://outside.test&redirect=/studio');
 assert.deepEqual(resolveLegacyRoute('/shop',query),{kind:'redirect',href:'/search?q=blue+table&sort=name'});
 assert.deepEqual(resolveLegacyRoute('/blog',query),{kind:'redirect',href:'/journal?q=blue+table'});
 assert.deepEqual(resolveLegacyRoute('/custom-order',query),{kind:'redirect',href:'/commission'});
});
test('unsupported filters are explicitly reset; old prices and pagination are never reinterpreted',()=>{
 const result=resolveLegacyRoute('/shop',new URLSearchParams('q=wood&category=unreviewed&sort=price-asc&after=private&page=8&stock=in-stock&sizeTier=large'));
 assert.equal(result.href,'/search?q=wood&legacyFilters=reset');
 assert.equal(resolveLegacyRoute('/blog',new URLSearchParams('category=unreviewed&tag=colour&page=2')).href,'/journal?legacyFilters=reset');
});
test('query bounds and duplicates cannot produce ambiguous or injected redirect values',()=>{
 assert.equal(legacyDiscoveryQuery(new URLSearchParams('q=one&q=two&sort=name&sort=name-desc'),'shop').toString(),'');
 assert.equal(legacyDiscoveryQuery(new URLSearchParams({q:'a'.repeat(400)}),'shop').get('q').length,100);
 assert.equal(legacyDiscoveryQuery(new URLSearchParams({q:'line\r\nbreak'}),'shop').toString(),'');
});
test('receipt compatibility is always a private notice and never forwards any token or creates a new receipt',()=>{
 for(const query of ['', 'token=private&id=private','q=private&message=private&next=/inquiry/received']){
  const result=resolveLegacyRoute('/whatsapp-order',new URLSearchParams(query));
  assert.equal(result.kind,'notice');assert.equal(result.status,410);assert.equal(result.href,'/contact');assert.ok(!JSON.stringify(result).includes('private'));
 }
});
test('old wishlist and unsupported services explain their disposition without pretending data migrated',()=>{
 const wishlist=resolveLegacyRoute('/shop/wishlist');assert.equal(wishlist.status,410);assert.match(wishlist.message,/has not been transferred/);assert.equal(wishlist.href,'/saved-pieces');
 for(const path of ['/workshops','/shop/workshops','/shop/supplies-pigments','/shop/print-filaments'])assert.equal(resolveLegacyRoute(path).status,410);
 for(const type of ['supplies','print'])assert.equal(resolveLegacyRoute('/shop',new URLSearchParams({type})).status,410);
});
test('no guessed product, article, locale or private-route mapping is accepted',()=>{
 for(const path of ['/product/river-channel','/product/unknown','/blog/unknown','/shop/unreviewed','/hi/shop','/studio','//outside.test','/shop/../studio'])assert.equal(resolveLegacyRoute(path).status,404);
});
test('read-only publication diagnostics remain administrator-only in the page finder',()=>{
 assert.equal(studioDestinations(false,'old links').length,0);
 assert.equal(studioDestinations(true,'old links')[0].href,'/studio/route-review');
});

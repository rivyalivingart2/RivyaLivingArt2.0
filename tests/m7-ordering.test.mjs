import {test} from 'node:test';
import assert from 'node:assert/strict';
import {orderScopes,validOrderIds,orderedItems,selectedItems,moveOrder} from '../src/lib/editorial-order.ts';
import {inquiryCard} from '../src/lib/inquiry-card.ts';
const entries=[{id:'a',route:'/journal/a',eyebrow:'Material',title:'A'},{id:'b',route:'/journal/b',eyebrow:'Material',title:'B'},{id:'c',route:'/portfolio/c',eyebrow:'Room',title:'C',editorial:{kind:'portfolio'}},{id:'page:faq#question-1',route:'/faq#question-1',eyebrow:'Ordering',title:'Question'}];
test('complete-scope orders reject partial pages, repeats and foreign IDs; selections stay bounded',()=>{
 const scopes=orderScopes(entries,['b']),archive=scopes.find(s=>s.key==='archive:journal'),feature=scopes.find(s=>s.key==='featured:journal');
 assert.deepEqual(archive.defaults,['a','b']);assert.ok(validOrderIds(['b','a'],archive));assert.equal(validOrderIds(['a'],archive),false);assert.equal(validOrderIds(['a','a'],archive),false);assert.equal(validOrderIds(['a','c'],archive),false);
 assert.ok(validOrderIds([],feature));assert.deepEqual(feature.defaults,['b']);assert.ok(scopes.some(s=>s.key==='related:c'));assert.ok(scopes.some(s=>s.key==='faq:groups'));assert.ok(scopes.some(s=>s.key==='category:faq:Ordering'));
});
test('withdrawn IDs vanish, newly published IDs retain fallback order, selection does not import other records',()=>{
 assert.deepEqual(orderedItems(entries,['b','missing','a']).map(e=>e.id),['b','a','c','page:faq#question-1']);
 assert.deepEqual(selectedItems(entries,['missing','c']).map(e=>e.id),['c']);assert.deepEqual(moveOrder(['a','b','c'],'a',2),['b','c','a']);assert.deepEqual(moveOrder(['a'],'a',-1),['a']);
});
test('legacy card retains exact saved answers and excludes inferred care, price, staff notes and product promises',()=>{
 const facts=inquiryCard({name:'QA only',phone:'9999999999',answers:{Width:'Unknown'},notes:'Original note',product_snapshot:{id:'p',name:'Saved piece',care:'unapproved generic care'},internal:'private note',summary:'untrusted summary'});
 assert.deepEqual(facts,[{label:'Customer',value:'QA only'},{label:'Phone',value:'9999999999'},{label:'Catalogue starting point',value:'Saved piece'},{label:'Product reference',value:'p'},{label:'Width',value:'Unknown'},{label:'Customer notes',value:'Original note'}]);
 assert.deepEqual(inquiryCard({contract_version:2}),[]);
 const damaged={contract_version:2,name:'Saved customer',schema_snapshot:{},answers:{Width:'Unconfirmed',privateObject:{secret:'excluded'}},notes:'Original note',answer_snapshot:[{label:'Unvalidated label',value:'not trusted'}]};
 assert.deepEqual(inquiryCard(damaged),[{label:'Customer',value:'Saved customer'},{label:'Width',value:'Unconfirmed'},{label:'Customer notes',value:'Original note'}]);
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newsletterInput} from '../src/lib/newsletter-model.ts';
test('newsletter normalizes repeat-address identity without accepting arbitrary fields',()=>{
 assert.deepEqual(newsletterInput({email:'  Test@Example.invalid ',source:'footer',honeypot:''}),{email:'test@example.invalid',source:'footer',honeypot:''});
 for(const value of [null,[],{}, {email:'x',source:'footer',honeypot:''},{email:'a@b.invalid',source:'import',honeypot:''},{email:'a@b.invalid',source:'footer',honeypot:'',approved:true},{email:'a@b.invalid\nBcc: a@b.invalid',source:'footer',honeypot:''}])assert.equal(newsletterInput(value),null);
});

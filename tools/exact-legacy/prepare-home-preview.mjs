/** Add ONE private presentation revision to the existing synthetic loopback
 * cluster. Never update existing documents or publish this test selection. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {target,localRoot,localEnvironment,assertNoEnvironmentFiles,verifyDatabase} from './local-guard.mjs';
import {compileHomepageSnapshot} from '../../src/lib/homepage-dependencies.ts';
import {compileHomeReference} from '../../src/lib/home-reference-dependencies.ts';
import {referenceComposition} from '../../src/lib/home-reference-model.ts';
import {homePresentationId,defaultHomepageLayout} from '../../src/lib/presentation-model.ts';

assertNoEnvironmentFiles();
const config=JSON.parse(readFileSync(resolve(localRoot,'config.json'),'utf8'));
localEnvironment(config); // Enforce fixed target and refuse remote credentials.
const {default:pg}=await import(pathToFileURL(config.pgModule).href);
const client=new pg.Client(target);await client.connect();
try{
 await verifyDatabase(client);await client.query('BEGIN');
 assert.equal((await client.query('SELECT count(*)::int AS n FROM rivya_presentations')).rows[0].n,0,'Preserve any existing presentation work; this fixture is first-run only');
 const [products,content,media]=await Promise.all([
  client.query('SELECT product_id AS key,published AS document,published_version AS version FROM rivya_catalogue WHERE visible AND published IS NOT NULL ORDER BY product_id'),
  client.query('SELECT content_key AS key,published AS document,published_version AS version FROM rivya_content WHERE visible AND published IS NOT NULL ORDER BY content_key'),
  client.query('SELECT path AS key,published AS document,version FROM rivya_public_media WHERE published IS NOT NULL ORDER BY path'),
 ]);
 assert.equal(products.rows.length,120);assert.equal(content.rows.length,56);assert.equal(media.rows.length,131);
 const withFingerprints=rows=>rows.map(row=>({...row,fingerprint:createHash('sha256').update(JSON.stringify(row.document)).digest('hex')}));
 const source={products:withFingerprints(products.rows),content:withFingerprints(content.rows),media:withFingerprints(media.rows)};
 const homeRow=source.content.find(row=>row.key==='page:home'),home=structuredClone(homeRow.document);
 const selected=source.content.filter(row=>row.document.kind==='article').slice(0,3).map(row=>row.key);assert.equal(selected.length,3);
 home.homepage.sections.find(block=>block.type==='journal').articleIds=selected;
 home.homeSnapshot=compileHomepageSnapshot(home,source);assert.deepEqual(home.homeSnapshot.issues,[]);
 const reference=compileHomeReference(source);assert.deepEqual(reference.issues,[]);
 const document={schemaVersion:1,id:homePresentationId,layout:{...defaultHomepageLayout,manifesto:'statement',composition:referenceComposition()},home,homeVersion:homeRow.version,reference,dependencies:[...home.homeSnapshot.dependencies,...reference.dependencies]};
 await client.query("INSERT INTO rivya_presentations(presentation_key,draft,version,published_version,updated_by) VALUES($1,$2,1,0,'synthetic-home-composition-qa')",[homePresentationId,document]);
 await client.query("INSERT INTO rivya_presentation_revisions(presentation_key,version,document,actor,operation) VALUES($1,1,$2,'synthetic-home-composition-qa','draft')",[homePresentationId,document]);
 await client.query('COMMIT');
 const receipt={at:new Date().toISOString(),scope:'SYNTHETIC_LOOPBACK_ONLY',privatePresentationRevision:1,addedRows:2,published:false,modifiedExistingRows:0,selectedArticleCount:3,source:'Existing local fixture publications copied into a separate private test snapshot; the public homepage selection is unchanged.'};
 writeFileSync(resolve(localRoot,'home-preview-fixture.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));
}catch(error){await client.query('ROLLBACK');throw error;}finally{await client.end();}

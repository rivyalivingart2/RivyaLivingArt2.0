import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseEnv} from 'node:util';
import {baselineProducts,validProduct,type ShopProduct} from '../../src/lib/shop-model';
import {validPageMedia} from '../../src/lib/editorial-media-model';
import type {PublicMedia} from '../../src/lib/public-media';
import {fixturePath,reportRoot} from '../../e2e/report-paths';

/** Read published local fixtures only. No seeds, authentication or record changes. */
async function readFixtures(){
 const {assertLocalConfig,localTarget}=await import(pathToFileURL(resolve('tools/old-design-migration/guard.mjs')).href);
 const config=parseEnv(await readFile('test-results/old-design-migration/.env.qa','utf8'));
 assertLocalConfig(config);
 assert.equal(process.env.RIVYA_E2E_ISOLATED_QA,'1');
 const {default:pg}=await import(pathToFileURL(process.env.RIVYA_MIGRATION_PG_MODULE!).href);
 const client=new pg.Client(localTarget);await client.connect();
 try{
  await client.query('BEGIN READ ONLY');
  const identity=(await client.query('SELECT current_database() AS database, current_user AS role, host(inet_server_addr()) AS host, inet_server_port() AS port')).rows[0];
  assert.deepEqual(identity,{database:localTarget.database,role:localTarget.user,host:localTarget.host,port:localTarget.port});
  const rows=(await client.query('SELECT product_id, published, published_version FROM rivya_catalogue WHERE visible=true AND published IS NOT NULL ORDER BY product_id')).rows as {product_id:string;published:unknown;published_version:number}[];
  const mediaRows=(await client.query('SELECT path, published FROM rivya_public_media WHERE published IS NOT NULL')).rows as {path:string;published:unknown}[];
  const media=new Map<string,PublicMedia>();
  for(const row of mediaRows)if(validPageMedia(row.published)&&row.path===row.published.path)media.set(row.path,row.published);
  const products=rows.flatMap(row=>{
   const p=row.published;
   if(!validProduct(p,baselineProducts.find(b=>b.id===row.product_id))||p.id!==row.product_id||Number(row.published_version)<1||!media.get(p.image)?.products.includes(p.id))return [];
   const images=[p.image,...(p.gallery||[]).map(g=>g.src),...(p.scene?[p.scene]:[])].filter(src=>media.get(src)?.products.includes(p.id));
   return [{id:p.id,slug:p.slug,name:p.name,tier:p.tier,category:p.category,material:p.material||'',images:[...new Set(images)],fields:p.fields.map(f=>({id:f.id,label:f.label,type:f.type,options:f.options,visibleWhen:f.visibleWhen}))}];
  });
  for(const tier of ['large','memory','personal'] as ShopProduct['tier'][])assert.ok(products.some(p=>p.tier===tier),'Existing published QA fixture missing tier: '+tier);
  assert.ok(products.filter(p=>p.tier==='large').length>=2,'Two published furniture fixtures are required');
  assert.ok(products.some(p=>p.images.length>1),'A published multi-image fixture is required');
  assert.ok(products.length>12,'Published QA catalogue must exercise incremental loading');
  await mkdir(`${reportRoot}/e2e-final`,{recursive:true});
  await writeFile(fixturePath,JSON.stringify({at:new Date().toISOString(),scope:'Existing fixed loopback QA; published public descriptors only; read-only transaction',products},null,2)+'\n');
 }finally{await client.query('ROLLBACK');await client.end();}
}
await readFixtures();

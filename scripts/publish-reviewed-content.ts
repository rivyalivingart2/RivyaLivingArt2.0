import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parseEnv} from 'node:util';
import {neon} from '@neondatabase/serverless';
import {baselineProducts,validProduct} from '../src/lib/shop-model';
import {baselineContent,validContent} from '../src/lib/content-model';
import {approvedPublicMedia,validMedia} from '../src/lib/public-media';
import {businessContact} from '../src/lib/contact';

const target=process.argv.includes('--shared')?'shared':'isolated';
const envFile=target==='shared'?'.env.local':'.env.qa.local';
const env=parseEnv(fs.readFileSync(path.resolve(envFile),'utf8'));
if(env.RIVYA_DATA_MODE!==target||!env.DATABASE_URL)throw Error('Explicit target configuration does not match');
if(target==='isolated'&&new URL(env.DATABASE_URL).pathname!=='/rivya_qa_20260924')throw Error('Unverified QA database');
if(target==='shared'&&env.RIVYA_ORDER_INTAKE_ENABLED==='true')throw Error('Initial publication requires the controlled pre-intake release window');
const details={phone:'+918320404132',email:businessContact.email,whatsapp:'918320404132',map:businessContact.locationHref};
const candidate={media:approvedPublicMedia,products:baselineProducts,content:baselineContent,business:details};
if(candidate.products.length!==120||candidate.content.length!==47||candidate.content.filter(d=>d.kind==='article').length!==36)throw Error('Publication scope changed');
if(candidate.products.some(p=>!validProduct(p,p))||candidate.content.some(d=>!validContent(d,d))||candidate.media.some(m=>!validMedia(m)))throw Error('Publication candidate does not validate');
for(const p of candidate.products)for(const image of [p.image,p.scene,...(p.gallery||[]).map(g=>g.src)].filter(Boolean))if(!candidate.media.some(m=>m.path===image&&m.products.includes(p.id)))throw Error('Product image ownership mismatch');
for(const m of candidate.media)if(!fs.existsSync(path.join(process.cwd(),'public',m.path)))throw Error('Public asset missing');
const digest=createHash('sha256').update(JSON.stringify(candidate)).digest('hex');
const sql=neon(env.DATABASE_URL);
const current=await sql`SELECT (SELECT count(*)::integer FROM rivya_catalogue) AS products,(SELECT count(*)::integer FROM rivya_content) AS content,(SELECT count(*)::integer FROM rivya_public_media) AS media,(SELECT count(*)::integer FROM rivya_business_settings) AS business`;
if(!process.argv.includes('--apply')){console.log(JSON.stringify({mode:'review',target,digest,candidate:{products:120,content:47,media:candidate.media.length,business:1},existing:current[0],preservation:'Existing entries are never overwritten by this initial publisher'}));process.exit(0);}
if(process.argv[process.argv.indexOf('--digest')+1]!==digest)throw Error('Pass the reviewed current candidate digest');
// Idempotent initial publication only. Existing drafts/publications require Studio review.
const actor='Owner-approved release publication';
const statements=[
 sql`WITH added AS (INSERT INTO rivya_public_media(path,draft,published,version,updated_by)
  SELECT item->>'path',item,item,1,${actor} FROM jsonb_array_elements(${JSON.stringify(candidate.media)}::jsonb) item ON CONFLICT DO NOTHING RETURNING path,draft,version),
  revisions AS (INSERT INTO rivya_revisions(kind,entity_key,version,document,actor,operation) SELECT 'media',path,version,draft,${actor},'publish' FROM added)
  SELECT count(*)::integer AS added FROM added`,
 sql`WITH added AS (INSERT INTO rivya_catalogue(product_id,draft,published,version,published_version,visible,updated_by)
  SELECT item->>'id',item,item,1,1,true,${actor} FROM jsonb_array_elements(${JSON.stringify(candidate.products)}::jsonb) item
  WHERE NOT EXISTS(SELECT 1 FROM jsonb_array_elements_text(jsonb_build_array(item->>'image')||CASE WHEN item->>'scene' IS NOT NULL THEN jsonb_build_array(item->>'scene') ELSE '[]'::jsonb END) f WHERE NOT EXISTS(SELECT 1 FROM rivya_public_media m WHERE m.path=f AND m.published IS NOT NULL AND m.published->'products' ? (item->>'id')))
  ON CONFLICT DO NOTHING RETURNING product_id,draft,version),
  revisions AS (INSERT INTO rivya_revisions(kind,entity_key,version,document,actor,operation) SELECT 'product',product_id,version,draft,${actor},'publish' FROM added)
  SELECT count(*)::integer AS added FROM added`,
 sql`WITH added AS (INSERT INTO rivya_content(content_key,kind,route,draft,published,version,published_version,visible,updated_by)
  SELECT item->>'id',item->>'kind',item->>'route',item,item,1,1,true,${actor} FROM jsonb_array_elements(${JSON.stringify(candidate.content)}::jsonb) item ON CONFLICT DO NOTHING RETURNING content_key,draft,version),
  revisions AS (INSERT INTO rivya_revisions(kind,entity_key,version,document,actor,operation) SELECT 'content',content_key,version,draft,${actor},'publish' FROM added)
  SELECT count(*)::integer AS added FROM added`,
 sql`INSERT INTO rivya_business_settings(id,details,version,updated_by) VALUES(1,${JSON.stringify(details)}::jsonb,1,${actor}) ON CONFLICT DO NOTHING RETURNING version`,
 sql`INSERT INTO rivya_audit(actor,action,entity) VALUES(${actor},'release:initial-publication',${digest})`
];
const result=await sql.transaction(statements);
const counts=await sql`SELECT (SELECT count(*)::integer FROM rivya_catalogue WHERE visible AND published IS NOT NULL) AS products,(SELECT count(*)::integer FROM rivya_content WHERE visible AND published IS NOT NULL) AS content,(SELECT count(*)::integer FROM rivya_public_media WHERE published IS NOT NULL) AS media`;
console.log(JSON.stringify({mode:'applied',target,digest,added:{media:result[0][0].added,products:result[1][0].added,content:result[2][0].added,business:result[3].length},publishedCounts:counts[0],existingEntries:'preserved',publicReaderVerification:'still required'}));

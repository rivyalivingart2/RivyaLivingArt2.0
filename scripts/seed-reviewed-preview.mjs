import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {neon} from '@neondatabase/serverless';
import nextEnv from '@next/env';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
nextEnv.loadEnvConfig(root,true, {info(){},error(){}});
if(process.argv[2]!=='--apply-preview')throw new Error('Explicit --apply-preview is required. This command never targets Production.');
if(process.env.RIVYA_DATA_MODE!=='isolated'||process.env.VERCEL_ENV==='production'||process.env.RIVYA_ENV==='production'||!process.env.DATABASE_URL||process.env.DATABASE_URL==='[SENSITIVE]')throw new Error('A verified isolated database with RIVYA_DATA_MODE=isolated is required. Never run this import against the shared live database.');
const bytes=fs.readFileSync(path.join(root,'docs/redesign/reviewed-publication.json'));
const candidate=JSON.parse(bytes),digest=crypto.createHash('sha256').update(bytes).digest('hex');
if(candidate.products.length!==120||candidate.content.length!==47)throw new Error('Review the changed publication scope before applying it.');
for(const image of candidate.media){if(!image.path.startsWith('/media/')||image.path.includes('..')||!fs.existsSync(path.join(root,'public',image.path)))throw new Error('A reviewed asset is unavailable.');}
const sql=neon(process.env.DATABASE_URL);
try{
 const marker=await sql`SELECT migration_sha256 FROM rla_backup_20260923_p6.manifest`;
 if(!marker.length||marker[0].migration_sha256!=='acfbe47599596ff720df57b5d3224f4e2c84d28e38a8591beddfee5a07beb447')throw new Error('Preview snapshot identity did not match.');
 const products=JSON.stringify(candidate.products),content=JSON.stringify(candidate.content),media=JSON.stringify(candidate.media);
 const result=await sql`WITH products AS (
 INSERT INTO rivya_catalogue(product_id,draft,published,version,published_version,visible,updated_by)
 SELECT item->>'id',item,item,1,1,true,'Approved redesign import' FROM jsonb_array_elements(${products}::jsonb) item ON CONFLICT(product_id) DO NOTHING RETURNING product_id
 ), content AS (
 INSERT INTO rivya_content(content_key,kind,route,draft,published,version,published_version,visible,updated_by)
 SELECT item->>'id',item->>'kind',item->>'route',item,item,1,1,true,'Approved redesign import' FROM jsonb_array_elements(${content}::jsonb) item ON CONFLICT(content_key) DO NOTHING RETURNING content_key
 ), media AS (
 INSERT INTO rivya_public_media(path,draft,published,version,updated_by)
 SELECT item->>'path',item,item,1,'Approved redesign import' FROM jsonb_array_elements(${media}::jsonb) item ON CONFLICT(path) DO NOTHING RETURNING path
 ), audit AS (
 INSERT INTO rivya_audit(actor,action,entity) VALUES('Approved redesign import','preview:initial-publication',${digest})
 ) SELECT (SELECT count(*)::integer FROM products) AS products,(SELECT count(*)::integer FROM content) AS content,(SELECT count(*)::integer FROM media) AS media`;
 console.log(JSON.stringify({target:'isolated Preview',imported:result[0],sourceSha256:digest,existingRecords:'Preserved without updates'}));
}catch{console.error('Preview publication did not complete. No credentials are logged. Check the target snapshot, schema and connection, then retry the same candidate.');process.exitCode=1;}

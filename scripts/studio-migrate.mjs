import {readFile} from 'node:fs/promises';
import {neon} from '@neondatabase/serverless';
if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL through your private environment before running this command.');
const sql = neon(process.env.DATABASE_URL);
const source = await readFile(new URL('./studio-schema.sql', import.meta.url),'utf8');
await sql.transaction(source.split(';').map(s=>s.trim()).filter(Boolean).map(statement=>sql.query(statement)));
console.log('Studio schema applied. No customer records or credentials were seeded.');

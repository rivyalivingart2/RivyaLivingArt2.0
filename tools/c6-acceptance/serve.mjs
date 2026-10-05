import {spawn} from 'node:child_process';
import {qa} from './common.mjs';

// The existing common helper pins and verifies the isolated database and store.
const env={...process.env,NODE_ENV:'production',NEXT_TELEMETRY_DISABLED:'1',VERCEL_ENV:'preview',RIVYA_PUBLISHED_PREVIEW:'1',RIVYA_DATA_MODE:'isolated',SITE_INDEXABLE:'false',RIVYA_ORDER_INTAKE_ENABLED:'true',RIVYA_ORDER_MESSAGE_RETRY_ENABLED:'true'};
for(const key of ['DATABASE_URL','STUDIO_ADMIN_ID','STUDIO_ADMIN_PASSWORD','STUDIO_SESSION_SECRET','BLOB_READ_WRITE_TOKEN'])env[key]=qa[key];
delete env.QA_MIGRATION_DATABASE_URL;delete env.DATABASE_URL_UNPOOLED;
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','4194'],{env,stdio:'inherit'});
process.on('SIGINT',()=>server.kill('SIGINT'));server.on('exit',code=>process.exit(code||0));

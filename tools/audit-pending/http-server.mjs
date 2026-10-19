/** Local HTTPS hosting of the existing Next production build; no auth/cache stubs. */
import assert from 'node:assert/strict';
import {createServer} from 'node:https';
import {readFileSync} from 'node:fs';
import {resolve,sep} from 'node:path';
import next from 'next';
assert.equal(process.env.RIVYA_HTTP_AUDIT,'true');
const root=resolve(process.env.RIVYA_HTTP_OUTPUT);assert.ok(root.startsWith(resolve('test-results/audit-pending-http')+sep));
const app=next({dev:false,hostname:'127.0.0.1',port:4207});
await app.prepare();const handler=app.getRequestHandler();
createServer({key:readFileSync(resolve(root,'localhost.key')),cert:readFileSync(resolve(root,'localhost.crt'))},(request,response)=>{
 if(request.headers.host!=='127.0.0.1:4207'){response.writeHead(400);response.end();return;}
 // Derive the forwarded scheme from this server's actual TLS socket.
 assert.equal(request.socket.encrypted,true);request.headers['x-forwarded-proto']='https';
 handler(request,response);
}).listen(4207,'127.0.0.1');

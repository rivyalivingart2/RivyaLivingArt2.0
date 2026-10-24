/** Loopback-only allowlisted media preview. Private manifests and credentials are never served. */
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';
import {collectionRoot, inside} from './prepare-owner-collection.mjs';
const toolRoot=dirname(fileURLToPath(import.meta.url)), host='127.0.0.1:4215';
export function allowedPath(name) {return /^(?:gallery\.json|README\.txt|rivya-ocean-images-\d{2}\.zip|review\/owner-\d{3}\.jpg|image-pack\/owner-\d{3}-ocean-(?:640x800|960x1200|1600x2000)\.(?:jpg|webp))$/.test(name);}
export function makeServer(){return createServer(async(req,res)=>{
  const reject=status=>{res.writeHead(status,{'Cache-Control':'no-store'});res.end();};
  try{
    if(req.headers.host!==host||!['GET','HEAD'].includes(req.method)||req.headers.origin&&req.headers.origin!=='http://'+host||req.headers['sec-fetch-site']==='cross-site')return reject(403);
    const name=decodeURIComponent(new URL(req.url,'http://'+host).pathname.slice(1));let path;
    if(!name)path=resolve(toolRoot,'owner-gallery.html');else if(name==='owner-gallery.js')path=resolve(toolRoot,name);else if(allowedPath(name))path=inside(collectionRoot,name);else return reject(404);
    const bytes=await readFile(path), ext=path.split('.').pop(),types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',json:'application/json',txt:'text/plain; charset=utf-8',zip:'application/zip',webp:'image/webp',jpg:'image/jpeg'};
    res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream','Content-Length':bytes.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Cross-Origin-Resource-Policy':'same-origin','Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; img-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"});res.end(req.method==='HEAD'?undefined:bytes);
  }catch{return reject(404);}
});}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))makeServer().listen(4215,'127.0.0.1',()=>console.log('Private image collection: http://127.0.0.1:4215/'));

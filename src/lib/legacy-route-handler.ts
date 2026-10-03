import 'server-only';
import {isPublicWebsiteAvailable} from './public-website';
import {resolveLegacyRoute} from './legacy-routes';

const escape=(value:string)=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
/** Route handlers guarantee a real 308/404/410 before any streamed page body. */
export function GET(request:Request){
 if(!isPublicWebsiteAvailable(process.env))return new Response('Not found',{status:404,headers:{'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow'}});
 const url=new URL(request.url),result=resolveLegacyRoute(url.pathname,url.searchParams);
 const headers={'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow, noarchive'};
 if(result.kind==='redirect')return new Response(null,{status:308,headers:{...headers,Location:result.href}});
 // No request URL, token, query, customer data, scripts or external assets are rendered.
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escape(result.title)} | RivyaLivingArt</title><style>html{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#080a0e;color:#f4f1e9;font:18px/1.7 system-ui,sans-serif}main{max-width:780px;margin:auto;padding:clamp(24px,8vw,80px);min-height:100svh;display:flex;flex-direction:column;justify-content:center}h1{font-size:clamp(30px,5vw,48px);line-height:1.2}p{overflow-wrap:anywhere}a{display:inline-flex;align-items:center;min-height:44px;color:#d8bd88;text-underline-offset:5px}a:focus-visible{outline:2px solid #d8bd88;outline-offset:5px}.brand{font-size:16px;letter-spacing:.08em}</style></head><body><main id="main-content"><p class="brand">RivyaLivingArt</p><h1>${escape(result.title)}</h1><p>${escape(result.message)}</p><p><a href="${escape(result.href)}">${escape(result.label)} →</a></p></main></body></html>`;
 return new Response(html,{status:result.status,headers:{...headers,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"}});
}

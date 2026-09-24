import 'server-only';
import {cookies,headers} from 'next/headers';
import {createHmac,randomBytes} from 'node:crypto';
import {studioDb} from './studio-db';
export const guestCookie=process.env.NODE_ENV==='production'?'__Host-rivya-inquiry':'rivya-inquiry';
export function privateHash(value:string){const key=process.env.STUDIO_SESSION_SECRET;if(!key||key.length<32)throw new Error('Service unavailable');return createHmac('sha256',key).update(value).digest('hex');}
export async function guestIdentity(create=false){
 const jar=await cookies();let token=jar.get(guestCookie)?.value;
 if(!token||!/^[A-Za-z0-9_-]{43}$/.test(token)){if(!create)return null;token=randomBytes(32).toString('base64url');jar.set(guestCookie,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:86400});}
 return privateHash(token);
}
export async function limited(key:string,limit:number,minutes=60){
 const rows=await studioDb()`INSERT INTO rivya_studio_login_limits(key,attempts,reset_at) VALUES(${key},1,now()+(${minutes} * interval '1 minute')) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN rivya_studio_login_limits.reset_at<=now() THEN 1 ELSE rivya_studio_login_limits.attempts+1 END, reset_at=CASE WHEN rivya_studio_login_limits.reset_at<=now() THEN now()+(${minutes} * interval '1 minute') ELSE rivya_studio_login_limits.reset_at END RETURNING attempts`;
 return Number(rows[0].attempts)<=limit;
}
export async function clientRateKey(scope:string){const h=await headers();const ip=process.env.VERCEL?h.get('x-vercel-forwarded-for')?.split(',')[0]?.trim():'local';return `${scope}:${privateHash(ip||'unknown')}`;}
export async function smallJson(request:Request,max=40000){const reader=request.body?.getReader();if(!reader)throw new Error('Empty request');const chunks:Uint8Array[]=[];let size=0;for(;;){const r=await reader.read();if(r.done)break;size+=r.value.length;if(size>max){await reader.cancel();throw new Error('Request too large');}chunks.push(r.value);}return JSON.parse(Buffer.concat(chunks).toString('utf8'));}
export function originAllowed(request:Request){return request.headers.get('origin')===new URL(request.url).origin;}

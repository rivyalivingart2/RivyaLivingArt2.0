import {originAllowed,smallJson,limited,clientRateKey} from '@/lib/request-security';
import {studioDb} from '@/lib/studio-db';
import {newsletterInput} from '@/lib/newsletter-model';
import {getOperationsAdapter} from '@/lib/google-workspace/operations-adapter';
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
/** Capture only. No notification provider, campaign or external message. */
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 if(process.env.RIVYA_NEWSLETTER_ENABLED!=='true')return json({error:'Subscriptions are temporarily unavailable. Please try again later.'},503);
 try{
  const input=newsletterInput(await smallJson(request,1024));
  if(!input)return json({error:'Enter a valid email address.'},400);
  if(input.honeypot)return json({ok:true});
  if(!await limited(await clientRateKey('newsletter'),8,10))return json({error:'Please wait a few minutes before trying again.'},429);
  const adapter = getOperationsAdapter();
  if (adapter) {
   await adapter.addNewsletterSubscriber(input.email, input.source);
  } else {
   await studioDb()`INSERT INTO rivya_newsletter_subscribers(email,source) VALUES(${input.email},${input.source}) ON CONFLICT(email) DO NOTHING`;
  }
  // Identical response for a repeat address: never expose subscriber membership.
  return json({ok:true});
 }catch{return json({error:'We could not save your subscription. Please try again.'},503);}
}

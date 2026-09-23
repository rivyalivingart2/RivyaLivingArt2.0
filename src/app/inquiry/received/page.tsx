import {publishedBusiness} from '@/lib/business-settings';
import {guestIdentity} from '@/lib/request-security';
import {studioDb} from '@/lib/studio-db';
import {ShopShell} from '@/components/shop/shop-site';
import {SavedReceipt} from '@/components/shop/saved-receipt';
import {Feedback} from '@/components/shop/feedback';
export const dynamic='force-dynamic';
export const metadata={title:'Your saved inquiry',robots:{index:false,follow:false},referrer:'no-referrer' as const};
export default async function Received({searchParams}:{searchParams:Promise<{key?:string;continue?:string}>}){
 const {details:business}=await publishedBusiness();
 const query=await searchParams;let row;let unavailable=false;
 try{
   const guest=await guestIdentity();
   if(guest&&query.key&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(query.key)){
     const records=await studioDb()`SELECT reference,summary FROM rivya_inquiries WHERE guest_hash=${guest} AND request_key=${query.key}::uuid AND created_at>now()-interval '24 hours'`;
     row=records[0];
   }
 }catch{unavailable=true;}
 return <ShopShell>{row?<SavedReceipt whatsapp={business.whatsapp} reference={row.reference} summary={row.summary} requestKey={query.key!} autoOpen={query.continue==='1'}/>:<Feedback title={unavailable?'Your receipt is temporarily unavailable.':'This private receipt has expired.'}>{unavailable?'Refresh this page to try again. Do not submit a new inquiry just to recover this receipt.':'Use the original browser within 24 hours, or contact the atelier with your inquiry reference. An expired receipt does not cancel your saved inquiry.'}</Feedback>}</ShopShell>;
}

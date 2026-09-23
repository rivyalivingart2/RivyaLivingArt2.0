import {guestIdentity} from '@/lib/request-security';
import {readOrder,orderReceipt} from '@/lib/order-handoff';
import {uuid} from '@/lib/saved-brief';
import {ShopShell} from '@/components/shop/shop-site';
import {SavedReceipt} from '@/components/shop/saved-receipt';
import {Feedback} from '@/components/shop/feedback';
export const dynamic='force-dynamic';
export const metadata={title:'Your saved inquiry',robots:{index:false,follow:false},referrer:'no-referrer' as const};
export default async function Received({searchParams}:{searchParams:Promise<{key?:string;continue?:string}>}){
 const query=await searchParams;let receipt;let unavailable=false;
 try{const guest=await guestIdentity();if(guest&&uuid(query.key)){const row=await readOrder(null,{kind:'guest',guest,key:query.key});if(row)receipt=await orderReceipt(row);}}catch{unavailable=true;}
 return <ShopShell>{receipt?<SavedReceipt receipt={receipt} requestKey={query.key!} autoOpen={query.continue==='1'}/>:<Feedback title={unavailable?'Your receipt is temporarily unavailable.':'This private receipt is unavailable or expired.'}>{unavailable?'Refresh this page to try again. Do not submit a new inquiry just to recover this receipt.':'Use the original browser within 24 hours, or contact the atelier with your inquiry reference. An expired receipt does not cancel your saved inquiry.'}</Feedback>}</ShopShell>;
}

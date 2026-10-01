import type {ShopProduct} from './shop-model';
/** Display existing product values; never infer an amount from editorial text. */
export function formatPrice(price:ShopProduct['price']){
 if(price&&price.mode!=='request'&&price.sample)return 'Price on request';
 if(price?.mode==='fixed')return `₹${price.amount.toLocaleString('en-IN')}`;
 if(price?.mode==='starting')return `From ₹${price.amount.toLocaleString('en-IN')}`;
 return 'Price on request';
}
export const formErrorTarget=(id:string,productField:boolean)=>productField?'answer-'+id:'contact-'+id;

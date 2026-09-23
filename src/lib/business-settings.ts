import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
import {businessContact} from './contact';
export type BusinessSettings={phone:string;email:string;whatsapp:string;map:string};
export const defaultBusiness:BusinessSettings={phone:'+918320404132',email:businessContact.email,whatsapp:'918320404132',map:businessContact.locationHref};
export function validBusiness(value:unknown):value is BusinessSettings{
 if(!value||typeof value!=='object')return false;const v=value as BusinessSettings;
 if(typeof v.phone!=='string'||!/^\+[1-9]\d{9,14}$/.test(v.phone)||typeof v.whatsapp!=='string'||!/^[1-9]\d{9,14}$/.test(v.whatsapp)||typeof v.email!=='string'||v.email.length>180||!/^\S+@[^\s@]+\.[^\s@]+$/.test(v.email)||typeof v.map!=='string'||v.map.length>500)return false;
 try{const url=new URL(v.map);return url.protocol==='https:'&&!url.username&&!url.password&&['maps.app.goo.gl','maps.google.com','www.google.com'].includes(url.hostname);}catch{return false;}
}
export const publishedBusiness=cache(async()=>{const rows=await studioDb()`SELECT details,version FROM rivya_business_settings WHERE id=1`;return {details:rows[0]?.details as BusinessSettings||defaultBusiness,version:Number(rows[0]?.version||0)};});

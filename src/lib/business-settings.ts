import 'server-only';
import {cache} from 'react';
import {publishedShellSource} from './published-shell-source';
import {validBusiness, defaultBusiness, type BusinessSettings} from './business-settings-model';

export type {BusinessSettings};
export {validBusiness, defaultBusiness};

export const publishedBusiness=cache(async()=>{
 const {business}=await publishedShellSource();
 if(!business)return {details:defaultBusiness,version:0};
 const {details,version}=business;
 if(!validBusiness(details)||!Number.isSafeInteger(Number(version))||Number(version)<1)throw new Error('Published business details need review');
 // Only public contact fields may cross the server/client boundary.
 return {details:{phone:details.phone,email:details.email,whatsapp:details.whatsapp,map:details.map},version:Number(version)};
});

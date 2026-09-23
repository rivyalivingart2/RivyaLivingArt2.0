import {permanentRedirect} from 'next/navigation';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const params=new URLSearchParams();for(const [key,value]of Object.entries(await searchParams))for(const v of Array.isArray(value)?value:value?[value]:[])params.append(key,v);
 permanentRedirect('/materials-care'+(params.size?'?'+params.toString():'')+'#materials');
}

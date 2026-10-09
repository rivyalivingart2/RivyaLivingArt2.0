import Preview from '../page';
export const dynamic='force-dynamic';
export default async function Frame({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const params=await searchParams;
 return Preview({searchParams:Promise.resolve({...params,viewport:undefined})});
}

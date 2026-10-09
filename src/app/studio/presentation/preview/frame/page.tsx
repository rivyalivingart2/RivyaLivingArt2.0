import PresentationPreview from '../page';
export const dynamic='force-dynamic';
export const metadata={title:'Saved homepage design frame',robots:{index:false,follow:false,noarchive:true}};
export default function PresentationFrame({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 return PresentationPreview({searchParams:searchParams.then(params=>({...params,frame:'1'}))});
}

import {redirect} from 'next/navigation';
import {publishedProducts} from './shop-catalogue';
import {findConcept} from './catalogue';
import {ApprovedExperience} from '@/components/rivya/approved-entry';
import {requirePublicPreview} from './public-preview';
type Query=Record<string,string|string[]|undefined>;
export async function LegacyJourney({route,searchParams}:{route:string;searchParams:Promise<Query>}){
 await requirePublicPreview();const query=await searchParams;
 const piece=typeof query.piece==='string'?query.piece:typeof query.product==='string'?query.product:undefined;
 if(piece){
   const products=await publishedProducts(),original=findConcept(piece);
   const product=products.find(p=>p.slug===piece||p.id===piece||p.id===original?.id);
   if(product){const retained=new URLSearchParams();for(const [key,value] of Object.entries(query)){if(key==='piece'||key==='product')continue;for(const v of Array.isArray(value)?value:value?[value]:[])retained.append(key,v);}
     redirect('/pieces/'+product.slug+'/customize'+(retained.size?'?'+retained.toString():''));
   }
 }
 return <ApprovedExperience initialRoute={route}/>;
}

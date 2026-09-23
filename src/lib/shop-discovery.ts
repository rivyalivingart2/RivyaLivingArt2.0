import type {ShopProduct} from './shop-model';

export type DiscoveryProduct=Pick<ShopProduct,'id'|'slug'|'name'|'subtitle'|'category'|'tier'|'material'>;
export const collectionLinks={large:'/collectible-design',memory:'/memory-art',personal:'/personal-art'} as const;
export const collectionLabels={large:'Furniture & spatial art',memory:'Memory art',personal:'Personal art & gifts'} as const;
const searchText=(value:string)=>value.normalize('NFKC').toLocaleLowerCase('en').replace(/\s+/g,' ').trim();
export function discoverProducts<T extends DiscoveryProduct>(products:readonly T[],params:URLSearchParams){
 const q=(params.get('q')||'').slice(0,100).trim();
 const collection=products.some(p=>p.tier===params.get('collection'))?params.get('collection')!:'all';
 const categories=[...new Set(products.filter(p=>collection==='all'||p.tier===collection).map(p=>p.category))].sort((a,b)=>a.localeCompare(b,'en'));
 const category=categories.includes(params.get('category')||'')?params.get('category')!:'all';
 const sort=['name','name-desc'].includes(params.get('sort')||'')?params.get('sort')!:'featured';
 const size=[12,24,48].includes(Number(params.get('size')))?Number(params.get('size')):12;
 const rawShow=params.get('show')||'';
 const requested=/^[1-9]\d{0,5}$/.test(rawShow)?Number(rawShow):size;
 const show=Math.min(Math.max(size,products.length),Math.max(size,Math.ceil(requested/size)*size));
 const terms=searchText(q).split(' ').filter(Boolean);
 const filtered=products.filter(p=>(collection==='all'||p.tier===collection)&&(category==='all'||p.category===category)&&terms.every(term=>searchText([p.id,p.name,p.subtitle,p.category,p.material||''].join(' ')).includes(term)));
 const ordered=sort==='featured'?filtered:filtered.toSorted((a,b)=>(sort==='name-desc'?-1:1)*a.name.localeCompare(b.name,'en')||a.id.localeCompare(b.id,'en'));
 const invalid=(!!params.get('category')&&params.get('category')!=='all'&&category==='all')||(!!params.get('collection')&&params.get('collection')!=='all'&&collection==='all')||(!!params.get('sort')&&!['featured','name','name-desc'].includes(params.get('sort')!));
 return {q,collection,category,categories,sort,size,show,invalid,total:ordered.length,items:ordered.slice(0,show)};
}
export function discoveryHref(pathname:string,values:Record<string,string>){
 const params=new URLSearchParams();
 for(const key of ['q','collection','category','sort','size','show']){
  const value=values[key];
  if(value&&value!=='all'&&!(key==='sort'&&value==='featured'))params.set(key,key==='q'?value.slice(0,100).trim():value);
 }
 return pathname+(params.size?'?'+params.toString():'');
}
export function relatedProducts(products:ShopProduct[],product:ShopProduct){
 return products.filter(p=>p.id!==product.id&&p.tier===product.tier).toSorted((a,b)=>Number(b.category===product.category)-Number(a.category===product.category)||a.id.localeCompare(b.id,'en')).slice(0,3);
}
export function productCare(product:Pick<ShopProduct,'tier'|'category'>){
 if(product.tier==='memory')return 'Discuss display position, light and cleaning with the atelier. Keep irreplaceable flowers or keepsakes with you until the preservation approach and handling are agreed.';
 if(product.tier==='personal')return 'Ask about cleaning, storage and the intended use of the finished piece. For wearable designs, confirm fittings and material suitability; an image cannot establish these details.';
 return 'Discuss sunlight, heat, moisture and cleaning for the chosen material and finish. Confirm support, installation and everyday use before agreeing the final specification.';
}

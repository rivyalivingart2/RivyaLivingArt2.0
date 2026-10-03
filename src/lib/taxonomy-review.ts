import type {ShopProduct} from './shop-model';
import {legacyRoutes} from './legacy-routes';
const key=(name:string)=>name.normalize('NFKC').trim().toLocaleLowerCase('en');
export function taxonomyReview(products:Pick<ShopProduct,'id'|'name'|'category'|'tier'>[]){
 const names=[...new Set(products.map(p=>p.category))].sort((a,b)=>a.localeCompare(b,'en'));
 return names.map(name=>{const rows=products.filter(p=>p.category===name),tiers=[...new Set(rows.map(p=>p.tier))];return {name,key:name,count:rows.length,collections:tiers,conflicts:names.filter(other=>other!==name&&key(other)===key(name)),products:rows.map(p=>({id:p.id,name:p.name})),aliases:legacyRoutes.filter(r=>r.disposition==='redirect'&&tiers.some(t=>r.destination===({large:'/collectible-design',memory:'/memory-art',personal:'/personal-art'}[t]))).map(r=>r.source)};});
}

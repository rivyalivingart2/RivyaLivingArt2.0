import {baselineProducts} from './shop-model';
export type PublicMedia={path:string;alt:string;focalX:number;focalY:number;caption:string;products:string[];provenance:string};
const registry=new Map<string,PublicMedia>();
for(const p of baselineProducts){
 for(const file of [{src:p.image,alt:p.name+' — design visualization'},...(p.scene?[{src:p.scene,alt:p.name+' in a room — design visualization'}]:[]),...(p.gallery||[])]){
  if(!file.src)continue;
  const existing=registry.get(file.src);if(existing){if(!existing.products.includes(p.id))existing.products.push(p.id);continue;}
  registry.set(file.src,{path:file.src,alt:file.alt.replace(/\bconcept\b/gi,'design'),focalX:50,focalY:50,caption:'Design visualization',products:[p.id],provenance:'Owner-supplied approved asset; original retained in Drive. See the repository media manifest.'});
 }
}
registry.set('/media/product-hero-026-4x5.webp',{path:'/media/product-hero-026-4x5.webp',alt:'Timber grain and resin in a sculptural design',focalX:50,focalY:50,caption:'Design visualization',products:[],provenance:'Owner-supplied approved material image; original retained in Drive. See the repository media manifest.'});
export const approvedPublicMedia=[...registry.values()];
export function validMedia(value:unknown):value is PublicMedia{
 if(!value||typeof value!=='object')return false;const m=value as PublicMedia;const base=registry.get(m.path);
 return !!base&&typeof m.alt==='string'&&m.alt.trim().length>0&&m.alt.length<=180&&typeof m.caption==='string'&&m.caption.length<=180&&[m.focalX,m.focalY].every(v=>Number.isFinite(v)&&v>=0&&v<=100)&&m.provenance===base.provenance&&JSON.stringify(m.products)===JSON.stringify(base.products);
}

import {products as source,type Product} from './data';
import {useDemo} from './demo-state';
import {projectProductDraft} from './product-draft-projection';
import type {StudioProductDraft} from '@/lib/rivya/source/studio-product-draft';
export function useCatalogProducts():Product[]{const {state}=useDemo();return source.filter(p=>!state.removed.includes(p.id)).map(p=>{try{const d=JSON.parse(state.published[p.id]||'null') as StudioProductDraft|null;if(!d||!p.source)return p;
 const c=projectProductDraft(p.source,d);if(c===p.source)return p;
 const changedTier=c.tier!==p.source.tier;
 return {...p,name:c.title,subtitle:c.type,story:c.description,dimensions:`${c.dimensions.width} × ${c.dimensions.depth} × ${c.dimensions.height} mm`,material:c.materials.map(m=>m.label).join(' · '),tier:c.tier==='LARGE'?'large':c.tier==='MEDIUM'?'memory':'personal',category:c.tier==='LARGE'?({tables:'Tables',seating:'Seating',consoles:'Consoles',installations:'Spatial art'})[c.category]:c.category,
 // A changed tier must never inherit a misleading object image.
 image:changedTier?'':p.image,scene:changedTier?undefined:p.scene,
 price:c.priceType==='ON_REQUEST'?{mode:'request' as const}:{mode:c.priceType==='FIXED'?'fixed' as const:'starting' as const,amount:(c.priceAmountMinor||0)/100,sample:true as const},source:changedTier?{...c,image:null,gallery:[],mediaStatus:'VISUAL_PENDING' as const}:c};}catch{return p}})}

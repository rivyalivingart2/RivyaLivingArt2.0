import {materialOptions,type Concept,type FurnitureCategory,type MemoryCategory,type PersonalCategory} from '@/lib/catalogue';
import {validateStudioProductDraft,type StudioProductDraft} from '@/lib/studio-product-draft';
/** A local view projection only: stable identity, slug, source media and provenance stay intact. */
export function projectProductDraft(source:Concept,draft:StudioProductDraft):Concept{
 if(Object.keys(validateStudioProductDraft(draft)).length)return source;
 const common={...source,name:draft.name,title:draft.title,type:draft.type,description:draft.description,detail:draft.detail,care:draft.care,
  materials:draft.materials.map(id=>({id,label:materialOptions.find(m=>m.value===id)?.label||id})),finishes:draft.finishes,
  dimensions:{width:Number(draft.width),depth:Number(draft.depth),height:Number(draft.height),unit:'mm' as const},
  leadTime:{minWeeks:Number(draft.minWeeks),maxWeeks:Number(draft.maxWeeks)},availability:draft.availability,
  priceType:draft.priceType,priceAmountMinor:draft.priceType==='ON_REQUEST'?null:Number(draft.priceAmountMinor)};
 if(draft.tier==='LARGE')return {...common,tier:'LARGE',category:draft.large.category as FurnitureCategory,edition:{type:draft.large.editionType,label:draft.large.editionLabel},installation:draft.large.installation};
 if(draft.tier==='MEDIUM')return {...common,tier:'MEDIUM',category:draft.medium.category as MemoryCategory,memory:{occasions:draft.medium.occasions,preservation:draft.medium.preservation as 'flowers'|'paper'|'keepsakes'|'occasion-design',format:draft.medium.format,sizes:draft.medium.sizes.map(s=>({label:s.label,dimensions:{width:Number(s.width),depth:Number(s.depth),height:Number(s.height),unit:'mm' as const}})),personalization:draft.medium.personalization.split('\n').filter(Boolean),materialsNote:draft.medium.materialsNote}};
 return {...common,tier:'SMALL',category:draft.small.category as PersonalCategory,personal:{recipients:draft.small.recipients,colours:draft.small.colours,festivals:draft.small.festivals,variants:draft.small.variants,personalization:draft.small.personalization.split('\n').filter(Boolean),quantity:{min:Number(draft.small.minQuantity),max:Number(draft.small.maxQuantity)},giftNote:draft.small.giftNote}};
}

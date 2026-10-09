/** Draft structure only. No current offering, dates, prices or booking are implied. */
export const workshopSlots=[
 {key:'hero',label:'Hero'}, {key:'facts',label:'The facts strip'}, {key:'why',label:'Why come'},
 {key:'session',label:'The session'}, {key:'sessions',label:'Sessions'},
 {key:'private',label:'Private workshops'}, {key:'room',label:'The room'},
] as const;
export type WorkshopSlot=typeof workshopSlots[number]['key'];
export type WorkshopTemplate={schemaVersion:1;hero:'full'|'split';hidden:WorkshopSlot[]};
export type ServiceTemplates={workshops?:WorkshopTemplate};
export const defaultWorkshopTemplate=():WorkshopTemplate=>({schemaVersion:1,hero:'full',hidden:[]});
export function validServiceTemplates(value:unknown):value is ServiceTemplates{
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(k=>k!=='workshops'))return false;
 const d=(value as ServiceTemplates).workshops;if(d===undefined)return true;
 return !!d&&typeof d==='object'&&!Array.isArray(d)&&Object.keys(d).length===3&&d.schemaVersion===1&&typeof d.hero==='string'&&['full','split'].includes(d.hero)&&Array.isArray(d.hidden)&&new Set(d.hidden).size===d.hidden.length&&d.hidden.every(k=>k!=='hero'&&workshopSlots.some(s=>s.key===k));
}

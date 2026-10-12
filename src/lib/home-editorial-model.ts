/** Layout-only validation stays independent of content capture and catalogue data. */
const isEditorialId=(id:unknown):id is string=>typeof id==='string'&&/^editorial:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id);
export type HomeEditorialSelection={portfolio:string[];testimonials:string[]};
export function validHomeEditorial(value:unknown):value is HomeEditorialSelection{
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const v=value as Record<string,unknown>;
 return Object.keys(v).length===2&&['portfolio','testimonials'].every(key=>Array.isArray(v[key])&&v[key].length<=3&&new Set(v[key]).size===v[key].length&&v[key].every(isEditorialId));
}

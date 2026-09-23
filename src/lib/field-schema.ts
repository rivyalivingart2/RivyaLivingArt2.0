import type {CustomField} from './product-form';

/** Shared by Studio, publication validation and server-resolved inquiry schemas. */
export function fieldSchemaIssues(value:unknown):string[]{
 if(!Array.isArray(value)||value.length<1||value.length>16)return ['Use between 1 and 16 fields.'];
 const errors:string[]=[],preceding=new Map<string,CustomField>(),labels=new Set<string>();
 const text=(v:unknown,max:number)=>typeof v==='string'&&!!v.trim()&&v.length<=max;
 for(const [index,f] of value.entries()){
  const at='Field '+(index+1)+': ';
  if(!f||typeof f!=='object'){errors.push(at+'invalid definition.');continue;}
  if(typeof f.id!=='string'||!/^[a-z][a-z0-9_]{0,30}$/.test(f.id)||['constructor','prototype'].includes(f.id)||preceding.has(f.id))errors.push(at+'use a unique stable field ID.');
  if(!text(f.label,100)||labels.has(String(f.label).trim().toLowerCase()))errors.push(at+'use a unique label within 100 characters.');
  if(!['text','select','number'].includes(f.type)||typeof f.required!=='boolean')errors.push(at+'choose a supported type and required state.');
  if(f.type==='select'&&(!Array.isArray(f.options)||!f.options.length||f.options.length>12||new Set(f.options.map((o:unknown)=>String(o).trim().toLowerCase())).size!==f.options.length||f.options.some((o:unknown)=>!text(o,80))))errors.push(at+'provide 1–12 distinct options within 80 characters.');
  if(f.hint!==undefined&&!text(f.hint,400))errors.push(at+'help text must fit within 400 characters.');
  if(f.maxLength!==undefined&&(!Number.isInteger(f.maxLength)||f.maxLength<1||f.maxLength>240))errors.push(at+'character limit must be 1–240.');
  if(f.min!==undefined&&(!Number.isInteger(f.min)||f.min<1||f.min>500)||f.max!==undefined&&(!Number.isInteger(f.max)||f.max<(f.min??1)||f.max>500))errors.push(at+'whole-number limits must be ordered within 1–500.');
  if(f.visibleWhen){const parent=preceding.get(f.visibleWhen.field);if(!parent||parent.type!=='select'||parent.visibleWhen||!parent.options?.includes(f.visibleWhen.value))errors.push(at+'condition must use an earlier, unconditional choice and one of its current options.');}
  preceding.set(f.id,f);labels.add(String(f.label).trim().toLowerCase());
 }
 return errors;
}

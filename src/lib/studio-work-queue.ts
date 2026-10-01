import {studioModules,studioModuleHref} from './studio-modules';
export const studioTasks=['today','overdue','unassigned','message-failed'] as const;
export type StudioTask=typeof studioTasks[number];
export const isStudioTask=(value:unknown):value is StudioTask=>typeof value==='string'&&(studioTasks as readonly string[]).includes(value);
export const studioTaskLabels:Record<StudioTask,string>={today:'Due today',overdue:'Overdue',unassigned:'Unassigned inquiries','message-failed':'Message preparation failed'};
export function studioTaskHref(task:StudioTask){return '/studio/inquiries?'+new URLSearchParams({task,mode:'list'});}
/** Navigation search shares the route/permission registry; it cannot invent a destination. */
export function studioDestinations(admin:boolean,query=''){
 const words=query.toLocaleLowerCase('en').trim().split(/\s+/).filter(Boolean);
 return studioModules.filter(m=>(admin||!m.adminOnly)&&words.every(word=>(m.label+' '+m.group+' '+m.aliases.join(' ')).toLocaleLowerCase('en').includes(word))).map(m=>({...m,href:studioModuleHref(m)}));
}
export type WorkQueueData={asOf:string;businessDate:string;scope:'all'|'assigned';counts:Record<StudioTask,number>;stages:{status:string;count:number}[];followups:{id:string;reference:string;title:string;status:string;followUp:string}[];editorial:{id:string;title:string;version:number;updatedAt:string}[];recent:{id:string;reference:string|null;title:string;status:string;updatedAt:string}[]};

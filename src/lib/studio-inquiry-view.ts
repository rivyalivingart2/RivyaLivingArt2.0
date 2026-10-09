import {isOrderStage} from './studio-orders';
import {isStudioTask} from './studio-work-queue';
export const inquiryFilterKeys=['q','stage','assignee','source','kind','product','category','from','to','task','follow','sort'] as const;
export type InquiryFilterKey=typeof inquiryFilterKeys[number];
export type InquiryView=Record<InquiryFilterKey,string>&{page:number;mode:'list'|'board';record:string;column:string};
const choice=(value:string,values:readonly string[],fallback='')=>values.includes(value)?value:fallback;
/** Only navigation state lives in the URL; notes, answers and draft edits stay in memory. */
export function readInquiryView(params:{get:(key:string)=>string|null},followups=false,legacyBoard=false):InquiryView{
 const get=(key:string,max=150)=>(params.get(key)||'').slice(0,max);
 return {q:get('q'),stage:isOrderStage(get('stage'))?get('stage'):'',assignee:get('assignee',40),source:choice(get('source'),['website','manual']),kind:choice(get('kind'),['product','bespoke']),product:get('product',100),category:get('category',80),from:get('from',10),to:get('to',10),task:isStudioTask(get('task'))?get('task'):'',follow:choice(get('follow'),['due','today','overdue','upcoming','all'],followups?'due':''),sort:choice(get('sort'),['newest','oldest','followup'],'newest'),page:Math.max(1,Math.min(100000,Math.floor(Number(get('page'))||1))),mode:choice(get('mode'),['list','board'],legacyBoard?'board':'list') as 'list'|'board',record:get('record',80),column:isOrderStage(get('column'))?get('column'):'NEW'};
}
export function inquiryViewParams(view:InquiryView,includeSelection=true){
 const params=new URLSearchParams();
 for(const key of inquiryFilterKeys)if(key!=='q'&&view[key])params.set(key,view[key]);
 params.set('page',String(view.page));params.set('mode',view.mode);params.set('column',view.column);
 if(includeSelection&&view.record)params.set('record',view.record);
 return params;
}
export function inquiryViewHref(path:string,view:InquiryView,patch:Partial<InquiryView>={}){
 if(!['/studio/inquiries','/studio/follow-ups','/studio/orders','/studio/kanban','/studio/enquiries'].includes(path))throw Error('Unsupported inquiry destination');
 return path+'?'+inquiryViewParams({...view,...patch});
}

export function inquiryRequestQuery(view:InquiryView){
 const params=inquiryViewParams(view,false);params.delete('mode');params.delete('column');if(view.q)params.set('q',view.q);return params.toString();
}

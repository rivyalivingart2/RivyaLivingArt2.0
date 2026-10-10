import {businessDatePreset,businessDayStart} from './business-time';
export function analyticsRange(from:string|null,to:string|null,now:Date|string|number=new Date()){
 const defaults=businessDatePreset(7,now),start=from||defaults.from,end=to||defaults.to;
 const fromInstant=businessDayStart(start),toStart=businessDayStart(end),days=Math.round((Date.parse(toStart)-Date.parse(fromInstant))/86400000)+1;
 if(days<1||days>366)throw new RangeError('Choose an inclusive range of 1–366 IST calendar days.');
 return {from:start,to:end,days,fromInstant,toExclusive:new Date(Date.parse(toStart)+86400000).toISOString(),previousFrom:new Date(Date.parse(fromInstant)-days*86400000).toISOString()};
}
export type StudioAnalytics={asOf:string;scope:'all'|'assigned';range:ReturnType<typeof analyticsRange>;totals:{received:number;website:number;manual:number;previous:number};stages:{status:string;count:number}[];days:{date:string;count:number}[]};

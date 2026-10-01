/** Date-only follow-ups are business dates, not UTC instants. Events remain UTC. */
export const BUSINESS_TIME_ZONE = 'Asia/Kolkata';
export const BUSINESS_TIME_LABEL = 'IST (UTC+05:30)';
/** Add calendar days to today's IST date, regardless of the device timezone. */
export function businessDateOffset(days:number,value:Date|string|number=new Date()):string{
 if(!Number.isSafeInteger(days)||Math.abs(days)>366)throw new RangeError('Unsupported date offset');
 const date=new Date(businessDate(value)+'T00:00:00Z');date.setUTCDate(date.getUTCDate()+days);return date.toISOString().slice(0,10);
}
const BUSINESS_MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'] as const;

export function businessDate(value: Date | string | number = new Date()): string {
 const date = new Date(value);
 if (!Number.isFinite(date.getTime())) throw new RangeError('Invalid business date');
 return new Intl.DateTimeFormat('en-CA', {timeZone: BUSINESS_TIME_ZONE, year:'numeric', month:'2-digit', day:'2-digit'}).format(date);
}

export function formatBusinessTime(value: string | Date): string {
 const date = new Date(value);
 if (!Number.isFinite(date.getTime())) return 'Date unavailable';
 const [year,month,day]=businessDate(date).split('-').map(Number);
 const time=new Intl.DateTimeFormat('en-IN',{
  timeZone:BUSINESS_TIME_ZONE,
  hour:'numeric',
  minute:'2-digit',
  hour12:true,
 }).format(date);
 return `${day} ${BUSINESS_MONTHS[month-1]} ${year}, ${time} IST`;
}

export function businessDayStart(date: string): string {
 if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0,10)!==date) throw new RangeError('Invalid business date');
 return new Date(date+'T00:00:00+05:30').toISOString();
}

/** Inclusive IST calendar range: today plus the preceding days, independent of the device timezone. */
export function businessDatePreset(days:1|7|30,value:Date|string|number=new Date()):{from:string;to:string}{
 if(![1,7,30].includes(days))throw new RangeError('Unsupported date preset');
 const to=businessDate(value);
 const from=new Date(to+'T00:00:00Z');
 from.setUTCDate(from.getUTCDate()-(days-1));
 return {from:from.toISOString().slice(0,10),to};
}

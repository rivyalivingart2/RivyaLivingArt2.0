/** Date-only follow-ups are business dates, not UTC instants. Events remain UTC. */
export const BUSINESS_TIME_ZONE = 'Asia/Kolkata';
export const BUSINESS_TIME_LABEL = 'IST (UTC+05:30)';
export function businessDate(value: Date | string | number = new Date()): string {
 const date = new Date(value);
 if (!Number.isFinite(date.getTime())) throw new RangeError('Invalid business date');
 return new Intl.DateTimeFormat('en-CA', {timeZone: BUSINESS_TIME_ZONE, year:'numeric', month:'2-digit', day:'2-digit'}).format(date);
}
export function formatBusinessTime(value: string | Date): string {
 const date = new Date(value);
 if (!Number.isFinite(date.getTime())) return 'Date unavailable';
 return new Intl.DateTimeFormat('en-IN', {timeZone: BUSINESS_TIME_ZONE, dateStyle:'medium', timeStyle:'short'}).format(date)+' IST';
}
export function businessDayStart(date: string): string {
 if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0,10)!==date) throw new RangeError('Invalid business date');
 return new Date(date+'T00:00:00+05:30').toISOString();
}

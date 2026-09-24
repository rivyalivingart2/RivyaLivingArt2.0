/** Owner-approved defaults. A hold never expires automatically when its review is due. */
export type RetentionRecord={lastContactAt:string;closedAt:string|null;becameOrder:boolean;ongoingFollowUp:boolean;holdReason:string};
const day=86400000;
function instant(value:string){const n=Date.parse(value);if(!Number.isFinite(n))throw new RangeError('Invalid retention date');return n;}
function anniversary(value:string){const date=new Date(instant(value)),month=date.getUTCMonth(),lastDay=new Date(Date.UTC(date.getUTCFullYear()+1,month+1,0)).getUTCDate();date.setUTCDate(Math.min(date.getUTCDate(),lastDay));date.setUTCFullYear(date.getUTCFullYear()+1);return date.getTime();}
export function retentionDecision(record:RetentionRecord,now:Date=new Date()){
 if(!Number.isFinite(now.getTime()))throw new RangeError('Invalid current date');
 const contact=instant(record.lastContactAt),closed=record.closedAt?instant(record.closedAt):null;
 const inquiryDue=record.becameOrder?(closed===null?null:anniversary(record.closedAt!)):contact+90*day;
 const referencesDue=record.becameOrder?(closed===null?null:closed+90*day):inquiryDue;
 const blocked=record.holdReason.trim()?'Documented retention hold':record.ongoingFollowUp?'Customer-requested ongoing follow-up':record.becameOrder&&closed===null?'Open order':null;
 return {inquiryDueAt:inquiryDue===null?null:new Date(inquiryDue).toISOString(),referencesDueAt:referencesDue===null?null:new Date(referencesDue).toISOString(),blocked,canEraseInquiry:!blocked&&inquiryDue!==null&&inquiryDue<=now.getTime(),canEraseReferences:!blocked&&referencesDue!==null&&referencesDue<=now.getTime()};
}

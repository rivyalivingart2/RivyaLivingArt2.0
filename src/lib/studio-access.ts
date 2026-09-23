import 'server-only';
import type {StaffSession} from './studio-auth';
import {studioDb} from './studio-db';
/** Do not authorize from client props or a hidden menu. Scope every record access. */
export async function canAccessInquiry(session:StaffSession,id:string){
 if(session.role==='admin')return true;
 if(!session.staffId)return false;
 const rows=await studioDb()`SELECT id FROM rivya_inquiries WHERE id=${id}::uuid AND assignee=${session.staffId}::uuid`;
 return rows.length===1;
}

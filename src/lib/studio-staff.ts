import 'server-only';
import {studioDb} from './studio-db';
import type {StaffSession} from './studio-auth';
import type {StaffMember} from '@/components/studio/workspace-api';

/** The same limited staff projection for the initial private page and access refresh. */
export async function workspaceStaff(session:StaffSession):Promise<StaffMember[]> {
 const staff=await studioDb()`SELECT id,login,name,role,active,version FROM rivya_staff ORDER BY name`;
 return (session.role==='admin'?staff:staff.filter(s=>s.active).map(s=>({id:s.id,name:s.name,role:s.role,active:s.active}))) as StaffMember[];
}

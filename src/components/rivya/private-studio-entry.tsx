import {Workspace} from '@/components/studio/workspace';
import {Suspense} from 'react';
import type {StaffSession} from '@/lib/studio-auth';
import {workspaceStaff} from '@/lib/studio-staff';
import {cookies} from 'next/headers';
export async function PrivateStudioEntry({session}:{session:StaffSession}) {
  // Pages authenticate before reaching this component. Never cache private identity.
  // A failed staff read retains the existing client retry and error presentation.
  const initial=await workspaceStaff(session).then(staff=>({session:{adminId:session.adminId,role:session.role,staffId:session.staffId},staff})).catch(()=>undefined);
  const collapsed=(await cookies()).get('rivya-studio-sidebar')?.value==='collapsed';
  return <Suspense fallback={<p role="status">Opening Studio…</p>}><Workspace initial={initial} initialCollapsed={collapsed}/></Suspense>;
}

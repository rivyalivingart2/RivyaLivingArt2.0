import {Workspace} from '@/components/studio/workspace';
import {Suspense} from 'react';
export function PrivateStudioEntry() {
  return <Suspense fallback={<p role="status">Opening Studio…</p>}><Workspace/></Suspense>;
}

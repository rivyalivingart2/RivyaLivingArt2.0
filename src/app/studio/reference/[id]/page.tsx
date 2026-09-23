import {notFound} from 'next/navigation';
import {requireStudioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {ReferenceViewer} from '@/components/studio/reference-viewer';
export const dynamic='force-dynamic';
export const metadata={title:'Private reference',robots:{index:false,follow:false,noarchive:true},referrer:'no-referrer' as const};
export default async function Page({params}:{params:Promise<{id:string}>}){
 const session=await requireStudioSession(),{id}=await params;
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))notFound();
 const rows=await studioDb()`SELECT r.id,i.id AS inquiry_id,i.reference FROM rivya_references r JOIN rivya_inquiries i ON i.id=r.inquiry_id WHERE r.id=${id}::uuid AND r.state='ready' AND (${session.role==='admin'} OR i.assignee=${session.staffId}::uuid)`;
 if(!rows.length)notFound();return <ReferenceViewer id={id} inquiryId={rows[0].inquiry_id} reference={rows[0].reference}/>;
}

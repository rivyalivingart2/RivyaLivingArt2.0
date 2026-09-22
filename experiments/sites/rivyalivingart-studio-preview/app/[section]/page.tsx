import {Experience} from '@/components/rivya/experience';
import {notFound} from 'next/navigation';
const routes=['collectible-design','memory-art','personal-art','commission','preserve','personalize','architects','journal','materials-care','materials','care','faq','about','our-story','process','portfolio','privacy','terms','shipping-delivery','returns-cancellations','accessibility','states','contact','search','studio'];
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;if(!routes.includes(section))notFound();return <Experience initialRoute={`/${section}`}/>}

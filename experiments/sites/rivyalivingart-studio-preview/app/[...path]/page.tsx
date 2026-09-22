import {Experience} from '@/components/rivya/experience';
import {notFound} from 'next/navigation';
export default async function Page({params}:{params:Promise<{path:string[]}>}){const {path}=await params;if(!['journal','portfolio','states','studio'].includes(path[0])||path.length>4)notFound();return <Experience initialRoute={'/'+path.join('/')}/>}

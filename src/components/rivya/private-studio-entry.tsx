'use client';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {DemoProvider} from '@/lib/rivya/demo-state';
import registry from '@/lib/rivya/demo-registry.json';
import {Studio} from './studio';
export function PrivateStudioEntry() {
  const router = useRouter(), path = usePathname(), query = useSearchParams();
  return <DemoProvider records={registry}><Studio authenticated route={path} search={query.size ? `?${query}` : ''} nav={href => router.push(href)}/></DemoProvider>;
}

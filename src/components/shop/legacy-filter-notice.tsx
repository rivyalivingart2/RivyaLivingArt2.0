'use client';
import {useSearchParams} from 'next/navigation';
export function LegacyFilterNotice(){
 const params=useSearchParams();
 if(params.get('legacyFilters')!=='reset')return null;
 return <p role="status">Some filters from the previous website are unavailable here. Supported search choices were retained; review the current filters below.</p>;
}

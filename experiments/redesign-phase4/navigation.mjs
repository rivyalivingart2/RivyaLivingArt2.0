// Static preview only. Real routes and interactions are tested on the built application.
export const usePathname=()=>'/portfolio';
export const useSearchParams=()=>new URLSearchParams();
export const useRouter=()=>({push(){throw Error('Static fixture navigation is disabled');}});
export const notFound=()=>{throw Error('Unexpected missing fixture');};

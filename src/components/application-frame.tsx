import type {ReactNode} from 'react';
/** Route shells own their navigation; unavailable routes must not revive the old fixture frame. */
export function ApplicationFrame({children}:{children:ReactNode}){
 return children;
}

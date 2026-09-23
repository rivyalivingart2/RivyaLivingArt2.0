import Link from "next/link";
import {businessContact} from "@/lib/contact";
export function BuildHoldingScreen({studio=false}:{studio?:boolean}){
 return <main id="main-content" tabIndex={-1} className="holding-page"><span className="eyebrow">RivyaLivingArt</span><h1>{studio?"The working side of the atelier.":"An atelier taking shape."}</h1><p>{studio?"Studio access is reserved for authorized staff.":"The public catalogue is not available in this environment."}</p>{studio?<Link className="text-link" href="/studio/login">Staff sign-in ↗</Link>:<a className="text-link" href={'mailto:'+businessContact.email}>Email the atelier ↗</a>}</main>;
}

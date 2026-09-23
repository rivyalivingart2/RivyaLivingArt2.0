"use client";
import {Experience} from './experience';
import './approved-experience.css';
/** Presentation adapter only. Server pages enforce public release or private-session boundaries. */
export function ApprovedExperience({initialRoute}:{initialRoute:string}){return <div id="approved-root" className="approved-experience"><Experience initialRoute={initialRoute}/></div>}

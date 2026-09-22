"use client";
import {Experience} from './experience';
import './approved-experience.css';
/** Presentation adapter only. Server pages retain their existing preview guards. */
export function ApprovedExperience({initialRoute}:{initialRoute:string}){return <div id="approved-root" className="approved-experience"><Experience initialRoute={initialRoute}/></div>}

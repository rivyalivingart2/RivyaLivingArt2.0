/** Only substantiated, owner-approved completed projects belong here.
 * Eight inherited fictional examples remain preserved in their original source. */
export type RealProject={slug:string;title:string;description:string;image:string;imageAlt:string;context:string;brief:string;response:string;details:{label:string;value:string}[];gallery:{src:string;alt:string;caption:string}[];approvalRecord:string};
export const approvedProjects:RealProject[]=[];

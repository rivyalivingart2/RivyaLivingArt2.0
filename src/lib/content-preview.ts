/** Small client-safe URL helper; source catalogue candidates stay out of this import. */
export function previewHref(id:string,version:number,mobile=false){return '/studio/preview?'+new URLSearchParams({record:id,version:String(version),...(mobile?{viewport:'mobile'}:{})});}

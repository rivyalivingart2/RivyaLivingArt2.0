/** Interactive filters in a saved preview must keep the same authenticated revision. */
export function discoveryPreviewUrl(href:string,currentPath:string,params:Pick<URLSearchParams,'get'>){
 if(currentPath!=='/studio/preview/frame')return href;
 const record=params.get('record'),version=params.get('version');
 if(!record||!version)return href;
 const query=new URLSearchParams(href.split('?')[1]||'');query.set('record',record);query.set('version',version);
 return currentPath+'?'+query.toString();
}

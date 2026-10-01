const uuid='[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
export const isCustomPageId=(id:unknown):id is string=>typeof id==='string'&&new RegExp('^custom-page:'+uuid+'$').test(id);
export const isCustomPageRoute=(route:string)=>/^\/p\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(route)&&route.length<=103;

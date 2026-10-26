import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
import {publishedDesignQuery} from './published-design-query';
import {getPublicationAdapter} from './published-source';

/** Dedupe only within this render. Each new request reads current publication. */
export const publishedDesignSource=cache(async()=>{
 const adapter = getPublicationAdapter();
 if (adapter) {
   const presentation = await adapter.getPublishedPresentation();
   return {presentation, orders: []};
 }
 try {
  const rows=await studioDb().query(publishedDesignQuery);
  return rows[0];
 }catch(error){
  // The additive design tables may not exist before their explicit migration.
  if((error as {code?:string}).code==='42P01')return {presentation:null,orders:[]};
  throw error;
 }
});

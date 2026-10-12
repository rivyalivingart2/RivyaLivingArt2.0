import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
import {publishedDesignQuery} from './published-design-query';

/** Dedupe only within this render. Each new request reads current publication. */
export const publishedDesignSource=cache(async()=>{
 try {
  const rows=await studioDb().query(publishedDesignQuery);
  return rows[0];
 }catch(error){
  // The additive design tables may not exist before their explicit migration.
  if((error as {code?:string}).code==='42P01')return {presentation:null,orders:[]};
  throw error;
 }
});

import 'server-only';
import {cache} from 'react';
import {publishedShellSource} from './published-shell-source';
import type {PublicDestination} from './navigation-availability';
/** Small publication projections shared by header/footer. No drafts or private fields leave this module. */
export const navigationDestinations=cache(async():Promise<{documents:PublicDestination[];products:string[]} >=>{
 try{
  const {pages,products}=await publishedShellSource() as {pages:{route:string;sections:{id:string;enabled?:boolean}[];home_sections:{id:string;enabled:boolean;contentNeeded?:boolean}[]|null}[];products:{slug:string}[]};
  return {documents:pages.map(p=>({route:p.route,anchors:(p.sections as {id:string;enabled?:boolean}[]).filter(s=>s.enabled!==false&&(!p.home_sections||(p.home_sections as {id:string;enabled:boolean;contentNeeded?:boolean}[]).some(h=>h.id===s.id&&h.enabled&&!h.contentNeeded))).map(s=>s.id)})),products:products.filter(p=>typeof p.slug==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)).map(p=>'/pieces/'+p.slug)};
 }catch{return {documents:[],products:[]};}
});

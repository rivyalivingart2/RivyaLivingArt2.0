import 'server-only';
import {cache} from 'react';
import {compilePageSnapshot} from './page-dependencies';
import {publishedSource} from './published-source';
import {compileHomepageSnapshot,type DependencySource} from './homepage-dependencies';
import type {ContentDocument} from './content-model';

export const homepageDependencies=cache(async()=>{
 const source=await publishedSource();
 return {...source,content:source.content.filter(r=>r.key!=='page:home')} as DependencySource;
});
export async function captureHomepage(document:ContentDocument){return compileHomepageSnapshot(document,await homepageDependencies());}

export async function capturePage(document:ContentDocument){return compilePageSnapshot(document,await homepageDependencies());}

import {renderToStaticMarkup} from 'react-dom/server';
import {writeFileSync} from 'node:fs';
import {HomepageDocument} from '../../src/components/shop/homepage-document';
import {homeCandidate} from '../../src/lib/homepage-model';
import {baselineContent} from '../../src/lib/content-model';
import {baselineProducts} from '../../src/lib/shop-model';
import {approvedPublicMedia} from '../../src/lib/public-media';
import {compileHomepageSnapshot} from '../../src/lib/homepage-dependencies';
import {compileHomeReference} from '../../src/lib/home-reference-dependencies';
import {materialFilm} from '../../src/lib/presentation-media';
import type {HomepageLayout} from '../../src/lib/presentation-model';
import s from '../../src/components/shop/shop.module.css';
import {ImageConfigContext} from 'next/dist/shared/lib/image-config-context.shared-runtime.js';
import {imageConfigDefault} from 'next/dist/shared/lib/image-config.js';
import nextConfig from '../../next.config';

const row=(key:string,document:unknown)=>({key,document,version:1,fingerprint:'local-fixture'});
// Public source fixtures only. No database connection or record write.
const source={products:baselineProducts.map(p=>row(p.id,p)),content:baselineContent.filter(d=>d.id!=='page:home').map(d=>row(d.id,d)),media:approvedPublicMedia.map(m=>row(m.path,m))};
const home=structuredClone(homeCandidate);
const journal=home.homepage!.sections.find(s=>s.type==='journal')!;
journal.enabled=true;journal.contentNeeded=false;journal.articleIds=baselineContent.filter(d=>d.kind==='article').slice(0,3).map(d=>d.id);
home.homeSnapshot=compileHomepageSnapshot(home,source);
const reference=compileHomeReference(source),image=home.homepage!.sections.find(s=>s.image)?.image;
reference.mediaPaths=home.homeSnapshot.mediaPaths;
reference.portfolio=[{id:'phase3-fixture',classification:'concept',title:'A material study for an imagined room',description:'Synthetic layout fixture only. This is not a completed commission or a new published record.',href:'/portfolio',image}];
reference.feedback=[{id:'phase3-fixture',classification:'fictional-sample',quote:'Sample wording to demonstrate the quotation layout and disclosure. This is not customer feedback.',attribution:'Illustrative voice',href:'/testimonials',image}];
reference.workshops={title:'Workshop layout preview',description:'Synthetic fixture only; this does not announce a real event.',href:'/workshops',confirmationSource:'Local layout fixture, not business approval',image,facts:[{label:'Status',value:'Layout demonstration only'}]};
reference.printing={...reference.workshops,title:'Printing layout preview',href:'/contact'};
for(const variant of ['all','classic','editorial','empty'] as const){
 const document=structuredClone(home);
 if(variant==='editorial')document.homepage!.heroImage=image;
 if(variant==='empty'){document.homeSnapshot!.products=[];document.homeSnapshot!.articles=[];document.homeSnapshot!.mediaPaths=[];}
 const layout:HomepageLayout={schemaVersion:1,hero:variant==='editorial'?'cinematic':'split',manifesto:'strip',featured:'row',...(variant!=='classic'?{composition:{schemaVersion:1,template:'reference',hidden:[]}}:{}),film:'resin-pour'};
 const markup=renderToStaticMarkup(<ImageConfigContext.Provider value={{...imageConfigDefault,...nextConfig.images}}><div className={s.site}><HomepageDocument document={document} revision={1} presentation={{layout,version:1}} reference={reference} film={materialFilm}/></div></ImageConfigContext.Provider>);
 writeFileSync('output/redesign-phase3/'+variant+'.markup.html',markup);
}

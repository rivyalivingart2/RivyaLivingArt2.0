import {renderToStaticMarkup} from 'react-dom/server';
import {writeFileSync} from 'node:fs';
import {ImageConfigContext} from 'next/dist/shared/lib/image-config-context.shared-runtime.js';
import {imageConfigDefault} from 'next/dist/shared/lib/image-config.js';
import nextConfig from '../../next.config';
import {CinematicCanvas} from '../../src/components/design-foundation/cinematic-canvas';
import {JourneyLanguage} from '../../src/components/shop/journey-language';
import {ChapterMedia,LegacyChapterMedia} from '../../src/components/shop/chapter-media';
import {ReferenceChapter} from '../../src/components/shop/reference-chapters';
import {CollectionDocument} from '../../src/components/shop/collection-document';
import {LandingDocumentView} from '../../src/components/shop/landing-document';
import {homeCandidate,type EditorialUsage} from '../../src/lib/homepage-model';
import type {ContentSection} from '../../src/lib/content-model';
import type {PublishedContentDocument} from '../../src/lib/published-content';
import type {PageSnapshot} from '../../src/lib/page-dependencies';
import type {LandingEntry} from '../../src/lib/landing-dependencies';
import type {PageDesign} from '../../src/lib/page-design-model';
import {landingTypes,type LandingBlock} from '../../src/lib/landing-model';
import {baselineProducts} from '../../src/lib/shop-model';
import s from '../../src/components/shop/shop.module.css';
import pages from '../../src/components/shop/public-pages.module.css';
import r from '../../src/components/shop/reference-pages.module.css';

// Synthetic, memory-only public projection. No publication/database reader is imported.
// build.mjs replaces the optional business reader with a guard that throws if invoked.
const out='output/sitewide-cinematic';
const existing=homeCandidate.homepage!.sections.find(section=>section.image)!.image!;
const image:EditorialUsage={...existing,alt:'Existing approved timber and resin visualization reused in a synthetic layout specimen',caption:'Synthetic layout specimen. Existing design visualization; no project or commission is implied.'};
const longCaption='Synthetic layout specimen only. This existing design visualization is reused to test a long stationary caption at narrow widths. It is a visual reference, not a completed customer commission, a verified making-stage photograph, or a rendering of a proposed brief. The full caption must wrap naturally without hiding the text, covering the nearby heading, or forcing the page beyond the viewport. All wording in this specimen is invented for layout testing and is not a business statement.';
const longImage:EditorialUsage={...image,caption:longCaption};
const gallery:EditorialUsage[]=[image,{...image,alt:'Second synthetic gallery placement of the approved visualization',desktop:{...image.desktop,x:35},mobile:{...image.mobile,x:35}},{...image,alt:'Third synthetic gallery placement of the approved visualization',desktop:{...image.desktop,x:65},mobile:{...image.mobile,x:65}}];
const products=baselineProducts.slice(0,3).map((product,index)=>({...product,id:'LOCAL-SPECIMEN-'+(index+1),slug:'local-layout-specimen-'+(index+1),name:'Synthetic product layout '+(index+1),subtitle:'Static specimen only; not a new product',story:'Synthetic product text for a layout specimen. The existing approved image is reused without saving any media association.'}));
const mediaPaths=[...new Set([image.path,...products.flatMap(product=>[product.image,product.scene].filter((path):path is string=>!!path))])];
const snapshot=():PageSnapshot=>({schemaVersion:1,products,articles:[],mediaPaths,categories:[{name:'Synthetic specimens',count:3,tiers:['large']}],dependencies:[],issues:[],unavailableActionHrefs:[],availableRoutes:[]});
const design:PageDesign={schemaVersion:1,hero:'full',chapters:'alternating',styles:{},shared:[]};
const text='Synthetic layout copy only. This paragraph checks reading width, line height and the relationship between a full-bleed image and its text. It does not describe an existing product, customer or agreed specification.';
const section=(id:string,layout:ContentSection['layout']='split'):ContentSection=>({id,layout,enabled:true,heading:'A synthetic material study.',paragraphs:[text,'A second paragraph tests vertical rhythm when the content needs more space. The section should grow naturally on a small screen.'],image:longImage});

type Specimen={name:string;title:string;targets:string[];notes:string[]};
const specimens:Specimen[]=[];
function capture(specimen:Specimen,body:React.ReactNode){
 const markup=renderToStaticMarkup(<ImageConfigContext.Provider value={{...imageConfigDefault,...nextConfig.images}}><JourneyLanguage locale="en"><CinematicCanvas><div className={s.site}><main className={pages.surface} id="main-content">{body}</main></div></CinematicCanvas></JourneyLanguage></ImageConfigContext.Provider>);
 writeFileSync(out+'/'+specimen.name+'.markup.html',markup);
 specimens.push(specimen);
}
const notes=['Static server markup using real source components and CSS. No hydration, active cursor lighting, parallax, playback or working form/navigation controls.','Existing approved media is reused; all specimen text is explicitly synthetic and nothing is saved or published.'];
function standaloneMedia(legacy=false){
 return <div className={r.reference}><section className={r.chapter} data-public-part="chapter" data-immersive="true" data-chapter-style="split" data-atmosphere="media" aria-labelledby="specimen-heading">
  {legacy?<LegacyChapterMedia src={image.path} alt={image.alt} position="32% 48%" priority/>:<ChapterMedia usage={longImage} priority/>}
  <div className={r.chapterMarker} data-public-part="chapter-marker"><span className={r.number}>LOCAL SPECIMEN</span></div>
  <div className={r.chapterBody} data-public-part="chapter-copy"><h1 id="specimen-heading">A complete caption, at every width.</h1><p>{text}</p></div>
 </section></div>;
}
capture({name:'chapter-media-long-caption',title:'ChapterMedia — long caption at 320px',targets:['ChapterMedia','stationary complete caption','320px wrapping'],notes},standaloneMedia());
capture({name:'legacy-chapter-media',title:'LegacyChapterMedia — focal position and credit',targets:['LegacyChapterMedia','legacy focal position','design visualization credit'],notes},standaloneMedia(true));
for(const layout of ['split','reverse'] as const){
 capture({name:'reference-'+layout,title:'ReferenceChapter — '+layout,targets:['ReferenceChapter',layout,'full-bleed chapter','long caption'],notes},<div className={r.reference}><ReferenceChapter section={section('reference-'+layout,layout)} design={design} index={layout==='split'?0:1} mediaPaths={mediaPaths}/></div>);
}
capture({name:'reference-checklist',title:'ReferenceChapter — checklist stays content-led',targets:['ReferenceChapter','checklist','contained media','natural height'],notes},<div className={r.reference}><ReferenceChapter section={{...section('reference-checklist'),heading:'A checklist needs room to read.',checklist:['Synthetic first check: the image stays contained beside detailed text.','Synthetic second check: long checklist items wrap without clipping or horizontal scrolling.','Synthetic third check: this is static test content and carries no factual product claim.']}} design={design} index={0} mediaPaths={mediaPaths}/></div>);

const collection:PublishedContentDocument={id:'local-collection-specimen',kind:'page',route:'/collectible-design',title:'A synthetic collection cover.',eyebrow:'LOCAL LAYOUT SPECIMEN',description:'Synthetic collection specimen with an existing image, a long caption, saved full-cover presentation and a natural-height browse area.',publishedRevision:1,headerImage:longImage,sections:[{...section('collection-story'),heading:'A chapter beneath the cover.'},{id:'browse',heading:'Synthetic product layouts.',paragraphs:['These cards test the existing catalogue layout. They are not new catalogue records or offers.'],enabled:true}],pageSnapshot:snapshot()};
capture({name:'collection-full-hero',title:'CollectionDocument — saved full hero',targets:['CollectionDocument','full saved hero','long caption','ReferenceChapter','catalogue natural height'],notes},<CollectionDocument document={collection} design={design} designVersion={1}/>);

function entry(kind:'portfolio'|'testimonial'|'faq'|'journal'|'collection',index=1):LandingEntry{
 const prefix=kind==='testimonial'?'testimonials':kind==='journal'?'journal':kind==='collection'?'p':kind;
 return {id:'local-'+kind+'-'+index,route:'/'+prefix+'/static-layout-'+index,title:kind==='testimonial'?'A fictional layout statement.':'Synthetic '+kind+' example '+index,description:'Local static layout specimen. No real project, customer, article or new publication is represented.',eyebrow:'LOCAL LAYOUT SPECIMEN',sections:[{id:'text',heading:'Synthetic specimen text.',paragraphs:[kind==='testimonial'?'This invented sentence exists only to show the testimonial composition. It is not customer feedback.':text]}],...(kind==='testimonial'?{editorial:{schemaVersion:1 as const,kind:'testimonial' as const,classification:'fictional' as const,attribution:'Illustrative voice — static fixture'}}:kind==='portfolio'?{image,editorial:{schemaVersion:1 as const,kind:'portfolio' as const,classification:'concept' as const}}:kind==='faq'?{editorial:{schemaVersion:1 as const,kind:'faq' as const,classification:'guidance' as const}}:{image})};
}
for(const type of landingTypes){
 const id='specimen-'+type.toLowerCase();
 const block:LandingBlock={id,type,enabled:true,heading:'Synthetic '+type.replace(/([A-Z])/g,' $1').toLowerCase()+' layout.',eyebrow:'LOCAL BLOCK SPECIMEN',paragraphs:[text],...(type==='finalCta'?{whatsapp:false}:{}),
  ...(['hero','imageCta','finalCta'].includes(type)?{image:longImage,action:{href:'#static-specimen',label:'Static action specimen'}}:{}),
  ...(type.includes('Gallery')?{gallery}:{}),
  ...(['videoHero','videoStory'].includes(type)?{film:'resin-pour' as const}:{}),
  ...(type==='imageCta'?{side:'end' as const}:{}),
 };
 const state=snapshot();state.landing={entries:{},productIds:{}};
 if(type==='productGrid')state.landing.productIds[id]=products.map(product=>product.id);
 const entryKind=type==='faqPicker'?'faq':type==='collectionGrid'?'collection':type==='portfolioGrid'?'portfolio':type==='journalGrid'?'journal':type==='testimonial'||type==='testimonialGrid'?'testimonial':null;
 if(entryKind)state.landing.entries[id]=Array.from({length:type==='testimonial'?1:3},(_,index)=>entry(entryKind,index+1));
 const document:PublishedContentDocument={id:'local-landing-'+type,kind:'page',route:'/p/local-'+type.toLowerCase(),title:'Synthetic landing block: '+type,eyebrow:'STATIC LAYOUT SPECIMEN',description:'One isolated block from the existing landing renderer. No draft, published record or business information is changed.',sections:[],publishedRevision:1,landing:{schemaVersion:1,blocks:[block]},pageSnapshot:state};
 // The component remains its actual async implementation. All WhatsApp flags are off;
 // the build-only business reader guard must never be called.
 const rendered=await LandingDocumentView({document});
 capture({name:'landing-'+type,title:'LandingDocumentView — '+type,targets:['LandingDocumentView',type],notes:[...notes,...(type==='faqPicker'?['The generated specimen shows native details open for text-layout inspection only.']:[])]},rendered);
}
writeFileSync(out+'/fixture-manifest.json',JSON.stringify({schemaVersion:1,generatedAt:new Date().toISOString(),source:'Existing application components; synthetic memory-only public projections',database:'No reader/import/call; optional business import replaced with a throwing build guard',interaction:'Static inert markup; no client bundle',specimens},null,2)+'\n');

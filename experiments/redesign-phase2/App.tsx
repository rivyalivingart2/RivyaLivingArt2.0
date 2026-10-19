import {useEffect,useRef,useState} from 'react';
import {Button,Field,Section,Status} from './foundation/primitives';
import {ResponsivePicture,type PictureAsset} from './foundation/ResponsivePicture';
import {MaterialFilm} from './foundation/MaterialFilm';
import {MotionSurface} from './foundation/MotionSurface';
import {useMotionCapability} from './foundation/motion-capability';
import manifest from './media-manifest.json';
import content from '../redesign-phase1/preview-data.json';

type Asset=PictureAsset & {title:string;slot:string;sourceUrl:string;sourceBytes:number;classification:string};
const media=manifest.map<Asset>(asset=>({...asset,
  desktop:[asset.desktop[0]??50,asset.desktop[1]??50],
  mobile:[asset.mobile[0]??50,asset.mobile[1]??50],
  variants:asset.variants.map(variant=>{
    if(variant.format!=='avif'&&variant.format!=='webp')throw new Error('Unsupported preview image format');
    return {...variant,format:variant.format};
  })
}));
const room:PictureAsset={id:'river-channel',alt:'River Channel design visualization',width:1920,height:1080,desktop:[56,50],mobile:[54,50],variants:[{src:'/assets/room.webp',width:1920,format:'webp'}]};

function StudioControls(){
  const [query,setQuery]=useState(''),[saved,setSaved]=useState(false);
  return <main id="main" className="studio-preview rv-light"><aside><img src="/assets/logo.png" alt="Rivya Living Art"/><p>Studio</p><a href="#controls">Media library</a><a href="/">Back to animation preview</a><p className="small">Local controls specimen. No connection to your Studio records.</p></aside><div id="controls" className="studio-body"><h1>Media library</h1><p>Find an image, inspect its crop and keep the work in view.</p><Field label="Search preview images" placeholder="Try resin or memory" value={query} onChange={e=>setQuery(e.target.value)}/><div className="studio-results">{media.filter(a=>`${a.title} ${a.alt}`.toLowerCase().includes(query.toLowerCase())).map(a=><div key={a.id} className="studio-row"><ResponsivePicture asset={a} sizes="96px"/><div><h2>{a.title}</h2><p>{a.width} × {a.height} · {(a.sourceBytes/1024).toFixed(0)} KB original</p><span>Supplied visualization · local selection</span></div></div>)}{!media.some(a=>`${a.title} ${a.alt}`.toLowerCase().includes(query.toLowerCase()))&&<p role="status">No preview images match. Try a different search.</p>}</div><div className="control-states"><h2>Control states</h2><Field label="Caption example" defaultValue="Material visualization" hint="This field is a local interaction sample."/><Field label="Required source example" error="Add a source before publishing." defaultValue=""/><div className="button-row"><Button variant="studio" onClick={()=>setSaved(true)}>Test local confirmation</Button><Button variant="studio" disabled>Publish unavailable in preview</Button></div><Status>{saved?'Local confirmation shown. No record was saved.':'Changes here stay in this preview.'}</Status></div></div></main>;
}

export function App({studio=false}:{studio?:boolean}){
  const [enabled,setEnabled]=useState(true),[smooth,setSmooth]=useState(true),[selected,setSelected]=useState<Asset|null>(null);
  const capable=useMotionCapability();
  const dialog=useRef<HTMLDialogElement>(null),restoreFocus=useRef<HTMLElement|null>(null);
  useEffect(()=>{
    if(!selected)return;
    const el=dialog.current;if(!el)return;
    restoreFocus.current=document.activeElement as HTMLElement;
    const overflow=document.body.style.overflow;
    el.showModal();document.body.style.overflow='hidden';
    return()=>{el.close();document.body.style.overflow=overflow;restoreFocus.current?.focus({preventScroll:true});};
  },[selected]);
  return <div className="rv-foundation"><a className="skip" href="#main">Skip to content</a><div className={studio?"review-bar review-bar--studio":"review-bar"}><a className={!studio?'current':''} href="/">Animation</a><a href="/#media">Media & crops</a><a className={studio?'current':''} href="/studio">Studio controls</a><span>Phase 2 · local preview</span>{!studio&&<div className="motion-controls"><button aria-pressed={enabled&&capable} disabled={!capable} onClick={()=>setEnabled(!enabled)}>{capable?`Motion ${enabled?'on':'off'}`:'Static motion'}</button><button aria-pressed={smooth&&enabled&&capable} disabled={!enabled||!capable} onClick={()=>setSmooth(!smooth)}>{capable?`Smooth scroll ${smooth&&enabled?'on':'off'}`:'Native scrolling'}</button></div>}</div>
    {studio?<StudioControls/>:<MotionSurface enabled={enabled} smooth={smooth} paused={!!selected}><header className="public-header"><a href="/" className="logo"><img src="/assets/logo.png" alt="Rivya Living Art"/></a><nav aria-label="Preview sections"><a href="#material">Material film</a><a href="#media">Explore media</a><a href="#reading">Reading rhythm</a></nav></header><main id="main"><section className="opening"><div className="opening-copy"><h1>Made to hold<br/>your attention.</h1><p>{content.products.DP001.story}</p><a className="rv-button rv-button--primary" href="#material">Explore the material <Arrow/></a><p className="small">Animation study · River Channel design visualization</p></div><div className="opening-image" data-rv-parallax><ResponsivePicture asset={room} sizes="(max-width:800px) 100vw,57vw" priority/></div></section>
    <Section id="material" className="material-section"><div><h2 data-rv-reveal>Colour in motion.<br/>Form at rest.</h2><p>A close look at the material, with movement that follows your pace.</p><p className="small">The film is a material visualization, not footage offered as proof of a finished customer project. It starts only when you choose Play film.</p><a href="#media" className="text-link">See the image collection <Arrow/></a></div><MaterialFilm poster="/assets/film-poster.jpg" mp4="/assets/film.mp4" webm="/assets/film.webm" description="Eight-second blue and gold material visualization. Silent loop; no spoken content."/></Section>
    <Section id="media" className="media-section"><div className="section-heading"><h2 data-rv-reveal>A closer look.</h2><p>Six images from your Drive folder. Open an image to compare the full composition with its proposed portrait crop.</p></div><div className="media-grid">{media.map((asset,i)=><figure key={asset.id} className={`media-item media-item--${i}`}><button className="image-open" onClick={()=>setSelected(asset)} aria-label={`Inspect ${asset.title} crops`}><div className="media-frame"><ResponsivePicture asset={asset} sizes="(max-width:800px) 88vw, (max-width:1100px) 43vw, 28vw"/></div><span>Inspect image <Arrow/></span></button><figcaption><h3>{asset.title}</h3><p>{asset.classification}</p><a href={asset.sourceUrl} target="_blank" rel="noopener noreferrer">View Drive source</a></figcaption></figure>)}</div></Section>
    <Section id="reading" className="reading-section rv-light"><div><h2>{content.article.title}</h2><p className="reading-intro">{content.article.intro}</p></div><article><h3>{content.article.sections[0].heading}</h3>{content.article.sections[0].paragraphs.map(p=><p key={p}>{p}</p>)}<a href="https://www.rivyalivingart.com/journal/a-room-begins-with-a-statement-table" target="_blank" rel="noopener noreferrer">Read the published article</a><p className="small">Existing Journal excerpt, preserved verbatim. Reading text does not animate.</p></article></Section>
    <Section className="closing"><h2>Movement with room<br/>to breathe.</h2><p>Desktop image parallax and native smooth anchor navigation are available above. Touch screens and reduced-motion settings use native scrolling and still compositions.</p><div className="button-row"><a className="rv-button rv-button--primary" href="#main">Return to opening <Arrow/></a><a className="rv-button rv-button--secondary" href="/studio">Try Studio controls</a></div></Section></main><footer>Rivya Living Art · Phase 2 foundation preview. Content and media selections are not published from this page.</footer></MotionSurface>}
    <dialog ref={dialog} onCancel={()=>setSelected(null)} aria-labelledby="crop-title" className="crop-dialog rv-light">{selected&&<><div className="dialog-heading"><h2 id="crop-title">{selected.title}</h2><Button variant="secondary" onClick={()=>setSelected(null)}>Close preview</Button></div><div className="crop-grid"><figure><div className="full-crop"><ResponsivePicture key={`${selected.id}-full`} asset={selected} sizes="(max-width:800px) 85vw,42vw"/></div><figcaption>Full composition · source ratio</figcaption></figure><figure><div className="portrait-crop"><ResponsivePicture key={selected.id} asset={selected} sizes="(max-width:800px) 85vw,32vw"/></div><figcaption>Proposed portrait crop · 4:5</figcaption></figure></div><p>{selected.alt}. Crop review only; saved Studio crops stay unchanged.</p><a href={selected.sourceUrl} target="_blank" rel="noopener noreferrer">Open original in Drive</a></>}</dialog>
  </div>;
}
function Arrow(){return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12h15M13 5l7 7-7 7"/></svg>;}

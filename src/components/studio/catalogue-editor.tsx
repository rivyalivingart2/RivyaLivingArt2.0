'use client';
import {CustomizationFields} from '@/components/shop/customization-fields';
import {useRecordSwitch,RecordSwitchNotice} from './record-switch';
import {RecordStatus} from './record-status';
import {DraftRecovery} from './draft-recovery';
import {useLinkedRecord,LinkedRecordNotice} from './linked-record';
import {publicationState,draftState} from '@/lib/content-health';
import {useEffect,useState} from 'react';
import type {ShopProduct,CustomField,ProductTranslation} from '@/lib/shop-model';
import {localeLabels,locales,type Locale} from '@/lib/site-settings-model';
import {fieldVisible,productFields,hasReviewedCapabilities} from '@/lib/product-form';
import {fieldSchemaIssues} from '@/lib/field-schema';
import type {PublicMedia} from '@/lib/public-media';
import {studioFetch} from './workspace-api';
import s from './workspace.module.css';
import {RevisionHistory} from './revision-history';
import {usePagination, Pagination} from './pagination';
import {ProductComparison,ProductGalleryEditor} from './product-details';
import {Plus,RefreshCw,X,ExternalLink} from 'lucide-react';

type Entry={product:ShopProduct;reviewedImages?:{image:string;scene:string|null;gallery:NonNullable<ShopProduct['gallery']>};version:number;publishedVersion:number;visible:boolean;hasDraft:boolean;published:ShopProduct|null};

export function CatalogueEditor({admin}:{admin:boolean}){
 const [editing,setEditing]=useState(false);
 const [loaded,setLoaded]=useState(false),[publicationFilter,setPublicationFilter]=useState('all');
 const [media,setMedia]=useState<PublicMedia[]>([]),[preview,setPreview]=useState(false),[previewAnswers,setPreviewAnswers]=useState<Record<string,string>>({});
 const [activeTab,setActiveTab]=useState<string>('general');
 const [translationLocale,setTranslationLocale]=useState<Locale>('hi');
 const [entries,setEntries]=useState<Entry[]>([]),[entry,setEntry]=useState<Entry|null>(null),[query,setQuery]=useState(''),[tierFilter,setTierFilter]=useState<'all'|'large'|'memory'|'personal'>('all'),[busy,setBusy]=useState(false),[message,setMessage]=useState('Loading catalogue…'),[dirty,setDirty]=useState(false);
 async function load(id?:string){const data=await studioFetch('/api/studio/workspace?view=catalogue');setEntries(data.products);setLoaded(true);if(id)setEntry(data.products.find((e:Entry)=>e.product.id===id)||null);}
 useEffect(()=>{void studioFetch('/api/studio/media').then(d=>setMedia(d.media.map((e:{media:PublicMedia;reviewedMedia:PublicMedia})=>e.reviewedMedia||e.media))).catch(()=>setMessage('Approved image choices are temporarily unavailable.'));void studioFetch('/api/studio/workspace?view=catalogue').then(data=>{setEntries(data.products);setLoaded(true);setMessage('Drafts are shared across devices. Only published content appears on the website.');}).catch(e=>setMessage(e.message));},[]);
 useEffect(()=>{const warn=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
 function change(p:Partial<ShopProduct>){if(!editing){setMessage('Protected review: open the existing editing controls only for an authorized catalogue change.');return;}setEntry(e=>e?{...e,product:{...e.product,...p}}:null);setDirty(true);}
 function field(index:number,patch:Partial<CustomField>){if(entry)change({fields:entry.product.fields.map((f,i)=>i===index?{...f,...patch}:f)});}
 const schemaIssues=entry?fieldSchemaIssues(entry.product.fields):[];
 const tabIssues=entry?{
  general:[
   !entry.product.name.trim()?'Name is required.':null,
   !entry.product.subtitle.trim()?'Subtitle is required.':null,
   !entry.product.category.trim()?'Category is required.':null,
   !entry.product.slug.trim()?'Public address is required.':null,
   entry.product.id.startsWith('RLA-')&&!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.product.slug)?'Public address must use lowercase words separated by hyphens.':null,
  ].filter((v):v is string=>Boolean(v)),
  details:[!entry.product.story.trim()?'Product story is required.':null].filter((v):v is string=>Boolean(v)),
  images:[!entry.product.image.trim()?'Primary image is required.':null].filter((v):v is string=>Boolean(v)),
  customization:schemaIssues,
  translations:[] as string[],
  history:[] as string[],
 }:{general:[] as string[],details:[] as string[],images:[] as string[],customization:[] as string[],translations:[] as string[],history:[] as string[]};
 function productTranslation(patch:Partial<ProductTranslation>){if(!entry||translationLocale==='en')return;change({translations:{...(entry.product.translations||{}),[translationLocale]:{...(entry.product.translations?.[translationLocale]||{}),...patch}}});}
 function moveField(index:number,delta:number){if(!entry)return;const fields=[...entry.product.fields];[fields[index+delta],fields[index]]=[fields[index],fields[index+delta]];const issues=fieldSchemaIssues(fields);if(issues.length){setMessage(issues.join(' '));return;}change({fields});}
 async function save(operation:'draft'|'publish'|'hide'){
  if(!entry||busy)return;
  if(operation!=='hide'){
   const issueTab=(['general','details','images','customization'] as const).find(tab=>tabIssues[tab].length);
   if(issueTab){setActiveTab(issueTab);setMessage(tabIssues[issueTab].join(' '));return;}
  }
  setBusy(true);setMessage('Saving…');
  try{await studioFetch('/api/studio/workspace',{action:'catalogue',product:entry.product,version:entry.version,operation});setEntry({...entry,version:entry.version+1});setDirty(false);await load(entry.product.id);setMessage(operation==='publish'?'Published. New website requests now use this version.':operation==='hide'?'This piece is hidden from the public catalogue.':'Draft saved to the shared catalogue.');}catch(e){setMessage(e instanceof Error?e.message:'Unable to save.');}finally{setBusy(false);}
 }

 const filteredEntries = entries.filter(e => {
  if(publicationFilter!=='all'&&publicationState(e.published,e.visible)!==publicationFilter)return false;
  if (tierFilter !== 'all' && e.product.tier !== tierFilter) return false;
  if (!query) return true;
  return `${e.product.name} ${e.product.category} ${e.product.id}`.toLowerCase().includes(query.toLowerCase());
 });

 const {page, setPage, totalPages, paginatedItems} = usePagination(filteredEntries, 20);
 const switching=useRecordSwitch(dirty);
 const linked=useLinkedRecord({editor:'products',records:entries,loaded,selectedId:entry?.product.id,idOf:e=>e.product.id,busy,onSelect:(next,target)=>{
  if(next.product.id===entry?.product.id){setActiveTab(target.tab);return true;}
  return switching.request(()=>{setEditing(false);setEntry(structuredClone(next));setDirty(false);setPreview(false);setPreviewAnswers({});setQuery('');setTierFilter('all');setPage(Math.floor(entries.findIndex(e=>e.product.id===next.product.id)/20)+1);setActiveTab(target.tab);});
 }});

 return (
  <>
   <div className={s.heading}>
    <div>
     <h1>Pieces &amp; possibilities.</h1>
     <p>Review existing product details, forms and publication state.</p>
    </div>
    <button
      disabled={busy||dirty}
      onClick={()=>void load(entry?.product.id).then(()=>setMessage('Catalogue refreshed.')).catch(e=>setMessage(e.message))}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}
    >
      <RefreshCw size={14} />
      <span>Reload catalogue</span>
    </button>
   </div>

   <p className={s.protectedNote}>Protected product records: review without changing existing facts, gallery associations or forms. No old products are imported. Editing controls remain available for a deliberate, separately authorized catalogue change.</p><p className={s.status} role="status">{message}</p><LinkedRecordNotice {...linked}/><RecordSwitchNotice control={switching}/>

   {/* Collection Filter Tabs */}
   <div className={s.categoryTabs} role="tablist" aria-label="Filter by collection">
    <button
      type="button"
      role="tab"
      aria-selected={tierFilter === 'all'}
      className={tierFilter === 'all' ? `${s.categoryTabBtn} ${s.categoryTabBtnActive}` : s.categoryTabBtn}
      onClick={() => setTierFilter('all')}
    >
      All pieces ({entries.length})
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={tierFilter === 'large'}
      className={tierFilter === 'large' ? `${s.categoryTabBtn} ${s.categoryTabBtnActive}` : s.categoryTabBtn}
      onClick={() => setTierFilter('large')}
    >
      Furniture &amp; spatial ({entries.filter(e => e.product.tier === 'large').length})
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={tierFilter === 'memory'}
      className={tierFilter === 'memory' ? `${s.categoryTabBtn} ${s.categoryTabBtnActive}` : s.categoryTabBtn}
      onClick={() => setTierFilter('memory')}
    >
      Memory art ({entries.filter(e => e.product.tier === 'memory').length})
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={tierFilter === 'personal'}
      className={tierFilter === 'personal' ? `${s.categoryTabBtn} ${s.categoryTabBtnActive}` : s.categoryTabBtn}
      onClick={() => setTierFilter('personal')}
    >
      Personal art &amp; gifts ({entries.filter(e => e.product.tier === 'personal').length})
    </button>
   </div>

   <div className={s.toolbar}><label>Publication state<select value={publicationFilter} onChange={e=>setPublicationFilter(e.target.value)}>{['all','Published','Hidden','Unpublished'].map(v=><option key={v} value={v}>{v==='all'?'All publication states':v}</option>)}</select></label>
    <button
      type="button"
      disabled={busy||!media.length}
      onClick={()=>switching.request(()=>{
        setEditing(true);setEntry({version:0,publishedVersion:0,published:null,visible:false,hasDraft:true,product:{id:'RLA-'+crypto.randomUUID(),slug:'new-piece-'+crypto.randomUUID().slice(0,8),name:'New piece',subtitle:'',category:'Tables',tier:tierFilter === 'all' ? 'large' : tierFilter,image:'',story:'',fields:[{id:'brief',label:'Your requirements',type:'text',required:true,maxLength:240}],revision:1}});
        setDirty(true);
        setActiveTab('general');
      })}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
    >
      <Plus size={15} />
      <span>New piece</span>
    </button>

    <div className={s.searchWrap}>
      <input
        type="search"
        value={query}
        onChange={e=>setQuery(e.target.value)}
        placeholder="Find piece by name, category or ID…"
        aria-label="Find a piece"
      />
      {query && (
        <button
          type="button"
          className={s.searchClearBtn}
          onClick={()=>setQuery('')}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
   </div>

   <div className={s.layout}>
    <div className={s.list}>
      {paginatedItems.map(e => (
        <button
          key={e.product.id}
          aria-pressed={entry?.product.id===e.product.id}
          disabled={busy}
          onClick={()=>{if(e.product.id===entry?.product.id)return;switching.request(()=>{
            setEditing(false);setEntry(structuredClone(e));
            setPreviewAnswers({});
            setDirty(false);
            setActiveTab('general');
          });}}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <strong>{e.product.name}</strong>
            {e.visible&&e.published ? (
              <span className={s.statusBadgePublished}>Published</span>
            ) : (
              <span className={s.statusBadgeHidden}>{publicationState(e.published,e.visible)}</span>
            )}
          </div>
          <small style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
            <span>{e.product.id}</span>
            <span>·</span>
            <span>{e.product.category}</span>
            {e.hasDraft && <span className={s.statusBadgeDraft}>Draft</span>}
          </small>
        </button>
      ))}
      {filteredEntries.length === 0 && (
        <p className={s.help} style={{ padding: '16px' }}>No pieces match the selected filter or search.</p>
      )}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>

    {entry ? (
      <form data-unsaved={dirty} className={s.editor} onSubmit={e=>{e.preventDefault();void save('draft');}}>
        <fieldset disabled={busy}>
          <h2>{entry.product.name}</h2><RecordStatus id={entry.product.id} version={entry.version} publication={publicationState(entry.published,entry.visible)} draft={draftState(entry.product,entry.published,entry.version)} dirty={dirty} busy={busy}/><p className={s.help}>{publicationState(entry.published,entry.visible)} · {draftState(entry.product,entry.published,entry.version)}</p>
          <p className={s.help}>Shared version {entry.version} · Published form {entry.publishedVersion}. Choose from the approved asset collection. Saved product addresses stay stable.</p>
          <div className={s.actions}>{!editing&&<button type="button" onClick={()=>setEditing(true)}>Open existing product editing controls</button>}
            <button type="button" onClick={()=>setPreview(v=>!v)}>
              {preview?'Close form preview':'Preview this form'}
            </button>
          </div>

          
          <div className={s.tabs} role="tablist" aria-label="Product editor sections" onKeyDown={event=>{
            if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
            const tabs=Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
            const index=tabs.indexOf(event.target as HTMLButtonElement);
            if(index<0)return;
            event.preventDefault();
            const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
            tabs[next].focus();tabs[next].click();
          }}>
            {([
              ['general','General Details'],
              ['details','Story & Specs'],
              ['images','Images & Visuals'],
              ['customization','Customization Form'],
              ['translations','Translations'],
              ['history','History & Compare'],
            ] as const).map(([value,label])=>(
              <button
                key={value}
                type="button"
                role="tab"
                id={`product-editor-tab-${value}`}
                tabIndex={activeTab===value?0:-1}
                aria-selected={activeTab===value}
                aria-controls={`product-tab-${value}`}
                aria-label={tabIssues[value].length?`${label}, ${tabIssues[value].length} issue${tabIssues[value].length===1?'':'s'}`:label}
                data-has-issues={tabIssues[value].length>0}
                onClick={()=>setActiveTab(value)}
              >
                {label}{tabIssues[value].length?` · ${tabIssues[value].length}`:''}
              </button>
            ))}
          </div>

          {preview && (
            <div className={s.panel}>
              <h3>Draft form preview</h3>
              <p>These are the same field controls used on the public form, with this draft’s labels, conditions and limits. Preview answers stay in this editor; no files are uploaded and no inquiry is submitted.</p>
              <CustomizationFields formId="studio-product-preview" fields={entry.product.fields.filter(f=>fieldVisible(f,previewAnswers))} answers={previewAnswers} onChange={(id,value)=>setPreviewAnswers(v=>({...v,[id]:value}))} styles={{fields:s.grid,field:'',fieldError:'',error:s.status,help:s.help}}/>
            </div>
          )}

          <fieldset disabled={!editing}>{activeTab === 'general' && (
          <div id="product-tab-general" role="tabpanel" aria-labelledby="product-editor-tab-general" tabIndex={0} className={s.grid}>
            <label>Name<input id="products-field-name" value={entry.product.name} maxLength={100} required onChange={e=>change({name:e.target.value})}/></label>
            <label>Subtitle<input id="products-field-subtitle" value={entry.product.subtitle} maxLength={120} required onChange={e=>change({subtitle:e.target.value})}/></label>
            <label>Public address<input value={entry.product.slug} disabled={!entry.product.id.startsWith('RLA-')||entry.version>0} onChange={e=>change({slug:e.target.value})}/></label>
            <label>Collection
              <select value={entry.product.tier} onChange={e=>change({tier:e.target.value as ShopProduct['tier']})}>
                <option value="large">Furniture &amp; spatial art</option>
                <option value="memory">Memory art</option>
                <option value="personal">Personal art &amp; gifts</option>
              </select>
            </label>
            <label>Category<input value={entry.product.category} maxLength={80} required onChange={e=>change({category:e.target.value})}/></label>
          </div>
          )}
          {activeTab === 'details' && (
          <div id="product-tab-details" role="tabpanel" aria-labelledby="product-editor-tab-details" tabIndex={0} className={s.grid}>
            <label>Design dimensions<input value={entry.product.dimensions||''} maxLength={200} onChange={e=>change({dimensions:e.target.value||undefined})}/></label>
            <label>Materials<input value={entry.product.material||''} maxLength={300} onChange={e=>change({material:e.target.value||undefined})}/></label>
            <label className={s.wide}>Product story<textarea id="products-field-story" value={entry.product.story} maxLength={1800} rows={7} required onChange={e=>change({story:e.target.value})}/></label>
          </div>
          )}
          {activeTab === 'images' && (
          <div id="product-tab-images" role="tabpanel" aria-labelledby="product-editor-tab-images" tabIndex={0}>
          <div className={s.grid}>
            <label>Primary image
              <select id="products-field-image" value={entry.product.image} onChange={e=>change({image:e.target.value})}><option value="">Choose a reviewed product image</option>
                {media.map(m=><option key={m.path} value={m.path}>{m.alt} · {m.products.join(', ')}</option>)}
              </select>
            </label>
            <label>Room image
              <select value={entry.product.scene||''} onChange={e=>change({scene:e.target.value||undefined})}>
                <option value="">No room image</option>
                {media.map(m=><option key={m.path} value={m.path}>{m.alt}</option>)}
              </select>
            </label>
          </div>
          {entry.reviewedImages&&entry.product.image!==entry.reviewedImages.image&&(
            <section className={s.panel}>
              <h3>A reviewed image assignment is available.</h3>
              <p>Keep your written draft and customization fields. Apply the reviewed primary image and gallery only after comparing the product below. Metadata for its corrected product association must also be published in Public media.</p>
              <p className={s.help}>Reviewed image: {entry.reviewedImages.image}</p>
              <button type="button" onClick={()=>{
                const images=entry.reviewedImages!;
                change({image:images.image,scene:images.scene||undefined,gallery:images.gallery,imageAlt:undefined,imageCaption:undefined,imagePosition:undefined});
                setMessage('Reviewed images applied to this unsaved product draft. Inspect and save deliberately.');
              }}>Apply reviewed product images</button>
            </section>
          )}

          <ProductGalleryEditor product={entry.product} media={media} onChange={change}/>
          </div>
          )}
          {activeTab === 'translations' && (
          <section id="product-tab-translations" role="tabpanel" aria-labelledby="product-editor-tab-translations" tabIndex={0} className={s.panel}>
           <h2>Product translations</h2>
           <p className={s.help}>Optional public-language overrides. Leave any field blank to use the English product text. Translations publish with this product revision.</p>
           <label>Language<select value={translationLocale} onChange={e=>setTranslationLocale(e.target.value as Locale)}>{locales.filter(code=>code!=='en').map(code=><option key={code} value={code}>{localeLabels[code]}</option>)}</select></label>
           {translationLocale!=='en'&&<div className={s.grid} dir={translationLocale==='ar'?'rtl':'ltr'}>
            <label>Name<small dir="ltr">English: {entry.product.name}</small><input maxLength={100} value={entry.product.translations?.[translationLocale]?.name||''} onChange={e=>productTranslation({name:e.target.value})}/></label>
            <label>Subtitle<small dir="ltr">English: {entry.product.subtitle}</small><input maxLength={120} value={entry.product.translations?.[translationLocale]?.subtitle||''} onChange={e=>productTranslation({subtitle:e.target.value})}/></label>
            <label>Category<small dir="ltr">English: {entry.product.category}</small><input maxLength={80} value={entry.product.translations?.[translationLocale]?.category||''} onChange={e=>productTranslation({category:e.target.value})}/></label>
            <label>Dimensions<small dir="ltr">English: {entry.product.dimensions||'—'}</small><input maxLength={200} value={entry.product.translations?.[translationLocale]?.dimensions||''} onChange={e=>productTranslation({dimensions:e.target.value})}/></label>
            <label className={s.wide}>Materials<small dir="ltr">English: {entry.product.material||'—'}</small><textarea rows={3} maxLength={300} value={entry.product.translations?.[translationLocale]?.material||''} onChange={e=>productTranslation({material:e.target.value})}/></label>
            <label className={s.wide}>Product story<small dir="ltr">English: {entry.product.story}</small><textarea rows={8} maxLength={1800} value={entry.product.translations?.[translationLocale]?.story||''} onChange={e=>productTranslation({story:e.target.value})}/></label>
           </div>}
          </section>
          )}
          </fieldset>{activeTab === 'history' && (
          <div id="product-tab-history" role="tabpanel" aria-labelledby="product-editor-tab-history" tabIndex={0}>
          <RevisionHistory<ShopProduct> key={entry.product.id+':'+entry.version} kind="product" entityKey={entry.product.id} currentVersion={entry.version} currentDocument={entry.product} onRestore={change}/>
          <ProductComparison draft={entry.product} published={entry.published}/>
          </div>
          )}
          <fieldset disabled={!editing}>{activeTab === 'customization' && (
          <section id="product-tab-customization" role="tabpanel" aria-labelledby="product-editor-tab-customization" tabIndex={0} className={s.fields}>
            <h2>Customization fields</h2>
            {hasReviewedCapabilities(entry.product.id)&&(
              <button type="button" disabled={busy} onClick={()=>{
                if(!window.confirm('Replace only this draft’s fields with the reviewed product-specific form? Published and historical answers stay unchanged.'))return;
                change({fields:productFields(entry.product)});
                setPreviewAnswers({});
                setMessage('Reviewed fields applied to this unsaved draft. Inspect the preview and save deliberately.');
              }}>Use reviewed product-specific form</button>
            )}
            {!!schemaIssues.length&&(
              <div role="alert">
                <p>Correct the form before saving:</p>
                <ul>{schemaIssues.map((issue,i)=><li key={i}>{issue}</li>)}</ul>
              </div>
            )}
            <p className={s.help}>These exact fields appear on this piece’s public order form after publishing. Contact details, notes and references are included automatically.</p>
            {entry.product.fields.map((f,i)=>(
              <div key={f.id} className={s.fieldRow}>
                <p className={s.help}>Stable field ID: {f.id}</p>
                <div className={s.grid}>
                  <label>Field label<input value={f.label} maxLength={100} required onChange={e=>field(i,{label:e.target.value})}/></label>
                  <label>Answer type
                    <select value={f.type} onChange={e=>field(i,{type:e.target.value as CustomField['type'],options:e.target.value==='select'?(f.options||['Discuss with the studio']):undefined})}>
                      <option value="text">Short text</option>
                      <option value="select">Choose from options</option>
                      <option value="number">Whole number</option>
                    </select>
                  </label>
                  {f.type==='select'&&(
                    <label className={s.wide}>Options — one per line
                      <textarea rows={4} value={f.options?.join('\n')||''} onChange={e=>field(i,{options:e.target.value.split('\n')})}/>
                    </label>
                  )}
                  <label className={s.wide}>Help text<input value={f.hint||''} maxLength={400} onChange={e=>field(i,{hint:e.target.value||undefined})}/></label>
                  <label>Show when
                    <select value={f.visibleWhen?.field||''} onChange={e=>{
                      const parent=entry.product.fields.find(p=>p.id===e.target.value);
                      field(i,{visibleWhen:parent?{field:parent.id,value:parent.options?.[0]||''}:undefined});
                    }}>
                      <option value="">Always visible</option>
                      {entry.product.fields.slice(0,i).filter(p=>p.type==='select'&&!p.visibleWhen).map(p=>(
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  </label>
                  {f.visibleWhen&&(
                    <label>Answer equals
                      <select value={f.visibleWhen.value} onChange={e=>field(i,{visibleWhen:{field:f.visibleWhen!.field,value:e.target.value}})}>
                        {entry.product.fields.find(p=>p.id===f.visibleWhen!.field)?.options?.map(o=>(
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </label>
                  )}
                  {f.type==='number'?(
                    <>
                      <label>Minimum<input type="number" min={1} max={500} value={f.min??1} onChange={e=>field(i,{min:Number(e.target.value)})}/></label>
                      <label>Maximum<input type="number" min={f.min??1} max={500} value={f.max??500} onChange={e=>field(i,{max:Number(e.target.value)})}/></label>
                    </>
                  ):f.type==='text'&&(
                    <label>Character limit<input type="number" min={1} max={240} value={f.maxLength??240} onChange={e=>field(i,{maxLength:Number(e.target.value)})}/></label>
                  )}
                  <label className={s.check}>
                    <input type="checkbox" checked={f.required} onChange={e=>field(i,{required:e.target.checked})}/>Required
                  </label>
                  <div className={s.actions}>
                    <button type="button" disabled={i===0} onClick={()=>moveField(i,-1)}>Move up</button>
                    <button type="button" disabled={i===entry.product.fields.length-1} onClick={()=>moveField(i,1)}>Move down</button>
                    <button type="button" title="Clear dependent conditions before removing a parent field" disabled={entry.product.fields.length===1||entry.product.fields.some(child=>child.visibleWhen?.field===f.id)} onClick={()=>change({fields:entry.product.fields.filter((_,n)=>i!==n)})}>Remove field</button>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" disabled={entry.product.fields.length>=16} onClick={()=>change({fields:[...entry.product.fields,{id:'field_'+crypto.randomUUID().slice(0,8),label:'Your preference',type:'text',required:false}]})}>Add a field</button>
          </section>
          )}

          </fieldset><div className={s.actions}>
            <button className={s.primary} disabled={busy||!editing}>Save draft</button>
            {admin&&(
              <>
                <button type="button" disabled={busy||!editing} onClick={()=>void save('publish')}>Publish to website</button>
                <button type="button" disabled={busy||!editing} onClick={()=>void save('hide')}>Hide from website</button>
              </>
            )}
            <a href={`/pieces/${entry.product.slug}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>View published piece</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {dirty&&<p className={s.help}>You have unsaved changes.</p>}
          <DraftRecovery value={entry.product} busy={busy} onReload={async()=>{
            setBusy(true);
            try{await load(entry.product.id);setDirty(false);}finally{setBusy(false);}
          }}/>
        </fieldset>
      </form>
    ):(
      <div className={s.empty}>Select a piece to edit its details and customization form.</div>
    )}
   </div>
  

  </>
 );
}

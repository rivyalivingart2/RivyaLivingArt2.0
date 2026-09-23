'use client';
import Image from 'next/image';
import type {ShopProduct} from '@/lib/shop-model';
import type {PublicMedia} from '@/lib/public-media';
import s from './workspace.module.css';

export function ProductGalleryEditor({product,media,onChange}:{product:ShopProduct;media:PublicMedia[];onChange:(patch:Partial<ShopProduct>)=>void}){
 const gallery=product.gallery||[];
 return <section className={s.fields}><h2>Product gallery</h2><p>Choose up to 12 approved images, describe each view and arrange their order. The primary and room images remain separate.</p>{gallery.map((g,i)=><div className={s.fieldRow} key={i}><div className={s.grid}><Image src={g.src} alt={g.alt} width={220} height={165} style={{objectFit:'cover',maxWidth:'100%',height:'auto'}}/><label>Approved image<select value={g.src} onChange={e=>onChange({gallery:gallery.map((v,n)=>n===i?{...v,src:e.target.value}:v)})}>{media.map(m=><option key={m.path} value={m.path}>{m.alt}</option>)}</select></label><label className={s.wide}>Image description<input maxLength={180} required value={g.alt} onChange={e=>onChange({gallery:gallery.map((v,n)=>n===i?{...v,alt:e.target.value}:v)})}/></label><div className={s.actions}><button type="button" disabled={i===0} onClick={()=>{const next=[...gallery];[next[i-1],next[i]]=[next[i],next[i-1]];onChange({gallery:next});}}>Move earlier</button><button type="button" disabled={i===gallery.length-1} onClick={()=>{const next=[...gallery];[next[i+1],next[i]]=[next[i],next[i+1]];onChange({gallery:next});}}>Move later</button><button type="button" onClick={()=>onChange({gallery:gallery.filter((_,n)=>n!==i)})}>Remove this view</button></div></div></div>)}<button type="button" disabled={gallery.length>=12||!media.length} onClick={()=>onChange({gallery:[...gallery,{src:product.image,alt:media.find(m=>m.path===product.image)?.alt||product.name}]})}>Add gallery view</button></section>;
}

function ProductSummary({product}:{product:ShopProduct}){
 return <><Image src={product.image} alt={product.imageAlt||product.name} width={500} height={375} style={{width:'100%',height:'auto',objectFit:'cover'}}/><h4>{product.name}</h4><p>{product.subtitle}</p><p>{product.story}</p><dl><dt>Collection / category</dt><dd>{product.tier} / {product.category}</dd><dt>Dimensions</dt><dd>{product.dimensions||'Discuss with the atelier'}</dd><dt>Materials</dt><dd>{product.material||'Discuss with the atelier'}</dd><dt>Gallery</dt><dd>{product.gallery?.length||0} views</dd><dt>Customization</dt><dd>{product.fields.map(f=>f.label+(f.required?' *':'')).join(' · ')}</dd></dl></>;
}
export function ProductComparison({draft,published}:{draft:ShopProduct;published:ShopProduct|null}){
 return <details className={s.panel}><summary>Compare draft and published piece</summary><div className={s.grid}><section><h3>Current draft</h3><ProductSummary product={draft}/></section><section><h3>Published version</h3>{published?<ProductSummary product={published}/>:<p>This piece has no published version.</p>}</section></div></details>;
}

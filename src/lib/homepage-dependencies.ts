import {baselineProducts,validProduct,type ShopProduct} from './shop-model';
import {validMedia,type PublicMedia} from './public-media';
import {baselineContent,validContent,type ContentDocument} from './content-model';
import {homeActions,homeProductIds,type HomeSnapshot,type HomeProduct,type HomeArticle,type HomeDependency} from './homepage-model';

export type DependencyRow={key:string;document:unknown;version:number;fingerprint:string};
export type DependencySource={products:DependencyRow[];content:DependencyRow[];media:DependencyRow[]};
const publicRoutes=new Set(['/','/collectible-design','/memory-art','/personal-art','/search','/commission','/preserve','/personalize','/commission/customize','/journal']);
/** A single SQL snapshot feeds this pure compiler. Never copy a draft or arbitrary stored keys. */
export function compileHomepageSnapshot(document:ContentDocument,source:DependencySource):HomeSnapshot{
 const home=document.homepage!;
 const images=new Map<string,PublicMedia>();
 for(const row of source.media)if(validMedia(row.document)&&row.key===row.document.path)images.set(row.key,row.document);
 const products:HomeProduct[]=[];
 for(const row of source.products){
  const p=row.document as ShopProduct;
  if(!validProduct(p,baselineProducts.find(b=>b.id===row.key))||p.id!==row.key)continue;
  const image=images.get(p.image);if(!image?.products.includes(p.id))continue;
  const scene=p.scene?images.get(p.scene):undefined;
  products.push({id:p.id,slug:p.slug,name:p.name,subtitle:p.subtitle,category:p.category,tier:p.tier,material:p.material,image:image.path,imageAlt:image.alt,imagePosition:`${image.focalX}% ${image.focalY}%`,revision:Number(row.version),...(scene?.products.includes(p.id)?{scene:scene.path,sceneAlt:scene.alt,scenePosition:`${scene.focalX}% ${scene.focalY}%`}:{})});
 }
 const pages=source.content.flatMap(row=>{const d=row.document as ContentDocument;return d?.id===row.key&&validContent(d,baselineContent.find(b=>b.id===row.key))?[d]:[];});
 const dependencies:HomeDependency[]=[],issues:string[]=[],mediaPaths=new Set<string>(),unavailableActionHrefs=new Set<string>();
 function depend(kind:HomeDependency['kind'],key:string){const row=source[kind==='product'?'products':kind==='content'?'content':'media'].find(r=>r.key===key);if(row&&!dependencies.some(d=>d.kind===kind&&d.key===key))dependencies.push({kind,key,version:Number(row.version),fingerprint:row.fingerprint});}
 const requestedIds=homeProductIds(home);
 const selected=products.filter(p=>requestedIds.includes(p.id));
 for(const id of requestedIds){const p=selected.find(p=>p.id===id);if(!p){issues.push(`Product ${id} is not available in the published catalogue.`);continue;}depend('product',id);for(const path of [p.image,p.scene])if(path){depend('media',path);mediaPaths.add(path);}}
 const articles:HomeArticle[]=[];
 for(const section of home.sections.filter(s=>s.enabled)){
  if(section.type==='selected'&&!section.productIds?.length)issues.push(`${section.id}: select at least one published piece or hide this section.`);
  if(section.image){if(!images.has(section.image.path))issues.push(`${section.id}: the assigned image is not published.`);else {depend('media',section.image.path);mediaPaths.add(section.image.path);}}
  for(const id of section.articleIds||[]){const article=pages.find(p=>p.id===id&&p.kind==='article');if(!article){issues.push(`${section.id}: article ${id} is not published.`);continue;}depend('content',id);const m=article.image?images.get(article.image):undefined;if(m){depend('media',m.path);mediaPaths.add(m.path);}articles.push({id:article.id,route:article.route,title:article.title,description:article.description,eyebrow:article.eyebrow,...(m?{image:m.path,imageAlt:article.imageAlt||m.alt}:{})});}
  for(const category of section.categories||[])if(!products.some(p=>p.category===category))issues.push(`${section.id}: category ${category} has no published pieces.`);
 }
 for(const a of homeActions(home)){
  const [route,anchor]=a.href.split('#');const page=pages.find(p=>p.route===route),product=products.find(p=>'/pieces/'+p.slug===route);
  if(!publicRoutes.has(route)&&!page&&!product){issues.push(`“${a.label}” points to an unpublished destination: ${a.href}.`);unavailableActionHrefs.add(a.href);continue;}
  if(anchor&&!(route==='/'?document.sections.some(s=>s.id===anchor&&home.sections.some(h=>h.id===anchor&&h.enabled)):page?.sections.some(s=>s.id===anchor))){issues.push(`“${a.label}” points to a missing section: ${a.href}.`);unavailableActionHrefs.add(a.href);}
  if(page)depend('content',page.id);if(product)depend('product',product.id);
 }
 const categories=[...new Set(products.map(p=>p.category))].map(name=>({name,count:products.filter(p=>p.category===name).length,tiers:[...new Set(products.filter(p=>p.category===name).map(p=>p.tier))]}));
 return {schemaVersion:1,products:selected,articles,mediaPaths:[...mediaPaths],categories,dependencies,issues:[...new Set(issues)],unavailableActionHrefs:[...unavailableActionHrefs]};
}

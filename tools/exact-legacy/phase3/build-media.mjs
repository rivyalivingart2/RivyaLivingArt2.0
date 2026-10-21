/** Hash/inspect existing files and map references. Does not copy, edit or publish media. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {imageSlots,collectMediaReferences,dedupeAssets,placementMap,filmLineage} from './media.mjs';
import {matchAsset} from './mapping.mjs';
const dir='docs/restoration/exact-legacy-2026-10-21/phase3',privateDir='test-results/exact-legacy-2026-10-21/phase3';mkdirSync(dir,{recursive:true});
const read=path=>JSON.parse(readFileSync(path,'utf8')),write=(name,value,root=dir)=>writeFileSync(root+'/'+name,JSON.stringify(value,null,2)+'\n');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
async function scan(root,scope){
 const paths=execFileSync('git',['-C',root,'ls-files','-z','public'],{encoding:'utf8'}).split('\0').filter(Boolean).sort(),out=[];
 for(const path of paths){const bytes=readFileSync(resolve(root,path)),ext=extname(path).slice(1).toLowerCase();let dimensions=null,error=null;
  if(['jpg','jpeg','png','webp','avif','gif','tif','tiff'].includes(ext)){try{const m=await sharp(bytes,{limitInputPixels:100000000}).metadata();dimensions={width:m.width,height:m.height,format:m.format,orientation:m.orientation||1,pages:m.pages||1};}catch(e){error=String(e.message).slice(0,120);}}
  out.push({scope,path,bytes:bytes.length,sha256:hash(bytes),extension:ext,dimensions,metadataError:error});
 }return out;
}
const [source,destination]=await Promise.all([scan('../OLDWEBSITE-reference','old-source'),scan('.','current-destination')]);
const pairs=source.map(s=>({...s,...matchAsset(s,destination),samePathDifferentBytes:destination.some(d=>d.path===s.path&&d.sha256!==s.sha256),action:'PRESERVE_ORIGINALS_NO_AUTOMATIC_ASSOCIATION'}));
const slotDefinitions=imageSlots(readFileSync('../OLDWEBSITE-reference/src/lib/site-images.ts','utf8'));
function placement(slot){
 if(placementMap[slot.key])return placementMap[slot.key];
 if(slot.key==='studio.login')return 'PROTECTED_CURRENT_STUDIO_LOGIN; never map old artwork onto it';
 if(slot.key.startsWith('home.furniture.')||slot.key.startsWith('home.rooms.'))return 'proposed Homepage category/room placement '+slot.key+'; no product/category creation';
 if(slot.key.startsWith('about.'))return '/our-story ContentDocument.sections[].image; explicit section-ID map required for '+slot.key;
 if(slot.key.startsWith('largeFormat.'))return '/architects ContentDocument sections[] image or existing legacy scope slot '+slot.key;
 if(slot.key==='process.heroVideo')return 'proposed /process approved video + poster pair; current film enum is limited';
 if(slot.key==='process.heroPoster')return 'proposed /process approved video poster paired with process.heroVideo';
 if(slot.key.startsWith('process.material'))return '/materials-care ContentDocument.sections[].image; explicit section-ID map required';
 if(slot.key.startsWith('process.'))return '/process ContentDocument.sections[].image; retain current four steps, no positional join';
 if(slot.key.startsWith('workshops.'))return 'proposed confirmed /workshops service document image slot '+slot.key;
 if(slot.key==='customOrder.hero')return '/commission ContentDocument.headerImage; retain current image';
 if(slot.key==='contact.hero')return '/contact ContentDocument.headerImage; retain current image';
 if(slot.key==='portfolio.hero')return '/portfolio ContentDocument.headerImage; does not establish a completed project';
 if(slot.key.startsWith('shop.'))return 'proposed catalogue editorial placement '+slot.key+'; preserve current product/category membership';
 if(slot.key.startsWith('nav.'))return 'proposed navigation image placement '+slot.key+'; preserve current links and logo';
 throw Error('Unmapped source placement: '+slot.key);
}
const supportedRatios=new Set(['4:5','3:2','1:1','16:9','21:9']);
const slots=slotDefinitions.map(s=>{const file=source.find(f=>f.path==='public'+s.fallback);assert.ok(file,'Missing bundled slot asset '+s.key);return {sourceKey:s.key,sourceFallback:s.fallback,sourceRatio:s.ratio,sourceAltKey:s.altKey||null,targetPlacement:placement(s),exactByteDestinations:matchAsset(file,destination).paths,focalTransform:'0..1 source fraction -> 0..100 destination percent; reject invalid units/range; separate mobile crop',ratioDisposition:supportedRatios.has(s.ratio)?'SUPPORTED_USAGE_RATIO':'ADDITIVE_RATIO_CONTRACT_REQUIRED_NO_COERCION',databaseOverride:'UNAVAILABLE_DELETED_SOURCE',bindingStatus:s.key==='studio.login'?'PROTECTED_NO_CHANGE':'MAPPED_CONTRACT_NO_NEW_BINDING',writes:0};});
const snapshot=read(privateDir+'/before-private.json'),usages=[];
for(const [table,rows] of Object.entries(snapshot.documents))for(const row of rows)for(const state of ['draft','published'])if(row[state]){
 const identity=row.product_id||row.content_key||row.path;
 for(const usage of collectMediaReferences(row[state]))usages.push({table,identity,state,version:row.version,...usage,availability:destination.some(d=>'/'+d.path.slice(7)===usage.path)?'BUNDLED_FILE_PRESENT':usage.path.startsWith('/editorial/')?'DYNAMIC_MEDIA_DELIVERY_NOT_READ':'BUNDLED_REFERENCE_MISSING',action:'KEEP_EXISTING_ASSOCIATION'});
}
write('current-media-usage-private.json',usages,privateDir);
const prior=read('test-results/exact-legacy-2026-10-21/drive-manifest.json'),refresh=read(privateDir+'/drive-refresh-private.json');
const liveFiles=[...refresh.ownerImagePages.flatMap(p=>p.results),...refresh.ownerOtherFiles.filter(f=>!f.error).map(f=>f.metadata),...refresh.generalImages.files];
const liveById=new Map(liveFiles.map(f=>[f.id,f])),all=new Map(prior.files.map(f=>[f.id,{...f,firstEvidenceAt:prior.capturedAt}]));
for(const f of liveFiles)if(!all.has(f.id))all.set(f.id,{id:f.id,name:f.title,mime:f.mime_type,bytes:Number(f.size)||null,folderId:f.listedParent||f.parent_ids?.[0],firstEvidenceAt:refresh.at});
const lineage=filmLineage(readFileSync('src/lib/presentation-media.ts','utf8'));
for(const a of read('docs/assets/initial-media.json').assets)lineage.push({sourceId:a.driveFileId,path:a.path,expectedSha256:a.sha256,sourceHash:a.sourceSHA256,classification:a.classification,evidence:'docs/assets/initial-media.json'});
for(const a of read('docs/editorial-production/m9/media-manifest.json'))for(const id of [a.sourceDriveId,a.deliveryDriveId])lineage.push({sourceId:id,path:a.path,expectedSha256:a.metadata.sha256,classification:a.metadata.classification,evidence:'docs/editorial-production/m9/media-manifest.json'});
const drive=[...all.values()].map(f=>{const links=lineage.filter(l=>l.sourceId===f.id).map(l=>({...l,localBytes:destination.some(d=>d.path===l.path&&d.sha256===l.expectedSha256)?'VERIFIED_EXACT_CURRENT_FILE':'HISTORICAL_LINEAGE_NOT_CURRENT_BYTES'}));return {...f,freshMetadataObserved:liveById.has(f.id),metadataObservedAt:liveById.has(f.id)?refresh.at:prior.capturedAt,associations:links,disposition:links.length?'PRESERVE_EXPLICIT_EXISTING_LINEAGE':'UNASSIGNED_ORIGINAL_KEEP_UNLINKED',byteIdentityVerified:false,dimensions:null,productCreationAllowed:false,publicationAllowed:false};});
write('drive-media-mapping-private.json',{at:refresh.at,files:drive,limits:refresh.limits},privateDir);
const families=[
 ['category','Category.image','proposed CategoryMetadata.image: EditorialUsage','ADDITIVE_CATEGORY_CONTRACT_REQUIRED','Preserve derived memberships; metadata must not create products'],
 ['product','ProductImage + Product.videoUrl/model3dUrl','ShopProduct image/scene/gallery; video/3D needs extension','OWNER_EXCLUDED_PRODUCT_CHANGES','Existing product media remains untouched'],
 ['blog','BlogPost.coverImage/content','ContentDocument.headerImage / sections[].image / body','EXISTING_WITH_ADAPTER','Approved path, alt/caption and independent desktop/mobile crops; no arbitrary source URLs'],
 ['project','PortfolioImage, before/after/video','EditorialRecord.gallery + ContentDocument.headerImage','EXISTING_IMAGE_CONTRACT_VIDEO_EXTENSION','Twelve-image bound; preserve before/after roles explicitly; genuine project needs evidence'],
 ['testimonial','avatar/installation/video/poster + Media IDs','proposed testimonial media/rating/evidence contract','ADDITIVE_CONTRACT_REQUIRED','Current validator rejects image/gallery/linked products; no fabricated portraits, names, reviews or ratings'],
 ['page/landing','SiteImage, Page, CustomBlock','ContentDocument.headerImage / sections[].image / LandingBlock.image/gallery','EXISTING_WITH_RATIO_MOBILE_EXTENSIONS','Current one-path EditorialUsage cannot preserve a different mobile URL; old 3:4 and 4:3 ratios need extension'],
 ['video','Media.duration/posterUrl and slot pairs','proposed typed video usage + private original + public poster','ADDITIVE_VIDEO_CONTRACT_REQUIRED','Do not convert arbitrary video into current fixed resin-pour enum'],
 ['private inquiry','Inquiry.referenceImageUrls','rivya_references private object relationship','PRIVATE_NO_PUBLIC_MAPPING','Never promote customer uploads into public/editorial media'],
 ['Studio login','studio.login','current protected login assets','PROTECTED_NO_CHANGE','No source-image replacement or shared CSS change']
].map(([family,source,target,disposition,policy])=>({family,source,target,disposition,policy,writes:0}));
write('asset-mapping.json',pairs);write('destination-assets.json',destination);write('slot-mapping.json',slots);write('media-family-mapping.json',families);write('asset-duplicates.json',dedupeAssets([...source,...destination]));
const summary={sourcePublicFiles:source.length,destinationPublicFiles:destination.length,sourceFilesWithExactByteMatches:pairs.filter(p=>p.paths.length).length,sourceFilesWithoutByteMatches:pairs.filter(p=>!p.paths.length).length,samePathDifferentBytes:pairs.filter(p=>p.samePathDifferentBytes).length,localRasterDimensions:source.concat(destination).filter(a=>a.dimensions).length,metadataErrors:source.concat(destination).filter(a=>a.metadataError).length,slots:slots.length,unsupportedRatioSlots:slots.filter(s=>s.ratioDisposition.startsWith('ADDITIVE')).length,currentUsageReferences:usages.length,missingBundledUsages:usages.filter(u=>u.availability==='BUNDLED_REFERENCE_MISSING').length,drive:{inventoried:drive.length,freshMetadataObserved:drive.filter(f=>f.freshMetadataObserved).length,historicalOnly:drive.filter(f=>!f.freshMetadataObserved).length,explicitLineage:drive.filter(f=>f.associations.length).length,unassignedOriginals:drive.filter(f=>!f.associations.length).length,byteDeduplicationComplete:false,remoteDimensionsVerified:false,photos:'Previously observed album; no file-level Photos identifiers/export; not inferred equivalent to Drive'},writes:{productRecords:0,database:0,mediaBytes:0,mediaAssociations:0,drive:0,publication:0}};
write('media-summary.json',summary);console.log(JSON.stringify(summary,null,2));

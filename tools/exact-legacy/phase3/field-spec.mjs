/** Contract crosswalk only. '+' targets are proposed extensions, not installed fields.
 * No value in this module authorizes an insert, update, publication or product import. */
export const excludedProductEntities=new Set(['Product','ProductImage','CustomizationField','ImportRun','ImportConflict','DeletedImport']);
export const privateEntities=new Set(['User','Inquiry','Subscriber','ActivityLog','ContentRevision']);
export const researchEntities=new Set(['ScrapeSource','ScrapeJob','ScrapedProduct','ResearchProduct','ProductSnapshot','ProductVariant','NormalizationAlias','ShortlistEntry','ValidationFailure','AnalyticsSnapshot','OpportunityScore','ProductEmbedding','PriceHistory','ResearchRecord']);
export const contracts={
 User:['rivya_staff','src/lib/studio-staff.ts','Current accounts and login only; no legacy account, role or secret merge'],
 Category:['proposed.categoryMetadata','src/lib/homepage-model.ts','Category label is currently derived; explicit metadata needs an additive contract'],
 Product:['rivya_catalogue.draft','src/lib/shop-model.ts','Existing catalogue only; no products added or imported'],
 ProductImage:['rivya_catalogue.draft.gallery[]','src/lib/shop-model.ts','Preserve all existing primary/gallery references'],
 CustomizationField:['rivya_catalogue.draft.fields[]','src/lib/product-form.ts','Preserve current field IDs, choices, form versions and saved answers'],
 Inquiry:['rivya_inquiries + rivya_studio_orders','scripts/whatsapp-schema.sql','Private record mapping requires recovered source IDs; do not rebuild guest/access credentials'],
 Portfolio:['rivya_content.draft (editorial portfolio)','src/lib/editorial-record-model.ts','Preserve current identity; evidence is required for genuine classification'],
 PortfolioImage:['rivya_content.draft.editorial.gallery[]','src/lib/editorial-record-model.ts','Up to twelve approved usages; preserve ordering and crops'],
 BlogCategory:['rivya_content.draft.discovery','src/lib/editorial-metadata.ts','Current format/tags do not provide normalized taxonomy identities'],
 Tag:['rivya_content.draft.discovery.tags[]','src/lib/editorial-metadata.ts','Labels may map only through an explicit taxonomy crosswalk'],
 BlogPost:['rivya_content.draft (article)','src/lib/content-model.ts','Convert rich body explicitly; preserve current routes/reviewed translations'],
 Testimonial:['rivya_content.draft (editorial testimonial)','src/lib/editorial-record-model.ts','Ratings/media/private notes need extensions; genuine attribution requires evidence'],
 Faq:['rivya_content.draft (editorial faq)','src/lib/editorial-record-model.ts','Answer source or related policy required; no default publication'],
 Media:['rivya_public_media / rivya_editorial_media','src/lib/editorial-media-model.ts','Approved media only; source URLs and private originals are not public delivery paths'],
 RateLimitHit:['current runtime rate limits','src/lib/studio-auth.ts','Do not migrate runtime rate-limit history'],
 Page:['rivya_content.draft (page)','src/lib/content-model.ts','Preserve current routes, snapshots, versions and visibility'],
 SiteSettings:['business/site/content/presentation settings','src/lib/business-settings-model.ts','Current brand, contacts and login remain authoritative; auto-fill disabled by owner'],
 ActivityLog:['proposed.privateLegacyHistory','scripts/revision-schema.sql','Legacy history stays provenance; never masquerades as a new current audit event'],
 Subscriber:['rivya_newsletter_subscribers','scripts/newsletter-schema.sql','Existing local footer/journal capture only; legacy sources and consent need explicit handling'],
 SiteImage:['EditorialUsage + media crosswalk','src/lib/homepage-model.ts','Every placement retains independent alt/caption/desktop/mobile crops'],
 SiteCopy:['rivya_content.draft + translations','src/lib/shared-copy-model.ts','Explicit key mapping; existing populated copy and translation review win'],
 FormOption:['proposed.commissionOptions','src/lib/bespoke-schema.ts','Current fixed choices require a versioned adapter; do not change saved inquiries'],
 NavMenu:['SiteSettings.navigation','src/lib/site-settings-model.ts','Map only registered menu keys; retain current links and labels'],
 NavItem:['SiteSettings.navigation[menu][]','src/lib/site-settings-model.ts','Current routes and reviewed labels remain authoritative'],
 ContentRevision:['proposed.privateLegacyHistory','scripts/revision-schema.sql','Preserve historical namespace; never insert old versions into current revision sequence'],
 PageSection:['PresentationDocument + ContentDocument.sections[]','src/lib/presentation-model.ts','Draft and published ordering/visibility remain separate'],
 CustomPage:['rivya_content.draft.landing','src/lib/landing-model.ts','Explicit route/block conversion; current document validator applies'],
 CustomBlock:['rivya_content.draft.landing.blocks[]','src/lib/landing-model.ts','Registered block types only; preserve unsupported JSON privately']
};
const parse=s=>Object.fromEntries(s.split(';').map(v=>v.trim()).filter(Boolean).map(v=>{const p=v.indexOf('=');return [v.slice(0,p),v.slice(p+1)];}));
export const fields=Object.fromEntries(Object.entries({
 Category:'name=+categoryMetadata.label;slug=+categoryMetadata.slug;image=+categoryMetadata.image;description=+categoryMetadata.description;order=+categoryMetadata.order;translations=+categoryMetadata.translations;seoTitle=+categoryMetadata.seo.title;seoDescription=+categoryMetadata.seo.description;visible=+categoryMetadata.visibility',
 Product:'title=ShopProduct.name;displayName=ShopProduct.name;slug=ShopProduct.slug;shortTagline=ShopProduct.subtitle;description=ShopProduct.story;priceMin=ShopProduct.price.amount;priceMax=+product.priceRange.max;showPrice=ShopProduct.price.mode;timeline=+product.timeline;materials=ShopProduct.material;dimensions=ShopProduct.dimensions;occasions=+product.occasions;lexical=+product.richDescription;careNotes=+product.careNotes;featured=+product.featured;videoUrl=+product.video;model3dUrl=+product.model3d;categoryId=ShopProduct.category;seoTitle=+product.seo.title;seoDescription=+product.seo.description;ogImage=+product.seo.image;translations=ShopProduct.translations;needsRewrite=+product.review.needsRewrite;importSource=+product.provenance.source;importRef=+product.provenance.reference;tier=ShopProduct.tier;sizeTier=+product.sizeTier;inStock=+product.availability;sourceHash=+product.provenance.hash;ownerTouched=+product.review.ownerTouched;studioEditedAt=+product.review.editedAt;confirmedAt=+product.review.confirmedAt;confirmedById=+product.review.confirmedBy',
 ProductImage:'url=ShopProduct.gallery[].src;alt=ShopProduct.gallery[].alt;order=ShopProduct.gallery[] array order;productId=+crosswalk.Product;role=+product.mediaRole',
 CustomizationField:'productId=+crosswalk.Product;label=CustomField.label;type=CustomField.type;options=CustomField.options;required=CustomField.required;helpText=CustomField.hint;order=CustomField[] array order',
 Inquiry:'number=+privateLegacyInquiry.number;source=+privateLegacyInquiry.source;productId=rivya_inquiries.product_id;customerName=rivya_inquiries.name;phone=rivya_inquiries.phone;email=rivya_inquiries.email;selections=rivya_inquiries.answers;referenceImageUrls=+privateReferenceCrosswalk;budgetRange=+privateLegacyInquiry.budgetRange;timeline=+privateLegacyInquiry.timeline;notes=rivya_inquiries.notes;whatsappMessage=rivya_inquiries.summary;claimTokenHash=!EXCLUDED_SECRET;attribution=+privateLegacyInquiry.attribution;quotedPrice=+privateLegacyInquiry.quotedPrice;finalPrice=+privateLegacyInquiry.finalPrice;staffNotes=rivya_inquiry_notes.body',
 Portfolio:'title=ContentDocument.title;slug=ContentDocument.route;story=ContentDocument.sections[].paragraphs;brief=ContentDocument.sections[].paragraphs;process=ContentDocument.sections[].paragraphs;clientNote=+portfolio.privateClientNote;location=EditorialRecord.details[];year=EditorialRecord.details[];beforeImageUrl=EditorialRecord.gallery[];afterImageUrl=EditorialRecord.gallery[];videoUrl=+portfolio.video;resultsMeta=+portfolio.resultsMeta;translations=ContentDocument.translations;categoryId=+categoryCrosswalk',
 PortfolioImage:'url=EditorialUsage.path;alt=EditorialUsage.alt;caption=EditorialUsage.caption;translations=+mediaUsage.translations;order=EditorialRecord.gallery[] array order;portfolioId=+crosswalk.Portfolio',
 BlogCategory:'name=DiscoveryMetadata.format;slug=+blogTaxonomy.slug;translations=+blogTaxonomy.translations',
 Tag:'name=DiscoveryMetadata.tags[];slug=+tagTaxonomy.slug;translations=+tagTaxonomy.translations',
 BlogPost:'title=ContentDocument.title;slug=ContentDocument.route;excerpt=ContentDocument.description;content=ContentDocument.sections[].body;coverImage=ContentDocument.headerImage;authorName=EditorialReview.author;blogCategoryId=+blogCategoryCrosswalk;publishedAt=+publication.legacyPublishedAt;seoTitle=+content.seo.title;seoDescription=+content.seo.description;translations=ContentDocument.translations;categoryId=+categoryCrosswalk',
 Testimonial:'name=EditorialRecord.attribution;location=EditorialRecord.details[];quote=ContentDocument.sections[].paragraphs;rating=+testimonial.rating;avatarUrl=+testimonial.avatar;order=+testimonial.order;translations=ContentDocument.translations;featured=+testimonial.featured;designation=EditorialRecord.details[];category=DiscoveryMetadata.tags[];givenAt=+testimonial.givenAt;language=+testimonial.language;productId=+testimonial.productId;portfolioId=+testimonial.portfolioId;productTitle=+testimonial.productTitle;purchaseType=+testimonial.purchaseType;mediaId=+testimonial.avatarMediaId;installationImageUrl=+testimonial.installationImage;installationMediaId=+testimonial.installationMediaId;videoUrl=+testimonial.video;videoPosterUrl=+testimonial.videoPoster;internalNotes=+testimonial.privateNotes;permissionStatus=EditorialRecord.evidence.permission;verifiedAt=EditorialRecord.evidence.approvedOn;verifiedById=EditorialRecord.evidence.reviewer',
 Faq:'question=ContentDocument.sections[].heading;answer=ContentDocument.sections[].paragraphs;order=+faq.order;translations=ContentDocument.translations',
 Media:'url=EditorialMedia.path;pathname=+media.privateOriginalPath;type=+media.type;folder=+media.folder;bytes=EditorialMedia.editorial.bytes;width=EditorialMedia.editorial.width;height=EditorialMedia.editorial.height;originalName=EditorialMedia.editorial.filename;alt=PublicMedia.alt;checksum=EditorialMedia.editorial.sha256;blurDataUrl=+media.blurDataUrl;dominantHex=+media.dominantHex;provenance=EditorialMedia.editorial.classification;tags=+media.tags;caption=PublicMedia.caption;favourite=+media.favourite;duration=+media.video.duration;posterUrl=+media.video.poster',
 Page:'slug=ContentDocument.route;title=ContentDocument.title;content=ContentDocument.sections[].body;seoTitle=+content.seo.title;seoDescription=+content.seo.description;translations=ContentDocument.translations',
 SiteSettings:'brandName=!current brand;tagline=ContentDocument (shared copy);logoUrl=!current logo;heroVideoUrl=PresentationDocument.media[];announcement=+announcement.text;chartTimezone=+analytics.timezone;phone=!BusinessSettings.phone;whatsappNumber=!BusinessSettings.whatsapp;email=!BusinessSettings.email;mapsUrl=!BusinessSettings.map;address=!current contact address;socials=!current social destinations;defaultSeo=+seo.defaults;faviconUrl=!current favicon;appIconUrl=!current app icon;defaultCareNotes=+care.defaults;businessHours=+business.hours;responseNote=+business.responseNote;announcementStartsAt=+announcement.startsAt;announcementEndsAt=+announcement.endsAt;announcementHref=+announcement.href;catalogFillEnabled=!OWNER_DISABLED_PRODUCT_FILL;catalogFillOnDeploy=!OWNER_DISABLED_PRODUCT_FILL;catalogFillMaxCreates=!OWNER_DISABLED_PRODUCT_FILL;demoContentPublic=!current publication policy',
 ActivityLog:'userId=+privateLegacyHistory.actorSourceId;action=+privateLegacyHistory.action;entity=+privateLegacyHistory.entity;entityId=+privateLegacyHistory.entitySourceId;meta=+privateLegacyHistory.metadata',
 Subscriber:'email=rivya_newsletter_subscribers.email;source=rivya_newsletter_subscribers.source',
 SiteImage:'key=+placementCrosswalk.key;url=EditorialUsage.path;mediaId=+mediaCrosswalk;mobileUrl=+mediaUsage.mobilePath;mobileMediaId=+mediaCrosswalk.mobile;focalX=EditorialUsage.desktop.x;focalY=EditorialUsage.desktop.y;draft=+placementDraftSeparateFromPublished',
 SiteCopy:'key=+copyKeyCrosswalk;locale=ContentDocument.translations[locale];value=ContentDocument published text;draftValue=ContentDocument draft text;updatedById=+provenance.source.actorId',
 FormOption:'list=+commissionOptions.list;value=+commissionOptions.value;label=+commissionOptions.localizedLabel;order=+commissionOptions.order;enabled=+commissionOptions.enabled',
 NavMenu:'key=SiteSettings.navigation menu key',
 NavItem:'menuKey=SiteSettings.navigation menu key;key=NavItem.id;label=NavItem.label;href=NavItem.href;order=NavItem[] array order;visible=NavItem.visible;newTab=NavItem.newTab',
 ContentRevision:'surface=+privateLegacyHistory.surface;payload=+privateLegacyHistory.payload;summary=+privateLegacyHistory.summary;authorId=+privateLegacyHistory.actorSourceId',
 PageSection:'pageKey=+pageCrosswalk;key=ContentSection.id;order=ContentDocument published sections[] array order;visible=ContentSection published enabled;draftOrder=ContentDocument draft sections[] array order;draftVisible=ContentSection draft enabled;notes=ContentSection.sourceNote;updatedById=+provenance.source.actorId',
 CustomPage:'slug=ContentDocument.route;title=ContentDocument.title;publishAt=+publication.schedule;noindex=+content.seo.noindex;seoTitle=+content.seo.title;seoDescription=+content.seo.description;ogImage=+content.seo.image;translations=ContentDocument.translations;updatedById=+provenance.source.actorId',
 CustomBlock:'pageId=+crosswalk.CustomPage;type=LandingBlock.type;order=LandingDocument.blocks[] array order;data=LandingBlock;translations=+landingBlock.translations'
}).map(([entity,value])=>[entity,parse(value)]));
export function fieldRule(field){
 const {entity,field:name,kind,baseType}=field;
 if(entity==='User'||entity==='RateLimitHit')return {target:null,disposition:'EXCLUDE_AUTH_RUNTIME',transform:'Do not copy accounts, credentials, sessions or runtime rate limits; preserve current security'};
 if(/password|token|secret|credential/i.test(name))return {target:null,disposition:'EXCLUDE_SECRET',transform:'Never include source secret values in mapping artifacts'};
 let target=fields[entity]?.[name];
 if(kind==='relation')target='+relationships.'+entity+'.'+name;
 else if(name==='id')target='+crosswalk.'+entity+'.sourceId';
 else if(['createdAt','updatedAt','isDemo','status'].includes(name))target='+provenance.'+entity+'.'+name;
 else if(researchEntities.has(entity))target='+research.'+entity+'.'+name;
 else if(excludedProductEntities.has(entity)&&!target)target='+excludedProductHistory.'+entity+'.'+name;
 if(!target)throw Error('Missing explicit field disposition: '+entity+'.'+name);
 const disposition=excludedProductEntities.has(entity)?'OWNER_EXCLUDED_PRODUCT_DATA':target.startsWith('!')?'KEEP_PROTECTED_DESTINATION':kind==='relation'?'RELATIONSHIP_CROSSWALK_REQUIRED':target.startsWith('+')?'ADDITIVE_CONTRACT_REQUIRED':'EXISTING_CONTRACT_ADAPTER';
 const rules=[];
 if(kind==='relation'||/Id$/.test(name)||name==='id')rules.push('Namespace + immutable source ID only; no title, filename or positional identity match; reject missing/ambiguous endpoints');
 if(/title|^name$|displayName|question/.test(name))rules.push('Current populated title/name wins; any replacement needs exact revision and both value digests');
 if(/price|amount/i.test(name))rules.push(name==='priceMinor'?'Research variant priceMinor is integer minor units (paise for INR); retain explicit currency/basis and nullable quote-only values':'Preserve source amount and currency units explicitly; legacy catalogue priceMin/priceMax and current ShopProduct.amount are displayed as rupees, not paise; never apply an inferred 100x conversion or fabricate sample=true');
 if(/status|visible|published|publishAt|isDemo|permission|verified/i.test(name))rules.push('No inherited publication/permission approval; preserve tombstones, drafts and genuine-evidence gates');
 if(/translation|locale|language/i.test(name))rules.push('Retain locale keys and original text; keep unsupported keys privately; do not create reviewed/native approval');
 if(baseType==='Json')rules.push('Validate structured shape; preserve unsupported rich content privately, never stringify into public copy or silently truncate');
 if(baseType==='DateTime')rules.push('Preserve valid source instant in provenance; never reset current row creation/revision timestamps');
 if(/url|image|media|poster|focal|checksum|provenance/i.test(name))rules.push('Use verified media crosswalk; exact byte digest or explicit manifest evidence; keep originals/crops/privacy; no automatic relinking');
 if(name==='rating')rules.push('No default five-star conversion; genuine source and permission required; proposed optional integer 1..5');
 if(entity==='Subscriber')rules.push('Current source enum permits footer/journal only; do not coerce old workshop sources or invent consent');
 if(entity==='CustomizationField'&&name==='type')rules.push('Legacy SELECT/TEXT/NUMBER have corresponding current types; SWATCH/SIZE/FILE need equivalent explicit contracts and cannot silently become plain select/text fields');
 if(entity==='Product'&&name==='tier')rules.push('Legacy numeric source tier is not current large/memory/personal journey tier');
 if(entity==='SiteImage'&&name==='draft')rules.push('Draft placement stays distinct from current published usage');
 if(entity==='Media'&&name==='provenance')rules.push('AI maps to design-visualization; UPLOAD/BUNDLED do not establish photography; unknown remains unknown');
 if(entity==='SiteImage'&&['focalX','focalY'].includes(name))rules.push('Source fractions 0..1 become destination percentages 0..100 by multiplying by 100; reject out-of-range values; retain separate mobile crop');
 if(!rules.length)rules.push('Validate destination length/type/enum; preserve current populated values and intentional blanks; reject lossy conversion');
 return {target:target.replace(/^[+!]/,''),disposition,transform:rules.join(' | ')};
}

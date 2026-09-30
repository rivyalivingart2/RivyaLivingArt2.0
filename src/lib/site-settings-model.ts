export const locales=['en','hi','gu','ar','es','de','fr','zh','ja'] as const;
export type Locale=(typeof locales)[number];
export const defaultLocale:Locale='en';
export const localeLabels:Record<Locale,string>={
 en:'English',hi:'हिन्दी',gu:'ગુજરાતી',ar:'العربية',es:'Español',de:'Deutsch',fr:'Français',zh:'中文',ja:'日本語'
};
export const rtlLocales:readonly Locale[]=['ar'];
export const localeDir=(locale:string):'ltr'|'rtl'=>(rtlLocales as readonly string[]).includes(locale)?'rtl':'ltr';
export const isLocale=(value:string):value is Locale=>(locales as readonly string[]).includes(value);

export type LocalizedLabel=Partial<Record<Locale,string>>&{en:string};
export type NavItem={id:string;label:LocalizedLabel;href:string;visible:boolean;newTab:boolean};
export type NavMenuKey='collections'|'header'|'footerExplore'|'footerAtelier'|'footerLegal';
export type NavigationSettings=Record<NavMenuKey,NavItem[]>;
export type LocalizationSettings={enabled:boolean;enabledLocales:Locale[]};
export type SiteSettings={navigation:NavigationSettings;localization:LocalizationSettings};

const item=(id:string,label:string,href:string):NavItem=>({id,label:{en:label},href,visible:true,newTab:false});
export const defaultNavigation:NavigationSettings={
 collections:[
  item('collection-large','Furniture & spatial art','/collectible-design'),
  item('collection-memory','Memory art','/memory-art'),
  item('collection-personal','Personal art & gifts','/personal-art'),
 ],
 header:[
  item('header-atelier','Our Atelier','/our-story'),
  item('header-process','Process','/process'),
  item('header-journal','Journal','/journal'),
  item('header-contact','Contact','/contact'),
 ],
 footerExplore:[
  item('footer-large','Furniture & spatial art','/collectible-design'),
  item('footer-memory','Memory art','/memory-art'),
  item('footer-personal','Personal art & gifts','/personal-art'),
 ],
 footerAtelier:[
  item('footer-atelier','Our Atelier','/our-story'),
  item('footer-process','How it works','/process'),
  item('footer-journal','Journal','/journal'),
  item('footer-faq','Your questions','/faq'),
 ],
 footerLegal:[
  item('legal-privacy','Privacy','/privacy'),
  item('legal-terms','Terms','/terms'),
  item('legal-accessibility','Accessibility','/accessibility'),
  item('legal-delivery','Delivery','/shipping-delivery'),
  item('legal-returns','Changes & cancellations','/returns-cancellations'),
  item('legal-imprint','Imprint','/imprint'),
 ],
};

export const defaultSiteSettings:SiteSettings={
 navigation:defaultNavigation,
 localization:{enabled:false,enabledLocales:['en']},
 localization:{enabled:true,enabledLocales:[...locales]},
};

const knownStaticRoutes=new Set([
 '/','/collectible-design','/memory-art','/personal-art','/commission','/commission/customize','/journal','/search','/portfolio',
 '/our-story','/process','/contact','/faq','/privacy','/terms','/accessibility','/shipping-delivery','/returns-cancellations',
 '/imprint','/architects','/materials-care','/materials','/care','/preserve','/personalize'
]);

export function describeHrefProblem(value:string):string|null{
 const href=value.trim();
 if(!href)return 'Add a destination.';
 if(/^https:\/\//i.test(href)||href.startsWith('mailto:')||href.startsWith('tel:'))return null;
 if(!href.startsWith('/'))return 'Internal links must start with /.';
 const path=href.split(/[?#]/)[0];
 if(knownStaticRoutes.has(path))return null;
 if(/^\/(pieces|journal|portfolio)\/[a-z0-9]+(?:-[a-z0-9]+)*(?:\/customize)?$/.test(path))return null;
 return `There is no approved public route at ${path}.`;
}

const clean=(v:unknown,max:number)=>typeof v==='string'&&v.trim().length>0&&v.length<=max&&!/[<>]/.test(v);
const validLabel=(value:unknown):value is LocalizedLabel=>{
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const label=value as Record<string,unknown>;
 if(!clean(label.en,60))return false;
 for(const [locale,text] of Object.entries(label)){
  if(!isLocale(locale)||typeof text!=='string'||text.length>60||/[<>]/.test(text))return false;
 }
 return true;
};
const validItem=(value:unknown):value is NavItem=>{
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const item=value as NavItem;
 return /^[a-z0-9][a-z0-9-]{1,79}$/.test(item.id)&&validLabel(item.label)&&typeof item.href==='string'&&item.href.length<=500&&!describeHrefProblem(item.href)&&typeof item.visible==='boolean'&&typeof item.newTab==='boolean';
};
const menuKeys:NavMenuKey[]=['collections','header','footerExplore','footerAtelier','footerLegal'];
export function validSiteSettings(value:unknown):value is SiteSettings{
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const v=value as SiteSettings;
 if(!v.navigation||!v.localization||typeof v.localization.enabled!=='boolean'||!Array.isArray(v.localization.enabledLocales))return false;
 if(!v.localization.enabledLocales.includes('en')||new Set(v.localization.enabledLocales).size!==v.localization.enabledLocales.length||v.localization.enabledLocales.some(l=>!isLocale(l)))return false;
 for(const key of menuKeys){
  const rows=v.navigation[key];
  if(!Array.isArray(rows)||rows.length>12||rows.some(row=>!validItem(row))||new Set(rows.map(row=>row.id)).size!==rows.length)return false;
  if((key==='collections'||key==='header')&&!rows.some(row=>row.visible))return false;
 }
 return true;
}
export function localizedLabel(label:LocalizedLabel,locale:string){return (isLocale(locale)&&label[locale]?.trim())||label.en;}
export function localePath(path:string,locale:string){
 if(locale==='en'||!isLocale(locale))return path;
 if(path==='/' )return '/'+locale;
 return '/'+locale+(path.startsWith('/')?path:'/'+path);
}
export function stripLocalePath(pathname:string):{locale:Locale;path:string}{
 const parts=pathname.split('/').filter(Boolean);
 if(parts.length&&isLocale(parts[0]))return {locale:parts[0],path:'/'+parts.slice(1).join('/')||'/'};
 return {locale:'en',path:pathname||'/'};
}

export type UiKey='collections'|'searchPieces'|'beginPiece'|'openNavigation'|'closeNavigation'|'exploreTitle'|'theCollections'|'findPiece'|'searchCollection'|'exploreResults'|'browseAllPieces'|'footerExplore'|'footerAtelier'|'footerTalk'|'emailAtelier'|'contact'|'customPieces'|'skipMain';
const ui:Record<Locale,Record<UiKey,string>>={
 en:{collections:'Collections',searchPieces:'Search pieces',beginPiece:'Begin a piece',openNavigation:'Open navigation',closeNavigation:'Close navigation',exploreTitle:'Explore RivyaLivingArt',theCollections:'The collections',findPiece:'Find your piece',searchCollection:'Search the collection',exploreResults:'Explore results ↗',browseAllPieces:'Browse all pieces',footerExplore:'Explore',footerAtelier:'The atelier',footerTalk:'Let’s talk',emailAtelier:'Email the atelier',contact:'Contact',customPieces:'Custom pieces, considered with the atelier.',skipMain:'Skip to main content'},
 hi:{collections:'संग्रह',searchPieces:'कृतियाँ खोजें',beginPiece:'एक कृति शुरू करें',openNavigation:'नेविगेशन खोलें',closeNavigation:'नेविगेशन बंद करें',exploreTitle:'RivyaLivingArt देखें',theCollections:'संग्रह',findPiece:'अपनी कृति खोजें',searchCollection:'संग्रह में खोजें',exploreResults:'परिणाम देखें ↗',browseAllPieces:'सभी कृतियाँ देखें',footerExplore:'देखें',footerAtelier:'एटेलियर',footerTalk:'बात करें',emailAtelier:'एटेलियर को ईमेल करें',contact:'संपर्क',customPieces:'एटेलियर के साथ विचारपूर्वक बनाई गई कस्टम कृतियाँ।',skipMain:'मुख्य सामग्री पर जाएँ'},
 gu:{collections:'સંગ્રહો',searchPieces:'કૃતિઓ શોધો',beginPiece:'એક કૃતિ શરૂ કરો',openNavigation:'નેવિગેશન ખોલો',closeNavigation:'નેવિગેશન બંધ કરો',exploreTitle:'RivyaLivingArt જુઓ',theCollections:'સંગ્રહો',findPiece:'તમારી કૃતિ શોધો',searchCollection:'સંગ્રહમાં શોધો',exploreResults:'પરિણામો જુઓ ↗',browseAllPieces:'બધી કૃતિઓ જુઓ',footerExplore:'જુઓ',footerAtelier:'એટેલિયર',footerTalk:'વાત કરીએ',emailAtelier:'એટેલિયરને ઈમેલ કરો',contact:'સંપર્ક',customPieces:'એટેલિયર સાથે વિચારપૂર્વક બનાવેલી કસ્ટમ કૃતિઓ.',skipMain:'મુખ્ય સામગ્રી પર જાઓ'},
 ar:{collections:'المجموعات',searchPieces:'ابحث عن القطع',beginPiece:'ابدأ قطعة',openNavigation:'افتح التنقل',closeNavigation:'أغلق التنقل',exploreTitle:'استكشف RivyaLivingArt',theCollections:'المجموعات',findPiece:'اعثر على قطعتك',searchCollection:'ابحث في المجموعة',exploreResults:'استكشف النتائج ↗',browseAllPieces:'تصفح كل القطع',footerExplore:'استكشف',footerAtelier:'الاستوديو',footerTalk:'لنتحدث',emailAtelier:'راسل الاستوديو',contact:'تواصل',customPieces:'قطع مخصصة تُصاغ بعناية مع الاستوديو.',skipMain:'انتقل إلى المحتوى الرئيسي'},
 es:{collections:'Colecciones',searchPieces:'Buscar piezas',beginPiece:'Comenzar una pieza',openNavigation:'Abrir navegación',closeNavigation:'Cerrar navegación',exploreTitle:'Explorar RivyaLivingArt',theCollections:'Las colecciones',findPiece:'Encuentra tu pieza',searchCollection:'Buscar en la colección',exploreResults:'Ver resultados ↗',browseAllPieces:'Ver todas las piezas',footerExplore:'Explorar',footerAtelier:'El atelier',footerTalk:'Hablemos',emailAtelier:'Escribir al atelier',contact:'Contacto',customPieces:'Piezas a medida, pensadas con el atelier.',skipMain:'Saltar al contenido principal'},
 de:{collections:'Kollektionen',searchPieces:'Stücke suchen',beginPiece:'Ein Stück beginnen',openNavigation:'Navigation öffnen',closeNavigation:'Navigation schließen',exploreTitle:'RivyaLivingArt entdecken',theCollections:'Kollektionen',findPiece:'Finde dein Stück',searchCollection:'Kollektion durchsuchen',exploreResults:'Ergebnisse ansehen ↗',browseAllPieces:'Alle Stücke ansehen',footerExplore:'Entdecken',footerAtelier:'Das Atelier',footerTalk:'Kontakt',emailAtelier:'Atelier per E-Mail',contact:'Kontakt',customPieces:'Individuelle Stücke, gemeinsam mit dem Atelier entwickelt.',skipMain:'Zum Hauptinhalt springen'},
 fr:{collections:'Collections',searchPieces:'Rechercher des pièces',beginPiece:'Commencer une pièce',openNavigation:'Ouvrir la navigation',closeNavigation:'Fermer la navigation',exploreTitle:'Explorer RivyaLivingArt',theCollections:'Les collections',findPiece:'Trouvez votre pièce',searchCollection:'Rechercher dans la collection',exploreResults:'Voir les résultats ↗',browseAllPieces:'Voir toutes les pièces',footerExplore:'Explorer',footerAtelier:'L’atelier',footerTalk:'Parlons-en',emailAtelier:'Écrire à l’atelier',contact:'Contact',customPieces:'Des pièces sur mesure, pensées avec l’atelier.',skipMain:'Aller au contenu principal'},
 zh:{collections:'系列',searchPieces:'搜索作品',beginPiece:'开始定制',openNavigation:'打开导航',closeNavigation:'关闭导航',exploreTitle:'探索 RivyaLivingArt',theCollections:'系列',findPiece:'找到你的作品',searchCollection:'搜索系列',exploreResults:'查看结果 ↗',browseAllPieces:'浏览全部作品',footerExplore:'探索',footerAtelier:'工作室',footerTalk:'联系我们',emailAtelier:'给工作室发邮件',contact:'联系',customPieces:'与工作室共同构思的定制作 品。',skipMain:'跳到主要内容'},
 ja:{collections:'コレクション',searchPieces:'作品を検索',beginPiece:'作品づくりを始める',openNavigation:'ナビゲーションを開く',closeNavigation:'ナビゲーションを閉じる',exploreTitle:'RivyaLivingArtを見る',theCollections:'コレクション',findPiece:'作品を見つける',searchCollection:'コレクションを検索',exploreResults:'結果を見る ↗',browseAllPieces:'すべての作品を見る',footerExplore:'見る',footerAtelier:'アトリエ',footerTalk:'お問い合わせ',emailAtelier:'アトリエにメール',contact:'連絡先',customPieces:'アトリエとともに考えるオーダーメイド作品。',skipMain:'メインコンテンツへ移動'}
};
export function uiText(locale:Locale,key:UiKey){return ui[locale]?.[key]||ui.en[key];}

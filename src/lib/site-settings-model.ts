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

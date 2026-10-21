import Image from 'next/image';
import {CinematicCanvas,VisualEffectsControl} from '../design-foundation/cinematic-canvas';
import {JourneyLanguage,LanguageNotice} from './journey-language';
import {defaultBusiness,type BusinessSettings} from '@/lib/business-settings-model';
import Link from 'next/link';
import {ShopHeader,type CollectionImage} from './header';
import {LocaleSwitcher} from './locale-switcher';
import {defaultNavigation,navigationLabel,uiText,type Locale,type NavigationSettings,type NavItem} from '@/lib/site-settings-model';
import {sharedCopyValues,type SharedCopy} from '@/lib/shared-copy-model';
import s from './shop.module.css';
import f from './public-frame.module.css';
import pages from './public-pages.module.css';
import legacy from './legacy-public-pages.module.css';
import {PublicContact} from './legacy-product-actions';

function FooterNavLink({item,locale}:{item:NavItem;locale:Locale}){
 const label=navigationLabel(item,locale),props=item.newTab?{target:'_blank',rel:'noreferrer'}:{};
 return item.href.startsWith('/')?<Link href={item.href} {...props}>{label}</Link>:<a href={item.href} {...props}>{label}</a>;
}
export function ShopFrame({children,business=defaultBusiness,navigation=defaultNavigation,locale='en',enabledLocales=['en'],copy=sharedCopyValues(),copyVersion=0,contactAvailable=true,publicDesign=false,collectionImages=[]}:{children:React.ReactNode;business?:Pick<BusinessSettings,'phone'|'email'>&Partial<BusinessSettings>;navigation?:NavigationSettings;locale?:Locale;enabledLocales?:Locale[];copy?:SharedCopy;copyVersion?:number;contactAvailable?:boolean;publicDesign?:boolean;collectionImages?:CollectionImage[]}){
 const label=(key:Parameters<typeof uiText>[1])=>copy[key]||uiText(locale,key);
 const explore=navigation.footerExplore.filter(v=>v.visible),atelier=navigation.footerAtelier.filter(v=>v.visible),legal=navigation.footerLegal.filter(v=>v.visible);
 const whatsapp=business.whatsapp||business.phone.replace(/\D/g,'');
 return <JourneyLanguage locale={locale}><PublicContact whatsapp={whatsapp}><CinematicCanvas><div className={s.site+' '+f.frame} data-legacy-public-frame data-site-copy-revision={copyVersion}><LanguageNotice/>
  <ShopHeader navigation={navigation} locale={locale} enabledLocales={enabledLocales} copy={copy} whatsapp={whatsapp} images={collectionImages}/>
  <main className={publicDesign?pages.surface+' '+legacy.surface:undefined} id="main-content" tabIndex={-1}>{children}</main>
  <footer data-atmosphere="footer" className={f.footer}>
   <div className={f.footerCta}><h2 data-copy-field="footer-statement">{copy['footer-statement']}</h2><Link href="/commission" className={f.outlineButton}>{label('beginPiece')} ↗</Link></div>
   <div className={f.footerGrid}>
    <div className={f.footerIdentity}><Link className={f.brand} href="/"><Image src="/brand/rivyalivingart-logo-horizontal-transparent.png" width={410} height={116} sizes="184px" alt="RivyaLivingArt"/></Link><p>{label('customPieces')}</p><LocaleSwitcher locale={locale} enabled={enabledLocales}/><VisualEffectsControl/></div>
    <section><h3>{label('footerExplore')}</h3><ul>{explore.map(item=><li key={item.id}><FooterNavLink item={item} locale={locale}/></li>)}</ul></section>
    <section><h3>{label('footerAtelier')}</h3><ul>{atelier.map(item=><li key={item.id}><FooterNavLink item={item} locale={locale}/></li>)}</ul></section>
    <section><h3>{label('footerTalk')}</h3><ul><li><a href={'https://wa.me/'+whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></li><li><a href={'tel:'+business.phone}>{business.phone}</a></li><li><a href={'mailto:'+business.email}>{label('emailAtelier')}</a></li>{contactAvailable&&<li><Link href="/contact">{label('contact')}</Link></li>}</ul></section>
   </div>
   <div className={f.footerBottom}><span>© {new Date().getFullYear()} RivyaLivingArt</span><div className={f.footerLegal}>{legal.map(item=><FooterNavLink key={item.id} item={item} locale={locale}/>)}</div></div>
  </footer>
 </div></CinematicCanvas></PublicContact></JourneyLanguage>;
}

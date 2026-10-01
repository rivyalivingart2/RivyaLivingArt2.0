import Image from 'next/image';
import {businessContact} from '@/lib/contact';
import Link from 'next/link';
import {ShopHeader} from './header';
import {LocaleSwitcher} from './locale-switcher';
import {defaultNavigation,localizedLabel,uiText,type Locale,type NavigationSettings,type NavItem} from '@/lib/site-settings-model';
import {sharedCopyValues,type SharedCopy} from '@/lib/shared-copy-model';
import s from './shop.module.css';

function FooterNavLink({item,locale}:{item:NavItem;locale:Locale}){
 const label=localizedLabel(item.label,locale),props=item.newTab?{target:'_blank',rel:'noreferrer'}:{};
 return item.href.startsWith('/')?<Link href={item.href} {...props}>{label}</Link>:<a href={item.href} {...props}>{label}</a>;
}
export function ShopFrame({children,business={phone:businessContact.phone,email:businessContact.email},navigation=defaultNavigation,locale='en',enabledLocales=['en'],copy=sharedCopyValues(),copyVersion=0}:{children:React.ReactNode;business?:{phone:string;email:string};navigation?:NavigationSettings;locale?:Locale;enabledLocales?:Locale[];copy?:SharedCopy;copyVersion?:number}){
 const label=(key:Parameters<typeof uiText>[1])=>copy[key]||uiText(locale,key);
 const explore=navigation.footerExplore.filter(v=>v.visible),atelier=navigation.footerAtelier.filter(v=>v.visible),legal=navigation.footerLegal.filter(v=>v.visible);
 return <div className={s.site} data-site-copy-revision={copyVersion}>
    <ShopHeader navigation={navigation} locale={locale} enabledLocales={enabledLocales} copy={copy}/><main id="main-content" tabIndex={-1}>{children}</main><footer className={s.footer}><div className={s.footerTop}><div><Link className={s.brand} href="/"><Image src="/brand/rivyalivingart-logo-horizontal-transparent.png" width={410} height={116} alt="RivyaLivingArt"/></Link><p data-copy-field="footer-statement">{copy['footer-statement']}</p><LocaleSwitcher locale={locale} enabled={enabledLocales}/></div><section><h3>{label('footerExplore')}</h3><ul>{explore.map(item=><li key={item.id}><FooterNavLink item={item} locale={locale}/></li>)}</ul></section><section><h3>{label('footerAtelier')}</h3><ul>{atelier.map(item=><li key={item.id}><FooterNavLink item={item} locale={locale}/></li>)}</ul></section><section><h3>{label('footerTalk')}</h3><ul><li><Link href="/commission">{label('beginPiece')} ↗</Link></li><li><a href={'tel:'+business.phone}>{business.phone}</a></li><li><a href={'mailto:'+business.email}>{label('emailAtelier')}</a></li><li><Link href="/contact">{label('contact')}</Link></li></ul></section></div><div className={s.footerBottom}><span>© {new Date().getFullYear()} RivyaLivingArt</span><span>{label('customPieces')}</span><span>{legal.map((item,index)=><span key={item.id}>{index>0?' · ':''}<FooterNavLink item={item} locale={locale}/></span>)}</span></div></footer></div>;
}

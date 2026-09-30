import Image from 'next/image';
import {businessContact} from '@/lib/contact';
import Link from 'next/link';
import {ShopHeader} from './header';
import {LocaleSwitcher} from './locale-switcher';
import {localizedLabel,uiText,type Locale,type NavigationSettings,type NavItem} from '@/lib/site-settings-model';
import s from './shop.module.css';

function FooterNavLink({item,locale}:{item:NavItem;locale:Locale}){
 const label=localizedLabel(item.label,locale),props=item.newTab?{target:'_blank',rel:'noreferrer'}:{};
 return item.href.startsWith('/')?<Link href={item.href} {...props}>{label}</Link>:<a href={item.href} {...props}>{label}</a>;
}
export function ShopFrame({children,business={phone:businessContact.phone,email:businessContact.email},navigation,locale,enabledLocales}:{children:React.ReactNode;business?:{phone:string;email:string};navigation:NavigationSettings;locale:Locale;enabledLocales:Locale[]}){
 const explore=navigation.footerExplore.filter(v=>v.visible),atelier=navigation.footerAtelier.filter(v=>v.visible),legal=navigation.footerLegal.filter(v=>v.visible);
 return <div className={s.site}>
    <a href="#main-content" className={s.skipLink}>{uiText(locale,'skipMain')}</a>
    <ShopHeader navigation={navigation} locale={locale} enabledLocales={enabledLocales}/><main id="main-content" tabIndex={-1}>{children}</main><footer className={s.footer}><div className={s.footerTop}><div><Link className={s.brand} href="/"><Image src="/brand/rivyalivingart-logo-horizontal-transparent.png" width={410} height={116} alt="RivyaLivingArt"/></Link><p>Objects for the spaces we inhabit.<br/>Art for the stories we keep.</p><LocaleSwitcher locale={locale} enabled={enabledLocales}/></div><section><h3>{uiText(locale,'footerExplore')}</h3><ul>{explore.map(item=><li key={item.id}><FooterNavLink item={item} locale={locale}/></li>)}</ul></section><section><h3>{uiText(locale,'footerAtelier')}</h3><ul>{atelier.map(item=><li key={item.id}><FooterNavLink item={item} locale={locale}/></li>)}</ul></section><section><h3>{uiText(locale,'footerTalk')}</h3><ul><li><Link href="/commission">{uiText(locale,'beginPiece')} ↗</Link></li><li><a href={'tel:'+business.phone}>{business.phone}</a></li><li><a href={'mailto:'+business.email}>{uiText(locale,'emailAtelier')}</a></li><li><Link href="/contact">{uiText(locale,'contact')}</Link></li></ul></section></div><div className={s.footerBottom}><span>© {new Date().getFullYear()} RivyaLivingArt</span><span>{uiText(locale,'customPieces')}</span><span>{legal.map((item,index)=><span key={item.id}>{index>0?' · ':''}<FooterNavLink item={item} locale={locale}/></span>)}</span></div></footer></div>;
}

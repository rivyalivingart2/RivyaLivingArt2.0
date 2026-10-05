'use client';
import {useJourneyText} from './journey-language';
import {useState} from 'react';
import Link from 'next/link';
import type {OrderReceipt} from '@/lib/order-receipt';
import {SavedOrderActions} from './saved-order-actions';
import p from './detailed-pages.module.css';
import s from './shop.module.css';
import c from './catalogue-journey.module.css';

export function SavedReceipt({receipt:initial,requestKey,saveReceiptLocation}:{receipt:OrderReceipt;requestKey:string;saveReceiptLocation:boolean}){
 const t=useJourneyText();
 const [receipt,setReceipt]=useState(initial);
 return <section className={s.prose+' '+c.receipt}><span className={s.eyebrow}>{t("Inquiry saved ·")} <span className={s.productIndex} style={{display:'inline',margin:0}}>{receipt.reference}</span></span><h1>{t("Your brief is with us.")}</h1><p>{t("Your request has been saved for the atelier to review. A saved request is not a confirmed quotation or production booking. Final design, quotation and delivery need the atelier’s agreement.")}</p>
 <ol className={p.receiptSteps} aria-label="Saved request status"><li><strong>{t("1 · Brief saved")}</strong><span>{t("Your reference identifies this request.")}</span></li><li><strong>{receipt.handoffAllowed?t('2 · Message prepared'):t('2 · Message preparation')}</strong><span>{receipt.handoffAllowed?t('Review or copy the prepared message below.'):t('Use the recovery controls below; your saved brief remains available.')}</span></li><li><strong>{t("3 · You choose to send")}</strong><span>{t("Open WhatsApp and press Send yourself. Sending status is not tracked here.")}</span></li></ol>
 <SavedOrderActions receipt={receipt} endpoint={'/api/inquiry/receipt?key='+encodeURIComponent(requestKey)} identity={{key:requestKey}} saveReceiptLocation={saveReceiptLocation} onChange={setReceipt}/>
 {receipt.summary?<details open><summary>{t("Your saved order message")}</summary><pre className={s.receiptSummary}>{receipt.summary}</pre></details>:receipt.brief&&<details open><summary>{t("Your saved brief")}</summary><dl className={s.reviewList}><dt>{t("Piece")}</dt><dd>{receipt.brief.title}</dd><dt>{t("Name")}</dt><dd>{receipt.brief.name}</dd><dt>{t("Phone")}</dt><dd>{receipt.brief.phone}</dd><dt>{t("Email")}</dt><dd>{receipt.brief.email||t('Not provided')}</dd>{receipt.brief.answers.map(a=><div key={a.label} style={{display:'contents'}}><dt>{a.label}</dt><dd>{a.value}</dd></div>)}<dt>{t("Notes")}</dt><dd>{receipt.brief.notes||t('None')}</dd><dt>{t("Private references")}</dt><dd>{receipt.brief.referenceCount}</dd></dl></details>}
 <p className={s.help}>{t("This private receipt is available in the original browser for up to 24 hours. Reopening WhatsApp or preparing the saved message does not create another inquiry. Nothing sends automatically, and the website cannot tell whether you pressed Send.")}</p><Link className={s.textLink} href="/collectible-design">{t("Return to the collection")}</Link></section>;
}

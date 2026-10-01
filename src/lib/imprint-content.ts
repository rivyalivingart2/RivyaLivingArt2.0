import type {ContentDocument} from './content-model';
import type {BusinessSettings} from './business-settings-model';
export const imprintContactId='section-2';
/** Stable legacy section id; contacts come from settings, never from editable prose. */
export function bindImprintContacts<T extends ContentDocument>(document:T,business:BusinessSettings):T{
 if(document.id!=='page:imprint')return document;
 const phone=business.phone.replace(/^(\+91)(\d{10})$/,'$1 $2');
 const contact={id:imprintContactId,heading:'Contact Information',paragraphs:[`Phone: ${phone}. Email: ${business.email}`]};
 const sections=document.sections.some(s=>s.id===imprintContactId)?document.sections.map(s=>s.id===imprintContactId?contact:s):[...document.sections,contact];
 return {...document,sections};
}

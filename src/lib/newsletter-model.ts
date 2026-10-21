export type NewsletterInput={email:string;source:'footer'|'journal';honeypot:string};
export function newsletterInput(value:unknown):NewsletterInput|null{
 if(!value||typeof value!=='object'||Array.isArray(value))return null;
 const v=value as Record<string,unknown>;
 if(Object.keys(v).some(k=>!['email','source','honeypot'].includes(k))||typeof v.email!=='string'||typeof v.honeypot!=='string'||v.honeypot.length>200||!['footer','journal'].includes(String(v.source)))return null;
 const email=v.email.trim().toLowerCase();
 if(email.length>254||! /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))return null;
 return {email,source:v.source as NewsletterInput['source'],honeypot:v.honeypot};
}

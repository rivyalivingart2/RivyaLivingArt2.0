'use client';

import { useId, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';

/** Additive, opt-in foundation. Import foundation.css at the consuming boundary. */
export function Button({variant='primary',className='',...props}: ButtonHTMLAttributes<HTMLButtonElement> & {variant?:'primary'|'secondary'|'studio'}) {
  return <button {...props} className={`rv-button rv-button--${variant} ${className}`} />;
}

export function Section({children,className='',...props}:HTMLAttributes<HTMLElement>) {
  return <section {...props} className={`rv-section ${className}`}>{children}</section>;
}

export function Field({label,hint,error,id,...props}:InputHTMLAttributes<HTMLInputElement> & {label:string;hint?:string;error?:string}) {
  const generated=useId(),fieldId=id??generated;
  return <div className="rv-field"><label htmlFor={fieldId}>{label}</label><input {...props} id={fieldId} aria-invalid={error?true:undefined} aria-describedby={hint||error?`${fieldId}-message`:undefined}/>{(hint||error)&&<p id={`${fieldId}-message`} role={error?'alert':undefined}>{error??hint}</p>}</div>;
}

export function Status({children}: {children:ReactNode}) {
  return <p className="rv-status" role="status">{children}</p>;
}

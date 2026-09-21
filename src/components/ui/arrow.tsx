import type { SVGProps } from "react";

export function Arrow(props: SVGProps<SVGSVGElement>) {
  return <svg {...props} aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

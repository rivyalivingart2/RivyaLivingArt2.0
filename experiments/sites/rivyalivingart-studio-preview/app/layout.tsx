import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'RivyaLivingArt — Website & Studio Preview', description:'Collectible furniture, resin and spatial art. An isolated SITES-01 concept preview for RivyaLivingArt.', robots:{index:false,follow:false}, icons:{icon:[{url:'/brand/favicon.ico',sizes:'any'},{url:'/brand/rivyalivingart-icon-32.png',sizes:'32x32',type:'image/png'}],apple:'/brand/apple-touch-icon.png'}, manifest:'/brand/site.webmanifest' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className="dark"><body>{children}</body></html>}

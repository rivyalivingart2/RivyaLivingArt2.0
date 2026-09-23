'use client';
import {ShopFrame as ShopShell} from '@/components/shop/shop-frame';
import {Feedback} from '@/components/shop/feedback';
export default function ErrorPage({reset}:{reset:()=>void}){return <ShopShell><Feedback title="A moment of pause." retry={reset}>This page could not be loaded. Please try again. If you just submitted a brief, retry the same inquiry rather than starting another.</Feedback></ShopShell>;}

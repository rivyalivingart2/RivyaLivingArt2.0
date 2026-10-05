'use client';
import dynamic from 'next/dynamic';

// Keep customization code out of shared browsing chunks. SSR remains enabled:
// the real fields and validation component are unchanged when this entry renders.
export const OrderForm=dynamic(()=>import('./order-form').then(module=>module.OrderForm));

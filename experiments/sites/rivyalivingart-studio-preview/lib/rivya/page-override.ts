'use client';
import registry from './demo-registry.json';
import {useDemo} from './demo-state';
export function usePageOverride(route:string){const d=useDemo();const page=registry.find(p=>p.kind==='page'&&p.route===route);return Boolean(page&&(!d.visible(page.id)||d.state.published[page.id]))}

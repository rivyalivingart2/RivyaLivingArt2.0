import {hydrateRoot} from 'react-dom/client';
import {App} from './App';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
const root=hydrateRoot(document.getElementById('root')!,<App studio={location.pathname==='/studio'}/>);
// Diagnostics and teardown exist only in this isolated review harness.
Object.assign(window,{phase2Preview:{inspect:()=>({triggers:ScrollTrigger.getAll().length,smooth:document.documentElement.style.scrollBehavior==='smooth'}),unmount:()=>root.unmount()}});

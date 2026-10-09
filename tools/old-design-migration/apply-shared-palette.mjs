// One-time, idempotent source transformation; never loaded by the application.
import {readFileSync,writeFileSync} from 'node:fs';
import postcss from 'postcss';
const studioColors={
 '#6f7680':'#78828c',
 '#101e24':'var(--elev-1)','#0b151c':'var(--elev-0)','#65787d':'#6f7680',
 '#40515a':'#425361','#bec8c6':'#a9b4bc','#91c9bd':'#5fafd6','#081319':'var(--elev-0)',
 '#0c171d':'var(--elev-0)','#193137':'var(--elev-2)','#142a2e':'var(--elev-2)',
 '#0c181f':'var(--elev-0)','#172d35':'var(--elev-2)','#23404a':'var(--sapphire)',
 '#234340':'var(--sapphire)','#bad9ce':'var(--sapphire)','#d2e8df':'var(--sapphire-hover)',
 '#16282e':'var(--elev-2)','#14272e':'var(--elev-2)','#cce1db':'var(--ivory)',
 '#17232a':'var(--elev-1)','#273b40':'var(--elev-2)','#698c87':'#6f7680',
};
for(const file of ['src/components/studio/workspace.module.css','src/components/studio/overview.module.css']){
 const root=postcss.parse(readFileSync(file,'utf8'));
 root.walkDecls(d=>{d.value=d.value.replace(/#[a-f0-9]{6}\b/gi,color=>studioColors[color.toLowerCase()]||color);});
 root.walkRules(rule=>{
  if(rule.selector==='.workspace .primary'||rule.selector==='.workspace .primary:hover:not(:disabled)'){
   rule.walkDecls('color',d=>{d.value='var(--ivory)';});
  }
 });
 writeFileSync(file,root.toString());
}
const file='src/components/shop/shop.module.css',root=postcss.parse(readFileSync(file,'utf8'));
const surfaces={
 '.header':{background:'var(--elev-0)','backdrop-filter':'none','-webkit-backdrop-filter':'none','box-shadow':'none','border-bottom':'1px solid var(--border)'},
 '.header .brand:hover img':{filter:'brightness(0) invert(1)'},
 '.navCta':{background:'var(--sapphire)',color:'var(--ivory)',border:'1px solid var(--control-border)','border-radius':'999px','box-shadow':'none',transition:'background-color 150ms ease'},
 '.navCta:hover':{background:'var(--sapphire-hover)',color:'var(--ivory)',transform:'none','box-shadow':'none','border-color':'var(--control-border)'},
 '.collectionPanel':{background:'var(--elev-1)','border-color':'var(--control-border)','box-shadow':'0 12px 32px #0004'},
 '.mobileMenu':{background:'var(--elev-0)'},
 '.dialog':{background:'var(--elev-1)','backdrop-filter':'none','-webkit-backdrop-filter':'none','border-color':'var(--control-border)','box-shadow':'0 12px 32px #0004'},
 '.dialog.mobileMenu':{background:'var(--elev-0)'},
 '.footer':{background:'var(--elev-0)','border-top':'1px solid var(--border)'},
 '.footer::before':{display:'none'},'.footer::after':{display:'none'},
 '.footer h3':{color:'var(--muted)'},
 '.site .button,.dialog .button':{background:'var(--sapphire)',color:'var(--ivory)',border:'1px solid var(--control-border)','border-radius':'999px','box-shadow':'none',transition:'background-color 150ms ease'},
 '.site .button:hover:not(:disabled),.dialog .button:hover:not(:disabled)':{background:'var(--sapphire-hover)',color:'var(--ivory)','border-color':'var(--control-border)','box-shadow':'none',transform:'none'},
};
for(const [selector,properties] of Object.entries(surfaces)){
 root.walkRules(rule=>{
  if(rule.selector!==selector||rule.parent.type!=='root')return;
  for(const [prop,value] of Object.entries(properties)){
   const existing=rule.nodes.filter(node=>node.type==='decl'&&node.prop===prop);
   if(existing.length){existing.at(-1).value=value;existing.slice(0,-1).forEach(node=>node.remove());}
   else rule.append({prop,value});
  }
 });
}
writeFileSync(file,root.toString());
console.log('Updated shared frame declarations in place; responsive geometry and stored media usages untouched.');

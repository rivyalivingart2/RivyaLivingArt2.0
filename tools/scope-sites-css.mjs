import fs from 'node:fs';
import postcss from 'postcss';
const source=fs.readFileSync('experiments/sites/rivyalivingart-studio-preview/app/globals.css','utf8');
const ast=postcss.parse(source);
ast.walkAtRules(a=>{if(a.name==='import'||a.name==='theme')a.remove()});
ast.walkRules(rule=>{
 if(rule.parent.type==='atrule'&&/(keyframes|font-face)/.test(rule.parent.name))return;
 rule.selectors=rule.selectors.map(sel=>{
  if(sel===':root'||sel==='body'||sel==='html')return '.approved-experience';
  if(sel.startsWith('body '))return '.approved-experience '+sel.slice(5);
  if(sel.startsWith('html '))return '.approved-experience '+sel.slice(5);
  return ':where(.approved-experience) '+sel;
 });
});
fs.writeFileSync('src/components/rivya/approved-experience.css','/* Exact approved Site styles scoped to the Next.js presentation adapter. */\n'+ast.toString());

/** Derive lightweight demo metadata; articles and editors stay in route chunks. */
import {registerHooks} from 'node:module';
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import ts from 'typescript';
const root=process.cwd(),source=existsSync(path.join(root,'src/lib'))?path.join(root,'src'):root;
const hooks=registerHooks({
 resolve(specifier,context,next){let file;if(specifier.startsWith('@/'))file=path.join(source,specifier.slice(2));else if(specifier.startsWith('.')&&context.parentURL?.startsWith('file:'))file=path.resolve(path.dirname(fileURLToPath(context.parentURL)),specifier);if(file&&!path.extname(file)&&existsSync(file+'.ts'))return {url:pathToFileURL(file+'.ts').href,shortCircuit:true};return next(specifier,context)},
 load(url,context,next){if(url.startsWith('file:')&&url.endsWith('.ts'))return {format:'module',source:ts.transpileModule(readFileSync(fileURLToPath(url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText,shortCircuit:true};return next(url,context)}
});
const {registry}=await import(pathToFileURL(path.join(source,'lib/rivya/demo-registry-source.ts')).href);
writeFileSync(path.join(source,'lib/rivya/demo-registry.json'),JSON.stringify(registry,null,2)+'\n');
hooks.deregister();
console.log(JSON.stringify({records:registry.length,counts:registry.reduce((counts,r)=>(counts[r.kind]=(counts[r.kind]||0)+1,counts),{})}));

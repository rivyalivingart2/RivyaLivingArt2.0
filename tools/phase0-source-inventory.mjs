/** Read-only source inspection. Writes sanitized audit artifacts only to --out.
 * Run: node --import tsx tools/phase0-source-inventory.mjs --out <directory>
 * Does not load application configuration, connect providers, or invoke routes.
 * Static reachability is conservative: imports are not proof of executed calls.
 */
import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {resolve, dirname, relative, posix} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
import {studioModules, studioModule} from '../src/lib/studio-modules.ts';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
if(args.length!==2||args[0]!=='--out')throw Error('Usage: --out <local report directory>');
const output=resolve(root,args[1]);
const outputRelative=relative(root,output).replaceAll('\\','/');
if(outputRelative.startsWith('../')||outputRelative==='..'||!outputRelative||/^(src|public|sources|\.git)(\/|$)/.test(outputRelative))throw Error('Audit output must be a separate local report directory');
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const revision=git('rev-parse','HEAD').trim();
const baseline='7b390d558b9a48d5ec7ccedb8bab104f6b1411f9';
git('merge-base','--is-ancestor',baseline,'HEAD');
const files=git('ls-files','-z','--','src','public').split('\0').filter(Boolean).sort();
const sourcePaths=files.filter(path=>path.startsWith('src/')&&/\.(?:[cm]?[jt]sx?)$/.test(path));
const sourceSet=new Set(sourcePaths);
const data=new Map();
const setterNames=new Set(['setSecurityAdapter','setOperationsAdapter','setPublicationAdapter']);
function resolvedImport(path,specifier){
 const candidate=specifier.startsWith('@/')?'src/'+specifier.slice(2):specifier.startsWith('.')?posix.normalize(posix.join(posix.dirname(path),specifier)):null;
 if(!candidate)return null;
 return [candidate,...['.ts','.tsx','.js','.jsx','.mjs','/index.ts','/index.tsx','/index.js'].map(ext=>candidate+ext)].find(p=>sourceSet.has(p))??null;
}
function propertyName(node){return node&&(ts.isIdentifier(node)||ts.isStringLiteral(node))?node.text:null;}
for(const path of sourcePaths){
 const text=readFileSync(resolve(root,path),'utf8');
 const tree=ts.createSourceFile(path,text,ts.ScriptTarget.Latest,true,path.endsWith('x')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 const imports=[],sqlCalls=[],setters=[],envNames=new Set(),exports=new Set();
 const addImport=(value,typeOnly=false)=>{if(typeof value==='string'&&!typeOnly)imports.push({specifier:value,resolved:resolvedImport(path,value)});};
 function visit(node){
  if(ts.isImportDeclaration(node)&&ts.isStringLiteral(node.moduleSpecifier)){
   const clause=node.importClause;
   const onlyTypes=clause?.isTypeOnly||!!(clause&&!clause.name&&clause.namedBindings&&ts.isNamedImports(clause.namedBindings)&&clause.namedBindings.elements.length&&clause.namedBindings.elements.every(e=>e.isTypeOnly));
   addImport(node.moduleSpecifier.text,onlyTypes);
  }
  if(ts.isExportDeclaration(node)&&node.moduleSpecifier&&ts.isStringLiteral(node.moduleSpecifier))addImport(node.moduleSpecifier.text,node.isTypeOnly);
  if(ts.isCallExpression(node)){
   if(node.expression.kind===ts.SyntaxKind.ImportKeyword&&ts.isStringLiteral(node.arguments[0]))addImport(node.arguments[0].text);
   const called=ts.isIdentifier(node.expression)?node.expression.text:ts.isPropertyAccessExpression(node.expression)&&ts.isIdentifier(node.expression.expression)?node.expression.expression.text:null;
   if(called==='studioDb')sqlCalls.push(tree.getLineAndCharacterOfPosition(node.getStart(tree)).line+1);
   if(setterNames.has(called))setters.push({name:called,line:tree.getLineAndCharacterOfPosition(node.getStart(tree)).line+1});
  }
  if(ts.isPropertyAccessExpression(node)&&ts.isPropertyAccessExpression(node.expression)&&node.expression.getText(tree)==='process.env')envNames.add(node.name.text);
  if(ts.isElementAccessExpression(node)&&node.expression.getText(tree)==='process.env'&&node.argumentExpression&&ts.isStringLiteral(node.argumentExpression))envNames.add(node.argumentExpression.text);
  if(node.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)){
   if(ts.isFunctionDeclaration(node)&&node.name)exports.add(node.name.text);
   if(ts.isVariableStatement(node))for(const declaration of node.declarationList.declarations)if(ts.isIdentifier(declaration.name))exports.add(declaration.name.text);
  }
  ts.forEachChild(node,visit);
 }
 visit(tree);
 data.set(path,{path,sha256:sha(text),imports,sqlCallLines:[...new Set(sqlCalls)],adapterSetterCalls:setters,environmentNames:[...envNames].sort(),exports:[...exports].sort(),sqlTableReferences:[...new Set(text.match(/\brivya_[a-z][a-z0-9_]*\b/g)??[])].sort()});
}
function reachable(start){
 const seen=new Set();
 function visit(path){if(seen.has(path)||!data.has(path))return;seen.add(path);for(const dep of data.get(path).imports)if(dep.resolved)visit(dep.resolved);}
 visit(start);return [...seen].sort();
}
const sqlDirect=[...data.values()].filter(row=>row.sqlCallLines.length||row.imports.some(i=>i.specifier==='@neondatabase/serverless'));
const blobDirect=[...data.values()].filter(row=>row.imports.some(i=>i.specifier==='@vercel/blob'||i.specifier.startsWith('@vercel/blob/')));
const routes=[...data.values()].filter(row=>/(^|\/)route\.[jt]s$/.test(row.path)).map(row=>{
 const dependencies=reachable(row.path);
 return {path:row.path,methods:row.exports.filter(x=>['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'].includes(x)),sqlReachable:sqlDirect.filter(x=>dependencies.includes(x.path)).map(x=>x.path),blobReachable:blobDirect.filter(x=>dependencies.includes(x.path)).map(x=>x.path)};
});
const workspacePath='src/components/studio/workspace.tsx';
const workspace=ts.createSourceFile(workspacePath,readFileSync(resolve(root,workspacePath),'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const renderers=new Map(),componentSources=new Map();
function workspaceVisit(node){
 if(ts.isVariableDeclaration(node)&&ts.isIdentifier(node.name)){
  const name=node.name.text;
  function getImports(n){if(ts.isCallExpression(n)&&n.expression.kind===ts.SyntaxKind.ImportKeyword&&ts.isStringLiteral(n.arguments[0]))componentSources.set(name,resolvedImport(workspacePath,n.arguments[0].text));ts.forEachChild(n,getImports);}
  if(name!=='moduleViews'&&node.initializer)getImports(node.initializer);
  if(name==='moduleViews'){
   function object(n){if(ts.isObjectLiteralExpression(n)){for(const entry of n.properties){if(!ts.isPropertyAssignment(entry))continue;let component=null;function jsx(k){if(!component&&(ts.isJsxSelfClosingElement(k)||ts.isJsxOpeningElement(k)))component=k.tagName.getText(workspace);ts.forEachChild(k,jsx);}jsx(entry.initializer);renderers.set(propertyName(entry.name),component);}}else ts.forEachChild(n,object);}
   if(node.initializer)object(node.initializer);
  }
 }
 ts.forEachChild(node,workspaceVisit);
}
workspaceVisit(workspace);
const modules=studioModules.map(module=>{
 const renderer=renderers.get(module.key),componentSource=componentSources.get(renderer)??null;
 const source=componentSource?readFileSync(resolve(root,componentSource),'utf8'):'';
 return {...module,route:'/studio'+(module.segment?'/'+module.segment:''),renderer,componentSource,literalApiReferences:[...new Set(source.match(/\/api\/[A-Za-z0-9_/?=.&${}:-]+/g)??[])].sort()};
});
if(modules.some(x=>!x.renderer||!x.componentSource))throw Error('A Studio module has no inspectable renderer');
const oldRoot=resolve(root,'../OLDWEBSITE-reference');
const oldSidebar='src/components/studio/sidebar.tsx';
const oldReference=existsSync(resolve(oldRoot,oldSidebar))?readFileSync(resolve(oldRoot,oldSidebar),'utf8'):null;
let oldNavigation=null;
if(oldReference){
 const tree=ts.createSourceFile(oldSidebar,oldReference,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);const entries=[];
 function visit(node){
  if(ts.isObjectLiteralExpression(node)){
   const fields=Object.fromEntries(node.properties.filter(ts.isPropertyAssignment).map(p=>[propertyName(p.name),p.initializer]));
   if(fields.href&&ts.isStringLiteral(fields.href)&&fields.href.text.startsWith('/studio')){
    const route=fields.href.text,match=studioModule(route.replace(/^\/studio\/?/,''));
    entries.push({label:fields.label&&ts.isStringLiteral(fields.label)?fields.label.text:null,route,currentModule:match?.key??null,currentRoute:match?'/studio'+(match.segment?'/'+match.segment:''):null});
   }
  }
  ts.forEachChild(node,visit);
 }
 visit(tree);oldNavigation={source:oldSidebar,sha256:sha(oldReference),revision:execFileSync('git',['rev-parse','HEAD'],{cwd:oldRoot,encoding:'utf8'}).trim(),entries};
}
const protectedPaths=files.filter(path=>path.startsWith('public/')||path.startsWith('src/data/')||path.startsWith('src/components/')||path.startsWith('src/app/')&&!path.startsWith('src/app/api/'));
const baselineFiles=protectedPaths.map(path=>{const bytes=readFileSync(resolve(root,path));return {path,bytes:bytes.length,sha256:sha(bytes)};});
const baselineManifest={revision,comparedWith:baseline,scope:'All tracked public assets, src/data, components, and app pages/layouts including Studio/login; hashes are preservation evidence, not visual acceptance.',files:baselineFiles,filesChangedSinceMigration:git('diff','--name-only',baseline,'--',...['public','src/data','src/components','src/app']).trim().split('\n').filter(Boolean).filter(p=>!p.startsWith('src/app/api/')),fileCount:baselineFiles.length,totalBytes:baselineFiles.reduce((n,x)=>n+x.bytes,0),manifestSha256:sha(JSON.stringify(baselineFiles))};
const externalProvider=i=>!i.resolved&&!i.specifier.startsWith('.')&&!i.specifier.startsWith('@/')&&/neon|vercel|google|netlify/i.test(i.specifier);
const providerFiles=[...data.values()].filter(x=>x.imports.some(externalProvider)).map(({path,imports})=>({path,packages:[...new Set(imports.filter(externalProvider).map(i=>i.specifier))]}));
const summary={sourceRevision:revision,migrationAncestor:baseline,staticOnly:true,runtimeExecutionVerified:false,sourceFileCount:data.size,routeHandlerCount:routes.length,routesWithStaticSqlDependency:routes.filter(x=>x.sqlReachable.length).length,routesWithStaticBlobDependency:routes.filter(x=>x.blobReachable.length).length,directSqlFileCount:sqlDirect.length,directBlobFileCount:blobDirect.length,studioModules:modules.length,oldSidebarEntries:oldNavigation?.entries.length??null,oldSidebarUnmapped:oldNavigation?.entries.filter(x=>!x.currentModule).map(x=>x.route)??null,adapterSetterCalls:[...data.values()].flatMap(x=>x.adapterSetterCalls.map(call=>({path:x.path,...call}))),protectedFiles:baselineManifest.fileCount,protectedBytes:baselineManifest.totalBytes,protectedFilesChanged:baselineManifest.filesChangedSinceMigration};
mkdirSync(output,{recursive:true});
for(const [name,value] of Object.entries({'source-inventory.json':{summary,method:'TypeScript AST value imports and literal dynamic imports; type-only imports excluded. Conservative transitive module reachability, not function-level execution. Dynamic/computed dependencies and callback execution may differ. Literal SQL table names may include comments and DDL. API strings are source references, not a coverage claim.',providerFiles,environmentNames:[...new Set([...data.values()].flatMap(x=>x.environmentNames))].sort(),directSql:sqlDirect.map(({path,sqlCallLines,sqlTableReferences})=>({path,sqlCallLines,sqlTableReferences})),directBlob:blobDirect.map(({path})=>path),routes,modules,oldNavigation},'protected-source-baseline.json':baselineManifest}))writeFileSync(resolve(output,name),JSON.stringify(value,null,2)+'\n');
console.log(JSON.stringify(summary));

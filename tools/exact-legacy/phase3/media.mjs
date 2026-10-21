import ts from 'typescript';
import assert from 'node:assert/strict';
/** Read literal slot declarations without importing or running legacy application code. */
export function imageSlots(source){
 const ast=ts.createSourceFile('site-images.ts',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);let array;
 function visit(node){if(ts.isVariableDeclaration(node)&&node.name.getText(ast)==='SITE_IMAGE_SLOTS'){let value=node.initializer;while(value&&(ts.isAsExpression(value)||ts.isSatisfiesExpression(value)))value=value.expression;assert.ok(value&&ts.isArrayLiteralExpression(value));array=value;}ts.forEachChild(node,visit);}
 visit(ast);assert.ok(array,'Source image slots absent');
 return array.elements.map(node=>{assert.ok(ts.isObjectLiteralExpression(node));const out={};for(const p of node.properties)if(ts.isPropertyAssignment(p)&&ts.isStringLiteral(p.initializer))out[p.name.getText(ast).replaceAll('"','')]=p.initializer.text;assert.ok(out.key&&out.fallback&&out.ratio);return out;});
}
export function collectMediaReferences(value,path='',out=[]){
 if(Array.isArray(value)){value.forEach((v,i)=>collectMediaReferences(v,path+'['+i+']',out));return out;}
 if(!value||typeof value!=='object')return out;
 for(const [key,v] of Object.entries(value)){const at=path?path+'.'+key:key;if(typeof v==='string'&&/^(image|src|path|poster|posterPath|video|videoUrl|scene|imageUrl|posterUrl)$/.test(key)&&/^\/(?:media|editorial|legacy-reference|brand|films|sequences)\//.test(v))out.push({field:at,path:v});else if(v&&typeof v==='object')collectMediaReferences(v,at,out);}
 return out;
}
export function dedupeAssets(assets){const groups=new Map();for(const a of assets){const key=a.sha256;const list=groups.get(key)||[];list.push({scope:a.scope,path:a.path});groups.set(key,list);}return [...groups.entries()].filter(([,paths])=>paths.length>1).map(([sha256,paths])=>({sha256,paths}));}
export function filmLineage(source){return [...source.matchAll(/path:'([^']+)'[^}]+?driveId:'([^']+)'[^}]+?sha256:'([a-f0-9]{64})'/g)].map(m=>({path:'public'+m[1],sourceId:m[2],expectedSha256:m[3],classification:'material-visualization',evidence:'src/lib/presentation-media.ts'}));}
export const placementMap={
 'home.hero':'ContentDocument.homepage.heroImage (keep current hero product/primary image)',
 'home.maker':'/our-story ContentDocument.headerImage (retain current image)',
 'home.bespoke':'HomeReferenceSnapshot.pages[/commission] section background',
 'home.collections.create':'Homepage journeys/commission tile; no automatic category insertion',
 'home.workshops':'HomeReferenceSnapshot.workshops.image (confirmation required)',
 'home.print':'HomeReferenceSnapshot.printing.image (confirmation required)',
 'home.why.handcrafted':'/our-story sections[] image; current chapter identity must be explicit',
 'home.why.bespoke':'/our-story sections[] image; current chapter identity must be explicit',
 'home.why.slowMade':'/our-story sections[] image; current chapter identity must be explicit',
 'home.why.heirloom':'/our-story sections[] image; no fourth current chapter is invented'
};

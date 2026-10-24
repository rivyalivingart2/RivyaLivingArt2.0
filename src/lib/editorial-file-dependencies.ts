import {validExtension,extensionPublicationIssues,extensionImagePaths,publicFile,type FileUsage,type PublicFile} from './editorial-extension-model';
import {validPageMedia} from './editorial-media-model';
import type {DependencySource} from './homepage-dependencies';
import type {HomeDependency} from './homepage-model';
export function compileFileDependencies(usages:FileUsage[],source:DependencySource){
 const files:PublicFile[]=[],dependencies:HomeDependency[]=[],mediaPaths:string[]=[],issues:string[]=[];
 for(const usage of usages){
  const key=usage.kind+':'+usage.key,row=source.extensions?.find(r=>r.key===key),d=row?.document;
  if(!row||!validExtension(d)||d.kind==='category'||d.kind!==usage.kind||d.key!==usage.key||extensionPublicationIssues(d).length){issues.push('Assigned file is not approved and published: '+key);continue;}
  const paths=extensionImagePaths(d),images=paths.map(path=>source.media.find(r=>r.key===path&&validPageMedia(r.document)));
  if(images.some(r=>!r)){issues.push('The selected file poster is no longer published.');continue;}
  files.push(publicFile(d));dependencies.push({kind:'extension',key,version:row.version,fingerprint:row.fingerprint});
  for(const image of images)if(image){mediaPaths.push(image.key);dependencies.push({kind:'media',key:image.key,version:image.version,fingerprint:image.fingerprint});}
 }
 return {files,dependencies,mediaPaths,issues};
}

import type {PublicFile} from '@/lib/editorial-extension-model';
import {EditorialImage} from './editorial-image';
/** Publication dependencies choose this public-only record; source IDs never enter markup. */
export function EditorialFile({file}:{file:PublicFile}){
 return <figure><figcaption>{file.title}{file.classification==='design-visualization'?' · Design visualization':''}</figcaption>{file.kind==='video'?<video controls playsInline preload="metadata" poster={file.poster?.path} aria-label={file.title} style={{maxWidth:'100%',width:'100%'}}><source src={'/editorial-file/'+file.key} type={file.mime}/>Your browser cannot play this film.</video>:<>{file.poster&&<EditorialImage usage={file.poster}/>}<a href={'/editorial-file/'+file.key} download>Download the 3D model (GLB)</a></>}<p>{file.description}</p>{file.transcript&&<details><summary>Transcript and visual description</summary><p style={{whiteSpace:'pre-line'}}>{file.transcript}</p></details>}</figure>;
}

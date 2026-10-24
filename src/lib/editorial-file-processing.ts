import {createHash} from 'node:crypto';
export const fileLimit=40*1024*1024;
export async function boundedFileBody(request:Request){
 if(Number(request.headers.get('content-length')||0)>fileLimit)throw Error('File exceeds 40 MB.');
 const reader=request.body?.getReader();if(!reader)throw Error('Choose a file.');
 const chunks:Buffer[]=[];let size=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>fileLimit){await reader.cancel();throw Error('File exceeds 40 MB.');}chunks.push(Buffer.from(value));}}finally{reader.releaseLock();}
 return Buffer.concat(chunks);
}
/** Accept embedded GLB and browser video containers only; never fetch embedded URLs. */
export function inspectEditorialFile(bytes:Buffer){
 if(bytes.length<16||bytes.length>fileLimit)throw Error('Use a file up to 40 MB.');
 let mime:'video/mp4'|'video/webm'|'model/gltf-binary';
 if(bytes.subarray(4,8).toString()==='ftyp'&&['isom','iso2','mp41','mp42','avc1','M4V '].includes(bytes.subarray(8,12).toString()))mime='video/mp4';
 else if(bytes.subarray(0,4).equals(Buffer.from([0x1a,0x45,0xdf,0xa3]))&&bytes.subarray(0,256).includes(Buffer.from('webm')))mime='video/webm';
 else if(bytes.subarray(0,4).toString()==='glTF'){
  if(bytes.readUInt32LE(4)!==2||bytes.readUInt32LE(8)!==bytes.length||bytes.length<20||bytes.readUInt32LE(16)!==0x4e4f534a)throw Error('Use a complete GLB version 2 file.');
  const length=bytes.readUInt32LE(12);if(length>2*1024*1024||20+length>bytes.length)throw Error('Invalid GLB JSON chunk.');
  const json=JSON.parse(bytes.subarray(20,20+length).toString('utf8').trim());
  if(json.asset?.version!=='2.0'||!Array.isArray(json.scenes)||!Array.isArray(json.meshes))throw Error('GLB needs a scene and mesh.');
  const scan=(v:unknown):void=>{if(!v||typeof v!=='object')return;for(const [k,value] of Object.entries(v)){if(k==='uri')throw Error('Use a self-contained GLB with embedded buffers and images.');scan(value);}};scan(json);
  mime='model/gltf-binary';
 }else throw Error('Use MP4, WebM or a self-contained GLB. MOV and external URLs need preparation first.');
 return {mime,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),kind:mime==='model/gltf-binary'?'model' as const:'video' as const};
}
/** Single byte ranges support seeking without disclosing storage URLs. */
export function byteRange(header:string|null,length:number){
 if(!header)return null;
 const match=/^bytes=(\d*)-(\d*)$/.exec(header);if(!match||!match[1]&&!match[2])throw Error('Invalid range');
 const start=match[1]?Number(match[1]):Math.max(0,length-Number(match[2]));
 const end=match[1]?(match[2]?Math.min(Number(match[2]),length-1):length-1):length-1;
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=length||end<start)throw Error('Invalid range');
 return {start,end};
}

/** Fake SDK boundary only. It does not certify a real cloud provider or permissions. */
import assert from 'node:assert/strict';
export const objects=new Map(),failDeletes=new Set(),calls=[];
const token='LIFECYCLE_FAKE_SDK_NO_REMOTE_TOKEN';
export {token};
function check(options){assert.equal(options.token,token);assert.equal(process.env.RIVYA_LIFECYCLE_LOCAL,'true');}
export async function put(path,bytes,options){check(options);assert.equal(options.access,'private');assert.equal(options.allowOverwrite,false);if(objects.has(path))throw Error('Synthetic duplicate object');objects.set(path,Buffer.from(bytes));calls.push({operation:'put',path});return {};}
export async function get(path,options){check(options);assert.equal(options.access,'private');assert.equal(options.useCache,false);calls.push({operation:'get',path});const bytes=objects.get(path);return bytes?{statusCode:200,stream:new ReadableStream({start(controller){controller.enqueue(bytes);controller.close();}})}:null;}
export async function del(path,options){check(options);calls.push({operation:'delete',path});if(failDeletes.has(path))throw Error('Synthetic provider unavailable');objects.delete(path);}

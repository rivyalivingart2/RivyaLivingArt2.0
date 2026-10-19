import {execFile} from 'node:child_process';
import {resolve} from 'node:path';
import {promisify} from 'node:util';

/** Use the existing application-test loader for its JSON-backed source models. */
export default async function setup(){
 await promisify(execFile)(process.execPath,['--import','tsx',resolve('tools/master-audit/e2e-fixtures.ts')],{cwd:process.cwd(),env:process.env,windowsHide:true});
}

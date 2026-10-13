// Re-run existing non-destructive suites without overwriting approved phase evidence.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
const name=process.argv[2];
const allowed=['redesign-phase3-browser','redesign-phase3-edge','redesign-phase4-browser','redesign-phase4-fixtures','redesign-phase4-interactions','redesign-phase4-review-fixes','redesign-phase5-interactions','redesign-phase5-states','redesign-phase5-coverage','redesign-phase6-states','redesign-phase6-previews'];
assert.ok(allowed.includes(name),'Only reviewed non-destructive suites may be replayed');
const source=resolve('tools/'+name+'.mjs'),oldOut='output/playwright/'+name.match(/redesign-phase\d/)[0],out='output/playwright/redesign-phase7/'+name;
let code=await readFile(source,'utf8');
code=code.replaceAll("out+'/baseline.json'",JSON.stringify(oldOut+'/baseline.json'));
code=code.replaceAll("'"+oldOut+"'",JSON.stringify(out));
code=code.replaceAll("'./old-design-migration/local-browser.mjs'","'./redesign-phase7-session.mjs'").replaceAll("'./redesign-phase6-session.mjs'","'./redesign-phase7-session.mjs'");
code=code.replace(/from (['"])(\.[^'"]+)\1/g,(_,quote,path)=>'from '+JSON.stringify(pathToFileURL(resolve(dirname(source),path)).href));
await mkdir(out,{recursive:true});await mkdir('output/redesign-phase7',{recursive:true});
const generated=resolve('output/redesign-phase7/'+name+'.mjs');await writeFile(generated,code);
// Original browser suite reads process.argv[2] as its mode.
process.argv[2]='verify';await import(pathToFileURL(generated).href);

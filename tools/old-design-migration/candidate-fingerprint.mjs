import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export function candidateFingerprint(){
 const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z','src','scripts','public/media/migration','package.json','package-lock.json','next.config.ts'],{encoding:'utf8'}).split('\0').filter(Boolean).sort();
 const hash=createHash('sha256');
 for(const file of [...new Set(files)])hash.update(file+'\0').update(readFileSync(file));
 return {base:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),applicationSha256:hash.digest('hex')};
}

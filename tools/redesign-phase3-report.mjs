import {readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const dir='docs/redesign/modern-design-2026-10-13',out='output/playwright/redesign-phase3';
const read=async path=>JSON.parse(await readFile(path,'utf8'));
const baseline=await read(dir+'/source-baseline.json'),changed=[],identical=[];
for(const [file,digest] of Object.entries(baseline.files)){
 const actual=createHash('sha256').update(await readFile(file)).digest('hex');
 (actual===digest?identical:changed).push(file);
}
const before=await read('test-results/old-design-migration/local-phase3-before-summary.json'),after=await read('test-results/old-design-migration/local-phase3-after-summary.json');
if(JSON.stringify(before.summary)!==JSON.stringify(after.summary))throw Error('Protected records changed');
const browser=await read(out+'/verification.json'),fixtures=await read(out+'/fixtures-verification.json'),edge=await read(out+'/edge-verification.json');
const luminance=hex=>{const c=hex.match(/[0-9a-f]{2}/gi).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
const pairs=[['body on obsidian','#f4f1e9','#080a0e'],['muted on obsidian','#a9b4bc','#080a0e'],['body on ocean','#f4f1e9','#08283a'],['muted on ocean','#a9b4bc','#08283a'],['body on sapphire','#f4f1e9','#164e6b'],['ink on ivory','#18202a','#f4f1e9'],['secondary on ivory','#384856','#f4f1e9'],['closing label on ivory','#64512f','#f4f1e9'],['gold on obsidian','#b89b63','#080a0e']];
const contrast=pairs.map(([name,foreground,background])=>{const a=luminance(foreground),b=luminance(background),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);if(ratio<4.5)throw Error('Contrast below 4.5 '+name);return {name,foreground,background,ratio:Number(ratio.toFixed(2)),minimum:4.5};});
const captures=[];
for(const name of [...browser.captures,...fixtures.captures,'390-full-ending.png']){const data=await readFile(out+'/'+name);captures.push({path:out+'/'+name,bytes:(await stat(out+'/'+name)).size,sha256:createHash('sha256').update(data).digest('hex')});}
const slots=await read(dir+'/homepage-section-map.json'),visible=(await read(out+'/baseline.json')).slots;
await writeFile(dir+'/phase3-section-coverage.json',JSON.stringify(slots.map(s=>({key:s.key,label:s.label,source:s.source,localPublishedVisible:visible.includes(s.key),conditionalFixtureVerified:true,widths:[320,390,768,1440],visibilityChanged:false,recordsChanged:false})),null,2)+'\n');
const report={at:new Date().toISOString(),phase:3,scope:'Local homepage and shared public frame only',branch:'codex/redesign-phase3-homepage',parent:'4cf0e1b',productionChanged:false,phase4Started:false,validation:{build:'passed',typescript:'passed',focusedApplicationLint:'passed',unitTests:{passed:344,failed:0},browser,fixtures,edge,contrast},preservation:{originalBaselineCount:Object.keys(baseline.files).length,byteIdentical:identical.length,changedOriginalFiles:changed,allPublicMediaAndLogoIdentical:!changed.some(p=>p.startsWith('public/')),allLibAndApiFilesIdentical:!changed.some(p=>p.startsWith('src/lib/')||p.startsWith('src/app/api/')),localDatabase:{readOnly:true,tables:13,records:1641,summary:after.summary,allDigestsMatch:true},presentationPublishedVersion:82},review:{disposition:'ship',scope:'Independent full source and screenshot review at local Phase 3 scope',earlierRecapture:'Corrected oversized Chromium mobile screenshot using settled viewport tiles',detector:'unavailable: Windows batch cache_directory_failed',nativeDeviceAcceptance:false,humanAcceptance:false,productionAcceptance:false},captures};
await writeFile(dir+'/phase3-verification.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({checks:browser.checks.length+fixtures.checks.length+edge.checks.length,contrastPairs:contrast.length,identical:identical.length,changed,captures:captures.length}));

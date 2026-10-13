import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
const out='output/playwright/redesign-phase4',report={checks:[],issues:[],captures:[],scope:'Static synthetic fixture layout only; controls are not functional'};
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{for(const width of [1440,768,390,320]){
 const page=await browser.newPage({viewport:{width,height:width<700?844:1000},reducedMotion:'reduce'});
 for(const name of ['portfolio-detail','testimonial-detail','faq-detail','portfolio-archive','testimonial-archive','landing','receipt','receipt-recovery','loading','error']){
  await page.goto('http://127.0.0.1:4181/'+name,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  const check=(label,value)=>(value?report.checks:report.issues).push(width+' '+name+' '+label);
  check('single H1',await page.locator('h1').count()===1);check('no overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  if(name.startsWith('portfolio'))check('concept disclosure',await page.getByText('Concept study — not a completed customer project',{exact:true}).count()>0);
  if(name.startsWith('testimonial'))check('fiction disclosure',await page.getByText('Fictional sample — not a customer review',{exact:true}).count()>0);
  if(name==='landing')check('all 16 landing block types',await page.locator('[data-block]').count()===16);
  if(width===1440||width===390){const file=width+'-fixture-'+name+'.png';await page.screenshot({path:out+'/'+file});report.captures.push(file);}
  if(name==='landing')for(const block of ['imageCta','productGrid','videoStory','bentoGallery','testimonialGrid']){
   const target=page.locator('[data-block="'+block+'"]');await target.evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-104));await page.waitForTimeout(200);
   if(width===1440||width===390){const file=width+'-fixture-landing-'+block+'.png';await page.screenshot({path:out+'/'+file});report.captures.push(file);}
  }
 }
 await page.close();
}}finally{await browser.close();await writeFile(out+'/fixtures-verification.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({checks:report.checks.length,issues:report.issues,captures:report.captures.length}));

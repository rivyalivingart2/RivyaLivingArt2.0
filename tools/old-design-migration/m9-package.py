"""Package only new M9 deliverables. Never includes private sources, cookies or credentials."""
import json, hashlib, html, re, zipfile
from pathlib import Path
root=Path('docs/editorial-production/m9')
out=Path('test-results/old-design-migration/m9/delivery');out.mkdir(parents=True,exist_ok=True)
manifest=json.loads((root/'content-manifest.json').read_text())
receipts={r['id']:r for r in json.loads(Path('test-results/old-design-migration/m9/intake-receipts.json').read_text())}
assert len(receipts)==480
delivery_path=root/'drive-delivery.json'
delivery=json.loads(delivery_path.read_text()) if delivery_path.exists() else []
for m in manifest:
 r=receipts[m['recordId']];assert r['hash']==m['contentSha256'];m['localStudioVersion']=r['version'];m['localStagingVerifiedAt']=r['verifiedAt']
 m['authorReview']='Codex AI drafting and source/meaning pass; independent human editorial review pending'
 d=next((d for d in delivery if d['name']==m['kind'].lower()+'-drafts-v1.json'),None)
 m['deliveryContentDriveId']=d['id'] if d else None;m['deliveryContentLocator']=m['candidateId']
 m['previewApproval']='Human approval pending';m['languageStatus']='English draft; Hindi and Gujarati explicit fallback; no native review'
(root/'content-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
regpath=Path('docs/redesign/old-design-migration-2026-10-08/editorial-production-register.json');reg=json.loads(regpath.read_text('utf-8-sig'))
reg['status']='m9_authored_and_staged_locally_not_published';reg['definitions']['counting']='480 unique authored drafts, recorded local staging and Drive delivery counted separately. Production linked/published remains zero. Concepts and fictional samples are not genuine commissions or feedback.'
for r in reg['records']:
 m=next(m for m in manifest if m['candidateId']==r['id']);r.setdefault('plannedTitle',r['title']);r['title']=m['title'];r['topic']=r['topic'].replace('Material/detail studies tied to real projects','Material and detail concepts').replace('Other verified commissions','Cross-journey concepts')
 r.update(state='Authored and staged in isolated local Studio',candidateMedia=m['mediaKey'],authoredRecordId=m['recordId'],localStudioVersion=m['localStudioVersion'],newRecordId=None,meaningReview='AI source and meaning pass; independent review pending',nativeReview='Not performed',imageReview='AI source inspection; owner rights and per-usage crop approval pending',publication='Unpublished locally; not created in production',nextStep='Review the exact saved draft and per-usage image at desktop and phone sizes; obtain actual editorial, rights and publication approval. Native-language checks remain separate. No production import or publication is authorized.',driveContentFileId=m['deliveryContentDriveId'],driveMediaFileId=m['deliveryDriveId'])
regpath.write_text(json.dumps(reg,ensure_ascii=False,indent=2)+'\n')
hpath=regpath.with_name('Rivya-Editorial-Production-Register.html');text=hpath.read_text();text=re.sub(r'const records=.*?;let page=0','const records='+json.dumps(reg['records'],ensure_ascii=False,separators=(',',':'))+';let page=0',text,flags=re.S);hpath.write_text(text)
media=json.loads((root/'media-manifest.json').read_text());docs={d['id']:d for f in sorted((root/'batches').glob('*.json')) for d in json.loads(f.read_text())}
assert len(docs)==480
css='body{max-width:1000px;margin:40px auto;padding:0 24px;background:#f4f0e8;color:#202522;font:17px/1.7 system-ui}h1,h2,h3{line-height:1.2}h1{font-size:42px}article{border-top:1px solid #a7b5ab;margin-top:48px;padding-top:28px}a{color:#295b4b}small,.note{color:#555}nav{columns:2}img{max-width:100%;max-height:440px;object-fit:contain}input{padding:12px;width:90%;font:inherit}button{padding:12px} .label{font-weight:bold;background:#dce7df;padding:10px} @media(max-width:600px){nav{columns:1}h1{font-size:32px}}'
for kind in ['Journal','Portfolio','Testimonials','FAQs']:
 rows=[m for m in manifest if m['kind']==kind];payload={'schemaVersion':1,'edition':'M9 English draft v1','kind':kind,'count':120,'productionPublished':0,'status':'Isolated local Studio drafts; human review and release pending','records':[{'candidateId':m['candidateId'],'version':m['localStudioVersion'],'document':docs[m['recordId']]} for m in rows]}
 (out/(kind.lower()+'-drafts-v1.json')).write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
 parts=['<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>M9 '+kind+' drafts</title><style>'+css+'</style><body><h1>'+kind+' · 120 M9 drafts</h1><p class="label">Unpublished English drafts. Human editorial, rights, crop and publication approval remain pending. No native-reader approval is claimed.</p><p>Portfolio entries are unbuilt concepts. Testimonial entries are fictional examples, not customer feedback. Reference images do not depict the proposed projects. Existing content remains unchanged.</p><label>Find an entry <input type="search" id="search"></label><nav>'+''.join('<p><a href="#'+m['candidateId']+'">'+m['candidateId']+' · '+html.escape(m['title'])+'</a></p>' for m in rows)+'</nav>']
 for m in rows:
  d=docs[m['recordId']];parts+=['<article id="'+m['candidateId']+'"><p class="note">'+m['candidateId']+' · local staged revision '+str(m['localStudioVersion'])+' · '+html.escape(d['route'])+'</p><h2>'+html.escape(d['title'])+'</h2>']
  if d.get('editorial',{}).get('classification') in ['concept','fictional']:parts+=['<p class="label">'+('Concept study — not a completed customer project' if kind=='Portfolio' else 'Fictional sample — not customer feedback')+'</p>']
  parts+=['<p>'+html.escape(d['description'])+'</p>']
  if d.get('headerImage'):parts+=['<figure><img loading="lazy" src="media/'+m['mediaKey']+'-960.webp" alt="'+html.escape(d['headerImage']['alt'],quote=True)+'"><figcaption>'+html.escape(d['headerImage']['caption'])+'</figcaption></figure>']
  for s in d['sections']:
   parts+=['<h3>'+html.escape(s['heading'])+'</h3>']+['<p>'+html.escape(p)+'</p>' for p in s['paragraphs']]
   if s.get('checklist'):parts+=['<ul>'+''.join('<li>'+html.escape(x)+'</li>' for x in s['checklist'])+'</ul>']
   if s.get('policyHref'):parts+=['<p>Related website route: '+html.escape(s['policyHref'])+'</p>']
  if d.get('film'):parts+=['<h3>Optional material visualization</h3><video controls muted loop preload="none" poster="media/hero-pour-loop-poster.jpg" style="width:100%"><source src="media/hero-pour-loop.webm" type="video/webm"><source src="media/hero-pour-loop.mp4" type="video/mp4"></video><p>Illustrative material motion; not a customer commission or verified workshop recording.</p>']
  parts+=['<p><a href="https://drive.google.com/file/d/'+m['deliveryDriveId']+'/view">Associated Drive reference</a> · '+html.escape(m['mediaUse'])+'</p><p class="note">Stable identity: '+m['recordId']+'<br>Content SHA-256: '+m['contentSha256']+'</p></article>']
 parts+=['<script>document.getElementById("search").addEventListener("input",e=>{const q=e.target.value.toLowerCase();document.querySelectorAll("article").forEach(a=>a.hidden=!a.textContent.toLowerCase().includes(q));});</script></body></html>']
 (out/(kind.lower()+'-review-v1.html')).write_text(''.join(parts))
readme='''# Rivya M9 draft delivery — 9 October 2026

480 new English drafts: 120 Journal worksheets, 120 unbuilt Portfolio concepts, 120 clearly fictional Testimonial examples and 120 FAQ answers. Approximately 62,611 words. The narrow Journal questions are deliberately treated as concise practical worksheets, with examples, limits and next steps, rather than padded to a uniform essay length.

All 480 are saved in the isolated local Studio only, in 48 ten-entry batches. They are not in the production database and are not published on the live website. The JSON files preserve their stable identities. Intake accepts the individual arrays in batches/, not the whole 120-entry envelope. Never import by direct SQL or overwrite an existing identity.

Extract the ZIP and open any *-review-v1.html file to read and search the complete section with its local reference images. The JSON section envelopes provide candidate IDs and exact documents. Reference images are copied from the owner-supplied Drive register; they do not depict completed commissions or necessarily render the concept described. Fictional testimonial references remain private context and are not reviewer portraits. FAQs are text-only with related guidance links.

The optional material film appears in J031, J032, J035, J040, P105 and P109. It starts only on request and is explicitly illustrative. No new real workshop or customer footage is claimed.

AI drafting, source comparison and technical checks are distinct from human acceptance. Independent editorial review, owner rights and crop approval, native-language review and publication approval remain pending. Hindi and Gujarati have explicit English fallback, not invented translations or review evidence. Actual physical-device, screen-reader and field checks remain open. M10 and M11 require separate authorization.

Existing 97 pre-M9 content records, 131 media records, products, business details, customer/order data and history are protected by before/after fingerprints. The original Drive files and their sharing were not changed. This package contains only new M9 content, copied reference images, optimized derivatives, the existing disclosed film and sanitized manifests; no source database export, credentials, private requests or customer records.
'''
(out/'README.md').write_text(readme)
with zipfile.ZipFile(out/'Rivya-M9-draft-delivery-v1.zip','w',zipfile.ZIP_DEFLATED) as z:
 for f in sorted(out.iterdir()):
  if f.suffix in ['.html','.json','.md']:z.write(f,f.name)
 for f in sorted((root/'batches').glob('*.json')):z.write(f,'batches/'+f.name)
 for name in ['content-manifest.json','media-manifest.json','drive-media.json','drive-film.json','duplicate-review.json']:z.write(root/name,'registers/'+name)
 for m in media:
  for w in [640,960,1600]:
   f=Path('test-results/old-design-migration/editorial-store/editorial')/m['metadata']['id']/str(w);assert hashlib.sha256(f.read_bytes()).hexdigest()==m['metadata']['derivatives'][[640,960,1600].index(w)]['sha256'];z.write(f,'media/'+m['key']+'-'+str(w)+'.webp')
 for name in ['hero-pour-loop.mp4','hero-pour-loop.webm','hero-pour-loop-poster.jpg']:z.write(Path('public/media/migration')/name,'media/'+name)
print(json.dumps({'drafts':len(docs),'staged':len(receipts),'files':[{ 'name':p.name,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in out.iterdir()]}))

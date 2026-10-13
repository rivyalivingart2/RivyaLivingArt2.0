"""Read-only inventory and fixture preparation for an isolated design preview.
No database, credentials, API writes or production application imports.
"""
from pathlib import Path
import hashlib, json, re, subprocess
from datetime import datetime, timezone

ROOT=Path(__file__).resolve().parents[2]
HERE=Path(__file__).resolve().parent
DOC=ROOT/'docs/redesign/modern-design-2026-10-13'
DOC.mkdir(parents=True,exist_ok=True)
def read(p):return (ROOT/p).read_text(encoding='utf-8-sig')
def save(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
tracked=subprocess.check_output(['git','ls-files','-z'],cwd=ROOT).decode().split('\0')
protected={p:sha(ROOT/p) for p in tracked if p and (ROOT/p).is_file() and not p.startswith(('docs/','experiments/','tools/','tests/','output/')) and p not in ['AGENTS.md','PROJECT_STATE.md','PRODUCT.md','DESIGN.md']}
baseline=DOC/'source-baseline.json'
if not baseline.exists():save(baseline,{'at':datetime.now(timezone.utc).isoformat(),'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'scope':'Tracked application, public assets, source data, configuration and dependencies; exact file bytes, no database snapshot','files':protected})
else:
 old=json.loads(baseline.read_text())['files']; assert old==protected,'Protected source differs from Phase 1 baseline'

studio=[]
for line in read('src/lib/studio-modules.ts').splitlines():
 if 'key:' not in line or 'segment:' not in line:continue
 row={k:re.search(k+r":['\"]([^'\"]*)",line).group(1) for k in ['key','segment','label','group']}
 row['phase']=6 if row['key'] in ['overview','inquiries','follow-ups','activity','staff','settings','analytics','import','exports','subscribers','legacy','route-review','site-settings'] else 5
 row['route']='/studio'+('/'+row['segment'] if row['segment'] else '')
 row['states']=['default','loading','empty','error','narrow viewport','keyboard/focus']
 if row['key'] in ['products','journal','portfolio','testimonials','faqs','pages','landing-pages','inquiries']:row['states']+=['record selection','editor/detail','validation','unsaved changes','conflict/revision','preview/print where supported']
 row['adminOnly']='adminOnly:true' in line;row['status']='mapped; implementation pending phase approval';studio.append(row)
assert len(studio)==37
save(DOC/'studio-coverage.json',studio)
routes=[]
for p in sorted((ROOT/'src/app').rglob('page.tsx')):
 route='/'+str(p.parent.relative_to(ROOT/'src/app')).replace('\\','/')
 if route=='/.':route='/'
 phase=6 if route.startswith('/studio') else 3 if route=='/' else 4
 routes.append({'routePattern':route,'source':p.relative_to(ROOT).as_posix(),'phase':phase,'classification':'preview-harness-preserve' if route.startswith('/preview') else 'studio-shell/child' if route.startswith('/studio') else 'public','states':['opening','full scroll','links/actions','keyboard/focus','mobile','language layout where supported','loading/error/empty where supported'],'status':'mapped; no runtime route changed'})
save(DOC/'route-coverage.json',routes)
mapping={'pour':'Large split composition: original headline and actions beside room imagery; preserve film as a separate controlled chapter','manifesto':'Quiet full-width statement between opening and selected works','pieces':'Asymmetric gallery with preserved selected IDs and order','large-format':'Architect brief with larger image and grouped specification text','material':'Large material close-up paired with exact material paragraphs','collections':'Three clearly distinguished collection entries and existing categories','furniture':'Conditional concept gallery; preserve current hidden/visible selection','maker':'Editorial story spread, exact current story and no invented maker identity','rooms':'Conditional wide room gallery; keep design-visualization disclosure','work':'Portfolio index preview; preserve concept/evidence classification','words':'Quiet quotation treatment; retain fictional-sample disclosure','bespoke':'Prominent commission entry with current destination','workshops':'Conditional offering only when current confirmation exists','print':'Conditional offering only when current confirmation exists','process':'Sequential customer steps retaining chronology and meaning','why':'Grouped story principles in a reading-led layout','journal':'Large lead article with smaller companion stories, selected IDs intact','closing':'Spacious final invitation and existing actions'}
sections=[]
for line in read('src/lib/home-reference-model.ts').splitlines():
 m=re.search(r"\{key:'([^']+)',label:'([^']+)',source:'([^']+)',defaultVisible:(true|false)",line)
 if m:sections.append({'key':m[1],'label':m[2],'source':m[3],'defaultVisible':m[4]=='true','proposedTreatment':mapping[m[1]],'phase':3,'preservation':'Retain current published selection, order, visibility, copy and dependencies; do not activate conditional content','previewCoverage':'representative' if m[1] in ['pour','pieces','material','journal','closing'] else 'mapped for Phase 3'})
assert len(sections)==18
save(DOC/'homepage-section-map.json',sections)
legacy=json.loads(read('docs/redesign/old-design-migration-2026-10-08/old-section-manifest.json'))
rows=[]
for group in legacy:
 for s in group['sections']:
  rows.append({'group':group['group'],'key':s['key'],'label':s.get('label',s['key']),'source':s.get('source'),'phase':3 if group['group']=='HOME' else 4,'disposition':'coverage reference only; preserve current applicable content and conditions; new composition required','status':'mapped, current activation to be retained'})
save(DOC/'supporting-section-register.json',rows)
products=json.loads(read('src/lib/reviewed-product-copy.json'))
articles=json.loads(read('src/lib/reviewed-journal.json'))
training=json.loads(read('test-results/training-orders-2026-10-13/training-records.json'))
# Do not export real order IDs, contact details or customer data into the public preview.
orders=[{k:r[k] for k in ['number','stage','label','client','title']} for r in training['records']]
save(HERE/'preview-data.json',{'scope':'Local design prototype only; exact reviewed source copy and explicitly fictional existing training examples; no backend connection','products':{k:products[k] for k in ['DP001','DP013','DP035']},'article':next(a for a in articles if a['id']=='DB001'),'orders':orders,'studio':studio})
assets={'logo':'public/brand/rivyalivingart-logo-horizontal-transparent.png','room':'public/media/product-scene-001-16x9.webp','product':'public/media/product-hero-001-4x5.webp','basin':'public/media/product-hero-003-4x5.webp','console':'public/media/product-hero-005-4x5.webp','detail':'public/media/generated/dp001-matching-detail-4x5.webp','film-poster':'public/media/migration/hero-pour-loop-poster.jpg','film':'public/media/migration/hero-pour-loop.mp4','display-font':'src/styles/fonts/instrument-serif-normal-400.woff2','body-font':'src/styles/fonts/inter-common-400.woff2','medium-font':'src/styles/fonts/inter-common-500.woff2'}
assets={k:v for k,v in assets.items() if (ROOT/v).is_file()}
save(HERE/'asset-map.json',assets)
film=json.loads(read('docs/redesign/old-design-migration-2026-10-08/m4-media-evidence.json'))
save(DOC/'preview-assets.json',[{'key':k,'source':v,'sha256':sha(ROOT/v),'transformation':'none; original bytes served read-only','classification':'unchanged logo' if k=='logo' else 'font' if 'font' in k else 'material visualization' if k.startswith('film') else 'existing design visualization','driveId':next((f['driveId'] for f in film['files'] if 'public'+f['path']==v),None)} for k,v in assets.items()])
print(json.dumps({'protectedFiles':len(protected),'sourceRoutes':len(routes),'studioWorkspaces':len(studio),'homeSections':len(sections),'supportingSections':len(rows),'assets':len(assets),'trainingExamples':len(orders)}))

import json,re,unicodedata
from pathlib import Path
from pypdf import PdfReader
root=Path('output/playwright/redesign-phase7/redesign-phase4-interactions')
source=json.loads(Path('output/redesign-phase7/reading.json').read_text(encoding='utf-8'))
def norm(s): return re.sub(r'\W','',unicodedata.normalize('NFKC',s),flags=re.UNICODE).lower()
results=[]
for entry in source['print']:
    reader=PdfReader(root/(entry['route'][1:]+'.pdf'))
    text=norm(' '.join(page.extract_text() for page in reader.pages))
    missing=[i for i,block in enumerate(entry['blocks']) if norm(block) not in text]
    results.append({'route':entry['route'],'pages':len(reader.pages),'sourceBlocks':len(entry['blocks']),'missingBlocks':missing})
assert all(not row['missingBlocks'] for row in results),results
report={'scope':'All prose headings and text blocks found in six browser print PDFs; visual inspection separate; not a tagged-PDF or physical-printer certification','policies':results}
Path('output/redesign-phase7/print.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'policies':len(results),'pages':sum(r['pages'] for r in results),'blocks':sum(r['sourceBlocks'] for r in results),'missingBlocks':0}))

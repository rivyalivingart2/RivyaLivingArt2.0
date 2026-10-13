"""Bounded anonymous GETs only. No private Studio or database requests."""
from pathlib import Path
from html.parser import HTMLParser
from datetime import datetime,timezone
import urllib.request,urllib.parse,xml.etree.ElementTree as ET,json,hashlib
ROOT=Path(__file__).resolve().parents[2];DOC=ROOT/'docs/redesign/modern-design-2026-10-13'
class Copy(HTMLParser):
 def __init__(self):super().__init__();self.hidden=0;self.on=None;self.text='';self.rows=[]
 def handle_starttag(self,t,attrs):
  if t in ('script','style'):self.hidden+=1
  if not self.hidden and t in ('h1','h2','h3','p'):self.on=t;self.text=''
 def handle_data(self,s):
  if self.on and not self.hidden:self.text+=s
 def handle_endtag(self,t):
  if t in ('script','style'):self.hidden=max(0,self.hidden-1)
  if self.on==t:self.rows.append({'tag':t,'text':' '.join(self.text.split())});self.on=None
base='https://www.rivyalivingart.com';pages=[]
for route in ['/','/pieces/river-channel','/journal/a-room-begins-with-a-statement-table']:
 with urllib.request.urlopen(base+route,timeout=35) as r:body=r.read();status=r.status
 parser=Copy();parser.feed(body.decode('utf-8'));copy=parser.rows
 pages.append({'route':route,'status':status,'copy':copy,'copySha256':hashlib.sha256(json.dumps(copy,ensure_ascii=False).encode()).hexdigest()})
with urllib.request.urlopen(base+'/sitemap.xml',timeout=35) as r:xml=r.read();status=r.status
tree=ET.fromstring(xml);ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
routes=sorted(set(urllib.parse.urlsplit(e.text).path for e in tree.findall('.//s:loc',ns)))
report={'at':datetime.now(timezone.utc).isoformat(),'scope':'Anonymous GETs: sitemap and three representative public pages. Semantic text fingerprints exclude Next streaming IDs. Not a full live route audit or private database baseline.','sitemapStatus':status,'sitemapRoutes':routes,'sitemapRouteCount':len(routes),'pages':pages,'database':'Not accessed. Private record baseline must be refreshed through authorized read-only access before production integration; no Phase 1 database writes.'}
(DOC/'public-baseline.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'sitemapRoutes':len(routes),'pages':[{k:p[k] for k in ['route','status','copySha256']} for p in pages]}))

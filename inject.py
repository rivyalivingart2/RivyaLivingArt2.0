import re

with open('src/components/studio/catalogue-editor.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add activeTab state
code = code.replace(
    'const [entries,setEntries]=useState<Entry[]>([]),[entry,setEntry]=useState<Entry|null>(null)',
    "const [activeTab,setActiveTab]=useState<string>('general');\n const [entries,setEntries]=useState<Entry[]>([]),[entry,setEntry]=useState<Entry|null>(null)",
    1
)

# 2. Add Tabs UI just before preview
tabs_html = """
          <div className={s.tabs} style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ffffff20', paddingBottom: '10px', overflowX: 'auto', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch' }}>
            <button type='button' style={{ padding: '8px 16px', background: activeTab === 'general' ? '#d4b18d' : 'transparent', color: activeTab === 'general' ? '#0b1728' : 'inherit', border: '1px solid #d4b18d', borderRadius: '4px', whiteSpace: 'nowrap' }} onClick={() => setActiveTab('general')}>General Details</button>
            <button type='button' style={{ padding: '8px 16px', background: activeTab === 'images' ? '#d4b18d' : 'transparent', color: activeTab === 'images' ? '#0b1728' : 'inherit', border: '1px solid #d4b18d', borderRadius: '4px', whiteSpace: 'nowrap' }} onClick={() => setActiveTab('images')}>Images & Visuals</button>
            <button type='button' style={{ padding: '8px 16px', background: activeTab === 'customization' ? '#d4b18d' : 'transparent', color: activeTab === 'customization' ? '#0b1728' : 'inherit', border: '1px solid #d4b18d', borderRadius: '4px', whiteSpace: 'nowrap' }} onClick={() => setActiveTab('customization')}>Customization Form</button>
            <button type='button' style={{ padding: '8px 16px', background: activeTab === 'history' ? '#d4b18d' : 'transparent', color: activeTab === 'history' ? '#0b1728' : 'inherit', border: '1px solid #d4b18d', borderRadius: '4px', whiteSpace: 'nowrap' }} onClick={() => setActiveTab('history')}>History & Compare</button>
          </div>
"""
code = code.replace('{preview && (', tabs_html + '\n          {preview && (', 1)

# 3. General Tab
code = code.replace('<div className={s.grid}>', "{activeTab === 'general' && (\n          <div className={s.grid}>", 1)

code = code.replace(
    '</label>\n          </div>\n\n          {entry.reviewedImages&&entry.product.image!==entry.reviewedImages.image&&(', 
    "</label>\n          </div>\n          )}\n          {activeTab === 'images' && (\n          <>\n          {entry.reviewedImages&&entry.product.image!==entry.reviewedImages.image&&(",
    1
)

# The end of Images tab is right before `<RevisionHistory`
code = code.replace('\n          <RevisionHistory', "\n          </>\n          )}\n          {activeTab === 'history' && (\n          <>\n          <RevisionHistory", 1)

# The end of History tab is right before `<section className={s.fields}>`
code = code.replace('\n          <section className={s.fields}>', "\n          </>\n          )}\n          {activeTab === 'customization' && (\n          <section className={s.fields}>", 1)

# The end of Customization tab is right before `<div className={s.actions}>` (the Save draft one)
code = code.replace('</section>\n\n          <div className={s.actions}>\n            <button className={s.primary} disabled={busy||schemaIssues.length>0}>Save draft</button>', "</section>\n          )}\n\n          <div className={s.actions}>\n            <button className={s.primary} disabled={busy||schemaIssues.length>0}>Save draft</button>", 1)

with open('src/components/studio/catalogue-editor.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Done")

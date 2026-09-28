const fs = require('fs');
let code = fs.readFileSync('src/components/studio/catalogue-editor.tsx', 'utf8');

if (!code.includes('activeTab')) {
  code = code.replace(
    'const [entries,setEntries]=useState<Entry[]>([]);',
    'const [activeTab,setActiveTab]=useState<string>(\'general\');\n const [entries,setEntries]=useState<Entry[]>([]);'
  );

  const tabsHtml = `
          <div className={s.tabs} style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ffffff20', paddingBottom: '10px', overflowX: 'auto', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch' }}>
            <button type='button' style={{ padding: '8px 16px', background: activeTab === 'general' ? '#d4b18d' : 'transparent', color: activeTab === 'general' ? '#0b1728' : 'inherit', border: '1px solid #d4b18d', borderRadius: '4px', whiteSpace: 'nowrap' }} onClick={() => setActiveTab('general')}>General Details</button>
            <button type='button' style={{ padding: '8px 16px', background: activeTab === 'images' ? '#d4b18d' : 'transparent', color: activeTab === 'images' ? '#0b1728' : 'inherit', border: '1px solid #d4b18d', borderRadius: '4px', whiteSpace: 'nowrap' }} onClick={() => setActiveTab('images')}>Images & Visuals</button>
            <button type='button' style={{ padding: '8px 16px', background: activeTab === 'customization' ? '#d4b18d' : 'transparent', color: activeTab === 'customization' ? '#0b1728' : 'inherit', border: '1px solid #d4b18d', borderRadius: '4px', whiteSpace: 'nowrap' }} onClick={() => setActiveTab('customization')}>Customization Form</button>
            <button type='button' style={{ padding: '8px 16px', background: activeTab === 'history' ? '#d4b18d' : 'transparent', color: activeTab === 'history' ? '#0b1728' : 'inherit', border: '1px solid #d4b18d', borderRadius: '4px', whiteSpace: 'nowrap' }} onClick={() => setActiveTab('history')}>History & Compare</button>
          </div>
  `;

  code = code.replace(
    '{preview && (',
    tabsHtml + '\n          {preview && ('
  );

  code = code.replace(
    '<div className={s.grid}>',
    '{activeTab === \'general\' && (\n          <div className={s.grid}>'
  );

  code = code.replace(
    '{entry.reviewedImages&&entry.product.image!==entry.reviewedImages.image&&(',
    ')}\n          {activeTab === \'images\' && (\n            <>\n          {entry.reviewedImages&&entry.product.image!==entry.reviewedImages.image&&('
  );

  code = code.replace(
    '<RevisionHistory',
    '</>\n          )}\n          {activeTab === \'history\' && (\n            <>\n          <RevisionHistory'
  );

  code = code.replace(
    '<section className={s.fields}>',
    '</>\n          )}\n          {activeTab === \'customization\' && (\n          <section className={s.fields}>'
  );

  code = code.replace(
    '</section>\n\n          <div className={s.actions}>',
    '</section>\n          )}\n\n          <div className={s.actions}>'
  );

  fs.writeFileSync('src/components/studio/catalogue-editor.tsx', code);
  console.log('Tabs injected!');
} else {
  console.log('Already has tabs.');
}

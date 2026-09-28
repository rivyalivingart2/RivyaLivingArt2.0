import re

with open('src/components/studio/catalogue-editor.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
    '''      )}
    </div>

    {entry ? (''',
    '''      )}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>

    {entry ? ('''
)

with open('src/components/studio/catalogue-editor.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Done")

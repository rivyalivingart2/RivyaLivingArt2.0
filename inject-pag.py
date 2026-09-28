import re

with open('src/components/studio/catalogue-editor.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add import Pagination
code = code.replace(
    "import {RevisionHistory} from './revision-history';",
    "import {RevisionHistory} from './revision-history';\nimport {usePagination, Pagination} from './pagination';"
)

# 2. Add usePagination hook call
code = code.replace(
    'return (\n  <>\n   <div className={s.heading}>',
    "const {page, setPage, totalPages, paginatedItems} = usePagination(filteredEntries, 20);\n\n return (\n  <>\n   <div className={s.heading}>"
)

# 3. Use paginatedItems instead of filteredEntries in the map
code = code.replace(
    '{filteredEntries.map(e => (',
    '{paginatedItems.map(e => ('
)

# 4. Add Pagination component after the list
# The list ends when the `</div>` for `.list` is closed.
# It looks like:
#      </div>
#      
#      {entry ? (
code = code.replace(
    '</button>\n        ))}\n      </div>\n\n      {entry ? (',
    '</button>\n        ))}\n        <Pagination page={page} totalPages={totalPages} setPage={setPage} />\n      </div>\n\n      {entry ? ('
)

# Since we don't know the exact spacing, let's use regex for the end of the list:
code = re.sub(
    r'(</button>\s*\)\)}\s*</div>\s*\{entry \? \()',
    r'</button>\n        ))}\n        <Pagination page={page} totalPages={totalPages} setPage={setPage} />\n      </div>\n\n      {entry ? (',
    code
)

with open('src/components/studio/catalogue-editor.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Done")

import re

with open('src/components/shop/order-form.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add autoFocus to step 0 first field
code = code.replace(
    'visibleFields.map(f=><label',
    'visibleFields.map((f, i)=><label'
)
code = code.replace(
    'onChange={e=>setAnswers(v=>({...v,[f.id]:e.target.value}))}',
    'autoFocus={i===0} onChange={e=>setAnswers(v=>({...v,[f.id]:e.target.value}))}'
)

# Add autoFocus to step 1 first field
code = code.replace(
    ']).map(f=><label',
    ']).map((f, i)=><label'
)
code = code.replace(
    'onChange={e=>setContact(v=>({...v,[f.id]:e.target.value}))}',
    'autoFocus={i===0} onChange={e=>setContact(v=>({...v,[f.id]:e.target.value}))}'
)

with open('src/components/shop/order-form.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Added autofocus to order form")

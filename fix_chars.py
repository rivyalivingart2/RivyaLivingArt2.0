import re

with open('src/components/shop/shop-frame.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix mangled characters
code = code.replace(' A ', ' · ')
code = code.replace(' A ', ' · ')
code = code.replace('Ac ', '© ')
code = code.replace('Let?Ts talk', 'Let\'s talk')
code = code.replace('Begin a piece +-', 'Begin a piece ↗')
code = code.replace('?"', '—')

with open('src/components/shop/shop-frame.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Fixed mangled characters in shop-frame")

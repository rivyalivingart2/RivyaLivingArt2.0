import re
import glob

files = ['src/components/shop/hero-image.tsx', 'src/components/shop/shop-frame.tsx', 'src/components/shop/header.tsx']

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    # The mangled arrow is usually +-
    code = code.replace('+-', '↗')
    # The mangled dot is usually A
    code = code.replace('A', '·')
    # The mangled em-dash is usually ?"
    code = code.replace('?"', '—')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)

print("Fixed mangled characters across components")

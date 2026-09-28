import re

def safe_replace(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    # The mangled arrow is usually +-
    code = code.replace('+-', '↗')
    # The mangled dot is usually  
    code = code.replace(' A ', ' · ')
    # The mangled em-dash is usually ?"
    code = code.replace('?"', '—')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)

files = ['src/components/shop/hero-image.tsx', 'src/components/shop/shop-frame.tsx', 'src/components/shop/header.tsx', 'src/components/shop/editorial.tsx']
for f in files: safe_replace(f)

print("Fixed mangled characters safely")

import re

with open('next.config.ts', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("formats: ['image/webp']", "formats: ['image/avif', 'image/webp']")

with open('next.config.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated next.config.ts with AVIF")

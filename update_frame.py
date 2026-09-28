import re

with open('src/components/shop/shop-frame.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
    '<div className={s.site}><ShopHeader/>',
    '<div className={s.site}>\n    <a href="#main-content" className={s.skipLink}>Skip to main content</a>\n    <ShopHeader/>'
)

code = code.replace(
    '<Link href="/returns-cancellations">Changes & cancellations</Link></span>',
    '<Link href="/returns-cancellations">Changes & cancellations</Link> A <Link href="/imprint">Imprint</Link></span>'
)

with open('src/components/shop/shop-frame.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Updated shop-frame.tsx")

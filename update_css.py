import re

with open('src/components/shop/shop.module.css', 'a', encoding='utf-8') as f:
    f.write("\n.skipLink { position: absolute; left: -10000px; top: auto; width: 1px; height: 1px; overflow: hidden; }\n.skipLink:focus { position: fixed; top: 0; left: 0; width: auto; height: auto; padding: 12px 18px; background: var(--ivory, #fff); color: var(--navy, #000); z-index: 9999; font-weight: bold; outline: 3px solid var(--accent-bronze, #b79270); }\n")
print("Updated CSS")

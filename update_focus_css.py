import re

with open('src/components/shop/shop.module.css', 'a', encoding='utf-8') as f:
    f.write("\n/* --- Added Accessibility Focus & Form UX --- */\n")
    f.write(".button:focus-visible, .textLink:focus-visible, .searchLink:focus-visible, .mobileToggle:focus-visible, .brand:focus-visible, .nav a:focus-visible { outline: 2px solid var(--accent-bronze, #b79270); outline-offset: 4px; border-radius: 2px; }\n")
    f.write(".field input:focus, .field select:focus, .field textarea:focus, .searchForm input:focus { outline: 2px solid var(--accent-bronze, #b79270); outline-offset: -1px; }\n")
    f.write(".field input:focus-visible, .field select:focus-visible, .field textarea:focus-visible, .searchForm input:focus-visible { outline: 2px solid var(--accent-bronze, #b79270); outline-offset: 2px; }\n")
    f.write(".skipLink:focus-visible { outline: 4px solid var(--accent-bronze, #b79270); }\n")
    f.write(".check input:focus-visible { outline: 2px solid var(--accent-bronze, #b79270); outline-offset: 2px; }\n")
    f.write(".formLayout { scroll-behavior: smooth; }\n")

print("Updated shop.module.css with focus accessibility enhancements")

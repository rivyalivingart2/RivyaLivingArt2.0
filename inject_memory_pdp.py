import sys

file_path = "src/components/shop/shop-site.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace memory preservation notice
content = content.replace(
    "<p className={s.help}>Complete this piece’s customization form. Its saved order summary is prepared for you to send to the atelier on WhatsApp.</p>",
    "<p className={s.help}>Complete this piece’s customization form. Its saved order summary is prepared for you to send to the atelier on WhatsApp.</p>{product.tier === 'memory' && <div className={s.preservationNotice}><p><strong>First-time preservation?</strong> We recommend sending your flowers or keepsakes as early as possible. Read our <Link href=\"/process\" className={s.textLink}>Preparation Guide</Link> for detailed instructions.</p></div>}"
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")

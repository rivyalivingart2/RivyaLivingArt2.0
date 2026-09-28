import sys

file_path = "src/components/shop/shop-site.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace price
content = content.replace(
    "<p>Price on request · Customized to your brief</p>",
    "<p>{product.tier === 'personal' && product.price ? (product.price.mode === 'fixed' ? `₹${product.price.amount.toLocaleString('en-IN')}` : product.price.mode === 'starting' ? `From ₹${product.price.amount.toLocaleString('en-IN')}` : 'Price on request') : 'Price on request'} · Customized to your brief</p>"
)

# Replace memory preservation notice
content = content.replace(
    "<p className={s.help}>Complete this piece's customization form. Its saved order summary is prepared for you to send to the atelier on WhatsApp.</p>",
    "<p className={s.help}>Complete this piece's customization form. Its saved order summary is prepared for you to send to the atelier on WhatsApp.</p>{product.tier === 'memory' && <div className={s.preservationNotice}><p><strong>First-time preservation?</strong> We recommend sending your flowers or keepsakes as early as possible. Read our <Link href=\"/process\" className={s.textLink}>Preparation Guide</Link> for detailed instructions.</p></div>}"
)

# Replace large specification download
content = content.replace(
    "<dl className={s.specifications}>",
    "{product.tier === 'large' && <div className={s.specificationDownload}><a href={`/specs/${product.slug}-spec-sheet.pdf`} download className={s.textLink}>Download Specification Sheet (PDF) ↗</a></div>}<dl className={s.specifications}>"
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")

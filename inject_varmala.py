import sys
import re

file_path = "src/lib/shop-editorial.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

varmala_entry = """
 '/varmala-preservation':{title:'Preserve the beginning.',eyebrow:'Varmala Preservation',sections:[
   ['The process of preservation','Your wedding varmala represents the beginning of a shared story. We preserve the actual flowers from your ceremony in clear, museum-grade resin, turning a fragile memory into a lasting heirloom.'],
   ['Transparent pricing bands','Preservation pricing depends on the scale and complexity of the piece. Small keepsakes (coasters, pendants) start from ₹2,500. Medium display pieces (clocks, block letters) range from ₹8,000 to ₹15,000. Large bespoke arrangements are priced on request.'],
   ['How pickup & drop works','We handle the logistics so you don\\'t have to. Once you confirm your booking, we arrange a specialized courier pickup of your varmala directly from your venue or home. The flowers must be dried according to our instructions before shipping. Local pickup in select cities is available.'],
   ['Start your commission','Browse the Memory Art collection to select your preferred form, then fill out the customization brief. We will reply on WhatsApp to discuss the condition of your flowers and finalize the design.']
 ]},
"""

# Inject right after "export const shopPages:Record<... = {"
content = re.sub(
    r"(export const shopPages:[^=]+=\{)",
    r"\1" + varmala_entry,
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done injecting varmala")

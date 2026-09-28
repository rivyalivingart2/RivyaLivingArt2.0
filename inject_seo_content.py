import sys
import re

file_path = "src/lib/shop-editorial.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

entries = """
 '/workshops':{title:'Learn the craft.',eyebrow:'Resin Art Workshops',sections:[
   ['Master the medium','Join our immersive resin art workshops to learn the techniques behind our signature pieces. We cover everything from mixing and pouring to curing and finishing, offering hands-on experience with premium materials.'],
   ['Upcoming sessions','We host regular weekend workshops in select cities and offer private group sessions on request. Check our latest schedule or contact the atelier to book a private corporate team-building event.'],
   ['What is included','All materials, including safety gear, high-grade epoxy resin, pigments, and molds, are provided. You will take home your own handcrafted piece at the end of the session.']
 ]},
 '/resin-art-mumbai':{title:'Resin Art in Mumbai.',eyebrow:'Local Delivery',sections:[
   ['Bespoke furniture and decor for Mumbai homes','From sea-facing apartments in Bandra to modern spaces in Powai, our large-scale resin tables and custom consoles bring a distinctive material presence to Mumbai interiors.'],
   ['Varmala preservation in Mumbai','We offer specialized pickup services across Mumbai for varmala and wedding flower preservation. Send us your fresh or dried flowers, and we will cast them into a timeless heirloom.'],
   ['Local delivery & installation','For our Collectible Furniture tier, we coordinate careful delivery and professional installation throughout the Mumbai metropolitan region, ensuring your piece arrives perfectly.']
 ]},
 '/resin-art-delhi':{title:'Resin Art in Delhi.',eyebrow:'Local Delivery',sections:[
   ['Statement pieces for NCR interiors','Our resin and live-edge dining tables act as the perfect centerpiece for farmhouses in Chhatarpur or contemporary homes in South Delhi. Each piece is crafted to your precise dimensions.'],
   ['Varmala preservation in Delhi','We preserve wedding memories for couples across Delhi NCR. Schedule a pickup for your varmala, and our studio will carefully dry and cast the flowers into custom keepsakes.'],
   ['Secure logistics','We partner with specialized art handlers for safe delivery of large furniture pieces to Delhi, Gurgaon, and Noida, ensuring your commission reaches you in flawless condition.']
 ]},
 '/resin-art-pune':{title:'Resin Art in Pune.',eyebrow:'Local Delivery',sections:[
   ['Custom resin furniture in Pune','Elevate your living space in Koregaon Park or Kalyani Nagar with our bespoke resin coffee tables and wall art. We collaborate closely with local interior designers.'],
   ['Pune varmala preservation','Your wedding flowers hold immense sentimental value. We offer coordinated pickup from Pune venues to preserve your varmala in premium, non-yellowing resin.'],
   ['Direct studio delivery','We arrange direct, secure shipping to Pune for all our pieces, from small personal gifts to room-scale architectural furniture.']
 ]},
 '/resin-art-chennai':{title:'Resin Art in Chennai.',eyebrow:'Local Delivery',sections:[
   ['Material contrast for Chennai homes','Our handcrafted timber and resin furniture brings an organic, cooling aesthetic to coastal Chennai interiors. We customize finishes to suit the local climate and light.'],
   ['Varmala preservation in Chennai','Preserve the vibrant flowers of your South Indian wedding. We provide clear instructions on drying and packing your garlands for safe transit to our studio.'],
   ['Reliable shipping','Every piece, from customized memory art to large dining tables, is crated securely and shipped with trusted logistics partners to Chennai.']
 ]},
"""

# Inject right after "export const shopPages:Record<... = {"
content = re.sub(
    r"(export const shopPages:[^=]+=\{)",
    r"\1" + entries,
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done injecting SEO content")

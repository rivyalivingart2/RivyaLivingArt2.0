import json

file_path = "src/lib/reviewed-journal.json"
with open(file_path, "r", encoding="utf-8") as f:
    journal = json.load(f)

new_articles = [
  {
    "id": "DB037",
    "slug": "epoxy-resin-dining-table-cost-in-india",
    "title": "Epoxy Resin Dining Table Cost in India: A Transparent Guide",
    "category": "Guides",
    "image": "/media/product-scene-001-16x9.webp",
    "imageAlt": "River Channel table showing scale and finish",
    "intro": "Understanding what goes into pricing a custom resin and wood dining table, from timber selection to museum-grade epoxy.",
    "sections": [
      {
        "id": "cost-factors",
        "heading": "What Drives the Cost?",
        "paragraphs": [
          "A custom resin dining table in India typically ranges from ₹65,000 to upwards of ₹2,50,000 depending on the scale and materials. The primary cost factors are the species of live-edge timber (such as Walnut or Teak), the volume and clarity of the epoxy resin used, and the complexity of the steel or wooden base.",
          "High-grade, non-yellowing resin is expensive but crucial for longevity. We refuse to compromise on the chemistry, ensuring your statement piece remains pristine."
        ]
      }
    ],
    "relatedProductIds": ["SITES-L-001"]
  },
  {
    "id": "DB038",
    "slug": "resin-vs-jesmonite-home-decor",
    "title": "Resin vs Jesmonite: Choosing the Right Material",
    "category": "Material notes",
    "image": "/media/product-hero-026-4x5.webp",
    "imageAlt": "Timber and resin sample",
    "intro": "Both materials offer incredible versatility, but they serve entirely different aesthetics and functional purposes.",
    "sections": [
      {
        "id": "material-differences",
        "heading": "Transparency vs Texture",
        "paragraphs": [
          "Epoxy resin is beloved for its glass-like transparency, depth, and ability to suspend objects (like wedding flowers). It captures light and creates a fluid, watery aesthetic.",
          "Jesmonite, on the other hand, is an eco-friendly composite that results in a matte, stone-like, opaque finish. It is excellent for textured, architectural decor pieces but cannot offer the clear depths of resin."
        ]
      }
    ],
    "relatedProductIds": []
  },
  {
    "id": "DB039",
    "slug": "varmala-preservation-cost-guide",
    "title": "Varmala Preservation Cost Guide",
    "category": "Guides",
    "image": "/media/product-scene-013-16x9.webp",
    "imageAlt": "Preserved memory art piece",
    "intro": "A clear breakdown of our preservation packages, timelines, and how we handle your irreplaceable wedding memories.",
    "sections": [
      {
        "id": "preservation-pricing",
        "heading": "Pricing Tiers for Preservation",
        "paragraphs": [
          "Our preservation services are designed to suit different scales. Small keepsakes, such as coasters and pendants, start from ₹2,500. For medium-sized statement pieces—like functional clocks or bold block letters—expect to invest between ₹8,000 and ₹15,000.",
          "The cost includes the meticulous drying process, multiple slow-cured layers of museum-grade resin, and secure pickup logistics from your wedding venue or home."
        ]
      }
    ],
    "relatedProductIds": []
  }
]

journal.extend(new_articles)

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(journal, f, indent=2, ensure_ascii=False)

print("Added 3 journal entries")

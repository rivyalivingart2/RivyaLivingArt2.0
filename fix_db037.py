import json

file_path = "src/lib/reviewed-journal.json"
with open(file_path, "r", encoding="utf-8") as f:
    journal = json.load(f)

for article in journal:
    if article.get("id") == "DB037":
        article["relatedProductIds"] = ["DP001"]

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(journal, f, indent=2, ensure_ascii=False)

print("Fixed DB037 relatedProductIds")

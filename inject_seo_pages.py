import os

pages = [
    "resin-art-mumbai",
    "resin-art-delhi",
    "resin-art-pune",
    "resin-art-chennai",
    "workshops"
]

template = """import {routeMetadata} from '@/lib/site-metadata';
import {ApprovedExperience} from '@/components/rivya/approved-entry';
import {requirePublicPreview} from '@/lib/public-preview';
export function generateMetadata(){return routeMetadata('/%s');}
export default async function Page(){await requirePublicPreview();return <ApprovedExperience initialRoute='/%s'/>}\n"""

for page in pages:
    file_path = f"src/app/{page}/page.tsx"
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(template % (page, page))

print("Created page components")

import re

with open('src/components/studio/workspace.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add dynamic imports
code = code.replace(
    "const Operations=dynamic(()=>import('./operations').then(m=>m.Operations),{loading:WorkspaceLoading});",
    "const Operations=dynamic(()=>import('./operations').then(m=>m.Operations),{loading:WorkspaceLoading});\nconst SiteCopyEditor=dynamic(()=>import('./site-copy-editor').then(m=>m.SiteCopyEditor),{loading:WorkspaceLoading});\nconst SiteImagesEditor=dynamic(()=>import('./site-images-editor').then(m=>m.SiteImagesEditor),{loading:WorkspaceLoading});"
)

# Add to navGroups
code = code.replace(
    "{ key: 'media', href: '/studio/media', label: 'Public media', icon: ImageIcon },",
    "{ key: 'media', href: '/studio/media', label: 'Public media', icon: ImageIcon },\n        { key: 'site-copy', href: '/studio/site-copy', label: 'Site copy', icon: FileText },\n        { key: 'site-images', href: '/studio/site-images', label: 'Site images', icon: ImageIcon },"
)

# Add to view routing
# Find: view==='products'?<CatalogueEditor admin={admin}/>
# Replace with: view==='site-copy'?<SiteCopyEditor admin={admin}/>:view==='site-images'?<SiteImagesEditor admin={admin}/>:view==='products'?<CatalogueEditor admin={admin}/>
code = code.replace(
    "view==='products'?<CatalogueEditor admin={admin}/>",
    "view==='site-copy'?<SiteCopyEditor admin={admin}/>:view==='site-images'?<SiteImagesEditor admin={admin}/>:view==='products'?<CatalogueEditor admin={admin}/>"
)

with open('src/components/studio/workspace.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Done")

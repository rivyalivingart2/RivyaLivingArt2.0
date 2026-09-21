# RivyaLivingArt — Separate Asset Generation Prompts and Drive Handoff

**Revision 8 · 21 September 2026**  
**Companion:** `RivyaLivingArt_Master_Build_Prompt_v8.md`  
**This file contains prompts, not generated images or videos.** The owner generates missing image/video outputs, uploads them to Drive, and returns the source reference. Codex inspects, maps, optimizes and imports approved files. No generation-service integration is added to the custom CMS.

**Carried-forward Revision 7 scope note:** The existing 24 image, 5 video and 4 SVG templates remain unchanged. Generate/request assets only for the confirmed website and Studio scope; none is needed for the rejected S01–S04 features. This revision changes scope instructions and document references only; it does not generate media or re-review Drive files.

## Revision 8 priority — resolve visible assets before backend

Use the templates below incrementally during R8-1–5, beginning with the large-furniture hero, first collectible grid/detail, secondary collections and Studio/logo visuals. The 24 image, 5 video and 4 SVG templates remain the same; no rejected-feature asset request is added. Do not generate all templates indiscriminately or delay usable frontend pages while every optional film is pending.

For the first visual build, use already approved public media URLs or reviewed modest-size local derivatives in the existing source asset structure. Record actual source/rights/classification and output mapping. Never commit full original media collections, huge videos or private customer images just to push the frontend. Keep original Drive files unchanged. Later, integrate editable marketing assets with the shared Blob/media library without re-creating a second gallery or losing source references.

Missing outputs remain prompts for the owner to generate and return through Drive. An acceptable static poster or labelled visual-pending fallback can support review when genuinely appropriate; it is not proof of completed final media. No runtime Drive sync, image/video generator or new vendor account is introduced.

## 1. Reuse the known Drive source before generating

Source folder: `Rivya_All_Generated_Images`  
Folder ID: `1wUG_qzou3CC1wjnTGeTDwP5Fh7Dab86l`  
Folder URL: <https://drive.google.com/drive/folders/1wUG_qzou3CC1wjnTGeTDwP5Fh7Dab86l>

README file: `1RkCclKtmgNvpw_6opUYNCZPfQpdMfDCo`; index: `1cgkeziT6VjkrIZW81YmWbjA997YT2fDH`. The README reports **35 final product portraits and 10 final room scenes**, all AI-generated concept visualizations, plus two earlier versions. It reports native portrait dimensions of **1122×1402** and scene dimensions of **1672×941**, and explicitly states that the matching homepage video poster is not included. This is source-reported metadata, not a complete new visual audit of every asset.

Use `final/product-heroes/` and `final/room-scenes/` before `earlier-versions/`. Review actual pixels for product identity, framing, continuity and quality. Do not count the room views as ten additional products, claim the sources are real photographs, or assume images were uploaded to Blob merely because they exist on Drive. The source README references another repository/older provider brief; it does not override the current custom-CMS/Blob/no-scraper decisions.

Initial gap priorities: hero film with matching poster; a safe mobile composition; seating; preservation clocks/trays/nameplates; jewellery/rakhi; required material/story slots. These are candidate gaps from the source index, subject to actual image review. There is no reason to regenerate every already suitable concept.

## 2. Owner generation loop

Codex resolves the next necessary visual slot and fills its prompt variables. The owner attaches any referenced image to the generator, runs the prompt, checks the output and uploads the original output to a chosen writable Drive destination. Return the actual Drive file link/ID and its prompt/slot ID. Codex then checks dimensions, file type, imagery/video frames, crop, rights/classification and file integrity before mapping a reviewed derivative to Blob/local assets.

Folder suggestion only, not created here: `website-assets/incoming/images`, `incoming/video`, `incoming/vectors`, `approved` and `rejected` beneath an owner-selected writable folder. Do not mutate the existing shared collection or create these folders without a specific request/permission. Keep original filenames or record a deliberate mapping; never overwrite source masters silently.

Each request needs ID, fixture/content IDs, real/concept classification, required reference file, route/component, priority, output filename, aspect ratio, native size, prompt, constraints, poster/fallback, owner-returned source ID and review state. Useful states: NEEDS_PROMPT → AWAITING_OWNER_OUTPUT → OUTPUT_RECEIVED → IN_REVIEW → APPROVED / REJECTED → MAPPED. A filename or prompt is not proof an output exists.

## 3. Brand, accuracy and output rules

Use the supplied logo board as colour/art-direction reference: forest-dark surfaces, warm ivory light and restrained bronze. Proposed UI colours are forest canvas `#101713`, surface `#19221C`, bronze `#B79270` and ivory `#F3EFE7`. These affect surroundings and composition; do not recolour the actual product to force a match. Do not bake UI titles, captions, logos or measurement labels into generated imagery.

All new demo designs are **fictional concepts**. Reference-preserving instructions require the actual authorized reference to be attached; replace placeholders before generating. Do not claim exact dimensions, construction safety, real delivery, stock, workshop activity or customer endorsement from pixels. No real names, phone numbers, plans, wedding cards or faces in demo generation. Do not submit private customer files to a third-party generator without specific consent.

Image targets below express desirable composition/native resolution, not a guarantee that a tool supports an exact size. Preserve the native output, record actual dimensions and do not stretch/crop/upscale while pretending higher detail was generated. Ask for a higher-quality rerender only where the slot really needs it. Keep the existing smaller concepts usable for appropriate preview/card sizes where visually acceptable.

Video: no required audio, no rapid flashing, no manufactured false motion or geometrical drift. Review actual frames. Create the final poster from the approved video so the two match; a still image is an acceptable temporary fallback but is not a “matching extracted frame.” Optimize derivatives after review; the existing approximate 6 MB hero-video target is a delivery budget, not an instruction that a generator guarantees file size. Keep a static reduced-motion/mobile fallback.

Logo masters: request the actual approved SVG or transparent PNG from the brand source. Do not generate a replacement R/leaf monogram, recreate it from a lookalike font, or use the entire branding board as the header/favicon. Small icons and true SVG vector code can be authored through ChatGPT/Codex and reviewed directly; an image generator's bitmap is not a vector file.

## 4. Twenty-four image prompt templates

Fill variables using the exact DP/DB entry in `RivyaLivingArt_Demo_Content_Blueprint_v8.md`. A template may cover several product IDs, but each output must correspond to its actual concept and have a unique stable filename. Do not generate 120 images indiscriminately: map useful existing concepts first, then fill necessary gaps in batches.

### IMG01 — Furniture-first hero
**Priority:** P1. **Placement:** Home / collectible landing · W04.  
**Output:** `rivya-home-hero-concept-16x9-v01.png`. **Format target:** 16:9; target 2560×1440 or higher native output.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. A large sculptural resin-and-wood coffee or dining table as the sole focal object in a quiet architectural interior. Compose the object to the right with uncluttered left-side space for accessible website text. Use deep forest/mineral surroundings, warm ivory architectural accents and a very restrained bronze detail. Soft side light should reveal grain and translucency without making the resin glow like neon. The scale must read as large furniture, not a miniature.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG02 — Mobile hero composition
**Priority:** P1. **Placement:** Mobile home hero · W04.  
**Output:** `rivya-home-hero-concept-4x5-v01.png`. **Format target:** 4:5; target 2048×2560 or higher native output.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Use the approved IMG01 object reference, which must be attached. Produce a vertical companion view preserving the same silhouette, supports, wood grain, resin colour and materials. Keep the full object in frame and leave calm space above it for a short mobile headline. Do not invent a second table or merely stretch the landscape composition.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG03 — Sculptural seating study
**Priority:** P1. **Placement:** Seating category / matching DP043–DP050 fixture · W06/W07.  
**Output:** `rivya-seating-[DP_ID]-hero-4x5-v01.png`. **Format target:** 4:5; target 2048×2560.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create one original explicitly fictional resin-and-wood [CHAIR_OR_STOOL_OR_BENCH] concept for [DP_ID_AND_TITLE]. Show an unobstructed three-quarter full-object view on a quiet dark forest-toned studio backdrop. Make supports visually coherent, with balanced proportions and a believable contact shadow. This is a concept illustration, not evidence of structural safety, comfort or manufactured stock.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG04 — Side-table concept
**Priority:** P1. **Placement:** Side-table category / matching fixture · W07/W11.  
**Output:** `rivya-[DP_ID]-side-table-4x5-v01.png`. **Format target:** 4:5; target 2048×2560.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Depict the original fictional side-table design described by [DP_ID_AND_TITLE]. A compact but clearly furniture-scale object with an uncluttered silhouette, restrained translucent resin and natural wood. Use warm side light and sufficient tonal separation from the deep forest background. Show all legs/supports and the tabletop edge; no unrelated accessories masking construction.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG05 — Coffee-table concept
**Priority:** P1. **Placement:** Collectible grid / matching fixture · W07/W11.  
**Output:** `rivya-[DP_ID]-coffee-table-4x5-v01.png`. **Format target:** 4:5; target 2048×2560.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Depict one original fictional [DP_TITLE] coffee-table concept in a full-object three-quarter portrait. Keep its [APPROVED_DESIGN_DESCRIPTION] consistent with the fixture brief. Restrained resin depth, natural grain, clean base silhouette, soft mineral ground and a dark forest backdrop. Leave small safe margins so the top and supports survive a catalogue crop.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG06 — Dining-table concept
**Priority:** P2. **Placement:** Dining collection / matching fixture · W07/W11.  
**Output:** `rivya-[DP_ID]-dining-table-4x5-v01.png`. **Format target:** 4:5; target 2048×2560.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create an original fictional [DP_TITLE] dining-table visualization from [DESIGN_BRIEF]. Show the whole top and base with natural perspective and sufficient space around its perimeter. Quiet architectural setting, soft daylight, honest-looking wood grain and subtle resin translucency. Do not add chairs that conceal the table, baked-in dimensions, a designer signature or brand logos.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG07 — Console concept
**Priority:** P2. **Placement:** Console collection / matching fixture · W07/W11.  
**Output:** `rivya-[DP_ID]-console-4x5-v01.png`. **Format target:** 4:5; target 2048×2560.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Visualize an original fictional [DP_TITLE] narrow console from [DESIGN_BRIEF]. Show a readable long-span silhouette with coherent supports, a clean top and a subtle floor shadow. The backdrop is deep forest charcoal with warm neutral architectural light. No props covering the join between wood and resin; no false workshop or installed-project claim.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG08 — Desk concept
**Priority:** P2. **Placement:** Desk collection / matching fixture · W07/W11.  
**Output:** `rivya-[DP_ID]-desk-4x5-v01.png`. **Format target:** 4:5; target 2048×2560.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create one original fictional full-size [DP_TITLE] desk concept using [DESIGN_BRIEF]. Show the object, leg clearance and full top without a person or computer concealing details. Calm mineral surroundings, natural wood, subtle resin and controlled light. Do not interpret a small desk ornament as a full-size desk or add unrequested drawers, outlets or features.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG09 — Architectural wall-art concept
**Priority:** P2. **Placement:** Large wall-art collection · W07/W11.  
**Output:** `rivya-[DP_ID]-wall-art-4x5-v01.png`. **Format target:** 4:5; target 2048×2560.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create an original fictional [SINGLE_PANEL_DIPTYCH_OR_TRIPTYCH] resin wall-art concept for [DP_TITLE]. Show the whole arrangement on a quiet dark wall with enough surrounding architecture to suggest large scale. Controlled relief depth and soft grazing light; no invented measurement labels, client home, signature or certification.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG10 — Freestanding sculpture concept
**Priority:** P2. **Placement:** Sculpture collection · W07/W11.  
**Output:** `rivya-[DP_ID]-sculpture-4x5-v01.png`. **Format target:** 4:5; target 2048×2560.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create an original fictional [DP_TITLE] sculptural resin object from [DESIGN_BRIEF]. Use a clear gallery silhouette, physically plausible visual support and a minimal plinth or floor appropriate to the stated intended scale. Soft light reveals layers rather than exaggerated glow. Do not imitate a named artist or claim a real exhibition, edition or sale.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG11 — Architectural installation concept
**Priority:** P2. **Placement:** Bespoke projects / concept case study.  
**Output:** `rivya-[DP_ID]-installation-16x9-v01.png`. **Format target:** 16:9; target 2560×1440.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Visualize the original fictional [DP_TITLE] installation from [DESIGN_BRIEF] in an anonymous quiet architectural space. Leave clear circulation and show the installation as the primary subject. Use deep forest and warm neutral surroundings with restrained bronze accents. It must be presented as a design study, not a completed RivyaLivingArt project or an engineering-approved installation.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG12 — Preservation-clock concept
**Priority:** P1. **Placement:** Memory art / matching clock fixture · W08/W17.  
**Output:** `rivya-[DP_ID]-clock-4x5-v01.png`. **Format target:** 4:5; target 2048×2560.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create an original fictional floral resin clock concept for [DP_TITLE]. Use tasteful small botanical details, clear separation between the clock face and preserved-flower composition, soft light and a warm-neutral surface against a dark background. No real names, dates, customer materials, certification or claims of a specific mechanism.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG13 — Bouquet-preservation concept
**Priority:** P2. **Placement:** Memory-art category and matching product · W08.  
**Output:** `rivya-[DP_ID]-bouquet-4x5-v01.png`. **Format target:** 4:5; target 2048×2560.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create a clearly illustrative fictional [FRAME_OR_BLOCK_OR_DISC] bouquet keepsake for [DP_TITLE]. Show the flowers as the visual centre with calm negative space and legible object scale. Natural restrained floral colours, gentle highlights and a deep forest-toned setting. No real couple names, portraits, event documents or implication that an actual sentimental object was processed.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG14 — Ceremony-tray concept
**Priority:** P1. **Placement:** Memory-art tray fixtures · W08/W17.  
**Output:** `rivya-[DP_ID]-ceremony-tray-4x5-v01.png`. **Format target:** 4:5; target 2048×2560.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create an original fictional engagement/ring ceremony tray concept for [DP_TITLE]. Use a restrained arrangement, subtle resin depth and minimal floral or metallic detail. Show the whole tray and clear margins; leave any personalization area blank so the application can render reviewed text. No identifiable people, names, dates, logos or crowded ornament.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG15 — Nameplate concept
**Priority:** P1. **Placement:** Memory-art nameplate fixtures · W08.  
**Output:** `rivya-[DP_ID]-nameplate-4x5-v01.png`. **Format target:** 4:5; target 2048×2560.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create an original fictional botanical resin nameplate form for [DP_TITLE], shown as a standalone object rather than installed at a real address. Keep the main lettering area blank and uncluttered; actual sample labels will be added accessibly by the UI. Forest/ivory setting, gentle bronze detail, soft light; no house number or real family information.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG16 — Small memory keepsake concept
**Priority:** P2. **Placement:** Baby/anniversary sample objects · W08.  
**Output:** `rivya-[DP_ID]-keepsake-4x5-v01.png`. **Format target:** 4:5; target 2048×2560.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create an original fictional keepsake-object concept for [DP_TITLE] using a minimal botanical or abstract composition. Avoid actual baby photos, names, birth dates, medical identifiers or personal documents. Show clear object scale and a calm premium finish; it is a generic design concept, not a real family commission.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG17 — Resin jewellery concept
**Priority:** P1. **Placement:** Personal art / jewellery · W09.  
**Output:** `rivya-[DP_ID]-jewellery-4x5-v01.png`. **Format target:** 4:5; target 2048×2560.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create an original fictional [PENDANT_OR_EARRINGS] resin concept for [DP_TITLE] in a clean still life. Small believable scale, subtle botanical inclusion and uncluttered metal findings without pretending a specific metal grade. No model/skin, brand marks, allergy-safe claim or excessive sparkles. Use a warm neutral platform on a forest-dark background.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG18 — Rakhi concept
**Priority:** P1. **Placement:** Personal art / festive gifting · W09.  
**Output:** `rivya-[DP_ID]-rakhi-4x5-v01.png`. **Format target:** 4:5; target 2048×2560.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create one original fictional resin rakhi design for [DP_TITLE] as a clearly visible small object in a clean still life. Gentle material detail, tasteful thread arrangement, restrained colour and no real name or festival-year lettering. Use warm soft light and a premium dark forest-toned setting; no hand/model or manufactured-stock claim.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG19 — Small-gift collection still life
**Priority:** P2. **Placement:** Gifting landing / related objects · W06/W09.  
**Output:** `rivya-gifting-collection-16x9-v01.png`. **Format target:** 16:9; target 2560×1440.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Compose a quiet editorial still life using only the approved attached [PRODUCT_REFERENCE_IDS] for small resin gifts. Preserve the identity of each object; do not invent extra features. Use no more than three related objects, ample space and warm side light. Leave a calm headline area. Without actual references, produce a clearly labelled original concept, not a photograph of offered stock.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG20 — Resin and wood macro
**Priority:** P1. **Placement:** Material story / article cover · W14/W22.  
**Output:** `rivya-material-macro-16x9-v01.png`. **Format target:** 16:9; target 2560×1440.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create an abstract original material study where translucent resin meets natural wood grain. Fine tactile detail, subtle pigment depth, gentle raking light, no fluorescent glow and no dramatic cracks or defects presented as craftsmanship. The palette is forest/mineral/bronze/ivory around the material, not an instruction to recolour an approved product. No text or proof-of-process claim.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG21 — Large-art journal cover family
**Priority:** P2. **Placement:** Large-art blog covers · W22.  
**Output:** `rivya-blog-[DB_ID]-large-art-16x9-v01.png`. **Format target:** 16:9; target 2560×1440.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create a distinct conceptual editorial cover for [DB_TITLE_AND_BRIEF]. Use one relevant sculptural-furniture silhouette, wood/resin study or carefully arranged anonymous interior detail. Calm dark forest/mineral art direction with restrained warm light and space for separately rendered text. No article text, logos, fake client projects or photographed-person claims.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG22 — Commission-planning journal cover
**Priority:** P2. **Placement:** Commission/process article covers · W22.  
**Output:** `rivya-blog-[DB_ID]-planning-16x9-v01.png`. **Format target:** 16:9; target 2560×1440.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create an original conceptual still life about planning a bespoke furniture piece: blank paper shapes, a simple unlabeled object sketch, material fragments and subtle bronze drawing tools, arranged with quiet precision. No readable dimensions, customer floor plan, address, signature or brand logo. Use soft light and the dark forest/ivory visual language.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG23 — Memory-art journal cover
**Priority:** P2. **Placement:** Memory/preservation blog covers · W22.  
**Output:** `rivya-blog-[DB_ID]-memory-16x9-v01.png`. **Format target:** 16:9; target 2560×1440.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create an original illustrative editorial cover about [DB_TITLE_AND_BRIEF], using generic flowers and a simple keepsake silhouette. Leave ample space and avoid real people, names, dates, wedding documents or an actual before/after preservation claim. Warm restrained light, subtle translucency and a forest-dark setting; no baked-in title.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

### IMG24 — Personal-gifting journal cover
**Priority:** P2. **Placement:** Gifting blog covers · W22.  
**Output:** `rivya-blog-[DB_ID]-gifting-16x9-v01.png`. **Format target:** 16:9; target 2560×1440.  
**Classification:** Fictional demo/editorial concept, unless an actual approved product reference and truthful use are separately confirmed.

```text
Create an original RivyaLivingArt concept visualization. Create a distinct original small-object gifting still life for [DB_TITLE_AND_BRIEF]. Show a few tactile resin forms and simple unbranded packaging in a calm composition. No readable corporate logos, customer names, fake testimonial text or invented luxury-brand packaging. Warm neutral materials against forest-dark surroundings, no baked-in headings.
Use only references actually attached with permission. Preserve an attached approved
object's identity; otherwise label the result as a new fictional design concept.
No baked-in lettering, watermark imitation, third-party logo, extra parts, distorted
perspective, impossible supports or fake customer/project evidence. Return one clean
image in the requested aspect ratio, with useful margins and restrained tonal detail.
```

## 5. Five optional video prompts

Video generation happens in the owner’s chosen suitable tool, not the deployed CMS. Never claim that an image-only tool can produce these clips. A static poster is the fallback while outputs are pending.

### VID01 — Homepage furniture film
**Priority:** P1. **Placement:** W04 home hero.  
**Output:** `rivya-home-hero-16x9-v01.mp4` plus a poster extracted after approval. **Target:** 16:9; 5–8 seconds; silent.

```text
Create an editorial concept film for RivyaLivingArt. Use the attached approved hero concept image [REFERENCE_ID]. Make a slow restrained camera move that reveals the surface and base without changing the object. Preserve geometry, leg count, grain, resin colour and background continuity from frame to frame. No morphing, extra parts, people, text, logos, flashing light or simulated fabrication. Keep a calm headline-safe region. Identify a clean poster frame; a seamless loop is optional and must be inspected.
Use only the actual approved references attached to this request. No generated
speech, music, logo, watermark imitation, customer identity or factual production
claim. Return the native video file; product accuracy and continuity will be checked
before use. Do not substitute a still-image animation for a geometry-accurate model.
```

### VID02 — Mobile hero film
**Priority:** P2. **Placement:** W04 mobile enhancement.  
**Output:** `rivya-home-hero-4x5-v01.mp4` plus a poster extracted after approval. **Target:** 4:5 or reviewed 9:16; 5–8 seconds; silent.

```text
Create an editorial concept film for RivyaLivingArt. Use the same approved hero object as VID01 with a vertical reference image attached. Preserve the full object and a quiet text area during a very small camera move. Do not crop away supports or invent geometry to fill the portrait frame. No visual drift, titles or rapid movement. This is optional; the matching mobile poster remains the reliable default.
Use only the actual approved references attached to this request. No generated
speech, music, logo, watermark imitation, customer identity or factual production
claim. Return the native video file; product accuracy and continuity will be checked
before use. Do not substitute a still-image animation for a geometry-accurate model.
```

### VID03 — Material macro film
**Priority:** P2. **Placement:** W14 material section.  
**Output:** `rivya-material-macro-16x9-v01.mp4` plus a poster extracted after approval. **Target:** 16:9; 4–6 seconds; silent.

```text
Create an editorial concept film for RivyaLivingArt. Animate a subtle light/camera shift across the attached approved resin-and-wood macro. Keep grain and material boundaries consistent, with gentle reflections and no liquid pouring, bubbles appearing or surface transformation. This is a material visualization, not documentary footage of the actual workshop or a product-performance test.
Use only the actual approved references attached to this request. No generated
speech, music, logo, watermark imitation, customer identity or factual production
claim. Return the native video file; product accuracy and continuity will be checked
before use. Do not substitute a still-image animation for a geometry-accurate model.
```

### VID04 — Product detail movement
**Priority:** P2. **Placement:** W11 optional selected collectible video.  
**Output:** `rivya-[DP_ID]-detail-film-16x9-v01.mp4` plus a poster extracted after approval. **Target:** 16:9; 5–8 seconds; silent.

```text
Create an editorial concept film for RivyaLivingArt. Use the attached approved [DP_ID] reference. Produce only a small lateral camera move around the visible angle, preserving the known silhouette and support arrangement. Avoid a complete 360-degree orbit that invents unseen geometry. No added accessories or colour changes. Keep it labelled as a concept film and do not call it a 3D model or AR asset.
Use only the actual approved references attached to this request. No generated
speech, music, logo, watermark imitation, customer identity or factual production
claim. Return the native video file; product accuracy and continuity will be checked
before use. Do not substitute a still-image animation for a geometry-accurate model.
```

### VID05 — Memory-art concept film
**Priority:** P2. **Placement:** W11 selected memory product.  
**Output:** `rivya-[DP_ID]-memory-film-4x5-v01.mp4` plus a poster extracted after approval. **Target:** 4:5; 4–6 seconds; silent.

```text
Create an editorial concept film for RivyaLivingArt. Use the attached fictional flower-keepsake reference [DP_ID]. Add very restrained camera motion and light, preserving every flower and object edge without blooming/morphing effects. No hands, real names, faces, dates or claims that sentimental materials are being processed. Keep the whole object visible and identify a stable poster frame.
Use only the actual approved references attached to this request. No generated
speech, music, logo, watermark imitation, customer identity or factual production
claim. Return the native video file; product accuracy and continuity will be checked
before use. Do not substitute a still-image animation for a geometry-accurate model.
```

## 6. Four true-vector/code prompts

These are for a tool that can return actual SVG code or an SVG-authoring workflow. Review geometry and sanitize through the application’s approved vector pipeline; no script, remote content or unsanitized inline SVG. UI icons remain local reviewed components; editable large illustrations may use the approved media pipeline.

### SVG01 — Missing craft icon family
**Priority:** P1. **Placement:** Shared primitives / A16.  
**Output:** `rivya-icon-[NAME].svg`. **Target:** 24×24 viewBox; true vector paths.

```text
Author original SVG geometry for [FURNITURE / SEATING / RESIN_LAYER / WOOD_GRAIN / RULER / FLOWER_MEMORY / SMALL_GIFT] matching the currently installed icon stroke language. Use currentColor, a 24×24 viewBox, restrained 1.75–2 stroke width adjusted to the audited family, rounded joins and simple paths. It must read at 16, 20 and 24 CSS pixels. No embedded raster, scripts, event handlers, foreignObject, remote URLs, copied logo or fake scalable bitmap. Return valid SVG code plus an accessible label separately. Reuse existing icons for generic save/search/settings rather than redrawing every action.
Return the actual SVG source and a short intended-use/accessibility note. Do not
claim it is a copy of the supplied logo or an official third-party icon. Use a
small, readable path structure that can be inspected before being added to code.
```

### SVG02 — Furniture dimension schematic
**Priority:** P1. **Placement:** W12/W16 specifications and form help.  
**Output:** `rivya-dimension-[OBJECT].svg`. **Target:** Useful viewBox, lightweight vector.

```text
Author an original minimal SVG schematic of a [TABLE / CHAIR / CONSOLE / WALL_PANEL] showing width, depth and height arrows. Use the existing stroke style with optional CSS-controlled bronze accent. No numeric dimensions; UI text will supply verified values. Text labels should remain separate where possible. No external fonts, raster images, scripts or remote resources. Make the drawing clearly schematic, not a structural plan or safety certificate.
Return the actual SVG source and a short intended-use/accessibility note. Do not
claim it is a copy of the supplied logo or an official third-party icon. Use a
small, readable path structure that can be inspected before being added to code.
```

### SVG03 — Studio empty-state illustrations
**Priority:** P1. **Placement:** A08/A09/A19 empty/loading/error states.  
**Output:** `rivya-empty-[STATE].svg`. **Target:** Lightweight responsive vector.

```text
Author an original restrained SVG illustration for [NO_PRODUCTS / NO_MEDIA / NO_ENQUIRIES / NO_SEARCH_RESULTS / DEMO_REMOVED]. Use a simple furniture/material motif, clear negative space and the existing dark UI stroke system with at most one bronze accent. Leave actual status text and actions to HTML. No sad mascots, fake activity, external resources or executable code. Decorative SVG will be aria-hidden; it must not communicate essential state alone.
Return the actual SVG source and a short intended-use/accessibility note. Do not
claim it is a copy of the supplied logo or an official third-party icon. Use a
small, readable path structure that can be inspected before being added to code.
```

### SVG04 — Login and 404 decorative artwork
**Priority:** P2. **Placement:** A02/W29.  
**Output:** `rivya-system-[LOGIN_OR_404].svg`. **Target:** Lightweight responsive vector.

```text
Author an original abstract resin-flow or sculptural-furniture SVG motif for a dark RivyaLivingArt login/404 composition. Use forest-toned surfaces, minimal bronze hairlines and generous negative space, but do not redraw or invent the brand monogram. No lettering, logos, complex filters, embedded images, scripts or external loads. Keep all real text and navigation in HTML. Provide static geometry that remains clear without animation.
Return the actual SVG source and a short intended-use/accessibility note. Do not
claim it is a copy of the supplied logo or an official third-party icon. Use a
small, readable path structure that can be inspected before being added to code.
```

## 7. Online icons/vectors: Google discovery, original-source permission

Reuse the existing installed icon family first. Google may help find an original library/creator page; it is not proof of commercial reuse rights. Open the original asset/license, record version/creator/URL/notices and exclude personal-use-only or uncertain files. Preserve any required attribution. Do not hotlink Google thumbnails, remove watermarks, scrape competitor photos or download mixed full icon packs for a few symbols.

Previously reviewed candidate references are [Lucide](https://lucide.dev/license), [Google Material Symbols](https://developers.google.com/fonts/docs/material_symbols), and [Google's usage-rights guidance](https://support.google.com/websearch/answer/29508?hl=en). Recheck the exact selected asset/license during implementation. Their presence here does not approve an unidentified asset or require a second icon system.

## 8. High-volume catalogue and blog mapping

The demo requirement is 120 records, not necessarily 120 immediately generated full galleries. Use existing matching source concepts, a small number of selected polished hero/gallery examples and clearly labelled visual-pending fallbacks for unresolved samples. Final world-class presentation still requires resolving the important visible slots; do not hide incomplete mapping in the status report.

A 35-portrait source could cover at most 35 unique product heroes if every one were a genuine match. The actual useful count requires review; ten room scenes do not increase that upper bound. Do not claim enough distinct media for all 120 products until verified. Use the register’s candidate source IDs and create a row for every unresolved DP asset slot. Alternate angles/macros must preserve the same object; a different object is not a second gallery view.

For 36 blog covers, apply IMG20–IMG24 and relevant approved gallery material to the specific subject. Reuse is acceptable when editorially appropriate and documented; do not generate arbitrary unrelated covers to satisfy a counter. Keep sample testimonial avatars as initials/abstract shapes—no need for twenty-four fabricated customer portraits.

Request ledger schema:

```text
requestId | content/DP/DB IDs | exact route/component | slot | priority
sourceCandidates | actualSelectedSourceID | classification | rights/consent
promptVersion | outputFilename | desiredAspect/size | ownerReturnedDriveFileID
actualDimensions/duration/bytes | review | derivativeBlobID/localPath
poster/crop/fallback | approvedBy/at | remainingIssue
```

## 9. Completion and handoff

Check selected files, native dimensions, visible geometry, frame continuity, text-safe crop, correct product/story association, alt text, consent/rights, source provenance, demo/real classification and fallback. Import selected derivatives only. Preserve originals, rejected variants and source metadata privately as required; do not publish private Drive links, provider tokens or sensitive prompts.

Update canonical `docs/images.md`, the existing manifest and the next checkpoint with actual approved files and unresolved IDs. Return only the next meaningful batch to the owner, not a vague request for “more images.” Public pages serve approved Blob/local media and continue working without Drive access or a generation session.

**Nothing in this file has been generated, uploaded to Drive or published by preparing these prompts.** The existing logo board and source metadata are the evidence available; individual output approval occurs later.


## R8-2 asset checkpoint — 21 September 2026

Twelve source concepts are being authored; only DP001 and DP013 have inspected,
bundled image derivatives. Those small files remain preview-only. The earlier
original-file authorization/transfer blockers have not been bypassed or retried.
No new Drive originals or generated outputs were imported in this slice.

### Existing candidate sources: review before generating replacements

These are source-index candidates, **not approved mappings**. Each corresponding
UI currently displays “Demo concept — visual pending.” Return an accessible,
owner-approved source for pixel inspection before replacing that state.

| Concept | Candidate from the existing source index | State |
| --- | --- | --- |
| DP002 Stillwater Full-Pour Dining Table | PRODUCT-HERO-002 | Awaiting source review |
| DP014 Orbit Circular Centre Table | PRODUCT-HERO-004 | Awaiting source review |
| DP025 Twinleaf Matched Side-Table Pair | PRODUCT-HERO-008 | Awaiting source review |
| DP035 Span Narrow Console | PRODUCT-HERO-005 | Awaiting source review |
| DP048 Threshold Entry Bench | PRODUCT-HERO-009 | Awaiting source review |
| DP051 Single-Slab Atelier Desk | PRODUCT-HERO-007 | Awaiting source review |
| DP057 Horizon Band Wall Panel | PRODUCT-HERO-011 | Awaiting source review |
| DP069 Lattice Resin-and-3D Sculpture | PRODUCT-HERO-016 | Awaiting source review |

### IMG03-DP043 — Petal Sculptural Chair

**Priority:** P1; seating discovery, selected home study and DP043 detail.
**Classification:** fictional AI concept; no required existing product reference.
**Output:** `rivya-dp043-petal-chair-concept-4x5-v01.png`; target native 2048×2560.
**State:** awaiting owner output. **Fallback:** labelled visual-pending panel.
**Returned source ID:** none; no asset generated or mapped.

```text
Create an original, explicitly fictional concept visualization for RivyaLivingArt:
Petal Sculptural Chair, DP043. Show one sculptural chair with a gently cupped,
petal-inspired resin form and a restrained mineral-composite base. Present the complete object
in a clear three-quarter view against a quiet dark forest studio setting with
warm ivory side light. Keep generous margins around the back, seat and supports.
Emphasize silhouette, negative space and the contrast between translucent resin
and a quiet opaque mineral body. Use restrained material colour, coherent visible supports and a subtle
contact shadow. This is a design study, not a real manufactured chair or evidence
of strength, seating comfort or safety. Do not add people, logos, text, measurement
labels, extra furniture or neon glow. Do not copy another designer's recognizable
chair. Return a vertical 4:5 image at the highest native resolution available.
```

### IMG-DP077 — Estuary Reception Counter

**Priority:** P1; installation discovery and DP077 detail.
**Classification:** fictional AI concept; no required existing product reference.
**Output:** `rivya-dp077-estuary-counter-concept-4x5-v01.png`; target native 2048×2560.
**State:** awaiting owner output. **Fallback:** labelled visual-pending panel.
**Returned source ID:** none; no asset generated or mapped.

```text
Create an original, explicitly fictional concept visualization for RivyaLivingArt:
Estuary Reception Counter, DP077. Show one architectural reception-counter study
whose flowing translucent resin face meets a grounded mineral-composite body. Use a
quiet, unbranded interior with a dark forest backdrop and warm ivory light. Frame
the whole object in a three-quarter view with clear edges, generous margins and
believable visual scale. Keep the reception surface distinct from a domestic
dining table; suggest a solid front and a considered staff-side recess without
inventing technical construction details. This is an unbuilt design concept, not
a completed commercial project, accessibility certification or structural claim.
No people, client names, signage, logos, lettering, measurement labels or dramatic
neon effects. Return a vertical 4:5 image at the highest native resolution available.
```

Review every returned image against the corresponding concept before mapping.
Do not stretch a small derivative or reuse a different object's picture to fill
these slots. Additional angles, material macros, film and usable 3D models remain
unprovided; the current static media controls must not imply those assets exist.

## R8-3A asset checkpoint — 21 September 2026

This slice adds six memory-art and six personal-art source concepts. **All twelve
hero slots below remain visual pending.** Preparing this ledger has not generated,
downloaded, uploaded, approved or mapped any output. No Drive action was taken.
The two existing furniture derivatives cannot stand in for these different objects.

Each request covers the card hero at the collection route shown and the gallery at
the exact detail route. W08 `MemoryProductCard` and W09 `PersonalArtProductCard` are
exported from `src/components/concept-card.tsx`; their collection owners are
`MemoryCollection` and `PersonalArtCollection` in `src/components/art-collections.tsx`.
Every requested output is a **fictional AI concept visualization**, not a real
commission, customer keepsake or proof of available stock. All slots currently use
the shared “Demo concept — visual pending” fallback. Owner-returned file IDs,
selected source IDs, actual dimensions/bytes, rights review, approval and derivative
paths are **none / not yet verified** for every row.

The three `PRODUCT-HERO` references are name-based candidates from the existing
source index, not approved images. Inspect an owner-authorized source before
deciding whether a replacement is necessary. Rows marked `NEEDS_PROMPT` only map an
existing template; their variables still need a product-specific review before use.
Only the next two filled prompts below are ready for owner generation.

| Request / concept | Collection card / exact detail route | Existing candidate or template | Priority / state | Output filename |
| --- | --- | --- | --- | --- |
| R83A-DP085-HERO — Vow Framed Varmala Keepsake | `/memory-art` · `/pieces/vow-framed-varmala-keepsake` | `PRODUCT-HERO-020`; inspect first; IMG13 if unsuitable | P1 · awaiting source review | `rivya-dp085-vow-keepsake-concept-4x5-v01.png` |
| R83A-DP091-HERO — Hourglass Floral Wall Clock | `/memory-art` · `/pieces/hourglass-floral-wall-clock` | IMG12-DP091, filled below | P1 · AWAITING_OWNER_OUTPUT | `rivya-dp091-hourglass-clock-concept-4x5-v01.png` |
| R83A-DP095-HERO — Union Engagement Tray | `/memory-art` · `/pieces/union-engagement-tray` | IMG14; one tray, blank personalization area | P1 · NEEDS_PROMPT | `rivya-dp095-union-tray-concept-4x5-v01.png` |
| R83A-DP099-HERO — Letterlight Invitation Frame | `/memory-art` · `/pieces/letterlight-invitation-frame` | IMG16 adapted to a frame with a blank, non-identifying paper insert | P2 · NEEDS_PROMPT | `rivya-dp099-letterlight-frame-concept-4x5-v01.png` |
| R83A-DP103-HERO — Threshold Family Nameplate | `/memory-art` · `/pieces/threshold-family-nameplate` | IMG15; standalone plate with no names, numbers or address | P1 · NEEDS_PROMPT | `rivya-dp103-threshold-nameplate-concept-4x5-v01.png` |
| R83A-DP107-HERO — First Chapter Baby Keepsake | `/memory-art` · `/pieces/first-chapter-baby-keepsake` | IMG16; abstract/botanical contents without personal records | P2 · NEEDS_PROMPT | `rivya-dp107-first-chapter-keepsake-concept-4x5-v01.png` |
| R83A-DP109-HERO — Botanical Resin Pendant | `/personal-art` · `/pieces/botanical-resin-pendant` | IMG17-DP109, filled below | P1 · AWAITING_OWNER_OUTPUT | `rivya-dp109-botanical-pendant-concept-4x5-v01.png` |
| R83A-DP111-HERO — Thread of Light Resin Rakhi | `/personal-art` · `/pieces/thread-of-light-resin-rakhi` | IMG18; one rakhi, no person or festival-year text | P1 · NEEDS_PROMPT | `rivya-dp111-thread-of-light-rakhi-concept-4x5-v01.png` |
| R83A-DP112-HERO — Initial Story Keychain | `/personal-art` · `/pieces/initial-story-keychain` | IMG19 adapted to one keychain in portrait; lettering area blank | P2 · NEEDS_PROMPT | `rivya-dp112-initial-story-keychain-concept-4x5-v01.png` |
| R83A-DP113-HERO — Chaptermark Flower Bookmark | `/personal-art` · `/pieces/chaptermark-flower-bookmark` | IMG19 adapted to one bookmark in portrait; no readable book text | P2 · NEEDS_PROMPT | `rivya-dp113-chaptermark-bookmark-concept-4x5-v01.png` |
| R83A-DP114-HERO — Everyday Resin Coaster Set | `/personal-art` · `/pieces/everyday-resin-coaster-set` | `PRODUCT-HERO-029`; inspect first; IMG19 single-set portrait adaptation if unsuitable | P2 · awaiting source review | `rivya-dp114-everyday-coaster-set-concept-4x5-v01.png` |
| R83A-DP120-HERO — Little Archive Keepsake Box | `/personal-art` · `/pieces/little-archive-keepsake-box` | `PRODUCT-HERO-035`; inspect first; IMG19 single-box portrait adaptation if unsuitable | P2 · awaiting source review | `rivya-dp120-little-archive-box-concept-4x5-v01.png` |

**Composition/native target for every requested hero:** 4:5, ideally 2048×2560
native pixels, with the entire object and comfortable crop margins visible. This
is a target for new output, not a claim about the existing source candidates.
Record the actual native size on return; never upscale a small source and report
the target as its original resolution. Preserve identity when reviewing a source
candidate; do not recolour it to match the UI. Additional gallery angles, macros
and video are not requested or implied by this single-hero ledger.

### IMG12-DP091 — Hourglass Floral Wall Clock

**Request:** R83A-DP091-HERO · prompt version 1 · P1.

**Placement:** `/memory-art` / `MemoryProductCard`; `/pieces/hourglass-floral-wall-clock`
/ shared `ProductGallery`.

**Fixture direction:** circular resin-and-metal clock study, uneven floral ring,
open centre and clearly separated hands. Sample diameters are 300 or 400 mm, with
40 or 45 mm depth; these are concept proportions, not verified manufacturing dimensions.

**Required reference:** none; create an original fictional design. No customer
flowers, photographs or documents are requested.

**Output:** `rivya-dp091-hourglass-clock-concept-4x5-v01.png`; portrait 4:5,
target native 2048×2560. **Classification:** fictional AI concept visualization.

**State:** AWAITING_OWNER_OUTPUT; returned source ID none; no output generated or
mapped. **Fallback:** “Demo concept — visual pending”; no film/poster requested.

```text
Create an original, explicitly fictional concept visualization for RivyaLivingArt:
Hourglass Floral Wall Clock, DP091. Despite its name, this is a circular wall-clock
design, not a sand timer. Compose an uneven ring of small botanical forms within a
restrained resin disc, leaving a calm open centre around clearly legible metal hands.
Let the floral ring feel considered but not perfectly symmetrical. Keep the outline,
hands and resin depth visibly separate, with enough quiet space to read the whole
object at card size. Use a near-frontal view with a slight angle that reveals depth,
on an anonymous warm-neutral wall against a forest-dark surrounding composition.
Soft ivory side light should reveal translucent depth without neon glow, exaggerated
sparkle or a glass-like mirror hiding the flowers. The object should suggest a wall
clock of approximately 300–400 mm diameter, never a miniature or oversized room clock.
Show the complete perimeter and comfortable crop margins. Use no real names, dates,
dedications, clock-face lettering, customer materials, people, logos or measurements.
Do not display invented mounting hardware, a mechanism specification, documentary
preservation work or proof of colour retention. This is an unbuilt concept, not an
available product or a processed sentimental object. Return one clean vertical 4:5
image at the highest native resolution available; do not upscale to claim detail.
```

### IMG17-DP109 — Botanical Resin Pendant

**Request:** R83A-DP109-HERO · prompt version 1 · P1.

**Placement:** `/personal-art` / `PersonalArtProductCard`;
`/pieces/botanical-resin-pendant` / shared `ProductGallery`.

**Fixture direction:** a simple resin outline around one botanical accent, with
restrained metal fitting direction. The sample body is 24×7×34 mm (width/depth/height).
This first request depicts the **clear botanical direction only**. The rose direction
has no image; one output does not verify both variants or permit automatic recolouring.

**Required reference:** none; create an original fictional design.

**Output:** `rivya-dp109-botanical-pendant-concept-4x5-v01.png`; portrait 4:5,
target native 2048×2560. **Classification:** fictional AI concept visualization.

**State:** AWAITING_OWNER_OUTPUT; returned source ID none; no output generated or
mapped. **Fallback:** “Demo concept — visual pending”; no film/poster requested.

```text
Create an original, explicitly fictional concept visualization for RivyaLivingArt:
Botanical Resin Pendant, DP109. Show one small clear-resin pendant with a simple,
restrained outline holding a single delicate botanical accent. Keep the botanical
form legible without filling the entire resin body. Use a modest metal fitting as
a visual direction only, with no hallmark, material-grade label or promise about
the eventual fastening. Present the pendant alone in a clean, slightly angled
still life on a warm ivory mineral surface with a quiet forest-dark background.
Its body should read as an intimate object, roughly 24 mm wide and 34 mm high with
restrained depth, not as a large sculpture. Show the entire outline and fitting
with generous crop margins and soft side light that reveals the botanical detail.
Choose the clear visual direction only; do not add a second rose-tinted pendant,
comparison panel or a chain of an invented length. Leave personalization blank.
No person, skin, hands, names, initials, logos, price tags, measurements, excessive
sparkles or purported customer context. Do not imply manufactured stock, verified
allergy suitability, skin-contact properties or durable performance. Return one
clean vertical 4:5 image at the highest native resolution available. This is a
fictional design study; it must not be described as a product photograph.
```

On return, review each output against its exact fixture and route before approving
alt text, crops and modest delivery derivatives. Record any visible design
difference instead of silently changing the fixture or treating a generated image
as proof of construction. Source review, rights confirmation and mapping remain
outstanding for all twelve slots in this checkpoint.

## R8-3C — journal editorial imagery, first six drafts

**Checkpoint: 21 September 2026.** DB001–DB006 are now authored source drafts;
the following imagery remains **AWAITING_OWNER_OUTPUT / NOT APPROVED**. The journal
currently uses original CSS editorial cover shapes, labelled as image-pending,
rather than pretending these photographs exist. No image was generated, downloaded
or added in this slice. The three portfolio studies reuse Riverline/Basin only as
labelled object concepts; they are not installation photographs. The memory study
keeps its existing Vow visual-pending state and existing product-image brief.

All six journal requests: one original fictional editorial visualization, **3:2**,
target native **2400×1600** or the highest available native resolution. Leave
comfortable crop margins; keep the subject readable at card scale. Use forest-dark,
warm ivory and restrained bronze surroundings with soft directional light. No
logos, readable text, measurements, people, private homes, client documents,
brand imitation, documentary workshop claims or fabrication/performance claims.
Do not depict a named catalogue product without its approved reference or silently
change that product's shape or colour. These are editorial illustrations only.
Record actual returned dimensions, generation source and rights before approval.

### JOURNAL-DB001 — A Room Begins with a Statement Table

**Output:** `rivya-journal-db001-statement-table-3x2-v01.png`  
**Placement:** DB001 journal cover/card; editorial illustration, not a project image.

```text
Create an original fictional interior study centred on one anonymous sculptural
dining table. Show the relationship between a long table silhouette, a calm wall,
daylight and generous visible floor space. The table should feel like a visual
anchor without filling the room. Use a restrained wood-and-resin material direction,
with no claim that it matches an available product. Keep circulation visually open,
without measurement marks or a promised seating count. Compose at eye level with
the whole object visible and quiet negative space around it. Follow the shared
R8-3C journal constraints. Return one 3:2 image; this is an imagined design study.
```

### JOURNAL-DB002 — Reading the Grain

**Output:** `rivya-journal-db002-grain-composition-3x2-v01.png`  
**Placement:** DB002 journal cover/card; material art-direction study.

```text
Create an original fictional editorial close view of a wood-grain rhythm beside
a restrained translucent resin field. Show two visual languages meeting along a
considered edge: irregular natural lines and a quieter area of depth. Soft raking
light should reveal composition without wet-look glare. Leave enough context to
read this as a visual material study, not a microscopy image or a verified product
sample. No tools, hands, labels, performance symbols or documentary workshop setting.
Follow the shared R8-3C journal constraints. Return one clean horizontal 3:2 image.
```

### JOURNAL-DB003 — A Dining-Table Planning Notebook

**Output:** `rivya-journal-db003-table-shapes-3x2-v01.png`  
**Placement:** DB003 journal cover/card; conceptual composition, not a scale drawing.

```text
Create an original editorial still life of three simple table-form maquettes:
one round, one oval and one rectangular, arranged on an unmarked warm ivory surface.
Use a consistent neutral material so the outlines are the subject. Photograph the
imagined objects from an elevated oblique viewpoint with soft shadows and restrained
forest-dark surroundings. Preserve clear separation between forms. No room plan,
dimensions, chairs, seating claims or readable notebook text. These are fictional
composition models, not buildable designs. Follow the shared R8-3C constraints and
return one horizontal 3:2 illustration.
```

### JOURNAL-DB004 — Coffee Tables as Sculptural Objects

**Output:** `rivya-journal-db004-low-table-silhouette-3x2-v01.png`  
**Placement:** DB004 journal cover/card; anonymous furniture concept.

```text
Create an original fictional low-table study that emphasizes silhouette and the
negative space beneath and around the top. Use an anonymous softly curved form,
a restrained dark material direction and a lightly suggested seating edge in the
background for composition only. Show the full table without cropping its base.
Use quiet side light and a low viewpoint; avoid ornate decoration, lifestyle props
or a claim that the scene is a completed interior. No exact catalogue-product copy.
Follow the shared R8-3C journal constraints. Return a single horizontal 3:2 image.
```

### JOURNAL-DB005 — The Quiet Role of a Side Table

**Output:** `rivya-journal-db005-side-table-3x2-v01.png`  
**Placement:** DB005 journal cover/card; fictional reading-corner study.

```text
Create an original fictional composition of a modest side table beside the edge
of an anonymous reading chair. A closed unlabelled book may suggest a role without
crowding the scene. Emphasize the table's outline, the relationship of surfaces and
the empty space between the two objects. Use warm neutral surroundings, a forest
shadow and a restrained material accent. No person, visible private home, real
client story, comfort guarantee or product-identifying design copied from elsewhere.
Follow the shared R8-3C constraints and return one horizontal 3:2 illustration.
```

### JOURNAL-DB006 — An Entryway Built Around One Console

**Output:** `rivya-journal-db006-console-arrival-3x2-v01.png`  
**Placement:** DB006 journal cover/card; fictional threshold composition.

```text
Create an original fictional entryway study with one slender anonymous console
against a calm wall and an open passage visible beside it. Let horizontal rhythm,
quiet shadow and a single unbranded sculptural object establish the composition.
Avoid mirrors that reveal people or an identifiable home. The console should be
fully visible with an understated wood/resin visual direction; do not reproduce a
named catalogue object without an approved reference. No installation or mounting
hardware claims, measurements or completed-project framing. Follow the shared
R8-3C journal constraints and return one horizontal 3:2 editorial illustration.
```

Do not map returned artwork to product galleries. Review these as editorial assets,
retain a visible concept label, and record any crop/derivative decisions after the
owner returns the source. Portfolio installation photography, artist/studio portraits
and documentary fabrication media still require genuine owner-approved sources.

## R8-3D — next six journal cover briefs (21 September 2026)

These owner-generation requests cover the newly authored DB007–DB012 drafts.
No image has been generated, downloaded or approved by adding this section. The
website retains labelled pending covers. Use approved Drive assets first if a
relevant source is actually available; these briefs do not establish such a source.

**Shared output:** one horizontal 3:2 image per brief, target 2400×1600 or larger,
with a clear central composition that tolerates a restrained card crop. Record
actual dimensions, source, rights, approval and derivative decisions before use.
Use forest shadows, warm ivory and restrained bronze accents. Do not bake in text,
logos, product identifiers, watermarks or approval/certification symbols. Do not
include identifiable people, private rooms, real project documents or customer data.

**Classification:** original fictional editorial illustration, visibly labelled as
a concept. These are not completed RivyaLivingArt interiors, real commissions,
verified material samples or technical instructions. Do not recolour or alter an
approved catalogue product to fit an article. Unreferenced objects remain anonymous
concepts and must not be mapped into product galleries.

### JOURNAL-DB007 — Pairing Resin Art with Warm Neutral Interiors

**Output:** `rivya-journal-db007-warm-neutral-interior-3x2-v01.png`
**Placement:** DB007 journal cover/card; fictional colour-relationship study.

```text
Create an original fictional interior composition exploring a warm neutral room
and one anonymous wood-and-resin furniture form. Use a quiet warm ivory wall,
oatmeal textile, understated timber tones and one restrained translucent accent.
Give texture, shadow and negative space room to distinguish the surfaces without
making every object match. Keep the full furniture silhouette visible. This is a
palette illustration, not a completed client room or a promise of available finishes.
No paint labels, colour codes, people, logos or copied catalogue design. Follow the
shared R8-3D constraints and return one horizontal 3:2 editorial concept image.
```

### JOURNAL-DB008 — A Guide to Describing Your Commission

**Output:** `rivya-journal-db008-commission-notebook-3x2-v01.png`
**Placement:** DB008 journal cover/card; fictional planning still life.

```text
Create an original editorial still life about preparing a clear furniture brief.
Arrange blank ivory paper, a small anonymous sculptural furniture maquette, a
pencil and a few generic material fragments on a forest-dark surface. A simple
unlabelled outline on one page may suggest scale without showing measurements,
an actual floor plan or buildable technical details. Emphasize clarity and a small
number of thoughtful references, with soft side light and generous space. No
client names, signatures, quotation, approval stamp or accepted-order claim.
Follow the shared R8-3D constraints; return one horizontal 3:2 concept illustration.
```

### JOURNAL-DB009 — What to Include in an Architect’s Enquiry

**Output:** `rivya-journal-db009-architect-enquiry-3x2-v01.png`
**Placement:** DB009 journal cover/card; fictional project-communication study.

```text
Create an original fictional editorial composition of simple architectural volumes,
an anonymous console maquette and several blank paper sheets, viewed at a calm
oblique angle. Arrange the elements so that project context, object proportion and
open questions are suggested through spacing, rather than a dense technical desk.
Use warm ivory paper, dark timber-like tones and subtle bronze drawing tools. No
real drawings, title blocks, dimension text, addresses or engineering details. Do
not imply a site visit, architectural accreditation or a service delivered by the
studio. Follow the shared R8-3D constraints and return one horizontal 3:2 image.
```

### JOURNAL-DB010 — Wall Art at Architectural Scale

**Output:** `rivya-journal-db010-wall-art-rhythm-3x2-v01.png`
**Placement:** DB010 journal cover/card; fictional panel-composition study.

```text
Create an original fictional gallery-wall composition using three abstract panels
with restrained flowing wood-and-resin-inspired visual rhythms. Show the intervals
between the panels, a quiet surrounding wall and enough floor to suggest viewing
distance. Keep the focus on the relationship of the three forms and their negative
space, with soft light and an unoccupied setting. These are imagined compositions,
not manufactured or installed products. No visible mounting-system recipe,
structural details, dimensions, safety symbols or real project attribution. Follow
the shared R8-3D constraints and return a single horizontal 3:2 editorial image.
```

### JOURNAL-DB011 — From a Mood Board to a Material Conversation

**Output:** `rivya-journal-db011-material-mood-board-3x2-v01.png`
**Placement:** DB011 journal cover/card; fictional reference-composition study.

```text
Create an original top-down editorial arrangement of anonymous visual references:
small abstract colour fields, a grain-like texture fragment, a translucent generic
form and blank note cards. Give each item separate breathing room so the whole
composition suggests a conversation about relationships, not a finished material
specification. Use a warm ivory ground with forest and quiet bronze accents. No
copied photographs, supplier marks, readable notes, approval ticks or before/after
comparison interface. These are illustrative references, not actual approved finish
samples. Follow the shared R8-3D constraints and return one horizontal 3:2 image.
```

### JOURNAL-DB012 — Light, Transparency and the Look of Resin

**Output:** `rivya-journal-db012-light-transparency-3x2-v01.png`
**Placement:** DB012 journal cover/card; fictional visual-perception study.

```text
Create an original editorial close composition of one anonymous translucent
sculptural form against a softly divided warm-light and forest-shadow background.
Let the viewpoint, reflected light and visible edge suggest an impression of depth.
Use restrained highlights rather than extreme gloss or a laboratory presentation.
Show a visual question about appearance, not a physical experiment or an actual
resin formulation. No transmittance scales, UV symbols, performance certificates,
durability claims, text or identifiable product design. Follow the shared R8-3D
constraints and return one horizontal 3:2 fictional concept illustration.
```

Retain the editorial-concept label after approval. Image appearance cannot establish
resin chemistry, UV resistance, durability, manufacturing feasibility or a physical
colour match. Genuine portfolio, workshop and people imagery still requires the
owner's authentic approved source material.

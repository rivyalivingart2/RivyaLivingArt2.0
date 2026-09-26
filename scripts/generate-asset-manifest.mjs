import fs from 'node:fs';
import {suppliedProductMedia} from '../src/lib/supplied-media.ts';

const rows = [
  'Slot,File,AspectRatio,Classification,Dimensions,Bytes,AssociatedID,Role'
];

rows.push('Hero Desktop Landscape,/media/product-scene-001-16x9.webp,16:9,AI_SCENE,1920x1080,284552,HERO-01,Primary Homepage Hero Scene');
rows.push('Hero Mobile Portrait,/media/product-hero-001-4x5.webp,4:5,AI_CONCEPT,2048x2560,170072,HERO-01,Primary Homepage Mobile Hero');
rows.push('Doorway 01 Collectible,/media/product-hero-001-4x5.webp,4:5,AI_CONCEPT,2048x2560,170072,COL-01,Furniture & Spatial Art Card');
rows.push('Doorway 02 Memory,/media/product-hero-020-4x5.webp,4:5,AI_CONCEPT,2048x2560,197232,COL-02,Botanical & Memory Art Card');
rows.push('Doorway 03 Gifts,/media/product-hero-029-4x5.webp,4:5,AI_CONCEPT,2048x2560,225128,COL-03,Personal Art & Gifts Card');
rows.push('Material Editorial Macro,/media/product-hero-026-4x5.webp,4:5,AI_CONCEPT,2048x2560,245526,MAT-01,Material Craft Feature');
rows.push('Process Scene 01,/media/product-scene-003-16x9.webp,16:9,AI_SCENE,1920x1080,231328,PROC-01,Atelier Workshop Landscape');
rows.push('Process Scene 02,/media/product-scene-005-16x9.webp,16:9,AI_SCENE,1920x1080,205688,PROC-02,Casting & Curing Landscape');
rows.push('Original Concept Basin,/media/concepts/basin.avif,4:5,ORIGINAL_AVIF,560x700,7007,ORIG-01,Original Basin Concept');
rows.push('Original Concept Riverline,/media/concepts/riverline.avif,4:5,ORIGINAL_AVIF,560x700,7732,ORIG-02,Original Riverline Concept');

for (const [id, m] of Object.entries(suppliedProductMedia)) {
  if (m.primary) {
    rows.push(`Catalogue Primary,${m.primary.src},4:5,AI_CONCEPT,${m.primary.width}x${m.primary.height},${m.primary.bytes},${id},Product Primary Visual`);
  }
  if (m.detail) {
    rows.push(`Catalogue Detail,${m.detail.src},4:5,AI_CONCEPT,${m.detail.width}x${m.detail.height},${m.detail.bytes},${id},Product Secondary Detail`);
  }
}

fs.writeFileSync('docs/redesign/asset-manifest.csv', rows.join('\n'));
console.log('Total asset entries in CSV:', rows.length - 1);

/** Additive media, verified byte-for-byte against the owner's Drive copies.
 * Existing catalogue/media associations are not reassigned by presentation choices. */
export const materialFilm={
 id:'resin-pour' as const,
 title:'Resin in motion',
 description:'A material visualization of deep blue resin and gold-toned pigment.',
 classification:'material-visualization' as const,
 poster:{path:'/media/migration/hero-pour-loop-poster.jpg',driveId:'11iY9mANJFy4EZf54HgZ5NJ_g4AzDBLBX',sha256:'e7dec2a8d6972a0825caf57aae320db7b1a0c319eb2f7a3d5581ba9190040caf',bytes:98481},
 sources:[
  {path:'/media/migration/hero-pour-loop.webm',type:'video/webm',driveId:'1xau1Vdp2i2QsD77eFvc7duYfDzrOBWL4',sha256:'ba77d14e1d380f382bbc86af1c5e8533ad3e8a0ad2bb604d06506b3da5b216c8',bytes:1649274},
  {path:'/media/migration/hero-pour-loop.mp4',type:'video/mp4',driveId:'1HVHyYusnysi_7aduW6xwFJHrwUlWGzIz',sha256:'61d4633578353e813e64506877eed198bc682b6424701b7783720af51530869d',bytes:2135160},
 ],
 provenance:'Owner-supplied OLDWEBSITE assets; Drive bytes verified 2026-10-09. MP4 web derivative copied to Drive; originals retained. Presented as a material visualization, not evidence of a particular project or making stage.',
};
export type PresentationFilm=typeof materialFilm;
export const isMaterialFilm=(id:unknown)=>id==='resin-pour';
const canonical=(value:unknown)=>JSON.stringify(value,(_key,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
export const validSavedFilm=(value:unknown):value is PresentationFilm=>canonical(value)===canonical(materialFilm);

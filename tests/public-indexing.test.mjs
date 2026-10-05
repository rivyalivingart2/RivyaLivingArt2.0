import assert from 'node:assert/strict';
import {test} from 'node:test';
import {isIndexablePublicPath,publishedShareImage} from '../src/lib/public-indexing.ts';

test('sitemap permits editorial pages and excludes private and task destinations',()=>{
 for(const path of ['/','/collectible-design','/commission','/journal/story','/p/exhibition','/pieces/river-channel','/imprint'])assert.equal(isIndexablePublicPath(path),true,path);
 for(const path of ['/search','/search?q=wood','/studio/site-copy','/api/studio/content','/inquiry/123','/preview/states','/saved-pieces','/commission/customize','/pieces/river-channel/customize','/personalize','/preserve','//example.com','/contact#email'])assert.equal(isIndexablePublicPath(path),false,path);
});

test('social metadata follows the approved hero and falls back when it is withdrawn',()=>{
 const hero={path:'/editorial/approved',alt:'Blue and gold material'};
 const doc={title:'Home',homepage:{heroImage:hero,heroProductId:'DP001'},homeSnapshot:{mediaPaths:[hero.path],products:[{id:'DP001',image:'/media/table.webp',imageAlt:'Table'}]}};
 assert.deepEqual(publishedShareImage(doc),{path:hero.path,alt:hero.alt});
 doc.homeSnapshot.mediaPaths=[];
 assert.deepEqual(publishedShareImage(doc),{path:'/media/table.webp',alt:'Table'});
 doc.homeSnapshot.products=[];
 assert.equal(publishedShareImage(doc),null);
 assert.deepEqual(publishedShareImage({title:'Story',image:'/media/story.webp',imageAlt:'Timber'}),{path:'/media/story.webp',alt:'Timber'});
});

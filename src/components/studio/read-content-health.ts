import {contentHealthReport} from '@/lib/content-health-report';
import {studioFetch} from './workspace-api';
export async function readContentHealth(){
 const [c,p,m,context,e]=await Promise.all([studioFetch('/api/studio/content'),studioFetch('/api/studio/workspace?view=catalogue'),studioFetch('/api/studio/media'),studioFetch('/api/studio/health-context'),studioFetch('/api/studio/editorial-assets')]);
 if(!Array.isArray(c.entries)||!Array.isArray(p.products)||!Array.isArray(m.media)||!Array.isArray(e.media)||!context.settings||!context.owners)throw new Error('The check returned incomplete records. Retry all checks.');
 return contentHealthReport(c.entries,p.products,[...m.media,...e.media],context);
}

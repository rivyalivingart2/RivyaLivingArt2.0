import 'server-only';
import {neon} from '@neondatabase/serverless';

export function studioDb() {
  const url = process.env.DATABASE_URL;
  if (!url || !/^postgres(?:ql)?:\/\//.test(url)) throw new Error('Studio storage is not configured');
  return neon(url);
}

import {isIP} from 'node:net';
import {hostingPlatform, type HostingEnvironment} from './hosting-environment';

/** Trust only the selected hosting platform's connection header, not generic XFF. */
export function clientAddress(headers: Pick<Headers, 'get'>, env: HostingEnvironment): string {
  const platform = hostingPlatform(env);
  if (platform === 'local') return 'local';
  const candidate = platform === 'netlify'
    ? headers.get('x-nf-client-connection-ip')?.trim()
    : platform === 'vercel'
      ? headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
      : undefined;
  // Missing/malformed metadata shares a conservative bucket instead of
  // creating attacker-selected keys from arbitrary header values.
  return candidate && isIP(candidate) ? candidate : 'unknown';
}

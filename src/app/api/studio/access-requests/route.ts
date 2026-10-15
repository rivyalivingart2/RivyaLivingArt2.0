import {studioSession} from '@/lib/studio-auth';
import {decideAccessRequest, listAccessRequests} from '@/lib/studio-access';
import {clientRateKey, limited, originAllowed, smallJson} from '@/lib/request-security';
export const dynamic = 'force-dynamic';
const json = (data: unknown, status=200) => Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET() {
  try {
    const session = await studioSession();
    if (!session) return json({error:'Sign in to continue.'},401);
    if (session.role !== 'admin') return json({error:'Administrator access required.'},403);
    return json({requests:await listAccessRequests()});
  } catch {return json({error:'Access requests are unavailable. Ask the owner to check the access-request database setup.'},503);}
}
export async function POST(request: Request) {
  if (!originAllowed(request)) return json({error:'Request not allowed.'},403);
  try {
    const session = await studioSession();
    if (!session) return json({error:'Sign in to continue.'},401);
    if (session.role !== 'admin') return json({error:'Administrator access required.'},403);
    if (!await limited(await clientRateKey('access-decision'),30,15)) return json({error:'Too many attempts. Try again later.'},429);
    const body = await smallJson(request,2048);
    if (!body || !/^[0-9a-f-]{36}$/i.test(body.id) || !Number.isSafeInteger(body.version) || body.version<1 || !['approve','reject'].includes(body.operation)) return json({error:'Choose a current request.'},400);
    if (body.operation==='approve' && body.verified!==true) return json({error:'Verify the person through a trusted channel before approving.'},400);
    const result = await decideAccessRequest(session,body.id,body.version,body.operation);
    return result ? json(result) : json({error:'This request changed, the login is already reserved, or the account is not eligible. Refresh and check Staff access. Owner credentials remain managed in hosting settings.'},409);
  } catch {return json({error:'The decision could not be confirmed. Refresh the request list before trying again.'},503);}
}

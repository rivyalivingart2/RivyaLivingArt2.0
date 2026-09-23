import {NextRequest,NextResponse} from 'next/server';
import {sessionCookie,studioSessionFromToken} from '@/lib/studio-auth';
/** Free-host Preview guard. Cookie presence alone never grants access. */
export async function proxy(request:NextRequest){
 if(!process.env.NETLIFY||process.env.CONTEXT==='production')return NextResponse.next();
 const path=request.nextUrl.pathname;
 if(path==='/studio/login')return NextResponse.next();
 try{if(await studioSessionFromToken(request.cookies.get(sessionCookie)?.value))return NextResponse.next();}catch{ /* Fail closed without exposing service details. */ }
 if(path.startsWith('/api/'))return NextResponse.json({error:'Sign in to Studio to access this private Preview.'},{status:401,headers:{'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow'}});
 return NextResponse.redirect(new URL('/studio/login',request.url));
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico|brand/|media/|fonts/).*)']};

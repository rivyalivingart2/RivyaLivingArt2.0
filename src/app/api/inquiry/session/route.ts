import {guestIdentity,originAllowed,limited,clientRateKey} from '@/lib/request-security';
export async function POST(request:Request){
 if(!originAllowed(request))return Response.json({error:'Request not allowed'},{status:403});
 try{if(!await limited(await clientRateKey('start'),40))return Response.json({error:'Please try again later.'},{status:429});await guestIdentity(true);return Response.json({ready:true},{headers:{'Cache-Control':'no-store'}});}
 catch{return Response.json({error:'The order form is temporarily unavailable. Please try again shortly.'},{status:503});}
}

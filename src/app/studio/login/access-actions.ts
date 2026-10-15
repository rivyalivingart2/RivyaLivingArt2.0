'use server';
import {clientRateKey, limited, privateHash} from '@/lib/request-security';
import {requestStudioAccess, redeemAccessLink} from '@/lib/studio-access';
import {accessAcknowledgement, parseAccessInput, validAccessPassword, validAccessToken} from '@/lib/studio-access-validation';
import {studioConfigured} from '@/lib/studio-auth';
export type AccessState = {error:string;message:string};
export async function submitAccessRequest(_state:AccessState, form:FormData):Promise<AccessState> {
  const input = parseAccessInput(Object.fromEntries(form));
  if (!input) return {error:'Enter your name, a Staff ID of 3–80 letters, numbers or . _ @ -, and a contact detail.',message:''};
  if (form.get('consent')!=='on') return {error:'Confirm that an administrator may use these details to review your request.',message:''};
  try {
    if (!studioConfigured()) throw new Error('Unavailable');
    if (!await limited(await clientRateKey('access-request'),8,60) || !await limited('access-request-id:'+privateHash(input.login.toLowerCase()),3,60)) return {error:'Too many requests. Please wait an hour or contact your administrator.',message:''};
    await requestStudioAccess(input);
    return {error:'',message:accessAcknowledgement};
  } catch {return {error:'Requests are temporarily unavailable. Please contact your administrator through your usual channel.',message:''};}
}
export async function setAccessPassword(_state:AccessState, form:FormData):Promise<AccessState> {
  const token=form.get('token'), password=form.get('password');
  if (!validAccessToken(token)) return {error:'This link is invalid. Ask your administrator for a new link.',message:''};
  if (!validAccessPassword(password) || password!==form.get('confirm')) return {error:'Use 16–200 characters and enter the same password in both fields.',message:''};
  try {
    if (!await limited(await clientRateKey('access-redeem'),15,15) || !await limited('access-token:'+privateHash(token),8,15)) return {error:'Too many attempts. Wait 15 minutes before trying again.',message:''};
    if (!await redeemAccessLink(token,password)) return {error:'This link has expired, was already used, or access changed. Ask your administrator for a new link.',message:''};
    return {error:'',message:'Your password is saved. Sign in with your Staff ID and new password. Previous sessions have been signed out.'};
  } catch {return {error:'The password change could not be confirmed. Try signing in first; if needed, ask your administrator for a new link.',message:''};}
}

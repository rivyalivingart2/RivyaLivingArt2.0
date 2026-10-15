export type AccessKind = 'access' | 'recovery';
export type AccessInput = {kind: AccessKind; login: string; name: string; contact: string};
export const accessAcknowledgement = 'Your request has been received. Contact your administrator through your usual trusted channel. If the request is eligible, they will verify your identity and share a one-time link. No email is sent automatically.';
export function parseAccessInput(value: unknown): AccessInput | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (v.kind !== 'access' && v.kind !== 'recovery') return null;
  if (typeof v.login !== 'string' || !/^[a-zA-Z0-9_.@-]{3,80}$/.test(v.login.trim())) return null;
  if (typeof v.name !== 'string' || !v.name.trim() || v.name.trim().length > 100) return null;
  if (typeof v.contact !== 'string' || v.contact.trim().length < 3 || v.contact.trim().length > 160) return null;
  if (/[\r\n\x00-\x1f]/.test(v.name + v.contact)) return null;
  return {kind: v.kind, login: v.login.trim(), name: v.name.trim(), contact: v.contact.trim()};
}
export const validAccessToken = (value: unknown): value is string => typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(value);
export const validAccessPassword = (value: unknown): value is string => typeof value === 'string' && value.length >= 16 && value.length <= 200;

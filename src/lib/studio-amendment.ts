/** Append-only operational instructions live in the existing private notes ledger.
 * The reserved envelope distinguishes them from free text without rewriting the brief.
 */
export const amendmentPrefix = 'RIVYA_OPERATIONAL_AMENDMENT_V1:';
export type OperationalAmendment = {requestId:string;reason:string;instructions:string;orderVersion:number};
export function readAmendment(body:string):OperationalAmendment|null {
  if (!body.startsWith(amendmentPrefix)) return null;
  try {
    const v=JSON.parse(body.slice(amendmentPrefix.length));
    if (!v || typeof v.requestId!=='string' || !/^[0-9a-f-]{36}$/i.test(v.requestId) ||
      typeof v.reason!=='string' || !v.reason.trim() || v.reason.length>300 ||
      typeof v.instructions!=='string' || !v.instructions.trim() || v.instructions.length>1200 ||
      !Number.isSafeInteger(v.orderVersion) || v.orderVersion<2) return null;
    return {requestId:v.requestId,reason:v.reason,instructions:v.instructions,orderVersion:v.orderVersion};
  } catch { return null; }
}
export function writeAmendment(value:OperationalAmendment) { return amendmentPrefix+JSON.stringify(value); }

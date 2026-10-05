/** A single bounded snapshot, usable only after a successful current identity read.
 * There is no TTL, stale fallback or reuse of an earlier validation promise.
 * A miss reads value and identity atomically. Overlapping misses may replace the
 * slot in any order; the next caller still checks its own current identity.
 */
export function verifiedSnapshot<T>(read:()=>Promise<{identity:string;value:T}>,identity:()=>Promise<string>) {
 let saved:{identity:string;value:T}|undefined;
 return async():Promise<T>=>{
  const candidate=saved;
  if(candidate&&(await identity())===candidate.identity)return structuredClone(candidate.value);
  const current=await read();
  saved={identity:current.identity,value:structuredClone(current.value)};
  return current.value;
 };
}

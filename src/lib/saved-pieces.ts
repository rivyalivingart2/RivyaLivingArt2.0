export const savedPiecesKey='rivya.saved-pieces.v1';
export function parseSavedPieces(raw:string|null):string[]{try{const value=JSON.parse(raw||'[]');return Array.isArray(value)?[...new Set(value.filter((id:unknown):id is string=>typeof id==='string'&&/^[A-Za-z0-9:-]{1,100}$/.test(id)))].slice(0,60):[];}catch{return [];}}
export function changeSavedPieces(ids:readonly string[],id:string){return ids.includes(id)?ids.filter(v=>v!==id):ids.length<60?[...ids,id]:[...ids];}
export function storeSavedPieces(storage:Pick<Storage,'setItem'>,ids:string[]){try{storage.setItem(savedPiecesKey,JSON.stringify(parseSavedPieces(JSON.stringify(ids))));return true;}catch{return false;}}

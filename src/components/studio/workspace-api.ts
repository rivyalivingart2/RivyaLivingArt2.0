export class StudioRequestError extends Error { constructor(message:string,public status:number){super(message);} }
export async function studioFetch(path:string,body?:object){
 const response=await fetch(path,{cache:'no-store',...(body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{})});
 const data=await response.json().catch(()=>{throw new StudioRequestError('The response was interrupted. Keep your edits and reload the saved record before retrying.',response.status);});
 if(response.status===401){window.dispatchEvent(new Event('studio-session-expired'));throw new StudioRequestError('Your session expired. Renew sign-in in the header, then retry. Keep this tab open to preserve unsaved edits.',401);}
 if(!response.ok)throw new StudioRequestError(data.error||'The request could not be completed.',response.status);
 return data;
}
export type StaffMember={id:string;login:string;name:string;role:'admin'|'editor';active:boolean;version:number};
export type WorkspaceIdentity={adminId:string;role:'admin'|'editor';staffId:string|null};

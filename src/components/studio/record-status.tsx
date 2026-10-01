import s from './workspace.module.css';
export function RecordStatus({id,version,publication,draft,dirty,busy}:{id:string;version:number;publication:string;draft:string;dirty:boolean;busy:boolean}){
 return <div className={s.recordStatus} aria-label="Record status"><span>{id}</span><span>Saved revision {version}</span><span>{publication}</span><span role="status">{busy?'Saving…':dirty?'Unsaved changes':draft}</span></div>;
}

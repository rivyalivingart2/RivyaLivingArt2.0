import s from './workspace.module.css';
export function RecordStatus({id,version,publication,draft,dirty,busy}:{id:string;version:number;publication:string;draft:string;dirty:boolean;busy:boolean}){
 return <dl className={s.recordStatus} aria-label="Record status" data-edit-state={busy?'saving':dirty?'unsaved':'saved'}>
  <div><dt>Record</dt><dd>{id}</dd></div>
  <div><dt>Saved revision</dt><dd>{version}</dd></div>
  <div><dt>Publication</dt><dd>{publication}</dd></div>
  <div><dt>Editing state</dt><dd><span role="status">{busy?'Saving…':dirty?'Unsaved changes':draft}</span></dd></div>
 </dl>;
}

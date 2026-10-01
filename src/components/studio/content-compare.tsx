import {contentDifferences} from '@/lib/content-diff';
import s from './workspace.module.css';
export function ContentCompare({before,after}:{before:unknown;after:unknown}){
 const differences=contentDifferences(before,after);
 return <div className={s.differences}>{differences.length?differences.map(d=><section key={d.field}><h4>{d.field}</h4><div><p><strong>Before</strong><br/>{d.before}</p><p><strong>After</strong><br/>{d.after}</p></div></section>):<p>No editorial differences.</p>}</div>;
}

'use client';
import {useJourneyText} from './journey-language';
import type {CustomField} from '@/lib/shop-model';
import defaults from './shop.module.css';
/** Shared controls for the public form and Studio draft preview. Submission stays with the public form. */
export function CustomizationFields({fields,answers,onChange,errors={},autoFocus=false,styles=defaults,formId}:{fields:CustomField[];answers:Record<string,string>;onChange:(id:string,value:string)=>void;errors?:Record<string,string>;autoFocus?:boolean;styles?:Record<string,string>;formId?:string}){
 const t=useJourneyText();
 const s=styles;
 return <div className={s.fields}>{fields.map((f, i)=><label className={s.field+(errors[f.id]?' '+s.fieldError:'')} key={f.id} htmlFor={'answer-'+f.id}>{f.label}{f.required?' *':''}
 {f.type==='select'?<select form={formId} id={'answer-'+f.id} required={f.required} value={answers[f.id]||''} autoFocus={autoFocus&&i===0} onChange={e=>onChange(f.id,e.target.value)} aria-invalid={!!errors[f.id]} aria-describedby={'help-'+f.id}><option value="">{t("Choose a direction")}</option>{f.options?.map(o=><option key={o}>{o}</option>)}</select>:<input form={formId} id={'answer-'+f.id} required={f.required} type={f.type==='number'?'number':'text'} inputMode={f.type==='number'?'numeric':undefined} min={f.type==='number'?f.min??1:undefined} max={f.type==='number'?f.max??500:undefined} step={f.type==='number'?1:undefined} maxLength={f.maxLength??240} value={answers[f.id]||''} autoFocus={autoFocus&&i===0} onChange={e=>onChange(f.id,e.target.value)} aria-invalid={!!errors[f.id]} aria-describedby={'help-'+f.id}/>}
 <span id={'help-'+f.id} role={errors[f.id]?'alert':undefined} className={errors[f.id]?s.error:s.help}>{errors[f.id]?t(errors[f.id]):f.hint}</span></label>)}</div>;
}

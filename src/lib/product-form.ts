import capabilities from './product-capabilities.json';
/** One declarative contract drives both customer fields and server validation. */
export type CustomField = {
  id:string; label:string; type:'text'|'select'|'number'; required:boolean;
  options?:string[]; hint?:string; maxLength?:number; min?:number; max?:number;
  visibleWhen?:{field:string;value:string};
};
export const fieldVisible=(field:CustomField,answers:Record<string,string>)=>
  !field.visibleWhen||answers[field.visibleWhen.field]===field.visibleWhen.value;

export function validateAnswers(fields:CustomField[],answers:Record<string,string>) {
  const errors:Record<string,string>={};
  for(const f of fields){
    if(!fieldVisible(f,answers))continue;
    const v=(answers[f.id]||'').trim();
    if(f.required&&!v)errors[f.id]='Please complete this field, or choose help where available.';
    else if(v.length>(f.maxLength??240))errors[f.id]='Please shorten this answer to '+(f.maxLength??240)+' characters.';
    else if(v&&f.type==='select'&&!f.options?.includes(v))errors[f.id]='Choose an available option.';
    else if(v&&f.type==='number'&&(!/^\d+$/.test(v)||Number(v)<(f.min??1)||Number(v)>(f.max??500)))errors[f.id]='Enter a whole number from '+(f.min??1)+' to '+(f.max??500)+'.';
  }
  return errors;
}

const choice=(id:string,label:string,options:string[],required=true):CustomField=>({id,label,type:'select',options,required});
const text=(id:string,label:string,required=false,hint?:string):CustomField=>({id,label,type:'text',required,maxLength:240,hint});
const quantity:CustomField={id:'quantity',label:'Quantity',type:'number',required:true,min:1,max:500};

export const productSchemaRevision=3;
export const hasReviewedCapabilities=(id:string)=>Object.hasOwn(capabilities,id);
export function productFields(p:{id:string;tier:'large'|'memory'|'personal';subtitle:string;category:string;name:string}):CustomField[]{
 const capability=capabilities[p.id as keyof typeof capabilities];
 if(!capability)return [text('brief','Your requirements',true,'Describe the purpose and requested details; the atelier will review feasibility.'),text('city','Delivery city',true)];
 const family=capability.family;
 const colour=choice('colour','Colour direction',['As shown in the design','Discuss my references','Help me choose']);
 const colourNotes={...text('colour_notes','Describe your colour references',true),visibleWhen:{field:'colour',value:'Discuss my references'}};
 const timing=text('timing','Preferred timing',false,'A preferred date is a request, not a confirmed delivery date.');
 if(p.tier==='large'){
  const fields:CustomField[]=[text('use','Where and how will you use '+p.name+'?',true,'Describe your room or project.'),choice('size_direction','Dimensions',['Use the design as a starting point','I have dimensions','Help me choose']),{...text('size','Preferred dimensions, with units',true,'Include cm or mm; use width × height for wall pieces and length × width × height for furniture.'),visibleWhen:{field:'size_direction',value:'I have dimensions'}},colour,colourNotes,choice('finish','Finish direction',['Discuss a finish for my setting','Help me choose'])];
  if(family==='dining')fields.push(text('seating','How many people should it seat?',false,'Include leg-room or base preferences.'));
  else if(family==='console')fields.push(text('placement','Placement and available depth',false,'Include skirting, doors or narrow walkways.'));
  else if(family==='wall'||family==='installation')fields.push(text('mounting','Orientation and mounting context',false,'Describe the wall, support or setting. Staff will review installation.'));
  else if(family==='sculpture')fields.push(text('placement','Display position and support',false,'Describe the floor, plinth or shelf and viewing space.'));
  else if(family==='seating')fields.push(text('seat','Seating needs',false,'Tell us who will use it and any seat-height preferences.'));
  else if(family==='desk')fields.push(text('placement','Workspace and cable or equipment needs'));
  else fields.push(text('placement','Placement or base preferences'));
  return [...fields,text('city','Delivery city',true),text('access','Doorway, lift, stair or access notes'),timing];
 }
 if(p.tier==='memory'){
  const preserving=['preservation','clock','invitation','keepsake'].includes(family);
  return [...(preserving?[text('keepsake','What would you like to preserve?',true,'Wait for staff guidance before sending irreplaceable items.'),text('condition','Current condition and occasion date',true,'Describe the flowers, paper or keepsakes and their approximate size.')]:[text('occasion','Occasion and intended use',true)]),
   choice('display','Display direction',family==='clock'?['Clock as shown','Discuss the arrangement','Help me choose']:family==='invitation'?['As shown','Discuss the layout','Help me choose']:family==='ceremony'?['As shown','Discuss the arrangement','Help me choose']:['As shown','Discuss the arrangement','Help me choose']),
   text('personalization',capability.personalizationRequired?'Name or text for the piece':'Names, date or message',capability.personalizationRequired),colour,colourNotes,text('city','Delivery city',true),timing];
 }
 const fields:CustomField[]=[text('occasion','Occasion or recipient'),colour,colourNotes];
 if(family==='pendant'||family==='earrings')fields.push(text('fitting','Fitting and wearing preferences',false,'Discuss the fitting, weight and material suitability with the atelier.'));
 if(family==='rakhi')fields.push(text('fit','Wrist fit or tying preferences',false,'Include measurements with units if known.'));
 if(family==='coasters')fields.push(choice('set_size','Pieces per set',['2','4','6','Help me choose']));
 fields.push(text('personalization','Name or message (optional)'));
 return [...fields,{...quantity,label:capability.quantityUnit==='sets'?'Number of sets':capability.quantityUnit==='pairs'?'Number of pairs':'Quantity'},text('city','Delivery city',true),timing];
}

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

export function productFields(p:{id:string;tier:'large'|'memory'|'personal';subtitle:string;category:string;name:string}):CustomField[]{
  const type=(p.subtitle+' '+p.category).toLowerCase();
  const colour=choice('colour','Colour direction',['As shown in the design','Discuss my references','Help me choose']);
  const colourNotes={...text('colour_notes','Describe your colour references',true),visibleWhen:{field:'colour',value:'Discuss my references'}};
  const timing=text('timing','Preferred timing',false,'A preferred date is a request, not a confirmed delivery date.');
  if(p.tier==='large'){
    const fields:CustomField[]=[
      text('use','Where and how will you use '+p.name+'?',true,'Describe your room or project; a short explanation is enough.'),
      choice('size_direction','Dimensions',['Use the design as a starting point','I have dimensions','Help me choose']),
      {...text('size','Preferred dimensions, with units',true,'Use length × width × height for furniture; width × height for wall art. Include cm or mm.'),visibleWhen:{field:'size_direction',value:'I have dimensions'}},
      colour,colourNotes,choice('finish','Finish direction',['Discuss a finish for my setting','Help me choose']),
    ];
    if(/dining/.test(type))fields.push(text('seating','How many people should it seat?',false,'Include your preferred base or leg-room requirements.'));
    else if(/console/.test(type))fields.push(text('placement','Placement and available depth',false,'Include skirting, doors or narrow walkways if relevant.'));
    else if(/wall|panel|installation|spatial/.test(type))fields.push(text('mounting','Orientation and mounting context',false,'Tell us about the wall, support or location; staff will review installation.'));
    else if(/chair|bench|stool|seating/.test(type))fields.push(text('seat','Seating needs',false,'Tell us who will use the piece and any seat-height preferences.'));
    else fields.push(text('placement','Placement or base preferences'));
    return [...fields,text('city','Delivery city',true),text('access','Doorway, lift, stair or access notes'),timing];
  }
  if(p.tier==='memory'){
    const preserving=/flower|preserv|keepsake|invitation|baby/.test(type);
    return [
      ...(preserving?[
        text('keepsake','What would you like to preserve?',true,'Please wait for staff guidance before sending an irreplaceable item.'),
        text('condition','Current condition and occasion date',true,'Describe fresh/dried flowers, paper or objects, and their approximate size.')
      ]:[text('occasion','Occasion and intended use',true)]),
      choice('display','Display direction',/clock/.test(type)?['Clock as shown','Discuss the arrangement','Help me choose']:/frame|invitation/.test(type)?['Framed arrangement','Discuss the layout','Help me choose']:/tray|platter/.test(type)?['Tray as shown','Discuss the arrangement','Help me choose']:['As shown','Discuss the arrangement','Help me choose']),
      text('personalization',/nameplate/.test(type)?'Name or text for the piece':'Names, date or message',/nameplate/.test(type)),
      colour,colourNotes,text('city','Delivery city',true),timing
    ];
  }
  const fields:CustomField[]=[text('occasion','Occasion or recipient'),colour,colourNotes];
  if(/bangle|bracelet|ring/.test(type))fields.push(text('size','Required size or measurement',true,'Include the sizing system or measurement in mm; write “Help me measure” if unsure.'));
  if(/coaster/.test(type))fields.push(choice('set_size','Pieces per set',['2','4','6','Help me choose']));
  fields.push(text('personalization',/initial|name/.test(type)?'Name or initials':'Name or message (optional)',/initial|name/.test(type)));
  return [...fields,{...quantity,label:/coaster/.test(type)?'Number of sets':'Quantity'},text('city','Delivery city',true),timing];
}

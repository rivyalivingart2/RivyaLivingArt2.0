import type {ContentDocument,ContentSection} from './content-model';
import type {HomeSection} from './homepage-model';

/** Editorial starting points, never an automatic public-content migration. */
export const detailedHomeChapters:{copy:ContentSection;block:HomeSection;before:string}[]=[
 {before:'selected',copy:{id:'manifesto',heading:'Made around the way you live.',paragraphs:['A piece begins with more than a shape. It begins with a room, a memory or a person you have in mind. The collection gives that idea a starting point; your brief brings the context.','Look closely, ask questions and bring the details that matter to you. The final design, materials and quotation are discussed with the atelier before an order is agreed.'],sourceNote:'Adapted from current Our story chapters and the existing inquiry-to-agreement workflow.'},block:{id:'manifesto',type:'story',layout:'statement',enabled:false,contentNeeded:true,eyebrow:'A point of view',action:{label:'Meet the atelier',href:'/our-story'}}},
 {before:'material',copy:{id:'large-format',heading:'Give the room a starting point.',paragraphs:['A table, console or sculptural form can change how a space is read. Consider the piece alongside the light, nearby finishes and the routes you use every day. A room photograph is useful context, not a finished specification.','Begin with an existing design, then bring the proposed dimensions and intended use into your brief. Material choices, feasibility and the final quotation are agreed individually.'],checklist:['The room and how you use it','Approximate dimensions, clearly labelled','Surrounding colours and finishes','Delivery city and any known access constraints'],sourceNote:'Current Architects and Materials guidance; no load rating, installation or serviceability promise.'},block:{id:'large-format',type:'story',layout:'split',enabled:false,contentNeeded:true,eyebrow:'Furniture & spatial art',action:{label:'Explore collectible design',href:'/collectible-design'}}},
 {before:'process',copy:{id:'atelier',heading:'The personal part gives it direction.',paragraphs:['RivyaLivingArt brings furniture, resin art and personal expression into one conversation. What draws you to a design may be its outline, its colour or a connection to something you want to keep. Explain that part of the story.','A reference can help start the discussion, but it cannot settle every detail. Your setting, proposed use and preferences help the atelier develop the specification with you.'],sourceNote:'Current /our-story text. No biography, named maker, workshop photograph, awards or years of practice asserted.'},block:{id:'atelier',type:'story',layout:'reverse',enabled:false,contentNeeded:true,eyebrow:'Inside the atelier',action:{label:'Read our approach',href:'/our-story'}}},
 {before:'process',copy:{id:'in-the-room',heading:'Think about the space around it.',paragraphs:['Look at the space a piece will occupy and the space it leaves around it. Mark an approximate footprint, notice the nearby furniture and collect a few views of the room. These observations help explain your intent.','Design visualizations show a direction for discussion. They are not photographs of completed installations, and they do not establish final dimensions, material performance or site suitability.'],sourceNote:'Current journal planning guidance and design-visualization disclosure. Illustration must remain labelled; no completed-project claim.'},block:{id:'in-the-room',type:'story',layout:'split',enabled:false,contentNeeded:true,eyebrow:'In context',action:{label:'Prepare a project brief',href:'/architects'}}},
 {before:'process',copy:{id:'bespoke',heading:'An idea is enough to begin.',paragraphs:['You do not need a finished design to start a conversation. Tell us what the piece is for, what matters most and what is still undecided. Choose an existing piece or use the bespoke request form.','The form saves your brief before preparing its WhatsApp message. Open or copy the prepared details and tap Send yourself. Feasibility, specification, price and timing are discussed before an order is confirmed.'],checklist:['Purpose and intended setting','Approximate scale, if you know it','Colour or material direction','References with a note about what you like'],sourceNote:'Existing commission flow and approved FAQ. No additional required fields or automatic messaging.'},block:{id:'bespoke',type:'story',layout:'statement',enabled:false,contentNeeded:true,eyebrow:'A brief of your own',action:{label:'Start a bespoke brief',href:'/commission/customize'}}},
 {before:'journal',copy:{id:'principles',heading:'Clear choices. A considered conversation.',paragraphs:['Use the collection to explore a direction, then ask about the details that will shape your individual piece. A clear brief and a shared specification make that conversation useful.'],checklist:['Existing designs offer a starting point; final details are agreed with you.','Visualizations communicate an idea without promising an identical finished appearance.','Your reference images remain private to the inquiry and authorized Studio access.','A saved request begins a discussion; it is not payment or production confirmation.'],sourceNote:'Current product-image disclosure, privacy policy and saved-request contract. No unsupported durability, sustainability, awards or manufacturing claims.'},block:{id:'principles',type:'story',layout:'statement',enabled:false,contentNeeded:true,eyebrow:'Why the atelier',action:{label:'Read the practical questions',href:'/faq'}}}
];

export const homeSectionDisposition=[
 {old:'pour',label:'Hero',section:'hero',outcome:'Retained',reason:'Published title, two actions and independent P3 image.'},
 {old:'manifesto',label:'Manifesto',section:'manifesto',outcome:'Adapted',reason:'Substantial editorial statement; no invented claims.'},
 {old:'pieces',label:'Featured pieces',section:'selected',outcome:'Retained',reason:'Ordered references to existing published products.'},
 {old:'large-format',label:'Large format',section:'large-format',outcome:'Adapted',reason:'Room/use/brief guidance; existing catalogue destination.'},
 {old:'material',label:'Material story',section:'material',outcome:'Adapted',reason:'Written material guidance and reviewed detail; unverified cure/finish timings excluded.'},
 {old:'collections',label:'Collections',section:'journeys',outcome:'Adapted',reason:'Three existing journeys plus current category discovery.'},
 {old:'furniture',label:'Furniture concepts',outcome:'Content needed',reason:'No separately confirmed offering or approved concept catalogue.'},
 {old:'maker',label:'Maker',section:'atelier',outcome:'Adapted',reason:'Verified practice text; no invented biography or staff identity.'},
 {old:'rooms',label:'In the room',section:'in-the-room',outcome:'Adapted',reason:'Labelled visualization and proportion discussion, not installed-work evidence.'},
 {old:'work',label:'Recent commissions',outcome:'Content needed',reason:'Genuine projects, facts and permissions required.'},
 {old:'words',label:'Customer words',outcome:'Content needed',reason:'Genuine attributed quotations and permission required.'},
 {old:'bespoke',label:'Bespoke',section:'bespoke',outcome:'Adapted',reason:'Useful brief guidance connects to the existing form.'},
 {old:'workshops',label:'Workshops',outcome:'Content needed',reason:'Actual offering, schedule and service facts required.'},
 {old:'print',label:'Print studio',outcome:'Content needed',reason:'Current capability and offering must be confirmed.'},
 {old:'process',label:'How it works',section:'process',outcome:'Retained',reason:'Browse, customize, save, then manually open/copy/send.'},
 {old:'why',label:'Why the atelier',section:'principles',outcome:'Adapted',reason:'Evidence-backed operating principles rather than unsupported badges.'},
 {old:'journal',label:'Journal',section:'journal',outcome:'Retained',reason:'Owner-selected existing published stories.'},
 {old:'closing',label:'Closing invitation',section:'invitation',outcome:'Retained',reason:'Existing commission action and canonical contact route.'}
] as const;

export function missingHomeChapters(document:ContentDocument){return detailedHomeChapters.filter(t=>!document.sections.some(s=>s.id===t.copy.id));}
export function restoreMissingHomeChapters(document:ContentDocument):ContentDocument{
 if(!document.homepage)throw Error('Open the homepage to add these chapters.');
 const missing=missingHomeChapters(document);
 if(document.sections.length+missing.length>20)throw Error('This would exceed 20 chapters. Keep your current work and add the remaining chapters individually.');
 const next=structuredClone(document);
 for(const template of missing){
  next.sections.push(structuredClone(template.copy));
  const index=next.homepage!.sections.findIndex(s=>s.id===template.before);
  next.homepage!.sections.splice(index<0?next.homepage!.sections.length:index,0,structuredClone(template.block));
 }
 return next;
}

/**
 * Versioned definition for the bespoke form. Durable saving is connected in Phase 6.
 * Choices describe requests for review, not guaranteed manufacturing capability.
 * Never edit a released version in place; append a version and snapshot it on save.
 */
import type {CustomField} from './product-form';

export type BespokeSchema = Readonly<{
  id:'bespoke-piece';
  version:number;
  title:string;
  fields:readonly CustomField[];
}>;

export const bespokeSchemaV1: BespokeSchema = {
  id:'bespoke-piece',
  version:1,
  title:'A custom piece',
  fields:[
    {id:'piece_type',label:'What would you like us to create?',type:'select',required:true,
      options:['Furniture or a spatial piece','Wall art','Memory or preservation art','A personal piece or gift','Help me describe my idea']},
    {id:'purpose',label:'Your idea and intended use',type:'text',required:true,maxLength:240,
      hint:'Describe the piece and how you plan to use or display it.'},
    {id:'scale',label:'Approximate size, including units',type:'text',required:false,maxLength:240,
      hint:'Include cm or mm if you know the size. You can also ask for help choosing.'},
    {id:'direction',label:'Material and colour direction',type:'text',required:false,maxLength:240,
      hint:'Share your preferences. Materials and feasibility will be reviewed by the atelier.'},
    {id:'constraints',label:'Placement, access or preservation considerations',type:'text',required:false,maxLength:240},
    {id:'city',label:'Delivery city',type:'text',required:true,maxLength:240},
    {id:'timing',label:'Preferred timing',type:'text',required:false,maxLength:240,
      hint:'A preferred date is a request, not a confirmed delivery date.'},
  ],
};

export const bespokeSchemas:readonly BespokeSchema[] = [bespokeSchemaV1];

/**
 * Version 2 persistence contract used by Phase 6 submission and compatibility readers.
 * Schemas and immutable saved evidence are validated before message rendering.
 * Never cast untrusted JSON to this type as a substitute for validation.
 */
import type {CustomField} from './product-form';
import type {ShopProduct} from './shop-model';

export type AnswerSnapshot =
  | Readonly<{fieldId:string;label:string;type:'text';value:string;unit:null}>
  | Readonly<{fieldId:string;label:string;type:'select';value:string;optionLabel:string;unit:null}>
  | Readonly<{fieldId:string;label:string;type:'number';value:number;unit:string|null}>;

export type SavedRequestDefinition =
  | Readonly<{kind:'product';productId:string;product:ShopProduct;schemaId:string;schemaVersion:number;fields:readonly CustomField[]}>
  | Readonly<{kind:'bespoke';productId:null;product:null;schemaId:'bespoke-piece';schemaVersion:number;title:string;fields:readonly CustomField[]}>;

export type SubmissionEvidence = Readonly<{
  source:'website';
  route:string; // Server-resolved pathname only; no query string, referrer or client URL.
  consentVersion:string;
  consentAcceptedAt:string; // Server timestamp; never inferred for historical records.
}>;

export type SavedBriefV2 = Readonly<{
  contractVersion:2;
  id:string;
  reference:string;
  definition:SavedRequestDefinition;
  answers:readonly AnswerSnapshot[];
  customer:Readonly<{name:string;phone:string;email:string}>;
  notes:string;
  referenceCount:number;
  evidence:SubmissionEvidence;
  createdAt:string;
}>;

export type MessageState = 'handoff_pending'|'handoff_failed'|'handoff_ready';
export type MessageFailureCode = 'render_failed'|'destination_unavailable';
export type MessageDestination = Readonly<{number:string;configVersion:number}>;
export type SavedMessage =
  | Readonly<{state:'handoff_pending'|'handoff_failed';templateVersion:string;destination:MessageDestination;summary:null;finalizedAt:null}>
  | Readonly<{state:'handoff_ready';templateVersion:string;destination:MessageDestination;summary:string;finalizedAt:string}>;

/** Old label-keyed data/text is displayed verbatim; missing evidence stays unknown. */
export type LegacyBrief = Readonly<{
  contractVersion:1;
  productSnapshot:unknown;
  answers:Readonly<Record<string,string>>;
  summary:string;
  consent:null;
  destination:null;
}>;

import type {MessageState} from './order-contract';
export type OrderReceipt={reference:string;state:MessageState|'legacy_unverified'|'unavailable';summary:string|null;retryAvailable:boolean;handoffAllowed:boolean;reason:string;brief:{title:string;name:string;phone:string;email:string;notes:string;referenceCount:number;answers:{label:string;value:string}[]}|null};

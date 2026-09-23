export const orderStages = ['NEW','CONTACTED','QUALIFIED','QUOTED','CONFIRMED','IN_PRODUCTION','COMPLETED','CLOSED'] as const;
export type OrderStage = typeof orderStages[number];
export type StudioOrder = {id: string; client: string; title: string; status: OrderStage; version: number; updatedAt: string; reference?:string;assignee?:string|null;followUp?:string|null;source?:'website'|'manual';assigneeName?:string|null;requestKind?:'product'|'bespoke'|null;createdAt?:string;referenceCount?:number};
export function isOrderStage(value: unknown): value is OrderStage {
  return typeof value === 'string' && orderStages.includes(value as OrderStage);
}
export function stageLabel(stage: string) { return stage.toLowerCase().replaceAll('_', ' ').replace(/^./, c => c.toUpperCase()); }

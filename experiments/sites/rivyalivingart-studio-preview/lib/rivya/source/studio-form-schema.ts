import type { InquiryConfig, InquiryField } from "./inquiry-schema";

/** Presentation-only schema editing. Original configurations stay immutable. */
export const studioFieldTypes = ["text", "textarea", "select", "radio", "number", "email", "tel", "date", "checkbox"] as const;
export const protectedContactFields = new Set(["contactName", "contactMethod", "contactEmail", "contactPhone", "previewConsent"]);
export const hasChoices = (field: InquiryField) => field.type === "select" || field.type === "radio";
export const hasLength = (field: InquiryField) => ["text", "textarea", "email", "tel"].includes(field.type);

export function schemaDependents(config: InquiryConfig, fieldId: string, value?: string): readonly InquiryField[] {
  return config.steps.flatMap((step) => step.fields).filter((field) => [field.visibleWhen, field.requiredWhen].some((rule) => rule?.field === fieldId && (value === undefined || rule.value === value)));
}

/** Every issue is data, never executable schema content. Limits bound this local editor. */
export function studioSchemaIssues(config: InquiryConfig): readonly string[] {
  const issues: string[] = [];
  const preceding = new Map<string, InquiryField>();
  for (const step of config.steps) {
    if (step.fields.length > 24) issues.push(`${step.title}: use at most 24 fields.`);
    for (const field of step.fields) {
      const label = field.label.trim() || field.id;
      if (preceding.has(field.id)) issues.push(`${label}: the field identifier is already used.`);
      if (!field.label.trim() || field.label.length > 120) issues.push(`${label}: use a label of 1–120 characters.`);
      if ((field.hint?.length ?? 0) > 400) issues.push(`${label}: keep guidance within 400 characters.`);
      if (hasChoices(field)) {
        if (!field.options?.length || field.options.length > 12) issues.push(`${label}: provide 1–12 choices.`);
        if (field.options?.some((option) => !option.label.trim() || option.label.length > 120)) issues.push(`${label}: every choice needs a label of 1–120 characters.`);
        if (new Set(field.options?.map((option) => option.value)).size !== field.options?.length) issues.push(`${label}: choice identifiers must be unique.`);
      }
      for (const key of ["min", "max", "minLength", "maxLength"] as const) {
        const value = field[key];
        if (value !== undefined && (!Number.isFinite(value) || value < 0 || value > (key.endsWith("Length") ? 2000 : 100000))) issues.push(`${label}: ${key} is outside the editor range.`);
        if (value !== undefined && (key.endsWith("Length") || field.integer) && !Number.isInteger(value)) issues.push(`${label}: ${key} must be a whole number.`);
      }
      if (field.min !== undefined && field.max !== undefined && field.min > field.max) issues.push(`${label}: minimum must not exceed maximum.`);
      if (field.minLength !== undefined && field.maxLength !== undefined && field.minLength > field.maxLength) issues.push(`${label}: minimum length must not exceed maximum length.`);
      for (const rule of [field.visibleWhen, field.requiredWhen]) {
        if (!rule) continue;
        const controller = preceding.get(rule.field);
        if (!controller || controller.visibleWhen) issues.push(`${label}: conditions must use an earlier, always-visible choice field.`);
        else if (controller.type === "checkbox" ? rule.value !== "yes" : !controller.options?.some((option) => option.value === rule.value)) issues.push(`${label}: choose an existing condition value.`);
      }
      preceding.set(field.id, field);
    }
  }
  return issues;
}

export function precedingControllers(config: InquiryConfig, fieldId: string): readonly InquiryField[] {
  const fields = config.steps.flatMap((step) => step.fields);
  return fields.slice(0, fields.findIndex((field) => field.id === fieldId)).filter((field) => !field.visibleWhen && (hasChoices(field) || field.type === "checkbox") && field.id !== "previewConsent");
}

/** Pure presentation contracts and local validation. No catalogue, network or storage imports. */
export type InquiryMode = "commission" | "preserve" | "personalize";
export type InquiryValues = Record<string, string>;
export type InquiryErrors = Record<string, string>;
export type InquiryOption = Readonly<{ value: string; label: string }>;
export type InquiryCondition = Readonly<{ field: string; value: string }>;
export type InquiryField = Readonly<{
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "number" | "email" | "tel" | "date" | "checkbox";
  required?: boolean;
  options?: readonly InquiryOption[];
  min?: number;
  max?: number;
  integer?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: "initial";
  hint?: string;
  placeholder?: string;
  visibleWhen?: InquiryCondition;
  requiredWhen?: InquiryCondition;
}>;
export type InquiryStep = Readonly<{
  id: string; title: string; description: string; kind: "fields" | "review";
  fields: readonly InquiryField[]; reference?: boolean;
}>;
export type InquiryProductSnapshot = Readonly<{
  id: string; slug: string; title: string; name: string; tier: "LARGE" | "MEDIUM" | "SMALL";
  demoVersion: 1; priceType: "ON_REQUEST" | "STARTING_FROM" | "FIXED";
  priceAmountMinor: number | null; currency: "INR"; priceLabel: string;
  leadTime: Readonly<{ minWeeks: number; maxWeeks: number }>;
}>;
export type InquiryConfig = Readonly<{
  schemaVersion: 1; mode: InquiryMode; title: string; introduction: string;
  product: InquiryProductSnapshot | null;
  steps: readonly InquiryStep[];
  initialValues: Readonly<InquiryValues>;
  demoValues: Readonly<InquiryValues>;
  limits: Readonly<{ referenceMaxBytes: number; referenceMaxCount: number; referenceTypes: readonly string[] }>;
  reviewNotice: string;
}>;
export type InquirySummarySection = Readonly<{
  id: string; title: string; items: readonly Readonly<{ id: string; label: string; value: string }>[];
}>;

export function isInquiryFieldVisible(field: InquiryField, values: Readonly<InquiryValues>): boolean {
  return !field.visibleWhen || values[field.visibleWhen.field] === field.visibleWhen.value;
}

/** Retain only declared, visible keys; do not silently truncate invalid user input. */
export function normalizeInquiryValues(config: InquiryConfig, values: Readonly<InquiryValues>): InquiryValues {
  const normalized: InquiryValues = {};
  for (const step of config.steps) {
    for (const field of step.fields) {
      if (!isInquiryFieldVisible(field, values)) continue;
      const raw = values[field.id];
      normalized[field.id] = typeof raw === "string" ? raw.trim().normalize("NFC") : "";
    }
  }
  return normalized;
}

/** Calendar date only: never convert a memory date through a timezone or timestamp. */
export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= days[month - 1];
}

export function validateInquiry(config: InquiryConfig, values: Readonly<InquiryValues>, stepId?: string): InquiryErrors {
  const normalized = normalizeInquiryValues(config, values);
  const errors: InquiryErrors = {};
  for (const step of config.steps) {
    if (stepId && step.id !== stepId) continue;
    for (const field of step.fields) {
      if (!isInquiryFieldVisible(field, normalized)) continue;
      const value = normalized[field.id] ?? "";
      const required = field.required || (field.requiredWhen && normalized[field.requiredWhen.field] === field.requiredWhen.value);
      if (field.type === "checkbox") {
        if ((required && value !== "yes") || (value !== "" && value !== "yes")) errors[field.id] = `Please confirm: ${field.label}`;
        continue;
      }
      if (!value) {
        if (required) errors[field.id] = `Enter ${field.label.toLowerCase()}.`;
        continue;
      }
      if (field.maxLength !== undefined && Array.from(value).length > field.maxLength) {
        errors[field.id] = `Use ${field.maxLength} characters or fewer.`;
      } else if (field.minLength !== undefined && Array.from(value).length < field.minLength) {
        errors[field.id] = `Use at least ${field.minLength} characters.`;
      } else if (field.options && !field.options.some((option) => option.value === value)) {
        errors[field.id] = `Choose a listed ${field.label.toLowerCase()} option.`;
      } else if (field.type === "number") {
        const number = Number(value);
        if (!/^(?:0|[1-9]\d*)(?:\.\d{1,3})?$/.test(value) || !Number.isFinite(number)) {
          errors[field.id] = "Enter a positive number with up to three decimal places.";
        } else if (field.integer && !Number.isSafeInteger(number)) {
          errors[field.id] = "Enter a whole number.";
        } else if ((field.min !== undefined && number < field.min) || (field.max !== undefined && number > field.max)) {
          errors[field.id] = `Use a value from ${field.min ?? 0} to ${field.max ?? "the configured maximum"}.`;
        }
      } else if (field.type === "date" && !isCalendarDate(value)) {
        errors[field.id] = "Enter a valid calendar date.";
      } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[field.id] = "Enter a sample email address such as visitor@example.invalid.";
      } else if (field.type === "tel") {
        const digits = value.replace(/\D/g, "");
        if (!/^\+?[\d ()-]+$/.test(value) || digits.length < 7 || digits.length > 15) {
          errors[field.id] = "Use a sample phone with 7–15 digits; +00 0000000000 is non-contactable.";
        }
      } else if (field.pattern === "initial" && !/^[\p{L}\p{N}]$/u.test(value)) {
        errors[field.id] = "Enter one letter or number for the sample initial.";
      }
    }
  }
  return errors;
}

export function validateStep(config: InquiryConfig, stepIndex: number, values: Readonly<InquiryValues>): InquiryErrors {
  const step = config.steps[stepIndex];
  return !step || step.kind === "review" ? validateInquiry(config, values) : validateInquiry(config, values, step.id);
}

export function fictionalDemoValues(config: InquiryConfig): InquiryValues {
  return { ...config.initialValues, ...config.demoValues, previewConsent: "" };
}

/** Strings stay data for React text nodes; no generated HTML or external message URL. */
export function summarizeInquiry(config: InquiryConfig, values: Readonly<InquiryValues>): readonly InquirySummarySection[] {
  const normalized = normalizeInquiryValues(config, values);
  return config.steps.filter((step) => step.kind === "fields").map((step) => ({
    id: step.id,
    title: step.title,
    items: step.fields.filter((field) => field.id !== "previewConsent" && isInquiryFieldVisible(field, normalized)).map((field) => {
      const raw = normalized[field.id] ?? "";
      const value = field.options?.find((option) => option.value === raw)?.label
        ?? (field.type === "checkbox" ? (raw === "yes" ? "Requested for discussion" : "Not requested") : raw)
        ?? "";
      return { id: field.id, label: field.label, value: value || "Not supplied" };
    }),
  })).filter((section) => section.items.length > 0);
}

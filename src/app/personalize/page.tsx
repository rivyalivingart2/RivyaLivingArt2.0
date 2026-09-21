import { InquiryEntry, inquiryMetadata } from "@/components/inquiry-entry";
import type { CatalogueQuery } from "@/lib/catalogue";

export function generateMetadata() { return inquiryMetadata("personalize"); }

export default function PersonalizationPage({ searchParams }: { searchParams: Promise<CatalogueQuery> }) {
  return <InquiryEntry mode="personalize" searchParams={searchParams} />;
}

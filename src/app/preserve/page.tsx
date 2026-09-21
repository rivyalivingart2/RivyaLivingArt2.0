import { InquiryEntry, inquiryMetadata } from "@/components/inquiry-entry";
import type { CatalogueQuery } from "@/lib/catalogue";

export function generateMetadata() { return inquiryMetadata("preserve"); }

export default function PreservationPage({ searchParams }: { searchParams: Promise<CatalogueQuery> }) {
  return <InquiryEntry mode="preserve" searchParams={searchParams} />;
}

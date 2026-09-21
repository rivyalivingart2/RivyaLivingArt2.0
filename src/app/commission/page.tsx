import { InquiryEntry, inquiryMetadata } from "@/components/inquiry-entry";
import type { CatalogueQuery } from "@/lib/catalogue";

export function generateMetadata() { return inquiryMetadata("commission"); }

export default function CommissionPage({ searchParams }: { searchParams: Promise<CatalogueQuery> }) {
  return <InquiryEntry mode="commission" searchParams={searchParams} />;
}

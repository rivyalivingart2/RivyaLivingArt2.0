import { CraftFAQ, readFaqQuery } from "@/components/craft-faq";
import { PublicPageClosing, PublicPageHeader, PublicSampleNotice } from "@/components/public-page";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";
import styles from "@/components/craft-faq.module.css";

export function generateMetadata() {
  return publicPreviewMetadata("Frequently asked questions", "Sample answers about commissioning, materials, memory art and personal gifts.");
}

export default async function FaqPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requirePublicPreview();
  const query = readFaqQuery(await searchParams);

  return (
    <main id="main-content" className={`section ${styles.page}`}>
      <PublicPageHeader
        eyebrow="The questions, considered"
        title="Every good piece begins with a conversation."
        intro="A place to begin: the shape of a commission, the details of a memory, the thought behind a gift. Explore forty-two sample answers across seven topics."
      />
      <PublicSampleNotice>
        These are supplied sample answers awaiting owner review, not approved policies or live service promises. Forms create local demo summaries only; no request, image or message is sent or saved.
      </PublicSampleNotice>
      <CraftFAQ query={query} />
      <PublicPageClosing
        title="There is always room for another question."
        description="See the current contact-page preview and the information needed before a real studio conversation can begin."
        href="/contact"
        label="Contact information"
      />
    </main>
  );
}

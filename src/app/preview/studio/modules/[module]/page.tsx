import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";
import { isVisualPreviewAllowed } from "@/lib/preview-mode";
import styles from "./page.module.css";

const modules = {
  content: { title: "Content workspace", stage: "R8-4B", description: "Structured page sections, journal, FAQ and testimonial editors, with local preview and history presentations.", current: "Public pages and labelled editorial source already exist. The structured Studio editing workspace is the next development slice.", href: "/journal", action: "Explore the sample journal" },
  media: { title: "Media workspace", stage: "R8-4B", description: "Media browsing and selection with clear provenance, rights, alt text and usage information.", current: "The catalogue includes labelled concept visuals and honest missing-image placeholders. No media upload, deletion or approval service is connected.", href: "/preview/studio/products?media=VISUAL_PENDING", action: "See concepts awaiting imagery" },
  inquiries: { title: "Enquiry workspace", stage: "R8-4C", description: "A demo pipeline, request details, status transitions and internal-note presentations.", current: "The public sample forms create local summaries only. No enquiry inbox, staff notes or saved customer records exist in this preview.", href: "/commission", action: "Explore a sample commission brief" },
  imports: { title: "Imports & exports", stage: "R8-4C", description: "Catalogue file selection, mapping, validation and resumable-job presentations.", current: "No files have been imported, no rows have been written and no export job is running. The catalogue remains versioned source fixtures.", href: "/preview/studio/products", action: "Explore the demo catalogue" },
  settings: { title: "Workspace settings", stage: "R8-4C–R8-4D", description: "Independent menu visibility, staff and session presentations, plus environment-health information.", current: "This gallery has no staff session, role enforcement or editable live configuration. Real access control is implemented after the frontend review checkpoint.", href: "/studio", action: "View Studio connection status" },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  if (!isVisualPreviewAllowed(process.env)) return publicPreviewMetadata("Not found");
  const { module } = await params;
  if (module === "content" || module === "media") return publicPreviewMetadata(`${module === "content" ? "Content" : "Media"} workspace · Studio demo`);
  return publicPreviewMetadata(Object.hasOwn(modules, module) ? `${modules[module as keyof typeof modules].title} · Planned Studio demo` : "Not found");
}

export default async function PlannedStudioModule({ params }: { params: Promise<{ module: string }> }) {
  await requirePublicPreview();
  const { module } = await params;
  if (module === "content" || module === "media") redirect(`/preview/studio/${module}`);
  if (!Object.hasOwn(modules, module)) notFound();
  const entry = modules[module as keyof typeof modules];
  return <section className={styles.page} aria-labelledby="module-title"><p className={styles.eyebrow}>Studio roadmap / {entry.stage}</p><span className={styles.status}>Planned module</span><h1 id="module-title">{entry.title}</h1><p className={styles.description}>{entry.description}</p><div className={styles.note}><h2>Current development boundary</h2><p>{entry.current}</p></div><div className={styles.actions}><Link href={entry.href}>{entry.action}<span aria-hidden="true">↗</span></Link><Link href="/preview/studio">Back to overview<span aria-hidden="true">↗</span></Link></div></section>;
}

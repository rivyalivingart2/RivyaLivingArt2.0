"use client";

import Link from "next/link";
import { useState } from "react";
import type { StudioOverviewData } from "@/lib/studio-overview";
import styles from "./studio-overview.module.css";

export function StudioOverview({ data }: { data: StudioOverviewData }) {
  const [dataset, setDataset] = useState<"demo" | "live">("demo");
  const metrics = [
    { label: "Product concepts", value: data.total, note: "Labelled source fixtures", href: "/preview/studio/products" },
    { label: "Working drafts", value: data.drafts, note: "Demo draft status", href: "/preview/studio/products?draft=DRAFT" },
    { label: "Awaiting review", value: data.inReview, note: "Demo review status", href: "/preview/studio/products?draft=IN_REVIEW" },
    { label: "Visuals missing", value: data.pendingVisuals, note: "No approved image supplied", href: "/preview/studio/products?media=VISUAL_PENDING" },
  ];

  return <div className={styles.page}>
    <header className={styles.heading}><div><p className={styles.eyebrow}>Workspace / Overview</p><h1>The atelier, at a glance.</h1><p>A clear view of the catalogue and the work still taking shape.</p></div><Link href="/preview/studio/products/new" className={styles.primary}>Create local product draft <span aria-hidden="true">+</span></Link></header>
    <div className={styles.datasetBar}><div className={styles.dataset} role="group" aria-label="Dataset presentation"><button type="button" aria-pressed={dataset === "demo"} onClick={() => setDataset("demo")}>Demo fixtures</button><button type="button" aria-pressed={dataset === "live"} onClick={() => setDataset("live")}>Live data</button></div><p>{dataset === "demo" ? "Source snapshot · local editor changes do not update these counts" : "Live database and staff access are not connected"}</p></div>
    {dataset === "live" ? <section className={styles.disconnected} aria-labelledby="live-data-heading"><span className={styles.emptyMark} aria-hidden="true">◇</span><p className={styles.eyebrow}>Live workspace / Not connected</p><h2 id="live-data-heading">Real work belongs to real data.</h2><p>No live catalogue, enquiries, staff session or business analytics are available in this frontend preview. Live and demo totals will stay separate when the backend is connected.</p><button className={styles.primary} type="button" onClick={() => setDataset("demo")}>Return to demo fixtures <span aria-hidden="true">↗</span></button></section> : <>
      <section className={styles.metrics} aria-label="Demo catalogue totals">{metrics.map((metric) => <Link key={metric.label} href={metric.href} className={styles.metric}><span>{metric.label}<span aria-hidden="true">↗</span></span><strong>{metric.value}</strong><small>{metric.note}</small></Link>)}</section>
      <div className={styles.grid}>
        <section className={styles.panel} aria-labelledby="tier-breakdown"><header className={styles.panelHeading}><div><h2 id="tier-breakdown">One catalogue, three scales</h2><p>All {data.total} concepts are fictional demo records.</p></div><Link href="/preview/studio/products">View catalogue <span aria-hidden="true">↗</span></Link></header>
          <div className={styles.tierBar} aria-hidden="true">{data.tiers.map((tier) => <span key={tier.tier} data-tier={tier.tier} style={{ width: `${data.total ? tier.count / data.total * 100 : 0}%` }} />)}</div>
          <div className={styles.tableWrap}><table className={styles.tierTable}><caption className="sr-only">Demo product totals, working drafts and missing visuals by tier</caption><thead><tr><th scope="col">Collection</th><th scope="col">Concepts</th><th scope="col">Drafts*</th><th scope="col">Missing visuals</th></tr></thead><tbody>{data.tiers.map((tier) => <tr key={tier.tier}><th scope="row"><Link href={`/preview/studio/products?tier=${tier.tier}`}><i data-tier={tier.tier} aria-hidden="true" />{tier.label}</Link></th><td>{tier.count}</td><td>{tier.drafts}</td><td>{tier.pendingVisuals}</td></tr>)}</tbody></table></div>
          <p className={styles.footnote}>* Includes draft and in-review fixture states. “Demo visible” is separate from a working draft; it never means published business stock.</p>
        </section>
        <section className={styles.panel} aria-labelledby="attention-heading"><header className={styles.panelHeading}><div><h2 id="attention-heading">A few next steps</h2><p>Selected source records needing attention.</p></div></header><div className={styles.attention}>{data.attention.length ? data.attention.map((item) => <Link key={item.id} href={`/preview/studio/products/${item.id}`}><span className={styles.recordId}>{item.id}</span><span><strong>{item.title}</strong><small>{item.issue}</small></span><span aria-hidden="true">↗</span></Link>) : <p className={styles.footnote}>No matching sample records in this source snapshot.</p>}</div></section>
      </div>
      <section className={styles.panel} aria-labelledby="operations-heading"><header className={styles.panelHeading}><div><h2 id="operations-heading">Operations</h2><p>These services have no connected dataset in this preview.</p></div><span className={styles.badge}>Integration pending</span></header><div className={styles.operations}>{[
        { label: "Enquiry inbox", detail: "No saved enquiries or response backlog", href: "/preview/studio/modules/inquiries" },
        { label: "Large-project pipeline", detail: "No persisted project or order stages", href: "/preview/studio/modules/inquiries" },
        { label: "File imports", detail: "No import runs or failure history", href: "/preview/studio/modules/imports" },
      ].map((item) => <Link href={item.href} key={item.label}><h3>{item.label}<span aria-hidden="true">↗</span></h3><p>Not connected</p><small>{item.detail}</small></Link>)}</div></section>
      <div className={styles.grid}>
        <section className={styles.panel} aria-labelledby="content-heading"><header className={styles.panelHeading}><div><h2 id="content-heading">Demo content progress</h2><p>Authored source toward the Revision 8 targets.</p></div></header><div className={styles.progressList}>{data.content.map((item) => <Link href={item.href} key={item.label}><span>{item.label}<strong>{item.count}<small> / {item.target}</small></strong></span><div aria-hidden="true"><i style={{ width: `${Math.min(100, item.count / item.target * 100)}%` }} /></div></Link>)}</div><p className={styles.footnote}>Fictional testimonials and enquiry/order scenarios are still to be authored. Content counts do not indicate owner approval or database insertion.</p></section>
        <section className={`${styles.panel} ${styles.mediaPanel}`} aria-labelledby="media-heading"><p className={styles.eyebrow}>Media readiness</p><h2 id="media-heading">Make the gaps visible.</h2><p><strong>{data.conceptVisuals}</strong> supplied concept visuals.<br /><strong>{data.pendingVisuals}</strong> concepts awaiting imagery.</p><p className={styles.footnote}>Concept visualizations are labelled. Rights approval, provenance review and documentary product photography remain distinct from having a preview image.</p><Link href="/preview/studio/products?media=VISUAL_PENDING">See concepts awaiting visuals <span aria-hidden="true">↗</span></Link></section>
      </div>
    </>}
  </div>;
}

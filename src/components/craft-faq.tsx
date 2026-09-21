import Form from "next/form";
import Link from "next/link";
import { Arrow } from "@/components/ui/arrow";
import { faqGroups, faqs, type FaqGroupId, type FaqRecord } from "@/lib/faqs";
import styles from "./craft-faq.module.css";

type FaqQuery = Readonly<{ topic: "all" | FaqGroupId; q: string; adjusted: boolean }>;

/** Search controls are presentation-only; no query is submitted to a search service. */
export function readFaqQuery(searchParams: Record<string, string | string[] | undefined>): FaqQuery {
  const rawTopic = searchParams.topic;
  const topic = typeof rawTopic === "string" && faqGroups.some((group) => group.id === rawTopic)
    ? rawTopic as FaqGroupId
    : "all";
  const rawQuery = searchParams.q;
  const q = typeof rawQuery === "string" ? rawQuery.trim().slice(0, 120) : "";
  const adjusted = (rawTopic !== undefined && rawTopic !== "all" && topic === "all")
    || Array.isArray(rawQuery) || (typeof rawQuery === "string" && rawQuery.trim().length > 120);
  return { topic, q, adjusted };
}

function topicHref(topic: "all" | FaqGroupId, q: string) {
  const query = new URLSearchParams();
  if (topic !== "all") query.set("topic", topic);
  if (q) query.set("q", q);
  return `/faq${query.size ? `?${query}` : ""}#faq-results`;
}

/** Native disclosure keeps each answer available without client JavaScript or animation. */
export function FaqAnswers({ items }: { items: readonly FaqRecord[] }) {
  return (
    <div className={styles.answers}>
      {items.map((item) => (
        <details id={item.id} key={item.id} className={styles.answer}>
          <summary>
            <span className={styles.question}>{item.question}</span>
            <span className={styles.toggle} aria-hidden="true" />
          </summary>
          <div className={styles.answerBody}>
            <p className={styles.draftLabel}>Sample answer · owner review pending</p>
            <p>{item.answer}</p>
            {item.previewNote && <p className={styles.previewNote}><strong>In this preview</strong>{item.previewNote}</p>}
            {item.references.length > 0 && (
              <ul className={styles.references} aria-label="Related pages">
                {item.references.map((reference) => (
                  <li key={reference.href}><Link href={reference.href}>{reference.label}<span aria-hidden="true">↗</span></Link></li>
                ))}
              </ul>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

export function CraftFAQ({ query }: { query: FaqQuery }) {
  const search = query.q.toLocaleLowerCase("en-IN");
  const matching = faqs.filter((item) => (
    (query.topic === "all" || item.groupId === query.topic)
    && (!search || `${item.question} ${item.answer} ${item.previewNote ?? ""}`.toLocaleLowerCase("en-IN").includes(search))
  ));
  const filtered = query.topic !== "all" || Boolean(query.q);
  const selectedGroup = faqGroups.find((group) => group.id === query.topic);

  return (
    <section className={styles.browser} aria-labelledby="faq-browser-heading">
      <aside className={styles.sidebar}>
        <div className={styles.sidebarIntro}>
          <p className="eyebrow">A little clarity</p>
          <h2 id="faq-browser-heading">Before the<br />conversation.</h2>
          <p>From the first idea to the details worth asking. Choose a topic or look for a word.</p>
        </div>
        <nav aria-label="FAQ topics" className={styles.topics}>
          <Link href={topicHref("all", query.q)} aria-current={query.topic === "all" ? "true" : undefined}>
            <span>All questions</span><span>{faqs.length}</span>
          </Link>
          {faqGroups.map((group, index) => (
            <Link key={group.id} href={topicHref(group.id, query.q)} aria-current={query.topic === group.id ? "true" : undefined}>
              <span><span className={styles.topicNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{group.label}</span>
              <span>{faqs.filter((item) => item.groupId === group.id).length}</span>
            </Link>
          ))}
        </nav>
        <p className={styles.sidebarNote}>These drafts explain a proposed experience. Real specifications, policies and service details need the studio&apos;s approval.</p>
      </aside>

      <div id="faq-results" className={styles.results}>
        <Form action="/faq#faq-results" key={`${query.topic}:${query.q}`} className={styles.search} role="search" aria-label="Search FAQs">
          {query.topic !== "all" && <input type="hidden" name="topic" value={query.topic} />}
          <label htmlFor="faq-search">Find a question</label>
          <div className={styles.searchControls}>
            <input id="faq-search" name="q" type="search" maxLength={120} defaultValue={query.q} placeholder="Try dimensions, flowers or gifts" aria-describedby="faq-search-hint" />
            <button className="button button-primary" type="submit">Search <Arrow /></button>
          </div>
          <p id="faq-search-hint">Search sample answers only. Please leave out personal details.</p>
        </Form>

        <div className={styles.resultSummary}>
          <p role="status">
            {matching.length} {matching.length === 1 ? "question" : "questions"}
            {selectedGroup ? ` in ${selectedGroup.label}` : " across all topics"}
            {query.q && <> for <span className={styles.searchTerm}>“{query.q}”</span></>}
          </p>
          {(filtered || query.adjusted) && <Link className="text-link" href="/faq#faq-results">Reset filters <span aria-hidden="true">↗</span></Link>}
        </div>
        {query.adjusted && <p className={styles.adjusted}>Unrecognized or repeated filters were reset. Search terms are limited to 120 characters.</p>}

        {matching.length ? faqGroups.map((group, index) => {
          const items = matching.filter((item) => item.groupId === group.id);
          if (!items.length) return null;
          return (
            <section key={group.id} aria-labelledby={`faq-group-${group.id}`} className={styles.group}>
              <div className={styles.groupHeading}>
                <span className="eyebrow" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3 id={`faq-group-${group.id}`}>{group.label}</h3>
              </div>
              <FaqAnswers items={items} />
            </section>
          );
        }) : (
          <div className={styles.empty}>
            <p className="eyebrow">A question yet to be explored</p>
            <h3>No sample answers match.</h3>
            <p>Try a shorter word, choose another topic or return to all forty-two questions.</p>
            <Link className="button" href="/faq#faq-results">See all questions <Arrow /></Link>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Server fixture adapter for guarded Studio routes. Do not import this module
 * into a client component: journal source includes every full article body.
 * These functions do not save, publish or mutate the original source records.
 */
import { concepts } from "@/lib/catalogue";
import type { ContentDocument, ContentDocumentSummary, ContentKind, ContentReferences } from "@/lib/content-contracts";
import { createPageSection, type PageSection, type SectionType } from "@/lib/content-sections";
import { emptyRichText, textToRichText, type RichTextValue } from "@/lib/content-richtext";
import {
  careTopics, contactJourneys, editorialPages, editorialWorlds, materialDirections,
  planningSteps, professionalBriefAreas, type EditorialPageKey,
} from "@/lib/editorial";
import { faqs } from "@/lib/faqs";
import { journalArticles, type JournalArticle } from "@/lib/journal";
import { studioMediaAssets, type AssetReference } from "@/lib/studio-media";
import { DEMO_TESTIMONIAL_LABEL, testimonials } from "@/lib/testimonials";

const pageDraftNote = "Composer starting draft derived from the existing sample editorial direction. It is not a saved or published version of the current website.";
const pageKeys = Object.keys(editorialPages) as EditorialPageKey[];

function baseDocument(kind: ContentKind, id: string, title: string, slug: string): ContentDocument {
  return {
    id, kind, schemaVersion: 1, title, slug, summary: "", body: emptyRichText(),
    sections: [], cover: null, relatedProductIds: [], category: "Spaces",
    faqGroup: "commissioning", identity: "", tier: "LARGE", seoTitle: title,
    seoDescription: "", sourceRoute: null, originKind: "DEMO_FIXTURE",
    contentStatus: "OWNER_REVIEW_DRAFT", archived: false,
  };
}

function previewImage(id: string): AssetReference | null {
  const asset = studioMediaAssets.find((item) => item.id === id && item.status === "PREVIEW_ONLY" && item.src);
  return asset ? { assetId: asset.id, alt: asset.alt, caption: asset.caption, focalPoint: { x: 50, y: 50 } } : null;
}

function section(type: SectionType, id: string, fields: Partial<PageSection["fields"]> = {}): PageSection {
  const block = createPageSection(type, id);
  return { ...block, fields: { ...block.fields, ...fields } };
}

function heading(text: string): RichTextValue {
  return { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text }] };
}

function paragraphs(text: readonly string[]): RichTextValue[] {
  return textToRichText(text).content ?? [];
}

function checklist(items: readonly string[]): RichTextValue {
  return { type: "bulletList", content: items.map((text) => ({ type: "listItem", content: paragraphs([text]) })) };
}

function articleBody(article: JournalArticle): RichTextValue {
  return {
    type: "doc",
    content: article.sections.flatMap((item) => [
      heading(item.heading), ...paragraphs(item.paragraphs),
      ...(item.checklist?.length ? [checklist(item.checklist)] : []),
    ]),
  };
}

function pageSections(key: EditorialPageKey): PageSection[] {
  const page = editorialPages[key];
  const blocks: PageSection[] = [section("hero", `${page.id}-opening`, {
    heading: page.title, body: page.description, eyebrow: "Sample editorial direction / Owner review required",
    ...(key === "about" ? { media: previewImage("media-riverline") } : {}),
  })];

  if (key === "about") {
    blocks.push(section("material-story", "EP001-perspective", {
      heading: "An object changes how a space feels.",
      body: "A table can anchor a room before anything is placed on it. An edge can catch the eye; a quieter form can let the material do the talking. That relationship between an object and its surroundings leads the RivyaLivingArt design direction.",
    }), section("three-world-intro", "EP001-worlds", {
      heading: "The scale changes. The intention stays personal.",
      body: "Furniture, memory art and personal objects share a material-led point of view. Verified maker and workshop details remain to be supplied and reviewed.",
    }));
  }

  if (key === "process") {
    blocks.push(section("commission-process", "EP002-planning", {
      heading: "Shape the idea. Clarify the unknowns.",
      body: "A considered brief gives a creative idea somewhere to go. These sample steps describe preparing a brief, not a verified fabrication process or production schedule.",
    }));
  }

  if (key === "materials") {
    for (const material of materialDirections) {
      blocks.push(section("material-story", `EP003-${material.id}`, {
        heading: `${material.title}. ${material.phrase}`, eyebrow: `${material.number} / A visual direction`,
        body: `${material.body}\n\nQuestions for a real specification:\n${material.considerations.join("\n")}`,
        href: `/collectible-design?material=${material.id}`, linkLabel: `Explore ${material.title.toLowerCase()} concepts`,
      }));
    }
  }

  if (key === "care") {
    for (const topic of careTopics) {
      blocks.push(section("material-story", `EP004-topic-${topic.number}`, {
        heading: topic.title, eyebrow: `${topic.number} / Questions to ask`,
        body: `${topic.intro}\n\n${topic.questions.join("\n")}`, href: "/faq", linkLabel: "Read the sample FAQ",
      }));
    }
  }

  if (key === "contact") {
    for (const journey of contactJourneys) {
      blocks.push(section("contact", `EP005-journey-${journey.number}`, {
        heading: journey.title, eyebrow: `${journey.number} / Choose a sample brief`,
        body: `${journey.body} ${journey.details} These forms create a local fictional summary only; no message is sent.`,
        href: journey.href, linkLabel: journey.label,
      }));
    }
  }

  if (key === "architects") {
    for (const area of professionalBriefAreas) {
      blocks.push(section("project-story", `EP006-area-${area.number}`, {
        heading: area.title, eyebrow: `${area.number} / A fictional professional brief`,
        body: `${area.body}\n\n${area.prompts.join("\n")}`, href: "/commission", linkLabel: "Explore a sample commission",
      }));
    }
  }

  if (key !== "contact") blocks.push(section("contact", `${page.id}-conversation`));
  return blocks;
}

function pageBody(key: EditorialPageKey): RichTextValue {
  const content = [heading(editorialPages[key].title), ...paragraphs([editorialPages[key].description, pageDraftNote])];
  if (key === "about") {
    for (const world of editorialWorlds) content.push(heading(world.title), ...paragraphs([world.scale, world.description]));
  } else if (key === "process") {
    for (const step of planningSteps) content.push(heading(step.title), ...paragraphs([step.body, step.question, step.outcome]));
  } else if (key === "materials") {
    for (const material of materialDirections) content.push(heading(material.title), ...paragraphs([material.phrase, material.body]), checklist(material.considerations));
  } else if (key === "care") {
    for (const topic of careTopics) content.push(heading(topic.title), ...paragraphs([topic.intro]), checklist(topic.questions));
  } else if (key === "contact") {
    for (const journey of contactJourneys) content.push(heading(journey.title), ...paragraphs([journey.body, journey.details]));
  } else {
    for (const area of professionalBriefAreas) content.push(heading(area.title), ...paragraphs([area.body]), checklist(area.prompts));
  }
  return { type: "doc", content };
}

function homepageDocument(): ContentDocument {
  const draft = baseDocument("page", "CP001", "Homepage · furniture first", "home");
  draft.summary = pageDraftNote;
  draft.seoDescription = "Furniture, memory art and personal objects, explored through explicitly labelled fictional studies.";
  draft.sourceRoute = "/";
  draft.cover = previewImage("media-riverline");
  draft.body = textToRichText([pageDraftNote]);
  draft.sections = [
    section("hero", "CP001-opening", { heading: "A different kind of presence.", body: "Expressive materials. Considered forms. A world of resin art, imagined around you.", eyebrow: "Resin furniture & spatial art", media: previewImage("media-riverline") }),
    section("category-discovery", "CP001-discovery"),
    section("product-selection", "CP001-furniture", { heading: "A conversation between form & feeling.", referenceIds: ["DP001", "DP013", "DP043", "DP035"] }),
    section("material-story", "CP001-material", { heading: "Fluid by nature. Personal by intention.", body: "RivyaLivingArt brings furniture, memories and personal objects into one artistic language. The scale changes. The attention to how an object feels in your world does not. This sample narrative awaits owner review." }),
    section("three-world-intro", "CP001-worlds"),
    section("journal-selection", "CP001-journal", { referenceIds: journalArticles.slice(0, 3).map((article) => article.id) }),
    section("commission-process", "CP001-process"),
    section("contact", "CP001-conversation"),
  ];
  return draft;
}

/** Lightweight list rows: no article bodies or rich text are returned. */
export function getContentSummaries(): ContentDocumentSummary[] {
  return [
    { id: "CP001", kind: "page", title: "Homepage · furniture first", slug: "home", description: pageDraftNote, mediaState: "PREVIEW_ONLY", sourceRoute: "/", schemaVersion: 1 },
    ...pageKeys.map((key): ContentDocumentSummary => {
      const page = editorialPages[key];
      return { id: page.id, kind: "page", title: page.title, slug: key, description: page.description, mediaState: key === "about" ? "PREVIEW_ONLY" : "NOT_REQUIRED", sourceRoute: `/${key}`, schemaVersion: 1 };
    }),
    ...journalArticles.map((article): ContentDocumentSummary => ({ id: article.id, kind: "article", title: article.title, slug: article.slug, description: article.excerpt, mediaState: "PENDING", sourceRoute: `/journal/${article.slug}`, schemaVersion: 1 })),
    ...faqs.map((faq): ContentDocumentSummary => ({ id: faq.id, kind: "faq", title: faq.question, slug: faq.id.toLowerCase(), description: faq.answer, mediaState: "NOT_REQUIRED", sourceRoute: `/faq#${faq.id}`, schemaVersion: 1 })),
    ...testimonials.map((item): ContentDocumentSummary => ({ id: item.id, kind: "testimonial", title: `${item.identity} · fictional sample`, slug: item.id.toLowerCase(), description: item.quote, mediaState: "NOT_REQUIRED", sourceRoute: null, schemaVersion: 1 })),
  ];
}

export function getContentDocument(id: string): ContentDocument | undefined {
  if (id === "CP001") return homepageDocument();
  const pageKey = pageKeys.find((key) => editorialPages[key].id === id);
  if (pageKey) {
    const page = editorialPages[pageKey];
    return {
      ...baseDocument("page", page.id, page.title, pageKey), summary: pageDraftNote,
      body: pageBody(pageKey), sections: pageSections(pageKey),
      cover: pageKey === "about" ? previewImage("media-riverline") : null,
      seoDescription: page.description, sourceRoute: `/${pageKey}`,
    };
  }
  const article = journalArticles.find((item) => item.id === id);
  if (article) return {
    ...baseDocument("article", article.id, article.title, article.slug), summary: article.excerpt,
    body: articleBody(article), category: article.category, relatedProductIds: [...article.relatedProductIds],
    seoDescription: article.excerpt, sourceRoute: `/journal/${article.slug}`,
  };
  const faq = faqs.find((item) => item.id === id);
  if (faq) return {
    ...baseDocument("faq", faq.id, faq.question, faq.id.toLowerCase()), summary: faq.previewNote ?? "Sample answer · owner review pending.",
    body: textToRichText([faq.answer]), faqGroup: faq.groupId, seoDescription: faq.answer, sourceRoute: `/faq#${faq.id}`,
  };
  const testimonial = testimonials.find((item) => item.id === id);
  if (testimonial) return {
    ...baseDocument("testimonial", testimonial.id, `${testimonial.identity} · fictional sample`, testimonial.id.toLowerCase()),
    summary: DEMO_TESTIMONIAL_LABEL, body: textToRichText([testimonial.quote]), identity: testimonial.identity,
    tier: testimonial.tier, seoDescription: "Fictional sample content for an isolated layout preview; never a real customer review.",
  };
  return undefined;
}

/** Starting values only; opening this draft does not create a stored record. */
export function newContentDocument(kind: ContentKind): ContentDocument {
  const draft = baseDocument(kind, `LOCAL-${kind}`, `Untitled sample ${kind}`, `untitled-sample-${kind}`);
  draft.summary = kind === "testimonial" ? DEMO_TESTIMONIAL_LABEL : "New local sample draft. Add fictional content only; leaving the editor discards these changes.";
  if (kind === "page") draft.sections = [section("hero", "LOCAL-page-opening")];
  if (kind === "testimonial") draft.identity = "Demo Reviewer — local draft";
  return draft;
}

/** Public-safe relation candidates; full article bodies stay on the server. */
export function getContentReferences(): ContentReferences {
  return {
    products: concepts,
    articles: journalArticles.map(({ id, slug, title, excerpt, category }) => ({ id, slug, title, excerpt, category })),
    faqs,
    testimonials,
    media: studioMediaAssets,
  };
}

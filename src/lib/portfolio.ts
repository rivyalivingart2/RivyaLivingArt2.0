import { concepts, type Concept, type ProductTier } from "@/lib/catalogue";

/** Fictional design briefs for protected preview, never a record of delivered work. */
export type PortfolioStudy = Readonly<{
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tier: Extract<ProductTier, "LARGE" | "MEDIUM">;
  focus: string;
  excerpt: string;
  brief: string;
  primaryProductId: string;
  relatedProductIds: readonly string[];
  spatialQuestions: readonly string[];
  materialDirection: string;
  openQuestions: readonly string[];
  sections: readonly Readonly<{ heading: string; paragraphs: readonly string[] }>[];
  ownerReviewNote: string;
  originKind: "DEMO_FIXTURE";
  demoFixtureKey: string;
  demoBatchId: "rivya-r8-visual-2026-09";
  demoVersion: 1;
  contentStatus: "DEMO_VISIBLE";
}>;

const provenance = {
  originKind: "DEMO_FIXTURE",
  demoBatchId: "rivya-r8-visual-2026-09",
  demoVersion: 1,
  contentStatus: "DEMO_VISIBLE",
} as const;

export const portfolioStudies: readonly PortfolioStudy[] = [
  {
    ...provenance,
    id: "DS001",
    demoFixtureKey: "portfolio:DS001",
    slug: "quiet-dining-room",
    title: "A quiet room. A singular table.",
    subtitle: "A dining-room composition around Riverline",
    tier: "LARGE",
    focus: "Dining / proportion / material rhythm",
    excerpt: "An imagined dining setting begins with the line of one table, then asks how chairs, light and movement can give it room to breathe.",
    brief: "Imagine a dining space that welcomes everyday use while giving one expressive object a clear place in the room. This fictional brief starts with the Riverline table concept and a restrained surrounding palette. The question is how to balance its irregular wood edge and resin passage with the quieter lines of the room, without treating an attractive image as a measured plan.",
    primaryProductId: "DP001",
    relatedProductIds: ["DP001", "DP043"],
    spatialQuestions: [
      "Where do people enter, sit and move when the chairs are in use?",
      "Which sightline should reveal the table's material composition first?",
      "How will existing lighting and nearby objects affect the visual balance?",
    ],
    materialDirection: "The Riverline concept places an expressive wood edge beside a resin passage. A muted textile, a quiet wall colour and a restrained metal detail could form a supporting palette. These are visual relationships to discuss; an actual wood selection, resin formulation and finish would need physical review.",
    openQuestions: [
      "Verified room, access and furniture measurements; a concept image establishes none of these.",
      "Chair clearance, intended seating and comfort with the proposed table base.",
      "Actual material samples, construction, weight and delivery arrangements.",
      "Scope, price, schedule and care guidance for the eventual piece.",
    ],
    sections: [
      {
        heading: "Let the table set the rhythm.",
        paragraphs: [
          "A long table can offer the first line in a composition. In this study, the proposed arrangement would align that line with a useful view through the room, while keeping surrounding objects visually calm. The intention is to let the wood and resin be read together, with enough open surface and negative space to see their relationship.",
          "The Riverline image is an approved concept reference for the object, not evidence of this imagined room. No interior, client or completed installation is represented. The accompanying Petal chair remains a separate fictional study; its presence here raises a question about form, not a claim that the pair has been fabricated or evaluated together.",
        ],
      },
      {
        heading: "Draw the lived-in arrangement.",
        paragraphs: [
          "A useful next drawing would show more than the table's outline. It would include chairs pulled back, the route between adjoining spaces and any doors or fixed joinery that affect movement. Those details turn an atmospheric direction into questions a real consultation can resolve.",
          "Lighting also belongs in that conversation. A reference viewed on a screen cannot establish how a physical surface will look throughout the day. Before agreeing a design, the room conditions, proposed materials and practical requirements would need to be considered together.",
        ],
      },
    ],
    ownerReviewNote: "Fictional editorial study only. Replace it with an owner-approved project record, appropriate image rights and verified specifications before presenting any work as delivered.",
  },
  {
    ...provenance,
    id: "DS002",
    demoFixtureKey: "portfolio:DS002",
    slug: "room-around-an-open-centre",
    title: "A room around an open centre.",
    subtitle: "A spatial study with Basin and Horizon",
    tier: "LARGE",
    focus: "Living space / negative space / scale",
    excerpt: "A low central form and a measured wall accent suggest two ways to give an imagined living space a focal point without filling every edge.",
    brief: "This fictional living-space brief brings the Basin coffee-table concept into conversation with the Horizon wall-panel study. One sits low in the room; the other suggests a horizontal line at the wall. The imagined composition explores the space between them, keeping circulation, seating and the room's existing features open for discussion.",
    primaryProductId: "DP013",
    relatedProductIds: ["DP013", "DP057", "DP025"],
    spatialQuestions: [
      "Which everyday routes should remain clear around the central object?",
      "Does the wall need a focal point, or would leaving it quiet strengthen the room?",
      "How should the central table relate to the existing seat heights and reach?",
    ],
    materialDirection: "Basin provides a shallow, low visual reference; Horizon introduces a different scale of resin and mineral-composite expression. A connection could come from colour or rhythm rather than a promised exact match. No panel mounting method, wall suitability or material-performance specification is established by this pairing.",
    openQuestions: [
      "Measured furniture positions and actual clearances for the intended users.",
      "Whether the wall panel belongs in the brief and how its mounting would be assessed.",
      "The final table height, supporting structure and verified material samples.",
      "Handling, access, placement and installation scope before any agreement.",
    ],
    sections: [
      {
        heading: "Compose with the space between.",
        paragraphs: [
          "The centre of a living room can carry a strong form without becoming its busiest area. This study imagines Basin as a low visual anchor, with nearby objects chosen for the space they leave around it. A quieter perimeter would make it easier to read the table's silhouette and the paths through the room.",
          "An open centre is a compositional intention, not a prescribed clearance. The actual furniture arrangement, access needs and use of the room must shape a measured proposal. Nothing in this study confirms that the sample dimensions will suit a particular space.",
        ],
      },
      {
        heading: "Give each scale a reason to be there.",
        paragraphs: [
          "The Horizon panel offers a way to consider a second focal point. Its imagined horizontal rhythm might continue the room's language, or it might compete with features already present. Either outcome is useful to discuss. A good brief allows an object to be removed when the space becomes clearer without it.",
          "Twinleaf appears as another conversation point for a smaller surface beside seating. It is not a matching set or a recommended technical specification. The links below keep each concept's own sample information visible so that their differences remain part of the design conversation.",
        ],
      },
    ],
    ownerReviewNote: "This is an invented spatial brief, with no real client, site, installation or project outcome. Basin's visual is an object concept only; room and panel imagery remain pending.",
  },
  {
    ...provenance,
    id: "DS003",
    demoFixtureKey: "portfolio:DS003",
    slug: "a-place-for-the-vows",
    title: "A place for the vows.",
    subtitle: "A quiet display for a wedding memory",
    tier: "MEDIUM",
    focus: "Memory / display / personal meaning",
    excerpt: "An imagined keepsake brief begins with what someone wants to remember, then considers format, breathing room and the details best kept private.",
    brief: "The Vow framed-varmala concept is the starting point for this fictional memory-art study. It imagines a display in which a botanical arrangement carries the story, with wording used only where it adds meaning. No real flowers, names, wedding or customer materials are included. The brief explores a conversation that could precede a suitability review.",
    primaryProductId: "DP085",
    relatedProductIds: ["DP085", "DP099"],
    spatialQuestions: [
      "Will the object be seen closely, across a room or beside other keepsakes?",
      "Would a frame or a different proposed format give the composition more clarity?",
      "Which personal details should appear on display, and which should remain private?",
    ],
    materialDirection: "The study considers the visual relationship between a botanical arrangement, open background and a restrained frame. Any real flowers, paper, fittings and resin would need individual assessment. No handling method, colour-retention promise or preservation outcome follows from the concept.",
    openQuestions: [
      "The condition and suitability of the actual materials, reviewed before anything is sent.",
      "Current studio instructions for acceptance, timing, packaging and delivery address.",
      "The exact names, local calendar date and typography, if personalization is requested.",
      "Confirmed display, mounting and care guidance for the eventual physical object.",
    ],
    sections: [
      {
        heading: "Begin with what matters.",
        paragraphs: [
          "A keepsake brief can begin with a small question: which part of the memory should the object hold? In this imagined example, the answer is the rhythm of the flowers, rather than a dense arrangement of words and symbols. Space around the botanical elements would give each part a role in the composition.",
          "That intention does not decide how the material can be treated. An actual discussion must begin with its condition and the owner's confirmed process. Irreplaceable items should remain with their owner until suitability and current transfer instructions have been agreed.",
        ],
      },
      {
        heading: "Keep meaning clear, and details considered.",
        paragraphs: [
          "If names or a date were part of a real brief, their spelling, arrangement and privacy would deserve a separate review. A screen layout might help discuss the balance, while the final scale and lettering would still need confirmation for the chosen format. No private identity is needed to explore those choices in this preview.",
          "The Letterlight invitation-frame study offers an alternative way to centre a memory. It is included as a separate concept, not as a promise that a particular original document can be preserved. The final decision about flowers, paper or another keepsake belongs to a careful conversation about the actual item.",
        ],
      },
    ],
    ownerReviewNote: "Fictional memory-art brief; no preservation work has been carried out or documented. Visuals are pending. Owner review is required before any process, care or material-acceptance wording becomes live business copy.",
  },
];

export function findPortfolioStudy(slug: string): PortfolioStudy | undefined {
  return portfolioStudies.find((study) => study.slug === slug);
}

export function portfolioConcepts(study: PortfolioStudy): Concept[] {
  return study.relatedProductIds.flatMap((id) => {
    const piece = concepts.find((concept) => concept.id === id);
    return piece ? [piece] : [];
  });
}

export function portfolioPrimaryConcept(study: PortfolioStudy): Concept | undefined {
  return concepts.find((piece) => piece.id === study.primaryProductId);
}

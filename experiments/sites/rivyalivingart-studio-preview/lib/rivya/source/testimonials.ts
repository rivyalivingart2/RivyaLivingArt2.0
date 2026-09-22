/** Protected-preview source fixtures, never customer evidence or live reviews. */
export const DEMO_TESTIMONIAL_LABEL = "Fictional sample — not a customer review." as const;

export type TestimonialRecord = {
  readonly id: string;
  readonly identity: string;
  readonly quote: string;
  readonly tier: "LARGE" | "MEDIUM" | "SMALL";
  readonly originKind: "DEMO_FIXTURE";
  readonly demoVersion: 1;
  readonly contentStatus: "OWNER_REVIEW_DRAFT";
  readonly label: typeof DEMO_TESTIMONIAL_LABEL;
};

function fixture(id: string, identity: string, quote: string, tier: TestimonialRecord["tier"]): TestimonialRecord {
  return {
    id,
    identity,
    quote,
    tier,
    originKind: "DEMO_FIXTURE",
    demoVersion: 1,
    contentStatus: "OWNER_REVIEW_DRAFT",
    label: DEMO_TESTIMONIAL_LABEL,
  };
}

// Copy and identities come from Section 6 of the supplied Revision 8 blueprint.
// These records remain fictional even when their local draft text is edited.
export const testimonials: readonly TestimonialRecord[] = [
  fixture("DT001", "Demo Reviewer 01", "The sample table gives the room a calm focal point without overwhelming the surrounding furniture.", "LARGE"),
  fixture("DT002", "Demo Reviewer 02", "This example highlights how useful a clear dimension drawing can be during a design conversation.", "LARGE"),
  fixture("DT003", "Demo Reviewer 03", "The concept pairs a strong silhouette with enough empty space to appreciate the material.", "LARGE"),
  fixture("DT004", "Demo Reviewer 04", "The sample gallery makes it easy to compare the full object with its close-up details.", "LARGE"),
  fixture("DT005", "Demo Reviewer 05", "This fictional project shows how an entry console can connect different textures in a room.", "LARGE"),
  fixture("DT006", "Demo Reviewer 06", "The example presentation keeps the focus on the object rather than unnecessary decorative effects.", "LARGE"),
  fixture("DT007", "Demo Reviewer 07", "This sample response describes a client who appreciated seeing their preferences gathered into one brief.", "LARGE"),
  fixture("DT008", "Demo Reviewer 08", "The concept colour palette feels quiet and works well with the surrounding neutral materials.", "LARGE"),
  fixture("DT009", "Demo Reviewer 09", "The example side-table pair demonstrates how two related objects can still have individual character.", "LARGE"),
  fixture("DT010", "Demo Reviewer 10", "This fictional chair study presents a memorable shape and invites a more detailed specification discussion.", "LARGE"),
  fixture("DT011", "Demo Reviewer 11", "The sample project summary makes the sequence from enquiry to design review easy to understand.", "LARGE"),
  fixture("DT012", "Demo Reviewer 12", "This example illustrates a considered balance between sculptural presence and practical room planning.", "LARGE"),
  fixture("DT013", "Demo Reviewer 13", "The sample preservation frame keeps the flowers as the visual centre of the composition.", "MEDIUM"),
  fixture("DT014", "Demo Reviewer 14", "This fictional memory-art response emphasizes the importance of checking every name and date.", "MEDIUM"),
  fixture("DT015", "Demo Reviewer 15", "The concept clock combines a useful object with a personal visual story.", "MEDIUM"),
  fixture("DT016", "Demo Reviewer 16", "This sample review describes how a clear layout can make a keepsake feel less crowded.", "MEDIUM"),
  fixture("DT017", "Demo Reviewer 17", "The example invitation frame leaves enough space around the details that matter most.", "MEDIUM"),
  fixture("DT018", "Demo Reviewer 18", "This fictional nameplate concept feels personal while keeping the lettering easy to read.", "MEDIUM"),
  fixture("DT019", "Demo Reviewer 19", "The sample gift set shares a consistent colour direction without making every object identical.", "SMALL"),
  fixture("DT020", "Demo Reviewer 20", "This example bookmark shows how a small format can still carry a thoughtful design idea.", "SMALL"),
  fixture("DT021", "Demo Reviewer 21", "The fictional jewellery concept uses restrained detail rather than a busy arrangement.", "SMALL"),
  fixture("DT022", "Demo Reviewer 22", "This sample gifting response highlights the value of reviewing personalization before approval.", "SMALL"),
  fixture("DT023", "Demo Reviewer 23", "The example coaster collection feels cohesive when displayed together.", "SMALL"),
  fixture("DT024", "Demo Reviewer 24", "This fictional packaging study keeps the object and its message at the centre of attention.", "SMALL"),
];

/** Authored editorial fixtures for isolated preview, awaiting the owner's content review. */
export type EditorialPageKey = "about" | "process" | "materials" | "care" | "contact" | "architects";
export type EditorialPage = Readonly<{
  id: string;
  title: string;
  description: string;
  originKind: "DEMO_FIXTURE";
  demoVersion: 1;
  contentStatus: "OWNER_REVIEW_REQUIRED";
}>;

const editorialRecord = (id: string, title: string, description: string): EditorialPage => ({
  id, title, description, originKind: "DEMO_FIXTURE", demoVersion: 1,
  contentStatus: "OWNER_REVIEW_REQUIRED",
});

export const editorialPages: Readonly<Record<EditorialPageKey, EditorialPage>> = {
  about: editorialRecord("EP001", "About RivyaLivingArt", "A sample editorial introduction to furniture, memory art and personal objects, connected by a material-led point of view."),
  process: editorialRecord("EP002", "From a possibility to a considered brief", "A conceptual guide to preparing a furniture, preservation or gifting brief; the real studio process awaits owner review."),
  materials: editorialRecord("EP003", "A language of materials", "Explore wood, resin, metal and mineral as visual directions for fictional design studies."),
  care: editorialRecord("EP004", "Care begins with knowing your piece", "Questions to help request piece-specific material, finish and care information from the studio."),
  contact: editorialRecord("EP005", "Begin a conversation", "Choose a sample furniture, memory-art or personal-gifting brief. Verified contact channels are awaiting owner input."),
  architects: editorialRecord("EP006", "For architects & interior designers", "Prepare a fictional project brief around a room, a material direction and the practical requirements of a space."),
};

export type EditorialWorld = Readonly<{
  number: string; title: string; scale: string; description: string; href: string; label: string;
}>;

export const editorialWorlds: readonly EditorialWorld[] = [
  { number: "01", title: "Art for the space.", scale: "Collectible design", description: "Furniture leads the collection: a table that gathers a room, a console that marks an arrival, a sculptural form that gives a space its rhythm. Scale and everyday use belong beside material expression.", href: "/collectible-design", label: "Explore furniture & spatial art" },
  { number: "02", title: "Art for the memory.", scale: "Memory art", description: "Flowers, paper and meaningful objects suggest a different starting point. These studies explore how a personal story might find a form, with suitability and the handling of real keepsakes left for a studio conversation.", href: "/memory-art", label: "Explore memory art" },
  { number: "03", title: "Art for the person.", scale: "Personal art", description: "Smaller objects carry a more immediate gesture: a colour chosen for someone, an initial, a gift with a story behind it. The sample collection makes room for thoughtful details without losing simplicity.", href: "/personal-art", label: "Explore personal art" },
];

export type PlanningStep = Readonly<{
  number: string; title: string; body: string; question: string; outcome: string;
}>;

export const planningSteps: readonly PlanningStep[] = [
  { number: "01", title: "Start with what matters.", body: "For furniture, describe the room and the role of the piece. For memory art, describe the occasion and the items you hope to include. For a personal gift, begin with the recipient and the small detail that makes it theirs.", question: "What should this piece mean, and where would it belong?", outcome: "A clear intention, with references that explain the feeling you have in mind." },
  { number: "02", title: "Give the idea a direction.", body: "A shape, a colour relationship or a line of grain can help make an abstract preference easier to discuss. Use the fictional collection as a visual starting point. A screen image cannot establish the exact colour, texture or finish of a physical piece.", question: "Which proportions, material relationships and details draw you in?", outcome: "An initial direction to discuss, with any physical samples or suitability questions identified." },
  { number: "03", title: "Bring in the practical details.", body: "Dimensions, intended use, location and access all help describe a furniture project. Preservation asks different questions about the material and its current condition. Gifting adds choices such as quantity and permitted personalization. Mark anything you do not yet know.", question: "What needs to be confirmed before a real proposal is possible?", outcome: "A brief that separates known requirements from open questions." },
  { number: "04", title: "Agree the next step together.", body: "A real project would need the studio to confirm feasibility, specification, pricing and timing. Fabrication stages, material handling, delivery and care must come from an owner-approved process for that particular work. This preview does not book production or accept an order.", question: "Which details and responsibilities need written confirmation?", outcome: "A list of decisions for a future studio conversation, rather than an assumed commitment." },
];

export type MaterialDirection = Readonly<{
  id: "wood" | "resin" | "metal" | "mineral";
  number: string;
  title: string;
  phrase: string;
  body: string;
  considerations: readonly string[];
}>;

export const materialDirections: readonly MaterialDirection[] = [
  { id: "wood", number: "01", title: "Wood", phrase: "The rhythm of a line.", body: "Grain, tone and the shape of an edge give the fictional furniture studies a natural visual rhythm. A quiet grain pattern and a strongly figured one can suggest very different compositions, even when the overall form stays the same.", considerations: ["Which species and source would be used for the actual piece?", "Which grain, edge and colour differences should be expected?", "How would the intended finish affect its appearance and care?"] },
  { id: "resin", number: "02", title: "Resin", phrase: "Colour with a sense of depth.", body: "Resin is explored here through translucency, colour and the relationship between solid-looking and light-filled areas. These are visual ideas. A concept rendering does not establish a formula, a production method or the performance of a finished surface.", considerations: ["Which material system is suitable for the intended use?", "Can the studio confirm the tone and finish with a physical sample?", "What limitations, visible variation and care requirements apply?"] },
  { id: "metal", number: "03", title: "Metal", phrase: "A line that grounds the form.", body: "In the sample studies, metal introduces a different visual weight: a slender outline beneath a broad top, a dark plane against warm grain or a deliberate connection between parts. The detail of that connection belongs in the actual specification.", considerations: ["Which metal and surface finish are proposed?", "How would the base, joints and contact with the floor be resolved?", "What handling and maintenance information should accompany it?"] },
  { id: "mineral", number: "04", title: "Mineral", phrase: "A quieter, more solid presence.", body: "Mineral-inspired tones and textures bring a contrasting visual language to selected concepts. The fixture label describes a design direction; the actual material, composition, weight and finish have not been established by the illustration.", considerations: ["What is the exact material or composite in the proposed piece?", "What weight and support requirements need confirmation?", "Which variations and surface-care instructions apply to it?"] },
];

export type CareTopic = Readonly<{ number: string; title: string; intro: string; questions: readonly string[] }>;

export const careTopics: readonly CareTopic[] = [
  { number: "01", title: "Know the surface.", intro: "The name of a material is only a starting point. The actual finish and construction determine which guidance belongs with a piece.", questions: ["What are the confirmed materials, finish and any included components?", "Which cleaning method, cloth and products are approved for that finish?", "Which substances or treatments should be avoided, and why?"] },
  { number: "02", title: "Understand the setting.", intro: "Describe the conditions in the intended room so the studio can confirm whether the proposed piece is suitable.", questions: ["Is the piece intended for this indoor or outdoor setting?", "What guidance applies to light, temperature, moisture and nearby heat sources?", "Are any protective accessories or placement conditions required?"] },
  { number: "03", title: "Plan moving and installation.", intro: "A completed piece needs instructions specific to its weight, geometry, connections and destination. Those details are not established by a concept image.", questions: ["Who should move, assemble or install the piece?", "Which lifting points, access dimensions and support requirements apply?", "What should be checked at delivery, and how should a concern be reported?"] },
  { number: "04", title: "Keep the right information.", intro: "A useful care record ties the instructions to the particular object and its finish, rather than to a generic description of resin art.", questions: ["Can the studio supply the approved specification and care notes together?", "What is the process for asking about a spill, mark or repair?", "Are there piece-specific limits, service terms or warranty details to retain?"] },
];

export type ContactJourney = Readonly<{ number: string; title: string; body: string; details: string; href: string; label: string }>;

export const contactJourneys: readonly ContactJourney[] = [
  { number: "01", title: "A piece for your space.", body: "A furniture or spatial-art direction, shaped around a room and the way you use it.", details: "Explore a brief with dimensions, material preferences, location and access.", href: "/commission", label: "Try a commission brief" },
  { number: "02", title: "A story to keep close.", body: "An occasion, a flower, a letter or another meaningful item you would like to discuss.", details: "Choose a sample piece, describe the idea and note questions about material suitability.", href: "/preserve", label: "Try a preservation brief" },
  { number: "03", title: "A gesture for someone.", body: "A smaller object with a considered colour, an initial or a personal detail.", details: "Choose a sample gift, a permitted variant and the details you would like reviewed.", href: "/personalize", label: "Try a gifting brief" },
];

export const professionalBriefAreas: readonly Readonly<{ number: string; title: string; body: string; prompts: readonly string[] }>[] = [
  { number: "01", title: "The project context", body: "Explain the space before describing the object. A residential dining room, a shared arrival space and a hospitality setting can ask different things of a piece.", prompts: ["Project type, room and intended use", "Who uses the space and how the piece fits the plan", "Current project stage and decisions still open"] },
  { number: "02", title: "The design direction", body: "A concise reference can communicate atmosphere, proportion or a material relationship. Distinguish inspiration from specifications that the project actually requires.", prompts: ["Overall dimensions and preferred proportions", "Material, tone and finish preferences", "What is essential, flexible or awaiting a sample"] },
  { number: "03", title: "The site conditions", body: "Describe the destination and practical constraints in plain language. A future technical conversation would need to confirm measurements and installation responsibilities.", prompts: ["City and intended location within the project", "Doors, lifts, stairs and other access constraints", "Coordination, delivery or installation questions"] },
  { number: "04", title: "The decision process", body: "Make it clear how the project team expects to evaluate a proposal. Timing, budget and approvals are discussion inputs, not commitments created by a sample form.", prompts: ["Desired schedule and any fixed project milestones", "Indicative budget or a request to discuss feasibility", "Questions for the designer, client and studio to resolve"] },
];

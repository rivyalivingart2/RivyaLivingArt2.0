/**
 * Original, owner-review editorial fixtures for the protected frontend preview.
 * These six complete drafts are the first bounded batch of 36 planned articles.
 * Plain text is rendered by React; no pasted HTML or operational claims belong here.
 */
export type JournalCategory = "Spaces" | "Materials" | "Commissioning";

export type JournalSection = {
  id: string;
  heading: string;
  paragraphs: readonly string[];
  checklist?: readonly string[];
};

export type JournalArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: JournalCategory;
  tier: "LARGE";
  author: string;
  sampleDate: "2026-09-21";
  sections: readonly JournalSection[];
  relatedProductIds: readonly string[];
  imageBriefId: string;
  reviewNotes: readonly string[];
  originKind: "DEMO_FIXTURE";
  demoVersion: 1;
  contentStatus: "DEMO_VISIBLE";
};

export const journalCategoryOptions = [
  { value: "Spaces", label: "Spaces" },
  { value: "Materials", label: "Materials" },
  { value: "Commissioning", label: "Commissioning" },
] as const;

const editorialDefaults = {
  tier: "LARGE",
  author: "RivyaLivingArt — Demo Editorial",
  sampleDate: "2026-09-21",
  originKind: "DEMO_FIXTURE",
  demoVersion: 1,
  contentStatus: "DEMO_VISIBLE",
} as const;

export const journalArticles: readonly JournalArticle[] = [
  {
    ...editorialDefaults,
    id: "DB001",
    slug: "a-room-begins-with-a-statement-table",
    title: "A Room Begins with a Statement Table",
    excerpt: "Begin with the room around the object: sightlines, everyday movement and the kind of gathering you want a table to hold. A planning notebook for a future commission.",
    category: "Spaces",
    relatedProductIds: ["DP001", "DP002", "DP013"],
    imageBriefId: "JOURNAL-DB001",
    reviewNotes: [
      "Original demo editorial; owner approval is required before live publication.",
      "Related objects are fictional concepts, not completed commissions or available stock.",
      "Room measurements and access requirements need project-specific confirmation; this is not an installation specification.",
    ],
    sections: [
      {
        id: "begin-with-the-room",
        heading: "Begin with the room, before the object",
        paragraphs: [
          "A statement table gives a room somewhere to begin looking. That does not mean it must be the largest or brightest thing in view. Its presence might come from an unusually quiet outline, a visible meeting of materials, or the space deliberately left around it. Before choosing a design, stand at the room’s usual entrance and describe what you notice first. Then consider what you would like to notice first.",
          "Write down the room’s ordinary activities as well as its occasional gatherings. A dining space used for conversation, reading and homework presents a different brief from one opened mainly for guests. These observations are more useful than declaring a style immediately. They give the eventual discussion a purpose that can survive changes of colour, shape or finish.",
        ],
      },
      {
        id: "draw-the-visible-weight",
        heading: "Draw the visible weight",
        paragraphs: [
          "On a simple plan, mark the furniture that is staying. Include cupboards, a large sofa, open shelving and anything else that occupies a strong visual area. A substantial table beside another substantial object may feel concentrated; the same table in an open setting may read as a calm centre. Neither arrangement is inherently wrong. The useful question is whether that concentration matches the atmosphere you are trying to make.",
          "Look at the base as carefully as the top. A broad surface over separated supports creates a different pattern of open space from a continuous pedestal. In the fictional Riverline and Stillwater concepts, the material composition offers another way to think about emphasis. Available concept imagery is a discussion reference, not evidence of a finished object; Stillwater’s visual remains pending.",
        ],
      },
      {
        id: "map-everyday-movement",
        heading: "Map everyday movement",
        paragraphs: [
          "Sketch the routes between doorways and the places people actually use. Add the opening direction of doors, drawers and cabinets. A table footprint alone misses the changing outline made by someone pulling out a chair, carrying a tray or moving toward a window. Record the situations you need a designer to consider instead of treating an attractive overhead composition as a complete plan.",
          "Where appropriate, represent a proposed outline on the floor with a removable marker that will not damage the surface. Observe it during normal use and note awkward moments. This is a conversation aid, not a clearance certification. Ask the project team to confirm the dimensions and any relevant access or accessibility requirements for the particular room and the people who use it.",
        ],
      },
      {
        id: "make-a-material-conversation",
        heading: "Make a material conversation",
        paragraphs: [
          "Bring the table into a conversation with the room’s existing surfaces. Identify the most visible wood tone, the largest fabric area and the metal details you intend to keep. A reference board becomes more useful when each image carries a short explanation: the warmth of this timber, the restraint of that outline, or the relationship between an opaque area and a translucent one.",
          "Separate those visual preferences from material specifications. A screen image cannot settle exact colour, surface feel or suitability for a particular use. Ask which physical samples, drawings and care information would be available during a real commission. The protected catalogue uses sample material names and dimensions to develop the interface; they are starting points for a discussion, never a substitute for an approved specification.",
        ],
      },
      {
        id: "leave-space-for-change",
        heading: "Leave space for the rest of the room",
        paragraphs: [
          "A focal object does not need every surrounding choice to repeat it. Try describing the room in three layers: the table, the supporting furniture and the quieter background. Repetition can happen through one small relationship, such as a warm tone or a curve, while other elements remain distinct. This keeps the brief specific without turning the whole room into a matching set.",
          "Consider what is likely to change later. A rug, pendant or chair may be easier to replace than the commissioned object, but your own priorities should lead that decision. Make a list of fixed elements and flexible elements. It helps the conversation stay anchored when a reference image contains an appealing room whose architecture, light or proportions are very different from yours.",
        ],
      },
      {
        id: "prepare-the-first-conversation",
        heading: "Prepare the first conversation",
        paragraphs: [
          "A useful initial brief is a small set of clear observations. Include a measured room sketch with its units, photographs you are entitled to share, and a description of how the space is used. Label proposed dimensions as proposals. If an event or move influences the timing, state that context and ask what can realistically be assessed before committing to a date.",
          "Finish with the questions that remain open: which shape deserves exploration, how the base relates to seating, what finish information is needed and who will confirm the delivery route. In this preview, the commission form only creates a local demo summary. Use fictional details while exploring it; a real project will need the studio’s reviewed process and a separately agreed scope.",
        ],
      },
    ],
  },
  {
    ...editorialDefaults,
    id: "DB002",
    slug: "reading-the-grain-wood-and-resin-in-a-shared-composition",
    title: "Reading the Grain: Wood and Resin in a Shared Composition",
    excerpt: "Follow line, contrast and the meeting of surfaces. A visual vocabulary for discussing wood and resin without mistaking a concept image for a material specification.",
    category: "Materials",
    relatedProductIds: ["DP001", "DP013", "DP051"],
    imageBriefId: "JOURNAL-DB002",
    reviewNotes: [
      "Original demo editorial; all material descriptions are visual observations or questions.",
      "Approve any future photography and its actual product mapping before publication.",
      "No formulation, durability, environmental, food-contact or maintenance performance is certified by this draft.",
    ],
    sections: [
      {
        id: "look-for-direction",
        heading: "Look for direction before colour",
        paragraphs: [
          "When looking at a wood-and-resin composition, begin by tracing the lines you can see. Follow the apparent grain, the edge of the timber and the shape of the area between separate elements. Does your eye move along the length, pause at a curve or return toward the middle? Describing that movement gives you a more precise starting point than saying a surface feels natural or modern.",
          "The Riverline sample concept can serve as a visual prompt for this exercise. It is a labelled design study, not a record of an installed commission. If you use a concept image in a brief, identify the part that interests you. The direction of a line can be relevant even when the image’s colour, room setting or overall proportions are not.",
        ],
      },
      {
        id: "notice-the-interval",
        heading: "Notice the interval between materials",
        paragraphs: [
          "The meeting of wood and resin can be read as an interval: narrow in one place, open in another, regular or deliberately irregular. On a reference image, imagine the timber and the adjoining area as two flat shapes. This removes some of the distraction of shine and room styling. It makes the relationship between the shapes easier to describe in a commission conversation.",
          "A thin interval might suggest a continuous drawing across the top, while a broader area might become the main visual field. Those are compositional impressions, not manufacturing instructions. The way a real object is constructed, supported and finished needs a separate technical discussion. A reference can communicate a preference without promising that the same effect is feasible at a different size or in another material combination.",
        ],
      },
      {
        id: "separate-tone-and-transparency",
        heading: "Separate tone from transparency",
        paragraphs: [
          "Colour is only one part of the image. Ask whether the quality you like is a warm hue, a dark field, a visible depth, or the contrast between a textured area and a visually quiet one. These qualities can be confused when they appear together in a single photograph. Give each preference its own sentence so a later material discussion can explore them independently.",
          "Treat apparent transparency with particular care in a visual brief. Backgrounds, lighting, reflections and image processing influence what a screen shows. Say that you are drawn to the impression of depth rather than requesting an exact result from an unverified image. A physical sample and a clear description of its viewing conditions offer a more grounded basis for decisions than a colour selected from a photograph alone.",
        ],
      },
      {
        id: "include-the-edge-and-base",
        heading: "Include the edge and the base",
        paragraphs: [
          "A surface is rarely experienced only from directly above. Its edge may be the first thing visible when someone enters a room, and the base contributes another set of lines below it. Look for side views in an approved reference set. Describe whether you want the top to feel visually thin, grounded, irregular or clearly separated from its support, without assuming that an image resolves structural questions.",
          "The Single-Slab desk and Basin coffee-table fixtures offer different contexts for thinking about that relationship. They are separate fictional objects, so one should not stand in as a photograph of the other. Use each as an invitation to compare compositional ideas. If a needed angle is missing, record it as a missing visual instead of imagining that the unseen construction has already been decided.",
        ],
      },
      {
        id: "make-a-useful-reference-board",
        heading: "Make a reference board with reasons",
        paragraphs: [
          "Choose a small number of references and annotate them. One might explain the grain direction you enjoy; another might show a restrained relationship between the top and base. Include one image that almost works and explain the difference you would want. This often reveals a preference more clearly than a large collection of attractive images without any written context or order.",
          "Keep the source and status of each reference visible. A rendering, an approved photograph and a physical material sample provide different kinds of information. Avoid presenting another maker’s object as a design to copy. Describe the general relationship that appeals to you, then leave room for an original response to your room, dimensions and intended use. A useful board opens a conversation rather than pretending to close it.",
        ],
      },
      {
        id: "turn-observations-into-questions",
        heading: "Turn observations into questions",
        paragraphs: [
          "Before a real commission, translate your visual notes into questions the studio can answer. What actual timber and resin options are under consideration? Which samples belong to the proposed specification? How will the selected finish be described and approved? What care guidance applies to that particular object? These questions connect an aesthetic preference to information that needs to be confirmed for the work itself.",
          "This article deliberately does not infer durability, heat resistance, food suitability or environmental credentials from appearance. Such statements require reliable information about the actual materials and finished product. The preview catalogue and this editorial batch remain fictional discussion material. Their purpose is to help articulate a visual brief while leaving technical claims, business policies and the final scope with the owner’s reviewed documentation.",
        ],
      },
    ],
  },
  {
    ...editorialDefaults,
    id: "DB003",
    slug: "round-oval-or-rectangular-a-dining-table-planning-notebook",
    title: "Round, Oval or Rectangular: A Dining-Table Planning Notebook",
    excerpt: "Three outlines, many possible rooms. Organise the measurements, seating questions and everyday situations that should shape a dining-table conversation.",
    category: "Commissioning",
    relatedProductIds: ["DP001", "DP002"],
    imageBriefId: "JOURNAL-DB003",
    reviewNotes: [
      "Owner-review demo planning draft; no universal seating or circulation dimensions are asserted.",
      "Round and oval dining examples are conceptual planning alternatives, not extra authored catalogue records.",
      "Room, chair, base and access dimensions require project-specific confirmation.",
    ],
    sections: [
      {
        id: "start-with-a-measured-sketch",
        heading: "Start with a measured sketch",
        paragraphs: [
          "Begin the notebook with a plan of the actual dining area. Show its boundaries, openings and the furniture that will stay. Mark whether the dining space is a separate room or part of a larger living area, because a visual boundary may matter even when there is no wall. Use one consistent unit and distinguish measured dimensions from estimates or proposed changes.",
          "Then describe the setting in words. Is the table seen along its length from an entrance, approached from several sides, or placed against a backdrop of windows? Do nearby doors need to open during meals? These observations do not choose a shape automatically. They make it possible to compare outlines against the same real context instead of comparing isolated product images with unrelated room styling.",
        ],
      },
      {
        id: "consider-a-round-outline",
        heading: "Consider a round outline",
        paragraphs: [
          "A circle gives a drawing no obvious short end or long side. That can be an appealing starting point for a room approached from several directions, or for a composition organised around a central pendant. Yet the absence of corners does not settle whether a particular table fits. The chairs, base and surrounding routes still have their own dimensions and changing positions.",
          "Sketch the actual chairs you intend to discuss around the proposed outline. Record the number used routinely and any occasional arrangement you hope to explore. Avoid treating diameter alone as a seating promise. Chair width, arm shape, leg position and the table’s support need to be considered together. A round form is a visual choice to investigate, with its practical details still open for confirmation.",
        ],
      },
      {
        id: "consider-an-oval-outline",
        heading: "Consider an oval outline",
        paragraphs: [
          "An oval introduces a longer direction while changing the way the ends appear in a plan. It may be interesting where a room has a clear length but a softer outline suits the surrounding furniture. Describe which part attracts you: the continuous curve, the relationship with a rug, or the way the top meets the view from an adjoining space.",
          "The word oval can cover different profiles, so a reference silhouette is more useful than the label alone. A long shallow curve and a more compact rounded shape will not occupy the plan in the same way. Ask for a drawing with proposed dimensions and support positions. The preview article considers oval dining as a planning option; it does not claim an additional completed or available product beyond the labelled catalogue fixtures.",
        ],
      },
      {
        id: "consider-a-rectangular-outline",
        heading: "Consider a rectangular outline",
        paragraphs: [
          "A rectangle establishes a clear direction and offers a straightforward shape to compare with walls, floorboards or a long room opening. That visual alignment may be useful, but it is only one part of the decision. The character of the edges and base can make two tables with similar footprints feel very different when seen from a seated position or an adjacent room.",
          "Use the Riverline and Stillwater sample concepts as prompts for those differences in composition, not as guaranteed room solutions. When considering a rectangular table, mark any intended end seats and check what lies beneath those positions. Ask how the proposed support arrangement relates to the actual chairs. A named shape or sample product size cannot replace that conversation or establish a universal number of places.",
        ],
      },
      {
        id: "compare-the-same-situations",
        heading: "Compare the same everyday situations",
        paragraphs: [
          "Make three small plans using the same room, chairs and surrounding furniture. Change only the proposed table outline first. Then add the situations that matter to you: the everyday meal, additional guests, a child working nearby, or someone reaching a cupboard. This is an exercise in asking better questions, not a way to certify that an arrangement meets every requirement.",
          "Include the spaces around the table rather than looking only at the occupied surface. What view remains open toward the window? Which route becomes less direct when chairs are in use? Are there individual access needs that the project team should address? Record uncertainty plainly. A question left visible in the notebook is more useful than a confident drawing built on assumptions nobody has checked.",
        ],
      },
      {
        id: "write-a-comparison-brief",
        heading: "Write a comparison brief",
        paragraphs: [
          "Summarise the alternatives with one sentence about appearance and one about the practical questions for each. For example, a curved outline might suit the room’s visual rhythm while leaving support placement unresolved. A longer straight outline might align with the architecture while raising questions about movement at one end. Keeping both observations together prevents a preference from being mistaken for a final decision.",
          "Bring the room sketch, chair information, intended use and any relevant access constraints to the real consultation. Ask the studio to identify what it can assess and what needs another professional’s confirmation. In this development preview, the commission journey accepts fictional planning details and produces only a local summary. It neither reserves a design nor confirms capacity, delivery arrangements, pricing or a production schedule.",
        ],
      },
    ],
  },
  {
    ...editorialDefaults,
    id: "DB004",
    slug: "coffee-tables-as-sculptural-objects",
    title: "Coffee Tables as Sculptural Objects",
    excerpt: "Study a low table through silhouette, the space beneath it and its relationship with seating. An editorial exercise in making an object belong to a larger composition.",
    category: "Spaces",
    relatedProductIds: ["DP013", "DP014"],
    imageBriefId: "JOURNAL-DB004",
    reviewNotes: [
      "Original demo composition study; Basin and Orbit are fictional product concepts.",
      "Furniture heights and reach relationships are questions for the actual project, not ergonomic specifications.",
      "Owner must approve any future interior imagery and avoid presenting it as a completed client installation.",
    ],
    sections: [
      {
        id: "read-the-silhouette",
        heading: "Read the silhouette first",
        paragraphs: [
          "A coffee table is often noticed from above while standing and from the side while seated. Those two views can tell different stories. An expansive top may become a quiet line at eye level; a compact surface may sit over a base with a strong sculptural presence. Begin by imagining the object as a single dark outline, temporarily setting aside its colour and material detail.",
          "Ask where the outline is concentrated and where it opens up. Does it spread horizontally, rise from one point or divide into several forms? The Basin and Orbit fixtures offer distinct starting ideas in the protected catalogue. Their purpose is to make those questions visible. They are not photographs of completed rooms, and the missing views of a concept should remain acknowledged rather than filled in by assumption.",
        ],
      },
      {
        id: "relate-it-to-the-seating",
        heading: "Relate it to the seating",
        paragraphs: [
          "Look at the proposed table alongside the seats that will surround it. A deep sofa, an upright chair and a low lounge seat each create a different relationship in the drawing. Record their actual dimensions when available and describe how the space is used. The question is not simply whether the coffee table looks balanced in an empty photograph, but how the group reads and functions together.",
          "Height belongs in that conversation alongside length and width. Rather than applying a universal rule from an unrelated room, ask what relationship suits the intended use and the people involved. Serving, reading, displaying an object and moving through the room may pull the brief in different directions. Identify those priorities before treating a visually appealing height as the settled answer for a commission.",
        ],
      },
      {
        id: "look-at-the-open-space",
        heading: "Look at the space beneath and around it",
        paragraphs: [
          "Negative space is the part of the composition that remains unoccupied. Beneath a table, it can reveal a rug or allow the base to read as a separate drawing. Around the table, it gives the object an outline within the seating group. Try sketching the open areas as deliberately as the furniture; this often changes which part of the composition seems most important.",
          "A solid-looking base and an open frame can create different visual rhythms even when their tops occupy similar areas. Neither is automatically better for a small or large room. Compare them against the actual surrounding furniture, including legs, shelves and upholstery. Questions about structural performance, cleaning access or suitability require information about the real design; the visual exercise should not be used to invent those answers.",
        ],
      },
      {
        id: "compose-without-matching",
        heading: "Compose without making everything match",
        paragraphs: [
          "The coffee table can share one quality with its surroundings while differing in others. A curve might respond to a chair arm, a warm tone might echo a small timber detail, or a restrained surface might sit beside a patterned textile. Identify the relationship you want to keep, then let other elements remain independent. This makes the brief easier to explain than a broad request for a coordinated room.",
          "Use references to compare alternatives one change at a time. Keep the seating constant while considering a circular outline, a longer outline or a more sculptural base. If every image changes the architecture, rug and lighting as well, it becomes difficult to know what you actually prefer. A modest annotated sketch can be more useful than a polished mood board full of incompatible settings.",
        ],
      },
      {
        id: "style-for-the-real-day",
        heading: "Style for the real day",
        paragraphs: [
          "An editorial photograph often shows only a few carefully placed objects. Your room may need space for books, a tray or everyday items that come and go. Think about both conditions. What portion of the surface would you like to remain visible? Is the material composition itself the main interest, or do you expect the table to support a changing arrangement of other objects?",
          "Draw the ordinary items at an approximate scale instead of assuming they will disappear into the composition. This does not establish a load limit or approve a particular use; those questions belong with the real product specification. It does help explain why a surface that looks generous in an empty image might feel different when it becomes part of a lived routine and a wider seating arrangement.",
        ],
      },
      {
        id: "brief-a-sculptural-table",
        heading: "Brief a sculptural table in plain language",
        paragraphs: [
          "A productive brief can begin with three observations: the outline you are drawn to, the visual space you want to preserve and the activities the table should support. Add the dimensions of the room and existing seating, marking any estimates. Include a small number of references with notes about the particular feature in each, so the designer can separate your intention from the image’s styling.",
          "Ask which details need a drawing, a physical sample or a project-specific assessment before they can be agreed. Delivery access and care instructions should be confirmed for the actual object, not inferred from a concept card. The current preview lets you explore that conversation with fictional inputs only. Its local summary is a design-development demonstration, with no submitted enquiry or agreed commission behind it.",
        ],
      },
    ],
  },
  {
    ...editorialDefaults,
    id: "DB005",
    slug: "the-quiet-role-of-a-side-table",
    title: "The Quiet Role of a Side Table",
    excerpt: "Beside a chair, near a bed or at the edge of a larger arrangement, a small table can have a precise job. Start a custom brief by naming that job.",
    category: "Commissioning",
    relatedProductIds: ["DP025", "DP043"],
    imageBriefId: "JOURNAL-DB005",
    reviewNotes: [
      "Original owner-review demo editorial, with no real customer or project history.",
      "Twinleaf and Petal are sample concepts; adjacency does not certify a matching or ergonomic specification.",
      "No electrical, load, accessibility or installation requirements are resolved by this article.",
    ],
    sections: [
      {
        id: "name-the-job",
        heading: "Name the job before the style",
        paragraphs: [
          "A side table is often described as an accent, but its most useful starting point may be a simple task. It could be a place for a book beside a reading chair, a landing point near a sofa or a small surface beside a bed. Name the task before selecting an outline. That gives the design conversation something more specific to work with than a request for a finishing touch.",
          "Notice whether the table will serve one position or several. A surface shared between two seats raises different questions from one assigned to a particular chair. Write down what needs to rest there and when. These notes do not prescribe a size by themselves; they explain the purpose against which proposed dimensions, materials and details can eventually be discussed and reviewed.",
        ],
      },
      {
        id: "find-its-neighbour",
        heading: "Find its nearest neighbour",
        paragraphs: [
          "The side table’s strongest visual relationship may be with an adjacent chair, bed or sofa arm. Look at their outlines together, including the spaces between their supports. A curved table beside an angular chair creates one conversation; repeating a curve creates another. The fictional Twinleaf pair and Petal chair are useful prompts for that exercise, without claiming that they form an approved furniture set.",
          "Take the surrounding dimensions into the brief, especially when a table is intended to sit in a precise position. Record the relevant seat, arm or bedside dimensions as measured facts, and label your preferred table height as a proposal. The eventual relationship needs to be considered for the actual user and activity. An appealing arrangement in a concept image does not establish ease of reach or a universal ergonomic recommendation.",
        ],
      },
      {
        id: "consider-one-or-two",
        heading: "Consider one object or a pair",
        paragraphs: [
          "A pair of side tables can introduce repetition without requiring perfect symmetry throughout a room. Imagine the pair together, separated on either side of a sofa, or used in different parts of the space. Describe which arrangement matters most. The answer affects whether the pair should feel like two equivalent pieces or related objects with deliberately different visual roles.",
          "The Twinleaf fixture is a fictional matched-pair concept, not evidence that a particular nesting, stacking or interchangeable arrangement has been engineered. If those behaviours matter to your brief, state them as questions. Do the pieces need to move independently? Will their positions change often? Are the surfaces expected to serve different tasks? Keeping function explicit prevents a suggestive image from quietly becoming an unsupported product promise.",
        ],
      },
      {
        id: "notice-the-overlooked-details",
        heading: "Notice the details around the table",
        paragraphs: [
          "Small furniture often sits where several parts of a room meet: a curtain, a rug edge, a socket, a skirting line or the side of a larger object. Mark those details in your sketch. If a lamp is part of the intended arrangement, show it as a separate item and describe the cable route you need the project team to consider.",
          "Do not turn a furniture mood board into an electrical or installation plan. The point is to make the relevant questions visible so the right person can address them. Also note any nearby door or drawer that opens into the area and any route you intend to keep clear. A compact footprint can still occupy an important part of an everyday movement pattern, depending on the room around it.",
        ],
      },
      {
        id: "choose-the-kind-of-presence",
        heading: "Choose the kind of presence",
        paragraphs: [
          "A side table can be visually quiet without being anonymous. Perhaps its material relates to a larger table while its outline stays simpler. Perhaps it introduces a small contrast in a room dominated by upholstered furniture. Decide whether you want the object to draw attention at first glance or reveal its character when someone sits nearby and notices the surface and edge.",
          "Describe that preference with references to particular qualities: a restrained colour area, an irregular outline, a visible meeting of materials or the spacing between supports. Avoid relying on terms such as timeless or luxurious to carry the whole brief. They can mean different things to different people. Concrete observations allow the designer to respond with an original proposal and make subsequent choices easier to discuss together.",
        ],
      },
      {
        id: "make-a-small-clear-brief",
        heading: "Make a small, clear brief",
        paragraphs: [
          "Gather a photograph of the intended location, a measured sketch and a short list of the table’s everyday contents. Include the neighbouring furniture dimensions that matter and identify anything likely to change. If you have more than one possible position, show both rather than presenting an unsettled arrangement as a final instruction. A useful brief can be concise while still making uncertainty visible.",
          "Ask the studio which dimensions, material choices and care requirements need confirmation for the actual design. Any proposed load, special fitting or installation condition belongs in that discussion. In the current protected preview, the commission form creates a fictional local summary only. It provides a way to organise those questions, while the real scope, feasibility, cost and timing remain matters for an owner-reviewed enquiry process.",
        ],
      },
    ],
  },
  {
    ...editorialDefaults,
    id: "DB006",
    slug: "an-entryway-built-around-one-console",
    title: "An Entryway Built Around One Console",
    excerpt: "Plan an arrival space through rhythm, everyday objects and the view beyond the doorway. A console can anchor the composition while leaving the practical questions visible.",
    category: "Spaces",
    relatedProductIds: ["DP035", "DP048", "DP057"],
    imageBriefId: "JOURNAL-DB006",
    reviewNotes: [
      "Original demo editorial; no installed project or customer outcome is claimed.",
      "Wall mounting, stability, electrical needs and circulation must be assessed for the real project.",
      "Console, bench and wall-panel relationships are conceptual, not approved combined installations.",
    ],
    sections: [
      {
        id: "read-the-arrival",
        heading: "Read the arrival as a sequence",
        paragraphs: [
          "An entryway is experienced in motion. There is the view when the door first opens, the place where someone pauses and the glimpse of the room beyond. Before choosing a console, walk through that sequence and describe what each moment needs. You may want a clear focal object, a quiet landing place for everyday items, or a restrained transition into a more expressive interior.",
          "Sketch the open door as well as the closed one, and mark anything that already shapes the view. A switch panel, window, recess or change in wall direction may matter more than an idealised symmetrical composition. The aim is to build a brief around the actual space. A beautifully centred object in a reference photograph is not automatically the right response to a different entrance.",
        ],
      },
      {
        id: "establish-a-horizontal-line",
        heading: "Establish a horizontal line",
        paragraphs: [
          "A console introduces a clear horizontal element that can organise the wall around it. Its length may relate to an artwork, a recess or the visible width of a passage. Start by drawing that line without accessories, then consider how the base changes its apparent weight. The fictional Span console offers one narrow-profile idea to discuss; its sample dimensions are not a recommendation for every entryway.",
          "Look at the object from the approach as well as straight on. A top that seems slender from the front may occupy more of a route when viewed along the corridor. Show the proposed depth in the plan and identify the movement that must be considered. Relevant clearances and accessibility needs require project-specific confirmation, so keep this drawing as a planning aid rather than an installation approval.",
        ],
      },
      {
        id: "build-a-rhythm-on-the-wall",
        heading: "Build a rhythm on the wall",
        paragraphs: [
          "The space above a console can feel as deliberate as the object itself. Consider whether one artwork, a grouping or an unoccupied wall best supports the arrival sequence you described. Draw their outlines in relation to the console rather than choosing each element separately. You can then discuss alignment, intervals and emphasis without becoming distracted by the precise colours of an early reference image.",
          "A wall panel such as the Horizon sample concept might be a compositional reference, but a picture does not resolve mounting, weight, fixings or the suitability of a wall. Keep those questions separate and visible. If a mirror, lighting or another fitted element enters the real proposal, ask the relevant project team to confirm what information and professional assessment are needed before any installation decision is made.",
        ],
      },
      {
        id: "style-with-restraint",
        heading: "Style with a little restraint",
        paragraphs: [
          "Choose what you want the console surface to reveal. If the top’s material composition is central to the design, a crowded arrangement may hide the very relationship that drew you to it. Try a few simple outlines in a sketch: one taller object, a lower group and an area left empty. Change their position before adding more things, and observe how the composition responds.",
          "This is an editorial exercise rather than a rule about how a home should look. A lived entryway may need space for items that never appear in a styled photograph. Include them honestly in the brief. The question is whether the proposed surface and nearby storage suit your routine, not whether the room can remain permanently arranged like a catalogue image with every ordinary object removed.",
        ],
      },
      {
        id: "consider-the-other-objects",
        heading: "Consider the other objects in the sequence",
        paragraphs: [
          "A console may share an entrance with a bench, a basket, a stand or another practical object. Draw these together before deciding that each needs its own visual statement. Repetition might come from a warm tone or a simple line, while one object provides the stronger accent. The Threshold bench fixture is a separate fictional concept that can help frame this discussion, not a confirmed companion product.",
          "Think about the view beyond the entrance too. The console can introduce a quality that reappears more subtly elsewhere, or it can provide a pause before a different room character. Record which existing objects will remain and which are only suggestions. That distinction helps avoid a commission brief that depends on replacing half the surrounding furniture when the intention was to add one considered piece.",
        ],
      },
      {
        id: "bring-the-project-questions",
        heading: "Bring the project questions into the brief",
        paragraphs: [
          "A clear enquiry includes the intended wall, proposed footprint, opening doors and the route through the space. Add photographs you have permission to share and note any drawings that still need to be measured or confirmed. Mention whether the console is expected to support particular objects, provide storage or coordinate with fitted elements. Those details give the studio concrete questions to investigate before a design is agreed.",
          "Ask how stability, placement, access and care will be addressed for the actual commissioned piece. Do not assume those matters are resolved by a rendering or a sample catalogue description. The protected preview offers a local form for fictional planning information and an explicitly simulated summary. A real arrangement will need reviewed materials, an agreed specification and the owner’s actual enquiry process before any promise about delivery or installation can be made.",
        ],
      },
    ],
  },
];

export function findJournalArticle(slug: string): JournalArticle | undefined {
  return journalArticles.find((article) => article.slug === slug);
}

/** Body text only: headings and metadata do not inflate the draft word count. */
export function articleWordCount(article: JournalArticle): number {
  const text = article.sections
    .flatMap((section) => [...section.paragraphs, ...(section.checklist ?? [])])
    .join(" ")
    .trim();
  return text ? text.split(/\s+/u).length : 0;
}

/** Editorial estimate, using 200 words per minute; not a measured reader speed. */
export function readMinutes(article: JournalArticle): number {
  return Math.max(1, Math.ceil(articleWordCount(article) / 200));
}

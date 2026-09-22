/**
 * Original, owner-review editorial fixtures for the protected frontend preview.
 * These 36 complete drafts preserve DB001–DB012 and add DB013–DB036.
 * Plain text is rendered by React; no pasted HTML or operational claims belong here.
 */
import {additionalJournalArticles} from "./journal-extra";
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
  tier: "LARGE" | "MEDIUM" | "SMALL" | "STUDIO";
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
  {
    ...editorialDefaults,
    id: "DB007",
    slug: "pairing-resin-art-with-warm-neutral-interiors",
    title: "Pairing Resin Art with Warm Neutral Interiors",
    excerpt: "Build a palette from the room you already have, then explore how a material-led object can introduce contrast, repetition and a little visual breathing space.",
    category: "Spaces",
    relatedProductIds: ["DP001", "DP025", "DP035"],
    imageBriefId: "JOURNAL-DB007",
    reviewNotes: [
      "Original owner-review demo editorial; palette examples describe visual intentions, not available finishes.",
      "Any future room imagery must be original or approved, clearly labelled and never presented as a completed client interior.",
      "Confirm actual samples and their viewing conditions before making colour or material decisions.",
    ],
    sections: [
      {
        id: "begin-with-the-existing-neutrals",
        heading: "Begin with the neutrals already in the room",
        paragraphs: [
          "A warm neutral interior is rarely one single colour. A wall may look softly cream beside a pale textile and more yellow beside a cooler stone. Before adding a resin-art object, make a small inventory of the surfaces that will remain: the largest floor area, the main upholstery, the most visible timber and the background wall. Describe what you actually see rather than beginning with a fashionable palette name.",
          "You do not need to resolve every colour relationship immediately. Give each existing surface a role in the brief and note which combinations you already enjoy. A room with varied quiet tones may invite a stronger focal object, while another may benefit from a more restrained addition. The useful starting point is the composition you have, including its imperfections and ordinary daylight.",
        ],
      },
      {
        id: "give-the-new-object-a-role",
        heading: "Give the new object one clear role",
        paragraphs: [
          "Decide whether the new piece should anchor the room, connect existing elements or introduce a deliberate interruption. A dining table might carry the strongest material contrast, while a pair of side tables could repeat a smaller detail. That distinction keeps the conversation focused. Without it, an attractive reference can lead to a request for an object that competes with the features you most want to preserve.",
          "Use the Riverline, Twinleaf and Span fixtures as separate conceptual starting points. Only look to an image when that particular fixture has an approved visual; an empty image slot is not an invitation to borrow another product’s photograph. Their sample descriptions can still help name a role for the object. The final appearance, proportions and material choices remain questions for an actual commission.",
        ],
      },
      {
        id: "build-an-illustrative-palette",
        heading: "Build an illustrative palette with limits",
        paragraphs: [
          "Try an imaginary arrangement of oat-coloured fabric, a warm timber note and a small dark accent. Then try the same room with a lighter focal surface and a more visible base. These are composition exercises rather than prescribed combinations. Label them as alternatives, and explain which relationship interests you: the contrast between light and dark, the repetition of warmth or a quieter transition between neighbouring surfaces.",
          "Keep the palette small enough that each addition has a reason. When every reference introduces another colour, it becomes hard to know which choice is carrying the idea. A short written note can restore that clarity: retain the sofa, relate to the floor, let the table provide the contrast. The note gives a designer freedom to develop the intention without reproducing a reference interior.",
        ],
      },
      {
        id: "let-texture-do-some-work",
        heading: "Let texture do some of the work",
        paragraphs: [
          "In a restrained palette, texture can provide differences that colour alone does not explain. A woven textile, a visually grained surface and a quiet painted wall each introduce a different pattern of detail. Describe those visible qualities separately from how a material might feel. A photograph can suggest a texture, but touching an actual approved sample supplies information that a screen cannot settle.",
          "Consider where the room already has a lot to look at. If the rug is patterned and the shelving is full, a simpler object outline may offer a pause. If large background areas are visually quiet, a more expressive material composition may become the focus. These are options to explore in your own setting, not rules that every neutral interior must follow or claims about a particular resin finish.",
        ],
      },
      {
        id: "borrow-a-relationship-not-a-room",
        heading: "Borrow a relationship, not a room",
        paragraphs: [
          "A reference interior can be useful when you can explain the relationship you admire. Perhaps a dark object feels balanced by a large pale wall, or several warm surfaces are interrupted by one cooler detail. Write down that observation and set aside the temptation to reproduce every furnishing. Your room’s architecture, retained objects and daily use deserve a response of their own.",
          "Use only references you are entitled to share, and keep their source visible in a real project brief. Do not present another designer’s room as a RivyaLivingArt installation or an instruction to duplicate its objects. An original concept board can instead use your room sketch, plain colour notes and approved product studies. This makes the intention readable without confusing inspiration, authorship and a proposed commission.",
        ],
      },
      {
        id: "bring-the-palette-back-to-the-room",
        heading: "Bring the palette back to the actual room",
        paragraphs: [
          "Before a final decision, ask how the relevant material and finish samples can be considered alongside the existing surfaces. Record the viewing context rather than declaring that one screen image proves a match. Note which choices are fixed, which are preferred and which remain open. That small distinction helps prevent a provisional palette from becoming an apparently approved specification during a longer project conversation.",
          "The preview catalogue contains fictional material labels and pending visuals; it cannot confirm a colour match or a finished surface. Use its local commission journey only with invented planning details. A useful real brief would end with a concise intention, such as a calm background with one material focal point, followed by the actual samples, dimensions and questions that still need the studio’s review.",
        ],
      },
    ],
  },
  {
    ...editorialDefaults,
    id: "DB008",
    slug: "a-guide-to-describing-your-commission",
    title: "A Guide to Describing Your Commission",
    excerpt: "Turn a collection of preferences into a useful first brief: what the piece is for, where it will live, what is known and which questions still need a conversation.",
    category: "Commissioning",
    relatedProductIds: ["DP001", "DP051", "DP077"],
    imageBriefId: "JOURNAL-DB008",
    reviewNotes: [
      "Original demo guidance, not an approved quotation, acceptance process or business policy.",
      "Actual scope, feasibility, timing and commercial terms require the owner’s reviewed enquiry process.",
      "Preview forms accept fictional examples only and do not submit or persist a commission request.",
    ],
    sections: [
      {
        id: "describe-the-purpose-first",
        heading: "Describe the purpose in one sentence",
        paragraphs: [
          "Start with what you want the object to do in the life of the room. You might be considering a dining table for everyday family use, a desk that becomes the visual centre of a study, or a reception piece that introduces a space to visitors. A plain sentence about purpose gives the design conversation direction before you reach for a particular finish, shape or style label.",
          "Add the practical situations that make this project different. Perhaps existing chairs must remain, the room has another use at weekends, or the piece will be seen mainly from an adjoining area. These details are not small distractions from the creative brief. They explain the context in which the eventual design needs to be assessed and help separate an essential requirement from a passing preference.",
        ],
      },
      {
        id: "show-what-is-measured",
        heading: "Show what is measured and what is proposed",
        paragraphs: [
          "List the measurements you actually know, with explicit units and clear labels for width, depth and height. Keep room measurements separate from proposed object dimensions. If something is an estimate, say so. A short annotated sketch can be more useful than several numbers in a message when it shows exactly which opening, wall or existing item each measurement describes.",
          "You can arrive with a preferred size without treating it as the only possible answer. Explain why you chose it and which constraints are fixed. The studio may need further information before it can respond to feasibility or proportions. Sample dimensions in the protected catalogue describe fictional concepts; copying them into a brief does not establish that the same footprint, support arrangement or access plan suits your project.",
        ],
      },
      {
        id: "annotate-your-references",
        heading: "Annotate the references you bring",
        paragraphs: [
          "Select a few references and write one reason for each. You may like the direction of a grain pattern, the quietness of a base or the balance between two surface areas. That reason is the important part of the reference. Without it, someone reading the brief may assume you want the whole object, including details you had barely noticed or would actively prefer to change.",
          "Include a reference that is close but not quite right if it helps articulate a boundary. Explain the difference in ordinary language rather than technical terms you are unsure of. Share only material you are entitled to use, and distinguish an inspiration image from your own room documentation. In the current local preview, choose safe fictional references; private project files do not belong in an interface demonstration.",
        ],
      },
      {
        id: "explain-the-practical-context",
        heading: "Explain the practical context",
        paragraphs: [
          "A useful first brief identifies the general project location, intended placement and any access conditions already known. A narrow turn, a lift or a route shared with other work may raise questions that need investigation. Describe the situation rather than promising that delivery will be simple. The actual route and handling arrangements require the relevant people to assess the specific object and site.",
          "Mention related decisions that are still in progress. Flooring, fixed joinery or room layout changes can affect what information is available and when. If an architect or interior designer is involved, identify the coordination role without assuming that one person has approved every part of the proposal. The purpose is to make dependencies visible early, so the design conversation is based on the same understanding of the project.",
        ],
      },
      {
        id: "give-timing-and-budget-context",
        heading: "Give timing and budget their context",
        paragraphs: [
          "Explain any date that influences the enquiry and why it matters. An intended move, event or stage of building work is useful context, but it is not a confirmed production or delivery date. Ask what the studio needs to review before it can discuss a realistic sequence. Keep preferred timing separate from any timing that has actually been agreed through the real project process.",
          "If you choose to share a budget range, describe what you expect it to cover and invite clarification. Avoid assuming that a sample price includes site work, transport, installation or additional design services. The preview uses fictional price modes to develop the interface, not to issue quotations. A clear brief can acknowledge these open items without attempting to invent commercial terms before the studio has reviewed the scope.",
        ],
      },
      {
        id: "end-with-answerable-questions",
        heading: "End with questions someone can answer",
        paragraphs: [
          "Read the brief once as if you were seeing the project for the first time. Can you identify the intended use, the known dimensions, the visual direction and the unresolved constraints? Remove repeated adjectives and retain the observations that explain them. Then write the next questions plainly: what should be measured next, which options are worth exploring and what information is needed to discuss a specification?",
          "A good first enquiry does not need to contain a finished design. It needs enough context for a useful response and an honest account of what is still unknown. The development form can help organise a fictional example into a local summary, but nothing is sent or saved as a real request. Actual acceptance, design work and agreed terms begin only through the owner’s reviewed operating process.",
        ],
      },
    ],
  },
  {
    ...editorialDefaults,
    id: "DB009",
    slug: "what-to-include-in-an-architects-enquiry",
    title: "What to Include in an Architect’s Enquiry",
    excerpt: "Make the first project exchange easier to interpret with a concise context note, clearly labelled drawings and an explicit list of unresolved specification and coordination questions.",
    category: "Commissioning",
    relatedProductIds: ["DP035", "DP057", "DP077"],
    imageBriefId: "JOURNAL-DB009",
    reviewNotes: [
      "Original owner-review editorial for project communication, not professional, engineering or regulatory advice.",
      "Drawing review, shop drawings, site visits and coordination services are questions, not promised RivyaLivingArt services.",
      "Use synthetic project identifiers in preview; do not place confidential drawings or client information in demo forms.",
    ],
    sections: [
      {
        id: "open-with-project-context",
        heading: "Open with a compact project context",
        paragraphs: [
          "An architect’s enquiry is easier to interpret when it begins with the project stage and the role of the proposed object. State whether you are exploring a concept, coordinating a developed interior or seeking information for a specific decision. Identify the intended setting in broad terms and explain what the object should contribute visually and functionally. This helps the recipient understand the question before opening any drawings.",
          "Separate your team’s role from the services you are asking the studio to discuss. Do you need an initial feasibility conversation, a material option to review or clarification of a proposed scope? Those requests are not interchangeable. Naming the immediate decision makes it possible to respond at the appropriate level without assuming that design development, technical coordination or installation responsibilities have already been assigned.",
        ],
      },
      {
        id: "send-a-readable-drawing-set",
        heading: "Prepare a readable drawing set",
        paragraphs: [
          "Choose drawings that explain the relevant location and relationships, rather than sending every available sheet without context. A plan may show the route around an object; an elevation may explain its relationship with a wall or adjacent joinery. Label the revision and status of each document so an exploratory sketch cannot be mistaken for information cleared for construction or a later coordinated design.",
          "Use explicit units and identify which dimensions require site confirmation. If a drawing contains an illustrative object, say whether its outline is a fixed requirement or a placeholder for discussion. A short cover note can point to the relevant area and list known discrepancies. Share project documents only through an appropriate agreed channel; the protected frontend’s reference preview is for fictional examples and does not provide a confidential document intake service.",
        ],
      },
      {
        id: "describe-the-design-intent",
        heading: "Describe the design intent and its boundaries",
        paragraphs: [
          "Explain the intended relationship between the proposed piece and the architecture. It may establish a horizontal line, provide a material focal point or connect two areas visually. Support that intention with a few annotated references rather than a general style label. Identify the qualities that matter and the features that are incidental, especially when reference images contain other designers’ work or unrelated room conditions.",
          "Distinguish requirements from options under consideration. A proposed length may be constrained by adjacent joinery, while the base composition remains open. A particular colour impression may be preferred, while the actual material selection still needs samples. Making these boundaries readable leaves room for an original design response and prevents an early concept rendering from acquiring the authority of an approved specification without a deliberate decision.",
        ],
      },
      {
        id: "record-access-and-interfaces",
        heading: "Record access and the surrounding interfaces",
        paragraphs: [
          "Include known information about how the object would reach its intended position, while marking the route as subject to assessment where appropriate. Note relevant openings, changes of level, lifts, turns and any site restrictions that the project team has identified. Avoid reducing the question to whether a top fits through one doorway; handling and installation need a complete project-specific discussion with those responsible.",
          "Identify the surrounding interfaces as well. A reception concept may relate to flooring, lighting or fixed services; a wall piece raises separate questions about the supporting wall and fixing strategy. Do not treat a catalogue image as proof that these relationships are resolved. List who is expected to provide the missing information and ask the studio to clarify what it can evaluate within an agreed scope.",
        ],
      },
      {
        id: "ask-for-specific-information",
        heading: "Ask for specific specification information",
        paragraphs: [
          "Write the information request as a list of decisions rather than a broad demand for every possible document. You might need proposed overall dimensions, a description of the actual material system, available sample information, care guidance or details requiring coordination. Ask which documents and assessments can be supplied for the particular proposal. Their availability should be confirmed rather than inferred from an editorial page or a fictional fixture.",
          "Keep visual approval separate from technical acceptance and any applicable project requirements. A finish selected for its appearance does not establish a performance characteristic, and a rendered joint does not define a buildable connection. The appropriate project professionals need to identify and assess the relevant requirements. This article provides a communication structure; it does not certify a product, resolve a regulation or assign professional responsibility for the work.",
        ],
      },
      {
        id: "make-the-next-exchange-clear",
        heading: "Make the next exchange clear",
        paragraphs: [
          "Close with the decision you hope to make next, the information needed to make it and the people who need to be part of the conversation. Give programme dates as project context, distinguishing requested milestones from agreed commitments. If commercial scope is still open, say what you expect the discussion to cover and ask for clarification rather than assuming a sample price includes every related service.",
          "A concise, well-labelled enquiry reduces ambiguity without pretending that one email can resolve the whole project. Keep confidential client information out of the current demo environment and use synthetic details if exploring the local commission flow. The Span, Horizon and Estuary fixtures are fictional references only. Real drawings, material decisions and service commitments require the owner’s actual review process and explicit agreement between the relevant project participants.",
        ],
      },
    ],
  },
  {
    ...editorialDefaults,
    id: "DB010",
    slug: "wall-art-at-architectural-scale",
    title: "Wall Art at Architectural Scale",
    excerpt: "Explore one panel, two related elements or a three-part composition through the wall, the viewing sequence and the space between the pieces. Every dimension remains a proposal.",
    category: "Spaces",
    relatedProductIds: ["DP057", "DP035", "DP069"],
    imageBriefId: "JOURNAL-DB010",
    reviewNotes: [
      "Original demo composition study; single-panel, diptych and triptych alternatives are not manufactured product claims.",
      "Dimensions, panel intervals, materials and support arrangements remain proposed until project-specific review.",
      "This article provides no wall-fixing, structural, fire-performance or installation specification.",
    ],
    sections: [
      {
        id: "draw-the-whole-wall",
        heading: "Draw the whole wall before the artwork",
        paragraphs: [
          "At architectural scale, wall art is read in relation to the space around it. Begin with the full wall, including openings, changes of plane, visible services and nearby furniture. Then mark the usual approaches and viewing positions. A composition seen along a corridor may need to be discussed differently from one encountered directly across a room, even when the available wall dimensions are similar.",
          "Keep measured facts and exploratory ideas distinct in the sketch. Record actual wall dimensions where they are known, then draw a proposed area for the artwork without calling it a final size. The exercise helps establish visual intention. It does not determine whether the wall is suitable for a particular object or resolve the information a project team needs before selecting materials and an installation approach.",
        ],
      },
      {
        id: "study-a-single-panel",
        heading: "Study the presence of a single panel",
        paragraphs: [
          "One panel can make the composition read as a continuous field. Its outer boundary becomes especially important: a wide band, an upright form or a more compact shape each establishes a different relationship with the wall. In a sketch, compare how much background remains visible around the proposal. That unoccupied area is part of the composition rather than leftover space to fill automatically.",
          "The Horizon fixture offers a fictional wall-panel concept for this conversation. Its text and proposed dimensions are starting material, with any missing visual clearly left pending. Do not enlarge a sample proportion without reconsidering the relationship to the real wall and viewing distance. Questions about construction, weight, handling and support need separate project-specific answers; a strong graphic outline does not supply those technical decisions.",
        ],
      },
      {
        id: "study-a-diptych",
        heading: "Study the dialogue between two parts",
        paragraphs: [
          "A diptych introduces a relationship between two elements and the interval that separates them. You might explore a shared line continuing across the gap, a balanced pair or a deliberately unequal arrangement. Draw the two parts first as plain shapes. This allows you to consider proportion and rhythm before surface detail makes one version seem more persuasive simply because it is more elaborately illustrated.",
          "Treat the interval as an active design choice. A narrow visual pause and a broad separation can change whether the work reads as one composition or two related objects. No universal gap is proposed here. Record alternatives and ask how they relate to the actual wall, adjacent openings and intended viewpoint. The two-part study is an editorial possibility, not an additional catalogue product or approved mounting arrangement.",
        ],
      },
      {
        id: "study-a-triptych",
        heading: "Study rhythm across three parts",
        paragraphs: [
          "Three elements make repetition and variation particularly visible. A triptych might use similar widths to establish an even rhythm, or give one part a different role. Consider where the viewer’s attention begins and where it rests. A central emphasis may suit one intention; a sequence that moves across the wall may suit another. Neither approach should be selected solely because the number of panels feels complete.",
          "Compare the overall outer boundary with the gaps inside it. A three-part arrangement can occupy a much larger visual area than any individual panel suggests, so show it within the full wall elevation. Label every dimension as proposed until reviewed. The drawing should help the studio discuss an original composition and its feasibility, without implying that repetition makes fabrication, support or installation straightforward or already agreed.",
        ],
      },
      {
        id: "consider-near-and-distant-views",
        heading: "Consider near and distant views",
        paragraphs: [
          "Stand at the points from which the wall is normally seen and describe the kind of detail likely to matter there. From one approach, the overall outline may dominate; closer to the wall, the relationships within the surface may become more interesting. Include both viewpoints in the brief so the discussion does not depend on a single carefully composed rendering that nobody will experience in everyday use.",
          "Consider surrounding light as context, while avoiding performance assumptions about an unspecified material. A bright opening, an adjacent reflective surface or planned lighting may alter the visual impression and deserve further discussion. Ask what samples or mockups could help assess the particular proposal. The article does not prescribe lighting equipment or certify how a resin formulation will look, age or behave under any specific condition.",
        ],
      },
      {
        id: "separate-composition-from-installation",
        heading: "Separate the composition from its installation brief",
        paragraphs: [
          "Collect the preferred arrangement, its proposed extent and the reasons behind it into a short composition brief. Alongside that, keep a separate list of information needed about the real wall, object and access route. Identify who will assess support, fixings and other applicable project requirements. A visual preference can be clear while those responsibilities and details remain unresolved; making that distinction explicit protects the quality of the conversation.",
          "Use the current preview only to explore fictional design notes. Its catalogue and local forms do not confirm fabrication or arrange installation. A real wall-art proposal needs reviewed material information, project-specific coordination and an agreed scope before it can progress beyond a concept. The single panel, diptych and triptych studies are ways to frame the design discussion, with no delivered installation or extra authored product record implied.",
        ],
      },
    ],
  },
  {
    ...editorialDefaults,
    id: "DB011",
    slug: "from-a-mood-board-to-a-material-conversation",
    title: "From a Mood Board to a Material Conversation",
    excerpt: "Give every reference a clear job, then separate the mood it suggests from the samples, drawings and recorded choices a real object will need.",
    category: "Materials",
    relatedProductIds: ["DP001", "DP013", "DP025"],
    imageBriefId: "JOURNAL-DB011",
    reviewNotes: [
      "Original owner-review demo editorial; no live material approval or customer workflow is represented.",
      "References, physical samples, drawings and specifications carry different information and require explicit status labels.",
      "This does not introduce the excluded enhanced finish-comparison tool or a private client approval portal.",
    ],
    sections: [
      {
        id: "give-the-board-a-question",
        heading: "Give the board a question to answer",
        paragraphs: [
          "A mood board becomes more useful when it has a purpose beyond collecting attractive images. Decide what you are trying to explain: a quiet room with one expressive surface, an object that relates to existing timber, or a contrast between a strong outline and a restrained palette. Write that intention at the top. It gives every reference a reason to be included and makes omissions easier to recognise.",
          "Choose only a few images at first. A large collection can conceal uncertainty because each image suggests a different answer. If two references conflict, keep both only when the difference itself is useful to discuss. The board is an instrument for finding a direction, not proof that all its materials, dimensions and details can be combined into one feasible commissioned object.",
        ],
      },
      {
        id: "annotate-what-each-image-means",
        heading: "Annotate what each image means",
        paragraphs: [
          "Write a short note beside each reference identifying the particular quality that matters. It could be the spacing between two shapes, the apparent depth of a colour area or the balance of a top and base. Be equally clear about what you are not carrying forward. A useful image may contain a room layout, object size or decorative detail that has no relevance to your project.",
          "Keep authorship and source information with any material shared in a real brief, and use references you are entitled to share. Discuss the underlying design relationship rather than requesting a copy of another maker’s object. Originality becomes easier to preserve when the board explains intentions in words. It also helps the studio respond to your actual room instead of reproducing the setting that happened to make a photograph appealing.",
        ],
      },
      {
        id: "sort-the-kinds-of-information",
        heading: "Sort the kinds of information you have",
        paragraphs: [
          "An inspiration photograph, a concept rendering and a physical sample answer different questions. The photograph may communicate an atmosphere; the rendering may explore a proposed composition; the sample may allow a particular surface to be considered directly. Give each item a plain status label. Otherwise, a material suggested in a rendering can quietly be remembered as a confirmed option even though no one has reviewed it.",
          "Do the same with dimensions and written notes. Measured room information is different from a preferred object size, and both are different from an agreed specification. A simple list with columns for known, proposed and awaiting confirmation can help a real discussion. It does not need an elaborate approval system. The important point is that people can see which information they are relying on and what still needs a decision.",
        ],
      },
      {
        id: "bring-in-physical-samples",
        heading: "Bring physical samples into the conversation",
        paragraphs: [
          "Ask which actual samples are relevant to the options being considered and what each sample represents. A small piece may communicate colour or surface character without demonstrating every aspect of a finished object. Record the description provided by the studio, including any limits on what can be inferred from it. Avoid assuming that a sample settles construction, performance or the appearance of a much larger composition.",
          "Consider samples alongside the room’s retained materials where an appropriate real review is possible, and note the viewing context. Screens and printed references remain useful communication aids, but they should not be treated as exact colour standards. If an impression differs from the mood board, return to the original intention and discuss the difference. The aim is an informed choice, not forcing a physical material to match an ambiguous image.",
        ],
      },
      {
        id: "record-decisions-with-their-scope",
        heading: "Record decisions with their scope",
        paragraphs: [
          "When a real choice is made, state what the choice actually covers. Selecting an appearance direction is not the same as agreeing an entire object specification. A useful note identifies the item discussed, the reference or sample involved and the questions left open. That record helps later conversations stay connected to the decision itself rather than to different recollections of a broad approval word.",
          "Keep the latest agreed information distinguishable from abandoned alternatives, while retaining whatever project records the participants need. Changes to shape, material or context may require earlier assumptions to be revisited. This is ordinary communication guidance, not a promise of a particular RivyaLivingArt approval service. The protected frontend contains no real customer approval portal, and the excluded enhanced finish-comparison feature is not part of this workflow.",
        ],
      },
      {
        id: "turn-the-board-into-a-brief",
        heading: "Turn the board into a concise brief",
        paragraphs: [
          "Finish by reducing the board to a few sentences someone else could use to understand the direction. Describe the object’s role, the visual relationships to preserve and the practical information still needed. Attach only the references that support those sentences, with their labels intact. If the description becomes contradictory, that is useful feedback: the board may need one more conversation before it can guide a coherent proposal.",
          "The Riverline, Basin and Twinleaf fixtures can provide fictional starting points for an exercise, but their preview material fields are not approved real samples. Explore the local commission form with invented details only; it creates a demo summary and sends nothing. Actual material choices, specification records and project commitments belong to the studio’s reviewed process, with the participants clear about what has been explored and what has truly been agreed.",
        ],
      },
    ],
  },
  {
    ...editorialDefaults,
    id: "DB012",
    slug: "light-transparency-and-the-look-of-resin",
    title: "Light, Transparency and the Look of Resin",
    excerpt: "Describe what a reference image seems to show, then ask what would need a real sample. A visual notebook on backgrounds, viewpoints, reflections and the impression of depth.",
    category: "Materials",
    relatedProductIds: ["DP001", "DP013", "DP069"],
    imageBriefId: "JOURNAL-DB012",
    reviewNotes: [
      "Original demo editorial about visual perception and art direction, not resin chemistry or performance.",
      "No transparency, colour stability, durability, UV resistance or other property is certified for a real formulation.",
      "Images and future sample studies must be labelled by source, product mapping and viewing context.",
    ],
    sections: [
      {
        id: "describe-the-impression",
        heading: "Describe the impression before naming a property",
        paragraphs: [
          "A reference image may make a resin area appear deep, luminous, smoky or almost opaque. Those words can be useful in a design conversation when they describe an impression rather than claim a verified material property. Begin by saying what you notice and where you notice it. Does the effect seem strongest at an edge, across a broad area or beside a contrasting material?",
          "Then explain why the impression matters to your brief. You may be drawn to a sense of visual depth or to the way a quiet colour area sits beside visible grain. That preference can be discussed without assuming a particular formulation or finish. The distinction keeps an appealing photograph in its proper role as a visual reference while leaving the actual material system to be identified and reviewed.",
        ],
      },
      {
        id: "notice-the-background",
        heading: "Notice what sits behind and around the object",
        paragraphs: [
          "Look beyond the object in a reference image. A pale background, a dark floor or nearby furniture contributes to the appearance of the whole composition. When you compare two images with different settings, you may be responding to those surroundings as much as to the material itself. Make a note of the background before drawing conclusions about which surface or colour you prefer.",
          "An art-direction study can hold the proposed object and viewpoint constant while exploring a small number of clearly labelled background alternatives. Such an illustration is a way to discuss visual relationships, not a simulation that proves how a physical product will behave. No new imagery is provided by this draft. Any future study should identify whether it is a concept image, an approved photograph or a documented sample view.",
        ],
      },
      {
        id: "compare-viewpoints-carefully",
        heading: "Compare viewpoints carefully",
        paragraphs: [
          "A top view, a side view and a close detail show different parts of a design. One may emphasise the arrangement of materials, another the edge and another the way a particular area catches the eye. When building a brief, identify which viewpoint supports the observation you are making. A detail image can be compelling while telling you very little about the complete object in a room.",
          "Do not assume that an unseen area has the same appearance as the photographed section. Ask what additional views or physical samples would help clarify the proposal. For the fictional catalogue, an unavailable angle should remain an explicit missing visual, not be replaced by another product’s image. Honest gaps make the material conversation more useful because they show what still needs to be considered before any appearance is agreed.",
        ],
      },
      {
        id: "separate-reflections-from-colour",
        heading: "Separate reflections from colour preferences",
        paragraphs: [
          "When looking at a glossy-looking reference, consider whether a bright area belongs to the surface’s apparent colour or to something reflected in it. You may not be able to settle that question from one image, and it is useful to say so. Describe the visual effect you like without building a specification around an uncertain interpretation of a highlight or a dark patch.",
          "The setting of the eventual object matters to the discussion as well. Large windows, nearby colours and planned lighting are worth showing in the room context, but this editorial exercise does not prescribe lighting or predict a finished surface. Ask which actual samples and viewing conditions are appropriate for a real review. A preference for a calm appearance should be explored with reliable information, not translated automatically into an unsupported finish claim.",
        ],
      },
      {
        id: "read-the-edge-and-interior",
        heading: "Read the edge and the apparent interior",
        paragraphs: [
          "Some concept images draw attention to the boundary between materials; others invite you to look into an area that seems to have depth. These are different compositional interests. In a brief, specify whether you are responding to the outline, the colour field, the meeting of surfaces or the apparent layers within it. The more precisely you describe the observation, the less the conversation depends on a vague request for transparency.",
          "Keep that visual vocabulary separate from measurable properties of a real formulation. An image does not establish optical performance, colour stability, resistance to exposure or suitability for a particular use. Those questions need information about the actual materials and finished object. The Riverline, Basin and Lattice references remain fictional concepts; their names and sample descriptions cannot supply evidence for claims that have never been assessed or approved.",
        ],
      },
      {
        id: "ask-for-a-grounded-review",
        heading: "Ask for a grounded visual review",
        paragraphs: [
          "Turn your observations into a short request for clarification. Identify the reference, describe the impression you want to explore and ask which real sample or documented view could help discuss it. Include the intended setting and distinguish fixed room conditions from ideas still under consideration. The goal is to connect a visual intention to information that can be reviewed, rather than to demand an exact effect from an unspecified image.",
          "Treat conclusions as provisional until the relevant participants have considered the actual proposal and its documentation. This draft makes no promise about a resin formulation, its longevity or its response to any environment. The protected frontend provides labelled concept content and local fictional planning tools only. A real commission needs an agreed material specification and owner-reviewed guidance before appearance language can become a meaningful part of the project record.",
        ],
      },
    ],
  },
  ...additionalJournalArticles,
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

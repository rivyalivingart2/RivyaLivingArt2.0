import Link from "next/link";
import type { ComponentProps } from "react";
import { WorldIntro } from "@/components/content-section-public-parts";
import { ConceptImage } from "@/components/concept-image";
import {
  PublicPageHeader as SharedPageHeader,
  PublicSampleNotice as SharedSampleNotice,
  PublicPageClosing as SharedPageClosing,
} from "@/components/public-page";
import { Arrow } from "@/components/ui/arrow";
import { furnitureConcepts } from "@/lib/catalogue";
import { businessContact } from "@/lib/contact";
import {
  careTopics, contactJourneys, materialDirections,
  planningSteps, professionalBriefAreas,
} from "@/lib/editorial";
import styles from "./editorial-pages.module.css";

function PublicPageHeader(props: ComponentProps<typeof SharedPageHeader>) {
  return <div className={styles.heading}><SharedPageHeader {...props} /></div>;
}

function PublicSampleNotice(props: ComponentProps<typeof SharedSampleNotice>) {
  return <div className={styles.noticeWrap}><SharedSampleNotice {...props} /></div>;
}

function PublicPageClosing(props: ComponentProps<typeof SharedPageClosing>) {
  return <div className={styles.closingWrap}><SharedPageClosing {...props} /></div>;
}

export function AboutPage() {
  const study = furnitureConcepts.find((piece) => piece.id === "DP001");

  return <main id="main-content" className={styles.page}>
    <PublicPageHeader eyebrow="About RivyaLivingArt" title="A material-led point of view." intro="Furniture with presence. Objects with meaning. A shared language across three scales of expression." />
    <PublicSampleNotice>Sample editorial direction, awaiting owner review. The story below introduces the design vision; verified artist, studio and workshop information is still to come.</PublicSampleNotice>
    <section className={styles.manifesto} aria-labelledby="about-perspective">
      <div className={styles.manifestoCopy}>
        <p className="eyebrow">The room is the beginning</p>
        <h2 id="about-perspective">An object changes<br /><em>how a space feels.</em></h2>
        <p>A table can anchor a room before anything is placed on it. An edge can catch the eye; a quieter form can let the material do the talking. That relationship between an object and its surroundings leads the RivyaLivingArt design direction.</p>
        <p>The fictional collection explores resin alongside wood, metal and mineral-inspired forms. Grain, colour, light and proportion become ways of asking a simple question: what kind of presence belongs here?</p>
        <Link className="text-link" href="/collectible-design">Discover collectible design <Arrow /></Link>
      </div>
      {study ? <figure className={styles.portrait}>
        <div className={styles.portraitImage}><ConceptImage src={study.image} alt={study.alt} fill sizes="(max-width: 760px) 90vw, 47vw" /></div>
        <figcaption><span>{study.title} / furniture study</span><span>AI concept visualization · fictional design, not a completed commission</span></figcaption>
      </figure> : null}
    </section>
    <section className={styles.worldSection} aria-labelledby="about-worlds">
      <div className={styles.sectionHeading}><p className="eyebrow">One point of view</p><h2 id="about-worlds">The scale changes.<br /><em>The intention stays personal.</em></h2></div>
      <WorldIntro />
    </section>
    <section className={styles.pairedNote} aria-labelledby="about-story">
      <div><p className="eyebrow">A story still taking shape</p><h2 id="about-story">Meet the work.<br /><em>Then meet the makers.</em></h2></div>
      <div><p>A complete studio story needs real names, approved portraits and first-hand workshop details. Those materials have not been supplied for this preview, so the collection speaks through its labelled design studies for now.</p><p>Explore the thinking behind a brief, the material directions and the questions that would guide a real conversation.</p><div className={styles.inlineLinks}><Link href="/process" className="text-link">Explore the planning process <Arrow /></Link><Link href="/materials" className="text-link">Read the material notes <Arrow /></Link></div></div>
    </section>
    <PublicPageClosing title="A direction that begins with you." description="Explore a fictional brief for your space, a memory or a personal gift." href="/contact" label="Choose a conversation" />
  </main>;
}

export function ProcessPage() {
  return <main id="main-content" className={styles.page}>
    <PublicPageHeader eyebrow="From idea to brief" title="Begin with a possibility." intro="A considered brief gives a creative idea somewhere to go. Start with its meaning, then make room for the practical questions." />
    <PublicSampleNotice>Conceptual planning guide · owner review required. These steps describe preparing a brief, not a verified fabrication process or a production schedule.</PublicSampleNotice>
    <section className={styles.processSection} aria-labelledby="planning-title">
      <div className={styles.processIntro}><p className="eyebrow">Four conversations</p><h2 id="planning-title">Shape the idea.<br /><em>Clarify the unknowns.</em></h2><p>There is no need to arrive with every answer. A useful starting point makes the intention clear and shows where advice is needed.</p><Link href="/commission" className="text-link">Try a sample furniture brief <Arrow /></Link></div>
      <ol className={styles.steps}>{planningSteps.map((step) => <li key={step.number}>
        <span className={styles.stepNumber} aria-hidden="true">{step.number}</span><div><h3>{step.title}</h3><p>{step.body}</p><blockquote>{step.question}</blockquote><p className={styles.outcome}><strong>A useful next detail</strong>{step.outcome}</p></div>
      </li>)}</ol>
    </section>
    <section className={styles.pairedNote} aria-labelledby="process-specific">
      <div><p className="eyebrow">Different objects, different questions</p><h2 id="process-specific">Let the piece<br /><em>guide the detail.</em></h2></div>
      <div><p>A large table needs a conversation about scale, function and access. A preserved keepsake needs a review of the actual material and its condition before any handling or shipping is agreed. A personal gift begins with the options that its design permits.</p><p>For a real commission, the studio must confirm its own material preparation, casting, curing, finishing and quality-review process where relevant. No workshop stage or turnaround is established by this sample guide.</p><div className={styles.inlineLinks}><Link className="text-link" href="/preserve">Explore a preservation brief <Arrow /></Link><Link className="text-link" href="/personalize">Explore a gifting brief <Arrow /></Link></div></div>
    </section>
    <PublicPageClosing title="Give your idea a little shape." description="Use fictional details in the sample form. You can review a local summary; nothing is sent to the studio." href="/commission" label="Start a demo brief" />
  </main>;
}

export function MaterialsPage() {
  return <main id="main-content" className={styles.page}>
    <PublicPageHeader eyebrow="Material notes" title="Grain. Light. Weight. Form." intro="Four material directions, explored through the relationships they suggest: warm and cool, quiet and expressive, solid and translucent." />
    <PublicSampleNotice>Sample editorial material notes · owner review required. These descriptions explain a visual language; actual composition, sourcing, suitability and performance must be confirmed for each real piece.</PublicSampleNotice>
    <nav className={styles.topicNav} aria-label="Material directions">{materialDirections.map((material) => <a key={material.id} href={`#material-${material.id}`}>{material.title}<span aria-hidden="true">↘</span></a>)}</nav>
    <div className={styles.materials}>{materialDirections.map((material) => <section className={styles.material} id={`material-${material.id}`} aria-labelledby={`material-title-${material.id}`} key={material.id}>
      <div className={styles.materialTitle}><p className="eyebrow">{material.number} / A visual direction</p><h2 id={`material-title-${material.id}`}>{material.title}</h2><p>{material.phrase}</p></div>
      <div className={styles.materialBody}><p>{material.body}</p><h3>Questions for a real specification</h3><ul>{material.considerations.map((question) => <li key={question}>{question}</li>)}</ul><Link href={`/collectible-design?material=${material.id}`} className="text-link">Explore {material.title.toLowerCase()} concept studies <Arrow /></Link></div>
    </section>)}</div>
    <section className={styles.pairedNote} aria-labelledby="material-sample">
      <div><p className="eyebrow">From a screen to a surface</p><h2 id="material-sample">A visual is<br /><em>a starting point.</em></h2></div>
      <div><p>Lighting, surroundings and the display you are using all influence an image. An approved physical sample, where available and agreed with the studio, would make a more useful reference for discussing a final tone or finish.</p><p>The preview contains two labelled concept images. It does not contain documentary workshop photography, certified material data or verified examples of completed work.</p><Link className="text-link" href="/care">Questions to ask about care <Arrow /></Link></div>
    </section>
    <PublicPageClosing title="Find your material direction." description="Explore the fictional collection, then use a sample brief to put your preferences into words." href="/collectible-design" label="Explore collectible design" />
  </main>;
}

export function CarePage() {
  return <main id="main-content" className={styles.page}>
    <PublicPageHeader eyebrow="Living with your piece" title="Care begins with knowing." intro="A material, a finish and a setting belong together. The most useful care information is written for the actual piece in front of you." />
    <PublicSampleNotice>Care questions for owner review. Approved care instructions have not been supplied. This page is a discussion guide, not a cleaning, handling, repair or safety protocol.</PublicSampleNotice>
    <section className={styles.careIntro} aria-labelledby="care-specific"><p className="eyebrow">Keep the guidance specific</p><h2 id="care-specific">Ask about the object.<br /><em>Not only the material.</em></h2><p>Two pieces described as resin furniture may use different finishes, supporting materials or construction details. A preservation piece may introduce other sensitive materials. Use the questions below to request the right instructions before applying a treatment or arranging a move.</p></section>
    <section className={styles.careGrid} aria-label="Questions for piece-specific care">{careTopics.map((topic) => <article className={styles.careTopic} key={topic.number}>
      <p className="eyebrow">{topic.number} / Questions to ask</p><h3>{topic.title}</h3><p>{topic.intro}</p><ul>{topic.questions.map((question) => <li key={question}>{question}</li>)}</ul>
    </article>)}</section>
    <section className={styles.pairedNote} aria-labelledby="care-keepsake"><div><p className="eyebrow">For meaningful materials</p><h2 id="care-keepsake">Before a keepsake<br /><em>changes hands.</em></h2></div><div><p>Flowers, paper and other personal objects need a suitability conversation about their actual condition. Ask the studio to confirm whether it can accept the material, what information it needs and how any agreed shipment should be prepared.</p><p>No receiving address, packaging method or preservation guarantee is established in this preview. The sample preservation form provides a place to describe a fictional idea and note those questions.</p><Link className="text-link" href="/preserve">Explore a sample preservation brief <Arrow /></Link></div></section>
    <PublicPageClosing title="Keep your questions close." description="Browse the sample FAQ for more context, including what still needs confirmation before a real request." href="/faq" label="Read the sample FAQ" />
  </main>;
}

export function ContactPage() {
  return <main id="main-content" className={styles.page}>
    <PublicPageHeader eyebrow="A conversation starts here" title="Your space. Your story. Your piece." intro="Begin with the kind of object you have in mind. The right questions will follow." />
    <PublicSampleNotice>Sample contact journeys. Use fictional details only: these forms create a local summary and simulated receipt. Nothing is sent, uploaded or saved.</PublicSampleNotice>
    <section className={styles.contactGrid} aria-label="Choose a sample inquiry journey">{contactJourneys.map((journey) => <article className={styles.contactCard} key={journey.number}>
      <span className={styles.contactNumber} aria-hidden="true">{journey.number}</span><h2>{journey.title}</h2><p>{journey.body}</p><p className={styles.contactDetails}>{journey.details}</p><Link href={journey.href} className="text-link">{journey.label}<Arrow /></Link>
    </article>)}</section>
    <section className={styles.contactChannels} aria-labelledby="contact-direct"><div><p className="eyebrow">Direct contact</p><h2 id="contact-direct">Bring the idea<br /><em>into conversation.</em></h2></div><div>
      <p>Contact details supplied by RivyaLivingArt. For a real conversation, contact the studio directly and confirm any visit in advance.</p>
      <dl className={styles.contactDetailsList}>
        <div><dt>Phone</dt><dd><a href={businessContact.phoneHref}>{businessContact.phone}</a></dd></div>
        <div><dt>Email</dt><dd><a href={businessContact.emailHref}>{businessContact.email}</a></dd></div>
        <div><dt>WhatsApp</dt><dd>{businessContact.whatsapp}<small>The demo message handoff is disconnected.</small></dd></div>
        <div><dt>Location</dt><dd><a href={businessContact.locationHref} target="_blank" rel="noopener noreferrer">View supplied map location <span className="sr-only">(opens a new tab)</span><Arrow /></a></dd></div>
      </dl>
      <p>Sample form entries stay in this browser page. They are never added to these contact links. A simulated receipt does not reach the studio or reserve a piece, a date or a consultation.</p>
      <div className={styles.inlineLinks}><Link href="/faq" className="text-link">Read common questions <Arrow /></Link><Link href="/architects" className="text-link">For architects & designers <Arrow /></Link></div>
    </div></section>
    <PublicPageClosing title="Still finding the direction?" description="Discover furniture first, then explore memory art and personal pieces at your own pace." href="/collectible-design" label="Explore the collection" />
  </main>;
}

export function ArchitectsPage() {
  return <main id="main-content" className={styles.page}>
    <PublicPageHeader eyebrow="For architects & interior designers" title="A piece in conversation with a space." intro="Bring the room, the proportions and the practical constraints into the same brief. Let the object find its place within the wider project." />
    <PublicSampleNotice>Sample professional project journey · owner review required. This is a local demo brief, not a trade programme, service agreement or confirmed consultation.</PublicSampleNotice>
    <section className={styles.professionalIntro} aria-labelledby="professional-context"><div><p className="eyebrow">Start with the wider picture</p><h2 id="professional-context">The room sets<br /><em>the context.</em></h2></div><div><p>A furniture commission is part of a larger composition: movement through a room, the objects around it, the materials it meets and the way the space will be used. A project brief can make those relationships visible before a design is resolved.</p><p>Use the existing commission journey for a fictional project. Put project type and intended use in the project description, then add dimensions, material preferences and access notes where prompted. No account is required.</p><Link className="button button-primary" href="/commission">Prepare a demo project brief <Arrow /></Link></div></section>
    <section className={styles.professionalAreas} aria-labelledby="professional-brief"><div className={styles.sectionHeading}><p className="eyebrow">A useful starting brief</p><h2 id="professional-brief">Four areas to<br /><em>bring into focus.</em></h2></div><div className={styles.careGrid}>{professionalBriefAreas.map((area) => <article className={styles.careTopic} key={area.number}><p className="eyebrow">{area.number} / Project context</p><h3>{area.title}</h3><p>{area.body}</p><ul>{area.prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ul></article>)}</div></section>
    <section className={styles.pairedNote} aria-labelledby="professional-confirm"><div><p className="eyebrow">Before specifying a real piece</p><h2 id="professional-confirm">A concept invites<br /><em>a closer conversation.</em></h2></div><div><p>The catalogue is a collection of fictional studies. Its dimensions, prices and lead times are sample values, not an approved schedule of products for procurement.</p><p>For a real project, ask the studio to confirm suitability, final dimensions, materials, finishes, structural or installation requirements, available documentation, pricing and timing. Any consultation scope, professional terms or project deliverables must be agreed separately.</p><div className={styles.inlineLinks}><Link href="/materials" className="text-link">Read the material notes <Arrow /></Link><Link href="/process" className="text-link">Explore brief planning <Arrow /></Link></div></div></section>
    <PublicPageClosing title="Begin with the project." description="Try the commission form with a fictional room and requirements. Review the local summary before editing the brief further." href="/commission" label="Start a demo commission brief" />
  </main>;
}

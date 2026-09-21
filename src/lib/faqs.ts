/** Supplied Revision 8 FAQ drafts; protected source fixtures, never approved business policy. */
export const faqGroups = [
  {
    "id": "commissioning",
    "label": "Commissioning"
  },
  {
    "id": "materials-customization",
    "label": "Materials and customization"
  },
  {
    "id": "memory-preservation",
    "label": "Memory and preservation"
  },
  {
    "id": "personal-gifting",
    "label": "Personal art and gifting"
  },
  {
    "id": "enquiries-quotations",
    "label": "Enquiries and quotations"
  },
  {
    "id": "delivery-care",
    "label": "Delivery installation and care"
  },
  {
    "id": "privacy-demo",
    "label": "Website privacy and demo"
  }
] as const;

export type FaqGroupId = (typeof faqGroups)[number]["id"];
export type FaqRecord = Readonly<{
  id: string;
  groupId: FaqGroupId;
  question: string;
  answer: string;
  previewNote?: string;
  references: readonly Readonly<{ href: string; label: string }>[];
  originKind: "DEMO_FIXTURE";
  demoVersion: 1;
  contentStatus: "OWNER_REVIEW_DRAFT";
}>;

const draft = {
  originKind: "DEMO_FIXTURE",
  demoVersion: 1,
  contentStatus: "OWNER_REVIEW_DRAFT",
} as const;

// Question and answer wording comes directly from the supplied demo blueprint.
// References and adjacent preview notes describe the actual frontend boundary.
export const faqs: readonly FaqRecord[] = [
  {
    ...draft,
    "id": "DF001",
    "groupId": "commissioning",
    "question": "Can I request a custom dining table?",
    "answer": "Use the commission enquiry to describe the intended piece. The studio reviews the request and confirms what can be offered.",
    "previewNote": "In this preview, the commission form creates a local demo summary only. Nothing is submitted, saved or sent to the studio.",
    "references": [
      {
        "href": "/commission",
        "label": "Explore a sample commission"
      },
      {
        "href": "/collectible-design",
        "label": "Furniture studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF002",
    "groupId": "commissioning",
    "question": "What information should my furniture enquiry include?",
    "answer": "Share the object type, proposed dimensions, preferred visual direction, location and timing. Attach references only when you have permission to share them.",
    "previewNote": "Use fictional details and safe sample references in the current form. An image preview stays in this browser; it is never uploaded.",
    "references": [
      {
        "href": "/commission",
        "label": "Explore a sample commission"
      },
      {
        "href": "/collectible-design",
        "label": "Furniture studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF003",
    "groupId": "commissioning",
    "question": "Can I choose a different size?",
    "answer": "Add the size you have in mind to the request. Availability and suitability are confirmed during consultation, not by the demo options.",
    "references": [
      {
        "href": "/commission",
        "label": "Explore a sample commission"
      },
      {
        "href": "/collectible-design",
        "label": "Furniture studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF004",
    "groupId": "commissioning",
    "question": "Can an architect submit a project brief?",
    "answer": "The project enquiry can capture professional project context and reference plans. Access and installation details should be discussed directly.",
    "previewNote": "The current commission preview accepts fictional project context and one local sample image. It cannot receive real plans or send a professional enquiry.",
    "references": [
      {
        "href": "/commission",
        "label": "Explore a sample commission"
      },
      {
        "href": "/collectible-design",
        "label": "Furniture studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF005",
    "groupId": "commissioning",
    "question": "Do you offer chairs and benches?",
    "answer": "This demo shows possible catalogue categories. The actual offered range must be confirmed by the owner before live publication.",
    "references": [
      {
        "href": "/commission",
        "label": "Explore a sample commission"
      },
      {
        "href": "/collectible-design",
        "label": "Furniture studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF006",
    "groupId": "commissioning",
    "question": "Does a render show the final manufactured object?",
    "answer": "A concept visualization illustrates a design direction. Final appearance, specifications and feasibility need separate approval.",
    "references": [
      {
        "href": "/commission",
        "label": "Explore a sample commission"
      },
      {
        "href": "/collectible-design",
        "label": "Furniture studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF007",
    "groupId": "materials-customization",
    "question": "How do I describe a resin colour?",
    "answer": "Share an approved reference and describe the intended impression. Screens and concepts do not establish an exact physical match.",
    "references": [
      {
        "href": "/materials",
        "label": "Materials & finish directions"
      },
      {
        "href": "/collectible-design",
        "label": "Furniture studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF008",
    "groupId": "materials-customization",
    "question": "Can I discuss wood and resin combinations?",
    "answer": "Record your preferences in the enquiry. The studio will confirm actual options rather than treating demo selections as available inventory.",
    "previewNote": "The current enquiry is a local demonstration. Choices are not inventory reservations and no request reaches the studio.",
    "references": [
      {
        "href": "/materials",
        "label": "Materials & finish directions"
      },
      {
        "href": "/collectible-design",
        "label": "Furniture studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF009",
    "groupId": "materials-customization",
    "question": "Where can I find product dimensions?",
    "answer": "Look at the specifications panel. Demo dimensions are sample values; request verified dimensions for a real commission.",
    "references": [
      {
        "href": "/materials",
        "label": "Materials & finish directions"
      },
      {
        "href": "/collectible-design",
        "label": "Furniture studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF010",
    "groupId": "materials-customization",
    "question": "Can I request a particular finish?",
    "answer": "Choose a listed option or describe your preference. The final finish must be agreed using the actual product information.",
    "references": [
      {
        "href": "/materials",
        "label": "Materials & finish directions"
      },
      {
        "href": "/collectible-design",
        "label": "Furniture studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF011",
    "groupId": "materials-customization",
    "question": "Can I add personal text or initials?",
    "answer": "Applicable products include personalization fields. Check spelling and formatting carefully before the final approval.",
    "references": [
      {
        "href": "/materials",
        "label": "Materials & finish directions"
      },
      {
        "href": "/collectible-design",
        "label": "Furniture studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF012",
    "groupId": "materials-customization",
    "question": "Are sample prices a binding quote?",
    "answer": "No. Demo figures illustrate interface behavior. Real price and scope are confirmed by the studio for the actual request.",
    "references": [
      {
        "href": "/materials",
        "label": "Materials & finish directions"
      },
      {
        "href": "/collectible-design",
        "label": "Furniture studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF013",
    "groupId": "memory-preservation",
    "question": "Can I enquire about varmala preservation?",
    "answer": "Use the memory-art enquiry to describe the flowers and desired format. The studio must confirm the process and suitability.",
    "previewNote": "The memory-art form currently creates a local demo summary. It does not send a preservation request or confirm suitability.",
    "references": [
      {
        "href": "/preserve",
        "label": "Explore a sample preservation request"
      },
      {
        "href": "/memory-art",
        "label": "Memory-art studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF014",
    "groupId": "memory-preservation",
    "question": "How should I send my flowers?",
    "answer": "Ask the studio for its current written instructions before sending anything. This sample answer intentionally does not invent packaging or transport rules.",
    "references": [
      {
        "href": "/preserve",
        "label": "Explore a sample preservation request"
      },
      {
        "href": "/memory-art",
        "label": "Memory-art studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF015",
    "groupId": "memory-preservation",
    "question": "Can I include a wedding invitation?",
    "answer": "Describe the material and desired arrangement. Share scans or originals only under the agreed process and with permission.",
    "previewNote": "Do not provide private scans or original material through this preview. Any selected sample image remains local and is never uploaded.",
    "references": [
      {
        "href": "/preserve",
        "label": "Explore a sample preservation request"
      },
      {
        "href": "/memory-art",
        "label": "Memory-art studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF016",
    "groupId": "memory-preservation",
    "question": "Can I preview names and dates?",
    "answer": "Request a personalization proof during the design discussion. Verify every name and date before approval.",
    "previewNote": "The local form lets you review typed sample text. An owner-reviewed design proof and real approval process are not connected.",
    "references": [
      {
        "href": "/preserve",
        "label": "Explore a sample preservation request"
      },
      {
        "href": "/memory-art",
        "label": "Memory-art studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF017",
    "groupId": "memory-preservation",
    "question": "Can I upload a private reference photograph?",
    "answer": "The enquiry supports private references for authorized staff. Publication or other reuse needs a separate appropriate permission.",
    "previewNote": "This describes a future capability. Private uploads and staff access are not implemented. The current form only previews a safe sample image locally; do not select private customer media.",
    "references": [
      {
        "href": "/preserve",
        "label": "Explore a sample preservation request"
      },
      {
        "href": "/memory-art",
        "label": "Memory-art studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF018",
    "groupId": "memory-preservation",
    "question": "Can every sentimental object be preserved?",
    "answer": "Suitability requires review of the actual object and the studio process. Do not rely on a demo design as a preservation guarantee.",
    "references": [
      {
        "href": "/preserve",
        "label": "Explore a sample preservation request"
      },
      {
        "href": "/memory-art",
        "label": "Memory-art studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF019",
    "groupId": "personal-gifting",
    "question": "Can I personalize a small gift?",
    "answer": "Applicable products offer fields for a name, initial, colour or short message. Actual available options are confirmed for the live product.",
    "previewNote": "The sample gift form shows only the fields configured for the selected fictional product. It creates no real personalization request.",
    "references": [
      {
        "href": "/personalize",
        "label": "Explore a sample gift request"
      },
      {
        "href": "/personal-art",
        "label": "Personal-art studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF020",
    "groupId": "personal-gifting",
    "question": "Can I request multiple gifts together?",
    "answer": "Enter the quantity and relevant notes. Pricing, packaging and timing are agreed directly for the actual request.",
    "previewNote": "Quantity in the current form is a sample request value. No order is saved, reserved or sent.",
    "references": [
      {
        "href": "/personalize",
        "label": "Explore a sample gift request"
      },
      {
        "href": "/personal-art",
        "label": "Personal-art studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF021",
    "groupId": "personal-gifting",
    "question": "Can I enquire about corporate gifting?",
    "answer": "Describe the intended recipients, quantity and timing. Do not upload a company logo unless you have permission to use it.",
    "previewNote": "The current form accepts fictional notes and safe sample images only. No company logo is uploaded and no gifting enquiry is sent.",
    "references": [
      {
        "href": "/personalize",
        "label": "Explore a sample gift request"
      },
      {
        "href": "/personal-art",
        "label": "Personal-art studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF022",
    "groupId": "personal-gifting",
    "question": "Are festive products always available?",
    "answer": "Demo collections illustrate merchandising possibilities. Confirm current availability with the studio.",
    "references": [
      {
        "href": "/personalize",
        "label": "Explore a sample gift request"
      },
      {
        "href": "/personal-art",
        "label": "Personal-art studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF023",
    "groupId": "personal-gifting",
    "question": "Can I choose gift packaging?",
    "answer": "Add the request to your notes. Packaging options are subject to the actual offer and confirmation.",
    "references": [
      {
        "href": "/personalize",
        "label": "Explore a sample gift request"
      },
      {
        "href": "/personal-art",
        "label": "Personal-art studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF024",
    "groupId": "personal-gifting",
    "question": "Can a design be repeated for a set?",
    "answer": "Describe the desired consistency and variation. The studio will confirm the appropriate design and production approach.",
    "references": [
      {
        "href": "/personalize",
        "label": "Explore a sample gift request"
      },
      {
        "href": "/personal-art",
        "label": "Personal-art studies"
      }
    ]
  },
  {
    ...draft,
    "id": "DF025",
    "groupId": "enquiries-quotations",
    "question": "Is there an online checkout?",
    "answer": "No. The website saves your enquiry and helps you continue the discussion on WhatsApp; it does not process online payment.",
    "previewNote": "The save and WhatsApp steps describe the planned integrated website. This preview has no database submission, outgoing message, checkout or payment. It creates a simulated summary only.",
    "references": [
      {
        "href": "/commission",
        "label": "Explore the local form preview"
      },
      {
        "href": "/contact",
        "label": "Contact information"
      }
    ]
  },
  {
    ...draft,
    "id": "DF026",
    "groupId": "enquiries-quotations",
    "question": "Do I need a customer account?",
    "answer": "No customer registration is required. Login is reserved for authorized Studio staff.",
    "previewNote": "Customer accounts remain excluded. Real Studio staff authentication is not implemented in this frontend preview; deployment protection is separate from application login.",
    "references": [
      {
        "href": "/commission",
        "label": "Explore the local form preview"
      },
      {
        "href": "/contact",
        "label": "Contact information"
      }
    ]
  },
  {
    ...draft,
    "id": "DF027",
    "groupId": "enquiries-quotations",
    "question": "What happens after I submit a request?",
    "answer": "A successful submission saves the request and offers a WhatsApp continuation. That action alone is not order acceptance.",
    "previewNote": "Real submission is not connected. “Create demo summary” creates a simulated receipt in this browser only; nothing is saved or sent and no WhatsApp continuation is available.",
    "references": [
      {
        "href": "/commission",
        "label": "Explore the local form preview"
      },
      {
        "href": "/contact",
        "label": "Contact information"
      }
    ]
  },
  {
    ...draft,
    "id": "DF028",
    "groupId": "enquiries-quotations",
    "question": "Does opening WhatsApp confirm my order?",
    "answer": "No. A link click does not establish that a message was sent, a quote was accepted or a payment was made.",
    "previewNote": "There is no WhatsApp sending or order confirmation in this preview.",
    "references": [
      {
        "href": "/commission",
        "label": "Explore the local form preview"
      },
      {
        "href": "/contact",
        "label": "Contact information"
      }
    ]
  },
  {
    ...draft,
    "id": "DF029",
    "groupId": "enquiries-quotations",
    "question": "How do I refer to an existing request?",
    "answer": "Use the reference shown after a successful save. Staff can use it to locate the details you submitted.",
    "previewNote": "The current simulated receipt is not a saved enquiry and has no staff lookup reference. Real request references will follow backend integration.",
    "references": [
      {
        "href": "/commission",
        "label": "Explore the local form preview"
      },
      {
        "href": "/contact",
        "label": "Contact information"
      }
    ]
  },
  {
    ...draft,
    "id": "DF030",
    "groupId": "enquiries-quotations",
    "question": "What can I do if WhatsApp does not open?",
    "answer": "Use the retry or copy-summary fallback, or the supplied phone/email contact. A saved request remains distinct from a sent message.",
    "previewNote": "The current form can copy a local demo summary when browser clipboard access is allowed. There is no saved request, WhatsApp retry, outgoing message or configured studio phone/email action yet.",
    "references": [
      {
        "href": "/commission",
        "label": "Explore the local form preview"
      },
      {
        "href": "/contact",
        "label": "Contact information"
      }
    ]
  },
  {
    ...draft,
    "id": "DF031",
    "groupId": "delivery-care",
    "question": "How long will a piece take?",
    "answer": "Lead time depends on the real piece and agreed work. The owner must replace sample timing with verified information before live publication.",
    "references": [
      {
        "href": "/care",
        "label": "Care guidance"
      },
      {
        "href": "/commission",
        "label": "Explore a sample commission"
      }
    ]
  },
  {
    ...draft,
    "id": "DF032",
    "groupId": "delivery-care",
    "question": "Do you deliver to my location?",
    "answer": "Include your delivery location in the enquiry. Service area and charges require confirmation.",
    "references": [
      {
        "href": "/care",
        "label": "Care guidance"
      },
      {
        "href": "/commission",
        "label": "Explore a sample commission"
      }
    ]
  },
  {
    ...draft,
    "id": "DF033",
    "groupId": "delivery-care",
    "question": "Is installation included?",
    "answer": "Ask for the scope to be stated in your quote. This sample does not promise installation or include hidden charges.",
    "references": [
      {
        "href": "/care",
        "label": "Care guidance"
      },
      {
        "href": "/commission",
        "label": "Explore a sample commission"
      }
    ]
  },
  {
    ...draft,
    "id": "DF034",
    "groupId": "delivery-care",
    "question": "What access details are useful for large furniture?",
    "answer": "Describe access constraints and provide measurements or drawings requested by the studio. Do not assume a concept will fit a particular route.",
    "references": [
      {
        "href": "/care",
        "label": "Care guidance"
      },
      {
        "href": "/commission",
        "label": "Explore a sample commission"
      }
    ]
  },
  {
    ...draft,
    "id": "DF035",
    "groupId": "delivery-care",
    "question": "Where can I get care instructions?",
    "answer": "Use the approved instructions for the actual materials and finish. This demo does not establish temperature, chemical or exposure limits.",
    "references": [
      {
        "href": "/care",
        "label": "Care guidance"
      },
      {
        "href": "/commission",
        "label": "Explore a sample commission"
      }
    ]
  },
  {
    ...draft,
    "id": "DF036",
    "groupId": "delivery-care",
    "question": "Are returns and damage policies available?",
    "answer": "Only the owner-approved policies should be published as business terms. Contact the studio for the applicable current policy.",
    "previewNote": "Approved returns and damage terms have not been supplied. The contact page currently explains that live studio contact details are pending.",
    "references": [
      {
        "href": "/care",
        "label": "Care guidance"
      },
      {
        "href": "/commission",
        "label": "Explore a sample commission"
      }
    ]
  },
  {
    ...draft,
    "id": "DF037",
    "groupId": "privacy-demo",
    "question": "Why is this item marked Demo?",
    "answer": "It is sample content used to demonstrate the website. It is not proof of current stock, an actual commission or a real offer.",
    "references": [
      {
        "href": "/contact",
        "label": "Contact information"
      },
      {
        "href": "/about",
        "label": "About this atelier preview"
      }
    ]
  },
  {
    ...draft,
    "id": "DF038",
    "groupId": "privacy-demo",
    "question": "Are demo testimonials real reviews?",
    "answer": "No. They are explicitly fictional layout examples and must not be used as customer endorsements.",
    "references": [
      {
        "href": "/contact",
        "label": "Contact information"
      },
      {
        "href": "/about",
        "label": "About this atelier preview"
      }
    ]
  },
  {
    ...draft,
    "id": "DF039",
    "groupId": "privacy-demo",
    "question": "Are all gallery images product photographs?",
    "answer": "Media can include labelled concept visualizations. Check the image context and ask for real product evidence where needed.",
    "references": [
      {
        "href": "/contact",
        "label": "Contact information"
      },
      {
        "href": "/about",
        "label": "About this atelier preview"
      }
    ]
  },
  {
    ...draft,
    "id": "DF040",
    "groupId": "privacy-demo",
    "question": "Who can access my uploaded reference?",
    "answer": "Private enquiry files are intended for authorized staff under the applicable consent and access rules, not the public media gallery.",
    "previewNote": "No private-reference upload, storage or staff-access service is connected. A safe sample selected in the form is previewed locally and is never put in a public gallery or sent to staff.",
    "references": [
      {
        "href": "/contact",
        "label": "Contact information"
      },
      {
        "href": "/about",
        "label": "About this atelier preview"
      }
    ]
  },
  {
    ...draft,
    "id": "DF041",
    "groupId": "privacy-demo",
    "question": "Does this site require a Google login?",
    "answer": "The public website does not require a Google login. Drive is used as a build-time asset source, not the visitor image host.",
    "previewNote": "The protected development preview may require a separate deployment-provider sign-in. That protection is not a customer account or a Google login feature of this website.",
    "references": [
      {
        "href": "/contact",
        "label": "Contact information"
      },
      {
        "href": "/about",
        "label": "About this atelier preview"
      }
    ]
  },
  {
    ...draft,
    "id": "DF042",
    "groupId": "privacy-demo",
    "question": "How do I ask about privacy or my enquiry?",
    "answer": "Use the supplied studio contact details and your request reference. The owner must approve the final privacy and retention wording.",
    "previewNote": "Live studio contact details, saved enquiry references and approved privacy/retention terms are not yet configured. Do not enter personal enquiry details into this demo.",
    "references": [
      {
        "href": "/contact",
        "label": "Contact information"
      },
      {
        "href": "/about",
        "label": "About this atelier preview"
      }
    ]
  },
];

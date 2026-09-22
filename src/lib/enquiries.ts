export const enquiryStates = ["NEW", "CONTACTED", "QUALIFIED", "QUOTED", "CONFIRMED", "IN_PRODUCTION", "COMPLETED", "CLOSED"] as const;
export type EnquiryStatus = typeof enquiryStates[number];
export type DemoEnquiry = {id:string;status:EnquiryStatus;productId:string;client:string;email:string;scenario:string;note:string;assignee:string;createdAt:string;updatedAt:string;schemaVersion:number;optionsSnapshot:{productId:string;finish:string;quantity:number;price:string;revision:string};activities:{at:string;label:string;note:string}[];originKind:"DEMO_FIXTURE";batchId:string};
export const enquiryScenarios: DemoEnquiry[] = [
  {
    "id": "DO001",
    "status": "NEW",
    "productId": "DP001",
    "client": "Demo Client 01",
    "email": "demo01@customer.invalid",
    "scenario": "Large dining enquiry missing delivery-access measurements",
    "note": "Request clarification; no message sent.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-08-02T10:00:00Z",
    "updatedAt": "2026-08-02T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP001",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-02T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Request clarification; no message sent."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO002",
    "status": "NEW",
    "productId": "DP015",
    "client": "Demo Client 02",
    "email": "demo02@customer.invalid",
    "scenario": "Coffee-table enquiry with two design references",
    "note": "References are demo-owned/private; awaiting first response.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-08-03T10:00:00Z",
    "updatedAt": "2026-08-03T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP015",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-03T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "References are demo-owned/private; awaiting first response."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO003",
    "status": "NEW",
    "productId": "DP085",
    "client": "Demo Client 03",
    "email": "demo03@customer.invalid",
    "scenario": "Preservation request with an event-date preference",
    "note": "No physical items received; do not imply acceptance.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-08-04T10:00:00Z",
    "updatedAt": "2026-08-04T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP085",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-04T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "No physical items received; do not imply acceptance."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO004",
    "status": "NEW",
    "productId": "DP096",
    "client": "Demo Client 04",
    "email": "demo04@customer.invalid",
    "scenario": "Ceremony tray request with sample initials",
    "note": "Personalization not yet reviewed.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-08-05T10:00:00Z",
    "updatedAt": "2026-08-05T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP096",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-05T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Personalization not yet reviewed."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO005",
    "status": "NEW",
    "productId": "DP111",
    "client": "Demo Client 05",
    "email": "demo05@customer.invalid",
    "scenario": "Seasonal gift enquiry for a sample quantity",
    "note": "Quantity is simulated; no stock reserved.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-08-06T10:00:00Z",
    "updatedAt": "2026-08-06T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP111",
      "finish": "Satin \u2014 sample preference",
      "quantity": 4,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-06T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Quantity is simulated; no stock reserved."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO006",
    "status": "CONTACTED",
    "productId": "DP035",
    "client": "Demo Client 06",
    "email": "demo06@customer.invalid",
    "scenario": "Console enquiry with initial questions recorded",
    "note": "A simulated activity note exists; external transport blocked.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-08-07T10:00:00Z",
    "updatedAt": "2026-08-08T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP035",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-07T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-08T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "A simulated activity note exists; external transport blocked."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO007",
    "status": "CONTACTED",
    "productId": "DP045",
    "client": "Demo Client 07",
    "email": "demo07@customer.invalid",
    "scenario": "Seating enquiry awaiting intended-use clarification",
    "note": "Comfort/structural questions unresolved.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-08-08T10:00:00Z",
    "updatedAt": "2026-08-09T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP045",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-08T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-09T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Comfort/structural questions unresolved."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO008",
    "status": "CONTACTED",
    "productId": "DP108",
    "client": "Demo Client 08",
    "email": "demo08@customer.invalid",
    "scenario": "Baby keepsake enquiry awaiting format choice",
    "note": "Sensitive uploads replaced by fictional fixture graphics.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-08-09T10:00:00Z",
    "updatedAt": "2026-08-10T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP108",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-09T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-10T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sensitive uploads replaced by fictional fixture graphics."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO009",
    "status": "CONTACTED",
    "productId": "DP112",
    "client": "Demo Client 09",
    "email": "demo09@customer.invalid",
    "scenario": "Initial keychain enquiry awaiting spelling confirmation",
    "note": "No real phone/email used.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-08-10T10:00:00Z",
    "updatedAt": "2026-08-11T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP112",
      "finish": "Satin \u2014 sample preference",
      "quantity": 4,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-10T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-11T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "No real phone/email used."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO010",
    "status": "CONTACTED",
    "productId": "DP025",
    "client": "Demo Client 10",
    "email": "demo10@customer.invalid",
    "scenario": "Side-table pair enquiry awaiting placement details",
    "note": "Two candidate sizes saved as demo options.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-08-11T10:00:00Z",
    "updatedAt": "2026-08-12T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP025",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-11T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-12T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Two candidate sizes saved as demo options."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO011",
    "status": "QUALIFIED",
    "productId": "DP004",
    "client": "Demo Client 11",
    "email": "demo11@customer.invalid",
    "scenario": "Long-table brief with proposed dimensions and access notes",
    "note": "Scope ready for sample quotation preparation.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-08-12T10:00:00Z",
    "updatedAt": "2026-08-14T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP004",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-12T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-13T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-14T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Scope ready for sample quotation preparation."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO012",
    "status": "QUALIFIED",
    "productId": "DP051",
    "client": "Demo Client 12",
    "email": "demo12@customer.invalid",
    "scenario": "Atelier desk brief with a material preference",
    "note": "Proposed finish; actual availability unverified.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-08-13T10:00:00Z",
    "updatedAt": "2026-08-15T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP051",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-13T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-14T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-15T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Proposed finish; actual availability unverified."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO013",
    "status": "QUALIFIED",
    "productId": "DP057",
    "client": "Demo Client 13",
    "email": "demo13@customer.invalid",
    "scenario": "Large wall-panel project with a room sketch",
    "note": "Sketch is synthetic; installation assessment pending.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-08-14T10:00:00Z",
    "updatedAt": "2026-08-16T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP057",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-14T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-15T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-16T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sketch is synthetic; installation assessment pending."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO014",
    "status": "QUALIFIED",
    "productId": "DP086",
    "client": "Demo Client 14",
    "email": "demo14@customer.invalid",
    "scenario": "Varmala block request with agreed sample format",
    "note": "No guarantee of preservation suitability.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-08-15T10:00:00Z",
    "updatedAt": "2026-08-17T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP086",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-15T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-16T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-17T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "No guarantee of preservation suitability."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO015",
    "status": "QUALIFIED",
    "productId": "DP120",
    "client": "Demo Client 15",
    "email": "demo15@customer.invalid",
    "scenario": "Gift-box request with quantity and mock packaging choice",
    "note": "Mock brief complete, not a purchase commitment.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-08-16T10:00:00Z",
    "updatedAt": "2026-08-18T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP120",
      "finish": "Satin \u2014 sample preference",
      "quantity": 4,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-16T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-17T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-18T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Mock brief complete, not a purchase commitment."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO016",
    "status": "QUOTED",
    "productId": "DP007",
    "client": "Demo Client 16",
    "email": "demo16@customer.invalid",
    "scenario": "Dining table with a sample quotation version",
    "note": "Quote Q-DEMO-001; awaiting simulated response.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-08-17T10:00:00Z",
    "updatedAt": "2026-08-20T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP007",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-17T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-18T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-19T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-20T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Quote Q-DEMO-001; awaiting simulated response."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO017",
    "status": "QUOTED",
    "productId": "DP017",
    "client": "Demo Client 17",
    "email": "demo17@customer.invalid",
    "scenario": "Coffee-table project with two sample finish options",
    "note": "Quotation snapshot differs from later catalogue edits.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-08-18T10:00:00Z",
    "updatedAt": "2026-08-21T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP017",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-18T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-19T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-20T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-21T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Quotation snapshot differs from later catalogue edits."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO018",
    "status": "QUOTED",
    "productId": "DP040",
    "client": "Demo Client 18",
    "email": "demo18@customer.invalid",
    "scenario": "Console project with a revised sample scope",
    "note": "Retain quote version history and follow-up note.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-08-19T10:00:00Z",
    "updatedAt": "2026-08-22T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP040",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-19T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-20T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-21T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-22T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Retain quote version history and follow-up note."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO019",
    "status": "QUOTED",
    "productId": "DP092",
    "client": "Demo Client 19",
    "email": "demo19@customer.invalid",
    "scenario": "Clock request with sample personalization cost",
    "note": "No real monetary transaction or invoice.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-08-20T10:00:00Z",
    "updatedAt": "2026-08-23T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP092",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-20T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-21T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-22T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-23T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "No real monetary transaction or invoice."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO020",
    "status": "QUOTED",
    "productId": "DP114",
    "client": "Demo Client 20",
    "email": "demo20@customer.invalid",
    "scenario": "Coaster set with a sample quantity-based quote",
    "note": "No tax/discount policy implied by fixture amounts.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-08-21T10:00:00Z",
    "updatedAt": "2026-08-24T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP114",
      "finish": "Satin \u2014 sample preference",
      "quantity": 4,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-21T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-22T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-23T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-24T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "No tax/discount policy implied by fixture amounts."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO021",
    "status": "CONFIRMED",
    "productId": "DP002",
    "client": "Demo Client 21",
    "email": "demo21@customer.invalid",
    "scenario": "Full-pour table with a simulated accepted design brief",
    "note": "Confirmation is a manual demo event, never a WhatsApp click.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-08-22T10:00:00Z",
    "updatedAt": "2026-08-26T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP002",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-22T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-23T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-24T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-25T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-26T10:00:00Z",
        "label": "Synthetic confirmed milestone",
        "note": "Confirmation is a manual demo event, never a WhatsApp click."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO022",
    "status": "CONFIRMED",
    "productId": "DP046",
    "client": "Demo Client 22",
    "email": "demo22@customer.invalid",
    "scenario": "Counter stool design with a mock specification approval",
    "note": "No payment proof; hold production until relevant review.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-08-23T10:00:00Z",
    "updatedAt": "2026-08-27T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP046",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-23T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-24T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-25T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-26T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-27T10:00:00Z",
        "label": "Synthetic confirmed milestone",
        "note": "No payment proof; hold production until relevant review."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO023",
    "status": "CONFIRMED",
    "productId": "DP089",
    "client": "Demo Client 23",
    "email": "demo23@customer.invalid",
    "scenario": "Single-bloom keepsake with sample layout approval",
    "note": "Synthetic approval only; not a real customer consent.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-08-24T10:00:00Z",
    "updatedAt": "2026-08-28T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP089",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-24T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-25T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-26T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-27T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-28T10:00:00Z",
        "label": "Synthetic confirmed milestone",
        "note": "Synthetic approval only; not a real customer consent."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO024",
    "status": "CONFIRMED",
    "productId": "DP097",
    "client": "Demo Client 24",
    "email": "demo24@customer.invalid",
    "scenario": "Celebration tray with a frozen example text proof",
    "note": "Approved revision is recorded; later draft remains separate.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-08-25T10:00:00Z",
    "updatedAt": "2026-08-29T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP097",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-25T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-26T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-27T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-28T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-29T10:00:00Z",
        "label": "Synthetic confirmed milestone",
        "note": "Approved revision is recorded; later draft remains separate."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO025",
    "status": "CONFIRMED",
    "productId": "DP109",
    "client": "Demo Client 25",
    "email": "demo25@customer.invalid",
    "scenario": "Pendant set with a mock personalization approval",
    "note": "Fixture actions cannot send an actual customer message.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-08-26T10:00:00Z",
    "updatedAt": "2026-08-30T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP109",
      "finish": "Satin \u2014 sample preference",
      "quantity": 4,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-26T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-27T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-28T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-29T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-30T10:00:00Z",
        "label": "Synthetic confirmed milestone",
        "note": "Fixture actions cannot send an actual customer message."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO026",
    "status": "IN_PRODUCTION",
    "productId": "DP012",
    "client": "Demo Client 26",
    "email": "demo26@customer.invalid",
    "scenario": "Communal table sample at fabrication planning",
    "note": "Milestone PLANNING; no documentary workshop claim.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-08-27T10:00:00Z",
    "updatedAt": "2026-09-01T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP012",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-27T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-28T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-29T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-30T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-31T10:00:00Z",
        "label": "Synthetic confirmed milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-01T10:00:00Z",
        "label": "Synthetic in production milestone",
        "note": "Milestone PLANNING; no documentary workshop claim."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO027",
    "status": "IN_PRODUCTION",
    "productId": "DP049",
    "client": "Demo Client 27",
    "email": "demo27@customer.invalid",
    "scenario": "Long bench sample at a finishing milestone",
    "note": "Milestone is simulated operational data.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-08-28T10:00:00Z",
    "updatedAt": "2026-09-02T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP049",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-28T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-29T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-30T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-31T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-01T10:00:00Z",
        "label": "Synthetic confirmed milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-02T10:00:00Z",
        "label": "Synthetic in production milestone",
        "note": "Milestone is simulated operational data."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO028",
    "status": "IN_PRODUCTION",
    "productId": "DP065",
    "client": "Demo Client 28",
    "email": "demo28@customer.invalid",
    "scenario": "Wall relief sample awaiting quality review",
    "note": "Include an assigned staff task and mock due date.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-08-29T10:00:00Z",
    "updatedAt": "2026-09-03T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP065",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-29T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-30T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-31T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-01T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-02T10:00:00Z",
        "label": "Synthetic confirmed milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-03T10:00:00Z",
        "label": "Synthetic in production milestone",
        "note": "Include an assigned staff task and mock due date."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO029",
    "status": "IN_PRODUCTION",
    "productId": "DP087",
    "client": "Demo Client 29",
    "email": "demo29@customer.invalid",
    "scenario": "Bouquet frame sample at layout confirmation",
    "note": "No invented chemical recipe or preservation instruction.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-08-30T10:00:00Z",
    "updatedAt": "2026-09-04T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP087",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-30T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-08-31T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-01T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-02T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-03T10:00:00Z",
        "label": "Synthetic confirmed milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-04T10:00:00Z",
        "label": "Synthetic in production milestone",
        "note": "No invented chemical recipe or preservation instruction."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO030",
    "status": "IN_PRODUCTION",
    "productId": "DP115",
    "client": "Demo Client 30",
    "email": "demo30@customer.invalid",
    "scenario": "Mini tray sample at packaging review",
    "note": "Include a private sample attachment and next action.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-08-31T10:00:00Z",
    "updatedAt": "2026-09-05T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP115",
      "finish": "Satin \u2014 sample preference",
      "quantity": 4,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-08-31T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-01T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-02T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-03T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-04T10:00:00Z",
        "label": "Synthetic confirmed milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-05T10:00:00Z",
        "label": "Synthetic in production milestone",
        "note": "Include a private sample attachment and next action."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO031",
    "status": "COMPLETED",
    "productId": "DP006",
    "client": "Demo Client 31",
    "email": "demo31@customer.invalid",
    "scenario": "Round dining-table example with closed production tasks",
    "note": "Simulated completion date; exclude from real portfolio/revenue.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-09-01T10:00:00Z",
    "updatedAt": "2026-09-07T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP006",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-09-01T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-02T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-03T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-04T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-05T10:00:00Z",
        "label": "Synthetic confirmed milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-06T10:00:00Z",
        "label": "Synthetic in production milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-07T10:00:00Z",
        "label": "Synthetic completed milestone",
        "note": "Simulated completion date; exclude from real portfolio/revenue."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO032",
    "status": "COMPLETED",
    "productId": "DP031",
    "client": "Demo Client 32",
    "email": "demo32@customer.invalid",
    "scenario": "Side-table example with a complete activity timeline",
    "note": "No invented courier/tracking number.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-09-02T10:00:00Z",
    "updatedAt": "2026-09-08T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP031",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-09-02T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-03T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-04T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-05T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-06T10:00:00Z",
        "label": "Synthetic confirmed milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-07T10:00:00Z",
        "label": "Synthetic in production milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-08T10:00:00Z",
        "label": "Synthetic completed milestone",
        "note": "No invented courier/tracking number."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO033",
    "status": "COMPLETED",
    "productId": "DP053",
    "client": "Demo Client 33",
    "email": "demo33@customer.invalid",
    "scenario": "Study-desk example with archived quote snapshots",
    "note": "Finished fixture, not real inventory proof.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-09-03T10:00:00Z",
    "updatedAt": "2026-09-09T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP053",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-09-03T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-04T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-05T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-06T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-07T10:00:00Z",
        "label": "Synthetic confirmed milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-08T10:00:00Z",
        "label": "Synthetic in production milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-09T10:00:00Z",
        "label": "Synthetic completed milestone",
        "note": "Finished fixture, not real inventory proof."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO034",
    "status": "COMPLETED",
    "productId": "DP102",
    "client": "Demo Client 34",
    "email": "demo34@customer.invalid",
    "scenario": "Botanical nameplate example with final proof history",
    "note": "Do not expose fictional address details publicly.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-09-04T10:00:00Z",
    "updatedAt": "2026-09-10T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP102",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-09-04T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-05T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-06T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-07T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-08T10:00:00Z",
        "label": "Synthetic confirmed milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-09T10:00:00Z",
        "label": "Synthetic in production milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-10T10:00:00Z",
        "label": "Synthetic completed milestone",
        "note": "Do not expose fictional address details publicly."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO035",
    "status": "COMPLETED",
    "productId": "DP113",
    "client": "Demo Client 35",
    "email": "demo35@customer.invalid",
    "scenario": "Bookmark example with sample quantity completion",
    "note": "No automatic request for a real review.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-09-05T10:00:00Z",
    "updatedAt": "2026-09-11T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP113",
      "finish": "Satin \u2014 sample preference",
      "quantity": 4,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-09-05T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-06T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-07T10:00:00Z",
        "label": "Synthetic qualified milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-08T10:00:00Z",
        "label": "Synthetic quoted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-09T10:00:00Z",
        "label": "Synthetic confirmed milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-10T10:00:00Z",
        "label": "Synthetic in production milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-11T10:00:00Z",
        "label": "Synthetic completed milestone",
        "note": "No automatic request for a real review."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO036",
    "status": "CLOSED",
    "productId": "DP003",
    "client": "Demo Client 36",
    "email": "demo36@customer.invalid",
    "scenario": "Dining-table enquiry closed after a scope change",
    "note": "Reason CHANGED_REQUIREMENTS; preserve notes.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-09-06T10:00:00Z",
    "updatedAt": "2026-09-08T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP003",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-09-06T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-07T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-08T10:00:00Z",
        "label": "Synthetic closed milestone",
        "note": "Sample internal record only; no external action."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO037",
    "status": "CLOSED",
    "productId": "DP077",
    "client": "Demo Client 37",
    "email": "demo37@customer.invalid",
    "scenario": "Reception-counter concept closed as outside current scope",
    "note": "Reason NOT_PROCEEDING; not a business capability statement.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-09-07T10:00:00Z",
    "updatedAt": "2026-09-09T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP077",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-09-07T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-08T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-09T10:00:00Z",
        "label": "Synthetic closed milestone",
        "note": "Sample internal record only; no external action."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO038",
    "status": "CLOSED",
    "productId": "DP088",
    "client": "Demo Client 38",
    "email": "demo38@customer.invalid",
    "scenario": "Flower-disc enquiry closed without approval",
    "note": "Reason NO_APPROVAL; no sentimental items assumed received.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-09-08T10:00:00Z",
    "updatedAt": "2026-09-10T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP088",
      "finish": "Satin \u2014 sample preference",
      "quantity": 1,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-09-08T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-09T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-10T10:00:00Z",
        "label": "Synthetic closed milestone",
        "note": "Sample internal record only; no external action."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO039",
    "status": "CLOSED",
    "productId": "DP110",
    "client": "Demo Client 39",
    "email": "demo39@customer.invalid",
    "scenario": "Earring enquiry closed as a duplicate sample",
    "note": "Reason DUPLICATE; link only to another demo record.",
    "assignee": "Demo Editor A",
    "createdAt": "2026-09-09T10:00:00Z",
    "updatedAt": "2026-09-11T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP110",
      "finish": "Satin \u2014 sample preference",
      "quantity": 4,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-09-09T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-10T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-11T10:00:00Z",
        "label": "Synthetic closed milestone",
        "note": "Sample internal record only; no external action."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  },
  {
    "id": "DO040",
    "status": "CLOSED",
    "productId": "DP118",
    "client": "Demo Client 40",
    "email": "demo40@customer.invalid",
    "scenario": "Paperweight enquiry closed after no further response",
    "note": "Reason NO_RESPONSE; no automated recontact.",
    "assignee": "Demo Admin B",
    "createdAt": "2026-09-10T10:00:00Z",
    "updatedAt": "2026-09-12T10:00:00Z",
    "schemaVersion": 1,
    "optionsSnapshot": {
      "productId": "DP118",
      "finish": "Satin \u2014 sample preference",
      "quantity": 4,
      "price": "On request; no commercial offer",
      "revision": "source-1"
    },
    "activities": [
      {
        "at": "2026-09-10T10:00:00Z",
        "label": "Synthetic new milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-11T10:00:00Z",
        "label": "Synthetic contacted milestone",
        "note": "Sample internal record only; no external action."
      },
      {
        "at": "2026-09-12T10:00:00Z",
        "label": "Synthetic closed milestone",
        "note": "Sample internal record only; no external action."
      }
    ],
    "originKind": "DEMO_FIXTURE",
    "batchId": "rivya-r8-visual-2026-09"
  }
];

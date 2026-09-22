export const operationalSamples = {
  "jobs": [
    {
      "id": "JOB001",
      "title": "ready import example",
      "status": "ready",
      "format": "CSV",
      "sourceRows": 3,
      "writtenRows": 0,
      "note": "Mapping is saved; no parser has run.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "JOB002",
      "title": "validating import example",
      "status": "validating",
      "format": "XLSX",
      "sourceRows": 3,
      "writtenRows": 0,
      "note": "Simulated validation with duplicate and missing-title examples.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "JOB003",
      "title": "running import example",
      "status": "running",
      "format": "CSV",
      "sourceRows": 3,
      "writtenRows": 0,
      "note": "Static progress example; no background task runs.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "JOB004",
      "title": "completed import example",
      "status": "completed",
      "format": "XLSX",
      "sourceRows": 3,
      "writtenRows": 0,
      "note": "Illustrative completion with zero database writes.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "JOB005",
      "title": "failed import example",
      "status": "failed",
      "format": "CSV",
      "sourceRows": 3,
      "writtenRows": 0,
      "note": "Simulated invalid-tier failure; source remains unchanged.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "JOB006",
      "title": "cancelled import example",
      "status": "cancelled",
      "format": "XLSX",
      "sourceRows": 3,
      "writtenRows": 0,
      "note": "Illustrative cancellation; mapping may be resumed manually.",
      "originKind": "DEMO_FIXTURE"
    }
  ],
  "subscribers": [
    {
      "id": "SUB001",
      "email": "demo-reader-01@newsletter.invalid",
      "status": "PENDING",
      "consent": "Fictional state only — no real consent or subscription exists.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "SUB002",
      "email": "demo-reader-02@newsletter.invalid",
      "status": "SUBSCRIBED",
      "consent": "Fictional state only — no real consent or subscription exists.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "SUB003",
      "email": "demo-reader-03@newsletter.invalid",
      "status": "UNSUBSCRIBED",
      "consent": "Fictional state only — no real consent or subscription exists.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "SUB004",
      "email": "demo-reader-04@newsletter.invalid",
      "status": "SUPPRESSED",
      "consent": "Fictional state only — no real consent or subscription exists.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "SUB005",
      "email": "demo-reader-05@newsletter.invalid",
      "status": "PENDING",
      "consent": "Fictional state only — no real consent or subscription exists.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "SUB006",
      "email": "demo-reader-06@newsletter.invalid",
      "status": "SUBSCRIBED",
      "consent": "Fictional state only — no real consent or subscription exists.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "SUB007",
      "email": "demo-reader-07@newsletter.invalid",
      "status": "UNSUBSCRIBED",
      "consent": "Fictional state only — no real consent or subscription exists.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "SUB008",
      "email": "demo-reader-08@newsletter.invalid",
      "status": "SUPPRESSED",
      "consent": "Fictional state only — no real consent or subscription exists.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "SUB009",
      "email": "demo-reader-09@newsletter.invalid",
      "status": "PENDING",
      "consent": "Fictional state only — no real consent or subscription exists.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "SUB010",
      "email": "demo-reader-10@newsletter.invalid",
      "status": "SUBSCRIBED",
      "consent": "Fictional state only — no real consent or subscription exists.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "SUB011",
      "email": "demo-reader-11@newsletter.invalid",
      "status": "UNSUBSCRIBED",
      "consent": "Fictional state only — no real consent or subscription exists.",
      "originKind": "DEMO_FIXTURE"
    },
    {
      "id": "SUB012",
      "email": "demo-reader-12@newsletter.invalid",
      "status": "SUPPRESSED",
      "consent": "Fictional state only — no real consent or subscription exists.",
      "originKind": "DEMO_FIXTURE"
    }
  ]
} as const;

# Homepage hero and navigation release

Owner explicitly authorized push into main on 15 October 2026. Prepared implementation: 649ba79. Remote main freshly verified at bf6370832bab8b01b8b3e1549a0b497b287deb35, with no drift. REVIEW.md records local verification and the historical preview hold, superseded by this authorization.

Release method: detailed pull request into main, hosting checks, normal merge without bypassing protection, then verification of the exact production SHA and public homepage. Production domain: www.rivyalivingart.com. Vercel project: prj_J90SIW3OHaXYsmhan527F4n8PYUc; team: team_mnsVrzWm8seMFfIZE9Oxu691.

The release changes presentation only. Preserve production hero/media selection, original logo, copy, links and records. The local screenshot uses the QA River Channel selection; production retains its existing resin media. No database migration, Studio publication or account operation is included. The separate Studio access-table activation is not completed by this release.

The merged PR and deployment status provide the release receipt. Do not claim production completion until the hosting SHA and live page are verified.

## Production verification follow-up

PR #60 merged as da8273a1f73f627c6620c23d9ebef60703516722, deployed READY as dpl_4PMK6XjxcbYL1enX6oZLyUDCurLL. Live production retains the original resin image. Verification found its caption inside the moving media frame could be clipped and darkened by the overlay. A scoped follow-up moves only the rendered hero caption outside the animated image frame, above the overlay; stored text/media/crops and existing image animation remain unchanged.

# Owner-authorized main integration

On 21 September 2026 the owner instructed: “Merge all things to main branch and
go to next task”. This explicitly authorizes integrating the accumulated reviewed
development work into main despite the earlier default no-merge instruction.

PR [#4](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/4) merged head
`274fc26d4a5132ed9c1a23e9b603d15be7dc03a1` into main with merge commit
`f4d79f125622a547488e081fb38e062089c636e6`. The actual remote main ref was read back.
Both older development branches are ancestors of the merged head; their work is
included. No existing branch or commit history was deleted or force-pushed.

The connected Vercel team returned zero projects again, and the repository has no
deployment workflow/configuration. No deployment, production promotion, project
creation, domain change or backend integration was performed.

The next task remains actual frontend/browser verification. Continue it on
`codex/r8-first-frontend`, fast-forwarded to the main merge commit. Later slice
publishing continues to the development branch under the existing workflow.
This merge does not establish UI_READY or satisfy the R8-5 visual-review gate.

## Subsequent owner instruction before R8-2

The owner next requested: “Merge all things to main branch and go to next task R8-2”.
PR [#5](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/5) merged the completed
browser slice `8e8e14b287ebdcc28ed1bd511cb7cbbab914d62b` into main at
`7d9edc1315c39b22335f9f69599b7c8c89b9a63f`, verified from the remote ref. The old
stacked draft PR #3 was closed as superseded after its work was included in main.
R8-2 then continued on the development branch. This instruction did not authorize
a deployment, live-domain change or backend integration before owner visual review.

## State observed when R8-3A began

GitHub reported PR #6 already merged at
`b1f0e095721d5b56a502598fe1478893ebf4e356`, and the existing Vercel project reported
a READY production deployment from that SHA. Its tree exactly matched the preceding
R8-2 development head `528d6b172cd04d98a10541c200be048c7163ab8d`. The local work
branch was fast-forwarded to the merge without replacing any source or edits.

The current owner request is to diagnose the Vercel warning and implement R8-3A.
It does not ask for another main merge. R8-3A is published separately for review.
The newly observed Git integration means main pushes can now deploy production;
later tasks must inspect deployment triggers instead of relying on earlier
zero-project observations. See `docs/VERCEL_RUNTIME_ALIGNMENT.md`.

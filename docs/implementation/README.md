# Shared implementation guides

These guides implement the latest owner brief without changing its scope. They
work as ordinary repository Markdown for Codex, Google Antigravity/Gemini and
other coding assistants. Do not share private credentials between AI tools.

If an AI tool does not automatically read AGENTS.md or GEMINI.md, give it the
continuation prompt and explicitly ask it to read START-HERE.md and these guides
from the local checkout. The shared instructions do not depend on tool-specific
slash commands, agent memory or an installation in this chat.

| File | Purpose |
|---|---|
| [AI-WORKING-GUIDE.md](AI-WORKING-GUIDE.md) | Checkout, decisions, evidence and working loop |
| [PHASE-BY-PHASE.md](PHASE-BY-PHASE.md) | Phase 0–11 steps, source locations and acceptance |
| [NEXT-WORK.md](NEXT-WORK.md) | Immediate implementation slice and dependency order |
| [VERIFICATION-AND-RELEASE.md](VERIFICATION-AND-RELEASE.md) | Tests, privacy, provider gates and release separation |
| [ANTIGRAVITY-START-PROMPT.md](ANTIGRAVITY-START-PROMPT.md) | Copyable prompt to obtain latest main and continue |
| [PUBLICATION-CHECKPOINT-2026-10-29.md](PUBLICATION-CHECKPOINT-2026-10-29.md) | Publication scope, verification and production boundary |

Detailed source checkpoints remain under [netlify-free-first-2026-10-28](../netlify-free-first-2026-10-28/CURRENT-STATE.md).
Update these shared guides as evidence changes. Do not introduce another competing
master prompt. Preserve exact dated receipts.

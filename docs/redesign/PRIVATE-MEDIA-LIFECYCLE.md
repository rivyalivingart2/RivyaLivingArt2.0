# Private reference lifecycle

Source implementation checkpoint, 23 September 2026. Final runtime/privacy proof remains Phase 9.

Each anonymous form uses a server-issued, signed cookie and stable request UUID. Each file gets its own upload UUID. The server bounds the body to 3 MB, decodes actual JPEG/PNG/WebP content with a 20-megapixel limit, rejects animated/mismatched files, strips metadata and emits a bounded JPEG. A transaction reserves one of three slots and bytes within the 500 MB application budget before writing a private object. Paths contain random IDs rather than customer filenames.

The database records pending, ready or deleting state and the storage provider. A retry first recovers an object that reached the provider even if the original response timed out. Retries reuse the same reservation/path. The client cannot proceed with an unresolved reference unless it retries or removes that selection. Pending reservations left after an uncertain write are retained until cleanup; they are never silently counted as successful attachments.

Final inquiry submission locks eligible ready references owned by the same guest/request and atomically saves the inquiry, exactly one Studio order, reference links and initial history. Only then does the saved receipt prepare WhatsApp. No reference URLs enter that message.

Unsubmitted references become eligible for administrator cleanup after 24 hours. Studio Settings shows their count and bytes and requires an explicit permanent-removal confirmation. Each batch removes up to 25 objects. Failed object removal retains its database reservation for retry. Records attached to a saved inquiry are excluded. Submitted references have no invented automatic retention/deletion deadline; the owner handles access/correction/deletion requests according to the published policy and applicable obligations.

Private retrieval requires a current server session and an admin role or the inquiry's assigned editor. Both the image endpoint and its contextual viewer enforce scope. The endpoint bypasses public image optimization and returns private/no-store headers. Public media authoring never lists customer references.

Only Vercel private Blob is selected after the owner's Vercel-only instruction. Unsupported providers are rejected. Private-store behavior, failure recovery, cross-user denial and byte accounting remain final integrated verification requirements. Hosted business activation is on hold pending commercial eligibility; preserved migration history does not authorize another provider.

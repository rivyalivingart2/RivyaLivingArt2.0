-- Deliberate operator-only grant repair, after the existing erasure-engine schema.
-- Never execute from a build. First verify the target identity, intended runtime role and exact authorized privileges.
BEGIN;
SET LOCAL lock_timeout='5s';
GRANT SELECT,INSERT,UPDATE ON rivya_erasure_ledger TO :"runtime_role";
GRANT SELECT,INSERT,UPDATE,DELETE ON rivya_managed_exports TO :"runtime_role";
GRANT DELETE ON rivya_inquiry_notes TO :"runtime_role";
GRANT UPDATE(reason) ON rivya_studio_order_events TO :"runtime_role";
-- Preserve audit identity/action/time; redact only customer-bearing recovery explanations.
GRANT UPDATE(entity) ON rivya_audit TO :"runtime_role";
COMMIT;

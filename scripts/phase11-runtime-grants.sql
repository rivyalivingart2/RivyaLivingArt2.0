-- Run deliberately with psql -v runtime_role=<verified restricted login>.
-- This only changes that login's direct public-schema table/sequence privileges.
-- The runtime login must not own tables or inherit a more privileged role.
BEGIN;
SET LOCAL lock_timeout='5s';
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM :"runtime_role";
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM :"runtime_role";
GRANT USAGE ON SCHEMA public TO :"runtime_role";
GRANT SELECT,INSERT ON rivya_audit,rivya_revisions,rivya_studio_order_events,rivya_inquiry_notes TO :"runtime_role";
GRANT SELECT,INSERT,UPDATE ON rivya_business_settings,rivya_catalogue,rivya_content,rivya_public_media,rivya_staff,rivya_studio_orders,rivya_inquiries,rivya_privacy_controls TO :"runtime_role";
GRANT SELECT,INSERT,UPDATE,DELETE ON rivya_studio_sessions,rivya_studio_login_limits,rivya_inquiry_upload_sessions,rivya_references TO :"runtime_role";
GRANT SELECT,UPDATE ON rivya_storage_budget TO :"runtime_role";
-- Identity sequence names are inspected before this migration; no blanket default grant.
GRANT USAGE ON rivya_audit_id_seq,rivya_studio_order_events_id_seq,rivya_inquiry_notes_id_seq TO :"runtime_role";
COMMIT;

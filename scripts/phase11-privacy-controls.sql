-- New additive migration. Apply once to disposable QA, then through the backed-up
-- shared release procedure. Never run from a build or application request.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='30s';
CREATE TABLE public.rivya_privacy_controls (
 order_id uuid PRIMARY KEY REFERENCES public.rivya_studio_orders(id),
 last_contact_at timestamptz NOT NULL,
 became_order boolean NOT NULL DEFAULT false,
 closed_at timestamptz,
 ongoing_follow_up boolean NOT NULL DEFAULT false,
 hold_reason text NOT NULL DEFAULT '' CHECK(length(hold_reason)<=400),
 hold_review_on date,
 deletion_requested_at timestamptz,
 identity_verified_at timestamptz,
 version integer NOT NULL DEFAULT 1 CHECK(version>0),
 updated_by text NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(identity_verified_at IS NULL OR deletion_requested_at IS NOT NULL),
 CHECK(hold_reason<>'' OR hold_review_on IS NULL)
);
INSERT INTO public.rivya_privacy_controls(order_id,last_contact_at,became_order,closed_at,updated_by)
 SELECT o.id,o.created_at,
  o.status IN('CONFIRMED','IN_PRODUCTION','COMPLETED') OR EXISTS(SELECT 1 FROM public.rivya_studio_order_events e WHERE e.order_id=o.id AND e.to_status IN('CONFIRMED','IN_PRODUCTION','COMPLETED')),
  CASE WHEN o.status IN('COMPLETED','CLOSED') THEN COALESCE((SELECT max(e.created_at) FROM public.rivya_studio_order_events e WHERE e.order_id=o.id AND e.to_status IN('COMPLETED','CLOSED')),o.updated_at) END,
  'Initial retention baseline: creation date; review any later customer contact'
 FROM public.rivya_studio_orders o;
CREATE FUNCTION public.rivya_track_order_retention() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='INSERT' THEN
  INSERT INTO public.rivya_privacy_controls(order_id,last_contact_at,became_order,closed_at,updated_by)
   VALUES(NEW.id,NEW.created_at,NEW.status IN('CONFIRMED','IN_PRODUCTION','COMPLETED'),CASE WHEN NEW.status IN('COMPLETED','CLOSED') THEN now() END,'Order created');
 ELSIF OLD.status IS DISTINCT FROM NEW.status THEN
  UPDATE public.rivya_privacy_controls SET
   became_order=became_order OR NEW.status IN('CONFIRMED','IN_PRODUCTION','COMPLETED'),
   closed_at=CASE WHEN NEW.status IN('COMPLETED','CLOSED') THEN COALESCE(closed_at,now()) ELSE NULL END,
   version=version+1,updated_at=now(),updated_by='Order stage changed'
   WHERE order_id=NEW.id;
 END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER rivya_order_retention AFTER INSERT OR UPDATE OF status ON public.rivya_studio_orders
 FOR EACH ROW EXECUTE FUNCTION public.rivya_track_order_retention();
COMMIT;

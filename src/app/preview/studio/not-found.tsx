import { SystemState } from "@/components/system-state";

export default function StudioPreviewNotFound() {
  return <SystemState kind="not-found" compact headingLevel={1} title="This Studio view isn’t here." description="The sample record or workspace address could not be found. Return to the demo catalogue or choose a workspace from the navigation." actionHref="/preview/studio/products" actionLabel="Back to the demo catalogue" />;
}

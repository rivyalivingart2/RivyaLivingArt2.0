import type { MetadataRoute } from "next";

// Indexing preference, not access control. Keep entire prelaunch app out of search.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}

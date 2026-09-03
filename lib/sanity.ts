import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// These come from environment variables set in Vercel (see SETUP-CMS.md).
// If they're absent, the site simply uses its built-in content (data/ files).
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const sanityEnabled = Boolean(projectId);

export const sanityClient = sanityEnabled
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: true, // fast, cached reads
    })
  : null;

const builder = sanityEnabled ? imageUrlBuilder({ projectId, dataset }) : null;

// Turn a Sanity image reference into a URL. Returns null if not available.
export function urlFor(source: any): string | null {
  if (!builder || !source) return null;
  try {
    return builder.image(source).width(1200).auto("format").url();
  } catch {
    return null;
  }
}

import CloneHubApp from "@/components/CloneHubApp";
import { loadSite, loadServices, loadClients, loadWork, loadCatalogue } from "@/lib/content";

// Pre-generate the known routes as static pages (so refresh / direct links work).
export function generateStaticParams() {
  return [
    { slug: [] },                 // /
    { slug: ["services"] },       // /services
    { slug: ["work"] },           // /work
    { slug: ["catalogue"] },      // /catalogue
    { slug: ["contact"] },        // /contact
  ];
}

export const dynamicParams = true;

// Re-fetch content from the CMS periodically (seconds). Content edits appear
// within this window without a redeploy.
export const revalidate = 60;

export default async function Page() {
  // Load content server-side (Sanity if configured, else built-in fallback).
  const [site, services, clients, work, catalogue] = await Promise.all([
    loadSite(), loadServices(), loadClients(), loadWork(), loadCatalogue(),
  ]);
  const content = { site, services, clients, work, catalogue };
  return <CloneHubApp content={content} />;
}

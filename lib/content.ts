import { sanityClient, sanityEnabled, urlFor } from "./sanity";
import { SITE as SITE_FALLBACK, BRAND } from "@/data/site";
import { SERVICES as SERVICES_FALLBACK, CATEGORIES } from "@/data/services";
import { CLIENTS as CLIENTS_FALLBACK, WORK as WORK_FALLBACK } from "@/data/showcase";
import { CATALOGUE as CATALOGUE_FALLBACK } from "@/data/catalogue";

/*
  Each loader tries Sanity first; if Sanity isn't configured, or returns
  nothing, or errors, it returns the built-in content from /data. This means
  the site always renders — the CMS only *overrides* the defaults when it has data.
*/

export async function loadSite() {
  if (!sanityEnabled || !sanityClient) return SITE_FALLBACK;
  try {
    const s = await sanityClient.fetch(`*[_type == "siteSettings"][0]`);
    if (!s) return SITE_FALLBACK;
    return {
      ...SITE_FALLBACK,
      name: s.businessName || SITE_FALLBACK.name,
      tagline: s.tagline || SITE_FALLBACK.tagline,
      contactPerson: s.contactPerson || SITE_FALLBACK.contactPerson,
      address: s.address || SITE_FALLBACK.address,
      phone: s.phone || SITE_FALLBACK.phone,
      phone2: s.phone2 || SITE_FALLBACK.phone2,
      whatsapp: s.whatsapp || SITE_FALLBACK.whatsapp,
      email: s.email || SITE_FALLBACK.email,
      heroHeadline: s.heroHeadline || null,
      heroHeadlineAccent: s.heroHeadlineAccent || null,
      heroSubtext: s.heroSubtext || null,
      heroImageUrl: urlFor(s.heroImage),
      ogImageUrl: urlFor(s.ogImage),
    };
  } catch {
    return SITE_FALLBACK;
  }
}

export async function loadServices() {
  if (!sanityEnabled || !sanityClient) return SERVICES_FALLBACK;
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "service"] | order(category asc, order asc){ name, category, blurb }`
    );
    if (!rows || rows.length === 0) return SERVICES_FALLBACK;
    return rows;
  } catch {
    return SERVICES_FALLBACK;
  }
}

export async function loadClients() {
  if (!sanityEnabled || !sanityClient) return CLIENTS_FALLBACK;
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "client"] | order(order asc){ name, "logo": logo.asset->url }`
    );
    if (!rows || rows.length === 0) return CLIENTS_FALLBACK;
    return rows.map((r: any) => ({ name: r.name, logo: r.logo || undefined }));
  } catch {
    return CLIENTS_FALLBACK;
  }
}

export async function loadWork() {
  if (!sanityEnabled || !sanityClient) return WORK_FALLBACK;
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "workProject"] | order(order asc){ title, "cat": category, "image": image.asset->url, featured }`
    );
    if (!rows || rows.length === 0) return WORK_FALLBACK;
    return rows.map((r: any) => ({
      title: r.title,
      cat: r.cat || "",
      image: r.image || undefined,
      featured: !!r.featured,
      tone: [BRAND.navy, BRAND.blue] as [string, string],
    }));
  } catch {
    return WORK_FALLBACK;
  }
}

export async function loadCatalogue() {
  if (!sanityEnabled || !sanityClient) return CATALOGUE_FALLBACK;
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "catalogueSection"] | order(order asc){ title, intro, items, "image": image.asset->url }`
    );
    if (!rows || rows.length === 0) return CATALOGUE_FALLBACK;
    return rows.map((r: any, i: number) => ({
      id: (r.title || `section-${i}`).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: r.title,
      intro: r.intro || "",
      items: r.items || [],
      image: r.image || "/hero.jpg",
      imageAlt: r.title || "",
    }));
  } catch {
    return CATALOGUE_FALLBACK;
  }
}

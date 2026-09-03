import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/services", "/work", "/catalogue", "/contact"];
  return paths.map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
}

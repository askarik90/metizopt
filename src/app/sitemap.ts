import { MetadataRoute } from "next";
import { COMPANY } from "@/config/company";
import { getCategories, getGroups } from "@/lib/db";
import catalogTreeJson from "@/data/catalog-tree.json";

const catalogTree = catalogTreeJson as Record<string, { types?: { slug: string }[] }>;

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = `https://${COMPANY.domain}`;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, priority: 1.0, changeFrequency: "weekly", lastModified: now },
    { url: `${base}/catalog`, priority: 0.9, changeFrequency: "weekly", lastModified: now },
    { url: `${base}/quote`, priority: 0.9, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/contacts`, priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/about`, priority: 0.6, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/delivery`, priority: 0.6, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/bolty-optom`, priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/gayki-optom`, priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/ankera-optom`, priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/shayby-optom`, priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/krepezh-optom`, priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/krepezh-dlya-stroitelstva`, priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/krepezh-dlya-proizvodstva`, priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/krepezh-po-gost`, priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/krepezh-din-iso`, priority: 0.7, changeFrequency: "monthly", lastModified: now },
  ];

  const groups = await getGroups();
  const groupPages: MetadataRoute.Sitemap = groups.map((group) => ({
    url: `${base}/catalog/${group.slug}`,
    priority: 0.85,
    changeFrequency: "monthly" as const,
    lastModified: now,
  }));

  const categories = await getCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${base}/catalog/${category.slug}`,
    priority: 0.75,
    changeFrequency: "monthly" as const,
    lastModified: now,
  }));

  const typePages: MetadataRoute.Sitemap = Object.entries(catalogTree).flatMap(
    ([slug, node]) =>
      (node.types ?? []).map((t) => ({
        url: `${base}/catalog/${slug}/${t.slug}`,
        priority: 0.7,
        changeFrequency: "monthly" as const,
        lastModified: now,
      })),
  );

  return [...staticPages, ...groupPages, ...categoryPages, ...typePages];
}

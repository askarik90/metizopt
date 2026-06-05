import { MetadataRoute } from "next";
import { COMPANY } from "@/config/company";
import fs from "fs";
import path from "path";

function getCategories() {
  try {
    const file = path.join(process.cwd(), "data", "categories.json");
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {}
  return COMPANY.categories;
}

function getGroups() {
  try {
    const file = path.join(process.cwd(), "data", "groups.json");
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {}
  return COMPANY.groups;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${COMPANY.domain}`;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                                    priority: 1.0, changeFrequency: "weekly",  lastModified: now },
    { url: `${base}/catalog`,                       priority: 0.9, changeFrequency: "weekly",  lastModified: now },
    { url: `${base}/quote`,                         priority: 0.9, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/contacts`,                      priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/about`,                         priority: 0.6, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/delivery`,                      priority: 0.6, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/bolty-optom`,                   priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/gayki-optom`,                   priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/ankera-optom`,                  priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/shayby-optom`,                  priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/krepezh-optom`,                 priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/krepezh-dlya-stroitelstva`,     priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/krepezh-dlya-proizvodstva`,     priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/krepezh-po-gost`,               priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${base}/krepezh-din-iso`,               priority: 0.7, changeFrequency: "monthly", lastModified: now },
  ];

  const groups = getGroups();
  const groupPages: MetadataRoute.Sitemap = groups.map((g: { slug: string }) => ({
    url: `${base}/catalog/${g.slug}`,
    priority: 0.85,
    changeFrequency: "monthly" as const,
    lastModified: now,
  }));

  const categories = getCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map((c: { slug: string }) => ({
    url: `${base}/catalog/${c.slug}`,
    priority: 0.75,
    changeFrequency: "monthly" as const,
    lastModified: now,
  }));

  return [...staticPages, ...groupPages, ...categoryPages];
}

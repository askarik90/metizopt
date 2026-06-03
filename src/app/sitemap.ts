import { MetadataRoute } from "next";
import { COMPANY } from "@/config/company";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${COMPANY.domain}`;

  const staticPages = [
    { url: base, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${base}/catalog`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${base}/quote`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${base}/about`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${base}/delivery`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${base}/contacts`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${base}/bolty-optom`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${base}/gayki-optom`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${base}/ankera-optom`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${base}/shayby-optom`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${base}/krepezh-optom`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${base}/krepezh-dlya-stroitelstva`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${base}/krepezh-dlya-proizvodstva`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${base}/krepezh-po-gost`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${base}/krepezh-din-iso`, priority: 0.8, changeFrequency: "monthly" as const },
  ];

  const categoryPages = COMPANY.categories.map((cat) => ({
    url: `${base}/catalog/${cat.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...categoryPages].map((page) => ({
    ...page,
    lastModified: new Date(),
  }));
}

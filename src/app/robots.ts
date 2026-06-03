import { MetadataRoute } from "next";
import { COMPANY } from "@/config/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/thanks"],
    },
    sitemap: `https://${COMPANY.domain}/sitemap.xml`,
  };
}

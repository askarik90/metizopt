import { MetadataRoute } from "next";
import { COMPANY } from "@/config/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /thanks НЕ блокируем в robots — иначе Google не увидит meta noindex на странице.
      // noindex задан в самой /thanks (см. src/app/thanks/page.tsx).
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `https://${COMPANY.domain}/sitemap.xml`,
  };
}

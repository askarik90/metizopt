import type { NextConfig } from "next";
import { LEGACY_CATEGORY_SLUGS } from "./src/lib/catalogHref";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sanitize-html", "nodemailer"],
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.krp.kz" }],
        destination: "https://krp.kz/:path*",
        permanent: true,
      },
      // Старые короткие адреса категорий крепежа (/catalog/bolty …) → настоящие (24.09.2026, были 404).
      ...Object.entries(LEGACY_CATEGORY_SLUGS).map(([from, to]) => ({
        source: `/catalog/${from}`,
        destination: `/catalog/${to}`,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

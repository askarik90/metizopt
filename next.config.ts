import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sanitize-html"],
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.krp.kz" }],
        destination: "https://krp.kz/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

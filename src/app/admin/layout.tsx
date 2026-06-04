import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KRP Admin",
  description: "Admin panel for KRP.kz",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

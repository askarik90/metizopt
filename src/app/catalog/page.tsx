import type { Metadata } from "next";
import CatalogClient from "./CatalogClient";

// Серверная обёртка: /catalog — client-компонент. Задаём self-canonical,
// иначе страница наследовала canonical главной и считалась её дублем.
export const metadata: Metadata = {
  alternates: { canonical: "https://krp.kz/catalog" },
  openGraph: { url: "https://krp.kz/catalog" },
};

export default function Page() {
  return <CatalogClient />;
}

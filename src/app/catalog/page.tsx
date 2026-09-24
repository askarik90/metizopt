import type { Metadata } from "next";
import CatalogClient from "./CatalogClient";

// Серверная обёртка: /catalog — client-компонент. Задаём self-canonical,
// иначе страница наследовала canonical главной и считалась её дублем.
// Свой title: раньше /catalog наследовал заголовок главной — две страницы с одним title (аудит 24.09.2026).
export const metadata: Metadata = {
  title: "Каталог крепежа и метизов — болты, гайки, такелаж",
  description:
    "Каталог KRP: крепёж, нержавеющий крепёж, такелаж, канаты, электроды, перфорированный крепёж и вентиляция. Оптом и в розницу со склада в Алматы, доставка по Казахстану.",
  alternates: { canonical: "https://krp.kz/catalog" },
  openGraph: { url: "https://krp.kz/catalog" },
};

export default function Page() {
  return <CatalogClient />;
}

import type { Metadata } from "next";
import HomeClient from "./HomeClient";

// Серверная обёртка: главная — client-компонент и не может экспортировать metadata.
// Здесь задаём self-canonical главной (раньше он приходил из рутового layout и «протекал»
// на все дочерние страницы, делая их дублями главной).
export const metadata: Metadata = {
  alternates: { canonical: "https://krp.kz" },
  openGraph: { url: "https://krp.kz" },
};

export default function Page() {
  return <HomeClient />;
}

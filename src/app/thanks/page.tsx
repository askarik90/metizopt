import type { Metadata } from "next";
import ThanksClient from "./ThanksClient";

// Страница благодарности не должна индексироваться. robots в robots.txt её больше НЕ
// блокирует (иначе Google не увидит этот noindex); в sitemap её нет.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ThanksClient />;
}

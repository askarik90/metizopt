import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandingCategoryPage from "@/components/LandingCategoryPage";

export const metadata: Metadata = {
  alternates: { canonical: "https://krp.kz/gayki-optom" },
  openGraph: { url: "https://krp.kz/gayki-optom" },
  title: "Гайки оптом в Алматы — DIN 934, самоконтрящиеся | KRP",
  description: "Гайки оптом со склада в Алматы. DIN 934, DIN 985, самоконтрящиеся, фланцевые. Пришлите список — подберём и рассчитаем КП.",
};

export default function GaykiOptomPage() {
  return (
    <>
      <Header />
      <LandingCategoryPage
        h1="Гайки оптом в Алматы"
        description="Гайки шестигранные, самоконтрящиеся, фланцевые оптом со склада в Алматы. DIN 934, DIN 985, ГОСТ 5915. Поставки для строительных и промышленных компаний РК."
        category="Гайки"
        whatsappText="Здравствуйте! Хочу запросить цену и наличие по категории: Гайки."
        usp={[
          "Широкий ассортимент на складе",
          "Самоконтрящиеся, фланцевые, высокопрочные",
          "DIN 934, DIN 985, ГОСТ 5915",
          "Оцинкованные и нержавеющие",
          "Документы для юрлиц",
          "КП за 30 минут",
        ]}
      />
      <Footer />
    </>
  );
}

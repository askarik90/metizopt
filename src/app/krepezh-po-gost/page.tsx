import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandingCategoryPage from "@/components/LandingCategoryPage";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: "https://krp.kz/krepezh-po-gost" },
  openGraph: { url: "https://krp.kz/krepezh-po-gost" },
  title: "Крепеж по ГОСТ оптом в Алматы | KRP",
  description: "Крепеж по стандартам ГОСТ оптом в Алматы. Болты, гайки, шайбы, шпильки ГОСТ. Подберём и рассчитаем КП.",
};

export default function KrepezhPoGostPage() {
  return (
    <>
      <Header />
      <LandingCategoryPage
        h1="Крепеж по ГОСТ оптом в Алматы"
        description="Весь ассортимент крепежа по российским и советским стандартам ГОСТ. Болты ГОСТ 7798, гайки ГОСТ 5915, шайбы ГОСТ 11371. Поставки для предприятий Казахстана."
        category="Крепеж ГОСТ"
        whatsappText="Здравствуйте! Хочу запросить крепеж по стандартам ГОСТ."
        usp={[
          "Болты ГОСТ 7798, ГОСТ 7805",
          "Гайки ГОСТ 5915, ГОСТ 5927",
          "Шайбы ГОСТ 11371, ГОСТ 6402",
          "Шпильки ГОСТ 22042, ГОСТ 22041",
          "Сертификаты соответствия ГОСТ",
          "Большой выбор на складе в Алматы",
        ]}
      />
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandingCategoryPage from "@/components/LandingCategoryPage";

export const metadata: Metadata = {
  alternates: { canonical: "https://krp.kz/krepezh-din-iso" },
  openGraph: { url: "https://krp.kz/krepezh-din-iso" },
  title: "Крепеж DIN ISO оптом в Алматы | KRP",
  description: "Крепеж по стандартам DIN и ISO оптом в Алматы. Подберём аналоги для импортного оборудования. Пришлите список — подготовим КП.",
};

export default function KrepezhDinIsoPage() {
  return (
    <>
      <Header />
      <LandingCategoryPage
        h1="Крепеж DIN / ISO оптом в Алматы"
        description="Европейский и международный крепеж по стандартам DIN и ISO оптом. Для импортного оборудования и техники. Подберём аналоги, поставим со склада в Алматы."
        category="Крепеж DIN/ISO"
        whatsappText="Здравствуйте! Хочу запросить крепеж по стандартам DIN/ISO."
        usp={[
          "Болты DIN 933, DIN 931, DIN 912",
          "Гайки DIN 934, DIN 985, DIN 6923",
          "Шайбы DIN 125, DIN 127, DIN 9021",
          "Подбор для импортного оборудования",
          "ISO 4014, ISO 4016, ISO 4032",
          "Аналоги без потери характеристик",
        ]}
      />
      <Footer />
    </>
  );
}

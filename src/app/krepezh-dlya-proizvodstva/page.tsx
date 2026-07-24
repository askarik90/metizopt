import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandingCategoryPage from "@/components/LandingCategoryPage";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: "https://krp.kz/krepezh-dlya-proizvodstva" },
  openGraph: { url: "https://krp.kz/krepezh-dlya-proizvodstva" },
  title: "Крепеж для производства оптом в Алматы | KRP",
  description: "Промышленный крепеж оптом для производственных предприятий. Высокопрочные болты, специальный крепеж DIN/ISO. КП за 30 минут.",
};

export default function KrepezhDlyaProizvodstvaPage() {
  return (
    <>
      <Header />
      <LandingCategoryPage
        h1="Крепеж для производства оптом"
        description="Промышленный и специальный крепеж для производственных предприятий. Высокопрочные болты 8.8/10.9/12.9, крепеж по DIN/ISO для импортного оборудования, подбор аналогов."
        category="Крепеж для производства"
        usp={[
          "Высокопрочный крепеж классов 8.8–12.9",
          "DIN и ISO для импортного оборудования",
          "Подбор аналогов с сопоставимыми характеристиками",
          "Крепеж из спецсталей и нержавейки",
          "Работаем с тендерами и крупными заявками",
          "Сертификаты и паспорта качества",
        ]}
      />
      <Footer />
    </>
  );
}

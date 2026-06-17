import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandingCategoryPage from "@/components/LandingCategoryPage";

export const metadata: Metadata = {
  title: "Анкера оптом в Алматы — клиновые, химические, распорные | KRP",
  description: "Анкерный крепеж оптом в Алматы. Клиновые, распорные, химические анкера. Пришлите список — проверим наличие и подготовим КП.",
};

export default function AnkeraOptomPage() {
  return (
    <>
      <Header />
      <LandingCategoryPage
        h1="Анкера оптом в Алматы"
        description="Анкерный крепеж всех видов оптом со склада в Алматы. Клиновые, распорные, химические анкера, цанги, рамные дюбели. Поставки для строительных компаний Казахстана."
        category="Анкера"
        whatsappText="Здравствуйте! Хочу запросить цену и наличие по категории: Анкера."
        usp={[
          "Клиновые, распорные, химические анкера",
          "Цанги, рамные дюбели, забивные анкера",
          "DIN 529, ГОСТ — любые стандарты",
          "Оптовые поставки для строителей",
          "Полный пакет документов",
          "Подбор аналогов если нет в наличии",
        ]}
      />
      <Footer />
    </>
  );
}

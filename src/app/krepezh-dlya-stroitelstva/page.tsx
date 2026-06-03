import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandingCategoryPage from "@/components/LandingCategoryPage";

export const metadata: Metadata = {
  title: "Крепеж для строительства оптом в Алматы | МетизОпт",
  description: "Строительный крепеж оптом в Алматы. Анкера, болты, саморезы, шпильки для строительных компаний Казахстана. Пришлите список — КП за 30 минут.",
};

export default function KrepezhDlyaStroitelstvaPage() {
  return (
    <>
      <Header />
      <LandingCategoryPage
        h1="Крепеж для строительства оптом"
        description="Полный ассортимент строительного крепежа оптом. Анкера, болты, гайки, шайбы, саморезы кровельные, шпильки резьбовые. Поставки для строительных компаний и прорабов Казахстана."
        category="Крепеж для строительства"
        usp={[
          "Анкера для бетона и кирпича",
          "Кровельные саморезы с EPDM прокладкой",
          "Шпильки резьбовые метровые и 2-метровые",
          "Болты фундаментные и строительные",
          "Быстрая отгрузка со склада в Алматы",
          "Доставка по стройплощадкам РК",
        ]}
      />
      <Footer />
    </>
  );
}
